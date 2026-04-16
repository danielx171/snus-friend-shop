import { resolveTenantRuntime } from "../../../src/config/tenant.ts";

declare const Deno: {
  env: { get: (key: string) => string | undefined };
};

const runtime = resolveTenantRuntime({
  TENANT_ID: Deno.env.get("TENANT_ID"),
  PUBLIC_TENANT_ID: Deno.env.get("PUBLIC_TENANT_ID"),
  VITE_TENANT_ID: Deno.env.get("VITE_TENANT_ID"),
  SITE_URL: Deno.env.get("SITE_URL"),
  PUBLIC_SITE_URL: Deno.env.get("PUBLIC_SITE_URL"),
  VITE_SITE_URL: Deno.env.get("VITE_SITE_URL"),
  SITE_NAME: Deno.env.get("SITE_NAME"),
  LEGAL_NAME: Deno.env.get("LEGAL_NAME"),
  SITE_TAGLINE: Deno.env.get("SITE_TAGLINE"),
  SUPPORT_EMAIL: Deno.env.get("SUPPORT_EMAIL"),
  EMAIL_FROM_ADDRESS: Deno.env.get("EMAIL_FROM_ADDRESS"),
  EMAIL_FROM_NAME: Deno.env.get("EMAIL_FROM_NAME"),
  STOREFRONT_HOSTS: Deno.env.get("STOREFRONT_HOSTS"),
  TENANT_STORAGE_PREFIX: Deno.env.get("TENANT_STORAGE_PREFIX"),
  LOYALTY_CURRENCY_NAME: Deno.env.get("LOYALTY_CURRENCY_NAME"),
  ORDER_PREFIX: Deno.env.get("ORDER_PREFIX"),
  ORDER_LOCALE: Deno.env.get("ORDER_LOCALE"),
  LOCALE: Deno.env.get("LOCALE"),
  JURISDICTION: Deno.env.get("JURISDICTION"),
  DPA_NAME: Deno.env.get("DPA_NAME"),
  DPA_URL: Deno.env.get("DPA_URL"),
  FOUNDER_NAME: Deno.env.get("FOUNDER_NAME"),
  DEFAULT_AUTHOR_NAME: Deno.env.get("DEFAULT_AUTHOR_NAME"),
  DEFAULT_AUTHOR_JOB_TITLE: Deno.env.get("DEFAULT_AUTHOR_JOB_TITLE"),
  DEFAULT_AUTHOR_BIO: Deno.env.get("DEFAULT_AUTHOR_BIO"),
  DEFAULT_AUTHOR_SAME_AS: Deno.env.get("DEFAULT_AUTHOR_SAME_AS"),
  DEFAULT_AUTHOR_SLUG: Deno.env.get("DEFAULT_AUTHOR_SLUG"),
  DEFAULT_AUTHOR_CREDENTIALS: Deno.env.get("DEFAULT_AUTHOR_CREDENTIALS"),
  ALLOWED_ORIGINS: Deno.env.get("ALLOWED_ORIGINS"),
  ALLOWED_ORIGIN: Deno.env.get("ALLOWED_ORIGIN"),
});

export const siteUrl = runtime.siteUrl;
export const siteOrigin = runtime.siteOrigin;
export const siteHost = runtime.siteHost;
export const siteName = runtime.siteName;
export const siteTagline = runtime.tenant.tagline;
export const supportEmail = runtime.supportEmail;
export const emailFromAddress = runtime.emailFromAddress;
export const emailFromName = runtime.emailFromName;
export const loyaltyProgramName = runtime.tenant.loyaltyProgramName;
export const loyaltyCurrencyName = runtime.tenant.loyaltyCurrencyName;
export const orderPrefix = runtime.tenant.orderPrefix;
export const locale = runtime.tenant.locale;
export const currencyCode = runtime.tenant.currencyCode;
export const freeShippingThreshold = runtime.tenant.freeShippingThreshold;

export const buildSiteUrl = (path: string) =>
  new URL(path, `${siteOrigin}/`).href;
