declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore: Deno file import
import { getCorsHeaders } from "../_shared/cors.ts";

function jsonResponse(body: unknown, headers: Record<string, string>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

/**
 * NYE QUIRKS (from CEO's Railway middleware):
 * 1. NEVER include company name in update payload — causes server error
 * 2. Shipping VAT: create treats as VAT-inclusive; update treats as VAT-exclusive
 *    → For shipping changes, cancel + recreate instead of updating
 * 3. Email changes are silently ignored by NYE
 */

const EDITABLE_STATUSES = new Set(["open", "approved", "confirmed", "pending"]);

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req.headers.get("origin"));
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", requestId }, cors, 405);

  // Auth: JWT required — ops only
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

  if (!supabaseUrl || !serviceRoleKey) return jsonResponse({ error: "missing_supabase_env", requestId }, cors, 500);
  if (!nyeToken) return jsonResponse({ error: "nyehandel_not_configured", requestId }, cors, 503);

  // Parse request
  let body: {
    order_id?: string;
    updates?: {
      shipping_address?: { firstname?: string; lastname?: string; address?: string; postcode?: string; city?: string; country?: string };
      warehouse_note?: string;
    };
  };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_request_body", requestId }, cors, 400);
  }

  const { order_id, updates } = body;
  if (!order_id || !updates) {
    return jsonResponse({ error: "order_id_and_updates_required", requestId }, cors, 400);
  }

  // Verify ops role
  const userClient = createClient(supabaseUrl, supabaseKey!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) return jsonResponse({ error: "unauthorized", requestId }, cors, 401);

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "ops" && profile.role !== "admin")) {
    return jsonResponse({ error: "ops_only", message: "Order updates are restricted to ops users.", requestId }, cors, 403);
  }

  // Look up order
  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .select("id, nyehandel_order_id, checkout_status, nyehandel_order_status, shipping_address, update_history")
    .eq("id", order_id)
    .maybeSingle();

  if (orderError || !order) return jsonResponse({ error: "order_not_found", requestId }, cors, 404);

  if (!order.nyehandel_order_id) {
    return jsonResponse({ error: "order_not_synced", message: "Order has no Nyehandel ID — cannot update.", requestId }, cors, 422);
  }

  const status = order.checkout_status ?? order.nyehandel_order_status ?? "unknown";
  if (!EDITABLE_STATUSES.has(status)) {
    return jsonResponse({
      error: "order_not_editable",
      message: `Order status is "${status}" — only open/approved/confirmed orders can be updated.`,
      requestId,
    }, cors, 422);
  }

  // Build NYE update payload — MUST OMIT company name (NYE quirk #1)
  const nyePayload: Record<string, unknown> = {};

  if (updates.shipping_address) {
    nyePayload.shipping_address = {
      firstname: updates.shipping_address.firstname,
      lastname: updates.shipping_address.lastname,
      address: updates.shipping_address.address,
      postcode: updates.shipping_address.postcode,
      city: updates.shipping_address.city,
      country: updates.shipping_address.country,
      // INTENTIONALLY NO company field — NYE returns server error if included
    };
  }

  if (updates.warehouse_note) {
    nyePayload.warehouse_note = updates.warehouse_note;
  }

  if (Object.keys(nyePayload).length === 0) {
    return jsonResponse({ error: "no_updates_provided", requestId }, cors, 400);
  }

  // Call NYE update
  let nyeSuccess = false;
  try {
    const nyeResp = await fetch(`${nyeBaseUrl}/orders/${order.nyehandel_order_id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nyeToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Language": "en",
        "X-identifier": nyeXIdentifier,
      },
      body: JSON.stringify(nyePayload),
    });

    if (nyeResp.ok) {
      nyeSuccess = true;
    } else {
      const errText = await nyeResp.text().catch(() => "");
      console.error(`NYE update failed for order ${order.nyehandel_order_id}: ${nyeResp.status} ${errText}`);

      await adminClient.from("ops_alerts").insert({
        type: "order_update_failed",
        severity: "high",
        title: `NYE order update failed: ${order_id}`,
        details: JSON.stringify({
          nye_order_id: order.nyehandel_order_id,
          nye_status: nyeResp.status,
          nye_error: errText.slice(0, 500),
          payload: nyePayload,
          requestId,
        }),
      }).catch(() => {});

      return jsonResponse({
        error: "nye_update_failed",
        nye_status: nyeResp.status,
        requestId,
      }, cors, 502);
    }
  } catch (err) {
    console.error(`NYE update error:`, err);
    return jsonResponse({ error: "nye_update_error", message: String(err), requestId }, cors, 502);
  }

  // Update local order
  const historyEntry = {
    at: new Date().toISOString(),
    by: user.id,
    changes: updates,
  };
  const updateHistory = Array.isArray(order.update_history) ? order.update_history : [];
  updateHistory.push(historyEntry);

  const localUpdate: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    update_history: updateHistory,
  };

  if (updates.shipping_address) {
    localUpdate.shipping_address = {
      ...(typeof order.shipping_address === "object" ? order.shipping_address : {}),
      ...updates.shipping_address,
    };
  }

  await adminClient.from("orders").update(localUpdate).eq("id", order_id);

  // Audit log in webhook_inbox
  await adminClient.from("webhook_inbox").insert({
    source: "ops_order_update",
    event_type: "order_updated",
    payload: { order_id, updates, by: user.id, requestId },
  }).catch(() => {});

  return jsonResponse({
    ok: true,
    requestId,
    order_id,
    nye_updated: nyeSuccess,
  }, cors);
});
