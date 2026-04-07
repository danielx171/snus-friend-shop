# Morning Verification & Polish Plan — April 8, 2026

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the overnight deploy landed correctly, fix any remaining live-site issues, and polish the last Codex-flagged items.

**Architecture:** Verification-first approach — check live site, fix only what's actually broken, then polish.

**Tech Stack:** Astro 6, Vercel, GSC MCP, Chrome DevTools MCP (if available)

---

## Phase 1: Deploy Verification (FIRST THING)

### Task 1: Check Deploy Status

- [ ] Run `npx vercel ls | head -5` to see if production build completed
- [ ] If still building, wait. If failed, check `npx vercel logs <url>` for the error
- [ ] If succeeded, proceed to live verification

### Task 2: Live Site Verification Checklist

Test each of these on the live site (snusfriends.com):

- [ ] **Cart:** Add a product to cart → badge increments → open cart drawer → renders correctly → no console errors
- [ ] **Homepage counters:** Load snusfriends.com → hero stats show real numbers (708+ Products, 35+ Brands), not 0
- [ ] **Blog index:** Load /blog → shows all 77 articles in category sections
- [ ] **Finland guide:** Load /blog/buying-nicotine-pouches-finland-2026 → returns 200
- [ ] **Norway guide:** Load /blog/buying-nicotine-pouches-norway-2026 → returns 200
- [ ] **New articles:** Spot-check /blog/zyn-vs-loop-2026, /blog/best-nicotine-pouches-sensitive-gums
- [ ] **Sitemap:** Load /sitemap-0.xml → check URL count (should be ~1,150+), check lastmod dates are NOT all the same
- [ ] **RSS:** Load /rss.xml → check article count matches blog registry
- [ ] **Shipping page:** Load /shipping → Finland/Norway have restriction notes

### Task 3: Resubmit Sitemap

- [ ] Use GSC MCP: `mcp__gsc__submit_sitemap(site_url="sc-domain:snusfriends.com", sitemap_url="https://snusfriends.com/sitemap-index.xml")`
- [ ] Verify: `mcp__gsc__list_sitemaps_enhanced(site_url="sc-domain:snusfriends.com")` — URL count should be ~1,150+

---

## Phase 2: Fix Anything Broken

Only proceed here if Phase 1 reveals issues.

### Task 4: Cart Fix (if still broken)

If the cart drawer doesn't open despite badge incrementing:
- Check if the cart store's `$mixDiscount` computed callback is correct in the deployed bundle
- The fix (tuple → separate args) was committed in `be379afe` — if it's not live, redeploy
- Check browser console for the exact error message

### Task 5: Counter Fix (if still 0)

If homepage counters still show 0:
- The beginner-mode early return was fixed in `ad1915b4`
- The SSR fallback was added (shows real number in HTML)
- If both fixes are deployed and it still shows 0, investigate the IntersectionObserver

---

## Phase 3: Polish (if Phase 1-2 are clean)

### Task 6: Cookie Banner Mobile Compactness

**File:** `src/components/react/CookieConsentBanner.tsx`
- Reduce mobile spacer from `h-16` (64px) to `h-12` (48px)
- Make banner text single-line on mobile with smaller font
- Keep the accept/reject buttons but make them more compact

### Task 7: Copper Theme Polish

**Files:** Header.astro, Footer.astro, Logo.astro, BlogHero.astro
- Check if any components hardcode forest-theme colors instead of using CSS custom properties
- Replace any hardcoded `#hex` or specific `hsl()` values with `var(--primary)`, `var(--foreground)`, etc.

### Task 8: Homepage Copy (from Cowork)

**Source:** `cowork/content/homepage-copy-variations.md`
- Review the 3 variations Cowork wrote
- Pick the best one (or mix elements)
- Update the hero section in `src/pages/index.astro`

---

## Verification

After all changes:
- `bun run build` succeeds
- `bun run test` — 11/11 passing
- `bun run lint` — 0 errors
- Live site passes all Phase 1 checks
- Push and redeploy if changes were made
