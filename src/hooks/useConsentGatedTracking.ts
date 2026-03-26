import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { initAnalytics } from '@/lib/analytics';
import { initMarketingPixels } from '@/lib/marketing-pixels';

/**
 * Initializes analytics and marketing pixels when the user grants consent.
 * Mount once at the app root (e.g., in App.tsx).
 */
export function useConsentGatedTracking() {
  const { allowsAnalytics, allowsMarketing, hasConsented } = useCookieConsent();

  useEffect(() => {
    if (!hasConsented) return;
    if (allowsAnalytics) {
      initAnalytics();
    }
  }, [hasConsented, allowsAnalytics]);

  useEffect(() => {
    if (!hasConsented) return;
    if (allowsMarketing) {
      initMarketingPixels();
    }
  }, [hasConsented, allowsMarketing]);
}
