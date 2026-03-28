import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ShareType = 'product' | 'review' | 'referral' | 'achievement';
export type SharePlatform = 'twitter' | 'facebook' | 'whatsapp' | 'copy_link';

interface ShareItemParams {
  type: ShareType;
  targetId: string;
  platform: SharePlatform;
  shareUrl: string;
  shareText: string;
}

interface SocialShare {
  id: string;
  share_type: string;
  target_id: string;
  platform: string;
  points_awarded: number;
  created_at: string;
}

function openShareWindow(platform: SharePlatform, shareUrl: string, shareText: string): boolean {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  let url: string | null = null;

  switch (platform) {
    case 'twitter':
      url = `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      break;
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'whatsapp':
      url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      break;
    case 'copy_link':
      // Handled separately
      return true;
  }

  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  }
  return true;
}

export function useSocialShare(userId: string | null) {
  const queryClient = useQueryClient();

  // Fetch all shares for this user
  const { data: shares = [] } = useQuery<SocialShare[]>({
    queryKey: ['social-shares', userId],
    queryFn: async (): Promise<SocialShare[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('social_shares')
        .select('id, share_type, target_id, platform, points_awarded, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('social_shares query failed', error);
        return [];
      }
      return (data ?? []) as SocialShare[];
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  const hasShared = (type: ShareType, targetId: string, platform: SharePlatform): boolean => {
    return shares.some(
      (s) => s.share_type === type && s.target_id === targetId && s.platform === platform,
    );
  };

  const shareItem = useMutation({
    mutationFn: async (params: ShareItemParams) => {
      const { type, targetId, platform, shareUrl, shareText } = params;

      // Open share window / copy link first
      if (platform === 'copy_link') {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Try Web Share API on mobile, fall back to popup
        if (platform !== 'copy_link' && navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
          try {
            await navigator.share({ title: shareText, url: shareUrl });
          } catch {
            // User cancelled or not supported — still open popup
            openShareWindow(platform, shareUrl, shareText);
          }
        } else {
          openShareWindow(platform, shareUrl, shareText);
        }
      }

      if (!userId) throw new Error('Not authenticated');

      // Record the share (unique constraint prevents duplicates)
      const { error } = await supabase
        .from('social_shares')
        .insert({
          user_id: userId,
          share_type: type,
          target_id: targetId,
          platform,
          points_awarded: 10,
        });

      if (error) {
        // 23505 = unique_violation — already shared, not an error
        if (error.code === '23505') return { alreadyShared: true };
        throw error;
      }

      return { alreadyShared: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-shares', userId] });
      queryClient.invalidateQueries({ queryKey: ['snuspoints', userId] });
    },
  });

  return { shareItem, hasShared, shares };
}
