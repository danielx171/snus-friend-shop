import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useRef } from 'react';
import type { ReviewStats } from '@/hooks/useProductReviews';
import type { ProductReview } from '@/hooks/useProductReviews';

interface ReviewsQueryData extends ReviewStats {
  reviews: ProductReview[];
}

/**
 * Read the current user's id without an async network call when possible.
 * Shop.astro:30 sets window.__AUTH_STATE__ from Astro.locals.user on every
 * SSR page load; falling back to supabase.auth.getUser() handles SSG pages
 * that don't pre-populate the window global.
 */
async function getCurrentUserId(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    const w = window as unknown as { __AUTH_STATE__?: { id?: string } | null };
    const id = w.__AUTH_STATE__?.id;
    if (id) return id;
  }
  const { data: authData } = await supabase.auth.getUser();
  return authData?.user?.id ?? null;
}

/**
 * Fetches the set of review IDs the current user has liked for a given product.
 * Returns a toggle function with optimistic updates.
 */
export function useReviewLikes(productId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['review_likes', productId];
  const toastRef = useRef<((msg: { title: string; description: string; variant?: 'destructive' }) => void) | null>(null);

  const { data: likedIds = new Set<string>() } = useQuery({
    queryKey,
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!userId || !productId) return new Set<string>();

      // Only fetch likes for reviews belonging to this product
      const { data: rows } = await supabase
        .from('review_likes')
        .select('review_id, product_reviews!inner(product_id)')
        .eq('user_id', userId)
        .eq('product_reviews.product_id', productId);

      return new Set((rows ?? []).map((r) => r.review_id));
    },
    enabled: !!productId,
    staleTime: 60_000,
  });

  const toggleMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      // Check auth before calling RPC (avoid round-trip when window has the user)
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error('NOT_AUTHENTICATED');
      }

      const { data, error } = await supabase.rpc('toggle_review_like', {
        p_review_id: reviewId,
      });
      if (error) throw error;
      return { reviewId, liked: data as boolean };
    },
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Set<string>>(queryKey);
      const next = new Set(prev);

      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      queryClient.setQueryData(queryKey, next);

      // Also optimistically update the helpful_count on the review
      const reviewsKey = ['product_reviews', productId];
      const prevReviews = queryClient.getQueryData<ReviewsQueryData>(reviewsKey);

      if (prevReviews) {
        const delta = next.has(reviewId) ? 1 : -1;
        queryClient.setQueryData<ReviewsQueryData>(reviewsKey, {
          ...prevReviews,
          reviews: prevReviews.reviews.map((r) =>
            r.id === reviewId
              ? { ...r, helpful_count: Math.max(0, r.helpful_count + delta) }
              : r,
          ),
        });
      }

      return { prev, prevReviews };
    },
    onError: (_err, _reviewId, context) => {
      if (context?.prev) queryClient.setQueryData(queryKey, context.prev);
      if (context?.prevReviews) queryClient.setQueryData(['product_reviews', productId], context.prevReviews);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['product_reviews', productId] });
    },
  });

  // Use a ref to get a stable function reference for React.memo children
  const mutateRef = useRef(toggleMutation.mutate);
  mutateRef.current = toggleMutation.mutate;

  const toggleLike = useCallback(
    (reviewId: string) => mutateRef.current(reviewId),
    [],
  );

  return { likedIds, toggleLike };
}
