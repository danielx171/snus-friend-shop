import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AvatarWithUnlockInfo {
  id: string;
  name: string;
  image_url: string;
  rarity: string;
  sort_order: number;
  unlock_type: string;
  unlock_threshold: number;
  isUnlocked: boolean;
  /** Quest title that rewards this avatar, if any */
  unlockQuestTitle: string | null;
  /** Human-readable description of how to unlock */
  unlockHint: string;
}

export interface UseAvatarSelectorResult {
  avatars: AvatarWithUnlockInfo[];
  selectedAvatarId: string | null;
  isLoading: boolean;
  isSelecting: boolean;
  selectAvatar: (avatarId: string) => Promise<void>;
  error: string | null;
}

/* ------------------------------------------------------------------ */
/*  Unlock hint builder                                                */
/* ------------------------------------------------------------------ */

function buildUnlockHint(
  avatar: { unlock_type: string; unlock_threshold: number },
  questTitle: string | null,
): string {
  if (questTitle) return `Complete quest: ${questTitle}`;

  switch (avatar.unlock_type) {
    case 'quest':
      return 'Complete a special quest';
    case 'points':
      return `Earn ${avatar.unlock_threshold.toLocaleString()} SnusPoints`;
    case 'orders':
      return `Place ${avatar.unlock_threshold} order${avatar.unlock_threshold !== 1 ? 's' : ''}`;
    case 'reviews':
      return `Write ${avatar.unlock_threshold} review${avatar.unlock_threshold !== 1 ? 's' : ''}`;
    case 'level':
      return `Reach level ${avatar.unlock_threshold}`;
    case 'free':
      return 'Available to everyone';
    default:
      return 'Keep exploring to unlock';
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAvatarSelector(userId: string | null): UseAvatarSelectorResult {
  const queryClient = useQueryClient();

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['avatar_selector', userId],
    queryFn: async () => {
      // Fetch all avatars, user unlocks, user profile, and quests that reward avatars
      const [avatarsRes, unlocksRes, profileRes, questsRes] = await Promise.all([
        supabase
          .from('avatars')
          .select('id, name, image_url, rarity, sort_order, unlock_threshold, unlock_type')
          .order('sort_order', { ascending: true }),
        userId
          ? supabase
              .from('user_avatar_unlocks')
              .select('avatar_id')
              .eq('user_id', userId)
          : Promise.resolve({ data: [], error: null }),
        userId
          ? supabase
              .from('user_profiles')
              .select('avatar_id')
              .eq('user_id', userId)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        supabase
          .from('quests')
          .select('title, reward_avatar_id')
          .not('reward_avatar_id', 'is', null)
          .eq('active', true),
      ]);

      const allAvatars = (avatarsRes.data ?? []) as Array<{
        id: string;
        name: string;
        image_url: string;
        rarity: string;
        sort_order: number;
        unlock_threshold: number;
        unlock_type: string;
      }>;

      const unlockedIds = new Set(
        (unlocksRes.data ?? []).map((r: { avatar_id: string }) => r.avatar_id),
      );

      // Map quest reward_avatar_id -> quest title
      const questAvatarMap: Record<string, string> = {};
      for (const q of questsRes.data ?? []) {
        if (q.reward_avatar_id) {
          questAvatarMap[q.reward_avatar_id] = q.title;
        }
      }

      const avatars: AvatarWithUnlockInfo[] = allAvatars.map((a) => {
        const isUnlocked = unlockedIds.has(a.id) || a.unlock_type === 'free';
        const questTitle = questAvatarMap[a.id] ?? null;
        return {
          ...a,
          isUnlocked,
          unlockQuestTitle: questTitle,
          unlockHint: isUnlocked ? 'Unlocked' : buildUnlockHint(a, questTitle),
        };
      });

      return {
        avatars,
        selectedAvatarId: (profileRes.data as { avatar_id: string | null } | null)?.avatar_id ?? null,
      };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: async (avatarId: string) => {
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_id: avatarId, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avatar_selector', userId] });
      // Also invalidate the profile card so the avatar updates there too
      queryClient.invalidateQueries({ queryKey: ['user_profile', userId] });
    },
  });

  return {
    avatars: data?.avatars ?? [],
    selectedAvatarId: data?.selectedAvatarId ?? null,
    isLoading,
    isSelecting: mutation.isPending,
    selectAvatar: (avatarId: string) => mutation.mutateAsync(avatarId),
    error: queryError ? (queryError instanceof Error ? queryError.message : 'Failed to load avatars') : null,
  };
}
