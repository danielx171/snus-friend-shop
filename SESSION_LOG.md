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
