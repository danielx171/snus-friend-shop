import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

const PRIZE_DISPLAY: Record<string, { icon: string; title: string; description: string; type: string }> = {
  points_5:      { icon: '\u{1FA99}', title: '5 SnusPoints',       description: 'Added to your balance!',                          type: 'points' },
  points_10:     { icon: '\u{1FA99}', title: '10 SnusPoints',      description: 'Nice! Points added.',                              type: 'points' },
  points_25:     { icon: '\u{1F48E}', title: '25 SnusPoints',      description: 'Great spin! Points added.',                        type: 'points' },
  points_5b:     { icon: '\u{1FA99}', title: '5 SnusPoints',       description: 'Added to your balance!',                          type: 'points' },
  points_50:     { icon: '\u{1F4B0}', title: '50 SnusPoints!',     description: 'Big win!',                                        type: 'points' },
  voucher_15pct: { icon: '\u{1F3F7}\uFE0F', title: '15% Off Voucher',    description: 'Valid 30 days on any order.',                      type: 'voucher' },
  free_can:      { icon: '\u{1F381}', title: 'Free Can!',          description: 'A free STNG Berry Seltzer added to your rewards.', type: 'voucher' },
  free_month:    { icon: '\u{1F451}', title: 'FREE MONTH!',        description: 'Contact us to redeem your free month.',            type: 'jackpot' },
};

const POINTS_MAP: Record<string, number> = {
  points_5: 5,
  points_10: 10,
  points_25: 25,
  points_5b: 5,
  points_50: 50,
};

function weightedRandomPick(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

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
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    const userId = user.id;
    const admin = createClient(supabaseUrl, serviceKey);

    // --- All writes use service-role client to bypass RLS ---

    // 1. Try to claim today's spin (unique constraint on user_id + spin_date)
    const { error: spinInsertError } = await admin
      .from('daily_spins')
      .insert({ user_id: userId, spin_date: new Date().toISOString().slice(0, 10) });

    if (spinInsertError) {
      if (spinInsertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'already_spun', message: 'You already spun today. Come back tomorrow!' }),
          { status: 409, headers: JSON_HEADERS }
        );
      }
      console.error('daily_spins insert error', { error: spinInsertError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    // 2. Read spin_config
    const { data: configRows, error: configError } = await admin
      .from('spin_config')
      .select('key, value')
      .in('key', ['prize_weights', 'clearance_sku']);

    if (configError) {
      console.error('spin_config read error', { error: configError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    // deno-lint-ignore no-explicit-any
    const configMap: Record<string, any> = {};
    for (const row of configRows ?? []) {
      // JSONB columns are already parsed by Supabase — no JSON.parse needed
      configMap[row.key] = row.value;
    }

    const prizeWeights: Record<string, number> = configMap.prize_weights
      ?? { points_5: 35, points_10: 25, points_25: 15, points_5b: 10, points_50: 5, voucher_15pct: 5, free_can: 4, free_month: 1 };

    const clearanceSku: string | null = configMap.clearance_sku ?? null;

    // 3. Weighted random pick
    const prizeKey = weightedRandomPick(prizeWeights);

    // 4. Award the prize
    let voucherId: string | undefined;
    let pointsAwarded: number | undefined;
    let effectivePrizeKey = prizeKey;

    if (prizeKey in POINTS_MAP) {
      // Points prize
      const pts = POINTS_MAP[prizeKey];
      pointsAwarded = pts;

      const { error: txnError } = await admin
        .from('points_transactions')
        .insert({ user_id: userId, points: pts, reason: `spin_wheel:${prizeKey}` });

      if (txnError) {
        console.error('points_transactions insert error', { error: txnError, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }

      // Atomic increment — avoids race condition with concurrent spins
      await admin.rpc('increment_points_balance', { p_user_id: userId, p_points: pts });
    } else if (prizeKey === 'voucher_15pct') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: voucher, error: vErr } = await admin
        .from('vouchers')
        .insert({
          user_id: userId,
          type: 'discount_pct',
          value: { percent: 15 },
          expires_at: expiresAt,
          source: 'spin_wheel',
        })
        .select('id')
        .single();

      if (vErr) {
        console.error('voucher insert error', { error: vErr, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }
      voucherId = voucher?.id;
    } else if (prizeKey === 'free_can') {
      if (clearanceSku) {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: voucher, error: vErr } = await admin
          .from('vouchers')
          .insert({
            user_id: userId,
            type: 'free_product',
            value: { sku: clearanceSku },
            expires_at: expiresAt,
            source: 'spin_wheel',
          })
          .select('id')
          .single();

        if (vErr) {
          console.error('free_can voucher insert error', { error: vErr, requestId });
          return new Response(
            JSON.stringify({ error: 'internal', requestId }),
            { status: 500, headers: JSON_HEADERS }
          );
        }
        voucherId = voucher?.id;
      } else {
        // Fallback: award 25 points instead
        effectivePrizeKey = 'points_25';
        pointsAwarded = 25;

        await admin
          .from('points_transactions')
          .insert({ user_id: userId, points: 25, reason: 'spin_wheel:free_can_fallback' });

        // Atomic increment — avoids race condition
        await admin.rpc('increment_points_balance', { p_user_id: userId, p_points: 25 });
      }
    } else if (prizeKey === 'free_month') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: voucher, error: vErr } = await admin
        .from('vouchers')
        .insert({
          user_id: userId,
          type: 'free_month',
          value: { note: 'Contact us to redeem' },
          expires_at: expiresAt,
          source: 'spin_wheel',
        })
        .select('id')
        .single();

      if (vErr) {
        console.error('free_month voucher insert error', { error: vErr, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }
      voucherId = voucher?.id;
    }

    // 5. Update the daily_spins row with prize result
    const prizeValue = pointsAwarded
      ? { points: pointsAwarded }
      : voucherId
        ? { voucher_id: voucherId }
        : null;

    await admin
      .from('daily_spins')
      .update({ prize_key: effectivePrizeKey, prize_value: prizeValue })
      .eq('user_id', userId)
      .eq('spin_date', new Date().toISOString().slice(0, 10));

    // 6. Build response
    const displayKey = effectivePrizeKey;
    const display = PRIZE_DISPLAY[displayKey] ?? { icon: '\u{1FA99}', title: prizeKey, description: '', type: 'points' };

    const responseBody: Record<string, unknown> = {
      prize_key: effectivePrizeKey,
      prize_display: display,
    };
    if (voucherId) responseBody.voucher_id = voucherId;
    if (pointsAwarded) responseBody.points_awarded = pointsAwarded;

    console.log('spin_wheel result', { userId, prizeKey: effectivePrizeKey, pointsAwarded, voucherId, requestId });

    return new Response(
      JSON.stringify(responseBody),
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
