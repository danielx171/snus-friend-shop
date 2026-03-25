import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocialShare, type ShareType, type SharePlatform } from '@/hooks/useSocialShare';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/* ── Platform config ── */
const PLATFORMS: { key: SharePlatform; label: string; icon: React.FC<{ className?: string }> }[] = [
  {
    key: 'twitter',
    label: 'X / Twitter',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    key: 'copy_link',
    label: 'Copy link',
    icon: ({ className }) => <Copy className={className} />,
  },
];

interface ShareButtonProps {
  type: ShareType;
  targetId: string;
  shareUrl: string;
  shareText: string;
  className?: string;
}

const ShareButton = React.memo(function ShareButton({
  type,
  targetId,
  shareUrl,
  shareText,
  className,
}: ShareButtonProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [copiedRecently, setCopiedRecently] = useState(false);
  const { toast } = useToast();

  // Lazy-load user id
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id ?? null);
    });
  }, []);

  const { shareItem, hasShared } = useSocialShare(userId);

  const handleShare = useCallback(
    (platform: SharePlatform) => {
      shareItem.mutate(
        { type, targetId, platform, shareUrl, shareText },
        {
          onSuccess: (result) => {
            if (platform === 'copy_link') {
              setCopiedRecently(true);
              setTimeout(() => setCopiedRecently(false), 2000);
            }
            if (!result?.alreadyShared && userId) {
              toast({
                title: '+10 SnusPoints!',
                description: `Thanks for sharing! You earned 10 points.`,
              });
            }
          },
          onError: () => {
            // Share window already opened; only DB write failed
            if (platform === 'copy_link') {
              setCopiedRecently(true);
              setTimeout(() => setCopiedRecently(false), 2000);
            }
          },
        },
      );
    },
    [shareItem, type, targetId, shareUrl, shareText, userId, toast],
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex items-center gap-1.5', className)}>
        <Share2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {PLATFORMS.map(({ key, label, icon: Icon }) => {
          const alreadyShared = userId ? hasShared(type, targetId, key) : false;
          const isCopyDone = key === 'copy_link' && copiedRecently;

          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-full transition-all',
                    alreadyShared
                      ? 'text-primary/60 hover:text-primary/80'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]',
                  )}
                  onClick={() => handleShare(key)}
                  aria-label={`Share on ${label}${alreadyShared ? ' (already shared)' : ''}`}
                >
                  {isCopyDone ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : alreadyShared ? (
                    <span className="relative">
                      <Icon className="h-3.5 w-3.5" />
                      <Check className="absolute -bottom-1 -right-1 h-2.5 w-2.5 text-primary" />
                    </span>
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {isCopyDone
                  ? 'Copied!'
                  : alreadyShared
                    ? `Shared on ${label}`
                    : userId
                      ? `${label} (+10 pts)`
                      : label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
});

export default ShareButton;
