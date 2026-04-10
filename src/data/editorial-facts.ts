/**
 * Shared editorial facts — dynamic product/brand counts from the content layer.
 *
 * Use in .astro frontmatter:
 *   const facts = await getEditorialFacts();
 *   // facts.productCountLabel → "700+"
 *   // facts.brandCountLabel → "55"
 *
 * This prevents blog articles from hardcoding stale numbers like
 * "708 products" or "35+ brands" that drift as the catalog changes.
 */
import { getCollection } from 'astro:content';

export interface EditorialFacts {
  productCount: number;
  brandCount: number;
  /** Rounded floor label, e.g. "700+" */
  productCountLabel: string;
  /** Exact active brand count as string, e.g. "55" */
  brandCountLabel: string;
}

let _cached: EditorialFacts | null = null;

export async function getEditorialFacts(): Promise<EditorialFacts> {
  if (_cached) return _cached;

  const products = await getCollection('products');
  const brands = await getCollection('brands');
  const brandSlugsWithProducts = new Set(products.map((p) => p.data.brandSlug));
  const activeBrandCount = brands.filter((b) => brandSlugsWithProducts.has(b.id)).length;

  _cached = {
    productCount: products.length,
    brandCount: activeBrandCount,
    productCountLabel: `${Math.floor(products.length / 100) * 100}+`,
    brandCountLabel: String(activeBrandCount),
  };
  return _cached;
}
