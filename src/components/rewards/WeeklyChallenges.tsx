import React, { useMemo } from 'react';
import { Trophy, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChallengeWithProgress } from '@/hooks/useWeeklyChallenges';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTimeRemaining(endsAt: string): string {
  const now = Date.now();
  const end = new Date(endsAt).getTime();
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

const CHALLENGE_LABELS: Record<string, string> = {
  review_count: 'Reviews',
  order_count: 'Orders',
  community_posts: 'Posts',
  referral_count: 'Referrals',
};

/* ------------------------------------------------------------------ */
/*  Challenge card                                                     */
/* ------------------------------------------------------------------ */

interface ChallengeCardProps {
  challenge: ChallengeWithProgress;
  onJoin: (id: string) => void;
  isJoining: boolean;
}

const ChallengeCard = React.memo(function ChallengeCard({
  challenge,
  onJoin,
  isJoining,
}: ChallengeCardProps) {
  const progressPct = Math.min(
    (challenge.progress / challenge.target_value) * 100,
    100,
  );
  const isCompleted = !!challenge.completedAt;
  const timeLeft = formatTimeRemaining(challenge.ends_at);
  const typeLabel = CHALLENGE_LABELS[challenge.challenge_type] ?? challenge.challenge_type;

  return (
    <div className="rounded-xl bg-card/60 backdrop-blur border border-border/40 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Trophy className="h-5 w-5 text-primary shrink-0" />
          <h3 className="text-base font-semibold truncate">{challenge.title}</h3>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeLeft}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">
            {challenge.progress} / {challenge.target_value} {typeLabel}
          </span>
          <span className="font-medium text-primary">
            +{challenge.reward_points} pts
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted-foreground/20 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Action */}
      {isCompleted ? (
        <div className="flex items-center gap-1.5 text-sm text-green-500 font-medium">
          <Trophy className="h-4 w-4" />
          Completed!
        </div>
      ) : !challenge.joined ? (
        <Button
          size="sm"
          variant="default"
          className="gap-1.5"
          onClick={() => onJoin(challenge.id)}
          disabled={isJoining}
          aria-label={`Join challenge: ${challenge.title}`}
        >
          <Users className="h-4 w-4" />
          {isJoining ? 'Joining...' : 'Join Challenge'}
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground">
          You're in — keep going!
        </span>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface WeeklyChallengesProps {
  challenges: ChallengeWithProgress[];
  isLoading: boolean;
  onJoin: (id: string) => void;
  isJoining: boolean;
}

const WeeklyChallenges = React.memo(function WeeklyChallenges({
  challenges,
  isLoading,
  onJoin,
  isJoining,
}: WeeklyChallengesProps) {
  const sortedChallenges = useMemo(
    () =>
      [...challenges].sort((a, b) => {
        // Completed last
        if (a.completedAt && !b.completedAt) return 1;
        if (!a.completedAt && b.completedAt) return -1;
        // Then by end date
        return new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime();
      }),
    [challenges],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-card/60 backdrop-blur border border-border/40 p-5 animate-pulse"
          >
            <div className="h-5 w-48 bg-muted rounded mb-3" />
            <div className="h-4 w-64 bg-muted rounded mb-4" />
            <div className="h-2 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (sortedChallenges.length === 0) {
    return (
      <div className="rounded-xl bg-card/60 backdrop-blur border border-border/40 p-8 text-center">
        <Trophy className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          No challenges this week — check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedChallenges.map((c) => (
        <ChallengeCard
          key={c.id}
          challenge={c}
          onJoin={onJoin}
          isJoining={isJoining}
        />
      ))}
    </div>
  );
});

export default WeeklyChallenges;
