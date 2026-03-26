import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { tenant } from '@/config/tenant';
import { getMarketForLanguage, convertFromGBP, formatMarketPrice, type MarketConfig } from '@/lib/market';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const availableLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  const browserLangs = navigator.languages ?? [navigator.language ?? 'en'];
  for (const lang of browserLangs) {
    const code = lang.toLowerCase().split('-')[0];
    if (availableLanguages.find((l) => l.code === code)) return code;
  }
  return 'en';
}

export const $languageCode = persistentAtom<string>(tenant.storage.languageKey, detectBrowserLanguage());

export const $language = computed($languageCode, (code) =>
  availableLanguages.find((l) => l.code === code) ?? availableLanguages[0],
);

export const $market = computed($languageCode, (code) => getMarketForLanguage(code));

export function setLanguage(code: string) { $languageCode.set(code); }

export function formatPrice(gbpPrice: number, market: MarketConfig, decimals = 2): string {
  const converted = convertFromGBP(gbpPrice, market);
  const formatted = formatMarketPrice(converted, market, decimals);
  if (market.currencyCode !== 'EUR') return `≈ ${formatted}`;
  return formatted;
}
