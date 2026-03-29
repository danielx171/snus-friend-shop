declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req) => {
  // Auth: x-cron-secret
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Find orders shipped 7+ days ago that haven't been sent a review email
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, customer_email, customer_metadata, line_items_snapshot, created_at")
    .eq("checkout_status", "shipped")
    .is("review_email_sent_at", null)
    .lt("created_at", sevenDaysAgo)
    .limit(50);

  if (error) {
    console.error(JSON.stringify({ event: "review_email_query_error", error: error.message }));
    return new Response(JSON.stringify({ error: "query_failed" }), { status: 500 });
  }

  if (!orders || orders.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: "no_eligible_orders" }));
  }

  let sent = 0;
  let failed = 0;

  for (const order of orders) {
    try {
      // Extract customer name and first product from line_items_snapshot
      const metadata = order.customer_metadata as any;
      const customerName = metadata?.firstname || "Friend";
      const items = Array.isArray(order.line_items_snapshot) ? order.line_items_snapshot : [];
      const firstItem = items[0] as any;

      if (!firstItem || !order.customer_email) continue;

      const productName = firstItem.name || "your recent purchase";
      const productSlug = firstItem.slug || firstItem.product_id || "";
      const productImageUrl = firstItem.image_url || firstItem.imageUrl || "";
      const reviewUrl = `https://snusfriends.com/products/${productSlug}#reviews`;
      const orderDate = new Date(order.created_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      });

      // Call send-email function
      const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-function-secret": internalSecret,
        },
        body: JSON.stringify({
          to: order.customer_email,
          subject: `How was your ${productName}? Share your experience`,
          template: "review_request",
          data: {
            customerName,
            productName,
            productImageUrl,
            reviewUrl,
            orderDate,
          },
        }),
      });

      if (emailRes.ok) {
        // Mark as sent
        await supabase
          .from("orders")
          .update({ review_email_sent_at: new Date().toISOString() })
          .eq("id", order.id);
        sent++;
      } else {
        const errBody = await emailRes.text();
        console.error(JSON.stringify({ event: "review_email_send_failed", orderId: order.id, error: errBody }));
        failed++;
      }
    } catch (err) {
      console.error(JSON.stringify({ event: "review_email_error", orderId: order.id, error: String(err) }));
      failed++;
    }
  }

  console.log(JSON.stringify({ event: "review_emails_complete", sent, failed, total: orders.length }));
  return new Response(JSON.stringify({ sent, failed, total: orders.length }));
});
