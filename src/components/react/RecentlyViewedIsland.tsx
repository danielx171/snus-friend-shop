import { useState, useEffect, memo } from 'react';
import { useStore } from '@nanostores/react';
import {
  fetchSlimProducts,
  parseSlimProducts,
  type SlimProductCardData,
} from '@/lib/slim-products-client';
import { $beginnerMode, BEGINNER_MAX_MG } from '@/stores/beginner-mode';

interface RecentlyViewedProps {
  /** Optional inline fallback for older callers. Prefer the shared slim JSON URL on large pages. */
  productsJson?: string;
  /** Shared slim catalog endpoint used by the homepage to avoid inlining large JSON blobs. */
  productsJsonUrl?: string;
}

interface HistoryItem {
  slug: string;
  brand: string;
  flavorKey: string;
  strengthKey: string;
  viewedAt: string;
}

const HISTORY_KEY = 'snusfriend_history';

function RecentlyViewedInner({ productsJson, productsJsonUrl }: RecentlyViewedProps) {
  const [mounted, setMounted] = useState(false);
  const [catalog, setCatalog] = useState<SlimProductCardData[]>([]);
  const [products, setProducts] = useState<SlimProductCardData[]>([]);
  const isBeginner = useStore($beginnerMode);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      try {
        const nextCatalog = productsJsonUrl
          ? await fetchSlimProducts(productsJsonUrl)
          : productsJson
            ? parseSlimProducts(productsJson)
            : [];
        if (!cancelled) {
          setCatalog(nextCatalog);
        }
      } catch {
        if (!cancelled) {
          setCatalog([]);
        }
      }
    };

    void loadCatalog();
    return () => {
      cancelled = true;
    };
  }, [productsJson, productsJsonUrl]);

  useEffect(() => {
    if (!mounted || catalog.length === 0) return;

    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const history: HistoryItem[] = JSON.parse(raw);
      if (!history.length) return;

      const slugs = history.slice(0, 6).map((h) => h.slug);
      let matched = slugs
        .map((slug) => catalog.find((p) => p.slug === slug))
        .filter(Boolean);

      if (isBeginner) {
        matched = matched.filter((p) => (p.nicotineContent ?? 99) <= BEGINNER_MAX_MG);
      }

      setProducts(matched);
    } catch {
      setProducts([]);
    }
  }, [catalog, mounted, isBeginner]);

  if (!mounted || products.length < 2) return null;

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
