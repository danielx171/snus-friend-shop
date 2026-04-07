declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-expect-error — Deno types: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-expect-error — Deno types: Deno file import
import { getCorsHeaders } from "../_shared/cors.ts";

let _corsHeaders: Record<string, string> = {};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ..._corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  _corsHeaders = getCorsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") return new Response(null, { headers: _corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", requestId }, 405);

  // Auth required
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ error: "server_misconfigured", requestId }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Verify user
  const { data: { user }, error: authError } = await adminClient.auth.getUser(
    authHeader.replace("Bearer ", "")
  );
  if (authError || !user) {
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  const action = body.action as string;

  // CREATE a new subscription
  if (action === "create") {
    const productSlug = body.product_slug as string;
    const productName = body.product_name as string;
    const packSize = (body.pack_size as string) || "pack1";
    const quantity = (body.quantity as number) || 1;
    const interval = body.interval as string;

    if (!productSlug || !productName || !interval) {
      return jsonResponse({ error: "missing_fields", requestId }, 400);
    }
    if (interval !== "monthly" && interval !== "6monthly") {
      return jsonResponse({ error: "invalid_interval", requestId }, 400);
    }

    // Calculate next order date
    const nextOrder = new Date();
    if (interval === "monthly") {
      nextOrder.setMonth(nextOrder.getMonth() + 1);
    } else {
      nextOrder.setMonth(nextOrder.getMonth() + 6);
    }

    const { data: sub, error: insertErr } = await adminClient
      .from("subscriptions")
      .insert({
        user_id: user.id,
        product_slug: productSlug,
        product_name: productName,
        pack_size: packSize,
        quantity,
        interval,
        next_order_at: nextOrder.toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      return jsonResponse({ error: "create_failed", detail: insertErr.message, requestId }, 500);
    }

    return jsonResponse({ ok: true, subscription: sub, requestId });
  }

  // PAUSE a subscription
  if (action === "pause") {
    const subId = body.subscription_id as string;
    if (!subId) return jsonResponse({ error: "missing_subscription_id", requestId }, 400);

    const { error } = await adminClient
      .from("subscriptions")
      .update({ status: "paused" })
      .eq("id", subId)
      .eq("user_id", user.id);

    if (error) return jsonResponse({ error: "pause_failed", requestId }, 500);
    return jsonResponse({ ok: true, requestId });
  }

  // RESUME a paused subscription
  if (action === "resume") {
    const subId = body.subscription_id as string;
    if (!subId) return jsonResponse({ error: "missing_subscription_id", requestId }, 400);

    // Set next order to now + interval
    const { data: sub } = await adminClient
      .from("subscriptions")
      .select("interval")
      .eq("id", subId)
      .eq("user_id", user.id)
      .single();

    if (!sub) return jsonResponse({ error: "not_found", requestId }, 404);

    const nextOrder = new Date();
    if (sub.interval === "monthly") {
      nextOrder.setMonth(nextOrder.getMonth() + 1);
    } else {
      nextOrder.setMonth(nextOrder.getMonth() + 6);
    }

    const { error } = await adminClient
      .from("subscriptions")
      .update({ status: "active", next_order_at: nextOrder.toISOString() })
      .eq("id", subId)
      .eq("user_id", user.id);

    if (error) return jsonResponse({ error: "resume_failed", requestId }, 500);
    return jsonResponse({ ok: true, requestId });
  }

  // CANCEL a subscription
  if (action === "cancel") {
    const subId = body.subscription_id as string;
    if (!subId) return jsonResponse({ error: "missing_subscription_id", requestId }, 400);

    const { error } = await adminClient
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("id", subId)
      .eq("user_id", user.id);

    if (error) return jsonResponse({ error: "cancel_failed", requestId }, 500);
    return jsonResponse({ ok: true, requestId });
  }

  // CHANGE interval
  if (action === "change_interval") {
    const subId = body.subscription_id as string;
    const newInterval = body.interval as string;
    if (!subId || !newInterval) return jsonResponse({ error: "missing_fields", requestId }, 400);
    if (newInterval !== "monthly" && newInterval !== "6monthly") {
      return jsonResponse({ error: "invalid_interval", requestId }, 400);
    }

    const nextOrder = new Date();
    if (newInterval === "monthly") {
      nextOrder.setMonth(nextOrder.getMonth() + 1);
    } else {
      nextOrder.setMonth(nextOrder.getMonth() + 6);
    }

    const { error } = await adminClient
      .from("subscriptions")
      .update({ interval: newInterval, next_order_at: nextOrder.toISOString() })
      .eq("id", subId)
      .eq("user_id", user.id);

    if (error) return jsonResponse({ error: "change_failed", requestId }, 500);
    return jsonResponse({ ok: true, requestId });
  }

  return jsonResponse({ error: "unknown_action", requestId }, 400);
});
