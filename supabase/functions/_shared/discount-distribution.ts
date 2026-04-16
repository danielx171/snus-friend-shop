/**
 * VAT-safe proportional discount distribution for Nyehandel orders.
 *
 * Nyehandel requires discounts to be distributed across line item prices —
 * NOT sent as a separate discount line. This matches the CEO's Railway
 * middleware logic.
 *
 * Key rules:
 * - Distribute discount proportionally by each item's share of total
 * - Recalculate price_ex_vat from discounted price_inc_vat using VAT rate
 * - Round each item independently (NYE truncates — up to €0.01 variance expected)
 * - Assign any rounding remainder to the highest-value item
 * - All amounts in cents (lowest currency unit) to avoid floating point issues
 */

export interface DiscountableItem {
  sku: string;
  quantity: number;
  /** Price including VAT per unit, in cents */
  priceIncVat: number;
  /** VAT rate as integer, e.g. 2500 for 25% */
  vatRate: number;
}

export interface DistributedItem extends DiscountableItem {
  /** Discounted price inc VAT per unit, in cents */
  discountedPriceIncVat: number;
  /** Discounted price ex VAT per unit, in cents */
  discountedPriceExVat: number;
  /** Discount applied to this item's total (quantity * per-unit discount), in cents */
  discountApplied: number;
}

/**
 * Distribute a discount amount proportionally across line items.
 *
 * @param items - Cart line items with pricing
 * @param discountAmount - Total discount in cents (e.g. 500 = €5.00)
 * @returns Items with discounted prices, or null if discount exceeds cart total
 */
export function distributeDiscount(
  items: DiscountableItem[],
  discountAmount: number,
): DistributedItem[] | null {
  if (discountAmount <= 0) {
    return items.map((item) => ({
      ...item,
      discountedPriceIncVat: item.priceIncVat,
      discountedPriceExVat: calcExVat(item.priceIncVat, item.vatRate),
      discountApplied: 0,
    }));
  }

  // Calculate total cart value (sum of quantity * price for all items)
  const cartTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.priceIncVat,
    0,
  );

  // Discount can't exceed cart total
  if (discountAmount > cartTotal) return null;

  // Distribute proportionally
  let distributedTotal = 0;
  const result: DistributedItem[] = items.map((item) => {
    const itemTotal = item.quantity * item.priceIncVat;
    const share = itemTotal / cartTotal;
    const itemDiscount = Math.floor(share * discountAmount);
    distributedTotal += itemDiscount;

    // Per-unit discount (floor to avoid over-discounting)
    const perUnitDiscount = Math.floor(itemDiscount / item.quantity);
    const discountedPriceIncVat = item.priceIncVat - perUnitDiscount;
    const discountedPriceExVat = calcExVat(discountedPriceIncVat, item.vatRate);

    return {
      ...item,
      discountedPriceIncVat,
      discountedPriceExVat,
      discountApplied: perUnitDiscount * item.quantity,
    };
  });

  // Assign rounding remainder to the highest-value item
  const remainder = discountAmount - distributedTotal;
  if (remainder > 0 && result.length > 0) {
    // Find highest-value item
    let maxIdx = 0;
    let maxVal = 0;
    for (let i = 0; i < result.length; i++) {
      const val = result[i].quantity * result[i].priceIncVat;
      if (val > maxVal) {
        maxVal = val;
        maxIdx = i;
      }
    }

    // Apply remainder as per-unit adjustment (distribute across quantity)
    const perUnitRemainder = Math.floor(remainder / result[maxIdx].quantity);
    const leftover = remainder - perUnitRemainder * result[maxIdx].quantity;

    result[maxIdx].discountedPriceIncVat -= perUnitRemainder;
    result[maxIdx].discountedPriceExVat = calcExVat(
      result[maxIdx].discountedPriceIncVat,
      result[maxIdx].vatRate,
    );
    result[maxIdx].discountApplied += perUnitRemainder * result[maxIdx].quantity + leftover;
  }

  return result;
}

/**
 * Calculate percentage discount and convert to cents.
 * @param cartTotalCents - Cart total in cents
 * @param percentage - Discount percentage (e.g. 10 for 10%)
 * @returns Discount amount in cents
 */
export function percentageToAmount(
  cartTotalCents: number,
  percentage: number,
): number {
  return Math.floor((cartTotalCents * percentage) / 100);
}

/** Calculate price excluding VAT from price including VAT */
function calcExVat(priceIncVat: number, vatRate: number): number {
  // vatRate is e.g. 2500 for 25%
  // priceExVat = priceIncVat / (1 + vatRate/10000)
  return Math.floor((priceIncVat * 10000) / (10000 + vatRate));
}
