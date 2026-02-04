/**
 * Centralized currency formatting utilities using Intl.NumberFormat
 */

import { Currency, Language } from '@/context/LanguageContext';

// Map language codes to locale codes for Intl
const localeMap: Record<string, string> = {
  sv: 'sv-SE',
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
  nl: 'nl-NL',
  pl: 'pl-PL',
  pt: 'pt-PT',
  da: 'da-DK',
  no: 'nb-NO',
  fi: 'fi-FI',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  hu: 'hu-HU',
  ro: 'ro-RO',
  bg: 'bg-BG',
  hr: 'hr-HR',
  sl: 'sl-SI',
  el: 'el-GR',
  et: 'et-EE',
  lv: 'lv-LV',
  lt: 'lt-LT',
  mt: 'mt-MT',
  ga: 'ga-IE',
  is: 'is-IS',
  uk: 'uk-UA',
  sr: 'sr-RS',
  bs: 'bs-BA',
  mk: 'mk-MK',
  sq: 'sq-AL',
  be: 'be-BY',
  tr: 'tr-TR',
};

/**
 * Convert a price from SEK to the target currency
 */
export function convertFromSEK(sekPrice: number, currency: Currency): number {
  return sekPrice * currency.rate;
}

/**
 * Format a monetary value using proper locale and currency formatting
 */
export function formatMoney(
  amount: number,
  language: Language,
  options?: { 
    decimals?: number;
    showApprox?: boolean;
  }
): string {
  const { decimals = 2, showApprox = false } = options || {};
  const locale = localeMap[language.code] || 'en-GB';
  const { currency } = language;
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    const formatted = formatter.format(amount);
    
    // Add approximate symbol for non-SEK currencies
    if (showApprox && currency.code !== 'SEK') {
      return `≈ ${formatted}`;
    }
    
    return formatted;
  } catch (error) {
    // Fallback formatting if Intl fails
    const formatted = amount.toFixed(decimals).replace('.', ',');
    if (currency.position === 'before') {
      return `${currency.symbol}${formatted}`;
    }
    return `${formatted} ${currency.symbol}`;
  }
}

/**
 * Format a price from SEK with automatic conversion and locale formatting
 */
export function formatPrice(
  sekPrice: number,
  language: Language,
  options?: { 
    decimals?: number;
    showApprox?: boolean;
  }
): string {
  const convertedAmount = convertFromSEK(sekPrice, language.currency);
  return formatMoney(convertedAmount, language, options);
}

/**
 * Format a per-unit price (e.g., "12,50 kr/st" or "≈ £1.05/unit")
 */
export function formatPricePerUnit(
  sekPrice: number,
  language: Language,
  unitSuffix: string
): string {
  const convertedAmount = convertFromSEK(sekPrice, language.currency);
  const { currency } = language;
  const locale = localeMap[language.code] || 'en-GB';
  
  try {
    // Format the number part only (without currency symbol for cleaner unit display)
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    const numericPart = formatter.format(convertedAmount);
    
    // Build the formatted string with symbol and unit
    if (currency.position === 'before') {
      return `${currency.symbol}${numericPart}${unitSuffix}`;
    }
    return `${numericPart} ${currency.symbol}${unitSuffix}`;
  } catch (error) {
    const numericPart = convertedAmount.toFixed(2).replace('.', ',');
    if (currency.position === 'before') {
      return `${currency.symbol}${numericPart}${unitSuffix}`;
    }
    return `${numericPart} ${currency.symbol}${unitSuffix}`;
  }
}
