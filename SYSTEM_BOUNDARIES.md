# System Boundaries

Last updated: 2026-03-26

This is the compact rule file for planning and implementation.

## Canonical sources

- `ROADMAP.md` is the delivery sequence and current execution order.
- `CURRENT_PRIORITIES.md` is the latest session-level status log.
- `AGENTS.md` and `.cursorrules` are mandatory operating rules.

## Architecture

This is a **headless B2C nicotine pouch shop** built on:
- **Frontend:** Astro 6 + React islands + TypeScript + Tailwind v4 + shadcn/ui (in `src/`)
- **Backend:** Supabase Edge Functions (in `supabase/functions/`)
- **Database:** Supabase PostgreSQL (migrations in `supabase/migrations/`)
- **Commerce:** Nyehandel (platform + payment + fulfilment)
- **Logistics:** Nylogistik (built into Nyehandel — no separate integration needed)
- **Package manager:** Bun (always use `bun` not `npm`)

## Architecture boundaries

- Frontend lives in `src/`.
- Checkout, order, webhook, and fulfilment logic live in `supabase/functions/`.
- Database changes must be forward-only SQL migrations in `supabase/migrations/`.
- `src/integrations/supabase/types.ts` is manually maintained and must stay in sync
  with schema changes.

## Hard no-go areas

- Never edit `src/lib/cart-utils.ts` without explicit permission.
- Never commit secrets, service-role keys, API tokens, or customer data.
- Never introduce Python or Flask runtime paths into production flow here.
- Never add Shopify-specific code — Shopify has been removed from this project.

## External systems — current scope

| System | Role | Integration status |
|--------|------|--------------------|
| Nyehandel | Commerce platform, payment, order management | Active — see `NYEHANDEL_API_REFERENCE.md` |
| Nylogistik | Warehouse + shipping (built into Nyehandel) | Active — covered in `NYEHANDEL_API_REFERENCE.md` |
| Supabase | Database + Edge Functions + Auth | Active |

## External systems — future scope (not started)

| System | Role | Notes |
|--------|------|--------------------|
| Pipedrive | CRM — B2B pipeline tracking | William is building this separately. When ready, we can pull relevant data (customer history, deal data) into our system. Do not implement in this repo until that integration is defined. |
| WhatsApp | Customer messaging automation | Future — William's domain |
| Cowork | Desktop automation | Future — William's domain |

## Operational rules

- Use Bun-first commands: `bun install`, `bun run lint`, `bun run build`, `bun run test`.
- Keep diffs small and scoped to the task surface.
- In a dirty worktree, do not revert unrelated changes.
- When new edge-function secrets are introduced, update `.env.example` and
  `DEPLOYMENT_CHECKLIST.md` in the same task.
- API reference docs: `NYEHANDEL_API_REFERENCE.md` and `NYEHANDEL_API.md` are the
  source of truth for all Nyehandel integration work. Read them before touching
  any order/checkout/fulfilment code.

## Where things stand (as of 2026-03-26)

**Astro 6 migration: Live** — Migrated from Vite SPA to Astro 6 with React islands.
SSG for all public pages, SSR for auth/checkout. Deployed on Vercel via `@astrojs/vercel`.

**Frontend architecture:**
- Pages: `.astro` files in `src/pages/` (30 pages — 18 SSG, 12 SSR)
- React islands: `client:visible`, `client:idle`, `client:load` for interactive components
- State: nanostores (`src/stores/`) — cart, auth, theme, wishlist, cookie-consent, language, easter
- Content Layer: Supabase loader fetches products + brands at build time
- Styling: Tailwind v4 via `@tailwindcss/vite` plugin + shadcn/ui

**Steps 1-55: Done** — Checkout, catalog sync, security, gamification UI, go-live sprint complete.

**Codebase scale:** 47 database tables, 20 edge functions, 42 migrations, 23 hooks, 30 pages.

**SEO:** Lighthouse 100/100 SEO score. FAQPage + Organization + WebSite + Product + CollectionPage
schemas. Auto-generated sitemap via `@astrojs/sitemap`. GEO: `llms.txt` + AI crawler access in robots.txt.

**Design system: 8.5/10** — Glass-panel aesthetic, navy+lime palette, premium animations.

**Version: 1.5.0** — Astro 6, SSG/SSR hybrid, React islands, nanostores.

**Next:** SEO content (category page copy, blog posts), accessibility fixes, gamification backend wiring.
