import React from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIER_COLORS } from '@/hooks/useAchievements';
import type { AchievementWithProgress } from '@/hooks/useAchievements';

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

interface AchievementToastProps {
  achievement: AchievementWithProgress;
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  const { tier, title, points_reward } = achievement;
  const colors = TIER_COLORS[tier] ?? TIER_COLORS.bronze;

  return (
    <div className="flex items-center gap-3">
      {/* Trophy icon in tier color */}
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg shrink-0 border',
          colors.bg,
          colors.border
        )}
      >
        <Trophy className={cn('w-5 h-5', colors.text)} />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Achievement Unlocked!
        </span>
        <span className="text-sm font-bold leading-tight">{title}</span>
        <span className={cn('text-xs font-medium', colors.text)}>+{points_reward} pts</span>
      </div>
    </div>
  );
}
