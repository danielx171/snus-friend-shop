import React, { useCallback } from 'react';
import { Zap, Clock, Trophy, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SeasonalEventWithParticipation } from '@/hooks/useSeasonalEvents';

interface EventCardProps {
  event: SeasonalEventWithParticipation;
  userId: string | null;
  onJoin: (eventId: string) => void;
  isJoining?: boolean;
}

const EventCard = React.memo(function EventCard({
  event,
  userId,
  onJoin,
  isJoining = false,
}: EventCardProps) {
  const hasJoined = event.participation !== null;
  const tr = event.timeRemaining;

  const handleJoin = useCallback(() => {
    onJoin(event.id);
  }, [onJoin, event.id]);

  return (
    <div className="rounded-xl bg-card/60 backdrop-blur border border-border/40 overflow-hidden">
      {/* Color accent bar */}
      <div className="h-1.5" style={{ backgroundColor: event.theme_color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 shrink-0" style={{ color: event.theme_color }} />
            <h3 className="text-base font-bold leading-tight">{event.name}</h3>
          </div>
          {event.isLive && (
            <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
              Live
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {event.bonus_multiplier > 1 && (
            <div className="flex items-center gap-1.5 text-sm">
              <Zap className="h-4 w-4" style={{ color: event.theme_color }} />
              <span className="font-semibold">{event.bonus_multiplier}x</span>
              <span className="text-muted-foreground">Points</span>
            </div>
          )}

          {tr && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {tr.days > 0 && `${tr.days}d `}{tr.hours}h {tr.minutes}m remaining
            </div>
          )}

          {hasJoined && event.participation && (
            <div className="flex items-center gap-1.5 text-sm text-primary">
              <Trophy className="h-4 w-4" />
              {event.participation.points_earned} pts earned
            </div>
          )}
        </div>

        {/* Milestones if joined */}
        {hasJoined && Array.isArray(event.rewards) && event.rewards.length > 0 && (
          <div className="mb-4 space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rewards</p>
            {(event.rewards as Array<{ name?: string; description?: string }>).map((reward, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-1.5"
              >
                <Trophy className="h-3 w-3 shrink-0" style={{ color: event.theme_color }} />
                <span>{reward.name ?? 'Reward'}</span>
                {reward.description && (
                  <span className="text-muted-foreground/60 ml-auto text-right">{reward.description}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        {userId && !hasJoined && event.isLive && (
          <Button
            size="sm"
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full gap-1.5"
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
          <div className="text-center">
            <span className="text-xs font-medium text-primary">Participating</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default EventCard;
