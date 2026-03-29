import { useState, useEffect, memo } from 'react';
import { useStore } from '@nanostores/react';
import { $beginnerMode, BEGINNER_MAX_MG } from '@/stores/beginner-mode';
import QueryProvider from './QueryProvider';
import { useOrders, getPurchasedSlugs } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';

interface RecommendationsIslandProps {
  productsJson: string;
}

function RecommendationsContent({ productsJson }: RecommendationsIslandProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const { data: orders, isLoading } = useOrders(userId);
  const purchasedSlugs = orders ? getPurchasedSlugs(orders) : [];

  if (!mounted || !userId || isLoading) return null;
  if (purchasedSlugs.length === 0) return null;

  const isBeginner = useStore($beginnerMode);

  let allProducts: any[] = [];
  try {
    allProducts = JSON.parse(productsJson);
  } catch {
    return null;
  }

  // In beginner mode, filter to gentle products only
  const pool = isBeginner
    ? allProducts.filter((p: any) => (p.nicotineContent ?? 99) <= BEGINNER_MAX_MG)
    : allProducts;

  // "Buy Again" — products the user has ordered before
  const buyAgain = purchasedSlugs
    .map((slug) => pool.find((p: any) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 4);

  // "You Might Like" — same brand/flavour as purchased, but not purchased
  const purchasedBrands = new Set(buyAgain.map((p: any) => p.brandSlug));
  const purchasedFlavours = new Set(buyAgain.map((p: any) => p.flavorKey));
  const recommendations = pool
    .filter((p: any) =>
      !purchasedSlugs.includes(p.slug) &&
      (purchasedBrands.has(p.brandSlug) || purchasedFlavours.has(p.flavorKey)) &&
      p.imageUrl
    )
    .sort((a: any, b: any) => (b.ratings || 0) - (a.ratings || 0))
    .slice(0, 4);

  if (buyAgain.length === 0 && recommendations.length === 0) return null;

  return (
    <section className="border-b border-border bg-card/30 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        {buyAgain.length > 0 && (
          <>
            <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">Buy Again</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory mb-8">
              {buyAgain.map((p: any) => (
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
          </>
        )}

        {recommendations.length > 0 && (
          <>
            <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">You Might Like</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {recommendations.map((p: any) => (
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
          </>
        )}
      </div>
    </section>
  );
}

const RecommendationsIsland = memo(function RecommendationsIsland(props: RecommendationsIslandProps) {
  return (
    <QueryProvider>
      <RecommendationsContent {...props} />
    </QueryProvider>
  );
});

export default RecommendationsIsland;
