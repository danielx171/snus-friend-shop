// Re-export everything from the new cookie-consent provider.
// This file is kept for backwards compatibility — components that imported
// from @/context/CookieConsentContext will now get the new provider's
// context, avoiding the "must be used within CookieConsentProvider" error.

export {
  CookieConsentProvider,
  useCookieConsent,
  type CookieConsentContextValue,
  type ConsentState,
} from '@/components/cookie-consent/CookieConsentProvider';

/** @deprecated Use ConsentCategories from the new provider instead. */
export type ConsentLevel = 'none' | 'essential' | 'all';

export interface ConsentCategories {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}
