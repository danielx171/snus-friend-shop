import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ChallengeType =
  | 'review_count'
  | 'order_count'
  | 'community_posts'
  | 'referral_count';

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: ChallengeType;
  target_value: number;
  reward_points: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at: string;
}

export interface ChallengeWithProgress extends WeeklyChallenge {
  /** User's current progress (0 if not joined) */
  progress: number;
  /** Whether the user has joined this challenge */
  joined: boolean;
  /** Timestamp when completed, null if not yet */
  completedAt: string | null;
}

/* ------------------------------------------------------------------ */
/*  Hook: useWeeklyChallenges                                          */
/* ------------------------------------------------------------------ */

export function useWeeklyChallenges(userId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<ChallengeWithProgress[]>({
    queryKey: ['weekly-challenges', userId],
    queryFn: async (): Promise<ChallengeWithProgress[]> => {
      const now = new Date().toISOString();

      // Fetch active challenges that are currently running
      const { data: challengesData, error: challengesError } = await supabase
        .from('weekly_challenges')
        .select('id, title, description, challenge_type, target_value, reward_points, starts_at, ends_at, is_active, created_at')
        .eq('is_active', true)
        .lte('starts_at', now)
        .gte('ends_at', now)
        .order('ends_at', { ascending: true });

      if (challengesError) {
        console.error('weekly_challenges query failed', challengesError);
        return [];
      }

      const challenges = (challengesData ?? []) as WeeklyChallenge[];

      // If no user, return challenges with zero progress
      if (!userId) {
        return challenges.map((c) => ({
          ...c,
          progress: 0,
          joined: false,
          completedAt: null,
        }));
      }

      // Fetch user participation
      const challengeIds = challenges.map((c) => c.id);

      if (challengeIds.length === 0) {
        return [];
      }

      const { data: participationData, error: participationError } = await supabase
        .from('challenge_participants')
        .select('challenge_id, progress, completed_at')
        .eq('user_id', userId)
        .in('challenge_id', challengeIds);

      if (participationError) {
        console.error('challenge_participants query failed', participationError);
      }

      const participationMap: Record<string, {
        progress: number;
        completed_at: string | null;
      }> = {};

      for (const p of participationData ?? []) {
        participationMap[p.challenge_id] = p;
      }

      return challenges.map((c) => {
        const part = participationMap[c.id];
        return {
          ...c,
          progress: part?.progress ?? 0,
          joined: !!part,
          completedAt: part?.completed_at ?? null,
        };
      });
    },
    staleTime: 60_000,
  });

  /* ---- Join challenge mutation ---- */
  const joinChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('challenge_participants')
        .insert({ challenge_id: challengeId, user_id: userId, progress: 0 });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-challenges', userId] });
    },
  });

  return { ...query, joinChallenge };
}
