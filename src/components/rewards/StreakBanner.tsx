import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBannerProps {
  streak: number;
  longestStreak: number;
  totalDays: number;
  isLoading: boolean;
}

/** Milestones the user can aim for */
const MILESTONES = [7, 14, 30, 60] as const;

function getNextMilestone(streak: number): number {
  for (const m of MILESTONES) {
    if (streak < m) return m;
  }
  return streak + 30; // beyond 60 — next target every 30 days
}

const StreakBanner = React.memo(function StreakBanner({
  streak,
  longestStreak,
  totalDays,
  isLoading,
}: StreakBannerProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl bg-card/60 backdrop-blur border border-border/40 p-5 mb-6 animate-pulse">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-4 w-60 bg-muted rounded mt-2" />
      </div>
    );
  }

  const nextMilestone = getNextMilestone(streak);
  const progress = Math.min(streak / nextMilestone, 1);
  const dotsTotal = Math.min(nextMilestone, 14); // cap visual dots at 14
  const dotsFilled = Math.round(progress * dotsTotal);

  return (
    <div className="rounded-xl bg-card/60 backdrop-blur border border-border/40 p-5 mb-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          <span className="text-lg font-bold">
            {streak} day streak
          </span>
        </div>
        {longestStreak > 0 && (
          <span className="text-xs text-muted-foreground">
            Best: {longestStreak}d &middot; Total: {totalDays}d
          </span>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Array.from({ length: dotsTotal }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i < dotsFilled
                ? 'bg-primary'
                : 'bg-muted-foreground/20'
            }`}
          />
        ))}
      </div>

      {/* Milestone label */}
      <p className="text-sm text-muted-foreground">
        {streak >= nextMilestone
          ? 'Amazing streak! Keep it going!'
          : `${nextMilestone - streak} day${nextMilestone - streak === 1 ? '' : 's'} until ${nextMilestone}-day bonus!`}
        {' '}Come back tomorrow to keep your streak!
      </p>
    </div>
  );
});

export default StreakBanner;
