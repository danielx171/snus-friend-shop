import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

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

    // Authenticate: JWT or internal-function-secret
    let userId: string;

    const internalSecret = Deno.env.get('INTERNAL_FUNCTIONS_SECRET');
    const providedInternal = req.headers.get('x-internal-function-secret');

    if (internalSecret && providedInternal && providedInternal === internalSecret) {
      // Internal service-to-service call — read user_id from body
      const body = await req.json().catch(() => null);
      if (!body || typeof body.user_id !== 'string') {
        return new Response(
          JSON.stringify({ error: 'invalid_input', message: 'Body must contain { user_id: string } for internal calls', requestId }),
          { status: 400, headers: JSON_HEADERS }
        );
      }
      userId = body.user_id;
    } else {
      // JWT auth path
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

      userId = user.id;
    }
    const admin = createClient(supabaseUrl, serviceKey);

    // 1. Get user's already-unlocked avatar IDs
    const { data: unlockRows, error: unlockError } = await admin
      .from('user_avatar_unlocks')
      .select('avatar_id')
      .eq('user_id', userId);

    if (unlockError) {
      console.error('user_avatar_unlocks read error', { error: unlockError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    const unlockedIds = new Set((unlockRows ?? []).map((r: { avatar_id: string }) => r.avatar_id));

    // 2. Get all non-default avatars
    const { data: avatars, error: avatarsError } = await admin
      .from('avatars')
      .select('id, name, image_url, rarity, unlock_type, unlock_threshold')
      .neq('unlock_type', 'default');

    if (avatarsError) {
      console.error('avatars read error', { error: avatarsError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    // 3. Compute user stats needed for unlock checks
    const lockedAvatars = (avatars ?? []).filter(
      (a: { id: string }) => !unlockedIds.has(a.id)
    );

    if (lockedAvatars.length === 0) {
      return new Response(
        JSON.stringify({ newly_unlocked: [], total_unlocked: unlockedIds.size }),
        { status: 200, headers: JSON_HEADERS }
      );
    }

    // Determine which stat types are needed
    const neededTypes = new Set(
      lockedAvatars.map((a: { unlock_type: string }) => a.unlock_type)
    );

    let orderCount = 0;
    let reviewCount = 0;
    let totalSpend = 0;

    if (neededTypes.has('orders') || neededTypes.has('spend')) {
      const { data: orderRows, error: orderError } = await admin
        .from('orders')
        .select('total_price')
        .eq('user_id', userId)
        .in('checkout_status', ['confirmed', 'shipped']);

      if (orderError) {
        console.error('orders read error', { error: orderError, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }

      orderCount = (orderRows ?? []).length;
      totalSpend = (orderRows ?? []).reduce(
        (sum: number, r: { total_price: number | null }) => sum + (r.total_price ?? 0),
        0
      );
    }

    if (neededTypes.has('reviews')) {
      const { count, error: reviewError } = await admin
        .from('product_reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('flagged', false);

      if (reviewError) {
        console.error('product_reviews read error', { error: reviewError, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }

      reviewCount = count ?? 0;
    }

    // 4. Check each locked avatar and collect newly qualifying ones
    const newlyUnlocked: { id: string; name: string; rarity: string; image_url: string }[] = [];

    for (const avatar of lockedAvatars) {
      const { id, name, image_url, rarity, unlock_type, unlock_threshold } = avatar as {
        id: string;
        name: string;
        image_url: string;
        rarity: string;
        unlock_type: string;
        unlock_threshold: number;
      };

      let userStat = 0;

      switch (unlock_type) {
        case 'orders':
          userStat = orderCount;
          break;
        case 'reviews':
          userStat = reviewCount;
          break;
        case 'spend':
          userStat = totalSpend;
          break;
        case 'social':
          // Phase 3 — skip for now
          continue;
        default:
          continue;
      }

      if (userStat >= unlock_threshold) {
        const { error: insertError } = await admin
          .from('user_avatar_unlocks')
          .insert({ user_id: userId, avatar_id: id });

        if (insertError && insertError.code !== '23505') {
          // 23505 = unique violation (already unlocked via race); treat as OK
          console.error('user_avatar_unlocks insert error', { error: insertError, id, requestId });
        } else {
          newlyUnlocked.push({ id, name, rarity, image_url });
        }
      }
    }

    console.log('check_avatar_unlocks result', {
      userId,
      newlyUnlockedCount: newlyUnlocked.length,
      requestId,
    });

    const totalUnlocked = unlockedIds.size + newlyUnlocked.length;

    return new Response(
      JSON.stringify({ newly_unlocked: newlyUnlocked, total_unlocked: totalUnlocked }),
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
