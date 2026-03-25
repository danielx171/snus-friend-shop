import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

const JSON_HEADERS = { ...corsHeaders, 'Content-Type': 'application/json' };

const VALID_ACTIONS = ['order_placed', 'review_submitted', 'spin_completed'] as const;
type Action = typeof VALID_ACTIONS[number];

/** Maps an incoming action to the quest_type values it can increment. */
const ACTION_TO_QUEST_TYPES: Record<Action, string[]> = {
  order_placed: ['orders', 'brands', 'products', 'spend'],
  review_submitted: ['reviews'],
  spin_completed: ['spins'],
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

    // --- Parse body early (needed for both auth paths) ---
    const body = await req.json().catch(() => null);

    // --- Authenticate: JWT or internal-function-secret ---
    let userId: string;

    const internalSecret = Deno.env.get('INTERNAL_FUNCTIONS_SECRET');
    const providedInternal = req.headers.get('x-internal-function-secret');

    if (internalSecret && providedInternal && providedInternal === internalSecret) {
      // Internal service-to-service call — read user_id from body
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

    // --- Validate input ---
    if (!body || typeof body.action !== 'string') {
      return new Response(
        JSON.stringify({ error: 'invalid_input', message: 'Body must contain { action: string }', requestId }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const action = body.action as Action;
    if (!VALID_ACTIONS.includes(action)) {
      return new Response(
        JSON.stringify({ error: 'invalid_action', message: `action must be one of: ${VALID_ACTIONS.join(', ')}`, requestId }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // --- Fetch active quests ---
    const { data: quests, error: questsError } = await admin
      .from('quests')
      .select('id, quest_type, target_value, reward_points, reward_avatar_id')
      .eq('active', true);

    if (questsError) {
      console.error('Failed to fetch quests', { error: questsError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    if (!quests || quests.length === 0) {
      return new Response(
        JSON.stringify({ updated_quests: [], newly_completed: [], requestId }),
        { status: 200, headers: JSON_HEADERS }
      );
    }

    // --- Fetch existing progress for this user ---
    const questIds = quests.map((q: { id: string }) => q.id);
    const { data: existingProgress, error: progressError } = await admin
      .from('user_quest_progress')
      .select('id, quest_id, current_value, completed')
      .eq('user_id', userId)
      .in('quest_id', questIds);

    if (progressError) {
      console.error('Failed to fetch user_quest_progress', { error: progressError, requestId });
      return new Response(
        JSON.stringify({ error: 'internal', requestId }),
        { status: 500, headers: JSON_HEADERS }
      );
    }

    const progressByQuestId = new Map<string, { id: string; current_value: number; completed: boolean }>();
    for (const p of existingProgress ?? []) {
      progressByQuestId.set(p.quest_id, p);
    }

    // Filter quests to only those relevant to this action
    const relevantQuestTypes = ACTION_TO_QUEST_TYPES[action];
    const relevantQuests = quests.filter((q: { quest_type: string }) => relevantQuestTypes.includes(q.quest_type));

    // --- Pre-compute values for "brands" and "spend" quest types ---
    let distinctBrandCount: number | null = null;
    let totalSpend: number | null = null;

    const needsBrands = relevantQuests.some((q: { quest_type: string }) => q.quest_type === 'brands');
    const needsSpend = relevantQuests.some((q: { quest_type: string }) => q.quest_type === 'spend');

    if (needsBrands || needsSpend) {
      // Fetch user orders to compute aggregates
      const { data: orders, error: ordersError } = await admin
        .from('orders')
        .select('total_price, line_items_snapshot')
        .eq('user_id', userId)
        .neq('checkout_status', 'cancelled');

      if (ordersError) {
        console.error('Failed to fetch orders for aggregation', { error: ordersError, requestId });
        return new Response(
          JSON.stringify({ error: 'internal', requestId }),
          { status: 500, headers: JSON_HEADERS }
        );
      }

      if (needsSpend) {
        totalSpend = (orders ?? []).reduce((sum: number, o: { total_price: number }) => sum + (o.total_price ?? 0), 0);
      }

      if (needsBrands) {
        const brands = new Set<string>();
        for (const order of orders ?? []) {
          const items = order.line_items_snapshot;
          if (Array.isArray(items)) {
            for (const item of items) {
              if (item && typeof item === 'object' && 'brand' in item && typeof item.brand === 'string') {
                brands.add(item.brand.toLowerCase());
              }
            }
          }
        }
        distinctBrandCount = brands.size;
      }
    }

    // --- Process each relevant quest ---
    const updatedQuests: Array<{ quest_id: string; current_value: number; completed: boolean }> = [];
    const newlyCompleted: Array<{ quest_id: string; reward_points: number; reward_avatar_id: string | null }> = [];

    for (const quest of relevantQuests) {
      let progress = progressByQuestId.get(quest.id);

      // Auto-start: create progress row if user hasn't started this quest
      if (!progress) {
        const { data: inserted, error: insertErr } = await admin
          .from('user_quest_progress')
          .insert({
            user_id: userId,
            quest_id: quest.id,
            current_value: 0,
            completed: false,
            started_at: new Date().toISOString(),
          })
          .select('id, current_value, completed')
          .single();

        if (insertErr) {
          // Possible race condition — another request created it first
          if (insertErr.code === '23505') {
            const { data: fetched } = await admin
              .from('user_quest_progress')
              .select('id, current_value, completed')
              .eq('user_id', userId)
              .eq('quest_id', quest.id)
              .single();
            if (fetched) {
              progress = { id: fetched.id, current_value: fetched.current_value, completed: fetched.completed };
            } else {
              console.error('Failed to fetch after duplicate insert', { quest_id: quest.id, requestId });
              continue;
            }
          } else {
            console.error('Failed to insert quest progress', { error: insertErr, quest_id: quest.id, requestId });
            continue;
          }
        } else if (inserted) {
          progress = { id: inserted.id, current_value: inserted.current_value, completed: inserted.completed };
        }
      }

      if (!progress || progress.completed) {
        // Already completed — skip
        if (progress?.completed) {
          updatedQuests.push({ quest_id: quest.id, current_value: progress.current_value, completed: true });
        }
        continue;
      }

      // Compute new value based on quest_type
      let newValue: number;
      switch (quest.quest_type) {
        case 'orders':
          newValue = progress.current_value + 1;
          break;
        case 'reviews':
          newValue = progress.current_value + 1;
          break;
        case 'spins':
          newValue = progress.current_value + 1;
          break;
        case 'brands':
          newValue = distinctBrandCount ?? progress.current_value;
          break;
        case 'spend':
          newValue = totalSpend != null ? Math.floor(totalSpend) : progress.current_value;
          break;
        default:
          newValue = progress.current_value + 1;
          break;
      }

      const isNowCompleted = newValue >= quest.target_value;

      // Update progress row
      const updatePayload: Record<string, unknown> = { current_value: newValue };
      if (isNowCompleted) {
        updatePayload.completed = true;
        updatePayload.completed_at = new Date().toISOString();
      }

      const { error: updateErr } = await admin
        .from('user_quest_progress')
        .update(updatePayload)
        .eq('id', progress.id);

      if (updateErr) {
        console.error('Failed to update quest progress', { error: updateErr, quest_id: quest.id, requestId });
        continue;
      }

      updatedQuests.push({ quest_id: quest.id, current_value: newValue, completed: isNowCompleted });

      // --- Award rewards if newly completed ---
      if (isNowCompleted) {
        newlyCompleted.push({
          quest_id: quest.id,
          reward_points: quest.reward_points,
          reward_avatar_id: quest.reward_avatar_id,
        });

        // Award points
        if (quest.reward_points > 0) {
          const { error: txnError } = await admin
            .from('points_transactions')
            .insert({
              user_id: userId,
              points: quest.reward_points,
              reason: `quest_completed:${quest.id}`,
            });

          if (txnError) {
            console.error('Failed to insert points_transaction for quest reward', { error: txnError, quest_id: quest.id, requestId });
          }

          // Atomic increment via RPC (same pattern as spin-wheel)
          const { error: rpcError } = await admin.rpc('increment_points_balance', {
            p_user_id: userId,
            p_points: quest.reward_points,
          });

          if (rpcError) {
            console.error('Failed to increment points balance for quest reward', { error: rpcError, quest_id: quest.id, requestId });
          }
        }

        // Unlock avatar if specified
        if (quest.reward_avatar_id) {
          const { error: avatarErr } = await admin
            .from('user_avatar_unlocks')
            .insert({
              user_id: userId,
              avatar_id: quest.reward_avatar_id,
              unlocked_at: new Date().toISOString(),
            });

          if (avatarErr && avatarErr.code !== '23505') {
            // 23505 = already unlocked (duplicate key), which is fine
            console.error('Failed to unlock avatar for quest reward', { error: avatarErr, quest_id: quest.id, requestId });
          }
        }
      }
    }

    // --- Fire-and-forget: check avatar unlocks ---
    const projectUrl = Deno.env.get('SUPABASE_URL');
    const chainSecret = Deno.env.get('INTERNAL_FUNCTIONS_SECRET');
    if (projectUrl && chainSecret) {
      fetch(`${projectUrl}/functions/v1/check-avatar-unlocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-function-secret': chainSecret,
        },
        body: JSON.stringify({ user_id: userId }),
      }).catch(() => {});

      // --- Fire-and-forget: Discord webhook for completed quests ---
      for (const completed of newlyCompleted) {
        const matchingQuest = relevantQuests.find(
          (q: { id: string; quest_type: string; target_value: number; reward_points: number; reward_avatar_id: string | null }) => q.id === completed.quest_id
        );
        fetch(`${projectUrl}/functions/v1/discord-webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-function-secret': chainSecret,
          },
          body: JSON.stringify({
            event_type: 'quest_complete',
            data: {
              username: body.username ?? 'A snuser',
              quest_name: matchingQuest?.quest_type ?? 'Unknown Quest',
              points: completed.reward_points,
            },
          }),
        }).catch(() => {});

        // If an avatar was unlocked, also fire an achievement event
        if (completed.reward_avatar_id) {
          fetch(`${projectUrl}/functions/v1/discord-webhook`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-internal-function-secret': chainSecret,
            },
            body: JSON.stringify({
              event_type: 'achievement',
              data: {
                username: body.username ?? 'A snuser',
                avatar_name: completed.reward_avatar_id,
              },
            }),
          }).catch(() => {});
        }
      }
    }

    console.log('update-quest-progress result', {
      userId,
      action,
      updated: updatedQuests.length,
      completed: newlyCompleted.length,
      requestId,
    });

    return new Response(
      JSON.stringify({ updated_quests: updatedQuests, newly_completed: newlyCompleted, requestId }),
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
