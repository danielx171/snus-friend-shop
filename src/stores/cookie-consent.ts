import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  answered: boolean;
}

const defaultConsent: ConsentState = { analytics: false, marketing: false, answered: false };

function broadcastConsent(next: ConsentState) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: next }));
  }
}

export const $cookieConsent = persistentAtom<ConsentState>(
  tenant.storage.consentKey,
  defaultConsent,
  { encode: JSON.stringify, decode: JSON.parse },
);

export function acceptAll() {
  const next = { analytics: true, marketing: true, answered: true };
  $cookieConsent.set(next);
  broadcastConsent(next);
}

export function rejectAll() {
  const next = { analytics: false, marketing: false, answered: true };
  $cookieConsent.set(next);
  broadcastConsent(next);
}

export function setConsent(analytics: boolean, marketing: boolean) {
  const next = { analytics, marketing, answered: true };
  $cookieConsent.set(next);
  broadcastConsent(next);
}
