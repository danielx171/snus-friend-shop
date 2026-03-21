import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';

export interface PrizeDisplay {
  icon: string;
  title: string;
  description: string;
  type: 'points' | 'voucher' | 'jackpot';
}

export interface SpinResult {
  prize_key: string;
  prize_display: PrizeDisplay;
  voucher_id?: string;
  points_awarded?: number;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useSpinStatus(userId: string | null) {
  return useQuery({
    queryKey: ['spin-status', userId, todayISO()],
    queryFn: async (): Promise<boolean> => {
      if (!userId) return false;

      const { data, error } = await supabase
        .from('daily_spins')
        .select('id')
        .eq('user_id', userId)
        .eq('spin_date', todayISO())
        .maybeSingle();

      if (error) {
        console.error('spin-status query failed', error);
        return false;
      }

      return !!data;
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useSpinWheel() {
  const queryClient = useQueryClient();

  return useMutation<SpinResult, Error>({
    mutationFn: async () => {
      return apiFetch<SpinResult>('spin-wheel', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spin-status'] });
      queryClient.invalidateQueries({ queryKey: ['snuspoints'] });
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });
}
