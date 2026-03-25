import React, { useState, useCallback, useEffect } from 'react';
import { X, Zap, Clock, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SeasonalEventWithParticipation } from '@/hooks/useSeasonalEvents';

interface SeasonalBannerProps {
  event: SeasonalEventWithParticipation;
  userId: string | null;
  onJoin: (eventId: string) => void;
  isJoining?: boolean;
}

const DISMISS_KEY_PREFIX = 'seasonal-banner-dismissed-';

const SeasonalBanner = React.memo(function SeasonalBanner({
  event,
  userId,
  onJoin,
  isJoining = false,
}: SeasonalBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(event.timeRemaining);

  // Check localStorage for dismiss flag
  useEffect(() => {
    const key = DISMISS_KEY_PREFIX + event.id;
    if (localStorage.getItem(key) === 'true') {
      setDismissed(true);
    }
  }, [event.id]);

  // Live countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(event.ends_at).getTime() - Date.now();
      if (diff <= 0) {
        setTimeRemaining(null);
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining({ days, hours, minutes });
    }, 60_000);

    return () => clearInterval(interval);
  }, [event.ends_at]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY_PREFIX + event.id, 'true');
    setDismissed(true);
  }, [event.id]);

  const handleJoin = useCallback(() => {
    onJoin(event.id);
  }, [onJoin, event.id]);

  if (dismissed || !event.isLive) return null;

  const hasJoined = event.participation !== null;

  return (
    <div
      className="relative rounded-xl border border-border/40 p-5 mb-6 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${event.theme_color}20, ${event.theme_color}08)`,
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-md hover:bg-background/50 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Dismiss event banner"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <PartyPopper className="h-5 w-5" style={{ color: event.theme_color }} />
        <h3 className="text-lg font-bold">{event.name}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 pr-6">
        {event.description}
      </p>

      {/* Info badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Points multiplier badge */}
        {event.bonus_multiplier > 1 && (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: event.theme_color }}
          >
            <Zap className="h-3 w-3" />
            {event.bonus_multiplier}x Points!
          </span>
        )}

        {/* Countdown */}
        {timeRemaining && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-background/60 border border-border/30 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeRemaining.days > 0 && `${timeRemaining.days}d `}
            {timeRemaining.hours}h {timeRemaining.minutes}m left
          </span>
        )}

        {/* Points earned if joined */}
        {hasJoined && event.participation && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {event.participation.points_earned} pts earned
          </span>
        )}
      </div>

      {/* CTA */}
      {userId && !hasJoined && (
        <Button
          size="sm"
          onClick={handleJoin}
          disabled={isJoining}
          className="gap-1.5"
          style={{
            backgroundColor: event.theme_color,
            borderColor: event.theme_color,
          }}
        >
          <PartyPopper className="h-3.5 w-3.5" />
          {isJoining ? 'Joining...' : 'Join Event'}
        </Button>
      )}

      {hasJoined && (
        <p className="text-xs font-medium text-primary">
          You're participating in this event!
        </p>
      )}
    </div>
  );
});

export default SeasonalBanner;
