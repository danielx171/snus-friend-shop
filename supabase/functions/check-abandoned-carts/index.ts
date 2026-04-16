declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-expect-error — Deno types: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-expect-error — Deno types: Deno file import
import { corsHeaders } from "../_shared/cors.ts";
// @ts-expect-error — Deno relative .ts import
import { buildSiteUrl, currencyCode } from "../_shared/site-config.ts";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed", requestId }, 405);

  // Auth: cron secret
  const cronSecret = Deno.env.get("SYNC_CRON_SECRET");
  const provided = req.headers.get("x-cron-secret");
  if (!cronSecret || !provided || provided !== cronSecret) {
    return json({ error: "unauthorized", requestId }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
  if (!supabaseUrl || !serviceKey) return json({ error: "missing_env", requestId }, 500);

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Find carts abandoned 1-24 hours ago, not yet emailed, not recovered
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: abandoned, error: fetchErr } = await adminClient
    .from("cart_snapshots")
    .select("*")
    .eq("recovered", false)
    .eq("email_sent", false)
    .gt("item_count", 0)
    .lte("updated_at", oneHourAgo)
    .gte("updated_at", oneDayAgo)
    .limit(20);

  if (fetchErr) {
    console.error("check-abandoned-carts: fetch error", fetchErr);
    return json({ error: "fetch_failed", requestId }, 500);
  }

  if (!abandoned || abandoned.length === 0) {
    return json({ ok: true, sent: 0, requestId });
  }

  let sent = 0;
  let errors = 0;

  for (const cart of abandoned) {
    try {
      // Resolve email
      let email = cart.guest_email;
      if (!email && cart.user_id) {
        const { data: { user } } = await adminClient.auth.admin.getUserById(cart.user_id);
        email = user?.email;
      }
      if (!email) {
        // Can't send email — mark as sent to avoid retrying
        await adminClient
          .from("cart_snapshots")
          .update({ email_sent: true })
          .eq("id", cart.id);
        continue;
      }

      // Check if user completed an order since the cart was saved
      const orderCheck = cart.user_id
        ? await adminClient
            .from("orders")
            .select("id")
            .eq("user_id", cart.user_id)
            .gte("created_at", cart.updated_at)
            .limit(1)
        : await adminClient
            .from("orders")
            .select("id")
            .eq("customer_email", email)
            .gte("created_at", cart.updated_at)
            .limit(1);

      if (orderCheck.data && orderCheck.data.length > 0) {
        // User already ordered — mark as recovered
        await adminClient
          .from("cart_snapshots")
          .update({ recovered: true })
          .eq("id", cart.id);
        continue;
      }

      // Build cart items summary for the email
      const items = (cart.cart_data as any[]).map((item: any) => ({
        name: item.product?.name || "Product",
        brand: item.product?.brand || "",
        image_url: item.product?.image || "",
        pack_label: item.packSize?.replace("pack", "") + " can(s)",
        price: item.product?.prices?.[item.packSize] || 0,
        quantity: item.quantity || 1,
      }));

      // Send via our send-email edge function
      const functionsUrl = supabaseUrl.replace(".supabase.co", ".supabase.co/functions/v1");
      if (internalSecret && functionsUrl) {
        await fetch(`${functionsUrl}/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-function-secret": internalSecret,
          },
          body: JSON.stringify({
            to: email,
            subject: "You left something behind",
            template: "cart_abandoned",
            data: {
              items,
              cart_total: `${currencyCode} ${Number(cart.cart_total).toFixed(2)}`,
              item_count: cart.item_count,
              recovery_url: buildSiteUrl("/cart"),
            },
          }),
        });
      }

      // Mark as email sent
      await adminClient
        .from("cart_snapshots")
        .update({ email_sent: true })
        .eq("id", cart.id);

      sent++;
    } catch (err) {
      console.error(`check-abandoned-carts: error for ${cart.id}`, err);
      errors++;
    }
  }

  console.log(`check-abandoned-carts: ${sent} sent, ${errors} errors, ${abandoned.length} found`);

  return json({ ok: true, requestId, found: abandoned.length, sent, errors });
});
