import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SnusPointsData {
  balance: number;
  lifetimeEarned: number;
  transactions: {
    id: string;
    points: number;
    reason: string;
    created_at: string;
  }[];
}

export function useSnusPoints(userId: string | null) {
  return useQuery<SnusPointsData>({
    queryKey: ['snuspoints', userId],
    queryFn: async () => {
      if (!userId) return { balance: 0, lifetimeEarned: 0, transactions: [] };

      const [balanceRes, txRes] = await Promise.all([
        supabase
          .from('points_balances')
          .select('balance, lifetime_earned')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('points_transactions')
          .select('id, points, reason, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      return {
        balance: balanceRes.data?.balance ?? 0,
        lifetimeEarned: balanceRes.data?.lifetime_earned ?? 0,
        transactions: txRes.data ?? [],
      };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
