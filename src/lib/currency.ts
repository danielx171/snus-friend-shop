/**
 * Centralized currency formatting utilities using Intl.NumberFormat
 * Base currency: EUR (€)
 */

/**
 * Format a monetary value in EUR
 */
export function formatMoney(
  amount: number,
  options?: {
    decimals?: number;
  }
): string {
  const { decimals = 2 } = options || {};

  try {
    const formatter = new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(amount);
  } catch {
    // Fallback formatting
    return `€${amount.toFixed(decimals)}`;
  }
}

/**
 * Format a price (alias for formatMoney for consistency)
 */
export function formatPrice(amount: number, decimals?: number): string {
  return formatMoney(amount, { decimals });
}

/**
 * Format a per-unit price (e.g., "€1.05/can")
 */
export function formatPricePerUnit(amount: number, unitSuffix: string = '/can'): string {
  return `${formatMoney(amount)}${unitSuffix}`;
}
