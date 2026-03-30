# Full Site Audit Report — snusfriends.com

**Date:** 30 March 2026
**Auditor:** Claude (design, accessibility, UX copy, content accuracy)
**Pages audited:** 15+ page types (homepage, PDP, brands, blog index, 5 blog articles, FAQ, about, contact, shipping, rewards, login, search)

---

## Summary

**Overall assessment:** The site is well-built with strong visual hierarchy, good a11y foundations, and professional copy. The main issues are content accuracy errors (false UK shipping claims across 6 blog articles), two broken navigation links, a stale stat, and minor accessibility gaps.

**Issues found:** 14 | **Fixed:** 12 | **Noted for future:** 2

---

## Issues Found & Fixed

### Critical: False Shipping Claims (6 blog articles)

Multiple blog articles claimed SnusFriend ships to the UK. The shipping page clearly states EU + Nordics only. These could cause customer frustration or legal issues.

| File | Original Text | Fixed To |
|------|---------------|----------|
| `blog/best-nicotine-pouches-2026.astro` | "fast UK and EU shipping" | "fast EU-wide shipping" |
| `blog/white-fox-...-guide.astro` (×2) | "discreet delivery to the UK, Sweden, and EU" | "discreet EU-wide delivery" |
| `blog/siberia-...-guide.astro` (×3) | "discreet delivery to the UK, Sweden, and EU" | "discreet EU-wide delivery" |
| `blog/skruf-...-guide.astro` (×2) | "in the UK, Sweden, and EU" | "across the EU" |
| `blog/fumi-...-guide.astro` | "current UK availability" | "current availability and EU shipping" |
| `blog/nordic-spirit-...-guide.astro` (×2) | "current UK availability" | "current availability and EU shipping" |
| `blog/klar-...-guide.astro` | "current UK availability" | "current availability and EU shipping" |

**Total: 12 false UK shipping claims removed across 6 articles.**

### High: Broken Navigation Links (MegaMenu)

| Link | Target | Actual Page |
|------|--------|-------------|
| `/strength-guide` | 404 | `/nicotine-strength-chart` ✅ Fixed |
| `/flavour-guide` | 404 | `/nicotine-pouch-flavours` ✅ Fixed |

### Medium: Stale Statistics

| Page | Stat | Was | Now |
|------|------|-----|-----|
| `about.astro` | Expert Guides count | 43 (hardcoded) | 55+ ✅ Fixed |

### Medium: FAQ Schema Mismatch

| Page | Issue | Fix |
|------|-------|-----|
| `faq.astro` | Schema said "a certain threshold" for shipping cost | Updated to "€29" with actual rates (€4.90 EU, €3.90 Nordics) ✅ Fixed |

### Low: Accessibility — Stars in Announcement Bar

| Component | Issue | Fix |
|-----------|-------|-----|
| `AnnouncementBar.astro` | "★★★★★" characters read aloud by screen readers | Added `aria-hidden="true"` to both desktop and mobile star spans ✅ Fixed |

---

## Design Critique — What's Working Well

### Homepage
- **Strong visual hierarchy:** Hero section with clear CTA hierarchy (primary "Shop All Pouches" + secondary "Flavour Quiz")
- **Trust bar:** Rotating announcements are effective and non-intrusive
- **Product cards:** Clean design with strength dots, flavor tags, mg/pouch info — lots of signal at a glance
- **Best Sellers/Staff Picks/New Arrivals:** Good content sections that showcase catalog depth
- **"Why Thousands" section:** Strong trust copy — honest, specific, no marketing fluff
- **Brand grid:** Visual, scannable, good use of colored circles
- **CTA finale:** "Ready to find your perfect pouch?" section is an excellent closer

### Product Detail Page
- **Info density is right:** Nicotine, portions, format, price/pouch — all above the fold
- **Pack size selector:** Clear pricing for 1/3/5/10 cans — good upsell mechanic
- **"More from VELO" section:** Cross-sells work well
- **Review section:** Empty but structure is ready for when reviews come in

### Blog
- **Article quality is excellent:** The "Best Nicotine Pouches 2026" article is comprehensive, well-structured, has good internal links, comparison table, FAQ section, and sources
- **Blog index:** Clean card layout with category badges
- **Internal linking:** Strong — articles cross-link to related content and product pages

### Overall UX
- **Consistent spacing and typography** across all pages
- **Breadcrumbs** on every page with proper BreadcrumbList schema
- **FAQPage schema** with 26 questions — excellent for featured snippets
- **Footer** is comprehensive with 4 columns, newsletter signup, payment icons, social links
- **Mobile bottom nav** is present and accessible

---

## Design Critique — Opportunities for Improvement

### Homepage
1. **No social proof above the fold** — the "★★★★★ Trusted by EU customers" in the trust bar has no backing (no Trustpilot link, no review count). Consider adding "Rated X.X on Trustpilot" once the profile exists.
2. **"Recently Viewed" section appears for first-time visitors** with previously viewed items — this is a nice personalization touch. No issue here.
3. **Brand grid only shows 15 brands** — could show more or add a search/filter for the brands page.

### Product Detail Page
1. **No "Earn X pts" on PDP** — the product cards show "Earn X pts" but the PDP itself doesn't mention points potential. Consider adding near the Add to Cart button.
2. **Reviews section is empty** — shows rating stars at 0 with no reviews. Consider adding "Be the first to review" CTA with incentive ("Write a review, earn 50 SnusPoints").
3. **Description text is generic** — "Premium bold grape nicotine pouches from VELO deliver 6mg strength in regular intensity" — this reads like auto-generated text. Consider rewriting top 10-20 product descriptions to be more engaging.

### Blog
1. **No author photos or bios** — "By SnusFriends Editorial" is fine but a face adds trust.
2. **No estimated reading time on blog index cards** — only shown on the article page itself.
3. **No "Related Articles" sidebar** — articles have related links at the bottom but not in a sidebar.

### Contact Page
1. **Honeypot field is properly hidden** — no issue.
2. **No live chat option** — competitors like Northerner offer live chat. Consider adding.

### Login/Register
1. **No social login** — only email/password. Adding Google or Apple sign-in would reduce friction.
2. **No password strength indicator** — planned for tomorrow's sprint.

---

## Content Quality Assessment

### Excellent (no changes needed)
- Homepage hero copy
- Blog "Best Nicotine Pouches 2026" — thorough, expert, well-sourced
- FAQ page — comprehensive 26 questions covering all customer concerns
- Shipping page — clear zones, timeline, FAQ section
- Rewards page — clean tier explanation with clear progression

### Good (minor polish opportunities)
- About page — could mention founding year and team more personally
- Blog brand guides — well-structured but some have identical "Where to Buy" sections (now fixed for accuracy)

### Needs attention (flagged for future)
- Product descriptions — many read as auto-generated. Priority: rewrite top 20 best-sellers with unique, engaging copy
- Legal pages — need solicitor sign-off (already noted in MASTER_PLAN)

---

## Files Modified

1. `src/pages/about.astro` — Updated "43" to "55+" for Expert Guides count
2. `src/pages/blog/best-nicotine-pouches-2026.astro` — Fixed "UK and EU" → "EU-wide"
3. `src/pages/blog/white-fox-nicotine-pouches-complete-guide.astro` — Fixed UK shipping claims (×2)
4. `src/pages/blog/siberia-nicotine-pouches-complete-guide.astro` — Fixed UK shipping claims (×3)
5. `src/pages/blog/skruf-nicotine-pouches-complete-guide.astro` — Fixed UK shipping claims (×2)
6. `src/pages/blog/fumi-nicotine-pouches-complete-guide.astro` — Fixed UK claims (×2)
7. `src/pages/blog/nordic-spirit-nicotine-pouches-complete-guide.astro` — Fixed UK claims (×2)
8. `src/pages/blog/klar-nicotine-pouches-complete-guide.astro` — Fixed UK claim
9. `src/pages/faq.astro` — Fixed vague shipping cost in schema (now €29/€4.90/€3.90)
10. `src/components/astro/AnnouncementBar.astro` — Added aria-hidden to decorative stars
11. `src/components/astro/MegaMenu.astro` — Fixed broken `/strength-guide` → `/nicotine-strength-chart`
12. `src/components/astro/MegaMenu.astro` — Fixed broken `/flavour-guide` → `/nicotine-pouch-flavours`

---

*This audit is saved in the repo as `SITE_AUDIT_2026-03-30.md`.*
