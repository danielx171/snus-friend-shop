import type { Product } from '@/data/products';

/**
 * Score a product against a lowercased query string.
 * Higher score = better match.
 * Returns 0 if no match.
 */
export function scoreProduct(p: Product, q: string): number {
  const name = p.name.toLowerCase();
  const brand = p.brand.toLowerCase();
  const flavor = p.flavorKey.toLowerCase();
  const strength = p.strengthKey.toLowerCase();
  const desc = (p.description ?? '').toLowerCase();

  if (name === q) return 100;
  if (brand === q) return 100;
  if (name.startsWith(q)) return 90;
  if (name.includes(q)) return 80;
  if (brand.startsWith(q)) return 75;
  if (brand.includes(q)) return 60;
  if (flavor.includes(q)) return 50;
  if (strength.includes(q)) return 40;
  if (desc.includes(q)) return 20;
  return 0;
}

export function matchesQuery(p: Product, q: string): boolean {
  return scoreProduct(p, q) > 0;
}
