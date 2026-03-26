import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Avatar {
  id: string;
  name: string;
  image_url: string;
  rarity: string;
  sort_order: number;
  unlock_threshold: number;
  unlock_type: string;
}

export interface UserProfile {
  user_id: string;
  display_name: string;
  avatar_id: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  display_name?: string;
  avatar_id?: string | null;
  bio?: string | null;
}

export interface UseUserProfileResult {
  profile: UserProfile | null;
  avatars: Avatar[];
  unlockedAvatarIds: string[];
  isLoading: boolean;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

export function useUserProfile(userId: string | null): UseUserProfileResult {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['user_profile', userId],
    queryFn: async () => {
      if (!userId) return { profile: null, avatars: [], unlockedAvatarIds: [] };

      const [profileRes, avatarsRes, unlocksRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('user_id, display_name, avatar_id, bio, created_at, updated_at')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('avatars')
          .select('id, name, image_url, rarity, sort_order, unlock_threshold, unlock_type')
          .order('sort_order', { ascending: true }),
        supabase
          .from('user_avatar_unlocks')
          .select('avatar_id')
          .eq('user_id', userId),
      ]);

      let profile = profileRes.data as UserProfile | null;

      // Auto-create profile on first access
      if (!profile && !profileRes.error) {
        const { data: authData } = await supabase.auth.getUser();
        const displayName =
          authData?.user?.user_metadata?.full_name ??
          authData?.user?.user_metadata?.name ??
          authData?.user?.email?.split('@')[0] ??
          'User';

        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert({ user_id: userId, display_name: displayName })
          .select('user_id, display_name, avatar_id, bio, created_at, updated_at')
          .maybeSingle();

        profile = newProfile as UserProfile | null;
      }

      return {
        profile,
        avatars: (avatarsRes.data ?? []) as Avatar[],
        unlockedAvatarIds: (unlocksRes.data ?? []).map((r) => r.avatar_id),
      };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', userId] });
    },
  });

  return {
    profile: data?.profile ?? null,
    avatars: data?.avatars ?? [],
    unlockedAvatarIds: data?.unlockedAvatarIds ?? [],
    isLoading,
    updateProfile: (payload) => mutation.mutateAsync(payload),
  };
}
