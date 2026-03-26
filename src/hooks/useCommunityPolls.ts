import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PollOption {
  id: string;
  label: string;
  votes_count: number;
  sort_order: number;
  /** Whether the current user voted for this option */
  voted_by_me: boolean;
}

export interface PollData {
  id: string;
  post_id: string;
  question: string;
  ends_at: string | null;
  options: PollOption[];
  total_votes: number;
  has_ended: boolean;
}

/**
 * Fetches polls for a list of post IDs and provides a vote mutation.
 * Designed to be called from CommunityBoard alongside useCommunityPosts.
 */
export function useCommunityPolls(postIds: string[]) {
  const queryClient = useQueryClient();

  const { data: pollMap = {}, isLoading } = useQuery({
    queryKey: ['community_polls', postIds],
    queryFn: async (): Promise<Record<string, PollData>> => {
      if (postIds.length === 0) return {};

      // Fetch polls for these posts
      const { data: polls, error: pollError } = await supabase
        .from('community_polls')
        .select('id, post_id, question, ends_at')
        .in('post_id', postIds);

      if (pollError) throw pollError;
      if (!polls || polls.length === 0) return {};

      const pollIds = polls.map((p) => p.id);

      // Fetch options for all polls
      const { data: options, error: optError } = await supabase
        .from('community_poll_options')
        .select('id, poll_id, label, votes_count, sort_order')
        .in('poll_id', pollIds)
        .order('sort_order', { ascending: true });

      if (optError) throw optError;

      // Fetch current user's votes
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      let myVotes = new Map<string, string>(); // poll_id -> option_id

      if (currentUserId) {
        const { data: voteRows } = await supabase
          .from('community_poll_votes')
          .select('poll_id, option_id')
          .eq('user_id', currentUserId)
          .in('poll_id', pollIds);

        if (voteRows) {
          for (const v of voteRows) {
            myVotes.set(v.poll_id, v.option_id);
          }
        }
      }

      // Build option map grouped by poll_id
      const optionsByPoll: Record<string, PollOption[]> = {};
      for (const opt of options ?? []) {
        const myVote = myVotes.get(opt.poll_id);
        const pollOpt: PollOption = {
          id: opt.id,
          label: opt.label,
          votes_count: opt.votes_count,
          sort_order: opt.sort_order,
          voted_by_me: myVote === opt.id,
        };
        (optionsByPoll[opt.poll_id] ??= []).push(pollOpt);
      }

      // Build result map keyed by post_id
      const result: Record<string, PollData> = {};
      const now = Date.now();
      for (const poll of polls) {
        const opts = optionsByPoll[poll.id] ?? [];
        const totalVotes = opts.reduce((sum, o) => sum + o.votes_count, 0);
        const hasEnded = poll.ends_at ? new Date(poll.ends_at).getTime() < now : false;

        result[poll.post_id] = {
          id: poll.id,
          post_id: poll.post_id,
          question: poll.question,
          ends_at: poll.ends_at,
          options: opts,
          total_votes: totalVotes,
          has_ended: hasEnded,
        };
      }

      return result;
    },
    enabled: postIds.length > 0,
    staleTime: 30_000,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ pollId, optionId }: { pollId: string; optionId: string }) => {
      const { data, error } = await supabase.rpc('cast_poll_vote', {
        p_poll_id: pollId,
        p_option_id: optionId,
      });
      if (error) throw error;
      return data as { voted: boolean; option_id: string; votes_count: number }[];
    },
    onMutate: async ({ pollId, optionId }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['community_polls', postIds] });
      const prev = queryClient.getQueryData<Record<string, PollData>>(['community_polls', postIds]);

      if (prev) {
        const updated = { ...prev };
        // Find the poll by pollId
        for (const postId of Object.keys(updated)) {
          const poll = updated[postId];
          if (poll.id !== pollId) continue;

          const myCurrentVote = poll.options.find((o) => o.voted_by_me);
          const newOptions = poll.options.map((o) => {
            let newVotesCount = o.votes_count;
            let newVotedByMe = o.voted_by_me;

            if (myCurrentVote) {
              if (myCurrentVote.id === optionId) {
                // Toggle off
                if (o.id === optionId) {
                  newVotesCount = Math.max(0, o.votes_count - 1);
                  newVotedByMe = false;
                }
              } else {
                // Switch vote
                if (o.id === myCurrentVote.id) {
                  newVotesCount = Math.max(0, o.votes_count - 1);
                  newVotedByMe = false;
                }
                if (o.id === optionId) {
                  newVotesCount = o.votes_count + 1;
                  newVotedByMe = true;
                }
              }
            } else {
              // New vote
              if (o.id === optionId) {
                newVotesCount = o.votes_count + 1;
                newVotedByMe = true;
              }
            }

            return { ...o, votes_count: newVotesCount, voted_by_me: newVotedByMe };
          });

          updated[postId] = {
            ...poll,
            options: newOptions,
            total_votes: newOptions.reduce((sum, o) => sum + o.votes_count, 0),
          };
          break;
        }

        queryClient.setQueryData(['community_polls', postIds], updated);
      }

      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['community_polls', postIds], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['community_polls', postIds] });
    },
  });

  const { mutateAsync: voteAsync } = voteMutation;

  const castVote = useCallback(
    (pollId: string, optionId: string) => voteAsync({ pollId, optionId }),
    [voteAsync],
  );

  return {
    pollMap,
    isLoading,
    castVote,
    isVoting: voteMutation.isPending,
  };
}
