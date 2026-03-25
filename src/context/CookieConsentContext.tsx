import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

const STORAGE_KEY = 'snusfriend-cookie-consent';

export interface ConsentCategories {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

/** @deprecated Use ConsentCategories instead. Kept for re-export compatibility. */
export type ConsentLevel = 'none' | 'essential' | 'all';

interface ConsentState {
  categories: ConsentCategories;
  timestamp: number;
}

const DEFAULT_CATEGORIES: ConsentCategories = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

export interface CookieConsentContextValue {
  consent: ConsentState;
  /** @deprecated Use acceptAll / rejectNonEssential / updateConsent instead. */
  accept: (level: 'essential' | 'all') => void;
  hasConsented: boolean;
  allowsAnalytics: boolean;
  allowsMarketing: boolean;
  allowsPersonalization: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  updateConsent: (category: keyof Omit<ConsentCategories, 'essential'>, value: boolean) => void;
  saveCustomPreferences: (categories: Omit<ConsentCategories, 'essential'>) => void;
}

export const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function persist(state: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode / quota exceeded).
    // Consent is kept in React state for this session only.
  }
}

function loadStored(): ConsentState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Migrate from old binary format
    if ('level' in parsed && !('categories' in parsed)) {
      const categories: ConsentCategories = {
        essential: true,
        analytics: parsed.level === 'all',
        marketing: parsed.level === 'all',
        personalization: parsed.level === 'all',
      };
      return { categories, timestamp: parsed.timestamp ?? Date.now() };
    }
    return parsed as ConsentState;
  } catch {
    return null;
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(() => {
    const stored = loadStored();
    if (stored) return stored;
    return { categories: { ...DEFAULT_CATEGORIES }, timestamp: 0 };
  });

  const applyConsent = useCallback((categories: ConsentCategories) => {
    const state: ConsentState = { categories, timestamp: Date.now() };
    persist(state);
    setConsent(state);
  }, []);

  const acceptAll = useCallback(() => {
    applyConsent({ essential: true, analytics: true, marketing: true, personalization: true });
  }, [applyConsent]);

  const rejectNonEssential = useCallback(() => {
    applyConsent({ ...DEFAULT_CATEGORIES });
  }, [applyConsent]);

  const updateConsent = useCallback(
    (category: keyof Omit<ConsentCategories, 'essential'>, value: boolean) => {
      setConsent((prev) => {
        const next: ConsentState = {
          categories: { ...prev.categories, [category]: value },
          timestamp: Date.now(),
        };
        persist(next);
        return next;
      });
    },
    [],
  );

  const saveCustomPreferences = useCallback(
    (categories: Omit<ConsentCategories, 'essential'>) => {
      applyConsent({ essential: true, ...categories });
    },
    [applyConsent],
  );

  // Legacy adapter for old accept('essential' | 'all') API
  const accept = useCallback(
    (level: 'essential' | 'all') => {
      if (level === 'all') acceptAll();
      else rejectNonEssential();
    },
    [acceptAll, rejectNonEssential],
  );

  const value: CookieConsentContextValue = {
    consent,
    accept,
    hasConsented: consent.timestamp > 0,
    allowsAnalytics: consent.categories.analytics,
    allowsMarketing: consent.categories.marketing,
    allowsPersonalization: consent.categories.personalization,
    acceptAll,
    rejectNonEssential,
    updateConsent,
    saveCustomPreferences,
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
