import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestCard from './QuestCard';
import type { QuestWithProgress } from '@/hooks/useQuests';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface QuestBoardProps {
  quests: QuestWithProgress[];
  isLoading: boolean;
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      <span className="text-xs font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5">
        {count}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid                                                               */
/* ------------------------------------------------------------------ */

function QuestGrid({ quests }: { quests: QuestWithProgress[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quests.map((q) => (
        <QuestCard key={q.id} quest={q} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function QuestSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 rounded-xl bg-muted/50 animate-pulse"
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function QuestBoardInner({ quests, isLoading }: QuestBoardProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  const { active, available, completed } = useMemo(() => {
    const active: QuestWithProgress[] = [];
    const available: QuestWithProgress[] = [];
    const completed: QuestWithProgress[] = [];

    for (const q of quests) {
      if (q.completed) {
        completed.push(q);
      } else if (q.startedAt !== null) {
        active.push(q);
      } else {
        available.push(q);
      }
    }

    return { active, available, completed };
  }, [quests]);

  if (isLoading) {
    return <QuestSkeleton />;
  }

  if (quests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Swords className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No quests available right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active quests */}
      {active.length > 0 && (
        <div>
          <SectionHeader title="Active Quests" count={active.length} />
          <QuestGrid quests={active} />
        </div>
      )}

      {/* Available quests */}
      {available.length > 0 && (
        <div>
          <SectionHeader title="Available Quests" count={available.length} />
          <QuestGrid quests={available} />
        </div>
      )}

      {/* Completed quests (collapsed) */}
      {completed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <SectionHeader title="Completed" count={completed.length} />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 ml-auto"
              onClick={() => setShowCompleted((v) => !v)}
              aria-expanded={showCompleted}
            >
              {showCompleted ? (
                <>Hide <ChevronUp className="h-3.5 w-3.5" /></>
              ) : (
                <>Show <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </Button>
          </div>
          {showCompleted && <QuestGrid quests={completed} />}
        </div>
      )}
    </div>
  );
}

const QuestBoard = React.memo(QuestBoardInner);
export default QuestBoard;
