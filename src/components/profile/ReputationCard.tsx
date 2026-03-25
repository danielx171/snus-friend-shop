import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { useReputation } from '@/hooks/useReputation';
import type { ReputationLevel } from '@/hooks/useReputation';

/* ------------------------------------------------------------------ */
/*  Color mapping                                                      */
/* ------------------------------------------------------------------ */

const ACCENT_COLORS: Record<string, string> = {
  gray: 'text-gray-400',
  blue: 'text-blue-500',
  green: 'text-emerald-500',
  purple: 'text-purple-500',
  gold: 'text-yellow-400',
};

const BAR_COLORS: Record<string, string> = {
  gray: 'bg-gray-400',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  gold: 'bg-yellow-400',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ReputationCardProps {
  userId: string | null;
  /** Pass pre-fetched data to skip the internal query */
  level?: ReputationLevel | null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ReputationCard = React.memo(function ReputationCard({
  userId,
  level: levelProp,
}: ReputationCardProps) {
  const query = useReputation(levelProp ? null : userId);
  const rep = levelProp ?? query.data;
  const isLoading = !levelProp && query.isLoading;

  /* Loading skeleton — matches StreakBanner pattern */
  if (isLoading) {
    return (
      <div className="rounded-xl bg-card/60 backdrop-blur border border-border/40 p-5 mb-6 animate-pulse">
        <div className="h-6 w-44 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded mt-2" />
        <div className="h-3 w-full bg-muted rounded mt-4" />
      </div>
    );
  }

  if (!rep) return null;

  const accent = ACCENT_COLORS[rep.badgeColor] ?? ACCENT_COLORS.gray;
  const bar = BAR_COLORS[rep.badgeColor] ?? BAR_COLORS.gray;
  const progressPct = Math.round(rep.progress * 100);

  return (
    <div className="rounded-xl bg-card/60 backdrop-blur border border-border/40 p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className={`h-5 w-5 ${accent}`} />
          <span className="text-lg font-bold">
            Level {rep.level}: {rep.levelName}
          </span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {rep.lifetimeEarned.toLocaleString()} pts earned
        </span>
      </div>

      {/* Progress bar */}
      {rep.nextLevel !== null && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{rep.levelName}</span>
            <span className="flex items-center gap-0.5">
              {rep.nextLevelName}
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted-foreground/20 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bar}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {rep.pointsToNext.toLocaleString()} points to {rep.nextLevelName}
          </p>
        </div>
      )}

      {rep.nextLevel === null && (
        <p className="text-sm text-muted-foreground mb-3">
          Maximum level reached — you are a Legend!
        </p>
      )}

      {/* Perks list */}
      {rep.perks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Your perks</p>
          <ul className="flex flex-wrap gap-2">
            {rep.perks.map((perk) => (
              <li
                key={perk}
                className="text-xs px-2.5 py-1 rounded-full bg-muted/60 border border-border/30 text-foreground"
              >
                {perk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default ReputationCard;
