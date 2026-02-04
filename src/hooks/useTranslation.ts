import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const { currentLanguage } = useLanguage();
  
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
  
  return { t, currentLanguage };
}
