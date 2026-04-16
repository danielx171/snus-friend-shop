declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-expect-error — Deno types: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-expect-error — Deno types: Deno file import
import { getCorsHeaders } from "../_shared/cors.ts";

function jsonResponse(body: unknown, headers: Record<string, string>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

/** Statuses that allow cancellation — order must not be shipped or already canceled */
const CANCELLABLE_STATUSES = new Set(["pending", "confirmed", "open", "approved"]);

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req.headers.get("origin"));
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", requestId }, cors, 405);

  // Auth: JWT from logged-in user
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return jsonResponse({ error: "missing_auth", requestId }, cors, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const nyeToken = Deno.env.get("NYEHANDEL_API_TOKEN");
  const nyeBaseUrl =
    Deno.env.get("NYEHANDEL_API_BASE_URL") ||
    Deno.env.get("NYEHANDEL_API_URL") ||
    "https://api.nyehandel.se/api/v1";
  const nyeXIdentifier = Deno.env.get("NYEHANDEL_X_IDENTIFIER") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, cors, 500);
  }
  if (!nyeToken) {
    return jsonResponse({ error: "nyehandel_not_configured", requestId }, cors, 503);
  }

  // Parse request body
  let body: { order_id?: string; reason?: string; refund_payment?: boolean };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_request_body", requestId }, cors, 400);
  }

  const { order_id, reason, refund_payment = true } = body;
  if (!order_id) {
    return jsonResponse({ error: "order_id_required", requestId }, cors, 400);
  }

  // Create user-scoped client to verify identity
  const userClient = createClient(supabaseUrl, supabaseKey!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: "unauthorized", requestId }, cors, 401);
  }

  // Use admin client for DB operations
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Look up order
  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .select("id, user_id, checkout_status, nyehandel_order_id, nyehandel_order_status, canceled_at")
    .eq("id", order_id)
    .maybeSingle();

  if (orderError || !order) {
    return jsonResponse({ error: "order_not_found", requestId }, cors, 404);
  }

  // Check: is this the customer's order? (or ops/admin user via user_roles)
  const { data: roleData } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .in("role", ["admin", "ops"])
    .maybeSingle();

  const isOps = !!roleData;
  if (order.user_id !== user.id && !isOps) {
    return jsonResponse({ error: "forbidden", requestId }, cors, 403);
  }

  // Check: already canceled?
  if (order.canceled_at) {
    return jsonResponse({ error: "already_canceled", requestId }, cors, 409);
  }

  // Check: is order in a cancellable status?
  const status = order.checkout_status ?? order.nyehandel_order_status ?? "unknown";
  if (!CANCELLABLE_STATUSES.has(status)) {
    return jsonResponse({
      error: "order_not_cancellable",
      message: `Order status is "${status}" — only pending/confirmed orders can be canceled. If the order has shipped, please contact support.`,
      requestId,
    }, cors, 422);
  }

  // Cancel on Nyehandel (if we have a NYE order ID)
  let nyeCancelSuccess = false;
  if (order.nyehandel_order_id) {
    try {
      const cancelUrl = `${nyeBaseUrl}/orders/${order.nyehandel_order_id}/cancel?refund_payment=${refund_payment}`;
      const nyeResp = await fetch(cancelUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${nyeToken}`,
          Accept: "application/json",
          "X-Language": "en",
          "X-identifier": nyeXIdentifier,
        },
      });

      if (nyeResp.ok) {
        nyeCancelSuccess = true;
      } else {
        const errText = await nyeResp.text().catch(() => "");
        console.error(`NYE cancel failed for order ${order.nyehandel_order_id}: ${nyeResp.status} ${errText}`);

        // Create ops alert — NYE cancellation failed
        await adminClient.from("ops_alerts").insert({
          type: "order_cancel_failed",
          severity: "high",
          title: `NYE cancellation failed: order ${order_id}`,
          details: JSON.stringify({
            nye_order_id: order.nyehandel_order_id,
            nye_status: nyeResp.status,
            nye_error: errText.slice(0, 500),
            requestId,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error(`NYE cancel error for order ${order.nyehandel_order_id}:`, err);
      await adminClient.from("ops_alerts").insert({
        type: "order_cancel_failed",
        severity: "high",
        title: `NYE cancellation error: order ${order_id}`,
        details: JSON.stringify({ error: String(err), requestId }),
      }).catch(() => {});
    }
  } else {
    // No NYE order ID — order was never synced to NYE, just cancel locally
    nyeCancelSuccess = true;
  }

  // Update local order regardless (even if NYE cancel failed — ops will handle)
  const { error: updateError } = await adminClient
    .from("orders")
    .update({
      checkout_status: "cancelled",
      canceled_at: new Date().toISOString(),
      cancel_reason: reason ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order_id);

  if (updateError) {
    console.error(`Failed to update order ${order_id} after cancellation:`, updateError);
    return jsonResponse({
      error: "db_update_failed",
      message: "Cancellation may have succeeded on Nyehandel but local update failed. Please contact support.",
      requestId,
    }, cors, 500);
  }

  return jsonResponse({
    ok: true,
    requestId,
    order_id,
    nye_canceled: nyeCancelSuccess,
    refund_payment,
  }, cors);
});
