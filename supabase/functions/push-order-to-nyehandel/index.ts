declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-internal-function-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type PushRequest = {
  orderId?: string;
  shopifyOrderId?: string;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405);
  }

  const internalFunctionsSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
  if (!internalFunctionsSecret) {
    return jsonResponse({ error: "missing_internal_functions_secret", requestId }, 500);
  }

  const providedInternalSecret = req.headers.get("x-internal-function-secret");
  if (!providedInternalSecret || providedInternalSecret !== internalFunctionsSecret) {
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }

  const nyehandelToken = Deno.env.get("NYEHANDEL_API_TOKEN");
  const nyehandelBaseUrl = Deno.env.get("NYEHANDEL_API_URL") || "https://api.nyehandel.se/v1";
  if (!nyehandelToken) {
    return jsonResponse({ error: "missing_nyehandel_token", requestId }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  let body: PushRequest;
  try {
    body = (await req.json()) as PushRequest;
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  if (!body.orderId && !body.shopifyOrderId) {
    return jsonResponse({ error: "orderId_or_shopifyOrderId_required", requestId }, 400);
  }

  let query = adminClient
    .from("orders")
    .select("id, shopify_order_id, customer_email, total_price, currency, line_items_snapshot, shipping_address, checkout_status, nyehandel_sync_status")
    .limit(1);

  if (body.orderId) {
    query = query.eq("id", body.orderId);
  } else {
    query = query.eq("shopify_order_id", body.shopifyOrderId as string);
  }

  const { data: order, error: orderError } = await query.maybeSingle();
  if (orderError || !order) {
    return jsonResponse({ error: "order_not_found", details: orderError?.message, requestId }, 404);
  }

  if (order.nyehandel_sync_status === "synced") {
    return jsonResponse({ ok: true, idempotent: true, orderId: order.id, requestId });
  }

  if (order.checkout_status !== "paid") {
    return jsonResponse({ error: "order_not_paid", orderId: order.id, requestId }, 409);
  }

  const payload = {
    external_order_id: order.shopify_order_id ?? order.id,
    customer: {
      email: order.customer_email,
    },
    totals: {
      amount: order.total_price,
      currency: order.currency,
    },
    shipping_address: order.shipping_address ?? {},
    line_items: Array.isArray(order.line_items_snapshot) ? order.line_items_snapshot : [],
  };

  const maxAttempts = 3;
  let lastError = "";
  let nyehandelOrderId: string | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${nyehandelBaseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${nyehandelToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        console.log(JSON.stringify({ requestId, event: "nyehandel_push_response", orderId: order.id, status: response.status }));
        nyehandelOrderId = String(result?.id ?? result?.order_id ?? "").trim() || null;
        break;
      }

      const text = await response.text();
      console.error(JSON.stringify({ requestId, event: "nyehandel_push_non_200", orderId: order.id, status: response.status }));
      lastError = `attempt_${attempt}_${response.status}:${text}`;
    } catch (error) {
      lastError = `attempt_${attempt}_network_error:${String(error)}`;
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 300));
  }

  if (!nyehandelOrderId && lastError) {
    await adminClient
      .from("orders")
      .update({
        nyehandel_sync_status: "failed",
        last_sync_error: lastError,
      })
      .eq("id", order.id);

    return jsonResponse({ error: "nyehandel_push_failed", orderId: order.id, details: lastError, requestId }, 502);
  }

  await adminClient
    .from("orders")
    .update({
      nyehandel_sync_status: "synced",
      nyehandel_order_id: nyehandelOrderId,
      last_sync_error: null,
    })
    .eq("id", order.id);

  return jsonResponse({
    ok: true,
    orderId: order.id,
    nyehandelOrderId,
    requestId,
  });
});
