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

### CEO's Railway Middleware (separate repo — Shopify→NYE)

The CEO maintains a separate Shopify–NYE integration platform deployed on Railway
for other stores (multi-tenant). It is NOT used by snusfriends.com (we go direct
to Nyehandel via edge functions). However, it documents critical **Nyehandel API
behaviours** we must respect:

- **Shipping VAT inconsistency:** NYE create endpoint treats shipping price as
  VAT-inclusive; the update endpoint treats it as VAT-exclusive. For order changes
  where exact shipping VAT matters, cancel + recreate instead of updating.
- **Rounding variance:** NYE truncates line items independently on multi-item
  discounted orders, producing up to €0.01 variance in totals.
- **Company name on updates:** NYE returns a server error when company name is
  included in order updates. Omit it on PATCH/PUT.
- **Email changes ignored:** NYE silently ignores email changes on existing orders.
- **Supported carriers (tracking):** UPS, DHL, PostNord, FedEx (auto-detected).
- **Discount handling:** Discounts must be distributed proportionally across product
  prices before submission (VAT-safe). Never send a separate discount line.
- **SKU validation:** Always validate SKUs against NYE catalog before order submission.
  Missing SKUs should block the order and surface an alert.

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

## Where Things Stand (as of 2026-04-14 — Launch Polish + clean-slate Batch A/B/F closed)

- Astro 6 migration: ✅ Live on snusfriends.com (SSG + SSR hybrid)
- Steps 1–52 + 54–56: ✅ Done. Step 53 (password strength meter + confetti reduced-motion) still open. Launch Polish Sprint (Apr 8–12) shipped in full. See `CURRENT_PRIORITIES.md` for the live punch list.
- Version: 1.6.1 — Astro 6, React islands, nanostores, Tailwind v4
- Products: 708 active, 55 brands (all with English descriptions + images)
- Blog: 81 articles, registry in sync at 81 slugs. Quick Answers 81/81, PAA 81/81, BlogPosting + FAQPage schema 81/81.
- Sitemap: 1,152 pages indexed by Pagefind
- Performance: `/nicotine-pouches` 92, PDPs 94, homepage 82 (LCP ~4s — next target)
- Lighthouse: SEO 100, Accessibility 93–100, Best Practices 100
- Domain: ✅ snusfriends.com primary (non-www), www redirects via 301
- OG images: Satori pipeline — `/og/article-{slug}.png`, brand, category, gamification templates generated at build
- Tests: 54 passing (cart ops, email regex, NYE line-item validation, auth schemas, components, hooks) — ROADMAP Step 55 done
- SEO: ✅ All schemas (BreadcrumbList, FAQPage, ItemList, Product, Organization), RSS feed, sitemap, llms.txt, hreflang
- Gamification: ✅ LIVE — spin wheel, quests, SnusCoins (10/€, aligned with DB trigger), avatars, The Vault, The Board
- UX: ✅ Scroll memory, browsing history, pack upsell, beginner mode, mobile bottom nav, cross-tab cart sync (BroadcastChannel)
- Review System: ✅ Full review UI + DB + post-purchase email cron (daily 10:00 UTC, 7-day delay)
- Email: ✅ 4 Resend templates (Klaviyo wiring still pending)
- Cron: ✅ 8 active jobs (sync, ops, reviews, blog, news, retry-orders, batch-summaries, review-emails)
- Remaining real work: checkout payment contract (P0 — blocked on NYE sandbox / support answer), homepage LCP mobile animation gating, Cowork content execution (homepage copy, legal FI/NO, medical reviewer), Klaviyo + Trustpilot setup, legal solicitor sign-off
- Cowork: audits in `cowork/audits/`, mockups in `cowork/mockups/`, active briefs in `cowork/content/`

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

## Multi-AI Workflow

Three AIs, three lanes. Claude orchestrates; Codex and Gemini are invoked via `Bash` and return to Claude — no human in the middle.

| AI | Role | How invoked |
|---|---|---|
| **Claude** | Plan, implement, commit, ship | This session |
| **Codex** | Correctness review on diffs before merge (ChatGPT subscription) | `/codex-review` — auto-runs as step 1.5 of `/ship` |
| **Gemini** | Long-context audits, SEO/content bulk work (Google One Premium monthly credits) | `/gemini-audit <path>` |

**Gemini lane — use it or lose it:**
- Full-repo or `cowork/` content audits (2M context > Claude here)
- SEO + competitor passes (pair with DataForSEO MCP)
- Bulk lint/cleanup sweeps that don't need deep reasoning
- Imagen UI for product / blog hero images — 200 credits/month, unused = lost

**Codex lane — keep it tight:** correctness on diffs only. Auto-runs before every ship. Blocks commit on 🔴.

**Disagreement protocol:** when Codex and Gemini disagree (via `/triple`), Claude reads both, re-examines the code, and decides — never silently averages them.

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
| `docs/superpowers/specs/2026-03-31-nyehandel-gaps-design.md` | NYE integration gaps — cancel, update, discounts, stock sync |
| `cowork/README.md` | Cowork audit summary + priority P0/P1/P2 items |

## Known Bugs & Tech Debt (Codex audit, April 2026)

Codex ran a full audit and found real issues. Some are already fixed, others remain.

### FIXED (April 8, 2026)

- **`src/stores/cart.ts:54`** — `$mixDiscount` computed callback destructured args as tuple
  `([canCount, total])` but nanostores passes separate args. Changed to `(canCount, total)`.
  Mix discount was silently broken (both values were `undefined`).
- **`src/components/react/CheckoutForm.tsx:205`** — `trackCheckoutStarted({ cartTotal: total, ... })`
  referenced undefined `total`. Fixed to `cartTotal`. Checkout worked but analytics tracking was broken.
- **`src/content.config.ts`** — Build succeeded with empty product/brand collections when Supabase
  fetch failed. Added `throw` on fetch error and minimum count assertion (50+ products required).
  Builds now fail-closed instead of silently shipping an empty catalog.
- **Blog index + RSS** — Hand-maintained article arrays in `src/pages/blog/index.astro` and
  `src/pages/rss.xml.ts` were missing 14+ posts. All articles are now registered.

### FIXED (April 8, 2026 — Launch Polish Sprint)

- **Blog registry** — Centralized in `src/data/blog-registry.ts` (83 entries). Both `/blog`
  index and `/rss.xml` import from it. 6 missing articles added.
- **publishDate→date prop** — All articles now pass `date={publishDate}` correctly.
- **RecommendationsIsland hooks** — False alarm. All `useCallback` hooks are above the early
  returns at line 276. No violation.
- **Medical disclaimers** — All 76 articles now have disclaimers (3 were missing).
- **Author schema** — All 76 articles use Person author with sameAs links.
- **Mobile announcement bar** — Fixed text overlap with `visibility: hidden` on inactive slides.
- **BREAKING ticker** — Removed from homepage. Was spammy, not premium.
- **Product badge contrast** — Popular/New badges switched from white-on-bright to dark-on-light
  (2.15:1 → 7:1+). Meets WCAG AA.
- **Heading DOM noise** — AgeGate `<h2>` changed to `<p role="heading">`, MegaMenu `<h3>` labels
  changed to `<div>`. Clean heading tree for screen readers.
- **Product 404** — `zyn-cool-mint-s2` → `zyn-cool-mint-slim-s2` in blog references.
- **Blog category contrast** — Buying Guide tag color `#E65100` → `#BF360C` (3.4:1 → 7.7:1).

### FIXED (April 8–12, 2026 — Launch Polish Sprint close)

- **`src/pages/compare.astro`** — Inline IIFE with `innerHTML` + `escapeHtml()` replaced by
  `src/components/react/CompareIsland.tsx` (client:idle). Shared labels reused from
  `@/data/brand-colors` (strengthLabels) + `@/data/product-labels` (flavorLabels). Closes XSS debt.
- **PAA blocks: 68 → 80/80.** All 12 missing articles (`all-velo-flavors-ranked-2026` etc.) now covered.
- **Quick Answers: 58 → 80/80.**
- **Product card conversion** — `ProductCard.tsx` now renders review count, compare-price
  strikethrough + savings %, per-pouch cost line, and SnusCoin earn preview.
- **Brand page logo fallback** — `/brands/[slug]` now renders an 80×80 gradient monogram tile
  in Space Grotesk when `logoUrl` is null, instead of plain brand-name text. Real brand
  logo assets still wanted for higher fidelity.
- **OG images** — 64 blog posts no longer override the Satori-generated PNG with broken SVGs.
  Each post now inherits `/og/article-{slug}.png` via `SEO.astro` `deriveOgPath`.
- **`writeProductsJson`** replaces `ensureProductsJson` on `/nicotine-pouches` + `/compare` —
  prevents stale JSON across rebuilds.
- **Critical-path tests (ROADMAP Step 55)** — 43 new tests across cart, email regex,
  NYE line-item validation, auth schemas. 54/54 green.

### FIXED (April 12-13, 2026)

- **`supabase/functions/process-subscriptions/index.ts:128`** — idempotency verified: no double-credit; only `ops_alert` is inserted, points flow through NYE order trigger.
- **`supabase/functions/manage-subscription/index.ts:102`** — `discount_pct` column confirmed present.
- **`src/pages/register.astro:98`** — resend path now handled by JSON fetch at `:351` matching `sendMagicLink` accept mode.
- **`products.json` aggressive slim** — closed: raw 241KB gzips to 39.5KB on wire (Vercel default). Target was uncompressed size, which doesn't matter in transit.

### REMAINING (not yet fixed)

- **P0.1 Checkout payment contract** — `create-nyehandel-checkout/index.ts:937` never returns `redirect_url` but `src/actions/checkout.ts:86` + `CheckoutForm.tsx:246` expect it. Same edge fn fires `order_confirmed` email at `:883` before payment. `nyehandel-webhook/index.ts` has no paid-event handler. Blocked on NYE sandbox / support answer — NFC Group Payment customer redirect contract is unknown.
- **Homepage LCP** — mobile animation gating only. Space Grotesk preload (`Base.astro:29`) + below-fold `client:visible` islands (`index.astro:339,354`) are done. Remaining: gate `.hero-orbit-ring` + conic glow at `index.astro:225` under `@media (max-width: 1023px)`.
- **Cart-snapshot identity** — `src/stores/cart.ts:249` reads `__AUTH_STATE__` but never adds `Authorization` header or `guest_email`; `save-cart-snapshot:57` always skips. Klaviyo Abandoned Cart blocked on this.
- **Verification baseline** — `bun run lint` = 0 errors / 6 warnings (pre-existing in `scripts/generate-og-images.ts` + hook deps); `bun run check` = 67 errors (Astro.locals typing gap). Neither blocks prod builds.
