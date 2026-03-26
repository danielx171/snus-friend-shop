import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardSkeletonProps {
  variant?: 'default' | 'compact';
}

export function ProductCardSkeleton({ variant = 'default' }: ProductCardSkeletonProps) {
  const isCompact = variant === 'compact';
  return (
    <Card className="overflow-hidden rounded-2xl border-white/[0.06] bg-card/90">
      {/* Circular image placeholder */}
      <div
        className="flex items-center justify-center product-image-bg"
        style={{ aspectRatio: isCompact ? '3/2' : '1' }}
      >
        <Skeleton className="rounded-full" style={{ width: '60%', height: '60%' }} />
      </div>

      <CardContent className={isCompact ? 'p-2.5 space-y-2' : 'p-4 space-y-3'}>
        {/* Brand name */}
        <Skeleton className="h-2.5 w-14 rounded-full" />
        {/* Product name */}
        <Skeleton className="h-4 w-3/4 rounded" />
        {/* Tags */}
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        {/* Pack sizes */}
        {!isCompact && (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-10 rounded-lg" />
            ))}
          </div>
        )}
        {/* Price row */}
        <div className="flex justify-between items-baseline">
          <Skeleton className={isCompact ? 'h-5 w-14 rounded' : 'h-6 w-16 rounded'} />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
        {/* CTA button */}
        <Skeleton className={isCompact ? 'h-8 w-full rounded-xl' : 'h-9 w-full rounded-xl'} />
      </CardContent>
    </Card>
  );
}
