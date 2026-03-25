import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ReputationLevel {
  level: number;
  levelName: string;
  badgeColor: string;
  perks: string[];
  lifetimeEarned: number;
  nextLevel: number | null;
  nextLevelName: string | null;
  nextLevelMinPoints: number | null;
  /** 0-1 progress toward next level; 1 if at max */
  progress: number;
  /** Points still needed to reach next level; 0 if at max */
  pointsToNext: number;
}

/* ------------------------------------------------------------------ */
/*  Fallback for unauthenticated / zero-point users                    */
/* ------------------------------------------------------------------ */

const DEFAULT_REPUTATION: ReputationLevel = {
  level: 1,
  levelName: 'Newcomer',
  badgeColor: 'gray',
  perks: ['Welcome spin bonus'],
  lifetimeEarned: 0,
  nextLevel: 2,
  nextLevelName: 'Regular',
  nextLevelMinPoints: 100,
  progress: 0,
  pointsToNext: 100,
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useReputation(userId: string | null) {
  return useQuery<ReputationLevel>({
    queryKey: ['reputation', userId],
    queryFn: async (): Promise<ReputationLevel> => {
      if (!userId) return DEFAULT_REPUTATION;

      const { data, error } = await supabase
        .from('user_reputation')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('user_reputation query failed', error);
        return DEFAULT_REPUTATION;
      }

      if (!data) return DEFAULT_REPUTATION;

      const row = data;
      const lifetimeEarned: number = row.lifetime_earned ?? 0;
      const nextMin: number | null = row.next_level_min_points ?? null;

      // Compute the min_points for the current level to get range
      const { data: currentLevelData } = await supabase
        .from('reputation_levels')
        .select('min_points')
        .eq('level', row.level)
        .single();

      const currentMin = currentLevelData?.min_points ?? 0;

      let progress = 1;
      let pointsToNext = 0;

      if (nextMin !== null) {
        const range = nextMin - currentMin;
        const earned = lifetimeEarned - currentMin;
        progress = range > 0 ? Math.min(earned / range, 1) : 1;
        pointsToNext = Math.max(nextMin - lifetimeEarned, 0);
      }

      return {
        level: row.level,
        levelName: row.level_name,
        badgeColor: row.badge_color,
        perks: Array.isArray(row.perks) ? row.perks : [],
        lifetimeEarned,
        nextLevel: row.next_level ?? null,
        nextLevelName: row.next_level_name ?? null,
        nextLevelMinPoints: nextMin,
        progress,
        pointsToNext,
      };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
