# Full Site & Infrastructure Audit — March 29, 2026

## Audit Scope
Visual inspection of all major pages in both themes (Forest + Copper), functional testing of cart/search/navigation/filters, and infrastructure review of all connected services (Sentry, PostHog, Klaviyo, Supabase, Vercel).

---

## Infrastructure Status

### Vercel (Hosting)
- **Status:** ✅ Healthy
- Latest deployment `dpl_64VZktmjHdGqpZirXBSgCCSJgQbr` promoted to production, state READY
- Commit `31125349` ("feat: theme consistency, hero tokens, launch audit fixes") live

### Supabase (Backend)
- **Status:** ✅ Healthy
- Project `bozdnoctcszbhemdjsek` (eu-west-1), 31 active edge functions
- nyehandel-proxy already has `X-Language: en` header — no redeployment needed

### Sentry (Error Monitoring)
- **Status:** ⚠️ 1 unresolved issue
- Org: `daniel-keyhanfar`, project: `snusfriends`, region: `de.sentry.io`
- **SNUSFRIENDS-3**: `InvalidStateError` — Astro View Transitions bug on PDP pages (7 occurrences, Chrome 146)
- Error: `Failed to execute 'replaceState' on 'History'` during client-side navigation

### PostHog (Analytics)
- **Status:** ⚠️ Needs custom events
- Org: `Snusfriends`, project ID: 147839
- Only 4 default events: `$autocapture`, `$pageview`, `$pageleave`, `$rageclick`
- **Missing:** add_to_cart, product_viewed, checkout_started, order_completed, search_performed, newsletter_signup, spin_wheel_used, quiz_completed

### Klaviyo (Email Marketing)
- **Status:** ⚠️ Empty — needs flows
- Account: `Txkh5P`, org: Nordic Express AB
- 3 default lists (Email, Text, Preview), zero flows, 19 internal-only metrics
- **Missing:** Welcome flow, post-purchase flow, abandoned browse flow, review request flow, win-back flow

---

## Site Audit Findings

### ✅ Working Well

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage hero | ✅ | Both themes render correctly with hero tokens |
| Product cards | ✅ | Strength indicators, flavour tags, prices, Add to Cart all present |
| Cart drawer | ✅ | Free shipping progress bar, pack upsell, quantity controls, Remove, View Cart + Checkout |
| PDP (Product Detail) | ✅ | Pack size selector (1/3/5/10), quantity, Add to Cart, description, cross-links, reviews section, sticky bottom bar |
| Theme switcher | ✅ | Forest ↔ Copper works correctly, persists across pages via localStorage |
| Mobile menu | ✅ | Well-organized: Shop, By Strength, By Flavor, Community, Account, Theme picker |
| Breadcrumbs | ✅ | Present on all tested pages |
| Blog | ✅ | Strong editorial intro, internal links, category tags |
| FAQ | ✅ | Accordion-style, categorized questions |
| Rewards page | ✅ | How it works, tier system with perks |
| Community page | ✅ | Social proof stats, quests (login-gated), achievements, tier system |
| Beginners page | ✅ | Clear CTAs, educational content, links to /flavor-quiz correctly |
| Brand pages | ✅ | Brand header with manufacturer, cans count, nicotine range, tabs (All/Flavours/Strengths/Review) |
| Country pages | ✅ | Legal status badge with flag, popular brands, delivery info |
| Flavour quiz | ✅ | Multi-step with progress dots, flavour selection |
| Shipping page | ✅ | Free shipping callout, EU zone table |
| Footer | ✅ | Guides, Legal, payment badges, trust badges, social links, theme picker, age disclaimer |
| Products page | ✅ | 708 products, filters, sort dropdown, SEO-rich intro with internal links |
| Mobile bottom nav | ✅ | Home, Search, Cart (with badge), Login |
| Trust bar | ✅ | Rotating messages (Free EU Shipping, Trusted by EU customers, Same-Day Dispatch) |

### 🔴 P0 — Fix Now (Revenue/Conversion Impact)

1. **Search broken for multi-word queries**
   - "velo mint" → 0 results (should show VELO mint-flavored products)
   - "velo" alone → 53 results
   - **Root cause:** Pagefind uses AND logic; products don't have "mint" in indexed content (they use names like "Ice Cool", "Freeze", "Spearmint")
   - **Fix:** Add flavour synonyms/keywords to Pagefind index, or implement search synonym mapping
   - **Impact:** High — users searching "[brand] [flavour]" see zero results, immediate bounce

### 🟡 P1 — Fix This Week (Growth/Trust)

2. **PostHog has zero custom events**
   - No e-commerce tracking means no funnel visibility
   - Need: `add_to_cart`, `product_viewed`, `checkout_started`, `order_completed`, `search_performed`, `newsletter_signup`, `spin_wheel_used`, `quiz_completed`
   - **Impact:** Can't measure conversion rates, identify drop-off points, or optimize

3. **Klaviyo has zero email flows**
   - No welcome email, no post-purchase email, no abandoned browse recovery
   - Note: Resend handles transactional emails (order confirmed, shipped, review request), but Klaviyo should handle marketing automation
   - Need: Welcome series, post-purchase upsell, browse abandonment, win-back
   - **Impact:** Missing revenue from automated email (industry avg 20-30% of e-commerce revenue)

4. **Sentry View Transitions bug (SNUSFRIENDS-3)**
   - `InvalidStateError` on PDP pages with Astro View Transitions in Chrome 146
   - 7 occurrences so far — may increase with more traffic
   - **Fix:** Known Astro issue — add try/catch guard around replaceState, or disable View Transitions on PDP

5. **Achievements "Loading..." for logged-out users**
   - Community page → Achievements Showcase shows "Loading achievements..." forever for non-authenticated visitors
   - Should show a placeholder/preview or "Sign in to view achievements"
   - **Impact:** Minor UX issue but affects trust on community page

### 🟢 P2 — Nice to Have (Polish)

6. **Search page could show suggestions while typing**
   - Currently no autocomplete/typeahead — just static quick-access tags
   - Could use Pagefind's pre-built search UI for instant results

7. **Community stats may need validation**
   - "2,847 Active Members" and "15.3K Reviews Posted" — confirm these are real DB counts or hardcoded
   - If hardcoded, swap for live queries

8. **Accessibility: review color contrast in Copper theme**
   - Some text on dark backgrounds may be below 4.5:1 ratio
   - CURRENT_PRIORITIES.md already flags contrast issues

9. **OG images per page**
   - Already in CURRENT_PRIORITIES.md as nice-to-have
   - Important for social sharing of brand/product/blog pages

10. **Legal pages still need solicitor sign-off**
    - Terms, Privacy, Cookie pages — flagged since before launch

---

## Recommended Tonight's Work (Prioritized)

### Batch 1: Quick Wins (can do now)
- [ ] **Fix search synonym mapping** — add flavour keywords to product Pagefind index data
- [ ] **Fix achievements loading state** — show placeholder for logged-out users

### Batch 2: PostHog Custom Events
- [ ] Add `posthog.capture()` calls for key e-commerce events
- [ ] Instrument: add_to_cart, product_viewed, checkout_started, order_completed
- [ ] Instrument: search_performed, newsletter_signup, quiz_completed, spin_wheel_used

### Batch 3: Klaviyo Flows (design + build)
- [ ] Welcome flow (signup → welcome email → 2-day delay → product recommendations)
- [ ] Post-purchase flow (order → 7 days → review request, already handled by Resend cron — decide on Klaviyo vs Resend ownership)
- [ ] Browse abandonment flow (viewed products → no cart add → reminder)

### Batch 4: Bug Fixes
- [ ] Fix Sentry SNUSFRIENDS-3 View Transitions InvalidStateError
- [ ] Audit accessibility contrast in Copper theme

---

## Summary

The site is in excellent shape — all core commerce features work well, both themes render correctly, and the content/SEO foundations are strong. The main gaps are in instrumentation (PostHog events, Klaviyo flows) and one significant search UX bug. Fixing multi-word search should be the top priority as it directly impacts conversion.
