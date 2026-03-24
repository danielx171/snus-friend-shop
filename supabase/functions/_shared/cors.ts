// supabase/functions/_shared/cors.ts
// Deno-only file — no declare needed, Deno is a native global here.

const ALLOWED_ORIGINS = new Set([
  "https://snusfriends.com",
  "https://www.snusfriends.com",
]);

const envOrigin = Deno.env.get("ALLOWED_ORIGIN");

/** Return CORS headers matching the request origin (www or non-www). */
export function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  let origin: string;
  if (envOrigin) {
    origin = envOrigin;
  } else if (requestOrigin && ALLOWED_ORIGINS.has(requestOrigin)) {
    origin = requestOrigin;
  } else {
    origin = "https://www.snusfriends.com";
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
