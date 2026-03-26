import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  display_name: string | null;
  avatar_url: string | null;
}

export function useLeaderboard() {
  const { data, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard_top_users')
        .select('user_id, total_points, display_name, avatar_url');

      if (error) throw error;
      return (data ?? []) as LeaderboardEntry[];
    },
    staleTime: 5 * 60_000, // 5 minutes — leaderboard doesn't need real-time updates
  });

  return { leaders: data ?? [], isLoading };
}
