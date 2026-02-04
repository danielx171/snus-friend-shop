import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/i18n/translations';
import { formatPrice as formatPriceFn, formatPricePerUnit as formatPricePerUnitFn } from '@/lib/currency';
import { FlavorKey, StrengthKey, FormatKey, BadgeKey, CategoryKey } from '@/data/products';

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
  const { currentLanguage, convertPrice } = useLanguage();
  
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

  // Format price in GBP
  const formatPrice = (amount: number, decimals: number = 2): string => {
    return formatPriceFn(amount, decimals);
  };

  // Format price with per-unit suffix
  const formatPriceWithUnit = (amount: number): string => {
    return formatPricePerUnitFn(amount, '/can');
  };
  
  return { 
    t, 
    currentLanguage, 
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
