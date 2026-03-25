import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type MembershipTierRow = Tables<'membership_tiers'>;
export type UserMembershipRow = Tables<'user_memberships'>;

export interface MembershipData {
  membership: UserMembershipRow | null;
  tiers: MembershipTierRow[];
  currentTier: MembershipTierRow | null;
  nextTier: MembershipTierRow | null;
  /** Points still needed to reach the next tier (0 if already at highest) */
  pointsToNextTier: number;
  /** Progress percentage toward the next tier (100 if already at highest) */
  progressPct: number;
}

export function useMembership(userId: string | null) {
  return useQuery<MembershipData>({
    queryKey: ['membership', userId],
    queryFn: async (): Promise<MembershipData> => {
      // Always fetch tiers (public read)
      const { data: tiers, error: tiersError } = await supabase
        .from('membership_tiers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (tiersError) throw tiersError;

      const sortedTiers = tiers ?? [];

      if (!userId) {
        return {
          membership: null,
          tiers: sortedTiers,
          currentTier: sortedTiers[0] ?? null,
          nextTier: sortedTiers[1] ?? null,
          pointsToNextTier: sortedTiers[1]?.min_points_lifetime ?? 0,
          progressPct: 0,
        };
      }

      const { data: membership, error: membershipError } = await supabase
        .from('user_memberships')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (membershipError) throw membershipError;

      const lifetimePts = membership?.lifetime_points ?? 0;
      const currentTierId = membership?.tier_id ?? 'member';

      const currentTier = sortedTiers.find((t) => t.id === currentTierId) ?? sortedTiers[0] ?? null;
      const currentIdx = sortedTiers.findIndex((t) => t.id === currentTierId);
      const nextTier = currentIdx >= 0 && currentIdx < sortedTiers.length - 1
        ? sortedTiers[currentIdx + 1]
        : null;

      const pointsToNextTier = nextTier
        ? Math.max(nextTier.min_points_lifetime - lifetimePts, 0)
        : 0;

      const progressPct = nextTier
        ? Math.min(
            ((lifetimePts - (currentTier?.min_points_lifetime ?? 0)) /
              Math.max(nextTier.min_points_lifetime - (currentTier?.min_points_lifetime ?? 0), 1)) * 100,
            100,
          )
        : 100;

      return {
        membership,
        tiers: sortedTiers,
        currentTier,
        nextTier,
        pointsToNextTier,
        progressPct,
      };
    },
    staleTime: 60_000,
  });
}
