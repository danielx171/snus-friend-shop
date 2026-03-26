import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { useCallback, useMemo } from 'react';
import type { FlavorKey, StrengthKey } from '@/data/products';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type StrengthPref = 'light' | 'regular' | 'strong' | 'extra_strong';

export interface FlavorProfile {
  id: string;
  user_id: string;
  mint_score: number;
  fruit_score: number;
  sweet_score: number;
  bold_score: number;
  strength_pref: StrengthPref;
  profile_name: string;
  created_at: string;
  updated_at: string;
}

export interface FlavorProfileInput {
  mint_score: number;
  fruit_score: number;
  sweet_score: number;
  bold_score: number;
  strength_pref: StrengthPref;
  profile_name: string;
}

/* ------------------------------------------------------------------ */
/*  Archetype logic                                                    */
/* ------------------------------------------------------------------ */

export function computeArchetype(scores: {
  mint_score: number;
  fruit_score: number;
  sweet_score: number;
  bold_score: number;
}): string {
  const { mint_score, fruit_score, sweet_score, bold_score } = scores;
  const max = Math.max(mint_score, fruit_score, sweet_score, bold_score);

  if (max === 0) return 'Newcomer';

  // Multi-dominant (two or more tied at max)
  const dominant = [
    mint_score === max && 'mint',
    fruit_score === max && 'fruit',
    sweet_score === max && 'sweet',
    bold_score === max && 'bold',
  ].filter(Boolean);

  if (dominant.length >= 3) return 'Flavour Alchemist';
  if (dominant.length === 2) {
    const pair = dominant.sort().join('+');
    const dualNames: Record<string, string> = {
      'fruit+mint': 'Fresh Explorer',
      'mint+sweet': 'Cool Connoisseur',
      'bold+mint': 'Arctic Warrior',
      'fruit+sweet': 'Tropical Dreamer',
      'bold+fruit': 'Wild Spirit',
      'bold+sweet': 'Dark Indulger',
    };
    return dualNames[pair] ?? 'Flavour Mixer';
  }

  // Single dominant
  const singleNames: Record<string, string> = {
    mint: 'Frost Commander',
    fruit: 'Fruit Voyager',
    sweet: 'Sweet Tooth',
    bold: 'Bold Warrior',
  };
  return singleNames[dominant[0] as string] ?? 'Flavour Explorer';
}

/* ------------------------------------------------------------------ */
/*  Flavor-to-product matching                                         */
/* ------------------------------------------------------------------ */

const FLAVOR_SCORE_MAP: Record<FlavorKey, keyof FlavorProfileInput> = {
  mint: 'mint_score',
  berry: 'fruit_score',
  fruit: 'fruit_score',
  citrus: 'fruit_score',
  tropical: 'fruit_score',
  vanilla: 'sweet_score',
  cola: 'sweet_score',
  coffee: 'bold_score',
  licorice: 'bold_score',
};

const STRENGTH_MAP: Record<StrengthKey, StrengthPref> = {
  normal: 'light',
  strong: 'regular',
  extraStrong: 'strong',
  ultraStrong: 'extra_strong',
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useFlavorProfile(userId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ['flavor_profile', userId];

  const { data: profile, isLoading } = useQuery<FlavorProfile | null>({
    queryKey,
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('flavor_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) {
        console.error('flavor_profiles query failed', error);
        return null;
      }
      return data as FlavorProfile | null;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  const saveMutation = useMutation({
    mutationFn: async (input: FlavorProfileInput) => {
      if (!userId) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('flavor_profiles')
        .upsert(
          { user_id: userId, ...input },
          { onConflict: 'user_id' },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const saveProfile = useCallback(
    (input: FlavorProfileInput) => saveMutation.mutateAsync(input),
    [saveMutation],
  );

  // Recommendations based on profile
  const { data: allProducts = [] } = useCatalogProducts();

  const recommendations = useMemo(() => {
    if (!profile || allProducts.length === 0) return [];

    const scores: Record<string, number> = {
      mint_score: profile.mint_score,
      fruit_score: profile.fruit_score,
      sweet_score: profile.sweet_score,
      bold_score: profile.bold_score,
    };

    return allProducts
      .map((product) => {
        const scoreKey = FLAVOR_SCORE_MAP[product.flavorKey];
        const flavorMatch = scoreKey ? (scores[scoreKey] ?? 0) : 0;

        // Strength match bonus (0 or 20)
        const productStrength = STRENGTH_MAP[product.strengthKey] ?? 'regular';
        const strengthMatch = productStrength === profile.strength_pref ? 20 : 0;

        return { product, relevance: flavorMatch + strengthMatch };
      })
      .filter((r) => r.relevance > 30)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8)
      .map((r) => r.product);
  }, [profile, allProducts]);

  return {
    profile,
    isLoading,
    saveProfile,
    isSaving: saveMutation.isPending,
    recommendations,
  };
}
