import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function PDPSkeleton() {
  return (
    <div className="container py-10">
      <Skeleton className="h-4 w-40 mb-8 bg-muted/40" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Card className="overflow-hidden rounded-3xl border-border/30 bg-card/80">
            <Skeleton className="aspect-square w-full bg-muted/30" />
          </Card>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl bg-muted/40" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20 bg-muted/40" />
            <Skeleton className="h-8 w-3/4 bg-muted/40" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-4 bg-muted/40" />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full bg-muted/40" />
            ))}
          </div>
          <Skeleton className="h-16 w-full bg-muted/40" />
          <Skeleton className="h-12 w-full rounded-xl bg-muted/40" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-muted/40" />
            ))}
          </div>
          <Skeleton className="h-14 w-full rounded-xl bg-primary/20" />
        </div>
      </div>
    </div>
  );
}
