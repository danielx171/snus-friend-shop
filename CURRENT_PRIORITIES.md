# Current Priorities

Last updated: 2026-03-25 (evening session)

## Completed today (2026-03-25 evening) — Go-Live Sprint

### Wave 1: Make It Feel Finished ✅
- Full-screen age gate on site entry (localStorage remember, deny page)
- Draft legal pages (Terms, Privacy, Cookies — pending solicitor review)
- Removed "Coming Soon" placeholders (Addresses tab, Preferences, Delete Account)
- Cart toast notifications via Sonner (add/remove/update)
- PWA install prompt fixed (global beforeinstallprompt capture in main.tsx)
- WCAG 2.5.8 touch targets (header icons, ProductCard buttons → 44px)
- ALLOWED_ORIGIN confirmed in Supabase Vault
- DEEPSEEK_API_KEY documented in .env.example and DEPLOYMENT_CHECKLIST

### Wave 2: Wire the Engagement Loop ✅
- Reviews: verified buyer badge now checks real order history
- Quests + avatars: verified all wired to real Supabase data (no changes needed)
- Order tracking: shipping card on confirmation + tracking column in account history
- Checkout UX: specific SKU error messages, Continue Shopping on cart
- Post-purchase: "You might also like" recommendations on order confirmation
- FAQ: real-time search filter with empty state + contact link
- Blog: improved empty state with newsletter CTA

### Wave 3: Design Polish + Tests ✅
- Password strength meter on RegisterPage (weak/fair/good/strong bar)
- prefers-reduced-motion check on all confetti/particle animations
- 32 critical path tests (email validation, cart ops, currency formatting)
- Centralized SITE_URL config (3 pages → import from config/brand.ts)
- Review photo upload limits already in place (3 photos, 5MB, jpeg/png/webp)

## Completed earlier today (2026-03-25 morning)

### 50-Finding Code Audit + UX Fixes
- XSS sanitization, security hardening, translation cleanup
- Dead link fix, X-Language header, wishlist crash fix, currency fix
- Lazy loading (40% bundle reduction), ErrorBoundary, build version system
- What's New page, package version bumped to 1.4.0

### 5-Agent Comprehensive Site Audit
- Design system: 8.5/10, UX patterns, mobile/responsive, tech debt scan

## Steps completed: 41-55 (of 56)

| Step | Status | Description |
|------|--------|-------------|
| 41 | ✅ | Full-screen age gate |
| 42 | ✅ | ALLOWED_ORIGIN in Vault |
| 43 | ✅ | DEEPSEEK_API_KEY documented |
| 44 | ✅ | Legal page drafts |
| 45 | ✅ | PWA install prompt fixed |
| 46 | ✅ | Cart toast notifications |
| 47 | ✅ | Order tracking display |
| 48 | ✅ | Touch target compliance |
| 49 | ✅ | Checkout UX polish |
| 50 | ✅ | Continue Shopping + recommendations |
| 51 | ⬜ | Flagship brand color (deferred — needs design decision) |
| 52 | ✅ | FAQ search + empty states |
| 53 | ✅ | Password strength + reduced-motion |
| 54 | ✅ | Centralize SITE_URL + photo limits |
| 55 | ✅ | Critical path tests (32 passing) |
| **56** | **⬜** | **Go live (remove preview mode, final smoke test)** |

## Remaining before go-live (Step 56)

### Blockers
- [ ] Solicitor sign-off on Terms, Privacy, Cookie pages
- [ ] Final checkout smoke test with real payment
- [ ] Remove preview mode (VITE_PREVIEW_MODE=false)

### Nice to have (not blocking)
- [ ] Step 51: Flagship brand color across all 4 themes
- [ ] Uptime monitoring setup (UptimeRobot)
- [ ] Transactional email via Resend (order confirmation, shipping notification)
- [ ] Product image quality improvements
- [ ] Retail pricing strategy (currently wholesale × 1.55)
- [ ] Blog content pipeline
- [ ] Multi-brand architecture (3-6 months)

## Current state

- Site live at snusfriends.com and snus-friend-shop.vercel.app
- 734 products loading from Supabase (47 tables, 20 edge functions, 42 migrations)
- Preview mode active (VITE_PREVIEW_MODE=true)
- Checkout fully working — test order confirmed (Nyehandel order 479)
- Phase 2 gamification verified working (profiles, avatars, reviews, quests)
- Design system: 8.5/10 — glass-panel aesthetic, navy+lime palette
- Version: 1.4.0 with build metadata and What's New page
- 32 critical path tests passing
- All pre-launch blockers resolved except solicitor sign-off + final smoke test

## Key reference files

- `NYEHANDEL_API_REFERENCE.md` — full API reference
- `ROADMAP.md` — delivery sequence, Steps 26-56
- `SYSTEM_BOUNDARIES.md` — architecture rules
- `DEPLOYMENT_CHECKLIST.md` — secrets, webhooks, pre-launch checklist
- `docs/superpowers/specs/2026-03-25-go-live-roadmap-design.md` — go-live roadmap spec
