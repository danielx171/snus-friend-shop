# Go-Live Roadmap: snusfriends.com

**Date:** 2026-03-25
**Status:** Approved
**Approach:** A — "Fix the Cracks First"

## Context

Site is live at snusfriends.com in preview mode. 734 products, working checkout (test order #479 confirmed), Phase 2 gamification DB+components built. 5-agent audit scored design 8.5/10. Main pain: site looks unfinished to public visitors.

## Decision: Quality over speed, no fixed launch date

User priorities: everything equally important (volume, retention, brand, trust). Ship all Phase 2 gamification. Multi-brand architecture in 3-6 months (don't abstract now, keep clean).

## Wave 1: Make It Feel Finished (3-4 sessions)

### 1.1 Full-Screen Age Gate on Entry
- Full-screen overlay on first visit (not just product detail)
- localStorage `age_verified=true` to remember
- Deny button shows proper "access denied" message (not redirect to google.com)
- Legal requirement for nicotine products in EU/UK

### 1.2 Remove "Coming Soon" Placeholders
- Account > Addresses tab: either implement saved addresses or remove the tab entirely
- Account > Membership tab: wire to real data or simplify
- "Manage Preferences (Coming Soon)" button: remove disabled state
- "Delete Account" button: either implement (contact support flow) or remove

### 1.3 Fix PWA Install Prompt
- Investigate why InstallPrompt component stopped showing
- Check service worker registration, manifest validity, HTTPS requirement
- Verify beforeinstallprompt event fires

### 1.4 Cart Toast Notifications
- Show Sonner toast when item added to cart ("Added [product] to cart")
- Show toast when item removed
- Show toast when quantity changed
- Use existing Sonner setup (already imported in App.tsx)

### 1.5 Touch Target Compliance
- Header icon buttons (search, wishlist, theme): h-10 w-10 → h-11 w-11 (40→44px)
- ProductCard wishlist button: increase padding
- ProductCard pack-size buttons: increase from ~24px to 36px+ height
- Follows WCAG 2.5.8 Target Size (Minimum)

### 1.6 Legal Page Drafts
- Draft Terms & Conditions (nicotine product sale, EU consumer rights, 14-day withdrawal)
- Draft Privacy Policy (GDPR compliant, Supabase data processing, cookies)
- Draft Cookie Policy (necessary vs analytics, consent mechanism)
- Mark as "DRAFT — pending solicitor review" with visible banner
- Replace current empty legalWarning pages

### 1.7 CORS Secret
- Set ALLOWED_ORIGIN=https://snusfriends.com in Supabase Vault
- Document DEEPSEEK_API_KEY in .env.example and DEPLOYMENT_CHECKLIST.md

## Wave 2: Wire the Engagement Loop (3-4 sessions)

### 2.1 Reviews End-to-End Testing
- Verify ProductReviews component fetches from real DB
- Test review submission flow (rating, title, body, pros/cons, photos)
- Test verified buyer badge logic
- Test review flagging and ops dashboard moderation
- Add AggregateRating to product JSON-LD

### 2.2 Quests + Avatars Activation
- Verify quest progress updates on order/review/spin actions
- Test avatar unlock triggers
- Test celebration modals (QuestComplete, avatar unlock)
- Verify profile tab shows real data

### 2.3 Order Tracking
- Show tracking number + carrier on OrderConfirmation page
- Show expected delivery date estimate
- Wire to delivery callback data from Nyehandel

### 2.4 Checkout UX Polish
- Progress indicator (Step 1: Details → Step 2: Review → Step 3: Payment)
- Delivery time estimates next to shipping method
- Clear SKU error messages (list which items unavailable)
- "Continue Shopping" link on CartPage

### 2.5 FAQ Search + Empty States
- Search/filter bar on FaqPage
- Improve Blog empty state (icon, CTA, subscribe option)
- Improve Account Addresses empty state

## Wave 3: Revenue Readiness (2-3 sessions)

### 3.1 Transactional Email (Resend)
- Order confirmation email
- Shipping notification email (triggered by delivery callback)
- Welcome email on registration
- Password reset email (currently Supabase default)

### 3.2 Product Presentation
- Product image quality improvements (source or generate better images)
- Retail pricing strategy (currently wholesale × 1.55)
- Promo code system (beyond hardcoded WELCOME10)

### 3.3 SEO + Content
- Blog content pipeline (automated or manual)
- Structured data (JSON-LD) on all product pages
- OpenGraph images for social sharing

## Wave 4: Go Live (1-2 sessions)

### 4.1 Final Checklist
- Remove preview mode (VITE_PREVIEW_MODE=false)
- Full checkout smoke test with real payment
- Uptime monitoring (UptimeRobot or Vercel)
- Solicitor sign-off on legal pages
- DNS/SSL final verification
- Error monitoring (check Vercel runtime logs clean)

## Timeline Estimate

| Wave | Sessions | Calendar (at 1 session/day) |
|------|----------|---------------------------|
| Wave 1: Polish | 3-4 | ~4 days |
| Wave 2: Engagement | 3-4 | ~4 days |
| Wave 3: Revenue | 2-3 | ~3 days |
| Wave 4: Go Live | 1-2 | ~2 days |
| **Total** | **10-13** | **~2-3 weeks** |

Sessions can be parallelized with multiple agents per session.
