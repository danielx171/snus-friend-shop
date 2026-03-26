import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Quest {
  id: string;
  title: string;
  description: string;
  quest_type: string;
  target_value: number;
  reward_points: number;
  reward_avatar_id: string | null;
  sort_order: number;
  time_limit_days: number | null;
  active: boolean;
}

export interface QuestWithProgress extends Quest {
  currentValue: number;
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
  // resolved avatar name + rarity if a reward avatar exists
  rewardAvatarName: string | null;
  rewardAvatarRarity: string | null;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useQuests(userId: string | null) {
  return useQuery<QuestWithProgress[]>({
    queryKey: ['quests', userId],
    queryFn: async (): Promise<QuestWithProgress[]> => {
      // Always fetch active quests
      const { data: questsData, error: questsError } = await supabase
        .from('quests')
        .select('id, title, description, quest_type, target_value, reward_points, reward_avatar_id, sort_order, time_limit_days, active')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (questsError) {
        console.error('quests query failed', questsError);
        return [];
      }

      const quests = (questsData ?? []) as Quest[];

      // Resolve avatar names for reward avatars
      const avatarIds = quests
        .map((q) => q.reward_avatar_id)
        .filter((id): id is string => id !== null);

      const avatarMap: Record<string, { name: string; rarity: string }> = {};

      if (avatarIds.length > 0) {
        const { data: avatarsData } = await supabase
          .from('avatars')
          .select('id, name, rarity')
          .in('id', avatarIds);

        for (const av of avatarsData ?? []) {
          avatarMap[av.id] = { name: av.name, rarity: av.rarity };
        }
      }

      // If no user, return quests with zero progress
      if (!userId) {
        return quests.map((q) => ({
          ...q,
          currentValue: 0,
          completed: false,
          startedAt: null,
          completedAt: null,
          rewardAvatarName: q.reward_avatar_id ? (avatarMap[q.reward_avatar_id]?.name ?? null) : null,
          rewardAvatarRarity: q.reward_avatar_id ? (avatarMap[q.reward_avatar_id]?.rarity ?? null) : null,
        }));
      }

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_quest_progress')
        .select('quest_id, current_value, completed, started_at, completed_at')
        .eq('user_id', userId);

      if (progressError) {
        console.error('user_quest_progress query failed', progressError);
      }

      const progressMap: Record<string, {
        current_value: number;
        completed: boolean;
        started_at: string;
        completed_at: string | null;
      }> = {};

      for (const p of progressData ?? []) {
        progressMap[p.quest_id] = p;
      }

      return quests.map((q) => {
        const prog = progressMap[q.id];
        return {
          ...q,
          currentValue: prog?.current_value ?? 0,
          completed: prog?.completed ?? false,
          startedAt: prog?.started_at ?? null,
          completedAt: prog?.completed_at ?? null,
          rewardAvatarName: q.reward_avatar_id ? (avatarMap[q.reward_avatar_id]?.name ?? null) : null,
          rewardAvatarRarity: q.reward_avatar_id ? (avatarMap[q.reward_avatar_id]?.rarity ?? null) : null,
        };
      });
    },
    staleTime: 60_000,
  });
}
