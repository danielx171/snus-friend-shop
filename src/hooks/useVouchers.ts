import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Voucher {
  id: string;
  type: 'discount_pct' | 'free_product' | 'free_month';
  value: Record<string, unknown>;
  status: 'active' | 'used' | 'expired';
  source: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export function useVouchers(userId: string | null) {
  return useQuery<Voucher[]>({
    queryKey: ['vouchers', userId],
    queryFn: async (): Promise<Voucher[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('vouchers')
        .select('id, type, value, status, source, expires_at, used_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('vouchers query failed', error);
        return [];
      }

      return (data ?? []) as unknown as Voucher[];
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
