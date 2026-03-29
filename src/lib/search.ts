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

// ---------------------------------------------------------------------------
// Flavour synonym map — maps generic search terms to flavorKey values and
// common product-name substrings so "velo mint" or "zyn citrus" works.
// ---------------------------------------------------------------------------

const FLAVOR_SYNONYMS: Record<string, string[]> = {
  mint: ['mint', 'menthol', 'spearmint', 'peppermint', 'cool', 'freeze', 'ice', 'frost', 'fresh', 'eucalyptus', 'wintergreen'],
  berry: ['berry', 'blueberry', 'raspberry', 'strawberry', 'blackberry', 'cranberry', 'mixed berry', 'arctic berry', 'wild berry'],
  citrus: ['citrus', 'lemon', 'lime', 'orange', 'grapefruit', 'yuzu', 'tangerine', 'mandarin'],
  fruit: ['fruit', 'apple', 'mango', 'watermelon', 'peach', 'pear', 'melon', 'grape', 'cherry', 'pineapple', 'passion', 'kiwi', 'banana', 'coconut'],
  coffee: ['coffee', 'espresso', 'mocha', 'latte', 'cappuccino'],
  cola: ['cola', 'coke'],
  tobacco: ['tobacco', 'virginia', 'classic'],
  tropical: ['tropical', 'exotic', 'paradise', 'jungle'],
  // Strength terms people might combine with brand names
  strong: ['strong', 'extra strong', 'super strong', 'ultra'],
  light: ['light', 'mini', 'low', 'mild', 'gentle'],
};

/** Build a reverse lookup: term → list of matching flavorKeys */
const SYNONYM_TO_FLAVORS: Map<string, string[]> = new Map();
for (const [flavor, synonyms] of Object.entries(FLAVOR_SYNONYMS)) {
  for (const syn of synonyms) {
    const existing = SYNONYM_TO_FLAVORS.get(syn) ?? [];
    existing.push(flavor);
    SYNONYM_TO_FLAVORS.set(syn, existing);
  }
}

/**
 * Score a product against a search query.
 * Returns 0 when there is no match at all.
 *
 * Supports multi-word queries by splitting into tokens and requiring ALL
 * tokens to match somewhere (name, brand, flavor, or synonyms).
 *
 * Scoring tiers:
 *  - Exact name match     → 100
 *  - Brand match          →  80
 *  - Flavor match         →  60
 *  - Name/brand contains  →  40
 *  - All tokens matched   →  30 (multi-word: each token hits name/brand/flavor/synonym)
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

  // Single-term fast paths (original logic)
  if (name === q) return 100;
  if (brand === q) return 80;
  if (flavor === q) return 60;
  if (name.includes(q) || brand.includes(q)) return 40;

  // Multi-word tokenised search: split query and check each token
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return 0; // single token already failed above

  // Searchable fields for this product
  const nameAndBrand = `${name} ${brand}`;
  const strengthKey = normalizeText(product.strengthKey);

  let matchedCount = 0;
  let totalScore = 0;

  for (const token of tokens) {
    let tokenMatched = false;

    // Direct match in name or brand
    if (name.includes(token) || brand.includes(token)) {
      tokenMatched = true;
      totalScore += 15;
    }

    // Flavor key match
    if (!tokenMatched && flavor.includes(token)) {
      tokenMatched = true;
      totalScore += 10;
    }

    // Strength key match (e.g., "strong", "normal")
    if (!tokenMatched && strengthKey.includes(token)) {
      tokenMatched = true;
      totalScore += 10;
    }

    // Synonym expansion: check if the token is a flavour synonym
    if (!tokenMatched) {
      const synonymFlavors = SYNONYM_TO_FLAVORS.get(token);
      if (synonymFlavors) {
        // Check if product's flavorKey matches any synonym group
        if (synonymFlavors.includes(flavor)) {
          tokenMatched = true;
          totalScore += 10;
        }
        // Also check if product name contains any of the related terms
        if (!tokenMatched) {
          for (const synFlavor of synonymFlavors) {
            const relatedTerms = FLAVOR_SYNONYMS[synFlavor] ?? [];
            for (const related of relatedTerms) {
              if (nameAndBrand.includes(related)) {
                tokenMatched = true;
                totalScore += 8;
                break;
              }
            }
            if (tokenMatched) break;
          }
        }
      }
    }

    if (tokenMatched) matchedCount++;
  }

  // ALL tokens must match for a result to appear
  if (matchedCount === tokens.length) {
    return Math.max(30, totalScore);
  }

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
