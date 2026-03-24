declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore: Deno file import
import { getCorsHeaders } from "../_shared/cors.ts";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Validated shipping methods from NordicPouch Nyehandel admin */
const VALID_SHIPPING_METHODS = [
  "UPS Standard (J229F1)",
  "UPS Express Saver",
  "DHL Economy (Non EU)",
  "DHL Express (Non EU)",
  "DHL Express EU",
  "DHL Economy EU",
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CheckoutItem {
  sku: string;
  quantity: number;
  /** Display fields — persisted in line_items_snapshot for order confirmation UI */
  product_name?: string;
  pack_label?: string;
  unit_price?: number;
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
  idempotency_key?: string;
  /** Client-computed display total — persisted for order confirmation UI */
  display_total?: number;
  /** Currency code for the display total */
  display_currency?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let _corsHeaders: Record<string, string> = getCorsHeaders();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ..._corsHeaders, "Content-Type": "application/json" },
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
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(cust.email).trim()) ||
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

  // shipping_method — validated against known Nyehandel shipping methods
  if (
    typeof b.shipping_method !== "string" ||
    !VALID_SHIPPING_METHODS.includes(b.shipping_method)
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

  // idempotency_key — optional, client-generated UUID to prevent duplicate orders
  const idempotencyKey =
    typeof b.idempotency_key === "string" && b.idempotency_key.trim()
      ? b.idempotency_key.trim()
      : undefined;

  const displayTotal = typeof b.display_total === "number" ? b.display_total : undefined;
  const displayCurrency = typeof b.display_currency === "string" ? b.display_currency : undefined;

  return {
    ok: true,
    data: {
      items: b.items as CheckoutItem[],
      customer: cust as unknown as CheckoutCustomer,
      billing_address: addr as unknown as CheckoutAddress,
      shipping_method: b.shipping_method as string,
      idempotency_key: idempotencyKey,
      display_total: displayTotal,
      display_currency: displayCurrency,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  _corsHeaders = getCorsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: _corsHeaders });
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
  const { items, customer, billing_address, shipping_method, idempotency_key, display_total, display_currency } = validation.data;

  /* ---------- resolve optional user_id (for SnusPoints) ---------- */

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  let userId: string | null = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const { data: { user } } = await adminClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (user?.id) userId = user.id;
  }

  /* ---------- idempotency check ---------- */

  if (idempotency_key) {
    const { data: existing } = await adminClient
      .from("orders")
      .select("id, nyehandel_order_id, nyehandel_prefix")
      .eq("idempotency_key", idempotency_key)
      .maybeSingle();

    if (existing) {
      return jsonResponse({
        ok: true,
        idempotent: true,
        orderId: existing.id,
        nyehandelOrderId: existing.nyehandel_order_id,
        prefix: existing.nyehandel_prefix,
        requestId,
      });
    }
  }

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
      name: "NFC Group Payment",
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
    // Log full upstream error server-side for debugging — never expose to client
    console.error(
      JSON.stringify({
        requestId,
        event: "nyehandel_checkout_rejected",
        status: nyehandelResponse.status,
        upstreamBody: errText,
      }),
    );
    return jsonResponse(
      {
        error: "nyehandel_order_creation_failed",
        status: nyehandelResponse.status,
        requestId,
        // TEMPORARY: expose upstream error for debugging — remove before go-live
        upstream_error: errText,
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

  const orderInsert: Record<string, unknown> = {
    nyehandel_order_id: nyehandelOrderId,
    nyehandel_prefix: nyehandelPrefix,
    checkout_status: "pending",
    customer_email: customer.email,
    currency: display_currency ?? "EUR",
    total_price: null, // calculated server-side after Nyehandel confirms — never trust client-supplied price
    line_items_snapshot: items, // includes display fields (product_name, pack_label, unit_price)
    customer_metadata: {
      firstname: customer.firstname,
      lastname: customer.lastname,
      shipping_method,
    },
    shipping_address: {
      ...billing_address,
      firstname: customer.firstname,
      lastname: customer.lastname,
    },
    nyehandel_sync_status: "synced",
  };

  if (userId) {
    orderInsert.user_id = userId;
  }

  if (idempotency_key) {
    orderInsert.idempotency_key = idempotency_key;
  }

  const { data: insertedOrder, error: insertError } = await adminClient
    .from("orders")
    .insert(orderInsert)
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

    // Audit trail: Nyehandel order exists but local insert failed — ops can reconcile
    await adminClient.from("webhook_inbox").insert({
      provider: "nyehandel",
      topic: "orphan_order",
      status: "received",
      payload: {
        nyehandelOrderId,
        nyehandelPrefix,
        customerEmail: customer.email,
        insertError: insertError?.message ?? "unknown",
        requestId,
      },
      received_at: new Date().toISOString(),
    }).catch(() => {
      // Best-effort — the console.error above already logs the critical info
    });

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
