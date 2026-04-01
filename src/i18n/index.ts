import sv from './sv.json';

export type Locale = 'en' | 'sv';

export const defaultLocale: Locale = 'en';
export const supportedLocales: Locale[] = ['en', 'sv'];

const translations: Record<string, Record<string, unknown>> = {
  sv: sv as Record<string, unknown>,
};

/**
 * Get a translation string by dot-notation path.
 * Falls back to the key itself if not found (English is the default — keys ARE the English strings).
 *
 * Usage:
 *   t('sv', 'navigation.home')        → "Hem"
 *   t('en', 'navigation.home')        → "navigation.home" (English uses keys as-is)
 *   t('sv', 'product_page.add_to_cart') → "Lägg i varukorg"
 */
export function t(locale: Locale, key: string): string {
  if (locale === 'en') return key; // English is the default — components use raw English text

  const dict = translations[locale];
  if (!dict) return key;

  const parts = key.split('.');
  let current: unknown = dict;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key;
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : key;
}

/**
 * Get a flat section of translations for a locale.
 * Useful for passing to React islands as a prop.
 *
 * Usage:
 *   getSection('sv', 'navigation') → { home: "Hem", shop: "Handla", ... }
 */
export function getSection(locale: Locale, section: string): Record<string, string> {
  if (locale === 'en') return {};
  const dict = translations[locale];
  if (!dict) return {};
  const sectionData = dict[section];
  if (!sectionData || typeof sectionData !== 'object') return {};
  return sectionData as Record<string, string>;
}

/**
 * Detect locale from URL path.
 * /sv/products/... → 'sv'
 * /products/...    → 'en'
 */
export function localeFromPath(pathname: string): Locale {
  for (const locale of supportedLocales) {
    if (locale === defaultLocale) continue;
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return defaultLocale;
}

/**
 * Get localized path.
 * localizedPath('sv', '/products') → '/sv/products'
 * localizedPath('en', '/products') → '/products'
 */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}
