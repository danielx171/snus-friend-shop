// supabase/functions/_shared/cors.ts
// Deno-only file — no declare needed, Deno is a native global here.
export const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret, x-cron-secret, x-internal-function-secret",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
