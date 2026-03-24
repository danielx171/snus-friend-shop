import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

type ActionType = 'order' | 'review' | 'spin';

/** Map an incoming action to the quest_type values it should update. */
const ACTION_TO_QUEST_TYPES: Record<ActionType, string[]> = {
  order: ['orders', 'brands', 'spend', 'products'],
  review: ['reviews'],
  spin: ['spins'],
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

    // Parse body
    let body: { action: ActionType; metadata?: Record<string, unknown> };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'invalid_body', requestId }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const { action } = body;
    if (!action || !ACTION_TO_QUEST_TYPES[action]) {
      return new Response(
        JSON.stringify({ error: 'invalid_action', requestId }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const questTypes = ACTION_TO_QUEST_TYPES[action];

    // 1. Get all active quests matching these quest_types
    const { data: quests, error: questsError } = await admin
      .from('quests')
      .select('id, quest_type, target_value, reward_points, reward_avatar_id')
      .in('quest_type', questTypes)
      .eq('active', true);

    if (questsError) {
      console.error('quests read error', { error: questsError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    if (!quests || quests.length === 0) {
      return new Response(
        JSON.stringify({ updated: [], completed: [] }),
        { status: 200, headers: JSON_HEADERS }
      );
    }

    // 2. Pre-fetch user stats we'll need (batch, not per-quest)
    let confirmedOrders: { total_price: number | null }[] = [];
    let reviewCount = 0;
    let spinCount = 0;

    const neededTypes = new Set(quests.map((q: { quest_type: string }) => q.quest_type));

    if (neededTypes.has('orders') || neededTypes.has('spend') ||
        neededTypes.has('brands') || neededTypes.has('products')) {
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
      confirmedOrders = orderRows ?? [];
    }

    if (neededTypes.has('reviews')) {
      const { count, error: reviewError } = await admin
        .from('product_reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (reviewError) {
        console.error('product_reviews count error', { error: reviewError, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }
      reviewCount = count ?? 0;
    }

    if (neededTypes.has('spins')) {
      const { count, error: spinError } = await admin
        .from('daily_spins')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (spinError) {
        console.error('daily_spins count error', { error: spinError, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }
      spinCount = count ?? 0;
    }

    const orderCount = confirmedOrders.length;
    const totalSpend = confirmedOrders.reduce(
      (sum, r) => sum + (r.total_price ?? 0),
      0
    );

    // 3. Process each quest
    const updated: { quest_id: string; current_value: number }[] = [];
    const completed: { quest_id: string; reward_points: number }[] = [];

    for (const quest of quests) {
      const { id: questId, quest_type, target_value, reward_points, reward_avatar_id } = quest as {
        id: string;
        quest_type: string;
        target_value: number;
        reward_points: number;
        reward_avatar_id: string | null;
      };

      // Get or create progress row
      const { data: existingProgress, error: progressReadError } = await admin
        .from('user_quest_progress')
        .select('id, current_value, completed')
        .eq('user_id', userId)
        .eq('quest_id', questId)
        .maybeSingle();

      if (progressReadError) {
        console.error('user_quest_progress read error', { error: progressReadError, questId, requestId });
        continue;
      }

      // If already completed, skip
      if (existingProgress?.completed) {
        continue;
      }

      // Calculate new current_value based on quest_type
      let currentValue = 0;
      switch (quest_type) {
        case 'orders':
          currentValue = orderCount;
          break;
        case 'spend':
          currentValue = totalSpend;
          break;
        case 'reviews':
          currentValue = reviewCount;
          break;
        case 'spins':
          currentValue = spinCount;
          break;
        case 'brands':
          // Simplified: increment by 1 per order action
          currentValue = (existingProgress?.current_value ?? 0) + 1;
          break;
        case 'products':
          // Simplified: increment by 1 per order action
          currentValue = (existingProgress?.current_value ?? 0) + 1;
          break;
        default:
          continue;
      }

      const isNowComplete = currentValue >= target_value;

      // Upsert progress row
      const upsertData: Record<string, unknown> = {
        user_id: userId,
        quest_id: questId,
        current_value: currentValue,
        started_at: existingProgress ? undefined : new Date().toISOString(),
      };

      if (isNowComplete) {
        upsertData.completed = true;
        upsertData.completed_at = new Date().toISOString();
      }

      // Remove undefined keys
      const cleanUpsertData = Object.fromEntries(
        Object.entries(upsertData).filter(([, v]) => v !== undefined)
      );

      const { error: upsertError } = await admin
        .from('user_quest_progress')
        .upsert(cleanUpsertData, { onConflict: 'user_id,quest_id' });

      if (upsertError) {
        console.error('user_quest_progress upsert error', { error: upsertError, questId, requestId });
        continue;
      }

      updated.push({ quest_id: questId, current_value: currentValue });

      // 5. Handle completion rewards
      if (isNowComplete) {
        // Award points
        if (reward_points > 0) {
          const { error: txnError } = await admin
            .from('points_transactions')
            .insert({
              user_id: userId,
              points: reward_points,
              reason: `quest_complete:${questId}`,
            });

          if (txnError) {
            console.error('points_transactions insert error', { error: txnError, questId, requestId });
          } else {
            await admin.rpc('increment_points_balance', {
              p_user_id: userId,
              p_points: reward_points,
            });
          }
        }

        // Award avatar if applicable
        if (reward_avatar_id) {
          const { error: avatarUnlockError } = await admin
            .from('user_avatar_unlocks')
            .insert({ user_id: userId, avatar_id: reward_avatar_id });

          if (avatarUnlockError && avatarUnlockError.code !== '23505') {
            console.error('user_avatar_unlocks insert error', {
              error: avatarUnlockError,
              questId,
              requestId,
            });
          }
        }

        completed.push({ quest_id: questId, reward_points });
      }
    }

    console.log('update_quest_progress result', {
      userId,
      action,
      updatedCount: updated.length,
      completedCount: completed.length,
      requestId,
    });

    return new Response(
      JSON.stringify({ updated, completed }),
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
