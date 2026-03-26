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
 * Format a per-unit price (without suffix - use translation for suffix)
 */
export function formatPricePerUnit(value: number, suffix: string = 'kr/st'): string {
  return `${formatPrice(value, 2)} ${suffix}`;
}
