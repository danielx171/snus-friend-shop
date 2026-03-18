declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const VALID_SHIPPING_METHODS = [
  "UPS Standard EU",
  "UPS Express Saver EU",
  "DHL Economy Select (Non Eu)",
  "DHL Express",
  "UPS Express Saver",
] as const;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CheckoutItem {
  sku: string;
  quantity: number;
}

interface CheckoutCustomer {
  email: string;
  firstname: string;
  lastname: string;
}

interface CheckoutAddress {
  address: string;
  postcode: string;
  city: string;
  country: string;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  billing_address: CheckoutAddress;
  shipping_method: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function validatePayload(
  body: unknown,
  requestId: string,
): { ok: true; data: CheckoutRequest } | { ok: false; response: Response } {
  const b = body as Record<string, unknown>;

  // items
  if (!Array.isArray(b?.items) || b.items.length === 0) {
    return {
      ok: false,
      response: jsonResponse(
        { error: "items_required", requestId },
        400,
      ),
    };
  }
  for (const item of b.items as Record<string, unknown>[]) {
    if (typeof item.sku !== "string" || !item.sku.trim()) {
      return {
        ok: false,
        response: jsonResponse(
          { error: "item_sku_required", requestId },
          400,
        ),
      };
    }
    if (typeof item.quantity !== "number" || item.quantity < 1) {
      return {
        ok: false,
        response: jsonResponse(
          { error: "item_quantity_invalid", requestId },
          400,
        ),
      };
    }
  }

  // customer
  const cust = b.customer as Record<string, unknown> | undefined;
  if (
    !cust ||
    typeof cust.email !== "string" ||
    !cust.email.includes("@") ||
    typeof cust.firstname !== "string" ||
    !cust.firstname.trim() ||
    typeof cust.lastname !== "string" ||
    !cust.lastname.trim()
  ) {
    return {
      ok: false,
      response: jsonResponse(
        { error: "customer_fields_required", message: "email, firstname, lastname are required", requestId },
        400,
      ),
    };
  }

  // billing_address
  const addr = b.billing_address as Record<string, unknown> | undefined;
  if (
    !addr ||
    typeof addr.address !== "string" ||
    !addr.address.trim() ||
    typeof addr.postcode !== "string" ||
    !addr.postcode.trim() ||
    typeof addr.city !== "string" ||
    !addr.city.trim() ||
    typeof addr.country !== "string" ||
    !addr.country.trim()
  ) {
    return {
      ok: false,
      response: jsonResponse(
        {
          error: "billing_address_fields_required",
          message: "address, postcode, city, country are required",
          requestId,
        },
        400,
      ),
    };
  }

  // shipping_method
  if (
    typeof b.shipping_method !== "string" ||
    !VALID_SHIPPING_METHODS.includes(b.shipping_method as typeof VALID_SHIPPING_METHODS[number])
  ) {
    return {
      ok: false,
      response: jsonResponse(
        {
          error: "invalid_shipping_method",
          message: `Must be one of: ${VALID_SHIPPING_METHODS.join(", ")}`,
          requestId,
        },
        400,
      ),
    };
  }

  return {
    ok: true,
    data: {
      items: b.items as CheckoutItem[],
      customer: cust as unknown as CheckoutCustomer,
      billing_address: addr as unknown as CheckoutAddress,
      shipping_method: b.shipping_method as string,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405);
  }

  /* ---------- env vars ---------- */

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const nyehandelToken = Deno.env.get("NYEHANDEL_API_TOKEN");
  const nyehandelXIdentifier = Deno.env.get("NYEHANDEL_X_IDENTIFIER") ?? "";
  const nyehandelBaseUrl =
    Deno.env.get("NYEHANDEL_API_URL") || "https://api.nyehandel.se/api/v2";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }
  if (!nyehandelToken) {
    return jsonResponse({ error: "missing_nyehandel_token", requestId }, 500);
  }

  /* ---------- parse + validate body ---------- */

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  const validation = validatePayload(rawBody, requestId);
  if (!validation.ok) return validation.response;
  const { items, customer, billing_address, shipping_method } = validation.data;

  /* ---------- build Nyehandel POST /orders/simple payload ---------- */

  const deliveryCallbackUrl = `${supabaseUrl}/functions/v1/nyehandel-delivery-callback`;

  const nyehandelPayload = {
    prefix: "NB",
    currency_iso: "EUR",
    locale: "en-gb",
    delivery_callback_url: deliveryCallbackUrl,
    customer: {
      type: "person",
      email: customer.email,
    },
    billing_address: {
      firstname: customer.firstname,
      lastname: customer.lastname,
      address: billing_address.address,
      postcode: billing_address.postcode,
      city: billing_address.city,
      country: billing_address.country,
    },
    shipping: {
      name: shipping_method,
    },
    payment: {
      name: "Nets Easy Checkout",
    },
    items: items.map((i) => ({
      type: "product" as const,
      sku: i.sku,
      quantity: i.quantity,
    })),
  };

  /* ---------- call Nyehandel ---------- */

  console.log(
    JSON.stringify({
      requestId,
      event: "nyehandel_checkout_start",
      itemCount: items.length,
      shippingMethod: shipping_method,
    }),
  );

  let nyehandelResponse: Response;
  try {
    nyehandelResponse = await fetch(`${nyehandelBaseUrl}/orders/simple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-identifier": nyehandelXIdentifier,
        Authorization: `Bearer ${nyehandelToken}`,
      },
      body: JSON.stringify(nyehandelPayload),
    });
  } catch (networkError) {
    console.error(
      JSON.stringify({ requestId, event: "nyehandel_network_error", error: String(networkError) }),
    );
    return jsonResponse(
      { error: "nyehandel_network_error", requestId },
      502,
    );
  }

  if (!nyehandelResponse.ok) {
    const errText = await nyehandelResponse.text().catch(() => "");
    console.error(
      JSON.stringify({
        requestId,
        event: "nyehandel_checkout_rejected",
        status: nyehandelResponse.status,
      }),
    );
    return jsonResponse(
      {
        error: "nyehandel_order_creation_failed",
        status: nyehandelResponse.status,
        details: errText,
        requestId,
      },
      502,
    );
  }

  /* ---------- parse Nyehandel response ---------- */

  let nyehandelData: { data?: { id?: number | string; prefix?: string } };
  try {
    nyehandelData = await nyehandelResponse.json();
  } catch {
    return jsonResponse(
      { error: "nyehandel_invalid_response", requestId },
      502,
    );
  }

  const nyehandelOrderId = nyehandelData?.data?.id != null
    ? String(nyehandelData.data.id)
    : null;
  const nyehandelPrefix = nyehandelData?.data?.prefix ?? null;

  if (!nyehandelOrderId) {
    console.error(
      JSON.stringify({ requestId, event: "nyehandel_missing_order_id" }),
    );
    return jsonResponse(
      { error: "nyehandel_missing_order_id", requestId },
      502,
    );
  }

  console.log(
    JSON.stringify({
      requestId,
      event: "nyehandel_checkout_success",
      nyehandelOrderId,
      nyehandelPrefix,
    }),
  );

  /* ---------- persist order in Supabase ---------- */

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: insertedOrder, error: insertError } = await adminClient
    .from("orders")
    .insert({
      nyehandel_order_id: nyehandelOrderId,
      nyehandel_prefix: nyehandelPrefix,
      checkout_status: "pending",
      customer_email: customer.email,
      currency: "EUR",
      total_price: 0, // Nyehandel owns pricing — no price from our side
      line_items_snapshot: items,
      customer_metadata: {
        firstname: customer.firstname,
        lastname: customer.lastname,
      },
      shipping_address: {
        ...billing_address,
        firstname: customer.firstname,
        lastname: customer.lastname,
      },
      nyehandel_sync_status: "synced",
    })
    .select("id")
    .single();

  if (insertError || !insertedOrder) {
    console.error(
      JSON.stringify({
        requestId,
        event: "order_insert_failed",
        error: insertError?.message,
        nyehandelOrderId,
      }),
    );
    // The Nyehandel order was already created — log for manual reconciliation
    return jsonResponse(
      {
        error: "order_persistence_failed",
        nyehandelOrderId,
        requestId,
      },
      500,
    );
  }

  /* ---------- success ---------- */

  return jsonResponse({
    ok: true,
    orderId: insertedOrder.id,
    nyehandelOrderId,
    prefix: nyehandelPrefix,
    requestId,
  });
});
