# Tomorrow's 10-Hour Implementation Plan

**Date:** 2026-03-31 (Tuesday)
**Goal:** Maximum impact in 10 hours — focus on revenue-enabling, SEO, and trust signals
**Prerequisite:** Daniel pushes commits: `git push origin astro-migration-clean`

---

## Audit Summary (March 30, 2026)

### What the tools revealed

| System | Finding | Severity |
|--------|---------|----------|
| **Sentry** | 16 errors/7d, 1 unresolved (InvalidStateError on View Transitions) | Low — already suppressed |
| **Vercel** | 20 deployments, latest "a11y: ARIA roles" NOT promoted to prod | Medium — deploy pending |
| **Supabase** | 60 tables, 31 edge functions, 0 orders, 0 reviews, 0 newsletter subs | Info — pre-launch state |
| **Supabase** | RESEND_API_KEY not set — no order confirmation emails | **P0 blocker** |
| **Klaviyo** | 0 flows, 1 draft campaign, 3 lists (Email, SMS, Preview) | **P0 — no email automation** |
| **PostHog** | 9 custom events tracking, analytics functional | OK |
| **Competitive** | SnusFriends B+ (7.5) vs Northerner B (6.3) on features, but 0 trust signals | **P0 — trust gap** |

### Critical gaps vs competitors

1. **No Trustpilot presence** — Northerner has 4,151 reviews (4.6★), Haypp has 7,405 (4.7★)
2. **No email automation** — 0 Klaviyo flows (competitors have welcome, abandoned cart, win-back)
3. **No abandoned cart recovery** — leaving money on table from day 1
4. **2 pages indexed** — competitors have 500-5000+ indexed pages
5. **No OG images** — social sharing looks broken
6. **No sample/trial packs** — Northerner and Nicokick both offer these

---

## The Plan: 10 Hours, 6 Blocks

### Block 1: Deploy & Launch Prep (1 hour) ⏱️ 0:00–1:00

**Goal:** Get latest code live and unblock email.

| # | Task | Time | Who |
|---|------|------|-----|
| 1.1 | Promote latest Vercel deployment to production | 5 min | Claude |
| 1.2 | Verify all accessibility fixes are live (form ARIA, age gate dialog) | 10 min | Claude |
| 1.3 | **Daniel: Set RESEND_API_KEY in Supabase Vault** | 5 min | Daniel |
| 1.4 | **Daniel: Set DISCORD webhook secrets in Supabase Vault** | 5 min | Daniel |
| 1.5 | **Daniel: Enable Leaked Password Protection in Supabase Auth** | 2 min | Daniel |
| 1.6 | Test order confirmation email flow end-to-end | 15 min | Claude |
| 1.7 | Set up UptimeRobot monitors (Vercel + Supabase health) | 10 min | Daniel |

**Deliverable:** Production site fully operational with email notifications working.

---

### Block 2: Klaviyo Email Automation (1.5 hours) ⏱️ 1:00–2:30

**Goal:** Set up 3 critical email flows that every competitor has.

| # | Task | Time | Who |
|---|------|------|-----|
| 2.1 | Create Klaviyo Welcome Flow (trigger: Added to Email List XSsBfF) | 20 min | Claude (API) + Daniel (UI flow trigger) |
| 2.2 | Create Browse Abandonment email template in Klaviyo | 20 min | Claude |
| 2.3 | Create Cart Abandonment email template in Klaviyo | 20 min | Claude |
| 2.4 | Build Supabase edge function: `track-klaviyo-browse` (sends browse events to Klaviyo) | 20 min | Claude |
| 2.5 | Wire cart abandonment tracking into checkout flow | 10 min | Claude |

**Deliverable:** 3 email flows ready — welcome, browse abandonment, cart abandonment.

---

### Block 3: Trust & Social Proof (1.5 hours) ⏱️ 2:30–4:00

**Goal:** Close the massive trust gap vs competitors.

| # | Task | Time | Who |
|---|------|------|-----|
| 3.1 | **Daniel: Create Trustpilot business profile** (trustpilot.com/business) | 15 min | Daniel |
| 3.2 | Add Trustpilot widget/badge to footer and homepage | 20 min | Claude |
| 3.3 | Add payment method icons to footer (Visa, MC, Klarna, etc.) | 15 min | Claude |
| 3.4 | Add trust badges to checkout page (secure checkout, EU shipping, money-back) | 15 min | Claude |
| 3.5 | Generate OG images for homepage + top 10 blog posts using Astro satori | 25 min | Claude |

**Deliverable:** Trust signals visible across the site, social sharing works.

---

### Block 4: SEO Content Blitz (3 hours) ⏱️ 4:00–7:00

**Goal:** Produce 3 high-value SEO articles targeting keyword gaps competitors own.

| # | Task | Time | Who |
|---|------|------|-----|
| 4.1 | Write "Killa Nicotine Pouches Review" (600-800/mo search volume) | 50 min | Claude |
| 4.2 | Write "XQS Nicotine Pouches Review" (400-600/mo) | 50 min | Claude |
| 4.3 | Write "Best Nicotine Pouches for Beginners 2026" (500-700/mo) | 50 min | Claude |
| 4.4 | Add internal links: cross-link all 3 new articles + existing related content | 15 min | Claude |
| 4.5 | Add "Related Articles" section to 5 existing high-traffic blog posts | 15 min | Claude |

**Deliverable:** 3 new SEO-optimized articles (49 total), stronger internal link graph.

---

### Block 5: Conversion Optimization (2 hours) ⏱️ 7:00–9:00

**Goal:** Improve conversion rate with UX polish and missing features.

| # | Task | Time | Who |
|---|------|------|-----|
| 5.1 | Password strength meter on register page (Roadmap Step 53) | 30 min | Claude |
| 5.2 | Enhanced footer: payment icons, trust badges, newsletter signup, expanded links | 30 min | Claude |
| 5.3 | "Compare" button on product cards → link to /compare with pre-selected products | 20 min | Claude |
| 5.4 | Add "You might also like" section to product detail pages (related by brand+flavor) | 25 min | Claude |
| 5.5 | Review incentivization: award 50 SnusPoints per approved review | 15 min | Claude |

**Deliverable:** Better registration UX, stronger footer, product recommendations, review incentives.

---

### Block 6: Verification & GSC Submission (1 hour) ⏱️ 9:00–10:00

**Goal:** Verify everything works and get new pages indexed.

| # | Task | Time | Who |
|---|------|------|-----|
| 6.1 | Run Lighthouse audit on all modified pages | 15 min | Claude |
| 6.2 | Verify all Klaviyo flows are triggering correctly | 10 min | Claude |
| 6.3 | Test OG images render correctly (share preview tool) | 5 min | Claude |
| 6.4 | Regenerate sitemap with new pages | 5 min | Claude |
| 6.5 | Submit updated sitemap to GSC + request indexing for 3 new articles | 10 min | Daniel |
| 6.6 | Deploy final build to production | 10 min | Claude |
| 6.7 | Write session summary + update MASTER_PLAN.md | 5 min | Claude |

**Deliverable:** Everything verified, deployed, and submitted for indexing.

---

## What Daniel Needs to Do Before/During the Session

1. **Before session:** `git push origin astro-migration-clean` (push gamification + category commits)
2. **During Block 1:** Set RESEND_API_KEY + DISCORD webhooks + enable Leaked Password Protection in Supabase
3. **During Block 2:** Set up Klaviyo flow trigger in UI (Claude creates templates, Daniel wires the trigger)
4. **During Block 3:** Create Trustpilot business profile at trustpilot.com/business
5. **During Block 6:** Submit sitemap to GSC

## Expected Outcomes After 10 Hours

| Before | After |
|--------|-------|
| 0 email flows | 3 flows (welcome, browse abandon, cart abandon) |
| 0 trust signals | Trustpilot badge, payment icons, trust badges, OG images |
| 46 blog articles | 49 articles (3 new targeting 1,500-2,100/mo combined search volume) |
| Weak internal links | "Related Articles" on 8 posts, cross-links in all new articles |
| No review incentive | 50 SnusPoints per review |
| Basic footer | Enhanced footer with payments, trust, newsletter |
| No password meter | Password strength indicator on registration |
| Latest deploy not live | All changes deployed and verified |
| 2 pages indexed | Sitemap resubmitted with 3 new high-value pages |

---

*This plan lives at `TOMORROW_10H_PLAN.md`. Bring it into the next session and execute block by block.*
