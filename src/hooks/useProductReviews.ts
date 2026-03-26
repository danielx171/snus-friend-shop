import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';

export interface ReviewProfile {
  display_name: string;
  avatar_id: string | null;
  avatar_image_url?: string | null;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  photo_urls: string[];
  helpful_count: number;
  flagged: boolean;
  created_at: string;
  profile: ReviewProfile | null;
  verified_buyer: boolean;
}

export interface SubmitReviewPayload {
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  pros?: string[];
  cons?: string[];
  photo_urls?: string[];
}

export interface ReviewStats {
  avgRating: number;
  totalCount: number;
  distribution: { stars: number; count: number }[];
}

export interface UseProductReviewsResult extends ReviewStats {
  reviews: ProductReview[];
  isLoading: boolean;
  submitReview: (payload: SubmitReviewPayload) => Promise<void>;
  flagReview: (reviewId: string) => Promise<void>;
}

export function useProductReviews(productId: string | undefined): UseProductReviewsResult {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product_reviews', productId],
    queryFn: async () => {
      if (!productId) return { reviews: [], avgRating: 0, totalCount: 0, distribution: [] };

      // Fetch reviews (unflagged only)
      const { data: reviewRows, error: reviewErr } = await supabase
        .from('product_reviews')
        .select('id, product_id, user_id, rating, title, body, pros, cons, photo_urls, helpful_count, flagged, created_at')
        .eq('product_id', productId)
        .eq('flagged', false)
        .order('created_at', { ascending: false });

      if (reviewErr) throw reviewErr;
      const rows = reviewRows ?? [];

      // Batch-fetch user profiles for unique user_ids
      const uniqueUserIds = [...new Set(rows.map((r) => r.user_id))];
      let profileMap: Record<string, ReviewProfile> = {};

      if (uniqueUserIds.length > 0) {
        const { data: profileRows } = await supabase
          .from('user_profiles')
          .select('user_id, display_name, avatar_id')
          .in('user_id', uniqueUserIds);

        if (profileRows) {
          // For profiles that have an avatar_id, fetch the avatar image_url
          const avatarIds = [...new Set(profileRows.map((p) => p.avatar_id).filter(Boolean) as string[])];
          let avatarMap: Record<string, string> = {};

          if (avatarIds.length > 0) {
            const { data: avatarRows } = await supabase
              .from('avatars')
              .select('id, image_url')
              .in('id', avatarIds);

            if (avatarRows) {
              for (const av of avatarRows) {
                avatarMap[av.id] = av.image_url;
              }
            }
          }

          for (const p of profileRows) {
            profileMap[p.user_id] = {
              display_name: p.display_name,
              avatar_id: p.avatar_id,
              avatar_image_url: p.avatar_id ? (avatarMap[p.avatar_id] ?? null) : null,
            };
          }
        }
      }

      // Batch-check verified buyer status: find which reviewers have a completed order
      // containing this product in their line_items_snapshot
      let verifiedBuyerIds = new Set<string>();
      if (uniqueUserIds.length > 0) {
        const { data: orderRows } = await supabase
          .from('orders')
          .select('user_id, line_items_snapshot')
          .in('user_id', uniqueUserIds)
          .eq('checkout_status', 'complete');

        if (orderRows) {
          for (const order of orderRows) {
            if (!order.user_id || verifiedBuyerIds.has(order.user_id)) continue;
            // line_items_snapshot is JSON — check if product_id appears in it
            const snapshot = order.line_items_snapshot;
            if (snapshot && typeof snapshot === 'object') {
              const items = Array.isArray(snapshot) ? snapshot : [];
              const hasProduct = items.some(
                (item: Record<string, unknown>) =>
                  item && (item.product_id === productId || item.id === productId),
              );
              if (hasProduct) verifiedBuyerIds.add(order.user_id);
            }
          }
        }
      }

      // Merge reviews with profiles and verified buyer status
      const reviews: ProductReview[] = rows.map((r) => ({
        ...r,
        profile: profileMap[r.user_id] ?? null,
        verified_buyer: verifiedBuyerIds.has(r.user_id),
      }));

      // Aggregate stats
      const totalCount = reviews.length;
      const avgRating =
        totalCount > 0
          ? reviews.reduce((s, r) => s + r.rating, 0) / totalCount
          : 0;

      const distribution = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: reviews.filter((r) => r.rating === stars).length,
      }));

      return { reviews, avgRating, totalCount, distribution };
    },
    enabled: !!productId,
    staleTime: 60_000,
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      const { error } = await supabase.from('product_reviews').insert({
        product_id: payload.product_id,
        user_id: payload.user_id,
        rating: payload.rating,
        title: payload.title,
        body: payload.body,
        ...(payload.pros?.length ? { pros: payload.pros } : {}),
        ...(payload.cons?.length ? { cons: payload.cons } : {}),
        ...(payload.photo_urls?.length ? { photo_urls: payload.photo_urls } : {}),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_reviews', productId] });
      // Fire-and-forget quest + avatar progress after review
      apiFetch('update-quest-progress', { method: 'POST', body: { action: 'review_submitted' } }).catch(() => {});
      apiFetch('check-avatar-unlocks', { method: 'POST' }).catch(() => {});
    },
  });

  const flagMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase.rpc('flag_review', { review_id: reviewId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_reviews', productId] });
    },
  });

  return {
    reviews: data?.reviews ?? [],
    avgRating: data?.avgRating ?? 0,
    totalCount: data?.totalCount ?? 0,
    distribution: data?.distribution ?? [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 })),
    isLoading,
    submitReview: (payload) => submitMutation.mutateAsync(payload),
    flagReview: (reviewId) => flagMutation.mutateAsync(reviewId),
  };
}
