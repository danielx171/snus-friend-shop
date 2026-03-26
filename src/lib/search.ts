// ---------------------------------------------------------------------------
// Search scoring and filtering utilities for the product catalog.
// Works with Content Layer product objects passed as serialised JSON to
// React islands.
// ---------------------------------------------------------------------------

export interface SearchableProduct {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  formatKey?: string;
  ratings: number;
  badgeKeys: string[];
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'strength'
  | 'name-asc'
  | 'newest';

export interface FilterState {
  brands: string[];
  strengths: string[];
  flavors: string[];
  formats: string[];
  sort: SortOption;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

/** Lowercase and strip diacritics so "Zürich" matches "zurich". */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ---------------------------------------------------------------------------
// Search scoring
// ---------------------------------------------------------------------------

const STRENGTH_ORDER: Record<string, number> = {
  light: 1,
  normal: 2,
  strong: 3,
  'extra-strong': 4,
  'super-strong': 5,
};

/**
 * Score a product against a search query.
 * Returns 0 when there is no match at all.
 *
 * Scoring tiers:
 *  - Exact name match  → 100
 *  - Brand match       →  80
 *  - Flavor match      →  60
 *  - Description-level →  40  (name *contains* query)
 */
export function scoreProduct(
  product: SearchableProduct,
  query: string,
): number {
  if (!query) return 0;

  const q = normalizeText(query);
  const name = normalizeText(product.name);
  const brand = normalizeText(product.brand);
  const flavor = normalizeText(product.flavorKey);

  if (name === q) return 100;
  if (brand === q) return 80;
  if (flavor === q) return 60;
  if (name.includes(q) || brand.includes(q)) return 40;

  return 0;
}

// ---------------------------------------------------------------------------
// Filtering & sorting
// ---------------------------------------------------------------------------

/** Return the lowest pack price (pack-1 equivalent). */
function lowestPrice(prices: Record<string, number>): number {
  const values = Object.values(prices);
  return values.length > 0 ? Math.min(...values) : 0;
}

/**
 * Filter an array of products by the active FilterState, then sort.
 * Empty filter arrays mean "show all" for that dimension.
 */
export function filterProducts(
  products: SearchableProduct[],
  filters: FilterState,
): SearchableProduct[] {
  let result = products;

  if (filters.brands.length > 0) {
    const set = new Set(filters.brands.map(normalizeText));
    result = result.filter((p) => set.has(normalizeText(p.brandSlug)));
  }

  if (filters.strengths.length > 0) {
    const set = new Set(filters.strengths.map(normalizeText));
    result = result.filter((p) => set.has(normalizeText(p.strengthKey)));
  }

  if (filters.flavors.length > 0) {
    const set = new Set(filters.flavors.map(normalizeText));
    result = result.filter((p) => set.has(normalizeText(p.flavorKey)));
  }

  if (filters.formats.length > 0) {
    const set = new Set(filters.formats.map(normalizeText));
    result = result.filter(
      (p) => p.formatKey && set.has(normalizeText(p.formatKey)),
    );
  }

  // Sort
  switch (filters.sort) {
    case 'price-asc':
      result = [...result].sort(
        (a, b) => lowestPrice(a.prices) - lowestPrice(b.prices),
      );
      break;
    case 'price-desc':
      result = [...result].sort(
        (a, b) => lowestPrice(b.prices) - lowestPrice(a.prices),
      );
      break;
    case 'strength':
      result = [...result].sort(
        (a, b) =>
          (STRENGTH_ORDER[a.strengthKey] ?? 0) -
          (STRENGTH_ORDER[b.strengthKey] ?? 0),
      );
      break;
    case 'name-asc':
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      // No reliable date field — fall through to featured order
      break;
    case 'featured':
    default:
      // Keep original order (e.g. by ratings or editorial rank)
      break;
  }

  return result;
}

/** Legacy compatibility alias — used by _legacy/SearchResults.tsx */
export function matchesQuery(product: SearchableProduct, query: string): boolean {
  return scoreProduct(product, query) > 0;
}
