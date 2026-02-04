/**
 * Swedish number formatting utilities
 */

/**
 * Format a price in Swedish style with comma as decimal separator
 */
export function formatPrice(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace('.', ',');
}

/**
 * Format a price with "kr" suffix
 */
export function formatPriceSEK(value: number, decimals = 2): string {
  return `${formatPrice(value, decimals)} kr`;
}

/**
 * Format a per-unit price
 */
export function formatPricePerUnit(value: number): string {
  return `${formatPrice(value, 2)} kr/st`;
}
