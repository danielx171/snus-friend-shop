import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type LoadingVariant = 'plp' | 'pdp' | 'cart' | 'search' | 'ops-table';

interface LoadingSkeletonProps {
  variant?: LoadingVariant;
  count?: number;
  className?: string;
}

function PLPSkeleton({ count = 8 }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/20 bg-card/80 overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PDPSkeleton() {
  return (
    <div className="container py-10">
      <Skeleton className="h-4 w-32 mb-8" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function CartSkeleton({ count = 3 }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-border/20 bg-card/80 p-3">
          <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-12" />
        </div>
      ))}
      <div className="pt-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

function SearchSkeleton({ count = 6 }: { count: number }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/20 bg-card/80 overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpsTableSkeleton({ count = 5 }: { count: number }) {
  return (
    <div className="rounded-xl border border-border/20 bg-card/80 overflow-hidden">
      <div className="flex gap-4 p-4 border-b border-border/20">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 flex-1" />)}
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-border/10 last:border-0">
          {[1, 2, 3, 4].map(j => <Skeleton key={j} className="h-4 flex-1" />)}
        </div>
      ))}
    </div>
  );
}

export function LoadingSkeleton({ variant = 'plp', count = 8, className }: LoadingSkeletonProps) {
  return (
    <div className={cn(className)}>
      {variant === 'plp' && <PLPSkeleton count={count} />}
      {variant === 'pdp' && <PDPSkeleton />}
      {variant === 'cart' && <CartSkeleton count={count} />}
      {variant === 'search' && <SearchSkeleton count={count} />}
      {variant === 'ops-table' && <OpsTableSkeleton count={count} />}
    </div>
  );
}
