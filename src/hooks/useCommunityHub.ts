import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CommunityPost } from './useCommunityPosts';

export type CommunityCategory = 'all' | 'reviews' | 'flavor-talk' | 'new-releases' | 'tips' | 'general';
export type SortOption = 'newest' | 'most_liked' | 'most_discussed';

export interface HubQuestion {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  category: string;
  votes: number;
  answers_count: number;
  accepted_answer_id: string | null;
  is_resolved: boolean;
  created_at: string;
}

function applyPostSort(
  query: ReturnType<typeof supabase.from<'community_posts', any>['select']>,
  sort: SortOption,
) {
  if (sort === 'most_liked') {
    return query.order('likes_count', { ascending: false });
  }
  if (sort === 'most_discussed') {
    return query.order('comments_count', { ascending: false });
  }
  // newest (default)
  return query.order('created_at', { ascending: false });
}

function applyQuestionSort(
  query: ReturnType<typeof supabase.from<'community_questions', any>['select']>,
  sort: SortOption,
) {
  if (sort === 'most_liked') {
    return query.order('votes', { ascending: false });
  }
  if (sort === 'most_discussed') {
    return query.order('answers_count', { ascending: false });
  }
  // newest (default)
  return query.order('created_at', { ascending: false });
}

export function useCommunityHub(category: CommunityCategory, sort: SortOption) {
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['community_hub_posts', sort],
    queryFn: async (): Promise<CommunityPost[]> => {
      let query = supabase
        .from('community_posts')
        .select('id, product_id, user_id, body, photo_url, likes_count, comments_count, pinned, flagged, created_at')
        .is('product_id', null);

      query = applyPostSort(query as any, sort) as any;

      const { data: rows, error } = await query;
      if (error) throw error;
      if (!rows || rows.length === 0) return [];

      return rows.map((r) => ({
        ...r,
        profile: null,
        liked_by_me: false,
        tagged_products: [],
      }));
    },
    staleTime: 30_000,
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['community_hub_questions', category, sort],
    queryFn: async (): Promise<HubQuestion[]> => {
      let query = supabase
        .from('community_questions')
        .select('id, user_id, title, body, category, votes, answers_count, accepted_answer_id, is_resolved, created_at');

      if (category !== 'all') {
        query = query.eq('category', category) as any;
      }

      query = applyQuestionSort(query as any, sort) as any;

      const { data: rows, error } = await query;
      if (error) throw error;
      return rows ?? [];
    },
    staleTime: 30_000,
  });

  return {
    posts,
    questions,
    isLoading: postsLoading || questionsLoading,
  };
}
