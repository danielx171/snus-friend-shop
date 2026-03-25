import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share2, Users } from 'lucide-react';
import { useReferral } from '@/hooks/useReferral';
import { Skeleton } from '@/components/ui/skeleton';

const ReferralCard = React.memo(function ReferralCard() {
  const { code, uses, isLoading, shareUrl } = useReferral();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleShare = useCallback(async () => {
    if (!shareUrl || !code) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join SnusFriend',
          text: `Sign up with my referral code ${code} and get 50 bonus points!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  }, [shareUrl, code, handleCopy]);

  if (isLoading) {
    return (
      <Card className="border-border/30 bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!code) return null;

  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Refer a Friend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Share your code and earn <span className="font-semibold text-primary">100 points</span> for
          each friend who signs up. They get <span className="font-semibold text-primary">50 points</span> too!
        </p>

        {/* Code display */}
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-muted/40 border border-border/30 px-4 py-3 font-mono text-base tracking-wider text-center select-all">
            {code}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 h-12 w-12 rounded-lg"
            onClick={handleCopy}
            aria-label="Copy referral link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between rounded-lg bg-muted/20 border border-border/20 px-4 py-2.5">
          <span className="text-sm text-muted-foreground">Friends referred</span>
          <span className="font-semibold text-foreground">{uses}</span>
        </div>

        {/* Share button */}
        <Button
          className="w-full rounded-xl h-11 glow-primary"
          onClick={handleShare}
          aria-label="Share referral link"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Referral Link
        </Button>

        {/* Share URL preview */}
        {shareUrl && (
          <p className="text-[11px] text-muted-foreground text-center truncate">
            {shareUrl}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

export default ReferralCard;
