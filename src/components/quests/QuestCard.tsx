import React from 'react';
import { CheckCircle2, Coins, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { QuestWithProgress } from '@/hooks/useQuests';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  uncommon: 'bg-green-500/20 text-green-400 border-green-500/30',
  rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

function rarityClass(rarity: string | null): string {
  return RARITY_COLORS[(rarity ?? '').toLowerCase()] ?? RARITY_COLORS.common;
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface QuestCardProps {
  quest: QuestWithProgress;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function QuestCardInner({ quest }: QuestCardProps) {
  const pct = quest.target_value > 0
    ? Math.min(100, Math.round((quest.currentValue / quest.target_value) * 100))
    : 0;

  const isStarted = quest.startedAt !== null && !quest.completed;
  const isCompleted = quest.completed;

  return (
    <Card className={`transition-opacity ${isCompleted ? 'opacity-70' : ''}`}>
      <CardContent className="p-4 space-y-3">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">{quest.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{quest.description}</p>
          </div>
          {isCompleted && (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" aria-label="Quest completed" />
          )}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>
              {isCompleted ? 'Completed!' : isStarted ? `${quest.currentValue} / ${quest.target_value}` : `0 / ${quest.target_value}`}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500' : 'bg-primary'
              }`}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Quest progress: ${pct}%`}
            />
          </div>
        </div>

        {/* Reward row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Points reward */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Coins className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{quest.reward_points} pts</span>
          </div>

          {/* Avatar reward */}
          {quest.rewardAvatarName && (
            <>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium">{quest.rewardAvatarName}</span>
                {quest.rewardAvatarRarity && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 h-4 border ${rarityClass(quest.rewardAvatarRarity)}`}
                  >
                    {quest.rewardAvatarRarity}
                  </Badge>
                )}
              </div>
            </>
          )}

          {/* Status badge */}
          <div className="ml-auto">
            {isCompleted ? (
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-500 bg-emerald-500/10">
                Done
              </Badge>
            ) : isStarted ? (
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary bg-primary/10">
                In Progress
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">
                Start Quest
              </Badge>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

const QuestCard = React.memo(QuestCardInner);
export default QuestCard;
