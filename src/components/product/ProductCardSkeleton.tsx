import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardSkeletonProps {
  variant?: 'default' | 'compact';
}

export function ProductCardSkeleton({ variant = 'default' }: ProductCardSkeletonProps) {
  const isCompact = variant === 'compact';
  return (
    <Card className="overflow-hidden rounded-2xl border-border/30 bg-card/80 animate-pulse">
      <Skeleton className="w-full rounded-none bg-muted/20" style={{ aspectRatio: isCompact ? '3/2' : '1' }} />
      <CardContent className={isCompact ? 'p-2.5 space-y-2' : 'p-4 space-y-3'}>
        <Skeleton className="h-2.5 w-14 bg-muted/30 rounded-full" />
        <Skeleton className="h-4 w-3/4 bg-muted/30" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full bg-muted/30" />
          <Skeleton className="h-5 w-12 rounded-full bg-muted/30" />
        </div>
        {!isCompact && (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-10 rounded-lg bg-muted/30" />
            ))}
          </div>
        )}
        <div className="flex justify-between items-baseline">
          <Skeleton className={isCompact ? 'h-5 w-14 bg-muted/30' : 'h-6 w-16 bg-muted/30'} />
          <Skeleton className="h-3 w-12 bg-muted/30" />
        </div>
        <Skeleton className={isCompact ? 'h-8 w-full rounded-xl bg-muted/30' : 'h-9 w-full rounded-xl bg-muted/30'} />
      </CardContent>
    </Card>
  );
}
