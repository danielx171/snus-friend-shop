# Session Plan — 2026-03-22

## Priority 1: Unblock Checkout (CEO action required)

The Nyehandel shipping/payment method names are blank — this blocks all test orders.

**Action for Daniel before session:**
- Log into Nyehandel admin → name the shipping and payment methods
- OR decide to switch to Nyehandel hosted checkout (redirect flow)

Once unblocked, we can:
- Place a test order end-to-end
- Verify order → Supabase → Nyehandel sync
- Complete UAT (Step 39)

## Priority 2: Merge Lovable Animations

Daniel is adding animations in Lovable. Tomorrow:
- Pull Lovable changes (`git pull --no-rebase`)
- Resolve any conflicts (use `--ours` for types.ts if needed)
- Verify build passes after merge
- Push merged result

## Priority 3: Visual QA on Dynamic Brands

The dynamic brands overhaul shipped tonight. Tomorrow verify:
- BrandsIndex page loads all 139 brands, A-Z directory works
- BrandHub pages render correctly for various brands
- MainNav dropdown shows top brands
- ProductFilters brand search works
- Mobile responsiveness on all brand pages

## Priority 4: Pre-Launch Hardening

### Legal pages (blocked on solicitor)
- Terms of Service, Privacy Policy, Cookies Policy need real legal text
- Once solicitor delivers, paste content into the existing page components

### Production environment
- Set `ALLOWED_ORIGIN` in Supabase secrets once Vercel domain is confirmed
- Enable leaked password protection in Supabase Dashboard (Auth → Settings)
- Verify all 16 edge functions are deployed and healthy
- Run `bun run sitemap` to regenerate with any new products

### Performance
- Consider lazy-loading brand images on BrandsIndex (139+ brands)
- Review bundle size — framer-motion added ~30KB gzipped
- Test on slow 3G to verify skeleton loading states

## Priority 5: Vercel Deploy

Once UAT passes:
- Final `bun run build` verification
- Deploy to Vercel (`vercel --prod`)
- Verify custom domain, SSL, SPA rewrites
- Run Lighthouse on production URL
- Smoke test: browse → add to cart → checkout handoff

## Parking Lot (not for tomorrow unless time permits)

- Order confirmation page polish
- Email notifications (order confirmation, shipping)
- Membership/SnusPoints earning rules
- Product reviews system
- Inventory tracking / low-stock alerts on ops dashboard
