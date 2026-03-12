/**
 * Centralized currency formatting utilities using Intl.NumberFormat
 * Base currency: GBP (£)
 */

/**
 * Format a monetary value in GBP
 */
export function formatMoney(
  amount: number,
  options?: { 
    decimals?: number;
  }
): string {
  const { decimals = 2 } = options || {};
  
  try {
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    return formatter.format(amount);
  } catch (error) {
    // Fallback formatting
    return `£${amount.toFixed(decimals)}`;
  }
}

/**
 * Format a price (alias for formatMoney for consistency)
 */
export function formatPrice(amount: number, decimals?: number): string {
  return formatMoney(amount, { decimals });
}

/**
 * Format a per-unit price (e.g., "£1.05/can")
 */
export function formatPricePerUnit(amount: number, unitSuffix: string = '/can'): string {
  return `${formatMoney(amount)}${unitSuffix}`;
}
