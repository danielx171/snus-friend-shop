import fs from 'node:fs';
import path from 'node:path';
import { IMAGE_CDN_PREFIX } from './image-cdn';

// Re-export so existing `from '@/lib/product-json'` imports in server-only
// code keep working; client islands should import from `./image-cdn` directly.
export { IMAGE_CDN_PREFIX, expandImageUrl } from './image-cdn';

/**
 * Slim product data for the client-side FilterableProductGrid.
 * Only includes fields needed for filtering, sorting, and card display.
 * Image URLs are stored as suffixes (common CDN prefix extracted).
 * Stock is stored as boolean to save bytes.
 */
export function slimProductData(products: Array<{ id: string; data: any }>) {
  return products.map((p) => {
    const base: Record<string, unknown> = {
      slug: p.id,
      name: p.data.name,
      brand: p.data.brand,
      brandSlug: p.data.brandSlug,
      imageUrl: (p.data.imageUrl ?? '').replace(IMAGE_CDN_PREFIX, ''),
      prices: { pack1: p.data.prices?.pack1 ?? 0 },
      nicotineContent: p.data.nicotineContent,
      strengthKey: p.data.strengthKey,
      flavorKey: p.data.flavorKey,
      formatKey: p.data.formatKey,
      ratings: p.data.ratings,
      stock: p.data.stock > 0 ? 1 : 0,
      badgeKeys: p.data.badgeKeys ?? [],
    };
    // Only include optional fields when present — keeps the JSON small.
    if (typeof p.data.comparePrice === 'number' && p.data.comparePrice > 0) {
      base.comparePrice = p.data.comparePrice;
    }
    if (typeof p.data.portionsPerCan === 'number' && p.data.portionsPerCan > 0) {
      base.portionsPerCan = p.data.portionsPerCan;
    }
    return base;
  });
}

/** Write slim products.json to public/data/ if it doesn't exist yet. */
export function ensureProductsJson(products: Array<{ id: string; data: any }>) {
  const outDir = path.resolve('./public/data');
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, 'products.json');
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify(slimProductData(products)));
  }
}

/** Write slim products.json to public/data/ (always overwrite). */
export function writeProductsJson(products: Array<{ id: string; data: any }>) {
  const outDir = path.resolve('./public/data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(slimProductData(products)));
}
