declare const Deno: {
  env: { get: (key: string) => string | undefined };
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
  const requestId = crypto.randomUUID();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", requestId }, 405);

  // Auth: cron secret
  const cronSecret = Deno.env.get("SYNC_CRON_SECRET");
  const provided = req.headers.get("x-cron-secret");
  if (!cronSecret || !provided || provided !== cronSecret) {
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ error: "missing_env", requestId }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Find subscriptions due for processing
  const { data: dueSubs, error: fetchErr } = await adminClient
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .lte("next_order_at", new Date().toISOString())
    .limit(50);

  if (fetchErr) {
    console.error("process-subscriptions: fetch error", fetchErr);
    return jsonResponse({ error: "fetch_failed", requestId }, 500);
  }

  if (!dueSubs || dueSubs.length === 0) {
    return jsonResponse({ ok: true, processed: 0, requestId });
  }

  let processed = 0;
  let errors = 0;
  const results: Array<{ subId: string; status: string; error?: string }> = [];

  for (const sub of dueSubs) {
    try {
      // Look up product price from product_variants
      const sku = `${sub.product_slug}-${sub.pack_size}`;
      const { data: variant } = await adminClient
        .from("product_variants")
        .select("price")
        .eq("sku", sku)
        .maybeSingle();

      if (!variant) {
        // SKU not found — pause subscription and alert
        await adminClient
          .from("subscriptions")
          .update({ status: "paused" })
          .eq("id", sub.id);

        await adminClient.from("ops_alerts").insert({
          alert_type: "subscription_sku_missing",
          severity: "high",
          title: `Subscription ${sub.id}: SKU ${sku} not found`,
          details: { subscription_id: sub.id, user_id: sub.user_id, sku },
          status: "open",
        }).catch(() => {});

        results.push({ subId: sub.id, status: "paused_sku_missing", error: `SKU ${sku} not found` });
        errors++;
        continue;
      }

      // Apply subscription discount
      const basePrice = Number(variant.price);
      const discountedPrice = Math.round(basePrice * (1 - sub.discount_pct / 100) * 100) / 100;

      // Get user's email and auth token for checkout
      const { data: { user } } = await adminClient.auth.admin.getUserById(sub.user_id);
      if (!user?.email) {
        results.push({ subId: sub.id, status: "skipped_no_email" });
        errors++;
        continue;
      }

      // Create the order via the checkout edge function (internal call)
      const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
      const checkoutPayload = {
        items: [{
          sku,
          quantity: sub.quantity,
          product_name: sub.product_name,
          pack_label: sub.pack_size.replace("pack", "") + " can(s)",
          unit_price: discountedPrice,
        }],
        customer: {
          email: user.email,
          firstname: user.user_metadata?.full_name?.split(" ")[0] || "Subscriber",
          lastname: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
        },
        billing_address: user.user_metadata?.last_address || {
          address: "",
          postcode: "",
          city: "",
          country: "SE",
        },
        shipping_method: "UPS Standard (J229F1)",
        idempotency_key: `sub-${sub.id}-${new Date().toISOString().slice(0, 10)}`,
        display_total: discountedPrice * sub.quantity,
        display_currency: "EUR",
      };

      // Send email notification about the upcoming charge instead of auto-ordering
      // For MVP: create an ops alert for manual processing
      await adminClient.from("ops_alerts").insert({
        alert_type: "subscription_due",
        severity: "info",
        title: `Subscription order due: ${sub.product_name} for ${user.email}`,
        details: {
          subscription_id: sub.id,
          user_id: sub.user_id,
          email: user.email,
          product_slug: sub.product_slug,
          pack_size: sub.pack_size,
          quantity: sub.quantity,
          discount_pct: sub.discount_pct,
          discounted_price: discountedPrice,
          checkout_payload: checkoutPayload,
        },
        status: "open",
      });

      // Advance next_order_at
      const nextOrder = new Date();
      if (sub.interval === "monthly") {
        nextOrder.setMonth(nextOrder.getMonth() + 1);
      } else {
        nextOrder.setMonth(nextOrder.getMonth() + 6);
      }

      await adminClient
        .from("subscriptions")
        .update({
          last_order_at: new Date().toISOString(),
          next_order_at: nextOrder.toISOString(),
        })
        .eq("id", sub.id);

      processed++;
      results.push({ subId: sub.id, status: "processed" });

    } catch (err) {
      errors++;
      results.push({ subId: sub.id, status: "error", error: String(err) });
    }
  }

  console.log(`process-subscriptions: ${processed} processed, ${errors} errors out of ${dueSubs.length} due`);

  return jsonResponse({
    ok: true,
    requestId,
    total: dueSubs.length,
    processed,
    errors,
    results,
  });
});
