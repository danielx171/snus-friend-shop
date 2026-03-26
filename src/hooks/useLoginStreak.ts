import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LoginStreakData {
  streak: number;
  points: number;
  bonus: number;
  alreadyClaimed: boolean;
  longestStreak: number;
  totalDays: number;
}

export function useLoginStreak(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const hasToasted = useRef(false);

  const query = useQuery<LoginStreakData>({
    queryKey: ['login-streak', userId],
    queryFn: async (): Promise<LoginStreakData> => {
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('record_daily_login', {
        p_user_id: userId,
      });

      if (error) throw error;

      const result = data as unknown as {
        streak: number;
        points: number;
        bonus: number;
        already_claimed: boolean;
        longest?: number;
        total_days?: number;
      };

      return {
        streak: result.streak,
        points: result.points,
        bonus: result.bonus,
        alreadyClaimed: result.already_claimed,
        longestStreak: result.longest ?? result.streak,
        totalDays: result.total_days ?? 0,
      };
    },
    enabled: !!userId,
    staleTime: Infinity,
    retry: false,
  });

  // Show toast when points are earned (only once per session)
  useEffect(() => {
    if (!query.data || hasToasted.current) return;
    if (query.data.alreadyClaimed) return;

    hasToasted.current = true;

    const { streak, points, bonus } = query.data;
    const bonusText = bonus > 0 ? ` +${bonus} bonus!` : '';

    toast({
      title: `Day ${streak} streak! +${points} SnusPoints`,
      description: bonusText || 'Keep it up! Visit daily to build your streak.',
    });

    // Invalidate points balance so the header updates
    queryClient.invalidateQueries({ queryKey: ['snuspoints'] });
  }, [query.data, toast, queryClient]);

  return {
    streak: query.data?.streak ?? 0,
    points: query.data?.points ?? 0,
    bonus: query.data?.bonus ?? 0,
    alreadyClaimed: query.data?.alreadyClaimed ?? false,
    longestStreak: query.data?.longestStreak ?? 0,
    totalDays: query.data?.totalDays ?? 0,
    isLoading: query.isLoading,
  };
}
