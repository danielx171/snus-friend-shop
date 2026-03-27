import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewSummaryCardProps {
  summaryText: string | undefined;
  generatedAt: string | undefined;
  isLoading: boolean;
}

const ReviewSummaryCard = React.memo(function ReviewSummaryCard({
  summaryText,
  generatedAt,
  isLoading,
}: ReviewSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summaryText) return null;

  const dateStr = generatedAt
    ? new Date(generatedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Review Summary
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                AI Generated
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {summaryText}
            </p>
            {dateStr && (
              <p className="text-xs text-muted-foreground/60">
                Last updated {dateStr}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default ReviewSummaryCard;
