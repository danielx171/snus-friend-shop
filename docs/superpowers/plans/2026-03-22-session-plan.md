# Session Plan — 2026-03-22

---

## CEO Brief — What Daniel needs to do before the next session

### 1. Name shipping & payment methods in Nyehandel (BLOCKER — 5 minutes)

The Nyehandel account has all shipping and payment method names set to blank ("").
This means the checkout API rejects every test order with a 422 error.

**Steps:**
1. Log into https://admin.nyehandel.se (or your Nyehandel admin URL)
2. Go to **Settings → Shipping** — give each shipping method a name (e.g. "Standard", "Express")
3. Go to **Settings → Payment** — give each payment method a name (e.g. "Card", "Nets Easy")
4. Save changes

**Alternative:** If you'd prefer customers to check out on Nyehandel's own payment page (like a Shopify-style redirect), let me know and I'll switch to hosted checkout. This avoids needing to name methods in the API.

### 2. Solicitor — chase for legal pages (ongoing)

We have placeholder pages for Terms of Service, Privacy Policy, and Cookies Policy.
Once the solicitor delivers the text, we paste it in — it's a 5-minute job.

### 3. Confirm production domain (1 minute)

Once you decide the final domain (e.g. snusfriend.com or snusfriend.eu), tell me so I can:
- Set `ALLOWED_ORIGIN` in Supabase to lock CORS
- Configure Vercel custom domain + SSL
- Regenerate sitemap with the production URL

---

## Priority 1: Unblock Checkout (CEO action required)

The Nyehandel shipping/payment method names are blank — this blocks all test orders.

**Action for Daniel before session:**
- Log into Nyehandel admin → name the shipping and payment methods
- OR decide to switch to Nyehandel hosted checkout (redirect flow)

Once unblocked, we can:
- Place a test order end-to-end
- Verify order → Supabase → Nyehandel sync
- Complete UAT (Step 39)

## Priority 2: Merge Lovable Changes

Daniel is adding animations in Lovable. Tomorrow:
- Pull Lovable changes (`git pull --no-rebase`)
- Resolve any conflicts (use `--ours` for types.ts and brand-overrides.ts if needed)
- Verify build passes after merge
- Push merged result

## Priority 3: Visual QA — Dynamic Brands + Mobile

### Already verified (2026-03-21 session):
- BrandsIndex: all 91 brands load, A-Z directory + search work, featured brands grid
- BrandHub: VELO page renders 53 products, FAQs, breadcrumbs, accent colors
- MainNav: dynamic brand dropdown with product counts
- ProductFilters: dynamic brand list with search
- Mobile nav: hamburger menu clean, search input, all links accessible
- Product listing: 731 products, filter/sort controls, pagination
- Empty cart: good empty state with CTA
- No horizontal overflow on any tested page
- Touch targets fixed: carousel dots (24→40px), carousel arrows (32→40px), utility bar buttons (28→36px)

### Still to verify:
- Product detail page on mobile (add to cart flow, pack size selector)
- Search results page with filters on mobile
- Membership page layout
- Footer links and layout on mobile
- Cookie consent banner positioning on mobile

## Priority 4: Pre-Launch Hardening

### Legal pages (blocked on solicitor)
- Terms of Service, Privacy Policy, Cookies Policy need real legal text
- Once solicitor delivers, paste content into the existing page components in `App.tsx`

### Production environment
- Set `ALLOWED_ORIGIN` in Supabase secrets once production domain is confirmed
- Enable leaked password protection in Supabase Dashboard (Auth → Settings)
- Verify all 16 edge functions are deployed and healthy
- Run `bun run sitemap` to regenerate with production domain

### Performance
- Consider lazy-loading pages beyond the homepage (ProductListing, SearchResults, BrandHub, etc.)
  - Currently only ops pages are lazy-loaded
  - Main bundle is 370KB gzipped — could be reduced by lazy-loading BrandsIndex, MembershipPage
- Review framer-motion usage — adds ~30KB gzipped
- Test on slow 3G to verify skeleton loading states

### Code quality
- `CookieConsentProvider` import path references deleted hook file — verify context import works
- UtilityBar brand count hardcoded to "91 brands" — should be dynamic from useBrands()
- Product count in hero "700+ products from 91 leading brands" — should be dynamic

## Priority 5: Vercel Deploy

Once UAT passes:
- Final `bun run build` verification
- Deploy to Vercel (`vercel --prod`)
- Verify custom domain, SSL, SPA rewrites (`vercel.json`)
- Run Lighthouse on production URL
- Smoke test: browse → add to cart → checkout handoff
- Verify edge functions are accessible from production domain

## Priority 6: Post-Launch Polish

### Quick wins
- Dynamic brand/product counts in UtilityBar and hero section
- Lazy-load more page-level components to reduce initial bundle
- Add `loading="lazy"` to brand images on BrandsIndex (139+ brands)

### Parking lot (not for tomorrow unless time permits)
- Order confirmation page polish
- Email notifications (order confirmation, shipping)
- Membership/SnusPoints earning rules engine
- Product reviews system
- Inventory tracking / low-stock alerts on ops dashboard
- Wishlist persistence (currently ephemeral)
