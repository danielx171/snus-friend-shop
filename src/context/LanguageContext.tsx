import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { getMarketForLanguage, convertFromGBP, formatMarketPrice, MarketConfig } from '@/lib/market';

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // kept for backward-compat; now derived from market
  position: 'before' | 'after';
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  currency: Currency;
}

// Full language list (currency metadata kept for reference but market.ts is the source of truth)
export const europeanLanguages: Language[] = [
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', currency: { code: 'SEK', symbol: 'kr', rate: 1, position: 'after' } },
  { code: 'en', name: 'English', flag: '🇬🇧', currency: { code: 'GBP', symbol: '£', rate: 0.074, position: 'before' } },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'fr', name: 'Français', flag: '🇫🇷', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'es', name: 'Español', flag: '🇪🇸', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'pt', name: 'Português', flag: '🇵🇹', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', currency: { code: 'PLN', symbol: 'zł', rate: 0.38, position: 'after' } },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿', currency: { code: 'CZK', symbol: 'Kč', rate: 2.15, position: 'after' } },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺', currency: { code: 'HUF', symbol: 'Ft', rate: 33.5, position: 'after' } },
  { code: 'ro', name: 'Română', flag: '🇷🇴', currency: { code: 'RON', symbol: 'lei', rate: 0.43, position: 'after' } },
  { code: 'bg', name: 'Български', flag: '🇧🇬', currency: { code: 'BGN', symbol: 'лв', rate: 0.17, position: 'after' } },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'da', name: 'Dansk', flag: '🇩🇰', currency: { code: 'DKK', symbol: 'kr', rate: 0.64, position: 'after' } },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'no', name: 'Norsk', flag: '🇳🇴', currency: { code: 'NOK', symbol: 'kr', rate: 0.99, position: 'after' } },
  { code: 'et', name: 'Eesti', flag: '🇪🇪', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'mt', name: 'Malti', flag: '🇲🇹', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪', currency: { code: 'EUR', symbol: '€', rate: 0.086, position: 'after' } },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸', currency: { code: 'ISK', symbol: 'kr', rate: 12.8, position: 'after' } },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', currency: { code: 'UAH', symbol: '₴', rate: 3.85, position: 'after' } },
  { code: 'sr', name: 'Српски', flag: '🇷🇸', currency: { code: 'RSD', symbol: 'дін', rate: 10.1, position: 'after' } },
  { code: 'bs', name: 'Bosanski', flag: '🇧🇦', currency: { code: 'BAM', symbol: 'KM', rate: 0.17, position: 'after' } },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰', currency: { code: 'MKD', symbol: 'ден', rate: 5.3, position: 'after' } },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱', currency: { code: 'ALL', symbol: 'L', rate: 8.7, position: 'after' } },
  { code: 'be', name: 'Беларуская', flag: '🇧🇾', currency: { code: 'BYN', symbol: 'Br', rate: 0.31, position: 'after' } },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', currency: { code: 'TRY', symbol: '₺', rate: 3.0, position: 'after' } },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  languages: Language[];
  /** Market config derived from current language */
  market: MarketConfig;
  /** Format a GBP price to the current market's locale+currency string */
  formatPrice: (gbpPrice: number, decimals?: number) => string;
  /** Convert a GBP price to the current market's currency (raw number) */
  convertPrice: (gbpPrice: number) => number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('snusfriend-language');
    if (saved) {
      const parsed = JSON.parse(saved);
      return europeanLanguages.find(l => l.code === parsed.code) || europeanLanguages[1]; // default EN
    }
    return europeanLanguages[1]; // English as default
  });

  useEffect(() => {
    localStorage.setItem('snusfriend-language', JSON.stringify(currentLanguage));
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => setCurrentLanguage(lang);

  const market = useMemo(() => getMarketForLanguage(currentLanguage.code), [currentLanguage.code]);

  const convertPrice = (gbpPrice: number): number => {
    return convertFromGBP(gbpPrice, market);
  };

  const formatPrice = (eurPrice: number, decimals: number = 2): string => {
    const converted = convertFromGBP(eurPrice, market);
    const formatted = formatMarketPrice(converted, market, decimals);
    // For non-EUR markets, prefix with ≈ to signal approximation
    if (market.currencyCode !== 'EUR') {
      return `≈ ${formatted}`;
    }
    return formatted;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      languages: europeanLanguages,
      market,
      formatPrice,
      convertPrice,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
