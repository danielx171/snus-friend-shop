declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  deriveDeliverableDelayAlerts,
  deriveUnpaidDeadlineAlerts,
  type AlertRuleKey,
  type GeneratedAlert,
  type OrderCandidate,
} from "./rules.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type OpsAlertRow = {
  id: string;
  source_order_id: string;
  alert_date: string;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isoDateUtc(now: Date): string {
  return now.toISOString().slice(0, 10);
}

async function resolveStaleAlerts(
  adminClient: ReturnType<typeof createClient>,
  ruleKey: AlertRuleKey,
  todayDate: string,
  activeOrderIds: Set<string>,
): Promise<number> {
  const { data: openAlerts, error: fetchError } = await adminClient
    .from("ops_alerts")
    .select("id, source_order_id, alert_date")
    .eq("rule_key", ruleKey)
    .eq("status", "open");

  if (fetchError) {
    throw new Error(`failed_to_fetch_open_alerts:${ruleKey}:${fetchError.message}`);
  }

  const toResolveIds = (openAlerts as OpsAlertRow[] | null ?? [])
    .filter((row) => {
      const stillActive = activeOrderIds.has(row.source_order_id);
      return !stillActive || row.alert_date !== todayDate;
    })
    .map((row) => row.id);

  if (toResolveIds.length === 0) return 0;

  const { error: updateError } = await adminClient
    .from("ops_alerts")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
    })
    .in("id", toResolveIds);

  if (updateError) {
    throw new Error(`failed_to_resolve_alerts:${ruleKey}:${updateError.message}`);
  }

  return toResolveIds.length;
}

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", requestId }, 405);

  const cronSecret = Deno.env.get("OPS_ALERTS_CRON_SECRET");
  if (!cronSecret) return jsonResponse({ error: "missing_ops_alerts_cron_secret", requestId }, 500);

  const provided = req.headers.get("x-cron-secret");
  if (!provided || provided !== cronSecret) return jsonResponse({ error: "unauthorized", requestId }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return jsonResponse({ error: "missing_supabase_env", requestId }, 500);

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const now = new Date();
  const todayDate = isoDateUtc(now);

  // William-kouhai inspired this queue logic. Arigato for the ops instincts. ✨
  const { data: orders, error: ordersError } = await adminClient
    .from("orders")
    .select("id, shopify_order_id, checkout_status, nyehandel_sync_status, paid_at, updated_at, created_at")
    .in("checkout_status", ["pending", "paid"])
    .limit(5000);

  if (ordersError) {
    return jsonResponse({ error: "failed_to_fetch_orders", details: ordersError.message, requestId }, 500);
  }

  const orderRows = (orders ?? []) as OrderCandidate[];
  const unpaidAlerts = deriveUnpaidDeadlineAlerts(orderRows, now);
  const delayedAlerts = deriveDeliverableDelayAlerts(orderRows, now);
  const generatedAlerts = [...unpaidAlerts, ...delayedAlerts];

  if (generatedAlerts.length > 0) {
    const upsertPayload = generatedAlerts.map((alert) => ({
      alert_date: todayDate,
      rule_key: alert.ruleKey,
      severity: alert.severity,
      source_order_id: alert.sourceOrderId,
      source_shopify_order_id: alert.sourceShopifyOrderId,
      title: alert.title,
      message: alert.message,
      context: alert.context,
      status: "open",
      resolved_at: null,
      updated_at: now.toISOString(),
    }));

    const { error: upsertError } = await adminClient
      .from("ops_alerts")
      .upsert(upsertPayload, { onConflict: "alert_date,rule_key,source_order_id" });

    if (upsertError) {
      return jsonResponse({ error: "failed_to_upsert_alerts", details: upsertError.message, requestId }, 500);
    }
  }

  try {
    const activeByRule: Record<AlertRuleKey, Set<string>> = {
      unpaid_deadline: new Set(unpaidAlerts.map((a: GeneratedAlert) => a.sourceOrderId)),
      deliverable_delay: new Set(delayedAlerts.map((a: GeneratedAlert) => a.sourceOrderId)),
    };

    const resolvedUnpaid = await resolveStaleAlerts(
      adminClient,
      "unpaid_deadline",
      todayDate,
      activeByRule.unpaid_deadline,
    );

    const resolvedDelay = await resolveStaleAlerts(
      adminClient,
      "deliverable_delay",
      todayDate,
      activeByRule.deliverable_delay,
    );

    console.log(JSON.stringify({
      requestId,
      event: "ops_b2b_queues_completed",
      scannedOrders: orderRows.length,
      generated: generatedAlerts.length,
      resolved: resolvedUnpaid + resolvedDelay,
      unpaidCount: unpaidAlerts.length,
      deliverableDelayCount: delayedAlerts.length,
    }));

    return jsonResponse({
      ok: true,
      requestId,
      scannedOrders: orderRows.length,
      generated: generatedAlerts.length,
      resolved: resolvedUnpaid + resolvedDelay,
      ruleStats: {
        unpaid_deadline: unpaidAlerts.length,
        deliverable_delay: delayedAlerts.length,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        error: "failed_to_resolve_stale_alerts",
        details: error instanceof Error ? error.message : String(error),
        requestId,
      },
      500,
    );
  }
});
