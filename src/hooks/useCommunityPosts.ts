import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PostProfile {
  display_name: string;
  avatar_id: string | null;
}

export interface TaggedProductInfo {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface CommunityPost {
  id: string;
  product_id: string;
  user_id: string;
  body: string;
  photo_url: string | null;
  likes_count: number;
  comments_count: number;
  pinned: boolean;
  flagged: boolean;
  created_at: string;
  profile: PostProfile | null;
  liked_by_me: boolean;
  tagged_products: TaggedProductInfo[];
}

export interface PollDraftPayload {
  question: string;
  options: string[];
}

export interface CreatePostPayload {
  product_id: string;
  body: string;
  photo_url?: string;
  tagged_product_ids?: string[];
  poll?: PollDraftPayload;
}

export function useCommunityPosts(productId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['community_posts', productId],
    queryFn: async (): Promise<CommunityPost[]> => {
      if (!productId) return [];

      const { data: rows, error } = await supabase
        .from('community_posts')
        .select('id, product_id, user_id, body, photo_url, likes_count, comments_count, pinned, flagged, created_at')
        .eq('product_id', productId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!rows || rows.length === 0) return [];

      // Batch-fetch user profiles
      const uniqueUserIds = [...new Set(rows.map((r) => r.user_id))];
      let profileMap: Record<string, PostProfile> = {};

      if (uniqueUserIds.length > 0) {
        const { data: profileRows } = await supabase
          .from('user_profiles')
          .select('user_id, display_name, avatar_id')
          .in('user_id', uniqueUserIds);

        if (profileRows) {
          for (const p of profileRows) {
            profileMap[p.user_id] = {
              display_name: p.display_name,
              avatar_id: p.avatar_id,
            };
          }
        }
      }

      // Check which posts the current user has liked
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      let likedPostIds = new Set<string>();

      if (currentUserId) {
        const postIds = rows.map((r) => r.id);
        const { data: likeRows } = await supabase
          .from('community_post_likes')
          .select('post_id')
          .eq('user_id', currentUserId)
          .in('post_id', postIds);

        if (likeRows) {
          likedPostIds = new Set(likeRows.map((l) => l.post_id));
        }
      }

      // Batch-fetch product tags for all posts
      const postIds = rows.map((r) => r.id);
      let tagMap: Record<string, TaggedProductInfo[]> = {};

      if (postIds.length > 0) {
        const { data: tagRows } = await supabase
          .from('community_post_product_tags')
          .select('post_id, product_id')
          .in('post_id', postIds);

        if (tagRows && tagRows.length > 0) {
          const tagProductIds = [...new Set(tagRows.map((t) => t.product_id))];
          const { data: productRows } = await supabase
            .from('products')
            .select('id, name, slug, image_url')
            .in('id', tagProductIds);

          const productLookup: Record<string, TaggedProductInfo> = {};
          if (productRows) {
            for (const p of productRows) {
              productLookup[p.id] = { id: p.id, name: p.name, slug: p.slug, image_url: p.image_url };
            }
          }

          for (const t of tagRows) {
            const info = productLookup[t.product_id];
            if (info) {
              (tagMap[t.post_id] ??= []).push(info);
            }
          }
        }
      }

      return rows.map((r) => ({
        ...r,
        profile: profileMap[r.user_id] ?? null,
        liked_by_me: likedPostIds.has(r.id),
        tagged_products: tagMap[r.id] ?? [],
      }));
    },
    enabled: !!productId,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data: newPost, error } = await supabase
        .from('community_posts')
        .insert({
          product_id: payload.product_id,
          user_id: userId,
          body: payload.body,
          ...(payload.photo_url ? { photo_url: payload.photo_url } : {}),
        })
        .select('id')
        .single();
      if (error) throw error;

      // Insert product tags if any
      if (payload.tagged_product_ids && payload.tagged_product_ids.length > 0) {
        const tagInserts = payload.tagged_product_ids.map((pid) => ({
          post_id: newPost.id,
          product_id: pid,
        }));
        const { error: tagError } = await supabase
          .from('community_post_product_tags')
          .insert(tagInserts);
        if (tagError) {
          console.error('Failed to insert product tags:', tagError);
          throw new Error('Post created but product tags could not be saved.');
        }
      }

      // Insert poll if any
      if (payload.poll && payload.poll.options.length >= 2) {
        const { data: newPoll, error: pollError } = await supabase
          .from('community_polls')
          .insert({
            post_id: newPost.id,
            question: payload.poll.question,
          })
          .select('id')
          .single();
        if (pollError) {
          console.error('Failed to insert poll:', pollError);
          throw new Error('Post created but poll could not be saved.');
        }

        const optionInserts = payload.poll.options.map((label, i) => ({
          poll_id: newPoll.id,
          label,
          sort_order: i,
        }));
        const { error: optError } = await supabase
          .from('community_poll_options')
          .insert(optionInserts);
        if (optError) {
          console.error('Failed to insert poll options:', optError);
          throw new Error('Post created but poll options could not be saved.');
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_posts', productId] });
      queryClient.invalidateQueries({ queryKey: ['community_polls'] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase.rpc('toggle_community_post_like', {
        p_post_id: postId,
      });
      if (error) throw error;
      return data as { liked: boolean; new_count: number }[];
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['community_posts', productId] });
      const prev = queryClient.getQueryData<CommunityPost[]>(['community_posts', productId]);
      if (prev) {
        queryClient.setQueryData<CommunityPost[]>(
          ['community_posts', productId],
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  liked_by_me: !p.liked_by_me,
                  likes_count: p.liked_by_me
                    ? Math.max(p.likes_count - 1, 0)
                    : p.likes_count + 1,
                }
              : p,
          ),
        );
      }
      return { prev };
    },
    onError: (_err, _postId, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['community_posts', productId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['community_posts', productId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_posts', productId] });
    },
  });

  const { mutateAsync: createPostAsync } = createMutation;
  const { mutateAsync: toggleLikeAsync } = likeMutation;
  const { mutateAsync: deletePostAsync } = deleteMutation;

  const createPost = useCallback(
    (payload: CreatePostPayload) => createPostAsync(payload),
    [createPostAsync],
  );

  const toggleLike = useCallback(
    (postId: string) => toggleLikeAsync(postId),
    [toggleLikeAsync],
  );

  const deletePost = useCallback(
    (postId: string) => deletePostAsync(postId),
    [deletePostAsync],
  );

  return {
    posts,
    isLoading,
    createPost,
    toggleLike,
    deletePost,
    isCreating: createMutation.isPending,
  };
}
