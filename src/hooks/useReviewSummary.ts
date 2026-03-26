import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';

export interface ReviewSummary {
  summary_text: string;
  generated_at: string;
}

/**
 * Fetches the AI review summary for a product.
 * First checks the cached summary in Supabase, then triggers generation
 * if no cached summary exists and there are enough reviews.
 */
export function useReviewSummary(productId: string | undefined, reviewCount: number) {
  return useQuery({
    queryKey: ['review_summary', productId, reviewCount],
    queryFn: async (): Promise<ReviewSummary | null> => {
      if (!productId || reviewCount < 3) return null;

      // Check cached summary first
      const { data: cached } = await supabase
        .from('review_summaries')
        .select('summary_text, review_count_at_generation, generated_at')
        .eq('product_id', productId)
        .single();

      if (cached) {
        const delta = Math.abs(reviewCount - cached.review_count_at_generation);
        if (delta < 3) {
          return { summary_text: cached.summary_text, generated_at: cached.generated_at };
        }
      }

      // Need to generate or regenerate — call edge function
      try {
        const result = await apiFetch('generate-review-summary', {
          method: 'POST',
          body: { product_id: productId },
        });

        if (result.summary) {
          return {
            summary_text: result.summary,
            generated_at: result.generated_at,
          };
        }
      } catch {
        // If AI generation fails, return cached if available
        if (cached) {
          return { summary_text: cached.summary_text, generated_at: cached.generated_at };
        }
      }

      return null;
    },
    enabled: !!productId && reviewCount >= 3,
    staleTime: 300_000, // 5 minutes
    retry: false, // Don't retry AI calls
  });
}
