# SnusFriend Master Plan — Pre-Launch & Growth

**Created:** 2026-03-30
**Status:** Living document — update as items complete
**Source:** Cross-referenced from 10 Cowork audits, ROADMAP.md, DEPLOYMENT_CHECKLIST.md, codebase scan, and live site analysis.

---

## Current State (as of March 30, 2026)

- **Live at** snusfriends.com (Astro 6, SSG/SSR hybrid)
- **Products:** 708 active, 57 brands, 47 Supabase tables, 22 edge functions
- **Pages:** 94+ Astro pages (46 blog, 57 brand pages + sub-pages, 12 category pages, 5 country pages)
- **Lighthouse:** SEO 100, Performance LCP <200ms, Accessibility 93-100, Best Practices 100
- **Checkout:** Fully working (Nyehandel payment + UPS shipping, test order #479 confirmed)
- **Gamification:** Live (spin wheel, quests, points, avatars, achievements, leaderboard)
- **Points visible:** ✅ Header badge, ✅ "Earn X pts" on product cards, ✅ Cart drawer points preview
- **Analytics:** PostHog (9 custom events), Sentry error monitoring
- **Email:** 2 Resend templates (order confirmed, order shipped), 2 Klaviyo templates (welcome, post-purchase)
- **GSC:** 2 pages indexed (new site), 12 impressions, 5 queries

---

## PHASE 0: Launch Blockers (Do These First)

These MUST be done before real customers place orders.

### 0.1 Solicitor Sign-Off on Legal Pages
- **Status:** ❌ Blocked (external dependency)
- **Pages:** /terms, /privacy, /cookies
- **Action:** Daniel sends draft legal pages to solicitor, gets sign-off, updates page content
- **Risk if skipped:** Legal exposure under EU consumer protection and GDPR

### 0.2 Set Missing Supabase Secrets
- **Status:** ❌ Not yet set
- **Secrets needed:**
  - `RESEND_API_KEY` — transactional email (order confirmations, shipping notifications)
  - `DEEPSEEK_API_KEY` — AI review summary generation (optional but planned)
  - `DISCORD_WEBHOOK_REVIEWS` — Discord #reviews channel notifications
  - `DISCORD_WEBHOOK_ACHIEVEMENTS` — Discord #achievements channel notifications
- **Action:** Set in Supabase Dashboard → Settings → Vault
- **Impact:** Without RESEND_API_KEY, customers get NO order confirmation emails

### 0.3 Enable Leaked Password Protection
- **Status:** ❌ Not enabled
- **Action:** Supabase Dashboard → Auth → Settings → Enable "Leaked Password Protection"
- **Impact:** Prevents users from registering with compromised passwords (HaveIBeenPwned check)

### 0.4 Set Admin Roles for Ops Dashboard
- **Status:** ❌ Not configured
- **Action:** Set `app_metadata.role = 'admin'` for ops users via Supabase Dashboard
- **Impact:** Ops dashboard access control

### 0.5 Uptime Monitoring
- **Status:** ❌ Not configured
- **Action:** Sign up for UptimeRobot (free tier), add monitors for:
  - Vercel production URL (10-min interval)
  - Supabase healthcheck endpoint (5-min interval)
  - Configure email alerts
- **Impact:** Without this, you won't know if the site goes down

### 0.6 Klaviyo Welcome Flow
- **Status:** ❌ Template exists (ID Tjf23a) but automated flow not set up
- **Action:** In Klaviyo UI → Flows → Create Flow → trigger on "Added to List" for Email List XSsBfF → assign welcome template
- **Why UI:** Klaviyo's API doesn't support flow creation — must be done in their dashboard

---

## PHASE 1: Conversion & Trust (Week 1-2)

These directly impact whether visitors become customers.

### 1.1 Password Strength Meter on Register Page
- **Status:** ❌ (Roadmap Step 53 — incomplete)
- **File:** `src/pages/register.astro` or register component
- **What:** Visual strength indicator (weak/medium/strong) + confetti `prefers-reduced-motion` check
- **Impact:** Reduces failed registrations, builds trust

### 1.2 Form Accessibility — Error Announcements (P1)
- **Status:** ❌
- **Files:** `src/components/react/CheckoutForm.tsx` (line 171), and all other form error displays
- **What:** Add `role="alert" aria-live="assertive"` to all error message divs
- **Source:** Accessibility Audit §1.1
- **Impact:** Screen reader users can't hear form errors — WCAG AA violation

### 1.3 Age Gate Dialog Role
- **Status:** ❌
- **What:** Age gate component lacks proper `role="dialog"` and `aria-modal="true"`
- **Source:** Accessibility Audit §1 summary
- **Impact:** Screen reader UX broken for first-time visitors

### 1.4 OG Images Per Page
- **Status:** ❌
- **What:** No custom Open Graph images. When shared on social media, no preview image appears.
- **Action:** Generate OG images for homepage, blog posts, brand pages, and category pages
- **Options:**
  - Astro OG image generation (satori-based)
  - Static template + dynamic text overlay
- **Impact:** Social sharing looks broken without preview images

### 1.5 Product Card Visual Upgrade
- **Status:** 🟡 Partially done (strength dots + ratings + earn pts already implemented)
- **Remaining from mockups:**
  - Save/wishlist heart icon on cards
  - "Bestseller" / "New" badges with better visual treatment
- **Source:** Visual Audit + `cowork/mockups/DESIGN_MOCKUPS_V2.md`

---

## PHASE 2: SEO & Content Velocity (Week 2-4)

Google Ads bans nicotine — ALL acquisition is organic. This is the revenue phase.

### 2.1 Continue Blog Content (Target: 3 articles/week)
- **Status:** 46 articles published, competitors have 100-180
- **Next priority articles from Content Strategy Audit:**
  - [ ] Killa nicotine pouches review (600-800/mo)
  - [ ] XQS nicotine pouches review (400-600/mo)
  - [ ] FIX nicotine pouches review (300-500/mo)
  - [ ] Nicotine-free pouches guide (500-700/mo)
  - [ ] Best nicotine pouches for sensitive gums (400-600/mo)
  - [ ] Country-specific guides: Germany, Poland, Austria (300-500/mo each)
- **Template:** Use existing blog articles as template (BlogHero + Key Takeaways + FAQ schema)
- **Goal:** 60+ articles by end of April, 100+ by end of June

### 2.2 Internal Linking Strategy
- **Status:** ❌ Weak — some orphan pages
- **Source:** SEO Audit recommendation #3
- **What:**
  - Add "Related Articles" sections to all blog posts (3-5 links per post)
  - Cross-link from category pages to relevant blog articles
  - Add "You might also like" product links in blog articles
  - Ensure every page is reachable within 3 clicks from homepage

### 2.3 GEO Authority Building
- **Status:** 🟡 llms.txt expanded, 0 AI citations currently
- **Source:** GEO Audit — zero citations on 10 tested queries
- **What:**
  - Add source citations to health/safety articles (PubMed, CDC, RCP references)
  - Create unique data assets (catalog-computed stats, market share estimates)
  - Position as "European nicotine pouch expertise" — a niche no US-focused competitor owns
  - Build entity signals: consistent Organization schema, author bylines
- **Goal:** Appear in AI overviews for 3+ queries within 3 months

### 2.4 Submit New Pages to GSC
- **Status:** Only 2 pages indexed
- **Action:** After each batch of new content, submit updated sitemap to Google Search Console
- **Also:** Request indexing for high-priority pages individually

---

## PHASE 3: Design & UX Polish (Week 3-6)

These improve conversion rate and brand perception. Visual audit average: 6.0/10 — target: 7.5+.

### 3.1 Homepage Enhancement
- **Status:** 7/10 (hero strong, middle content generic)
- **What:**
  - Add "Why SnusFriend" social proof section with real stats (when numbers grow)
  - Featured categories visual cards (not just text links)
  - Spin wheel CTA prominently on homepage ("Spin to Win — Daily Free Prizes")
  - Testimonial/review carousel (once reviews accumulate)
- **Source:** Visual Audit §Homepage, Gamification Audit recommendation

### 3.2 Blog Post Visual Breaks
- **Status:** Blog posts score 5/10 — "dense copy, needs visual breaks"
- **What:**
  - Add inline images / product cards within articles
  - Pull quotes for key statistics
  - Comparison tables (already in new articles — replicate to older ones)
  - "Quick Answer" box at top of FAQ-style articles

### 3.3 Navigation Mega Menu Enhancement
- **Status:** ✅ Mega menu exists (implemented)
- **Remaining:**
  - Mobile mega menu equivalent (currently hamburger → flat list)
  - Add popular brands with icons in mega menu
- **Source:** Visual Audit recommendation

### 3.4 Enhanced Footer
- **Status:** Basic footer
- **What:**
  - Payment method icons (Visa, Mastercard, etc.)
  - Trust badges (secure checkout, EU shipping)
  - Newsletter signup
  - Expand link columns
- **Source:** `cowork/mockups/DESIGN_MOCKUPS_V2.md` mockup #8

### 3.5 Brand Pages Visual Upgrade
- **Status:** 6/10 — "repetitive product cards, no visual differentiation"
- **What:**
  - Brand hero banner with brand colors/logo
  - "About this brand" section with origin, history, signature products
  - Strength distribution chart (how many products per strength tier)
- **Source:** Visual Audit §Brand Detail

---

## PHASE 4: Technical Hardening (Week 4-8)

### 4.1 Critical Path Tests (Roadmap Step 55)
- **Status:** ❌ Not implemented
- **What:** Vitest tests for:
  - Checkout validation (required fields, SKU resolution)
  - Cart operations (add, remove, update, clear)
  - Email regex validation
  - Auth flow (login, register, password reset)
- **Impact:** Prevents regressions when shipping fast

### 4.2 Bundle Size Optimization
- **Status:** 🟡 Known issues from Performance Audit
- **Items:**
  - lucide-react (37MB installed, ~1% icons used) → switch to direct SVG imports or `@iconify`
  - framer-motion (5.6MB) in 4 components → lazy load, only on gamification pages
  - React Query could be tree-shaken better
- **Target:** 25-35% JS reduction, ~40-50ms TTI improvement on filter pages

### 4.3 Image Optimization
- **Status:** 🟡 Product images served as-is from Nyehandel CDN
- **What:**
  - Implement Astro `<Image>` component for automatic format negotiation (WebP/AVIF)
  - Responsive `srcset` for different viewport sizes
  - Blur placeholder while loading
- **Impact:** Better Core Web Vitals, faster perceived load

### 4.4 Error Monitoring Refinement
- **Status:** ✅ Sentry connected, View Transitions bug suppressed
- **Remaining:**
  - Review and triage any new unresolved Sentry issues
  - Set up Sentry alerts for spike detection
  - Add release tracking (tag deploys with version)

---

## PHASE 5: Growth Features (Month 2-3)

### 5.1 Multi-Currency Support
- **Status:** ❌ EUR only
- **What:** Detect user's country, show prices in local currency (SEK, GBP, DKK, NOK, PLN)
- **Complexity:** High — needs Nyehandel pricing data per currency, currency selector UI, checkout logic
- **Source:** Competitor Gap Analysis — Haypp and Northerner both offer multi-currency

### 5.2 Membership Tiers (Gamification C3)
- **Status:** ❌ Deferred
- **What:** Bronze → Silver → Gold → Platinum tiers with escalating multipliers and perks
- **DB:** `points_balances` already has `lifetime_earned` which drives tier calculation
- **Impact:** Retention loop — gives high-value customers a reason to stay

### 5.3 Product Comparison Tool Enhancement
- **Status:** ✅ Basic comparison at /compare exists
- **What:**
  - "Compare" button on product cards
  - Side-by-side spec table (strength, flavor, format, price/pouch, nicotine mg)
  - No competitor has this feature — unique differentiator

### 5.4 Automated Review Collection
- **Status:** 🟡 Review request emails go out (daily cron, 7-day delay) but reviews are sparse
- **What:**
  - Incentivize reviews with bonus SnusPoints (e.g., 50 pts per review)
  - Follow-up reminder email if no review after 14 days
  - Show "Be the first to review" CTA on unreviewed products

### 5.5 Content Expansion: Video
- **Status:** ❌ No competitor has video content either
- **What:** Short product unboxing/review videos (15-30 sec) embedded on brand pages
- **Source:** Competitor Gap Analysis — opportunity gap across all retailers
- **Impact:** Unique content type, YouTube SEO, embeddable assets for social

---

## PHASE 6: Scale & Defend (Month 3-6)

### 6.1 Backlink Strategy
- **Source:** Content Strategy Audit — 30+ backlink opportunities identified
- **Targets:**
  - Harm reduction organizations (New Nicotine Alliance, etc.)
  - Health/science publications looking for EU nicotine pouch data
  - Guest posts on vaping/tobacco harm reduction blogs
  - University researchers studying nicotine alternatives

### 6.2 Email Marketing Automation
- **What:**
  - Browse abandonment flow (Klaviyo)
  - Cart abandonment flow
  - Win-back flow (no purchase in 60 days)
  - Monthly newsletter with new products + blog highlights
- **Impact:** Repeat purchase rate is the key metric for profitability

### 6.3 White-Label Multi-Brand Architecture
- **Status:** ❌ Long-term
- **What:** Deploy same codebase for multiple brand-specific stores
- **Already designed:** DEPLOYMENT_CHECKLIST.md has "spin up a new brand" instructions
- **Timeline:** 3-6 months

---

## Priority Summary — What to Build Next

### This Week (execute in new chat session)
1. ~~Gamification visibility~~ → ✅ DONE (header badge, card points, cart preview all implemented)
2. ~~Missing category keys~~ → ✅ DONE (exotic + unflavored already in FLAVOR_META + getStaticPaths)
3. **Form accessibility fixes** — `role="alert"` on all error divs (1 hour)
4. **Age gate dialog ARIA** — add `role="dialog"` (30 min)
5. **Push latest commits** — Daniel needs to `git push origin astro-migration-clean`

### This Month
6. Set missing Supabase secrets (RESEND_API_KEY priority — customers need emails)
7. Set up Klaviyo welcome flow in UI
8. Continue blog content: 3 articles/week targeting keyword gaps
9. OG image generation for key pages
10. Submit sitemap to GSC after each content batch
11. Uptime monitoring setup
12. Password strength meter (Step 53)

### Next Month
13. Critical path tests (Step 55)
14. Bundle size optimization (lucide-react, framer-motion)
15. Enhanced footer with payment icons
16. Brand page hero banners
17. Internal linking strategy
18. Review incentivization (SnusPoints for reviews)

### Quarter 2
19. Multi-currency support
20. Membership tiers
21. Email automation flows
22. Video content
23. Backlink outreach

---

## Key Metrics to Track

| Metric | Current | Target (1 month) | Target (3 months) |
|--------|---------|-------------------|-------------------|
| Pages indexed (GSC) | 2 | 50+ | 200+ |
| Organic visits/month | ~0 | 500 | 5,000 |
| Blog articles | 46 | 60 | 100+ |
| AI citations | 0 | 1-2 queries | 5+ queries |
| Lighthouse Accessibility | 93 | 97+ | 100 |
| Average visual score | 6.0/10 | 7.0/10 | 7.5/10 |
| Customer reviews | 0 | 10+ | 50+ |
| Trustpilot reviews | 0 | 5+ | 25+ |
| Repeat purchase rate | N/A | Baseline | +20% |

---

*This plan is saved in the repo as `MASTER_PLAN.md`. Update it as items are completed.*
