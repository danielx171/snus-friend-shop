import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

const STORAGE_KEY = 'snusfriend-cookie-consent';

export type ConsentLevel = 'none' | 'essential' | 'all';

interface ConsentState {
  level: ConsentLevel;
  timestamp: number;
}

interface CookieConsentContextValue {
  consent: ConsentState;
  accept: (level: 'essential' | 'all') => void;
  hasConsented: boolean;
  allowsAnalytics: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as ConsentState;
    } catch {
      // Storage unavailable (private mode / quota exceeded).
    }
    return { level: 'none' as ConsentLevel, timestamp: 0 };
  });

  const accept = useCallback((level: 'essential' | 'all') => {
    const state: ConsentState = { level, timestamp: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode / quota exceeded).
      // Consent is kept in React state for this session only.
    }
    setConsent(state);
  }, []);

  const value: CookieConsentContextValue = {
    consent,
    accept,
    hasConsented: consent.level !== 'none',
    allowsAnalytics: consent.level === 'all',
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
}
