import React from 'react';
import { CheckCircle, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIER_COLORS } from '@/hooks/useAchievements';
import type { AchievementWithProgress } from '@/hooks/useAchievements';

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Convert a kebab-case icon name (e.g. "star-half") to a PascalCase Lucide
 * component name (e.g. "StarHalf"), then look it up in lucide-react.
 * Falls back to a generic Award icon if the name is not found.
 */
function resolveIcon(iconName: string): React.ElementType {
  const pascalCase = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const icon = (LucideIcons as unknown as Record<string, React.ElementType>)[pascalCase];
  return icon ?? LucideIcons.Award;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

interface AchievementCardProps {
  achievement: AchievementWithProgress;
  className?: string;
}

export const AchievementCard = React.memo(function AchievementCard({
  achievement,
  className,
}: AchievementCardProps) {
  const { tier, icon, title, description, unlocked, progress, threshold, points_reward } =
    achievement;

  const colors = TIER_COLORS[tier] ?? TIER_COLORS.bronze;
  const AchievementIcon = resolveIcon(icon);

  const progressPercent =
    threshold > 0 ? Math.min(100, Math.round((progress / threshold) * 100)) : 100;

  return (
    <div
      className={cn(
        'relative rounded-xl border p-4 flex flex-col gap-3 transition-opacity',
        colors.bg,
        colors.border,
        !unlocked && 'opacity-70',
        className
      )}
    >
      {/* Unlocked badge */}
      {unlocked && (
        <span className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4 text-[hsl(var(--color-success))]" aria-label="Unlocked" />
        </span>
      )}

      {/* Icon */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg',
            colors.bg,
            colors.border,
            'border'
          )}
        >
          {unlocked ? (
            <AchievementIcon className={cn('w-5 h-5', colors.text)} />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold truncate', unlocked ? colors.text : 'text-muted-foreground')}>
            {title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>

      {/* Progress bar (locked only) */}
      {!unlocked && (
        <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', colors.text, 'bg-current')}
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={threshold}
          />
        </div>
      )}

      {/* Points reward */}
      <p className={cn('text-xs font-medium', colors.text)}>+{points_reward} pts</p>
    </div>
  );
});
