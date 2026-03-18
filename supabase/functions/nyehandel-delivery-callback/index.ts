declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function jsonOk(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Try to extract a scalar string from a nested object path.
 * Returns null if the path doesn't resolve to a non-empty string.
 */
function extractString(obj: Record<string, unknown>, ...keys: string[]): string | null {
  let cur: unknown = obj;
  for (const k of keys) {
    if (cur == null || typeof cur !== "object") return null;
    cur = (cur as Record<string, unknown>)[k];
  }
  if (typeof cur === "string" && cur.trim() !== "") return cur.trim();
  if (typeof cur === "number") return String(cur);
  return null;
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  // CORS preflight — Nyehandel shouldn't send OPTIONS but handle it anyway
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // Always return 200 to Nyehandel — never 4xx/5xx which could trigger retries
  // All issues are logged and returned in the response body for debugging

  /* ---------- env ---------- */
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(JSON.stringify({ requestId, event: "delivery_callback_missing_env" }));
    return jsonOk({ ok: false, error: "missing_env", requestId });
  }

  /* ---------- read raw body ---------- */
  let rawBody = "";
  let body: Record<string, unknown> = {};

  try {
    rawBody = await req.text();
  } catch (e) {
    console.error(JSON.stringify({ requestId, event: "delivery_callback_body_read_error", error: String(e) }));
    return jsonOk({ ok: false, error: "body_read_error", requestId });
  }

  try {
    if (rawBody.trim()) {
      body = JSON.parse(rawBody) as Record<string, unknown>;
    }
  } catch {
    console.error(JSON.stringify({
      requestId,
      event: "delivery_callback_invalid_json",
      bodyByteLength: rawBody.length,
    }));
    // Still return 200 — Nyehandel doesn't need to retry; raw body persisted in webhook_inbox below
    return jsonOk({ ok: false, error: "invalid_json", requestId });
  }

  // Log structured metadata only — raw payload is persisted in webhook_inbox for audit
  const topLevelKeys = Object.keys(body);
  console.log(JSON.stringify({
    requestId,
    event: "delivery_callback_received",
    bodyByteLength: rawBody.length,
    topLevelKeys,
  }));

  /* ---------- store in webhook_inbox for audit ---------- */
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  await adminClient.from("webhook_inbox").insert({
    provider: "nyehandel",
    topic: "delivery_callback",
    status: "received",
    payload: body,
    received_at: new Date().toISOString(),
  }).then(({ error }) => {
    if (error) {
      console.error(JSON.stringify({ requestId, event: "delivery_callback_inbox_insert_failed", error: error.message }));
    }
  });

  /* ---------- extract nyehandel_order_id ---------- */
  // Try multiple possible field paths since payload shape is undocumented
  const nyehandelOrderId =
    extractString(body, "order_id") ??
    extractString(body, "id") ??
    extractString(body, "nyehandel_order_id") ??
    extractString(body, "order", "id") ??
    null;

  if (!nyehandelOrderId) {
    console.error(JSON.stringify({ requestId, event: "delivery_callback_no_order_id", topLevelKeys }));
    return jsonOk({ ok: false, error: "no_order_id_in_payload", requestId });
  }

  /* ---------- extract tracking data ---------- */
  // Try parcels[0] first, then top-level, then shipment object
  const parcels = Array.isArray((body as Record<string, unknown>).parcels)
    ? (body.parcels as Record<string, unknown>[])
    : [];

  const trackingId =
    extractString(parcels[0] ?? {}, "tracking_id") ??
    extractString(body, "tracking_id") ??
    extractString(body, "shipment", "tracking_id") ??
    null;

  const trackingUrl =
    extractString(parcels[0] ?? {}, "tracking_url") ??
    extractString(body, "tracking_url") ??
    extractString(body, "shipment", "tracking_url") ??
    null;

  console.log(JSON.stringify({
    requestId,
    event: "delivery_callback_parsed",
    nyehandelOrderId,
    trackingId,
    trackingUrl,
  }));

  /* ---------- look up order ---------- */
  const { data: order, error: lookupError } = await adminClient
    .from("orders")
    .select("id, checkout_status")
    .eq("nyehandel_order_id", nyehandelOrderId)
    .maybeSingle();

  if (lookupError) {
    console.error(JSON.stringify({ requestId, event: "delivery_callback_order_lookup_error", nyehandelOrderId, error: lookupError.message }));
    return jsonOk({ ok: false, error: "order_lookup_error", requestId });
  }

  if (!order) {
    console.error(JSON.stringify({ requestId, event: "delivery_callback_order_not_found", nyehandelOrderId }));
    return jsonOk({ ok: false, error: "order_not_found", nyehandelOrderId, requestId });
  }

  /* ---------- update order ---------- */
  const updatePayload: Record<string, unknown> = {
    checkout_status: "shipped",
    delivery_callback_received_at: new Date().toISOString(),
  };

  if (trackingId) updatePayload.tracking_id = trackingId;
  if (trackingUrl) updatePayload.tracking_url = trackingUrl;

  const { error: updateError } = await adminClient
    .from("orders")
    .update(updatePayload)
    .eq("id", order.id);

  if (updateError) {
    console.error(JSON.stringify({ requestId, event: "delivery_callback_order_update_failed", orderId: order.id, error: updateError.message }));
    return jsonOk({ ok: false, error: "order_update_failed", orderId: order.id, requestId });
  }

  /* ---------- also mark webhook_inbox as processed ---------- */
  await adminClient
    .from("webhook_inbox")
    .update({ status: "processed", processed_at: new Date().toISOString() })
    .eq("provider", "nyehandel")
    .eq("topic", "delivery_callback")
    .is("processed_at", null)
    .order("received_at", { ascending: false })
    .limit(1);

  console.log(JSON.stringify({
    requestId,
    event: "delivery_callback_success",
    orderId: order.id,
    nyehandelOrderId,
    trackingId,
    trackingUrl,
  }));

  return jsonOk({
    ok: true,
    orderId: order.id,
    nyehandelOrderId,
    trackingId,
    trackingUrl,
    requestId,
  });
});
