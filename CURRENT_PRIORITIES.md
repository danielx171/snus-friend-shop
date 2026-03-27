# Current Priorities

Last updated: 2026-03-26

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

### 3. Gamification Backend (PARKED — resume after SEO)
- [ ] A0: Spin wheel DB tables (daily_spins, vouchers, spin_config)
- [ ] A1: Order confirmed → quest progress trigger
- [ ] A2: Quest → avatar unlock chain
- [ ] C1-C2: Points redemption backend + UI
- [ ] C3: Membership tiers
- [ ] C4: Transactional email (Resend)
- Plan: `.claude/plans/federated-gathering-lecun.md`

### 4. Pre-Launch Blockers
- [ ] Solicitor sign-off on Terms, Privacy, Cookie pages
- [ ] Final checkout smoke test with real payment
- [ ] Remove preview mode (set env var)

### 5. Nice to Have
- [ ] Uptime monitoring (UptimeRobot)
- [ ] OG images per page
- [ ] Product image quality improvements
- [ ] Multi-brand white-label architecture (3-6 months)

## Current State

- Site live at snusfriends.com
- 734 products from Supabase (47 tables, 20 edge functions, 42 migrations)
- Astro 6 SSG/SSR hybrid, React islands for interactivity
- Checkout fully working — Nyehandel payment + shipping
- Phase 2 gamification UI built, backend automation pending
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
