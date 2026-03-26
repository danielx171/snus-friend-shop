import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  answered: boolean;
}

const defaultConsent: ConsentState = { analytics: false, marketing: false, answered: false };

export const $cookieConsent = persistentAtom<ConsentState>(
  tenant.storage.consentKey,
  defaultConsent,
  { encode: JSON.stringify, decode: JSON.parse },
);

export function acceptAll() { $cookieConsent.set({ analytics: true, marketing: true, answered: true }); }
export function rejectAll() { $cookieConsent.set({ analytics: false, marketing: false, answered: true }); }
export function setConsent(analytics: boolean, marketing: boolean) {
  $cookieConsent.set({ analytics, marketing, answered: true });
}
