import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const { currentLanguage, formatPrice, convertPrice } = useLanguage();
  
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const langCode = currentLanguage.code;
    const langTranslations = translations[langCode] || translations.en;
    let text = langTranslations?.[key] || translations.en?.[key] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return text;
  };

  // Translate flavor names (Swedish -> localized)
  const translateFlavor = (flavor: string): string => {
    const key = `flavor.${flavor}`;
    const translated = t(key);
    // If no translation found (returns the key), return original
    return translated === key ? flavor : translated;
  };

  // Format price with per-unit suffix
  const formatPriceWithUnit = (sekPrice: number): string => {
    const perUnit = t('products.perUnit');
    return `${formatPrice(sekPrice)}${perUnit}`;
  };
  
  return { 
    t, 
    currentLanguage, 
    formatPrice, 
    convertPrice,
    translateFlavor,
    formatPriceWithUnit
  };
}
