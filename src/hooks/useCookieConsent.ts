import { useState, useCallback } from 'react';

const STORAGE_KEY = 'snusfriend-cookie-consent';

export type ConsentLevel = 'none' | 'essential' | 'all';

interface ConsentState {
  level: ConsentLevel;
  timestamp: number;
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as ConsentState;
    } catch {}
    return { level: 'none' as ConsentLevel, timestamp: 0 };
  });

  const accept = useCallback((level: 'essential' | 'all') => {
    const state: ConsentState = { level, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setConsent(state);
  }, []);

  const hasConsented = consent.level !== 'none';
  const allowsAnalytics = consent.level === 'all';

  return { consent, accept, hasConsented, allowsAnalytics };
}
