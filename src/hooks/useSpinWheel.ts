import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';

export interface SpinResult {
  prize_key: string;
  prize_label: string;
  prize_type: 'points' | 'discount' | 'free_product' | 'jackpot' | 'nothing';
  value: number;
  voucher_id?: string;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check if the current user already spun today.
 * Returns true when a spin record exists for today's date.
 */
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

/**
 * Mutation that calls the spin-wheel edge function.
 * Invalidates spin status + points queries on success.
 */
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
