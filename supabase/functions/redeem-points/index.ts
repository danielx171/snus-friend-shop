import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

const REWARDS: Record<string, { points: number; value: number; label: string }> = {
  discount_5:       { points: 200, value: 5,  label: '€5 off' },
  discount_10:      { points: 350, value: 10, label: '€10 off' },
  free_shipping:    { points: 150, value: 0,  label: 'Free shipping' },
  mystery_box_month: { points: 500, value: 0, label: 'Free mystery box month' },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'method_not_allowed', requestId }),
        { status: 405, headers: JSON_HEADERS }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY', { requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    // Authenticate user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', requestId }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', requestId }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    const userId = user.id;

    // Parse and validate body
    const body = await req.json().catch(() => null);

    if (!body || typeof body.reward_type !== 'string') {
      return new Response(
        JSON.stringify({ error: 'invalid_input', message: 'Body must contain { reward_type: string }', requestId }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const rewardType = body.reward_type;
    const reward = REWARDS[rewardType];

    if (!reward) {
      return new Response(
        JSON.stringify({
          error: 'invalid_reward_type',
          message: `reward_type must be one of: ${Object.keys(REWARDS).join(', ')}`,
          requestId,
        }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Call atomic RPC to deduct points and record redemption
    const { data: redemptionId, error: rpcError } = await admin.rpc('redeem_points', {
      p_user_id: userId,
      p_points: reward.points,
      p_reward_type: rewardType,
      p_reward_value: reward.value,
    });

    if (rpcError) {
      // Map known PG error codes to user-friendly responses
      if (rpcError.message?.includes('insufficient_points')) {
        return new Response(
          JSON.stringify({ error: 'insufficient_points', message: 'Not enough points for this reward', requestId }),
          { status: 400, headers: JSON_HEADERS }
        );
      }
      if (rpcError.message?.includes('no_balance_row')) {
        return new Response(
          JSON.stringify({ error: 'no_balance', message: 'No points balance found', requestId }),
          { status: 400, headers: JSON_HEADERS }
        );
      }
      console.error('redeem_points RPC error', { error: rpcError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    // Optionally create a voucher for discount rewards
    let voucherCode: string | undefined;

    if (rewardType === 'discount_5' || rewardType === 'discount_10') {
      const code = `REDEEM-${rewardType.toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

      const { data: voucher, error: vErr } = await admin
        .from('vouchers')
        .insert({
          user_id: userId,
          type: 'discount_fixed',
          value: JSON.stringify({ amount: reward.value, code }),
          expires_at: expiresAt,
          source: 'points_redemption',
        })
        .select('id')
        .single();

      if (vErr) {
        console.error('voucher insert error', { error: vErr, requestId });
        // Redemption already recorded — log but don't fail the request
      } else if (voucher) {
        voucherCode = code;

        // Link voucher to redemption
        await admin
          .from('points_redemptions')
          .update({ voucher_id: voucher.id })
          .eq('id', redemptionId);
      }
    } else if (rewardType === 'free_shipping') {
      const code = `FREESHIP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

      const { data: voucher, error: vErr } = await admin
        .from('vouchers')
        .insert({
          user_id: userId,
          type: 'free_shipping',
          value: JSON.stringify({ code }),
          expires_at: expiresAt,
          source: 'points_redemption',
        })
        .select('id')
        .single();

      if (vErr) {
        console.error('voucher insert error (free_shipping)', { error: vErr, requestId });
      } else if (voucher) {
        voucherCode = code;

        await admin
          .from('points_redemptions')
          .update({ voucher_id: voucher.id })
          .eq('id', redemptionId);
      }
    }

    console.log('redeem-points success', {
      userId,
      rewardType,
      points: reward.points,
      redemptionId,
      voucherCode: voucherCode ?? null,
      requestId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        redemption_id: redemptionId,
        ...(voucherCode ? { voucher_code: voucherCode } : {}),
      }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch (err) {
    console.error('unexpected error', { err, requestId });
    return new Response(
      JSON.stringify({ error: 'internal', requestId }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
});
