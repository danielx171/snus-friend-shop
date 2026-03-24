import { useMemo } from 'react';
import { useCatalogProducts } from '@/hooks/useCatalog';
import type { Product } from '@/data/products';

/**
 * Returns up to 4 product recommendations for a given product:
 *   - Up to 2 from the same brand (different product)
 *   - Up to 2 from same flavor, different brand
 *   - Fill remaining from popular products in similar nicotine strength range (±4mg)
 */
export function useRecommendations(product: Product | undefined): {
  recommendations: Product[];
  isLoading: boolean;
} {
  const { data: allProducts = [], isLoading } = useCatalogProducts();

  const recommendations = useMemo(() => {
    if (!product || allProducts.length === 0) return [];

    const TARGET = 4;
    const seen = new Set<string>([product.id]);

    const pick = (candidates: Product[], max: number): Product[] => {
      const results: Product[] = [];
      for (const p of candidates) {
        if (seen.has(p.id)) continue;
        results.push(p);
        seen.add(p.id);
        if (results.length >= max) break;
      }
      return results;
    };

    // 1. Same brand, different product (max 2)
    const sameBrand = allProducts.filter(
      (p) => p.brand === product.brand && p.id !== product.id,
    );
    const brandPicks = pick(sameBrand, 2);

    // 2. Same flavor, different brand (max 2)
    const sameFlavor = allProducts.filter(
      (p) => p.flavorKey === product.flavorKey && p.brand !== product.brand,
    );
    const remaining1 = TARGET - brandPicks.length;
    const flavorPicks = pick(sameFlavor, Math.min(2, remaining1));

    // 3. Fill remaining from popular products in same strength range (±4mg nicotine)
    const already = brandPicks.length + flavorPicks.length;
    const fillCount = TARGET - already;
    const fillPicks: Product[] = [];
    if (fillCount > 0) {
      const strengthFill = allProducts.filter(
        (p) =>
          !seen.has(p.id) &&
          Math.abs(p.nicotineContent - product.nicotineContent) <= 4,
      );
      // Sort by ratings descending to prefer popular
      strengthFill.sort((a, b) => b.ratings - a.ratings);
      fillPicks.push(...pick(strengthFill, fillCount));
    }

    return [...brandPicks, ...flavorPicks, ...fillPicks];
  }, [product, allProducts]);

  return { recommendations, isLoading };
}
