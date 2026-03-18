declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PushRequest = {
  orderId: string;
};

type LineItem = {
  sku?: string;
  quantity?: number;
  [key: string]: unknown;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      // Internal function — lock CORS to Supabase URL only
      "Access-Control-Allow-Origin": Deno.env.get("SUPABASE_URL") ?? "",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-internal-function-secret",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": Deno.env.get("SUPABASE_URL") ?? "",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type, x-internal-function-secret",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405);
  }

  /* ---------- auth: internal function secret ---------- */
  const internalFunctionsSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
  if (!internalFunctionsSecret) {
    return jsonResponse({ error: "missing_internal_functions_secret", requestId }, 500);
  }
  const providedSecret = req.headers.get("x-internal-function-secret");
  if (!providedSecret || providedSecret !== internalFunctionsSecret) {
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  /* ---------- env ---------- */
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const nyehandelToken = Deno.env.get("NYEHANDEL_API_TOKEN");
  const nyehandelXIdentifier = Deno.env.get("NYEHANDEL_X_IDENTIFIER") ?? "";
  const nyehandelBaseUrl = Deno.env.get("NYEHANDEL_API_URL") || "https://api.nyehandel.se/api/v2";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }
  if (!nyehandelToken) {
    return jsonResponse({ error: "missing_nyehandel_token", requestId }, 500);
  }

  /* ---------- parse body ---------- */
  let body: PushRequest;
  try {
    body = (await req.json()) as PushRequest;
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  if (!body.orderId) {
    return jsonResponse({ error: "orderId_required", requestId }, 400);
  }

  /* ---------- fetch order ---------- */
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .select(
      "id, customer_email, total_price, currency, line_items_snapshot, shipping_address, customer_metadata, checkout_status, nyehandel_sync_status",
    )
    .eq("id", body.orderId)
    .maybeSingle();

  if (orderError || !order) {
    return jsonResponse({ error: "order_not_found", details: orderError?.message, requestId }, 404);
  }

  /* ---------- idempotency guard ---------- */
  if (order.nyehandel_sync_status === "synced") {
    return jsonResponse({ ok: true, idempotent: true, orderId: order.id, requestId });
  }

  /* ---------- status guard ---------- */
  if (order.checkout_status !== "confirmed") {
    return jsonResponse(
      { error: "order_not_confirmed", orderId: order.id, checkout_status: order.checkout_status, requestId },
      409,
    );
  }

  /* ---------- build Nyehandel payload ---------- */
  const meta = (order.customer_metadata ?? {}) as Record<string, unknown>;
  const addr = (order.shipping_address ?? {}) as Record<string, unknown>;
  const deliveryCallbackUrl = `${supabaseUrl}/functions/v1/nyehandel-delivery-callback`;

  const items = Array.isArray(order.line_items_snapshot)
    ? (order.line_items_snapshot as LineItem[])
        .filter((i) => i.sku)
        .map((i) => ({
          type: "product" as const,
          sku: String(i.sku),
          quantity: typeof i.quantity === "number" ? i.quantity : 1,
        }))
    : [];

  const nyehandelPayload = {
    prefix: "NB",
    currency_iso: "EUR",
    locale: "en-gb",
    delivery_callback_url: deliveryCallbackUrl,
    customer: {
      type: "person",
      email: order.customer_email ?? "",
    },
    billing_address: {
      firstname: String(meta.firstname ?? ""),
      lastname: String(meta.lastname ?? ""),
      address: String(addr.address ?? ""),
      postcode: String(addr.postcode ?? ""),
      city: String(addr.city ?? ""),
      country: String(addr.country ?? "GB"),
    },
    shipping: {
      name: String(meta.shipping_method ?? "UPS Standard EU"),
    },
    payment: {
      name: "Nets Easy Checkout",
    },
    items,
  };

  /* ---------- push to Nyehandel with retries ---------- */
  const maxAttempts = 3;
  let lastError = "";
  let nyehandelOrderId: string | null = null;
  let nyehandelPrefix: string | null = null;

  console.log(JSON.stringify({ requestId, event: "nyehandel_push_start", orderId: order.id, itemCount: items.length }));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${nyehandelBaseUrl}/orders/simple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-identifier": nyehandelXIdentifier,
          "Authorization": `Bearer ${nyehandelToken}`,
        },
        body: JSON.stringify(nyehandelPayload),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({})) as { data?: { id?: unknown; prefix?: unknown } };
        nyehandelOrderId = result?.data?.id != null ? String(result.data.id).trim() || null : null;
        nyehandelPrefix = typeof result?.data?.prefix === "string" ? result.data.prefix : null;

        console.log(JSON.stringify({
          requestId,
          event: "nyehandel_push_response",
          orderId: order.id,
          status: response.status,
          nyehandelOrderId,
          nyehandelPrefix,
        }));

        if (!nyehandelOrderId) {
          lastError = `attempt_${attempt}_${response.status}:missing_order_id_in_response`;
        }
        break;
      }

      const text = await response.text();
      console.error(JSON.stringify({ requestId, event: "nyehandel_push_non_200", orderId: order.id, status: response.status }));
      lastError = `attempt_${attempt}_${response.status}:${text.slice(0, 300)}`;
    } catch (error) {
      lastError = `attempt_${attempt}_network_error:${String(error)}`;
      console.error(JSON.stringify({ requestId, event: "nyehandel_push_network_error", attempt, error: String(error) }));
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }

  /* ---------- handle failure ---------- */
  if (!nyehandelOrderId) {
    await adminClient
      .from("orders")
      .update({ nyehandel_sync_status: "failed", last_sync_error: lastError })
      .eq("id", order.id);

    return jsonResponse(
      { error: "nyehandel_push_failed", orderId: order.id, details: lastError, requestId },
      502,
    );
  }

  /* ---------- update order on success ---------- */
  await adminClient
    .from("orders")
    .update({
      nyehandel_sync_status: "synced",
      nyehandel_order_id: nyehandelOrderId,
      nyehandel_prefix: nyehandelPrefix,
      checkout_status: "confirmed",
      last_sync_error: null,
    })
    .eq("id", order.id);

  console.log(JSON.stringify({ requestId, event: "nyehandel_push_success", orderId: order.id, nyehandelOrderId }));

  return jsonResponse({ ok: true, orderId: order.id, nyehandelOrderId, nyehandelPrefix, requestId });
});
