import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CommentProfile {
  display_name: string;
  avatar_id: string | null;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  flagged: boolean;
  created_at: string;
  profile: CommentProfile | null;
}

export function useCommunityComments(postId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['community_comments', postId],
    queryFn: async (): Promise<CommunityComment[]> => {
      if (!postId) return [];

      const { data: rows, error } = await supabase
        .from('community_comments')
        .select('id, post_id, user_id, body, flagged, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!rows || rows.length === 0) return [];

      // Batch-fetch user profiles
      const uniqueUserIds = [...new Set(rows.map((r) => r.user_id))];
      let profileMap: Record<string, CommentProfile> = {};

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

      return rows.map((r) => ({
        ...r,
        profile: profileMap[r.user_id] ?? null,
      }));
    },
    enabled: !!postId,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async ({ postId: pId, body }: { postId: string; body: string }) => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase.from('community_comments').insert({
        post_id: pId,
        user_id: userId,
        body,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_comments', postId] });
      // Also refresh posts to update comments_count
      queryClient.invalidateQueries({ queryKey: ['community_posts'] });
    },
  });

  const { mutateAsync: createCommentAsync } = createMutation;

  const addComment = useCallback(
    (pId: string, body: string) => createCommentAsync({ postId: pId, body }),
    [createCommentAsync],
  );

  return {
    comments,
    isLoading,
    addComment,
    isSubmitting: createMutation.isPending,
  };
}
