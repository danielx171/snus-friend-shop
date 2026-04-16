import { tenantRuntime } from '@/config/tenant';

export const siteUrl = tenantRuntime.siteUrl;
export const siteOrigin = tenantRuntime.siteOrigin;
export const siteHost = tenantRuntime.siteHost;
export const storefrontHosts = [...tenantRuntime.storefrontHosts];
export const storefrontOrigins = [...tenantRuntime.storefrontOrigins];

export const buildAbsoluteUrl = (path: string) => new URL(path, `${siteOrigin}/`).href;
