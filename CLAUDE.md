# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
bun run dev          # Astro dev server (port 8080)
bun run build        # Production build (Astro + Vercel adapter)
bun run check        # Astro type checking
bun run lint         # ESLint
bun run test         # Run all Vitest tests once
bun run test -- src/test/components/ReputationBadge.test.tsx  # Scoped test file
bun run test -- -t "test name substring"
bun run sitemap      # Regenerate public/sitemap.xml from live catalog
```

Test environment is `jsdom`; setup file is `src/test/setup.ts`. Deno is not installed,
so edge function unit tests cannot run locally.

## Architecture

This is a **headless B2C nicotine pouch shop** — Nyehandel-first.

> **IMPORTANT: This is an Astro 6 site with React islands — NOT Next.js, NOT a Vite SPA.**
> Ignore Next.js-specific suggestions. Pages are `.astro` files. React only hydrates
> where interactivity is needed (cart, add-to-cart, wishlist). State via nanostores.

- **Frontend:** Astro 6 + React islands + TypeScript + Tailwind v4 + shadcn/ui (`src/`)
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
  -> Nyehandel POST /orders  (X-Language: en header REQUIRED)
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
- **Nyehandel API calls MUST include `X-Language: en` header** — product/method names are stored per-locale and the API returns Swedish defaults without it

## UI Conventions

- **SheetContent** always needs `<SheetTitle>` (import from `@/components/ui/sheet`). Use `className="sr-only"` if visually hidden.
- **Quantity/icon buttons** need `aria-label` describing the action and target item.
- **Email validation:** use `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())` — not `.includes('@')`.
- **Expensive list components** (cards, list items): wrap with `React.memo`; wrap handlers with `useCallback`.
- **Theme:** The forest theme (default) is in `src/index.css` as CSS custom properties (`--primary`, `--background`, etc.).
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

## Where Things Stand (as of 2026-03-29 evening)

- Astro 6 migration: ✅ Live on snusfriends.com (SSG + SSR hybrid)
- Steps 1–56: ✅ Done (checkout, catalog sync, auth, security, gamification UI, go-live sprint)
- Version: 1.5.0 — Astro 6, React islands, nanostores, Tailwind v4
- Codebase: 47 tables, 22 edge functions, 44 migrations, ~20 hooks, 94+ pages
- Products: 708 active (deactivated 23 display/accessory items), all with English descriptions + images
- Sitemap: 1,115 pages indexed by Pagefind, sitemap resubmitted to GSC
- GSC: 2 pages indexed (new site), 12 impressions, appearing for 5 queries (pos 9-59)
- Lighthouse: SEO 100, Performance LCP <200ms, Accessibility 93-100, Best Practices 100
- Domain: ✅ snusfriends.com primary (non-www), www redirects via 301
- Visual: ✅ Logo, trust bar, split hero, colored brand headers, blog hero banners, mobile bottom nav
- SEO: ✅ All schemas (BreadcrumbList, FAQPage, ItemList, Product), RSS feed, sitemap, llms.txt
- Gamification: ✅ LIVE — spin wheel, quests, points, avatars, order triggers, homepage CTA
- UX: ✅ Scroll position memory, browsing history, pack upsell, beginner mode, mobile bottom nav
- Beginner Mode: ✅ /beginners landing page, nanostore toggle, homepage filtering, FilterableProductGrid filtering
- Review System: ✅ Full review UI + DB + post-purchase email cron (daily 10:00 UTC, 7-day delay)
- Email: ✅ 4 Resend templates (order_confirmed, order_shipped, welcome, review_request)
- Cron: ✅ 8 active jobs (sync, ops, reviews, blog, news, retry-orders, batch-summaries, review-emails)
- Legal pages: 🟡 Need solicitor sign-off
- Cowork: 15 audits in `cowork/audits/`, 14 mockups in `cowork/mockups/`, 10 content files in `cowork/content/`

## MCP Tools (Connected)

Available via MCP servers — use these instead of manual browser research:

| Tool | Use For | Key Commands |
|------|---------|--------------|
| **Supabase** | DB queries, migrations, edge functions, types | `execute_sql`, `apply_migration`, `deploy_edge_function` |
| **Vercel** | Deployments, env vars, build logs, domains | `list_deployments`, `get_runtime_logs` |
| **Sentry** | Error monitoring, issue triage, release tracking | Read errors/issues from production |
| **DataForSEO** | Keyword research, SERP analysis, competitor data | Keyword volumes, rankings, backlinks |
| **Firecrawl** | Web scraping, content extraction, site crawling | Scrape competitor pages, extract structured data |
| **GSC** | Google Search Console — impressions, clicks, indexing | Search performance, index coverage, sitemap status |
| **Playwright** | Browser automation, E2E testing, visual verification | Navigate pages, click, fill forms, screenshot |
| **Gmail** | Email access (support inbox) | Read/search emails |
| **Cloudflare** | DNS, Workers, R2, D1 | Manage infrastructure |
| **Context7** | Library documentation lookup | Query up-to-date docs for any library |

**SEO workflow:** GSC (current rankings) → DataForSEO (keyword gaps) → Firecrawl (competitor content) → implement changes → GSC (verify impact)

**Error workflow:** Sentry (identify issues) → fix code → Vercel (deploy) → Sentry (verify resolution)

## Astro 6 Architecture (LIVE — deployed March 2026)

Migrated from Vite SPA to Astro 6 for SSG/SSR. Google Ads bans nicotine — all
acquisition is organic SEO, so server-rendered HTML is critical.

- **Design spec:** `docs/superpowers/specs/2026-03-26-astro-migration-design.md`
- **Stack:** Astro 6, Tailwind v4 (`@tailwindcss/vite`), `@astrojs/vercel`, React 18 islands, nanostores
- **Pages:** 94+ Astro pages (SSG + SSR hybrid) in `src/pages/`
  - 43 blog articles, 57 brand pages + 171 sub-pages (flavours/strengths/review), 5 country pages
- **React islands:** FilterableProductGrid, CartDrawer, HeaderCartButton, AddToCartButton, CardAddToCart,
  SearchIsland, MobileMenu, CookieConsentBanner, WishlistIsland, SpinWheelIsland, ProfileCardIsland,
  RecentlyViewedIsland, PointsRedemptionIsland, QuestBoardIsland, LeaderboardIsland, FlavorQuizIsland,
  AchievementGridIsland, AvatarSelectorIsland, CheckoutForm, ProductReviewsIsland, OrderQuestTrigger
- **Stores:** 7 nanostores in `src/stores/` (cart, theme, wishlist, cookie-consent, ui, browsing-history, beginner-mode)
- **Content Layer:** Supabase loader for products + brands at build time (`src/content.config.ts`)
- **Sitemap:** Auto-generated by `@astrojs/sitemap` (excludes auth/checkout pages)
- **Structured data:** Organization, WebSite+SearchAction, Product+AggregateRating, FAQPage, CollectionPage, BreadcrumbList, ItemList
- **GEO:** `public/llms.txt`, AI crawlers allowed in `robots.txt`
- **ISR:** Disabled (known Astro+Vercel bug causes 404 on SSR pages); CDN caches static pages

## Deployment

Deploy to production via Vercel promote (not git push to main):

```bash
git push origin astro-migration-clean   # Triggers preview build
npx vercel ls                           # Find the preview deployment URL
echo "y" | npx vercel promote <url>     # Promote to production
```

The `astro-migration-clean` branch is the production branch. Main is used by Lovable.

## Cowork Workflow

Cowork handles content writing, research, and design. Deliverables go in `blog-drafts/` (articles) or `cowork/` (audits, mockups, research).

- **Content:** Cowork writes HTML articles → Claude integrates as `.astro` pages
- **Research:** Cowork does competitor analysis, keyword research, AI visibility audits
- **Design:** Cowork creates HTML/Tailwind mockups → Claude implements
- **Audit reports:** 10 reports in `cowork/audits/`, priority summary in `cowork/README.md`

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
| `docs/superpowers/specs/2026-03-28-competitive-advantage-design.md` | 3-phase competitive strategy (Traffic → Conversion → Community) |
| `docs/superpowers/specs/2026-03-28-visual-upgrade-design.md` | Visual upgrade spec (hero, logo, cards, brand headers, PDP) |
| `cowork/README.md` | Cowork audit summary + priority P0/P1/P2 items |
