import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseReferralReturn {
  code: string | null;
  uses: number;
  isLoading: boolean;
  shareUrl: string | null;
}

export function useReferral(): UseReferralReturn {
  const { data, isLoading } = useQuery({
    queryKey: ['referral_code'],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) return null;

      // Get or create the referral code
      const { data: code, error } = await supabase.rpc('get_or_create_referral_code', {
        p_user_id: userId,
      });
      if (error) throw error;

      // Fetch uses count
      const { data: rows } = await supabase
        .from('referral_codes')
        .select('uses')
        .eq('user_id', userId)
        .limit(1)
        .single();

      return {
        code: code as string,
        uses: rows?.uses ?? 0,
      };
    },
    staleTime: 60_000,
  });

  const code = data?.code ?? null;

  return {
    code,
    uses: data?.uses ?? 0,
    isLoading,
    shareUrl: code ? `https://snusfriends.com/register?ref=${code}` : null,
  };
}
