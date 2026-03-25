import React, { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HubQuestion } from '@/hooks/useCommunityHub';

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const CATEGORY_LABELS: Record<string, string> = {
  reviews: 'Reviews',
  'flavor-talk': 'Flavor Talk',
  'new-releases': 'New Releases',
  tips: 'Tips & Tricks',
  general: 'General',
};

interface QuestionCardProps {
  question: HubQuestion;
  onClick?: (id: string) => void;
}

export const QuestionCard = memo(function QuestionCard({ question, onClick }: QuestionCardProps) {
  return (
    <Card
      className="cursor-pointer hover:border-primary/30 transition-colors"
      onClick={() => onClick?.(question.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Vote count */}
          <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
            <span className="text-lg font-semibold tabular-nums text-foreground">{question.votes}</span>
            <span className="text-[10px] text-muted-foreground">votes</span>
          </div>

          {/* Answer count */}
          <div className={`flex flex-col items-center gap-0.5 min-w-[40px] rounded-md p-1 ${question.is_resolved ? 'bg-green-500/10 text-green-500' : ''}`}>
            <span className="text-lg font-semibold tabular-nums">{question.answers_count}</span>
            <span className="text-[10px] text-muted-foreground">answers</span>
          </div>

          {/* Question content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-foreground line-clamp-1">{question.title}</h3>
              {question.is_resolved && (
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            {question.body && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{question.body}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {CATEGORY_LABELS[question.category] ?? question.category}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{formatRelativeTime(question.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
