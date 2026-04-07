import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $beginnerMode, BEGINNER_MAX_MG } from '@/stores/beginner-mode';
import QueryProvider from './QueryProvider';
import { useOrders, getPurchasedSlugs } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';

interface RecommendationsIslandProps {
  productsJson: string;
}

/** Ordered strength tiers for proximity comparison */
const STRENGTH_TIERS = ['normal', 'strong', 'extraStrong', 'ultraStrong'] as const;

/** Format display labels */
const FORMAT_LABELS: Record<string, string> = {
  slim: 'Slim',
  mini: 'Mini',
  original: 'Original',
  large: 'Large',
  superSlim: 'Super Slim',
};

function tierIndex(key: string | undefined): number {
  if (!key) return -1;
  return STRENGTH_TIERS.indexOf(key as (typeof STRENGTH_TIERS)[number]);
}

function withinOneTier(a: string | undefined, b: string | undefined): boolean {
  const ai = tierIndex(a);
  const bi = tierIndex(b);
  if (ai === -1 || bi === -1) return false;
  return Math.abs(ai - bi) <= 1;
}

/** Reusable product card */
const ProductCard = memo(function ProductCard({
  product,
  pill,
}: {
  product: any;
  pill?: React.ReactNode;
}) {
  return (
    <a
      href={`/products/${product.slug}`}
      className="flex-shrink-0 snap-start w-40 sm:w-48 rounded-xl border border-border bg-card/60 p-3 transition hover:border-primary/30 hover:shadow-md"
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          width={160}
          height={160}
          className="aspect-square w-full rounded-lg object-cover mb-2"
          loading="lazy"
        />
      )}
      <p className="text-xs text-muted-foreground">{product.brand}</p>
      <p className="text-sm font-semibold text-foreground line-clamp-2">{product.name}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">
          €{product.prices?.pack1?.toFixed(2)}
        </span>
        {pill}
      </div>
    </a>
  );
});

/** Horizontal scroll row for a recommendation section */
function RecommendationRow({
  title,
  products,
  renderPill,
}: {
  title: string;
  products: any[];
  renderPill?: (p: any) => React.ReactNode;
}) {
  if (products.length === 0) return null;
  return (
    <>
      <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory mb-8">
        {products.map((p: any) => (
          <ProductCard
            key={p.slug}
            product={p}
            pill={renderPill ? renderPill(p) : undefined}
          />
        ))}
      </div>
    </>
  );
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
  const isBeginner = useStore($beginnerMode);

  const allProducts = useMemo(() => {
    try {
      return JSON.parse(productsJson) as any[];
    } catch {
      return [];
    }
  }, [productsJson]);

  // Compute all recommendation data together
  const {
    buyAgain,
    recommendations,
    saveMoney,
    newFormat,
    trending,
  } = useMemo(() => {
    const empty = { buyAgain: [] as any[], recommendations: [] as any[], saveMoney: [] as any[], newFormat: [] as any[], trending: [] as any[] };
    if (allProducts.length === 0 || purchasedSlugs.length === 0) return empty;

    // In beginner mode, filter to gentle products only
    const pool = isBeginner
      ? allProducts.filter((p: any) => (p.nicotineContent ?? 99) <= BEGINNER_MAX_MG)
      : allProducts;

    // "Buy Again" — products the user has ordered before
    const buyAgainList = purchasedSlugs
      .map((slug) => pool.find((p: any) => p.slug === slug))
      .filter(Boolean)
      .slice(0, 4);

    // "You Might Like" — same brand/flavour as purchased, but not purchased
    const purchasedBrands = new Set(buyAgainList.map((p: any) => p.brandSlug));
    const purchasedFlavours = new Set(buyAgainList.map((p: any) => p.flavorKey));
    const recommendationsList = pool
      .filter((p: any) =>
        !purchasedSlugs.includes(p.slug) &&
        (purchasedBrands.has(p.brandSlug) || purchasedFlavours.has(p.flavorKey)) &&
        p.imageUrl
      )
      .sort((a: any, b: any) => (b.ratings || 0) - (a.ratings || 0))
      .slice(0, 4);

    // Slugs already shown in the first two sections (no duplicates)
    const shownSlugs = new Set([
      ...buyAgainList.map((p: any) => p.slug),
      ...recommendationsList.map((p: any) => p.slug),
    ]);

    // --- "Save Money" ---
    // For each purchased product, find cheaper alternatives with same flavor + similar strength
    const saveMoneyList: (any & { _savings: number })[] = [];
    const saveMoneySeenSlugs = new Set<string>();
    for (const bought of buyAgainList) {
      if (!bought) continue;
      const boughtPrice = bought.prices?.pack1;
      if (!boughtPrice || boughtPrice <= 0) continue;

      for (const candidate of pool) {
        if (
          candidate.slug === bought.slug ||
          shownSlugs.has(candidate.slug) ||
          saveMoneySeenSlugs.has(candidate.slug) ||
          !candidate.imageUrl ||
          candidate.flavorKey !== bought.flavorKey
        ) continue;

        if (!withinOneTier(candidate.strengthKey, bought.strengthKey)) continue;

        const candidatePrice = candidate.prices?.pack1;
        if (!candidatePrice || candidatePrice <= 0) continue;

        const savings = boughtPrice - candidatePrice;
        const savingsPercent = savings / boughtPrice;
        if (savingsPercent > 0.10) {
          saveMoneySeenSlugs.add(candidate.slug);
          saveMoneyList.push({ ...candidate, _savings: savings });
        }
      }
    }
    saveMoneyList.sort((a, b) => b._savings - a._savings);
    const saveMoneyFinal = saveMoneyList.slice(0, 4);

    // Update shown slugs
    for (const p of saveMoneyFinal) shownSlugs.add(p.slug);

    // --- "Try a New Format" ---
    const newFormatList: (any & { _formatLabel: string })[] = [];
    const newFormatSeenSlugs = new Set<string>();
    for (const bought of buyAgainList) {
      if (!bought) continue;

      for (const candidate of pool) {
        if (
          candidate.slug === bought.slug ||
          shownSlugs.has(candidate.slug) ||
          newFormatSeenSlugs.has(candidate.slug) ||
          !candidate.imageUrl ||
          candidate.brandSlug !== bought.brandSlug ||
          candidate.flavorKey !== bought.flavorKey ||
          candidate.formatKey === bought.formatKey ||
          !candidate.formatKey
        ) continue;

        newFormatSeenSlugs.add(candidate.slug);
        newFormatList.push({
          ...candidate,
          _formatLabel: FORMAT_LABELS[candidate.formatKey] || candidate.formatKey,
        });
      }
    }
    const newFormatFinal = newFormatList.slice(0, 4);

    // Update shown slugs
    for (const p of newFormatFinal) shownSlugs.add(p.slug);

    // --- "Trending in Your Taste" ---
    const trendingList = pool
      .filter((p: any) =>
        !purchasedSlugs.includes(p.slug) &&
        !shownSlugs.has(p.slug) &&
        p.imageUrl &&
        purchasedFlavours.has(p.flavorKey) &&
        (p.ratings ?? 0) >= 4.0
      )
      .sort((a: any, b: any) => (b.ratings || 0) - (a.ratings || 0))
      .slice(0, 4);

    return {
      buyAgain: buyAgainList,
      recommendations: recommendationsList,
      saveMoney: saveMoneyFinal,
      newFormat: newFormatFinal,
      trending: trendingList,
    };
  }, [allProducts, purchasedSlugs, isBeginner]);

  const renderSaveMoneyPill = useCallback(
    (p: any) => (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
        Save €{p._savings.toFixed(2)}
      </span>
    ),
    [],
  );

  const renderNewFormatPill = useCallback(
    (p: any) => (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
        {p._formatLabel}
      </span>
    ),
    [],
  );

  const renderTrendingPill = useCallback(
    (p: any) => (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
        ★ {(p.ratings ?? 0).toFixed(1)}
      </span>
    ),
    [],
  );

  if (!mounted || !userId || isLoading) return null;
  if (
    buyAgain.length === 0 &&
    recommendations.length === 0 &&
    saveMoney.length === 0 &&
    newFormat.length === 0 &&
    trending.length === 0
  ) {
    return null;
  }

  return (
    <section className="border-b border-border bg-card/30 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <RecommendationRow title="Buy Again" products={buyAgain} />
        <RecommendationRow title="You Might Like" products={recommendations} />

        <RecommendationRow
          title="Same taste, better price"
          products={saveMoney}
          renderPill={renderSaveMoneyPill}
        />

        <RecommendationRow
          title="New format to try"
          products={newFormat}
          renderPill={renderNewFormatPill}
        />

        <RecommendationRow
          title="Popular in flavors you love"
          products={trending}
          renderPill={renderTrendingPill}
        />
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
