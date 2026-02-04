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
    
    // Try current language first
    if (langTranslations?.[key]) {
      text = langTranslations[key];
    } 
    // Fall back to English
    else if (englishTranslations?.[key]) {
      warnMissingKey(key, langCode);
      text = englishTranslations[key];
    } 
    // Return key if nothing found
    else {
      warnMissingKey(key, 'en');
      return key;
    }
    
    // Handle replacements
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return text;
  };

  // Translate flavor using stable key
  const translateFlavor = (flavorKey: FlavorKey): string => {
    return t(`flavor.${flavorKey}`);
  };

  // Translate strength using stable key
  const translateStrength = (strengthKey: StrengthKey): string => {
    return t(`strength.${strengthKey}`);
  };

  // Translate format using stable key
  const translateFormat = (formatKey: FormatKey): string => {
    return t(`format.${formatKey}`);
  };

  // Translate badge using stable key
  const translateBadge = (badgeKey: BadgeKey): string => {
    return t(`badge.${badgeKey}`);
  };

  // Translate category using stable key
  const translateCategory = (categoryKey: CategoryKey): string => {
    return t(`category.${categoryKey}`);
  };

  // Format price with proper locale and currency
  const formatPrice = (sekPrice: number, decimals: number = 2): string => {
    return formatPriceFn(sekPrice, currentLanguage, { decimals });
  };

  // Format price with per-unit suffix
  const formatPriceWithUnit = (sekPrice: number): string => {
    const unitSuffix = t('products.perUnitSuffix');
    return formatPricePerUnitFn(sekPrice, currentLanguage, unitSuffix);
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
