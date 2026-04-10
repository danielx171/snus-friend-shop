/**
 * Shared product label maps — single source of truth.
 * Used by ProductCard (React), BlogProductCard (Astro), and other consumers.
 */

export const strengthDotMap: Record<string, number> = {
  light: 1, normal: 2, strong: 3, 'extra-strong': 4, 'super-strong': 5,
};

export const flavorLabels: Record<string, string> = {
  mint: 'Mint', berry: 'Berry', citrus: 'Citrus', fruit: 'Fruit',
  coffee: 'Coffee', cola: 'Cola', menthol: 'Menthol', wintergreen: 'Wintergreen',
  tropical: 'Tropical', ice: 'Ice', original: 'Original', tobacco: 'Tobacco',
  licorice: 'Licorice', vanilla: 'Vanilla',
};

export const badgeLabels: Record<string, string> = {
  NewPrice: 'New Price', newPrice: 'New Price', popular: 'Popular',
  bestseller: 'Bestseller', new: 'New',
};

export function formatBadge(key: string): string {
  return badgeLabels[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
}
