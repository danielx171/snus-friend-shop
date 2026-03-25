# Current Priorities

Last updated: 2026-03-25

## Completed today (2026-03-25)

### 50-Finding Code Audit + UX Fixes
- XSS sanitization: DOMParser-based allowlist in BlogPost.tsx (blocks javascript: URLs, strips disallowed tags)
- Security hardening: removed stack traces and upstream errors from edge function responses
- Translation cleanup: removed false Trustpilot/Klarna/Stripe claims across all 12 locales
- Dead link fix: Terms/Privacy links on Login/Register now go to actual pages
- X-Language header: added to push-order-to-nyehandel and sync-nyehandel (prevents Swedish defaults)
- Wishlist crash fix: WishlistContext now fetches with joins and maps through toProduct()
- Currency fix: all prices now display EUR (was GBP in some places)
- Dead code removal: removed `if (false)` preview block from CheckoutHandoff
- Heading hierarchy: fixed duplicate h1s on RewardsPage, h3→h2 on FaqPage
- Auth on generate-review-summary: now requires x-cron-secret or x-internal-function-secret
- CartContext performance: wrapped totalItems, totalPrice, and context value in useMemo
- Lazy loading: 17 pages converted to React.lazy() — main chunk 517KB→311KB (40% reduction)
- ErrorBoundary: new component wrapping entire app with user-friendly error UI
- Build version system: __APP_VERSION__ and __BUILD_DATE__ via Vite define
- What's New page: customer-facing changelog at /whats-new with 4 version entries
- Footer: added "What's New" link and v1.4.0 badge in copyright line
- Package version bumped to 1.4.0

### 5-Agent Comprehensive Site Audit
- Design system audit: 8.5/10 — glass-panel aesthetic distinctive, navy+lime unique in market
- UX patterns audit: strong fundamentals, gaps in cart feedback and order tracking
- Mobile/responsive audit: solid mobile-first, icon buttons need 44px minimum
- Tech debt scan: 3 critical (AgeGate redirect, ALLOWED_ORIGIN, strict TS), 6 important
- Codebase state: 47 tables, 20 edge functions, 23 hooks, 29 pages, 42 migrations

## Completed (2026-03-21)

### Launch Readiness Sprint (from Cowork infrastructure audit)
- Webhook 401 fix: diagnosed `nyehandel-webhook` returning 401 because NordicPouch wasn't sending `x-api-key` header. Daniel added it in NordicPouch admin.
- GDPR cookie consent banner: `CookieConsentContext` + `CookieConsent` component with "Necessary Only" / "Accept All" buttons, links to /cookies
- Age verification checkbox at checkout: Radix `Checkbox` with 18+ confirmation, blocks submit
- EU consumer rights disclosures at checkout: VAT notice, 14-day withdrawal, delivery estimate, T&C link
- CORS lockdown: shared `_shared/cors.ts` helper with `ALLOWED_ORIGIN` env var across all 14 edge functions
- Uptime monitoring checklist added to `DEPLOYMENT_CHECKLIST.md`
- Fixed preview port mismatch (launch.json 8082 → 8080 to match vite.config.ts)

### Security & Accessibility (overnight sprint)
- Supabase RLS: enabled on sync_config, consolidated duplicate admin ALL policies into per-command
- Fixed mutable search_path on sync trigger functions
- Lighthouse a11y 100: contrast fixes (nav, hero CTA, featured links), ARIA labels, touch targets
- Documented leaked password protection toggle in DEPLOYMENT_CHECKLIST.md

### Dynamic Brands UX Overhaul
- `useBrands()` hook: fetches all 139+ brands from Supabase with product counts, groups by letter
- MainNav: dynamic brand dropdown from `useBrands().topBrands` instead of hardcoded 10
- ProductFilters: dynamic brand list with search input and show more/less toggle
- ProductListing: featured brands from DB instead of static array
- BrandsIndex: redesigned with featured brands grid, A-Z directory, search, brand cards with accent colors
- BrandHub: fully dynamic pages from DB data instead of static overrides
- Search scoring: brand-name boost in `search.ts`
- Renamed `brands.ts` → `brand-overrides.ts` (curated metadata only, not data source)

## Completed (2026-03-20)

### Catalog UX Overhaul
- Compact ProductCard variant (`variant: 'compact'`) — 3:2 image, icon-only CTA, no pack-size selector
- Denser grid: `grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- ProductCardSkeleton matching compact variant
- Compact cards used on PLP and Search Results pages

### Enhanced Search Results
- Full filter sidebar (brands, strengths, flavors, formats) reusing ProductFilters component
- Mobile Sheet drawer for filters with active-count badge
- Pagination (20 items/page) with scroll-to-top
- Sort options: relevance, price asc/desc, name asc/desc
- Shared search scoring in `src/lib/search.ts` (tiered relevance + OOS penalty)

### Header SnusPoints Badge
- Auth detection in Header via `supabase.auth.getSession()` + `onAuthStateChange`
- Desktop: Coins icon + balance linking to /membership
- Mobile menu: points row for logged-in users
- Graceful states: hidden when logged out, "0 SP" when zero balance

### SEO / GEO Improvements
- `public/robots.txt` — AI crawler permissions, disallow private routes
- `public/llms.txt` — GEO file for AI/LLM indexing (brands, categories, pricing, URLs)
- Dynamic sitemap generation (`bun run sitemap`) — 731 products, 139 brands, 15 static pages
- Previous static sitemap.xml replaced with live catalog data

### Account & Info Pages
- Account Settings form wired to Supabase auth (first name, last name, phone, save/error states)
- Change Password button linked to /update-password
- Real content for FAQ, Contact, Shipping, Returns, About pages (inline JSX in App.tsx)
- InfoPage component updated with `content?: ReactNode` prop

### Types & Config
- `src/integrations/supabase/types.ts` updated: added `ops_alerts`, `waitlist_emails`, `sync_config` tables + `description`/`compare_price` on products
- `.env.example` updated with comprehensive comments and all required secrets
- Supabase Vault secrets set (SYNC_CRON_SECRET, DELIVERY_WEBHOOK_SECRET, OPS_ALERTS_CRON_SECRET, scheduler secrets)
- `sync_config` table populated with project URL and cron secret
- Delivery webhook registered in NordicPouch admin

## Previously completed (2026-03-19)

- Steps 26-30 committed and deployed
- All DB migrations applied (19 total)
- All edge functions deployed (16 total)
- Supabase secrets updated with NordicPouch API credentials
- Shopify fully removed from codebase
- Catalog fully synced: 731 products, 139 brands
- `useCatalog.ts` wired to Supabase (no mock data)
- Multi-pack pricing model: pack1/3/5/10/30 from base price (RETAIL_MARKUP = 1.55)
- `CheckoutHandoff.tsx` SKU resolution fixed
- Preview mode: dismissible amber banner + checkout gate
- Lovable publishes merged (animations + light hero/bestsellers fix)
- Flavor-based gradient image fallback
- Shipping method names updated to NordicPouch account names
- `vercel.json` SPA rewrite, OrderConfirmation wired, build passes clean

## Architecture confirmed

- snus-friend-shop connects to NordicPouch Nyehandel account
- One SKU per product; pack sizes = quantity multipliers (1, 3, 5, 10, 30 cans)
- Volume discounts computed in useCatalog.ts (5%/10%/15%/20% off per-can price)
- Payment = NFC Group Payment via Nyehandel (was blank — resolved 2026-03-23)
- Shipping = UPS Standard (J229F1) as primary method
- Warehouse = NordicPouch/Nyehandel (Nylogistik)
- 20 migrations, 17 edge functions, 17 database tables

## Completed 2026-03-23

- ✅ **Nyehandel checkout wired** — payment "NFC Group Payment" + shipping "UPS Standard (J229F1)" configured in both edge functions and frontend
- ✅ **Rewards system** — daily spin wheel with server-side prize determination, vouchers, SnusPoints, PrizeReveal overlay
- ✅ **Product badges seeded** — popular (310), newPrice (154), new (60), limited (52) — homepage sections now populated
- ✅ **Filter system expanded** — 8 types: brand, strength, flavor, format, nicotine mg range, max price, hide out of stock, category
- ✅ **Navigation simplified** — header from 7→4 links, quick-filter tabs on Shop page, brands dropdown 12 brands + "view all"
- ✅ **Brand discovery UX** — homepage carousel, "also try" on brand pages, 24 featured brands, sticky A-Z sidebar
- ✅ **WCAG accessibility** — fixed 4 flavor accent colors (coffee, cola, berry, citrus) to meet AA contrast ratios
- ✅ **Logo redesigned** — SF monogram in teal shield
- ✅ **UX polish** — removed card hover rotation (subtle zoom only), removed duplicate login, improved footer visibility
- ✅ **Code quality** — atomic points balance RPC, proper email validation in checkout, fixed PrizeDisplay import

## Completed 2026-03-24

- ✅ **Domain live** — snusfriends.com configured in Cloudflare (A + CNAME, proxy off, Vercel authorized)
- ✅ **Both domains valid** — snusfriends.com + snus-friend-shop.vercel.app both serving the site
- ✅ **Supabase auth updated** — Site URL = https://snusfriends.com, redirect URLs updated, localhost entries removed
- ✅ **Nyehandel delivery webhook** — configured with secret aligned
- ✅ **VITE_SITE_URL** — updated to https://snusfriends.com
- ✅ **Edge functions deployed** — spin-wheel v2 (atomic balance RPC) + create-nyehandel-checkout v16 (proper email validation)
- ✅ **Pre-launch code review** — 3 critical + 4 important fixes applied and pushed
- ✅ **Checkout X-Language fix** — Nyehandel API requires `X-Language: en` header; without it payment/shipping names returned in Swedish and didn't match config. create-nyehandel-checkout bumped to v23.
- ✅ **CORS origin mismatch fixed** — accept both www and non-www snusfriends.com, fail-closed fallback
- ✅ **Country code fix** — checkout now sends lowercase country codes as required by Nyehandel
- ✅ **Security audit (2)** — CORS wildcard removed, delivery callback fail-closed, .gitignore updated for .claude/worktrees/
- ✅ **Step 39 UAT** — test order Nyehandel ID 479 confirmed working end-to-end

## Current state

- Site live at snusfriends.com and snus-friend-shop.vercel.app
- 734 products loading from Supabase (47 tables, 20 edge functions, 42 migrations)
- Preview mode active (VITE_PREVIEW_MODE=true)
- Checkout fully working — test order confirmed (Nyehandel order 479)
- Phase 2 gamification DB tables + components built (profiles, avatars, reviews, quests, community)
- Design system: 8.5/10 — glass-panel aesthetic, navy+lime palette, premium animations
- Version: 1.4.0 with build metadata and What's New page

## Tomorrow's Plan (2026-03-26) — Prioritized

### Sprint 1: Pre-Launch Blockers (MUST DO)

1. **Age gate on site entry** — move age verification from product detail to a full-screen gate on first visit (localStorage remember). Legal requirement for nicotine products.
2. **Fix AgeGate redirect** — currently redirects denied users to google.com. Should show proper "access denied" page or redirect to /
3. **Set ALLOWED_ORIGIN** — set `ALLOWED_ORIGIN=https://snusfriends.com` in Supabase Vault (CORS pre-launch blocker)
4. **Document DEEPSEEK_API_KEY** — add to .env.example and DEPLOYMENT_CHECKLIST.md
5. **Legal pages** — draft real Terms & Conditions, Privacy Policy, Cookie Policy content (solicitor sign-off still needed, but needs draft content)
6. **PWA install prompt** — investigate why it's not showing (was working before, may be broken)

### Sprint 2: UX Quick Wins (HIGH IMPACT)

7. **Cart toast notifications** — show toast when items added/removed from cart (major UX gap, users get no feedback)
8. **Order tracking display** — show tracking number, carrier, and expected delivery on OrderConfirmation page
9. **Touch targets** — increase icon buttons from 40px to 44px (Header search/wishlist/theme, ProductCard wishlist)
10. **Pack-size button sizing** — increase padding on ProductCard pack selectors for mobile
11. **Checkout delivery estimates** — show "3-5 business days" next to shipping method select
12. **SKU error UI** — show clear error message listing which items are unavailable (not vague text)
13. **Continue Shopping link** — add to CartPage for upsell flow

### Sprint 3: Design Polish

14. **Flagship brand color** — establish one color that works across all 4 themes (teal candidate)
15. **Extract semantic colors** — move hardcoded strength/flavor colors to CSS variables
16. **FAQ search filter** — add search bar to filter FAQ questions (80+ questions)
17. **Empty states improvement** — Blog "no posts" needs icon/CTA, Account Addresses needs timeline/CTA
18. **Password strength meter** — add to RegisterPage

### Sprint 4: Tech Debt

19. **Centralize SITE_URL** — create `src/config/site.ts`, replace hardcoded fallbacks in BrandsIndex, ProductListing, MembershipPage
20. **TypeScript strict mode** — enable `strictNullChecks` and `noImplicitAny` incrementally
21. **Review photo upload limits** — add 5MB file size cap and 10/day per-user rate limit
22. **Postcode/phone validation** — country-aware format validation in checkout
23. **Critical path tests** — add Vitest tests for checkout validation, cart operations, email regex

### Future (not tomorrow)

- **Product images** — source higher quality product photography (52GB Snus/ folder)
- **Retail pricing** — set final per-can pricing (currently wholesale x 1.55 markup)
- **Blog agent pipeline** — automated content generation for SEO
- **Resend SMTP** — transactional email (order confirmation, shipping notification)
- **Multi-brand setup** — template architecture for additional storefronts
- **Go live**: Remove preview mode, final smoke test, uptime monitoring

## Design Audit Findings (from 5-agent review)

### Keep (distinctive, high quality)
- Glass-panel aesthetic with backdrop blur
- Navy + lime + electric blue palette
- Staggered text entrance animations on hero
- Floating pouch-can circles (subtle background)
- Semantic strength/flavor color coding
- Inset card highlights (top rim light)
- Skeleton shimmer loading states

### Improve
- Establish single flagship brand color across all themes
- Move hardcoded semantic colors to CSS variables
- Expand serif typography for editorial/luxury feel
- Add checkout progress indicator (step 1/2/3)
- Add "did you mean?" for search typos
- Review flag button needs to be more discoverable

### Mobile-Specific
- Icon buttons 40px → 44px minimum (WCAG touch target)
- Pack-size buttons too small on mobile (need more padding)
- Toast positioning may feel cramped on 375px width
- FeaturedProducts gap-6 may be tight on mobile (try gap-5)

## Technical debt / follow-up

- SnusPoints redemption is still mock (disabled button) — needs product/business decision
- Account page mocks: saved addresses, email preferences, delete account — implement or remove
- Discount system only supports hardcoded WELCOME10 — no coupon management UI
- TypeScript strict mode still disabled
- Test coverage minimal (only example.test.ts exists)
- No skip-to-main-content link (a11y best practice)
- Confetti animation missing prefers-reduced-motion check

## What not to do

- Do not add any Shopify-specific code
- Do not implement Pipedrive, WhatsApp, or Cowork in this repo
- Do not move order or fulfilment logic into the frontend
- Do not edit `src/lib/cart-utils.ts` without explicit permission

## Key reference files

- `NYEHANDEL_API_REFERENCE.md` — full API reference, every endpoint (includes logistics)
- `NYEHANDEL_API.md` — Step 25 investigation answers, checkout flow design
- `ROADMAP.md` — delivery sequence, Steps 26-40 detail
- `SYSTEM_BOUNDARIES.md` — architecture rules and ownership
- `DEPLOYMENT_CHECKLIST.md` — secrets, webhooks, pre-launch checklist
