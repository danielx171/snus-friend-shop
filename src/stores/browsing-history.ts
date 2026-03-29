import { persistentAtom } from '@nanostores/persistent';

export interface BrowsingHistoryItem {
  slug: string;
  brand: string;
  flavorKey: string;
  strengthKey: string;
  viewedAt: string;
}

export const $browsingHistory = persistentAtom<BrowsingHistoryItem[]>(
  'snusfriend_history',
  [],
  { encode: JSON.stringify, decode: JSON.parse },
);

/** Record a product view. Dedupes by slug, keeps last 30 items. */
export function recordProductView(item: Omit<BrowsingHistoryItem, 'viewedAt'>) {
  const history = $browsingHistory.get();
  const filtered = history.filter((h) => h.slug !== item.slug);
  $browsingHistory.set([
    { ...item, viewedAt: new Date().toISOString() },
    ...filtered,
  ].slice(0, 30));
}

/** Get recently viewed product slugs (excluding a specific slug, e.g. current page). */
export function getRecentSlugs(excludeSlug?: string, limit = 6): string[] {
  return $browsingHistory.get()
    .filter((h) => h.slug !== excludeSlug)
    .slice(0, limit)
    .map((h) => h.slug);
}

/** Get the user's flavor/strength preferences based on viewing history. */
export function getBrowsingPreferences() {
  const history = $browsingHistory.get();
  const flavors: Record<string, number> = {};
  const strengths: Record<string, number> = {};
  const brands: Record<string, number> = {};

  for (const item of history) {
    flavors[item.flavorKey] = (flavors[item.flavorKey] ?? 0) + 1;
    strengths[item.strengthKey] = (strengths[item.strengthKey] ?? 0) + 1;
    brands[item.brand] = (brands[item.brand] ?? 0) + 1;
  }

  return {
    topFlavor: Object.entries(flavors).sort((a, b) => b[1] - a[1])[0]?.[0],
    topStrength: Object.entries(strengths).sort((a, b) => b[1] - a[1])[0]?.[0],
    topBrand: Object.entries(brands).sort((a, b) => b[1] - a[1])[0]?.[0],
  };
}
