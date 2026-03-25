import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface AchievementWithProgress {
  id: string;
  slug: string;
  category: string;
  tier: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  points_reward: number;
  sort_order: number;
  created_at: string;
  progress: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

export const TIER_ORDER: Record<string, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  diamond: 3,
  single: 4,
};

export const TIER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  bronze: {
    bg: 'bg-orange-900/20',
    border: 'border-orange-700/30',
    text: 'text-orange-400',
  },
  silver: {
    bg: 'bg-slate-400/15',
    border: 'border-slate-400/30',
    text: 'text-slate-300',
  },
  gold: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
  },
  diamond: {
    bg: 'bg-cyan-400/15',
    border: 'border-cyan-400/30',
    text: 'text-cyan-300',
  },
  single: {
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

export function groupByCategory(
  achievements: AchievementWithProgress[]
): Record<string, AchievementWithProgress[]> {
  const grouped: Record<string, AchievementWithProgress[]> = {};

  for (const achievement of achievements) {
    const { category } = achievement;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(achievement);
  }

  // Sort within each group by sort_order
  for (const category of Object.keys(grouped)) {
    grouped[category].sort((a, b) => a.sort_order - b.sort_order);
  }

  return grouped;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useAchievements(userId: string | null) {
  return useQuery({
    queryKey: ['achievements', userId],
    queryFn: async (): Promise<{
      achievements: AchievementWithProgress[];
      grouped: Record<string, AchievementWithProgress[]>;
      unlockedCount: number;
      totalCount: number;
    }> => {
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('id, slug, category, tier, title, description, icon, threshold, points_reward, sort_order, created_at')
        .order('sort_order', { ascending: true });

      if (achievementsError) {
        console.error('achievements query failed', achievementsError);
        return { achievements: [], grouped: {}, unlockedCount: 0, totalCount: 0 };
      }

      const base = (achievementsData ?? []) as Array<{
        id: string;
        slug: string;
        category: string;
        tier: string;
        title: string;
        description: string;
        icon: string;
        threshold: number;
        points_reward: number;
        sort_order: number;
        created_at: string;
      }>;

      // No user — return with zero progress
      if (!userId) {
        const achievements: AchievementWithProgress[] = base.map((a) => ({
          ...a,
          progress: 0,
          unlocked: false,
          unlocked_at: null,
        }));
        return {
          achievements,
          grouped: groupByCategory(achievements),
          unlockedCount: 0,
          totalCount: achievements.length,
        };
      }

      // Fetch user progress
      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id, progress, unlocked_at')
        .eq('user_id', userId);

      if (userAchievementsError) {
        console.error('user_achievements query failed', userAchievementsError);
      }

      const progressMap: Record<string, { progress: number; unlocked_at: string | null }> = {};
      for (const ua of userAchievementsData ?? []) {
        progressMap[ua.achievement_id] = {
          progress: ua.progress,
          unlocked_at: ua.unlocked_at,
        };
      }

      const achievements: AchievementWithProgress[] = base.map((a) => {
        const prog = progressMap[a.id];
        const progress = prog?.progress ?? 0;
        const unlocked_at = prog?.unlocked_at ?? null;
        return {
          ...a,
          progress,
          unlocked: unlocked_at !== null || progress >= a.threshold,
          unlocked_at,
        };
      });

      const unlockedCount = achievements.filter((a) => a.unlocked).length;

      return {
        achievements,
        grouped: groupByCategory(achievements),
        unlockedCount,
        totalCount: achievements.length,
      };
    },
    staleTime: 60_000,
  });
}
