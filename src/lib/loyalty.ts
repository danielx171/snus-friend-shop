import { tenant } from '@/config/tenant';

export const loyaltyProgramName = tenant.loyaltyProgramName;
export const loyaltyCurrencyName = tenant.loyaltyCurrencyName;

export const getLoyaltyCurrencyName = (): string => loyaltyCurrencyName;
