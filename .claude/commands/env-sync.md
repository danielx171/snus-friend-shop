# Sync Environment Variables

Ensure .env.local has all required Astro PUBLIC_ vars matching VITE_ legacy vars.

## Steps

1. **Read** `.env.local`
2. **Check required vars exist:**

   | Var | Source | Required By |
   |-----|--------|-------------|
   | `PUBLIC_SUPABASE_URL` | Same as `VITE_SUPABASE_URL` | Astro middleware, browser client |
   | `PUBLIC_SUPABASE_ANON_KEY` | Same as `VITE_SUPABASE_PUBLISHABLE_KEY` | Astro middleware, browser client |
   | `PUBLIC_SITE_URL` | Same as `VITE_SITE_URL` | SEO, canonical URLs |
   | `PUBLIC_PREVIEW_MODE` | Same as `VITE_PREVIEW_MODE` | Preview gate |
   | `PUBLIC_SENTRY_DSN` | Same as `VITE_SENTRY_DSN` | Error tracking |
   | `PUBLIC_POSTHOG_KEY` | Same as `VITE_POSTHOG_KEY` | Analytics |
   | `PUBLIC_POSTHOG_HOST` | Same as `VITE_POSTHOG_HOST` | Analytics |
   | `SUPABASE_URL` | Same as `PUBLIC_SUPABASE_URL` | Content Layer (build-time) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Content Layer (build-time) |

3. **Add missing vars** — Copy values from VITE_ counterparts
4. **Verify** — `bun run build` to confirm Content Layer loads
5. **Report** — List added/missing vars

## When to Run
- After `vercel env pull` (which only creates VITE_ vars)
- When Content Layer shows "collection empty" warnings
- After changing Supabase project or API keys
