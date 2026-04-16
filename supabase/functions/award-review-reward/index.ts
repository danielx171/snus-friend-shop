declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-expect-error — Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-expect-error — Deno relative .ts import
import { getCorsHeaders } from "../_shared/cors.ts";

/**
 * Award the 50-SnusCoin one-time-per-product review reward.
 *
 * Auth: user JWT via Authorization header.
 * Idempotency: review_rewards.UNIQUE (user_id, product_id) blocks repeat
 *   awards. Returns { awarded: false, reason: 'already_awarded' } if the
 *   user already earned points for this product.
 *
 * On success:
 *   - inserts review_rewards row
 *   - inserts points_transactions row (audit trail)
 *   - calls increment_points_balance RPC (atomic balance update)
 *
 * If any step after the ledger insert fails, we DON'T roll back the ledger
 * — the user can see the row but not the points, which is recoverable by
 *   running a one-off reconciliation. The alternative (rolling back) is
 *   worse: the ledger's whole point is to block duplicate awards.
 */
Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));
  const JSON_HEADERS = { ...corsHeaders, "Content-Type": "application/json" };

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  const requestId = crypto.randomUUID();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey || !anonKey) {
    return new Response(JSON.stringify({ error: "missing_env", requestId }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // Auth — extract user from JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "unauthorized", requestId }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    return new Response(JSON.stringify({ error: "unauthorized", requestId }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  // Parse body
  let body: { product_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json", requestId }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }
  const productId = typeof body.product_id === "string" ? body.product_id.trim() : "";
  if (!productId) {
    return new Response(JSON.stringify({ error: "product_id_required", requestId }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // Verify the user actually has at least one review for this product —
  // prevents calling the endpoint without having submitted a review first.
  const reviewCheck = await userClient
    .from("product_reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .limit(1)
    .maybeSingle();
  if (!reviewCheck.data) {
    return new Response(
      JSON.stringify({ error: "no_review_found", requestId }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const POINTS = 50;

  // Ledger insert is the gate
  const { error: ledgerErr } = await admin
    .from("review_rewards")
    .insert({ user_id: user.id, product_id: productId, points: POINTS });
  if (ledgerErr) {
    if (ledgerErr.code === "23505") {
      return new Response(
        JSON.stringify({ awarded: false, reason: "already_awarded", requestId }),
        { status: 200, headers: JSON_HEADERS },
      );
    }
    console.error("review_rewards insert failed", { error: ledgerErr, requestId });
    return new Response(JSON.stringify({ error: "internal", requestId }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // Award points (best-effort; ledger row is the source of truth)
  const { error: rpcErr } = await admin.rpc("increment_points_balance", {
    p_user_id: user.id,
    p_points: POINTS,
  });
  if (rpcErr) console.error("increment_points_balance failed", { error: rpcErr, requestId });

  const { error: txnErr } = await admin
    .from("points_transactions")
    .insert({ user_id: user.id, points: POINTS, reason: `review_reward:${productId}` });
  if (txnErr) console.error("points_transactions insert failed", { error: txnErr, requestId });

  return new Response(
    JSON.stringify({ awarded: true, points: POINTS, requestId }),
    { status: 200, headers: JSON_HEADERS },
  );
});
