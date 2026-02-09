import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/i18n/translations';
import { FlavorKey, StrengthKey, FormatKey, BadgeKey, CategoryKey } from '@/data/products';
import { MarketConfig } from '@/lib/market';

// Development mode warning for missing translations
const warnedKeys = new Set<string>();

function warnMissingKey(key: string, langCode: string) {
  if (process.env.NODE_ENV === 'development') {
    const warnKey = `${langCode}:${key}`;
    if (!warnedKeys.has(warnKey)) {
      warnedKeys.add(warnKey);
      console.warn(`[i18n] Missing translation for "${key}" in language "${langCode}"`);
    }
  }
}

export function useTranslation() {
  const { currentLanguage, formatPrice: ctxFormatPrice, convertPrice, market } = useLanguage();
  
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const langCode = currentLanguage.code;
    const langTranslations = translations[langCode];
    const englishTranslations = translations.en;
    
    let text: string;
    
    if (langTranslations?.[key]) {
      text = langTranslations[key];
    } else if (englishTranslations?.[key]) {
      warnMissingKey(key, langCode);
      text = englishTranslations[key];
    } else {
      warnMissingKey(key, 'en');
      return key;
    }
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return text;
  };

  const translateFlavor = (flavorKey: FlavorKey): string => t(`flavor.${flavorKey}`);
  const translateStrength = (strengthKey: StrengthKey): string => t(`strength.${strengthKey}`);
  const translateFormat = (formatKey: FormatKey): string => t(`format.${formatKey}`);
  const translateBadge = (badgeKey: BadgeKey): string => t(`badge.${badgeKey}`);
  const translateCategory = (categoryKey: CategoryKey): string => t(`category.${categoryKey}`);

  /** Format a GBP price to the current market's locale+currency string */
  const formatPrice = (gbpAmount: number, decimals: number = 2): string => {
    return ctxFormatPrice(gbpAmount, decimals);
  };

  /** Format price with per-unit suffix (e.g., "£4.99/can" or "≈ 5,79 €/Stk") */
  const formatPriceWithUnit = (gbpAmount: number): string => {
    const suffix = t('products.perUnitSuffix');
    return `${formatPrice(gbpAmount)}${suffix}`;
  };
  
  return { 
    t, 
    currentLanguage,
    market,
    formatPrice, 
    convertPrice,
    translateFlavor,
    translateStrength,
    translateFormat,
    translateBadge,
    translateCategory,
    formatPriceWithUnit
  };
}
