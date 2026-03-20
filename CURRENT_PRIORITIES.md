# Current Priorities

Last updated: 2026-03-21

## Completed today (2026-03-21)

### Launch Readiness Sprint (from Cowork infrastructure audit)
- Webhook 401 fix: diagnosed `nyehandel-webhook` returning 401 because NordicPouch wasn't sending `x-api-key` header. Daniel added it in NordicPouch admin.
- GDPR cookie consent banner: `CookieConsentContext` + `CookieConsent` component with "Necessary Only" / "Accept All" buttons, links to /cookies
- Age verification checkbox at checkout: Radix `Checkbox` with 18+ confirmation, blocks submit
- EU consumer rights disclosures at checkout: VAT notice, 14-day withdrawal, delivery estimate, T&C link
- CORS lockdown: shared `_shared/cors.ts` helper with `ALLOWED_ORIGIN` env var across all 14 edge functions
- Uptime monitoring checklist added to `DEPLOYMENT_CHECKLIST.md`
- Fixed preview port mismatch (launch.json 8082 → 8080 to match vite.config.ts)

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
- Payment = Nets Easy Checkout via Nyehandel
- Warehouse = NordicPouch/Nyehandel (Nylogistik)
- 19 migrations, 16 edge functions, 14 database tables

## BLOCKER — CEO decision required

Nyehandel account has all shipping/payment method names blank ("").
API-based orders (`POST /orders/simple`) fail with 422 for every name tried.
Two options:
  A. Name the shipping + payment methods in Nyehandel admin -> unblocks current checkout flow
  B. Switch to Nyehandel hosted checkout (redirect to Nyehandel-hosted payment page)

## Next steps in order

1. **CEO decides**: API order flow vs hosted checkout (see BLOCKER above)
2. If (A): name methods in Nyehandel admin -> place test order -> verify in admin + Supabase
3. If (B): build hosted checkout redirect in `CheckoutHandoff.tsx`
4. **Solicitor**: sign off on Terms, Privacy, Cookies pages
5. Deploy frontend to Vercel (can happen in parallel — see DEPLOYMENT_CHECKLIST.md)
6. UAT sign-off -> go live

## Ready for Lovable design work

The following areas are ready for visual polish in Lovable (use as visual reference only per AGENTS.md):
- Home page hero and featured sections (keep `default` card variant)
- Product listing page (now uses compact cards — verify look)
- Search results page (new filter sidebar layout)
- Brand hub pages
- Membership page
- Mobile navigation and responsive breakpoints

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
