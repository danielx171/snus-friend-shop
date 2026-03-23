# Current Priorities

Last updated: 2026-03-24

## Completed today (2026-03-21)

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
- ✅ **Nyehandel delivery webhook** — configured with secret aligned (obscure-witness-afraid)
- ✅ **VITE_SITE_URL** — updated to https://snusfriends.com
- ✅ **Edge functions deployed** — spin-wheel v2 (atomic balance RPC) + create-nyehandel-checkout v16 (proper email validation)
- ✅ **Pre-launch code review** — 3 critical + 4 important fixes applied and pushed

## Current state

- Site live at snusfriends.com and snus-friend-shop.vercel.app
- 734 products loading from Supabase
- Preview mode active (VITE_PREVIEW_MODE=true)
- Test order blocked — awaiting CEO decision on API order flow

## Next phase

1. **CEO answer on order flow** → place test order through Nyehandel
2. **Product images** — source higher quality product photography
3. **Retail pricing** — set final per-can pricing (currently wholesale × 1.55 markup)
4. **Blog agent pipeline** — automated content generation for SEO
5. **Multi-brand setup** — template architecture for additional storefronts
6. **Solicitor**: Sign off on Terms, Privacy, Cookie pages
7. **Go live**: Remove preview mode, final smoke test

## Ready for Lovable design work

The following areas are ready for visual polish in Lovable (use as visual reference only per AGENTS.md):
- Home page hero and featured sections (keep `default` card variant)
- Product listing page (now uses compact cards — verify look)
- Search results page (new filter sidebar layout)
- Brand hub pages
- Membership page
- Mobile navigation and responsive breakpoints

## Technical debt / follow-up

- Postcode/phone format validation (country-aware) needed before go-live
- SnusPoints redemption is still mock (disabled button) — needs product/business decision
- Wishlist star icon in header does nothing — implement or remove
- Account page mocks: saved addresses, email preferences, delete account — implement or remove
- Discount system only supports hardcoded WELCOME10 — no coupon management UI
- TypeScript strict mode (`strictNullChecks`, `noImplicitAny`) still disabled in tsconfig

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
