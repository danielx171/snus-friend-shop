import { describe, expect, it } from 'vitest';
import {
  buildGuestOrderConfirmRedirect,
  extractGuestOrderIdFromNext,
  getGuestAccountErrorMessage,
  normalizeGuestOrderEmail,
} from '@/lib/server-guest-orders';

describe('normalizeGuestOrderEmail', () => {
  it('trims and lowercases guest emails before signup checks', () => {
    expect(normalizeGuestOrderEmail(' Guest@Example.COM ')).toBe('guest@example.com');
  });

  it('returns null for empty values', () => {
    expect(normalizeGuestOrderEmail('   ')).toBeNull();
  });
});

describe('guest order auth redirect helpers', () => {
  it('round-trips the guest order id through /auth/confirm', () => {
    const redirect = buildGuestOrderConfirmRedirect(
      'https://snusfriends.com',
      'order-123',
      'Guest@Example.COM',
    );
    const url = new URL(redirect);

    expect(url.pathname).toBe('/auth/confirm');
    expect(extractGuestOrderIdFromNext(url.searchParams.get('next'))).toBe('order-123');
  });

  it('ignores unrelated next targets', () => {
    expect(extractGuestOrderIdFromNext('/account')).toBeNull();
  });
});

describe('getGuestAccountErrorMessage', () => {
  it('maps rate limits to product copy', () => {
    expect(getGuestAccountErrorMessage({ code: 'over_email_send_rate_limit' })).toBe(
      'Please wait about a minute before trying again.',
    );
  });

  it('maps existing-account errors to a login nudge', () => {
    expect(getGuestAccountErrorMessage({ code: 'user_already_exists' })).toBe(
      'That email already has an account. Log in to view your order.',
    );
  });
});
