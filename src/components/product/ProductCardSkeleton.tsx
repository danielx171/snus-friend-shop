import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/30 bg-card/80">
      <Skeleton className="aspect-square w-full rounded-none bg-muted/30" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-3 w-16 bg-muted/40" />
        <Skeleton className="h-4 w-3/4 bg-muted/40" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-1.5 w-3 rounded-sm bg-muted/40" />
          ))}
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-10 rounded-md bg-muted/40" />
          ))}
        </div>
        <div className="flex justify-between items-baseline">
          <Skeleton className="h-6 w-16 bg-muted/40" />
          <Skeleton className="h-3 w-12 bg-muted/40" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl bg-muted/40" />
      </CardContent>
    </Card>
  );
}
