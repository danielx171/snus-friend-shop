/**
 * Shared retail pricing logic.
 * Single source of truth — used by content layer, hooks, and any other pricing code.
 * Change these values to adjust margins and volume discounts across the entire site.
 */

/** Retail markup on wholesale (Nyehandel) price.
 *  Wholesale ~€3.29/can → retail ~€5.10/can at 1.55×. */
export const RETAIL_MARKUP = 1.55;

/** Volume discount multipliers per can.
 *  pack1 = full price, pack3 = 5% off per can, etc. */
export const PACK_DISCOUNT: Record<string, number> = {
  pack1: 1.0,
  pack3: 0.95,
  pack5: 0.90,
  pack10: 0.85,
  pack30: 0.80,
};

/** Number of cans per pack size. */
export const PACK_QUANTITIES: Record<string, number> = {
  pack1: 1,
  pack3: 3,
  pack5: 5,
  pack10: 10,
  pack30: 30,
};

/** Compute prices for all pack sizes from variant data. */
export function computePrices(
  variants: Array<{ pack_size: number; price: number }>
): Record<string, number> {
  const baseCan = variants.find((v) => v.pack_size === 1);
  const wholesalePerCan = baseCan?.price ?? 3.29;
  const retailPerCan = wholesalePerCan * RETAIL_MARKUP;
  const prices: Record<string, number> = {};
  for (const [packKey, qty] of Object.entries(PACK_QUANTITIES)) {
    const discount = PACK_DISCOUNT[packKey] ?? 1.0;
    prices[packKey] = Math.round(retailPerCan * qty * discount * 100) / 100;
  }
  return prices;
}
