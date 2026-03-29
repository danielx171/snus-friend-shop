# SnusFriend Site Improvement Plan
**Date:** 29 March 2026 | **Prepared by:** Cowork deep audit session

---

## Executive Summary

Five parallel audits were run across the entire SnusFriend stack: code quality, database health, SEO, production errors, and automation opportunities. The site has a strong foundation — Lighthouse SEO 100, clean Astro 6 architecture, 128 RLS policies, proper structured data — but there are clear wins available across security, performance, content, and automation.

**Top 3 things to action immediately:**
1. Fix the build-breaking syntax error on `brands/index.astro:95` (new deploys are blocked)
2. Backfill 591 missing product descriptions (27% of catalogue has no description)
3. Add BreadcrumbList schema site-wide (unlocks rich snippets across 1,122 URLs)

---

## P0 — Critical (Fix This Week)

### 1. Build Error Blocking New Deployments
**Where:** `src/pages/brands/index.astro:95`
**What:** Syntax error in TypeScript type assertion — `(tinAbbrs as any)[brand.id]` is being misparsed by esbuild in Astro template context.
**Impact:** Last 3 Vercel builds failed with `ERROR`. Current production deployment is stable (older build), but no new code can ship.
**Fix:** Rewrite without `as any` — use a typed record or move logic outside the template expression.

### 2. Open Redirect in CheckoutForm
**Where:** `src/components/react/CheckoutForm.tsx:143-145`
**What:** `window.location.href = data.redirect_url` with no domain validation.
**Impact:** If Nyehandel API is ever compromised, users could be redirected to a phishing site.
**Fix:** Validate that `redirect_url` starts with the expected Nyehandel domain before redirecting.

### 3. Missing Nyehandel Variant IDs
**Where:** `product_variants` table — all 2,202 rows have NULL `nyehandel_variant_id`
**Impact:** Checkout/fulfilment mapping is broken if variant-level ordering is needed.
**Fix:** Audit the sync-nyehandel edge function to ensure variant IDs are being populated during catalogue sync.

### 4. Zero Orders in Production
**Where:** `orders` table — 0 rows
**Impact:** Cannot validate the end-to-end checkout flow. Either no real orders have been placed, or the order-creation trigger isn't firing.
**Fix:** Test a real checkout end-to-end and verify the create-nyehandel-checkout function writes to the orders table.

### 5. 591 Products Missing Descriptions (27%)
**Where:** `products` table — `description IS NULL OR description = ''`
**Impact:** Empty PDPs hurt SEO and conversion. These pages have no indexable body text.
**Fix:** Run the `PRODUCT_DESCRIPTIONS_BATCH2.sql` file (100 rewrites already prepared); batch-generate the remaining 491 via DeepSeek or manual Cowork sessions.

---

## P1 — Important (Next 2 Weeks)

### Code Quality
| Issue | Where | Fix |
|-------|-------|-----|
| 17 `any` type casts | middleware.ts, auth.ts, FlavorQuizIsland, content.config.ts, RecommendationsIsland, useOrders | Create proper interfaces; eliminate unsafe casts |
| FlavorQuiz uses `client:load` | flavor-quiz.astro:45 | Change to `client:visible` (defers ~50KB hydration) |
| 12 components missing React.memo | AchievementGrid, CheckoutForm, QuestBoard, SpinWheel, etc. | Wrap expensive components with `React.memo()` |
| Missing aria-labels on buttons | CheckoutForm, LeaderboardIsland, CookieConsentBanner, FilterableProductGrid | Add descriptive `aria-label` to all interactive buttons |
| Hardcoded fallback domain in auth | src/actions/auth.ts:115-118 | Throw error if `PUBLIC_SITE_URL` is not set instead of falling back to hardcoded domain |

### SEO
| Issue | Where | Fix | Est. Impact |
|-------|-------|-----|-------------|
| No BreadcrumbList schema | All pages | Add to SEO.astro component | +2-8% CTR via rich snippets |
| Short title tags | /faq, /about, /rewards | Expand with keywords | +2-5% CTR per page |
| No category intro copy | /products/flavor/[key], /products/strength/[key] | Add 100-200 word intros | +200-500 visits/mo |
| Product AggregateRating incomplete | products/[slug].astro | Populate when ratingCount > 0 | Star ratings in SERPs |
| Missing schemas on /about, /rewards | about.astro, rewards.astro | Add Organization + Service schemas | Rich snippet eligibility |

### Database
| Issue | Where | Fix |
|-------|-------|-----|
| High sequential scans on brands | 9,067 seq_scans | Add composite index on `(active, slug)` |
| 18 products missing images | products.image_url IS NULL | Add fallback image or backfill from Nyehandel |
| Webhook inbox not processing | webhook_inbox — 51 records, all NULL status | Verify webhook handler updates status column |
| 3 duplicate slug indexes | brands, products, blog_posts | Drop redundant non-unique indexes (save space) |

### Deployment
| Issue | Where | Fix |
|-------|-------|-----|
| Missing secrets | RESEND_API_KEY, DEEPSEEK_API_KEY, DISCORD webhooks | Add to Supabase Vault |
| No uptime monitoring | N/A | Set up UptimeRobot (free tier) |
| Legal pages need sign-off | Terms, Privacy, Cookie pages | Get solicitor review |

---

## P2 — Nice-to-Have (Next 30 Days)

### Code
- Expand test coverage (only 2 test files exist — add cart, checkout, filtering tests)
- Add dev-mode error logging to silent catch blocks in useOrders and RecentlyViewedIsland
- Remove legacy `shopify_sku` fields from types.ts when DB schema is updated
- Implement dynamic imports for heavy components (SpinWheel, framer-motion)

### SEO
- Add 3-5 "related articles" links to each blog post (internal cross-linking)
- Enrich product image alt text with flavour/strength metadata
- Add hreflang if/when launching translated versions
- Link country pages from main navigation or footer

### Performance
- Paginate /products page (666KB products.json loaded for client-side filtering)
- Audit lucide-react icon usage (potential 2-3KB gzip savings)
- Consider lazy-loading hero images on mobile

---

## Smart Automation Opportunities (Ranked by ROI)

### Quick Wins (Week 1-2, <4 hours each)

1. **Inventory Low-Stock Alerts** — Post-sync hook alerts Daniel when bestseller stock < 3 units. Prevents overselling. (1-2 hours)

2. **Weekly SEO Dashboard Email** — Scheduled task pulls GSC data + DataForSEO keyword gaps → emails summary to Daniel. Identifies content opportunities automatically. (2 hours)

3. **Build Failure Alerts** — Scheduled task checks Vercel deployments hourly → Discord/email on failure. Prevents silent breakage. (2 hours)

4. **Content Publishing Pipeline** — Scheduled task monitors blog-drafts/ → auto-creates Supabase blog_posts → triggers sitemap rebuild. Enables 3x/week publishing cadence. (3 hours)

### Medium-Term (Week 3-4, 4-8 hours each)

5. **Competitor Price Monitoring** — Daily Firecrawl scrape of Haypp/Northerner top 20 SKUs → alert on 5%+ price undercuts. Protects margins. (4 hours)

6. **Newsletter Digest Automation** — Weekly email to subscribers: new products, trending flavours, blog highlights, points reminder. Drives 5-15% repeat visit lift. (5 hours)

7. **Gamification Visibility Push** — Auto-email on achievement unlock; points callout in order confirmation; Discord bot for leaderboard milestones. (3-4 hours)

8. **Stale Content Detection** — Monthly scan of blog articles for outdated claims → flag for refresh. Maintains SEO authority. (4 hours)

### Strategic Bets (Month 2+)

9. **AI A/B Testing of Product Titles** — DeepSeek generates 3 title variants per product → rotate → track conversion → auto-promote winner. Est. 3-5% conversion lift. (6 hours)

10. **Dynamic Demand-Based Pricing** — Adjust prices based on sales velocity + stock levels. Est. 3-7% margin improvement on top sellers. (8 hours)

11. **Personalised Recommendations Engine** — Collaborative filtering on order history. Est. 5-10% AOV lift. (14 hours)

12. **Multi-Language Localisation** — Auto-translate to Swedish/Norwegian/Danish. Opens Scandinavian markets worth $20-50K/month. (20+ hours)

13. **Subscription/Auto-Reorder** — Monthly reorder for regular customers. 20-30% recurring revenue potential. (12 hours)

---

## Revenue Impact Summary

| Timeframe | Actions | Est. Monthly Revenue Impact |
|-----------|---------|----------------------------|
| Week 1-2 | Fix build, backfill descriptions, P0 automations | $500-1K (conversion fix) |
| Week 3-4 | SEO schema, title tags, newsletter, price monitoring | $2-5K (SEO + retention) |
| Month 2 | A/B testing, demand pricing, competitor intel | $5-10K (optimisation) |
| Month 3+ | Recommendations, localisation, subscriptions | $15-50K (new channels) |

---

## Files Created This Session

| File | Purpose |
|------|---------|
| `cowork/outreach/BACKLINK_OUTREACH_CAMPAIGN.md` | 15 personalised outreach emails |
| `cowork/outreach/SOCIAL_MEDIA_CONTENT.md` | 10 Reddit + 5 forum + 3 Quora posts |
| `cowork/content/COUNTRY_PAGE_EXPANSIONS.md` | 10 new country pages (DE, FR, NL, PL, IT, ES, BE, AT, CZ, IE) |
| `cowork/content/PRODUCT_DESCRIPTIONS_BATCH2.sql` | 100 product description rewrites |
| `cowork/reports/weekly-seo-2026-03-29.md` | Weekly SEO monitoring template |
| `cowork/components/MegaMenu.astro` | Desktop mega menu component |
| `cowork/components/community-redesign.astro` | Community page redesign |
| `blog-drafts/article-25 through article-30` | 6 new SEO articles |
| `cowork/reports/SITE_IMPROVEMENT_PLAN_2026-03-29.md` | This document |
