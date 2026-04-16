# Full Site Audit — 2026-03-27

## Sources
- 3-agent parallel audit (frontend, backend, data wiring)
- Supabase security advisors (14 findings)
- Supabase performance advisors (90+ findings)

---

## P0: CRITICAL (Must fix now)

### 1. Shipping Method Name Mismatch — Checkout Broken
- **Frontend** (`src/components/react/CheckoutForm.tsx:32-50`): sends IDs like `ups-standard`, `dhl-economy-eu`
- **Backend** (`supabase/functions/create-nyehandel-checkout/index.ts:18-25`): validates against full names like `"UPS Standard (J229F1)"`, `"DHL Economy EU"`
- **Result**: Every checkout attempt returns 400 `invalid_shipping_method`
- **Fix**: Add ID→name mapping in CheckoutForm before sending to backend

### 2. SECURITY_DEFINER Views (Supabase Advisor — ERROR level)
- `public.user_reputation` — runs with creator permissions, bypasses RLS
- `public.leaderboard_top_users` — same issue
- **Fix**: Recreate views with `SECURITY INVOKER` or add explicit RLS checks

---

## P1: IMPORTANT (Fix before next deploy)

### 3. Missing X-Language Header in get-shipping-methods
- **File**: `supabase/functions/get-shipping-methods/index.ts:61-66`
- **Issue**: Fetches from Nyehandel without `X-Language: en` — returns Swedish names
- **Fix**: Add `"X-Language": "en"` to fetch headers

### 4. Error Code Mismatch in checkout.ts
- **File**: `src/actions/checkout.ts:78`
- **Issue**: Maps `shipping_method_invalid` but backend sends `invalid_shipping_method`
- **Fix**: Change key to match backend error code

### 5. Hardcoded "700+" in flavor-quiz meta description
- **File**: `src/pages/flavor-quiz.astro:28`
- **Issue**: Still says "700+ products" — should be dynamic
- **Fix**: Import getCollection, use `allProducts.length`

### 6. Leaked Password Protection Disabled (Supabase Advisor)
- **Issue**: HaveIBeenPwned check not enabled for auth
- **Fix**: Enable in Supabase Dashboard → Auth → Security

### 7. Functions with Mutable search_path (Supabase Advisor — 7 functions)
- `redeem_points`, `get_or_create_referral_code`, `redeem_referral_code`, `record_daily_login`, `update_flavor_profiles_updated_at`, `award_social_share_points`, `update_question_answers_count`, `search_products`
- **Fix**: Add `SET search_path = public` to each function definition

### 8. sync_config Table: RLS Enabled but No Policies
- **Issue**: Table has RLS enabled but zero policies — all access blocked
- **Fix**: Add appropriate policies or disable RLS if internal-only

### 9. Overly Permissive RLS on newsletter_subscribers and waitlist_emails
- **Issue**: INSERT policy is `WITH CHECK (true)` — anyone can insert anything
- **Risk**: Spam/abuse vector
- **Fix**: Add rate limiting or field validation in RLS policy

---

## P2: NICE-TO-HAVE (Post-launch polish)

### 10. ✅ 16 Unindexed Foreign Keys — Indexes added
### 11. Unused Indexes — Skipped (need usage data to confirm safely droppable)
### 12. ✅ Duplicate Permissive RLS Policies — Consolidated (orders, products, user_roles)
### 13. ✅ 40 RLS Policies optimized — `(SELECT auth.uid())` pattern applied across 20 tables
### 14. ✅ Inconsistent Strength Key Format — Normalized to kebab-case in [slug].astro
### 15. Contact Form — No Backend Processing (future: wire to Resend edge function)
### 16. ✅ Hardcoded Support Email — Now reads from tenant config
### 17. ✅ Base.astro Hardcoded Theme List — Now reads from tenant config
### 18. ✅ Price Validation in sync-nyehandel — Number.isFinite() guard added
### 19. ✅ Tracking URL Validation — new URL() validation added
### 20. ✅ Error Message Leaks in nyehandel-proxy — Generic error to client, raw logged server-side

---

## Already Passing ✅
- All 47 Astro pages have prerender declarations
- All React islands use proper client directives
- ProductCard is memoized with React.memo + useCallback
- CORS fail-closed (whitelist-only, no wildcards)
- All Nyehandel calls include X-Language: en (except get-shipping-methods)
- Structured JSON errors with requestId across all edge functions
- Email validation regex consistent and correct
- Idempotency protection on checkout and spin wheel
- Race condition handling with atomic operations
- Server-side price lookups (never trust client)
- No hardcoded secrets in source code
- No eval() or dangerous innerHTML usage
- All pages exist: /, /products, /brands, /search, /faq, /flavor-quiz, /nicotine-pouches, /blog
- Sitemap configured with correct exclusions
- robots.txt correct (blocks auth/checkout, allows LLM bots)
- Structured data: Organization, WebSite, Product, FAQPage, CollectionPage

---

## Fix Order
1. ✅ P0 #1 — Shipping method mapping (checkout fixed — ID→name map in CheckoutForm)
2. ✅ P0 #2 — Security definer views (SECURITY INVOKER applied to both views)
3. ✅ P1 #3 — X-Language header added to get-shipping-methods edge function
4. ✅ P1 #4 — Error code mismatch fixed in checkout.ts
5. ✅ P1 #5 — Dynamic count in flavor-quiz meta description
6. 🟡 P1 #6 — Enable leaked password protection (manual: Supabase Dashboard → Auth → Security)
7. ✅ P1 #7 — search_path fixed on all 8 functions
8. ✅ P1 #8 — sync_config RLS already correct (enabled, no policies = service-role only)
9. ✅ P1 #9 — newsletter/waitlist INSERT policies tightened with email validation
10. ✅ P2 items — 9 of 11 fixed (2 deferred: unused indexes need usage data, contact form backend is future work)

## Live Site Walkthrough Findings (2026-03-27)
- ✅ Homepage: hero, best sellers, features, footer all render correctly
- ✅ Products page: 731 products, brand filter, sort, pagination all working
- ✅ Product detail: breadcrumbs, specs, pack pricing, reviews, cross-links
- ✅ Brands page: 57 brands in grid, product counts
- ✅ Brand detail: avatar, description, product grid
- ✅ FAQ: accordion sections, contact link
- ✅ About: dynamic counts, mission, value props
- ✅ Contact: email, response time, contact form
- ✅ Search: instant results, suggestion chips, clear button
- ✅ Blog: article cards with categories
- ⚠️ Data: "77 Classic Tobacco Medium" shows flavor "mint" (should be "tobacco")
- ⚠️ Data: "Zyn apple mint mini S2" has inconsistent casing vs other ZYN products
- ℹ️ Products sidebar: Flavor/Strength/Format filters exist but are below the 57 brand checkboxes
