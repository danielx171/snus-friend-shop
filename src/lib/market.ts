/**
 * Market configuration — single source of truth for locale, currency, and shipping.
 * Language selection drives market automatically.
 *
 * BASE CURRENCY: EUR — all product prices from Supabase/Nyehandel are in EUR.
 * rateFromGBP is kept as the field name for backward-compat with cart-utils.ts
 * but it actually means "rate from EUR" (1 EUR = X local currency).
 */

export interface MarketConfig {
  /** ISO currency code */
  currencyCode: string;
  /** BCP-47 locale for Intl formatting */
  locale: string;
  /** Free-shipping threshold in the market's currency */
  freeShippingThreshold: number;
  /** Standard shipping cost in the market's currency */
  shippingCost: number;
  /** Label shown next to tax line (e.g. "VAT", "MwSt.") — pulled from i18n */
  showTaxRate: boolean;
  /**
   * Exchange rate FROM base currency (EUR).
   * Named rateFromGBP for backward-compat — it means 1 EUR = X local currency.
   * EUR markets = 1.0, GBP ≈ 0.86, SEK ≈ 11.6, etc.
   */
  rateFromGBP: number;
}

/** Map language codes → market configs */
const marketsByLang: Record<string, MarketConfig> = {
  // English — default market uses EUR since Nyehandel charges EUR
  en: {
    currencyCode: 'EUR',
    locale: 'en-IE',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1,
  },
  // Sweden
  sv: {
    currencyCode: 'SEK',
    locale: 'sv-SE',
    freeShippingThreshold: 349,
    shippingCost: 49,
    showTaxRate: true,
    rateFromGBP: 11.63,
  },
  // Germany (EUR)
  de: {
    currencyCode: 'EUR',
    locale: 'de-DE',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: true,
    rateFromGBP: 1,
  },
  // France (EUR)
  fr: {
    currencyCode: 'EUR',
    locale: 'fr-FR',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1,
  },
  // Spain (EUR)
  es: {
    currencyCode: 'EUR',
    locale: 'es-ES',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1,
  },
  // Italy (EUR)
  it: {
    currencyCode: 'EUR',
    locale: 'it-IT',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1,
  },
  // Netherlands (EUR)
  nl: {
    currencyCode: 'EUR',
    locale: 'nl-NL',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1,
  },
  // Portugal (EUR)
  pt: {
    currencyCode: 'EUR',
    locale: 'pt-PT',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1,
  },
  // Poland
  pl: {
    currencyCode: 'PLN',
    locale: 'pl-PL',
    freeShippingThreshold: 119,
    shippingCost: 19.99,
    showTaxRate: false,
    rateFromGBP: 4.42,
  },
  // Czech Republic
  cs: {
    currencyCode: 'CZK',
    locale: 'cs-CZ',
    freeShippingThreshold: 699,
    shippingCost: 99,
    showTaxRate: false,
    rateFromGBP: 25.09,
  },
  // Denmark
  da: {
    currencyCode: 'DKK',
    locale: 'da-DK',
    freeShippingThreshold: 199,
    shippingCost: 39,
    showTaxRate: false,
    rateFromGBP: 7.46,
  },
  // Norway
  no: {
    currencyCode: 'NOK',
    locale: 'nb-NO',
    freeShippingThreshold: 299,
    shippingCost: 49,
    showTaxRate: false,
    rateFromGBP: 11.55,
  },
  // Turkey
  tr: {
    currencyCode: 'TRY',
    locale: 'tr-TR',
    freeShippingThreshold: 999,
    shippingCost: 149,
    showTaxRate: false,
    rateFromGBP: 34.91,
  },
};

// EUR fallback for many EU languages
const eurLangs = ['sk', 'hr', 'sl', 'el', 'fi', 'et', 'lv', 'lt', 'mt', 'ga'];
eurLangs.forEach(code => {
  marketsByLang[code] = {
    currencyCode: 'EUR',
    locale: `${code}-${code.toUpperCase()}`,
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1,
  };
});

// Non-EUR European currencies with sensible defaults
const otherMarkets: Record<string, Partial<MarketConfig> & { currencyCode: string; rateFromGBP: number }> = {
  hu: { currencyCode: 'HUF', rateFromGBP: 390, freeShippingThreshold: 9999, shippingCost: 1499 },
  ro: { currencyCode: 'RON', rateFromGBP: 5.0, freeShippingThreshold: 149, shippingCost: 24.99 },
  bg: { currencyCode: 'BGN', rateFromGBP: 1.96, freeShippingThreshold: 59, shippingCost: 9.99 },
  is: { currencyCode: 'ISK', rateFromGBP: 149, freeShippingThreshold: 4999, shippingCost: 799 },
  uk: { currencyCode: 'UAH', rateFromGBP: 44.8, freeShippingThreshold: 1299, shippingCost: 199 },
  sr: { currencyCode: 'RSD', rateFromGBP: 117, freeShippingThreshold: 3499, shippingCost: 499 },
  bs: { currencyCode: 'BAM', rateFromGBP: 1.96, freeShippingThreshold: 59, shippingCost: 9.99 },
  mk: { currencyCode: 'MKD', rateFromGBP: 61.6, freeShippingThreshold: 1799, shippingCost: 299 },
  sq: { currencyCode: 'ALL', rateFromGBP: 102, freeShippingThreshold: 2999, shippingCost: 499 },
  be: { currencyCode: 'BYN', rateFromGBP: 3.61, freeShippingThreshold: 99, shippingCost: 14.99 },
};

Object.entries(otherMarkets).forEach(([code, config]) => {
  marketsByLang[code] = {
    currencyCode: config.currencyCode,
    locale: `${code}-${code.toUpperCase()}`,
    freeShippingThreshold: config.freeShippingThreshold ?? 29,
    shippingCost: config.shippingCost ?? 4.99,
    showTaxRate: false,
    rateFromGBP: config.rateFromGBP,
  };
});

/** Default market (English / EUR) */
const defaultMarket = marketsByLang.en;

/** Get market config for a given language code */
export function getMarketForLanguage(langCode: string): MarketConfig {
  return marketsByLang[langCode] || defaultMarket;
}

/**
 * Convert a base currency (EUR) price to the market's local currency.
 * Named convertFromGBP for backward-compat — base currency is EUR.
 */
export function convertFromGBP(eurAmount: number, market: MarketConfig): number {
  return eurAmount * market.rateFromGBP;
}

/**
 * Format a price using Intl.NumberFormat for the market's locale + currency.
 * If the market is non-GBP, the amount is assumed to be already converted.
 */
export function formatMarketPrice(amount: number, market: MarketConfig, decimals: number = 2): string {
  try {
    return new Intl.NumberFormat(market.locale, {
      style: 'currency',
      currency: market.currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    return `${amount.toFixed(decimals)}`;
  }
}
