# SnusFriend Session Log

> This file tracks all changes made by Claude Code sessions so that Cowork 
> stays in sync and doesn't duplicate work. Updated after each session.

---

## 2026-03-31 — Design Overhaul + Bug Fixes + Email Integration

### Navigation & Internal Linking
- Added Wishlist heart icon to header (between account and cart)
- Added Compare Products + Membership Tiers to header "Explore" dropdown
- Added Membership + What's New to footer Company section
- Added Compare Products to footer Guides section
- Added all above to mobile menu (Community + Account sections)
- Enriched 5 blog articles with related reading sections (20+ internal links):
  nicotine-pouches-vs-snus, nicotine-pouch-side-effects, velo-complete-guide,
  zyn-complete-guide, how-many-pouches-a-day

### Product Card Redesign
- Flavor-coded left borders (teal=mint, purple=berry, orange=fruit, green=citrus)
- Strength text badges replacing dots (NORMAL, STRONG, EXTRA STRONG) — WCAG fix
- Inline pack selector (1/3/5/10 cans with savings %) on every card
- Compact "+" add button replacing "Add to Cart" text
- Badge position fixed to not overlap flavor border

### Font Upgrade
- Headings: Space Grotesk (both themes)
- Body: Plus Jakarta Sans (was Inter everywhere)
- Font preloads updated accordingly

### PLP Layout (/nicotine-pouches)
- Products now above the fold (was buried under 3 paragraphs of SEO text)
- SEO text preserved below the grid for crawlers

### Strength Filter Fix
- /products/strength/extra-strong and super-strong now work (was showing 0 products)
- Normalized strength keys at data layer: extraStrong->extra-strong, ultraStrong->super-strong

### Login Fix
- New /api/auth/login endpoint with proper Set-Cookie headers
- Client-side fetch + redirect (was Astro form action losing cookies in PRG redirect)

### Email Integration (Supabase Dashboard — manual)
- Resend SMTP configured (noreply@snusfriends.com)
- Branded confirmation + password reset email templates

### Visual Fixes (deployed)
- Copper theme hero richer, footer spacing, header breathing room
- Section spacing lg:py-24, container 1440px, mega menu theme-aware

### Nyehandel Stock Sync (Sprint 1 of 4)
- New edge function: `sync-nyehandel-stock` — lightweight stock-only sync
- Cron: every 10 minutes via pg_cron (alongside existing 4h full sync)
- DB: `stock_synced_at` column on `product_variants`
- Deployed + cron active on Supabase

### Order Cancellation (Sprint 2 of 4)
- New edge function: `cancel-nyehandel-order` — JWT-protected
- Supports both customer (own orders) and ops (any order) cancellation
- Calls NYE `POST /orders/{id}/cancel?refund_payment=true`
- Guards: cancellable status check, already-canceled check, ownership check
- Creates ops_alert if NYE cancellation fails
- DB: `canceled_at` + `cancel_reason` columns on `orders`
- Deployed on Supabase

### Discount Distribution (Sprint 3 of 4)
- New shared utility: `_shared/discount-distribution.ts` — VAT-safe proportional discount math
- New `discounts` table (code, type, amount, min_order, max_uses, validity window)
- Modified `create-nyehandel-checkout` to accept `discount_code` field
- Validates: code exists, active, not expired, not exhausted, min order met
- Distributes discount proportionally across line items (NYE requirement)
- Increments used_count after successful application
- NOTE: `create-nyehandel-checkout` needs redeployment via Supabase CLI

### Order Updates (Sprint 4 of 4)
- New edge function: `update-nyehandel-order` — JWT-protected, ops-only
- NYE quirks baked in: strips company name (causes server error), warns about shipping VAT flip
- Supports: shipping address changes, warehouse notes
- NOT supported (by design): email changes (NYE ignores them), item changes (cancel + recreate)
- Audit trail: `update_history` jsonb column on orders + webhook_inbox log
- DB: `last_updated_at` + `update_history` columns
- Deployed on Supabase

### All 4 Nyehandel Gaps: COMPLETE
Edge functions deployed: sync-nyehandel-stock, cancel-nyehandel-order, update-nyehandel-order
Shared utility: _shared/discount-distribution.ts
Modified: create-nyehandel-checkout (discount_code support)
Tables created: discounts
Columns added: product_variants.stock_synced_at, orders.canceled_at, orders.cancel_reason, orders.last_updated_at, orders.update_history

---

## What Cowork Should NOT Redo

- Legal "under review" banners — never existed
- Terms/Privacy completeness — all sections already present
- 3 blog articles (ZYN Strength, RAVE, Strongest Snus) — already deployed
- Trust badges — already in footer
- Fact-check on "How Many Pouches a Day" — already corrected

---

## Still TODO

### Go-Live Blockers
- [ ] Set RESEND_API_KEY in Supabase secrets
- [ ] Create Klaviyo Welcome flow
- [ ] Wire newsletter form to Klaviyo
- [ ] Fix generate-review-summary env var typo
- [ ] End-to-end order test with live credentials
- [ ] Add company org number + address

### Week 1 Post-Launch
- [ ] Trustpilot business account + widget
- [ ] Klaviyo Abandoned Cart + Post-Purchase flows
- [ ] DISCORD + DEEPSEEK secrets
- [ ] Ops Dashboard Astro migration

### Content (Cowork)
- [ ] 3 articles/week SEO sprint
- [ ] Exit intent popup
- [ ] Gamification visibility boost
- [ ] Bundle builder page
