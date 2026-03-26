import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CommunityAnswer {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  votes: number;
  is_accepted: boolean;
  created_at: string;
}

export function useCommunityAnswers(questionId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: answers = [], isLoading } = useQuery({
    queryKey: ['community_answers', questionId],
    queryFn: async (): Promise<CommunityAnswer[]> => {
      if (!questionId) return [];

      const { data: rows, error } = await supabase
        .from('community_answers')
        .select('id, question_id, user_id, body, votes, is_accepted, created_at')
        .eq('question_id', questionId)
        .order('is_accepted', { ascending: false })
        .order('votes', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return rows ?? [];
    },
    enabled: !!questionId,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async ({ body }: { body: string }) => {
      if (!questionId) throw new Error('No question ID');

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase.from('community_answers').insert({
        question_id: questionId,
        user_id: userId,
        body,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community_answers', questionId] });
      queryClient.invalidateQueries({ queryKey: ['community_hub_questions'] });
    },
  });

  const { mutateAsync: submitAnswerAsync } = createMutation;

  const submitAnswer = useCallback(
    (body: string) => submitAnswerAsync({ body }),
    [submitAnswerAsync],
  );

  return {
    answers,
    isLoading,
    submitAnswer,
    isSubmitting: createMutation.isPending,
  };
}
