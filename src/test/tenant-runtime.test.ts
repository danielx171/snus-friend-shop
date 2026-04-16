import { describe, expect, it } from 'vitest';
import { resolveTenantRuntime } from '@/config/tenant';

describe('resolveTenantRuntime', () => {
  it('derives tenant-safe storage keys from TENANT_STORAGE_PREFIX', () => {
    const runtime = resolveTenantRuntime({
      TENANT_ID: 'tenant-b',
      SITE_URL: 'https://tenant-b.example',
      SITE_NAME: 'Tenant B',
      TENANT_STORAGE_PREFIX: 'tenantb',
    });

    expect(runtime.tenant.storage.cartKey).toBe('tenantb_cart');
    expect(runtime.tenant.storage.compareKey).toBe('tenantb_compare');
    expect(runtime.tenant.storage.beginnerKey).toBe('tenantb_beginner');
    expect(runtime.tenant.storage.historyKey).toBe('tenantb_history');
    expect(runtime.tenant.storage.buyNowKey).toBe('tenantb_buynow');
  });

  it('preserves the default tenant storage keys when no override is provided', () => {
    const runtime = resolveTenantRuntime();

    expect(runtime.tenant.storage.cartKey).toBe('snusfriend_cart');
    expect(runtime.tenant.storage.compareKey).toBe('snusfriend_compare');
    expect(runtime.tenant.storage.beginnerKey).toBe('snusfriend_beginner');
    expect(runtime.tenant.storage.historyKey).toBe('snusfriend_history');
    expect(runtime.tenant.storage.buyNowKey).toBe('snusfriend_buynow');
  });

  it('applies tenant launch overrides for loyalty currency and checkout locale settings', () => {
    const runtime = resolveTenantRuntime({
      SITE_URL: 'https://nordicplus.eu',
      SITE_NAME: 'NordicPlus',
      LOYALTY_CURRENCY_NAME: 'NordicPoints',
      ORDER_PREFIX: 'NP',
      ORDER_LOCALE: 'sv-se',
    });

    expect(runtime.tenant.loyaltyCurrencyName).toBe('NordicPoints');
    expect(runtime.tenant.orderPrefix).toBe('NP');
    expect(runtime.tenant.locale).toBe('sv-se');
  });
});
