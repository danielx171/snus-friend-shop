import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// These tables exist in the DB but aren't in the auto-generated types yet.
// Use the raw client to query them safely.
const db = supabase as unknown as {
  from: (table: string) => ReturnType<typeof supabase.from>;
};

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
    queryFn: async (): Promise<SnusPointsData> => {
      if (!userId) return { balance: 0, lifetimeEarned: 0, transactions: [] };

      const [balanceRes, txRes] = await Promise.all([
        db
          .from('points_balances')
          .select('balance, lifetime_earned')
          .eq('user_id', userId)
          .maybeSingle(),
        db
          .from('points_transactions')
          .select('id, points, reason, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      const bal = balanceRes.data as Record<string, unknown> | null;
      const txData = txRes.data as Record<string, unknown>[] | null;

      return {
        balance: (bal?.balance as number) ?? 0,
        lifetimeEarned: (bal?.lifetime_earned as number) ?? 0,
        transactions: (txData ?? []) as SnusPointsData['transactions'],
      };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
