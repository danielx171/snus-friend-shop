declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore: Deno file import
import { getCorsHeaders } from "../_shared/cors.ts";

let _cors: Record<string, string> = {};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ..._cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  _cors = getCorsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { headers: _cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "server_error" }, 500);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const cartData = body.cart_data;
  const cartTotal = Number(body.cart_total ?? 0);
  const itemCount = Number(body.item_count ?? 0);
  const guestEmail = (body.guest_email as string) || null;

  if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
    return json({ error: "empty_cart" }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Resolve user from auth header if present
  let userId: string | null = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const { data: { user } } = await adminClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (user?.id) userId = user.id;
  }

  if (!userId && !guestEmail) {
    // Anonymous user with no email — can't send recovery email, skip
    return json({ ok: true, skipped: true });
  }

  // Upsert: one active snapshot per user/email
  const matchField = userId ? "user_id" : "guest_email";
  const matchValue = userId ?? guestEmail;

  // Check for existing non-recovered snapshot
  const { data: existing } = await adminClient
    .from("cart_snapshots")
    .select("id")
    .eq(matchField, matchValue!)
    .eq("recovered", false)
    .maybeSingle();

  if (existing) {
    // Update existing snapshot
    await adminClient
      .from("cart_snapshots")
      .update({
        cart_data: cartData,
        cart_total: cartTotal,
        item_count: itemCount,
        email_sent: false, // Reset — cart changed, eligible for new email
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    // Create new snapshot
    await adminClient
      .from("cart_snapshots")
      .insert({
        user_id: userId,
        guest_email: guestEmail,
        cart_data: cartData,
        cart_total: cartTotal,
        item_count: itemCount,
      });
  }

  return json({ ok: true });
});
