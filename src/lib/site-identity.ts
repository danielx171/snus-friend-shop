import { tenant } from '@/config/tenant';

/**
 * Replaces the current default-tenant brand/domain/support literals with the
 * active storefront identity so shared content data can stay deployment-aware.
 */
export const replaceSiteIdentity = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value
    .replaceAll('{{siteName}}', tenant.name)
    .replaceAll('{{loyaltyCurrencyName}}', tenant.loyaltyCurrencyName)
    .replaceAll('hello@snusfriends.com', tenant.supportEmail)
    .replaceAll('support@snusfriends.com', tenant.supportEmail)
    .replaceAll('snusfriends.com', tenant.domain)
    .replaceAll('SnusPoints', tenant.loyaltyCurrencyName)
    .replaceAll('SnusCoins', tenant.loyaltyCurrencyName)
    .replaceAll('SnusCoin', tenant.loyaltyCurrencyName)
    .replaceAll('SnusFriends', tenant.name)
    .replaceAll('SnusFriend', tenant.name);
};
