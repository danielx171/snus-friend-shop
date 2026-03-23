declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/*                                                                      */
/*  Public endpoint — authenticates by orderId + customer email match.  */
/*  Uses service role key to bypass RLS, returns only display fields.   */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  /* ---------- env ---------- */
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env" }, 500);
  }

  /* ---------- parse body ---------- */
  let body: { orderId?: string; email?: string };
  try {
    body = (await req.json()) as { orderId?: string; email?: string };
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!orderId) {
    return jsonResponse({ error: "orderId_required" }, 400);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: "email_required" }, 400);
  }

  /* ---------- fetch order (service role — bypasses RLS) ---------- */
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: order, error: fetchError } = await adminClient
    .from("orders")
    .select(
      "id, created_at, total_price, currency, line_items_snapshot, shipping_address, checkout_status, customer_email",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError) {
    return jsonResponse({ error: "order_lookup_failed" }, 500);
  }

  if (!order) {
    return jsonResponse({ error: "order_not_found" }, 404);
  }

  /* ---------- ownership check — email must match ---------- */
  const orderEmail = typeof order.customer_email === "string"
    ? order.customer_email.trim().toLowerCase()
    : "";

  if (orderEmail !== email) {
    // Return same 404 as "not found" — don't leak that the order exists
    return jsonResponse({ error: "order_not_found" }, 404);
  }

  /* ---------- return display-safe fields only ---------- */
  return jsonResponse({
    ok: true,
    order: {
      id: order.id,
      created_at: order.created_at,
      total_price: order.total_price,
      currency: order.currency,
      checkout_status: order.checkout_status,
      line_items_snapshot: order.line_items_snapshot,
      shipping_address: order.shipping_address,
    },
  });
});
