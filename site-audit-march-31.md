# SnusFriend.com — Complete Site Audit
**Date:** March 31, 2026
**Auditor:** Claude (automated)
**Scope:** Auth, design, features, legal, go-live readiness

---

## 1. Auth & Account Issues

### Daniel's Login (keyhanfar54@gmail.com)
**Status: Working fine.** Auth logs show a wrong-password attempt at 06:58:04 UTC followed by successful logins. No action needed.

### New Account Confirmation Emails
**Status: Deliverability risk.** One real user (mr_kicka90@hotmail.com) signed up but never confirmed — Supabase sent the confirmation email, but it likely went to spam.

**Root cause:** Supabase is using its built-in mailer (default SMTP) instead of a custom provider. Built-in Supabase emails come from a shared IP with generic sender reputation, which triggers spam filters — especially on Hotmail/Outlook.

**Fix required:** Configure Resend as custom SMTP in Supabase Auth settings (Dashboard → Authentication → SMTP Settings). This uses your verified domain (snusfriends.com) for sending, which dramatically improves deliverability. This is a manual task — Supabase dashboard only, not configurable via API.

### Welcome Email Trigger
**Status: Working.** The `trigger_welcome_email_on_signup()` PL/pgSQL function fires correctly on new user creation and calls the `send-welcome-email` edge function via pg_net. The welcome email (via Resend) is separate from the Supabase confirmation email and works reliably.

---

## 2. Visual Design Audit

### Overall Impression
The site looks professional and loads fast (LCP <200ms). The forest green theme is distinctive and the layout is clean on both desktop and mobile.

### Issues Found

| Page | Issue | Severity |
|------|-------|----------|
| **Homepage** | CLEW Blueberry product card has a lighter/washed-out image area compared to other cards | Low |
| **Homepage** | Hero section is strong but "Best Sellers" section could benefit from a "View All" link | Low |
| **Legal pages** | Yellow "under review" banner is visible to all users — remove or make it internal-only before go-live | Medium |
| **Login/Register** | Functional and clean, no issues found | — |
| **Product cards** | Badges (strength, format) display correctly; price formatting is consistent | — |
| **Brand pages** | Colored headers per brand are a nice touch; sub-pages (flavours, strengths, review) work well | — |
| **Blog** | Hero banners display well; 55 articles is strong content volume | — |
| **Mobile** | Bottom nav works; hamburger menu has all links including Community | — |
| **Footer** | Newsletter signup, payment icons, social links all present | — |

### Design Recommendations
1. Remove "under review" yellow banners from legal pages before go-live
2. Consider adding trust badges (SSL, secure payment, age verification) to homepage and checkout
3. The `/products` link in footer goes to "All Cans" — verify this page exists and renders properly
4. Ensure product images have consistent dimensions/backgrounds across all 708 products

---

## 3. Feature Audit: Built vs. Accessible

### Navigation Structure

**Header (desktop):** Shop (mega menu) → Brands → Rewards → About → More (Blog, Flavour Quiz, Beginners, Community, FAQ)
**Header icons:** Search, Account/Login, Cart
**Footer:** Shop (5 links), Company (5 links), Guides (5 links), Legal (3 links)
**Mobile menu:** Same as desktop nav + Community

### Features ACCESSIBLE from Navigation

| Feature | URL | Status |
|---------|-----|--------|
| Product catalog | /nicotine-pouches | ✅ Live, linked from header |
| Brand pages (57) | /brands/[slug] | ✅ Live, linked from header + footer |
| Brand sub-pages (171) | /brands/[slug]/flavours, /strengths, /review | ✅ Live |
| Blog (55 articles) | /blog/* | ✅ Live, linked from header + footer |
| Rewards/gamification | /rewards | ✅ Live, linked from header |
| Flavour Quiz | /flavor-quiz | ✅ Live, in "More" dropdown |
| Beginners guide | /beginners | ✅ Live, in "More" dropdown + footer |
| Community page | /community | ✅ Live, in "More" dropdown + homepage CTA |
| Search | /search | ✅ Live, header icon |
| Account | /account | ✅ Live, header icon |
| Cart + Checkout | /cart, /checkout | ✅ Live, cart drawer |
| FAQ | /faq | ✅ Live, in "More" dropdown + footer |
| About | /about | ✅ Live, in header + footer |
| Contact | /contact | ✅ Live, in footer |
| SEO guide pages | /nicotine-strength-chart, /nicotine-pouch-flavours, /nicotine-pouch-brands-compared | ✅ Live, in footer guides |
| Country pages (5) | /countries/[slug] | ✅ Live (linked from blog/content) |
| Legal pages | /terms, /privacy, /cookies | ✅ Live, in footer |
| Shipping & Returns | /shipping, /returns | ✅ Live, in footer |

### Features BUILT but NOT in Navigation (Hidden)

| Feature | URL | What It Does | Recommendation |
|---------|-----|-------------|----------------|
| **Compare tool** | /compare | Side-by-side product comparison (2-4 products). Fully built with JS product picker. | **Add to navigation.** Link from product pages ("Compare this") and add to footer or header "More" dropdown. High value for conversion. |
| **Membership page** | /membership | Reputation tier breakdown with DB-backed levels, user progress, perks per tier. SSR page. | **Add to navigation.** Link from /rewards page and header. Users need to see what they're working toward. |
| **What's New** | /whats-new | Changelog/release notes (v1.5.0, v1.4.0, v1.3.0+). Shows site evolution. | **Add to footer.** Low priority but builds transparency and trust. Could also link from About page. |
| **Wishlist** | /wishlist | Full wishlist with WishlistIsland React component. Noindexed. | **Add heart icon to header** (next to cart). Users can already add to wishlist from PDPs — they need a way to view it. |
| **Product flavour/strength filters** | /products/flavor/[key], /products/strength/[key] | Dynamic filter pages for products by flavour or strength category. | **Verify these are linked from catalog navigation.** Good for SEO if crawlable. |

### Features BUILT in Code but NO Astro Page

| Feature | What Exists | What's Missing |
|---------|-------------|---------------|
| **Ops Dashboard** | Edge functions (ops-b2b-queues, ops-set-role, ops-users, ops-webhook-inbox), hooks (useOpsAlerts), React components (OpsDashboard, OpsAuthGuard) | No `/ops/` pages in Astro. The old Vite SPA had these routes but they weren't migrated. |
| **Spin Wheel** | SpinWheelIsland component, spin-wheel edge function | Appears on homepage CTA — verify it's working and triggering correctly. |
| **Order Quest Trigger** | OrderQuestTrigger component, update-quest-progress edge function | Should fire post-purchase — verify it's integrated in order-confirmation page. |
| **Review System** | ProductReviewsIsland, send-review-request-emails cron, batch-review-summaries, generate-review-summary | Working — review request emails sent 7 days post-purchase via daily cron at 10:00 UTC. |
| **Points Redemption** | PointsRedemptionIsland, redeem-points edge function | Verify it's accessible from checkout or account page. |
| **Referral System** | redeem-referral edge function | Verify there's a UI for generating/sharing referral codes. |

### Edge Functions — Status Overview

| Category | Functions | Status |
|----------|-----------|--------|
| **Auth** | verify-admin, send-welcome-email | ✅ Working |
| **Email** | send-email, send-review-request-emails | ✅ Working (via Resend) |
| **Orders** | create-nyehandel-checkout, push-order-to-nyehandel, retry-failed-nyehandel-orders, get-order-confirmation, get-shipping-methods, nyehandel-delivery-callback, nyehandel-webhook, nyehandel-proxy | ✅ Built — needs live order testing |
| **Gamification** | spin-wheel, check-avatar-unlocks, update-quest-progress, redeem-points, redeem-referral | ✅ Built — needs user journey verification |
| **Ops** | ops-b2b-queues, ops-set-role, ops-users, ops-webhook-inbox | ⚠️ No Astro frontend — ops dashboard not accessible |
| **Content** | batch-review-summaries, generate-review-summary, contact-form | ✅ Working |
| **Sync** | sync-nyehandel | ✅ Working (cron) |
| **Other** | discord-webhook, healthcheck, save-waitlist-email | ✅ Working |

---

## 4. Legal Pages — Gap Analysis vs. nicbud.com

### Current SnusFriend Legal Pages
All three pages (terms, privacy, cookies) exist and have reasonable content, but show a yellow "under review" banner and lack some GDPR-standard sections that nicbud.com includes.

### Terms of Service — Gaps vs. Nicbud

| Nicbud Section | SnusFriend Has? | Action Needed |
|---------------|-----------------|---------------|
| Company identification (name, address, org number) | ❌ Missing org details | Add SnusFriend's company name, address, registration number |
| Age limit (18+) with enforcement mention | ✅ Has this | — |
| Ordering process & confirmation | Partial | Add order confirmation email details, right to refuse orders |
| Inventory/availability clause | ❌ Missing | Add "we are only obligated to deliver products available in inventory" |
| Prices & fees (EUR, excl. VAT/excise) | Partial | Clarify currency, tax, and excise handling |
| Delivery terms (carriers, risk transfer) | ❌ Missing | Add shipping carriers, delivery times, damage reporting window |
| Returns (14-day window, conditions) | ✅ Has returns page | Ensure it covers: unused/unopened, original packaging, customer bears return shipping |
| Return shipping costs | ❌ Not specified | Add who pays return shipping |
| Refund processing timeline | ❌ Missing | Add "refunds processed within 14 days" |
| Discount/voucher rules | ❌ Missing | Add single-use, minimum order, no cash redemption |
| Payment methods accepted | ❌ Missing from terms | List accepted methods (Klarna, card, etc.) |
| Liability cap | ❌ Missing | Add liability limited to purchase price, excludes indirect damages |
| Force majeure clause | ❌ Missing | Standard clause for wars, strikes, supply issues |

### Privacy Policy — Gaps vs. Nicbud

| Nicbud Section | SnusFriend Has? | Action Needed |
|---------------|-----------------|---------------|
| Data controller identification | ✅ Has this | Add physical address |
| Scope of policy | ❌ Missing | Add explicit scope (website, accounts, orders, support, marketing) |
| Data categories collected | ✅ Good coverage | — |
| Legal bases (GDPR Art. 6) | ✅ Has this | — |
| Cookies section | ✅ Separate cookies page | Cross-reference in privacy policy |
| Payment processing (third-party) | ❌ Missing | Add "we don't store full card details" |
| International data transfers | ❌ Missing | Add adequacy decisions, Standard Contractual Clauses |
| Data retention periods | ❌ Missing | Add specific retention: accounting (10yr), accounts (while active), marketing (until unsubscribe) |
| Security measures | ❌ Missing | Add encryption, access controls, monitoring |
| GDPR rights (access, rectification, erasure, etc.) | ✅ Has this | — |
| Supervisory authority | ❌ Missing | Add relevant data protection authority |
| Policy change notification | ✅ Has this | — |

---

## 5. Go-Live Checklist

### CRITICAL — Must fix before accepting real orders

- [ ] **Configure Resend SMTP for Supabase Auth** — confirmation emails going to spam kills signups
- [ ] **Remove "under review" banners from legal pages** — or replace with a less alarming notice
- [ ] **Add company legal entity details** to Terms (company name, address, org number)
- [ ] **Add force majeure, liability cap, and return shipping terms** to Terms of Service
- [ ] **Add data retention periods and international transfer clauses** to Privacy Policy
- [ ] **Test a real end-to-end order** — create account → add to cart → checkout → Nyehandel order creation → confirmation email → delivery callback
- [ ] **Verify age gate** — is there an age verification step at checkout or registration?
- [ ] **Set up payment methods** — verify Nyehandel payment flow works with live credentials (not test mode)

### HIGH — Should fix within first week

- [ ] **Add Compare to navigation** — link from PDPs and footer/header
- [ ] **Add Wishlist icon to header** — users can add to wishlist but can't find it
- [ ] **Add Membership page link** from /rewards and navigation
- [ ] **Verify gamification user journey** — spin wheel → quest progress → points → redemption flow works end-to-end
- [ ] **Verify referral system UI** — is there a way to generate and share referral codes?
- [ ] **Migrate Ops Dashboard to Astro** — currently no admin UI accessible (old Vite routes gone)
- [ ] **Add trust signals** — SSL badge, secure payment badge, "18+" age badge, delivery guarantee badge on homepage/checkout
- [ ] **Set up error alerting** — Sentry is integrated but verify alerts are configured for critical paths (checkout, payment, order creation)

### MEDIUM — Improve within first month

- [ ] **Deploy 3 new SEO articles** — ZYN Strength Chart, RAVE Review, Strongest Snus Beginners Warning (all drafted)
- [ ] **Fix fact-check issues** in "How Many Pouches a Day" article (cigarette equivalence math error, CDC claim qualification)
- [ ] **Implement related articles snippets** — internal linking mesh across top 10 blog articles (all drafted)
- [ ] **Add What's New to footer** — builds transparency
- [ ] **Product image consistency** — audit all 708 product images for consistent backgrounds/dimensions
- [ ] **Add structured data for reviews** — if ProductReviewsIsland is collecting reviews, ensure AggregateRating schema is populated with real data
- [ ] **Newsletter signup verification** — test the footer newsletter form actually stores emails (Supabase newsletter_subscribers table)
- [ ] **Social media links** — verify Instagram, TikTok, and X accounts exist at the URLs in footer

### LOW — Nice to have

- [ ] **Add Discord community link** — discord-webhook edge function exists but no public invite link visible
- [ ] **Blog RSS feed** — /rss.xml.ts exists, verify it works and submit to feed aggregators
- [ ] **Country pages SEO** — 5 country pages exist, ensure they're linked from relevant blog content
- [ ] **llms.txt** — already exists, good for AI crawler visibility
- [ ] **Sitemap resubmission** — 1,115 pages indexed, 2 in GSC so far — patience required but monitor weekly

---

## 6. Quick Wins — Do Right Now

1. **Remove yellow "under review" banners** from /terms, /privacy, /cookies (5 minutes)
2. **Add Wishlist heart icon to header** next to cart icon (15 minutes)
3. **Add /compare to footer Guides section** as "Compare Products" (2 minutes)
4. **Add /membership to header nav** under Rewards or "More" dropdown (2 minutes)
5. **Add /whats-new to footer** Company section (2 minutes)
6. **Deploy the 3 drafted blog articles** — ZYN Strength Chart, RAVE Review, Beginners Warning (30 min each)

---

## Summary

**What's working well:** The site is technically solid — 708 products, 94+ pages, fast performance, strong SEO foundations, working gamification system, and 55 blog articles. The Astro migration was a success.

**Biggest risks for go-live:**
1. Confirmation emails going to spam (fix: Resend SMTP)
2. Legal pages incomplete for EU e-commerce requirements
3. Several built features are invisible to users (compare, wishlist, membership)
4. No end-to-end order test with live payment credentials
5. No ops/admin dashboard accessible (Astro migration gap)

**Bottom line:** The site is 85-90% ready. The remaining work is mostly about connecting dots — making built features visible, completing legal text, and testing the order flow with real money.
