import { useState, useEffect, memo } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product } from '@/data/products';

interface RecentlyViewedProps {
  /** All products as JSON string — parsed client-side to match browsing history */
  productsJson: string;
}

interface HistoryItem {
  slug: string;
  brand: string;
  flavorKey: string;
  strengthKey: string;
  viewedAt: string;
}

const HISTORY_KEY = 'snusfriend_history';

function RecentlyViewedInner({ productsJson }: RecentlyViewedProps) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const history: HistoryItem[] = JSON.parse(raw);
      if (!history.length) return;

      const allProducts = JSON.parse(productsJson);
      const slugs = history.slice(0, 6).map((h) => h.slug);
      const matched = slugs
        .map((slug) => allProducts.find((p: any) => p.slug === slug))
        .filter(Boolean);

      setProducts(matched);
    } catch { /* ignore */ }
  }, [productsJson]);

  if (products.length < 2) return null;

  return (
    <section className="border-b border-border bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">Recently Viewed</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {products.map((p) => (
            <a
              key={p.slug}
              href={`/products/${p.slug}`}
              className="flex-shrink-0 snap-start w-40 sm:w-48 rounded-xl border border-border bg-card/60 p-3 transition hover:border-primary/30 hover:shadow-md"
            >
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  width={160}
                  height={160}
                  className="aspect-square w-full rounded-lg object-cover mb-2"
                  loading="lazy"
                />
              )}
              <p className="text-xs text-muted-foreground">{p.brand}</p>
              <p className="text-sm font-semibold text-foreground line-clamp-2">{p.name}</p>
              <p className="mt-1 text-sm font-bold text-foreground">€{p.prices?.pack1?.toFixed(2)}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(RecentlyViewedInner);
