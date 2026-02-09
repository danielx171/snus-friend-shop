/**
 * Market configuration — single source of truth for locale, currency, and shipping.
 * Language selection drives market automatically.
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
  /** Exchange rate FROM GBP (1 GBP = X local currency) */
  rateFromGBP: number;
}

/** Map language codes → market configs */
const marketsByLang: Record<string, MarketConfig> = {
  // UK / English
  en: {
    currencyCode: 'GBP',
    locale: 'en-GB',
    freeShippingThreshold: 25,
    shippingCost: 3.99,
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
    rateFromGBP: 13.5,
  },
  // Germany (EUR)
  de: {
    currencyCode: 'EUR',
    locale: 'de-DE',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: true,
    rateFromGBP: 1.16,
  },
  // France (EUR)
  fr: {
    currencyCode: 'EUR',
    locale: 'fr-FR',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1.16,
  },
  // Spain (EUR)
  es: {
    currencyCode: 'EUR',
    locale: 'es-ES',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1.16,
  },
  // Italy (EUR)
  it: {
    currencyCode: 'EUR',
    locale: 'it-IT',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1.16,
  },
  // Netherlands (EUR)
  nl: {
    currencyCode: 'EUR',
    locale: 'nl-NL',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1.16,
  },
  // Portugal (EUR)
  pt: {
    currencyCode: 'EUR',
    locale: 'pt-PT',
    freeShippingThreshold: 29,
    shippingCost: 4.99,
    showTaxRate: false,
    rateFromGBP: 1.16,
  },
  // Poland
  pl: {
    currencyCode: 'PLN',
    locale: 'pl-PL',
    freeShippingThreshold: 119,
    shippingCost: 19.99,
    showTaxRate: false,
    rateFromGBP: 5.13,
  },
  // Czech Republic
  cs: {
    currencyCode: 'CZK',
    locale: 'cs-CZ',
    freeShippingThreshold: 699,
    shippingCost: 99,
    showTaxRate: false,
    rateFromGBP: 29.1,
  },
  // Denmark
  da: {
    currencyCode: 'DKK',
    locale: 'da-DK',
    freeShippingThreshold: 199,
    shippingCost: 39,
    showTaxRate: false,
    rateFromGBP: 8.65,
  },
  // Norway
  no: {
    currencyCode: 'NOK',
    locale: 'nb-NO',
    freeShippingThreshold: 299,
    shippingCost: 49,
    showTaxRate: false,
    rateFromGBP: 13.4,
  },
  // Turkey
  tr: {
    currencyCode: 'TRY',
    locale: 'tr-TR',
    freeShippingThreshold: 999,
    shippingCost: 149,
    showTaxRate: false,
    rateFromGBP: 40.5,
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
    rateFromGBP: 1.16,
  };
});

// Non-EUR European currencies with sensible defaults
const otherMarkets: Record<string, Partial<MarketConfig> & { currencyCode: string; rateFromGBP: number }> = {
  hu: { currencyCode: 'HUF', rateFromGBP: 452, freeShippingThreshold: 9999, shippingCost: 1499 },
  ro: { currencyCode: 'RON', rateFromGBP: 5.8, freeShippingThreshold: 149, shippingCost: 24.99 },
  bg: { currencyCode: 'BGN', rateFromGBP: 2.27, freeShippingThreshold: 59, shippingCost: 9.99 },
  is: { currencyCode: 'ISK', rateFromGBP: 173, freeShippingThreshold: 4999, shippingCost: 799 },
  uk: { currencyCode: 'UAH', rateFromGBP: 52, freeShippingThreshold: 1299, shippingCost: 199 },
  sr: { currencyCode: 'RSD', rateFromGBP: 136, freeShippingThreshold: 3499, shippingCost: 499 },
  bs: { currencyCode: 'BAM', rateFromGBP: 2.27, freeShippingThreshold: 59, shippingCost: 9.99 },
  mk: { currencyCode: 'MKD', rateFromGBP: 71.5, freeShippingThreshold: 1799, shippingCost: 299 },
  sq: { currencyCode: 'ALL', rateFromGBP: 118, freeShippingThreshold: 2999, shippingCost: 499 },
  be: { currencyCode: 'BYN', rateFromGBP: 4.19, freeShippingThreshold: 99, shippingCost: 14.99 },
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

/** Default market (English / GBP) */
const defaultMarket = marketsByLang.en;

/** Get market config for a given language code */
export function getMarketForLanguage(langCode: string): MarketConfig {
  return marketsByLang[langCode] || defaultMarket;
}

/**
 * Convert a GBP price to the market's local currency.
 * Returns the raw number (not formatted).
 */
export function convertFromGBP(gbpAmount: number, market: MarketConfig): number {
  return gbpAmount * market.rateFromGBP;
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
