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
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const cronSecret = Deno.env.get("RETRY_FAILED_ORDERS_SECRET");
  if (cronSecret) {
    const provided = req.headers.get("x-cron-secret");
    if (!provided || provided !== cronSecret) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env" }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: failedOrders, error: fetchError } = await adminClient
    .from("orders")
    .select("id")
    .eq("checkout_status", "paid")
    .eq("nyehandel_sync_status", "failed")
    .order("updated_at", { ascending: true })
    .limit(50);

  if (fetchError) {
    return jsonResponse({ error: "failed_to_fetch_failed_orders", details: fetchError.message }, 500);
  }

  const results: Array<{ orderId: string; ok: boolean; status: number; details?: string }> = [];

  for (const order of failedOrders ?? []) {
    const response = await fetch(`${supabaseUrl}/functions/v1/push-order-to-nyehandel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
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
    scanned: failedOrders?.length ?? 0,
    retried: results.length,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
});
