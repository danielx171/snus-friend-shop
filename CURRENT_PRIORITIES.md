# Current Priorities

Last updated: 2026-03-30

## Astro 6 Migration: COMPLETE

Migrated from Vite SPA to Astro 6 with React islands. Deployed and live on snusfriends.com.

- 30 Astro pages (18 SSG + 12 SSR)
- 18 React island components (cart, product cards, filters, search, reviews)
- 7 nanostores (cart, auth, theme, wishlist, cookie-consent, language, easter)
- Content Layer: Supabase loader for products + brands at build time
- Tailwind v4 + shadcn/ui + `@astrojs/vercel` adapter
- Auto-generated sitemap via `@astrojs/sitemap`

## Lighthouse Scores (March 26, 2026)

| Metric | Homepage | Product Page | Brands Page |
|--------|----------|-------------|-------------|
| SEO | **100** | **100** | **100** |
| Performance (LCP) | 173ms | 119ms | 113ms |
| Best Practices | 96 | 100 | 100 |
| Accessibility | 83 | 89 | 95 |

## Active Workstreams

### 1. SEO Content (HIGH — revenue impact)
- [ ] Category page intro copy (12 flavor/strength pages need 100-200 words each)
- [ ] `/nicotine-pouches` landing page: created, needs richer copy post-launch
- [ ] Blog seed content (3-5 posts targeting long-tail keywords)
- [ ] Brand page descriptions
- Plan: `docs/plans/2026-03-26-seo-maximization-plan.md`

### 2. Accessibility Fixes (MEDIUM)
- [ ] Color contrast: navy text on dark backgrounds (1.4:1 → need 4.5:1)
- [x] Strength indicator: added `role="img"` for ARIA compliance
- [x] Login link: fixed aria-label/text mismatch
- [x] Brand links: added padding for touch target compliance
- [ ] Review progressbar accessible names

### 3. Gamification (LIVE — all core features complete)
- [x] A0: Spin wheel DB tables + edge function + SpinWheelIsland
- [x] A1: Order → quest progress trigger (client + DB)
- [x] A2: Quest → avatar unlock (9 avatars, fire-and-forget)
- [x] C1-C2: Points balance + transactions + redemption
- [ ] C3: Membership tiers (deferred)
- [ ] C4: Transactional email (Resend — deferred)
- Plan: `.claude/plans/federated-gathering-lecun.md`

### 4. Analytics & Email (NEW — March 29-30)
- [x] PostHog custom events: add_to_cart, product_viewed, checkout_started, search, quiz, spin wheel, beginner mode, newsletter
- [x] PostHog dashboard: "SnusFriend Core Metrics" with trends + gamification insights
- [x] Sentry: InvalidStateError suppressed (Chrome 146 View Transitions bug)
- [x] Community page: dynamic stats from Supabase (replaces hardcoded fake numbers)
- [x] Search: multi-word query + flavour synonym matching (50+ synonyms)
- [x] Achievements: fixed logged-out loading state
- [x] Klaviyo: Welcome email template (ID Tjf23a) + Post-purchase template (ID UtA6PL)
- [x] Klaviyo: Welcome campaign created (draft, targets Email List XSsBfF)
- [ ] Klaviyo: Set up automated welcome flow in Klaviyo UI (can't be done via API)
- [ ] Klaviyo: Browse abandonment flow (future)

### 5. Pre-Launch Blockers
- [ ] Solicitor sign-off on Terms, Privacy, Cookie pages
- [ ] Final checkout smoke test with real payment
- [ ] Remove preview mode (set env var)

### 6. Nice to Have
- [ ] Uptime monitoring (UptimeRobot)
- [ ] OG images per page
- [ ] Product image quality improvements
- [ ] Multi-brand white-label architecture (3-6 months)

## Current State

- Site live at snusfriends.com
- 708 active products from Supabase (47 tables, 22 edge functions, 44 migrations)
- Astro 6 SSG/SSR hybrid, React islands for interactivity
- 94+ pages (43 blog, 57 brands, 5 country pages)
- Checkout fully working — Nyehandel payment + shipping
- Gamification fully live — spin wheel, quests, points, avatars, achievements
- PostHog analytics instrumented (9 custom events), Sentry error monitoring
- Klaviyo: 2 email templates (welcome + post-purchase), 1 draft campaign
- Version: 1.5.0

## Key Reference Files

| File | Purpose |
|------|---------|
| `ROADMAP.md` | Delivery sequence, Steps 1-56 |
| `SYSTEM_BOUNDARIES.md` | Architecture rules and ownership |
| `DEPLOYMENT_CHECKLIST.md` | Secrets, webhooks, pre-launch checklist |
| `NYEHANDEL_API_REFERENCE.md` | Full Nyehandel API reference |
| `docs/plans/2026-03-26-seo-maximization-plan.md` | SEO + GEO + remaining work plan |
| `docs/superpowers/specs/2026-03-26-astro-migration-design.md` | Astro migration design spec |
