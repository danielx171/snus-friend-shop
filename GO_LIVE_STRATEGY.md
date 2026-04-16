# SnusFriend Go-Live Strategy & Priority Report

**Date:** 2026-03-31
**Author:** Claude (deep codebase + competitor + Klaviyo audit)

---

## Part 1: Missing Connectors & Broken Backend

### CRITICAL — Blocks Revenue

| Issue | Impact | Status |
|-------|--------|--------|
| **RESEND_API_KEY not set** | `send-email` and `contact-form` edge functions will fail silently. Order confirmations, shipping updates, welcome emails, review requests — none fire. Contact form submissions go nowhere. | Secret missing in Supabase |
| **Klaviyo: ZERO flows** | Klaviyo account has 0 automations. No welcome flow, no abandoned cart, no post-purchase, no winback. Templates exist (Welcome Tjf23a, Post-Purchase UtA6PL) but aren't wired to any trigger. | Must create in Klaviyo UI |
| **Newsletter → wrong destination** | Footer newsletter form POSTs to `save-waitlist-email` (Supabase table), NOT to Klaviyo. Subscribers never enter your email marketing funnel. | Code fix needed |

### HIGH — Degrades Experience

| Issue | Impact | Status |
|-------|--------|--------|
| **DEEPSEEK_API_KEY not set** | `generate-review-summary` edge function fails. AI review summaries on product pages won't generate. Non-critical but a unique feature that's dead. | Secret missing |
| **DISCORD_WEBHOOK_REVIEWS/ACHIEVEMENTS not set** | `discord-webhook` function fails. No community notifications when reviews/achievements happen. | Secrets missing |
| **Supabase custom SMTP not configured** | Auth emails (confirmation, password reset) use Supabase's shared SMTP → high spam filter rate. Setup prompt written to `supabase-smtp-setup-prompt.md`. | Manual dashboard task |

### MEDIUM — Technical Debt

| Issue | Impact | Status |
|-------|--------|--------|
| **`generate-review-summary` uses wrong env var name** | References `INTERNAL_FUNCTION_SECRET` (singular) but every other function uses `INTERNAL_FUNCTIONS_SECRET` (plural). Will fail auth. | Code fix (1 line) |
| **send-review-request-emails cron** | Exists as edge function but pg_cron schedule wasn't found in config.toml — may not be firing | Verify in Supabase dashboard |

---

## Part 2: What Competitors Have That We Don't

Based on audit of Nicokick (4.6★, 9K reviews), Northerner (4.6★, 4K reviews), SnusDirect (3.9★, 9K reviews), Haypp, SnusDaddy.

| Feature | Competitors | SnusFriend | Gap |
|---------|------------|------------|-----|
| **Trustpilot reviews** | 4,000-9,000+ reviews displayed sitewide | Zero external reviews | CRITICAL trust gap |
| **Abandoned cart emails** | All major competitors | Not implemented | Revenue leak |
| **Welcome email flow** | Automated, multi-step | 1 draft campaign, never sent | Lost engagement |
| **Post-purchase email sequence** | Thank you → review request → reorder nudge | Edge function exists but RESEND_API_KEY missing | Not firing |
| **Multi-currency** | EUR, GBP, USD, SEK | EUR only | Limits audience |
| **Content volume** | 50-181 articles | 43 articles (19 original + 24 brand pages) | SEO gap |
| **Guest checkout** | Standard | Requires account | Friction |
| **Subscription/auto-reorder** | Nicokick, Haypp | Not implemented | Retention gap |
| **Pick & Mix / Bundle builder** | Haypp | Not implemented | AOV opportunity |
| **Lab testing / transparency** | Northerner (Nicoleaks) | Not implemented | Trust differentiator |
| **Free samples** | Haypp | Not implemented | Acquisition tool |

**What SnusFriend HAS that competitors DON'T:** Gamification (spin wheel, quests, points, avatars, achievements, leaderboard). This is a genuine unique edge — no competitor has anything like it.

---

## Part 3: Top 10 Highest-Impact Actions (Ranked)

### 1. 🔴 Set RESEND_API_KEY in Supabase Secrets
**Revenue impact:** HIGH — without this, order confirmations, shipping updates, and contact form are all dead
**Effort:** 5 minutes (copy key from Resend dashboard → Supabase secrets)
**Urgency:** BLOCKS GO-LIVE

### 2. 🔴 Create Klaviyo Welcome Flow
**Revenue impact:** HIGH — welcome emails have 50-86% open rates, set the tone for the brand
**Effort:** 30 min in Klaviyo UI (trigger: Added to Email List → send Welcome template Tjf23a)
**Urgency:** BEFORE GO-LIVE
**Note:** Also wire the newsletter form to Klaviyo's subscribe API instead of (or in addition to) `save-waitlist-email`

### 3. 🔴 Create Klaviyo Abandoned Cart Flow
**Revenue impact:** VERY HIGH — industry average 10-15% cart recovery rate, can be 5-10% of total revenue
**Effort:** 2-3 hours (need to fire Klaviyo event from checkout page, create 3-email sequence)
**Urgency:** WEEK 1 POST-LAUNCH
**Implementation:** Add Klaviyo JS snippet to site, fire `Started Checkout` event from CheckoutForm, build 3-step flow (1hr → 24hr → 72hr)

### 4. 🟡 Trustpilot Integration
**Revenue impact:** HIGH — zero external social proof is the #1 trust gap vs every competitor
**Effort:** 1 day (sign up for Trustpilot business, add widget to homepage/footer/product pages, add structured data)
**Urgency:** WEEK 1-2
**Why:** Competitors have 4,000-9,000 reviews. A new store with zero reviews looks risky to EU customers spending €30-80 on nicotine products. Even 10-20 reviews makes a massive difference.

### 5. 🟡 Post-Purchase Email Sequence (Klaviyo)
**Revenue impact:** HIGH — drives reviews, repeat purchases, and referrals
**Effort:** 2-3 hours (create flow: Order Confirmed → 3 days: How to Use → 7 days: Review Request → 14 days: Reorder Nudge)
**Urgency:** WEEK 1
**Note:** The `send-review-request-emails` cron already exists in Supabase but needs RESEND_API_KEY. Could run both Resend (transactional) and Klaviyo (marketing) in parallel.

### 6. 🟡 Newsletter Form → Klaviyo Sync
**Revenue impact:** MEDIUM — without this, newsletter signups never enter your marketing funnel
**Effort:** 1 hour (modify Footer.astro newsletter form to POST to Klaviyo subscribe API, or add Klaviyo JS and use `klaviyo.push`)
**Urgency:** BEFORE GO-LIVE

### 7. 🟢 SEO Content Sprint (3 articles/week)
**Revenue impact:** HIGH but slow — organic search is the ONLY acquisition channel
**Effort:** Ongoing (3-5 hours/week using Cowork for drafts)
**Urgency:** START NOW, compounds over 3-6 months
**Priority keywords:** "ZYN flavors" (60K/mo), "nicotine pouches side effects" (22K/mo), "best nicotine pouches" (10K/mo), "VELO flavors" (15K/mo)
**Your competitive strategy doc identifies 250K monthly searches from missing content.**

### 8. 🟢 Exit Intent Popup for Email Capture
**Revenue impact:** MEDIUM — typical 3-5% conversion rate on exit intent, builds email list
**Effort:** 3-4 hours (React island with exit intent detection, connect to Klaviyo, offer 10% first order or spin wheel entry)
**Urgency:** WEEK 2

### 9. 🟢 Gamification Visibility Boost
**Revenue impact:** MEDIUM — your unique differentiator is buried in the navigation
**Effort:** 2-3 hours (add points earned to product cards, show points balance in header, add "X points until next reward" to cart drawer)
**Urgency:** WEEK 2-3
**Note:** Cowork audit flagged this as P1 — gamification is invisible to visitors who don't click Rewards.

### 10. 🟢 Bundle Builder / Multi-Pack Upsell
**Revenue impact:** MEDIUM-HIGH — increases AOV 15-30%
**Effort:** 1-2 days (create UI for "Build Your Mix" with 5/10/20 pack options at discount tiers)
**Urgency:** MONTH 2
**Note:** Multi-pack pricing already exists in the system (pack1/pack5/pack10). A dedicated builder page would surface this.

---

## Part 4: Connector Status Summary

| Connector | Status | Action |
|-----------|--------|--------|
| **Supabase** | ✅ Connected (MCP + 22 edge functions) | Working |
| **Vercel** | ✅ Connected (MCP + deployments) | Working |
| **Nyehandel** | ✅ Connected (checkout + fulfillment) | Working — UAT order #479 confirmed |
| **Klaviyo** | 🟡 Connected but empty | Create flows, wire newsletter, add JS snippet |
| **Resend** | 🔴 API key not set | Set RESEND_API_KEY in Supabase |
| **Sentry** | ✅ Connected (error monitoring) | Working |
| **PostHog** | ✅ Connected (9 custom events) | Working |
| **Google Search Console** | ✅ Connected (MCP) | 2 pages indexed, growing |
| **DataForSEO** | ✅ Connected (MCP) | Available for keyword research |
| **Trustpilot** | ❌ Not connected | Sign up + integrate |
| **Discord** | 🔴 Webhook URLs not set | Set DISCORD_WEBHOOK_REVIEWS + ACHIEVEMENTS |
| **DeepSeek** | 🔴 API key not set | Set DEEPSEEK_API_KEY for review summaries |
| **Google Analytics** | ❌ Not connected | Consider adding GA4 alongside PostHog |
| **Cloudflare** | ✅ Connected (MCP) | Available |
| **Gmail** | ✅ Connected (MCP) | Support inbox |

---

## Part 5: Go-Live Checklist (Do This Today)

### Must Do Before Go-Live
- [ ] Set RESEND_API_KEY in Supabase secrets
- [ ] Configure Supabase custom SMTP (use supabase-smtp-setup-prompt.md)
- [ ] Create Klaviyo Welcome flow (trigger: Added to Email List)
- [ ] Wire newsletter form to Klaviyo (not just Supabase waitlist table)
- [ ] Fix `generate-review-summary` env var name (INTERNAL_FUNCTION_SECRET → INTERNAL_FUNCTIONS_SECRET)
- [ ] Push design + login fix changes to git (commit ready on astro-migration-clean)
- [ ] Verify all cron jobs are actually firing in Supabase dashboard

### Week 1 After Launch
- [ ] Set up Trustpilot business account
- [ ] Create Klaviyo Abandoned Cart flow (3-email sequence)
- [ ] Create Klaviyo Post-Purchase flow
- [ ] Add Klaviyo JS snippet for browser tracking
- [ ] Set DISCORD webhooks for community notifications
- [ ] Set DEEPSEEK_API_KEY for review summaries
- [ ] Start SEO content sprint (target: 3 articles/week)

### Week 2-4
- [ ] Add exit intent email capture popup
- [ ] Make gamification visible (points on product cards, header badge)
- [ ] Add Trustpilot widget to homepage + footer
- [ ] Set up UptimeRobot monitoring
- [ ] Consider GA4 alongside PostHog
