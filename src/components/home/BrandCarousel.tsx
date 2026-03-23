import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBrands, brandAccentColor } from '@/hooks/useBrands';

/**
 * Horizontal scrollable brand discovery carousel for the homepage.
 * Shows a randomized selection of brands (not always the same top ones)
 * to encourage users to explore beyond their usual picks.
 */
export function BrandCarousel() {
  const { brands, isLoading } = useBrands();

  // Pick 12 brands: mix of top brands and random others, shuffled per page load
  const displayBrands = useMemo(() => {
    if (brands.length === 0) return [];
    const sorted = [...brands].sort((a, b) => b.productCount - a.productCount);
    const top = sorted.slice(0, 16);
    const rest = sorted.slice(16);

    // Shuffle using Fisher-Yates
    const shuffle = <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    // Take 8 from top brands + 4 from the rest (if available)
    const picked = [
      ...shuffle(top).slice(0, 8),
      ...shuffle(rest).slice(0, 4),
    ];
    return shuffle(picked);
  }, [brands]);

  if (isLoading) {
    return (
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 w-36 shrink-0 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (displayBrands.length === 0) return null;

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
          Discover Brands
        </h2>
        <Link
          to="/brands"
          className="group flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--chart-4))] hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
        {displayBrands.map((brand) => {
          const accent = brandAccentColor(brand.name);
          return (
            <Link
              key={brand.id}
              to={`/brand/${brand.slug}`}
              className="group shrink-0 snap-start"
            >
              <div className="relative w-36 h-28 rounded-2xl border border-border/40 bg-card overflow-hidden transition-all duration-200 ease-out hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-[hsl(0_0%_100%/0.25)]">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ backgroundColor: accent }}
                />
                <div className="flex flex-col items-center justify-center h-full px-3 text-center gap-2">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: accent }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-[hsl(var(--chart-4))] transition-colors truncate w-full">
                    {brand.name}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {brand.productCount} products
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
