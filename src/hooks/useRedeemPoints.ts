import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface RedeemResponse {
  success: boolean;
  redemption_id: string;
  voucher_code?: string;
}

/**
 * Mutation hook to redeem SnusPoints for a reward.
 * Invalidates the points balance query on success so the UI updates.
 */
export function useRedeemPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rewardType: string) => {
      return apiFetch<RedeemResponse>('redeem-points', {
        method: 'POST',
        body: { reward_type: rewardType },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points_balance'] });
      queryClient.invalidateQueries({ queryKey: ['snuspoints'] });
    },
  });
}
