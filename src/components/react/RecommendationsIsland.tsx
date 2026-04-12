import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $beginnerMode, BEGINNER_MAX_MG } from '@/stores/beginner-mode';
import QueryProvider from './QueryProvider';
import { useOrders, getPurchasedSlugs } from '@/hooks/useOrders';
import { useUserAttributes } from '@/hooks/useUserAttributes';
import { supabase } from '@/integrations/supabase/client';

/**
 * Quiz strength preference key → allowed strengthKey values.
 * Must match STRENGTH_OPTIONS in FlavorQuizIsland.tsx.
 */
const QUIZ_STRENGTH_MAP: Record<string, readonly string[]> = {
  beginner: ['light'],
  casual: ['normal'],
  regular: ['strong'],
  experienced: ['extra-strong', 'super-strong'],
};

interface RecommendationsIslandProps {
  productsJson: string;
}

/**
 * Ordered strength tiers for proximity comparison.
 * MUST match the hyphenated values emitted by src/content.config.ts:59 and
 * used by every other consumer (filters, PDP step-down, quiz, products.json).
 * Previous camelCase values (extraStrong, ultraStrong) silently excluded
 * experienced-user products from the "Same taste, better price" row.
 */
const STRENGTH_TIERS = ['light', 'normal', 'strong', 'extra-strong', 'super-strong'] as const;

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
  const { attributes: userAttrs } = useUserAttributes(userId ?? undefined);

  const allProducts = useMemo(() => {
    try {
      return JSON.parse(productsJson) as any[];
    } catch {
      return [];
    }
  }, [productsJson]);

  /** Quiz preferences read from user_attributes (if the user did the flavor quiz). */
  const { quizStrengths, quizFlavors } = useMemo(() => {
    const strengthPref = userAttrs?.find((a) => a.attribute_key === 'strength_preference')?.attribute_value;
    const flavorPrefs = (userAttrs ?? [])
      .filter((a) => a.attribute_key === 'flavor_preference')
      .map((a) => a.attribute_value);
    return {
      quizStrengths: strengthPref ? QUIZ_STRENGTH_MAP[strengthPref] ?? [] : [],
      quizFlavors: flavorPrefs,
    };
  }, [userAttrs]);

  // Compute all recommendation data together
  const {
    buyAgain,
    recommendations,
    saveMoney,
    newFormat,
    trending,
    pickedForYou,
  } = useMemo(() => {
    const empty = {
      buyAgain: [] as any[],
      recommendations: [] as any[],
      saveMoney: [] as any[],
      newFormat: [] as any[],
      trending: [] as any[],
      pickedForYou: [] as any[],
    };
    if (allProducts.length === 0) return empty;

    // In beginner mode, filter to gentle products only
    const pool = isBeginner
      ? allProducts.filter((p: any) => (p.nicotineContent ?? 99) <= BEGINNER_MAX_MG)
      : allProducts;

    // Fallback row for users with no orders — seed from quiz preferences so
    // experienced users see 30/50 mg picks before they ever place an order.
    const pickedForYouList = purchasedSlugs.length === 0 && (quizStrengths.length > 0 || quizFlavors.length > 0)
      ? pool
          .filter((p: any) =>
            p.imageUrl && p.stock > 0 &&
            (quizStrengths.length === 0 || quizStrengths.includes(p.strengthKey)) &&
            (quizFlavors.length === 0 || quizFlavors.includes(p.flavorKey))
          )
          .sort((a: any, b: any) => (b.ratings || 0) - (a.ratings || 0))
          .slice(0, 8)
      : [];

    if (purchasedSlugs.length === 0) {
      return { ...empty, pickedForYou: pickedForYouList };
    }

    // "Buy Again" — products the user has ordered before
    const buyAgainList = purchasedSlugs
      .map((slug) => pool.find((p: any) => p.slug === slug))
      .filter(Boolean)
      .slice(0, 4);

    // "You Might Like" — same brand / flavour / strength tier as purchased,
    // but not purchased. Including strengthKey surfaces other super-strong /
    // extra-strong options for experienced buyers (was missing before).
    const purchasedBrands = new Set(buyAgainList.map((p: any) => p.brandSlug));
    const purchasedFlavours = new Set(buyAgainList.map((p: any) => p.flavorKey));
    const purchasedStrengths = new Set(buyAgainList.map((p: any) => p.strengthKey));
    const recommendationsList = pool
      .filter((p: any) =>
        !purchasedSlugs.includes(p.slug) &&
        (purchasedBrands.has(p.brandSlug) ||
          purchasedFlavours.has(p.flavorKey) ||
          purchasedStrengths.has(p.strengthKey)) &&
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
      pickedForYou: [] as any[],
    };
  }, [allProducts, purchasedSlugs, isBeginner, quizStrengths, quizFlavors]);

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
    trending.length === 0 &&
    pickedForYou.length === 0
  ) {
    return null;
  }

  return (
    <section className="border-b border-border bg-card/30 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* No-order fallback — seeded from the flavor quiz */}
        <RecommendationRow title="Picked for your taste" products={pickedForYou} />

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
