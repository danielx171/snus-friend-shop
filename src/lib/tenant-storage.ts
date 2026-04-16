import { tenant } from '@/config/tenant';

export type TenantStorageKey = keyof typeof tenant.storage;

export const storageKeys = tenant.storage;

export const getStorageKey = (key: TenantStorageKey): string => storageKeys[key];
