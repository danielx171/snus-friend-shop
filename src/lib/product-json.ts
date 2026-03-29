import fs from 'node:fs';
import path from 'node:path';

/**
 * Slim product data for the client-side FilterableProductGrid.
 * Only includes fields needed for filtering, sorting, and card display.
 * Reduces JSON from ~688KB to ~300KB (57% smaller).
 */
export function slimProductData(products: Array<{ id: string; data: any }>) {
  return products.map((p) => ({
    slug: p.id,
    name: p.data.name,
    brand: p.data.brand,
    brandSlug: p.data.brandSlug,
    imageUrl: p.data.imageUrl,
    prices: { pack1: p.data.prices?.pack1 ?? 0 },
    nicotineContent: p.data.nicotineContent,
    strengthKey: p.data.strengthKey,
    flavorKey: p.data.flavorKey,
    formatKey: p.data.formatKey,
    ratings: p.data.ratings,
    stock: p.data.stock,
    badgeKeys: p.data.badgeKeys ?? [],
  }));
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
