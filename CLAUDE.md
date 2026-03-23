# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
bun run dev          # Vite dev server
bun run build        # Production build (use to verify TypeScript compiles)
bun run lint         # ESLint
bun run test         # Run all Vitest tests once
bun run test -- src/test/example.test.ts   # Scoped test file
bunx vitest run "src/**/*checkout*.test.ts"
bun run test -- -t "test name substring"
bun run sitemap      # Regenerate public/sitemap.xml from live catalog
```

Test environment is `jsdom`; setup file is `src/test/setup.ts`. Deno is not installed,
so edge function unit tests cannot run locally.

## Architecture

This is a **headless B2C nicotine pouch shop** — Nyehandel-first.

> **IMPORTANT: This is a Vite SPA — NOT Next.js.** Ignore any Next.js-specific suggestions
> (App Router, Server Components, `middleware.ts`, `proxy.ts`, etc.). All rendering is client-side.

- **Frontend:** React + Vite + TypeScript + Tailwind + shadcn/ui (`src/`)
- **Backend:** Supabase Edge Functions (`supabase/functions/`)
- **Database:** Supabase PostgreSQL (`supabase/migrations/`)
- **Commerce + Payment + Fulfilment:** Nyehandel
- **Logistics:** Nylogistik (built into Nyehandel — no separate API integration)
- **Package manager:** Bun (always `bun`, never `npm`)

Shopify has been fully removed. There are no Shopify functions, webhooks, or references.

Tiebreaker docs: `ROADMAP.md` and `CURRENT_PRIORITIES.md`.

### Order Flow (target — Steps 26–29)

```
src/pages/CheckoutHandoff.tsx
  -> POST supabase/functions/create-nyehandel-checkout
  -> Nyehandel POST /orders/simple
  -> delivery_callback_url receives tracking when shipped
  -> orders row updated (tracking_id, tracking_url, status → shipped)
  -> supabase/functions/push-order-to-nyehandel (fulfilment confirmation)
  -> cron: retry-failed-nyehandel-orders
```

### Ops / B2B Alerts Flow

```
pg_cron 01:15 UTC
  -> supabase/functions/ops-b2b-queues  (x-cron-secret auth, upserts ops_alerts)
    rules: supabase/functions/ops-b2b-queues/rules.ts
  -> src/pages/ops/OpsDashboard.tsx  (reads ops_alerts via useOpsAlerts hook)
```

### Frontend layers

- Pages: `src/pages/` — route-level components; ops pages under `src/pages/ops/`
- Hooks: `src/hooks/` — React Query wrappers; fail closed on DB error
- Context: `src/context/` — state providers wrapped in `src/App.tsx`
- API helper: `src/lib/api.ts` — authenticated edge-function calls
- Auth guard: `src/components/auth/OpsAuthGuard.tsx` — protects ops routes

### Database types

`src/integrations/supabase/types.ts` is manually maintained. When schema migrations
change app-facing tables, update `types.ts` in the same task.

**Never use `(supabase as any).from(...)`** — add the missing table to `types.ts` instead.
Tables present: `orders`, `ops_alerts`, `points_balances`, `points_transactions`,
`waitlist_emails`, `newsletter_subscribers`, `sync_config`, and more.

### Edge Function conventions

- All functions live in `supabase/functions/<name>/index.ts`
- Public-facing functions: `verify_jwt = false` in `supabase/config.toml`
- Internal functions: `verify_jwt = true`
- Internal function-to-function calls: `x-internal-function-secret`
- Cron-triggered functions: `x-cron-secret`
- Functions return structured JSON errors with machine-readable `error` keys and `requestId`

## UI Conventions

- **SheetContent** always needs `<SheetTitle>` (import from `@/components/ui/sheet`). Use `className="sr-only"` if visually hidden.
- **Quantity/icon buttons** need `aria-label` describing the action and target item.
- **Email validation:** use `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())` — not `.includes('@')`.
- **Expensive list components** (cards, list items): wrap with `React.memo`; wrap handlers with `useCallback`.
- **Theme:** The velo theme is in `src/index.css` as CSS custom properties (`--primary`, `--background`, etc.).
  Inter is the primary font; all spacing/radius tokens come from the theme. Never hardcode colors inline.

## Git / Lovable Workflow

Lovable pushes to `main` frequently. Before pushing:

```bash
git pull --no-rebase   # merge Lovable's commits first; --rebase will cause conflicts
git push
```

Conflict patterns:
- `src/integrations/supabase/types.ts` → use `--ours` (our version has extra tables Lovable doesn't know about)
- `src/data/brand-overrides.ts` → use `--ours` (our version has real product data from NordicPouch CSV)
- Everything else → merge manually, preserving both sides

## Hard Boundaries

- Never edit `src/lib/cart-utils.ts` without explicit permission.
- All order, checkout, and Nyehandel logic must stay in `supabase/functions/`.
- Never add Shopify-specific code — Shopify has been fully removed.
- Never implement Pipedrive, WhatsApp, or Cowork automation in this repo.
- Never introduce Python or Flask runtime paths into production flow.
- Never commit secrets, service-role keys, API tokens, or customer data.

## State and Secrets

- Frontend env vars use the `VITE_` prefix.
- Server secrets belong in Supabase secrets only — never in frontend env files.
- When adding a new edge-function secret, update `.env.example` and
  `DEPLOYMENT_CHECKLIST.md` in the same task.

## Where Things Stand (as of 2026-03-24)

- Steps 26–38: ✅ Done (checkout, catalog sync, auth, preview mode, badge seeding, pg_cron)
- Checkout wiring: ✅ Nyehandel payment "NFC Group Payment" + shipping "UPS Standard (J229F1)" configured
- Rewards system: ✅ Daily spin wheel, server-side prize determination, vouchers, SnusPoints
- Product badges: ✅ Seeded in Supabase — popular (310), newPrice (154), new (60), limited (52)
- Filter system: ✅ 8 filters — brand, strength, flavor, format, nicotine mg, price, stock, category
- Navigation: ✅ Simplified header (Shop/Brands/Rewards/Snus Family), quick-filter tabs on Shop page
- Brand discovery: ✅ Homepage carousel, "also try" on brand pages, 24 featured brands, sticky A-Z
- UX overhaul: ✅ Compact cards, subtle zoom hover, search + pagination, WCAG color fixes
- Dynamic brands: ✅ useBrands() hook, dynamic nav/filters/listing, all 91+ brands from Supabase
- Security: ✅ RLS on sync_config, consolidated duplicate policies, mutable search_path fixed
- Accessibility: ✅ WCAG AA color contrast on all flavor/strength accents, Lighthouse 100 homepage
- Brand overrides: ✅ Rebuilt from NordicPouch CSV with real product data
- Account: ✅ Settings form wired to Supabase auth, Change Password linked
- Info pages: ✅ Real content for FAQ, Contact, Shipping, Returns, About
- SEO/GEO: ✅ robots.txt, llms.txt, dynamic sitemap (731 products, 139 brands)
- Infrastructure: ✅ Vault secrets set, sync_config populated, delivery webhook registered
- PWA: ✅ Workbox service worker, manifest, install prompt, offline app shell
- Logo: ✅ SF monogram in teal shield
- Types: ✅ types.ts synced with schema (daily_spins, vouchers, spin_config, ops_alerts, etc.)
- Code review: ✅ 3 critical + 4 important issues fixed (PrizeReveal, atomic RPC, types, search escape)
- Domain: ✅ snusfriends.com live — Cloudflare DNS (A + CNAME, proxy off), Vercel verified, SSL active
- Supabase auth: ✅ Site URL = https://snusfriends.com, redirect URLs updated, localhost entries removed
- Webhook: ✅ Nyehandel delivery webhook configured, secret aligned (obscure-witness-afraid)
- VITE_SITE_URL: ✅ Updated to https://snusfriends.com
- Edge functions: ✅ spin-wheel v2 + create-nyehandel-checkout v16 deployed to Supabase
- Preview mode: 🟢 Active (VITE_PREVIEW_MODE=true) — ready to disable for go-live
- Step 39 UAT: 🟡 BLOCKED — awaiting CEO answer on API order flow before placing test order
- Legal pages: 🟡 Waiting on solicitor sign-off (Terms, Privacy, Cookies)
- Next phase: CEO order flow decision → test order → product images → retail pricing → blog agent pipeline

## Project Docs

Read before complex work; update when done:

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Canonical step-by-step progress tracker |
| `CURRENT_PRIORITIES.md` | Active workstreams and what to build next |
| `SYSTEM_BOUNDARIES.md` | Architecture rules and ownership |
| `AGENTS.md` | Extended coding rules for agentic tools |
| `NYEHANDEL_API_REFERENCE.md` | Full Nyehandel API reference — read before any order/checkout work |
| `NYEHANDEL_API.md` | Step 25 investigation log — checkout flow design decisions |
| `DEPLOYMENT_CHECKLIST.md` | Required secrets and deploy order |
