import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useReputation } from '@/hooks/useReputation';
import type { ReputationLevel } from '@/hooks/useReputation';

/* ------------------------------------------------------------------ */
/*  Color mapping                                                      */
/* ------------------------------------------------------------------ */

const DOT_COLORS: Record<string, string> = {
  gray: 'bg-gray-400',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  gold: 'bg-yellow-400',
};

const TEXT_COLORS: Record<string, string> = {
  gray: 'text-gray-400',
  blue: 'text-blue-500',
  green: 'text-emerald-500',
  purple: 'text-purple-500',
  gold: 'text-yellow-400',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ReputationBadgeProps {
  /** Supply userId to auto-fetch, or pass a pre-fetched level object */
  userId?: string | null;
  level?: ReputationLevel | null;
  /** Show level name text beside the dot (default true) */
  showLabel?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ReputationBadge = React.memo(function ReputationBadge({
  userId,
  level: levelProp,
  showLabel = true,
}: ReputationBadgeProps) {
  const query = useReputation(levelProp ? null : (userId ?? null));
  const rep = levelProp ?? query.data;

  if (!rep) return null;

  const dotClass = DOT_COLORS[rep.badgeColor] ?? DOT_COLORS.gray;
  const textClass = TEXT_COLORS[rep.badgeColor] ?? TEXT_COLORS.gray;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1.5 cursor-default">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass}`}
              aria-hidden="true"
            />
            {showLabel && (
              <span className={`text-xs font-medium ${textClass}`}>
                {rep.levelName}
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-60">
          <p className="font-semibold mb-1">
            Level {rep.level}: {rep.levelName}
          </p>
          {rep.pointsToNext > 0 && (
            <p className="text-xs text-muted-foreground mb-1">
              {rep.pointsToNext} pts to {rep.nextLevelName}
            </p>
          )}
          {rep.perks.length > 0 && (
            <ul className="text-xs text-muted-foreground list-disc pl-3">
              {rep.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default ReputationBadge;
