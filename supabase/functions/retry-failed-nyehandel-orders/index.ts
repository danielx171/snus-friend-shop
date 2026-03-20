declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", requestId }, 405);

  const cronSecret = Deno.env.get("RETRY_FAILED_ORDERS_SECRET");
  if (!cronSecret) {
    return jsonResponse({ error: "missing_retry_failed_orders_secret", requestId }, 500);
  }

  const provided = req.headers.get("x-cron-secret");
  if (!provided || provided !== cronSecret) {
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const internalFunctionsSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }

  if (!internalFunctionsSecret) {
    return jsonResponse({ error: "missing_internal_functions_secret", requestId }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: failedOrders, error: fetchError } = await adminClient
    .from("orders")
    .select("id")
    .eq("checkout_status", "confirmed")
    .eq("nyehandel_sync_status", "failed")
    .order("updated_at", { ascending: true })
    .limit(50);

  if (fetchError) {
    return jsonResponse({ error: "failed_to_fetch_failed_orders", details: fetchError.message, requestId }, 500);
  }

  const results: Array<{ orderId: string; ok: boolean; status: number; details?: string }> = [];

  for (const order of failedOrders ?? []) {
    const response = await fetch(`${supabaseUrl}/functions/v1/push-order-to-nyehandel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "x-internal-function-secret": internalFunctionsSecret,
        "x-request-id": requestId,
      },
      body: JSON.stringify({ orderId: order.id }),
    });

    if (response.ok) {
      results.push({ orderId: order.id, ok: true, status: response.status });
    } else {
      results.push({
        orderId: order.id,
        ok: false,
        status: response.status,
        details: await response.text(),
      });
    }
  }

  return jsonResponse({
    requestId,
    scanned: failedOrders?.length ?? 0,
    retried: results.length,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
});
