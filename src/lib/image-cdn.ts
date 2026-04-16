/**
 * Browser-safe CDN helpers shared by client islands and build-time code.
 *
 * Keep this module free of `node:*` imports so Vite/Rollup won't drag
 * server-only code into React island bundles. Build-time utilities
 * (file I/O, slim-data generation) live in `product-json.ts`.
 */

/** Common image CDN prefix — extracted to save ~55KB in products.json */
export const IMAGE_CDN_PREFIX = 'https://nycdn.nyehandel.se/store_5de6b22b-d982-4e10-88e6-56109801bd18/images/';

/**
 * Restore the CDN prefix on a slim product imageUrl suffix.
 * Returns an empty string for falsy input; passes absolute URLs through unchanged.
 * Call this in every consumer that reads `public/data/products.json`.
 */
export function expandImageUrl(suffix: string | undefined | null): string {
  if (!suffix) return '';
  if (suffix.startsWith('http://') || suffix.startsWith('https://')) return suffix;
  return IMAGE_CDN_PREFIX + suffix;
}
