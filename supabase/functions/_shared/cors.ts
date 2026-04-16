// supabase/functions/_shared/cors.ts
// Deno-only file — no declare needed, Deno is a native global here.

import { normalizeSiteUrl, resolveTenantRuntime } from "../../../src/config/tenant.ts";

const parseAllowedOrigins = (value?: string | null) =>
  (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const runtime = resolveTenantRuntime({
  TENANT_ID: Deno.env.get("TENANT_ID"),
  PUBLIC_TENANT_ID: Deno.env.get("PUBLIC_TENANT_ID"),
  VITE_TENANT_ID: Deno.env.get("VITE_TENANT_ID"),
  SITE_URL: Deno.env.get("SITE_URL"),
  PUBLIC_SITE_URL: Deno.env.get("PUBLIC_SITE_URL"),
  VITE_SITE_URL: Deno.env.get("VITE_SITE_URL"),
  SITE_NAME: Deno.env.get("SITE_NAME"),
  SUPPORT_EMAIL: Deno.env.get("SUPPORT_EMAIL"),
  STOREFRONT_HOSTS: Deno.env.get("STOREFRONT_HOSTS"),
  ALLOWED_ORIGINS: Deno.env.get("ALLOWED_ORIGINS"),
  ALLOWED_ORIGIN: Deno.env.get("ALLOWED_ORIGIN"),
});
const configuredOrigins = parseAllowedOrigins(Deno.env.get("ALLOWED_ORIGINS"));
const legacyOrigin = normalizeSiteUrl(Deno.env.get("ALLOWED_ORIGIN"));
const allowedOrigins = new Set(
  configuredOrigins.length > 0
    ? configuredOrigins.map((origin) => normalizeSiteUrl(origin) ?? origin)
    : legacyOrigin
      ? [legacyOrigin]
      : runtime.storefrontOrigins,
);

const defaultOrigin = [...allowedOrigins][0] ?? runtime.siteOrigin;

/** Return CORS headers matching the request origin (www or non-www). */
export function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  let origin: string;
  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    origin = requestOrigin;
  } else {
    origin = defaultOrigin;
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-webhook-secret, x-cron-secret, x-internal-function-secret",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

/** Static fallback for functions that don't pass the request origin. */
export const corsHeaders = getCorsHeaders();
