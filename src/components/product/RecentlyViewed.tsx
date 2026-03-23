import React from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/product/ProductCard';

interface RecentlyViewedProps {
  excludeId?: string;
}

export const RecentlyViewed = React.memo(function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { ids } = useRecentlyViewed();
  const { data: products = [] } = useCatalogProducts();

  const filteredIds = excludeId ? ids.filter((id) => id !== excludeId) : ids;
  if (filteredIds.length === 0) return null;

  const recentProducts = filteredIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-xl font-bold text-foreground tracking-tight mb-6">Recently Viewed</h2>
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
          {recentProducts.map((product) => (
            <div key={product!.id} className="flex-shrink-0 w-[200px] snap-start">
              <ProductCard product={product!} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
