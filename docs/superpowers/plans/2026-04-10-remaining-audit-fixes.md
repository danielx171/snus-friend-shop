# Remaining Audit Fixes — Full Roadmap

**Date:** 2026-04-10
**Context:** 16 commits shipped in the April 9-10 session. Most P0/P1 fixes are live. This plan addresses everything still open, organized by owner and priority.

---

## What's done (don't redo)

- Cart flow: working (Codex verified)
- /nicotine-pouches: 92 performance, CLS 0
- BlogPosting schema: 80/80
- Product aggregateRating: 708/708 (always included now)
- Organization schema: full
- Footer trust: Nordic Express AB address
- Strength redirects: 301
- FAQPage on catalog: 9 questions
- Gamification naming: fully renamed (33 files)
- Logged-out previews: 3 pages
- SnusCoin teasers: PDP + cart + order confirmation
- Author credential: consistent everywhere
- RSS autodiscovery + CDN preconnect: added
- Heading hierarchy: h4→p fix
- Meta-length: 3 pages fixed

---

## PHASE 1: Claude implements now (code changes, no content dependency)

### 1A. Sitemap lastmod differentiation
**Owner:** Claude
**Impact:** Medium SEO (Google trusts lastmod more when it varies)
**File:** `astro.config.mjs` (sitemap serialize option)

Currently all 1,149 URLs get today's date. Fix:
- Blog articles: use `publishDate` from frontmatter
- Product pages: use `updatedAt` from product data
- Brand pages: use most recent product update for that brand
- Static pages: use build date (current behavior, fine)

This requires modifying the `serialize` callback to access page-type context. Astro's sitemap plugin passes the URL — we can infer type from the path pattern (`/blog/` → article date, `/products/` → product date, `/brands/` → brand date).

### 1B. "According to SnusFriend" attribution in top 10 articles
**Owner:** Claude
**Impact:** High GEO (AI systems cite branded statements)
**Files:** 10 blog .astro files

Add 2-3 natural brand attributions per article:
- "According to SnusFriend's testing of 708 products..."
- "SnusFriend's editorial team recommends..."
- "Based on SnusFriend's analysis across 55 brands..."

Target articles (highest traffic potential):
1. `best-nicotine-pouches-2026.astro`
2. `are-nicotine-pouches-safe.astro`
3. `zyn-nicotine-pouches-complete-guide.astro`
4. `strongest-nicotine-pouches-ranked-2026.astro`
5. `how-to-use-nicotine-pouches.astro`
6. `nicotine-pouches-vs-cigarettes.astro`
7. `best-nicotine-pouches-for-beginners-2026.astro`
8. `zyn-flavours-complete-guide.astro`
9. `nicotine-pouch-side-effects.astro`
10. `what-are-nicotine-pouches.astro`

### 1C. Blog upgrade safe bucket integration
**Owner:** Claude
**Impact:** High content quality + internal linking + conversion
**Source files:**
- `cowork/content/blog-upgrade-wave1-quick-answers.md` (non-regulatory ones only)
- `cowork/content/blog-upgrade-wave1-commercial-bridges.md` (all 10)
- `cowork/content/blog-upgrade-wave1-internal-linking.md` (non-regulatory ones only)

**Exclude:** Finland, Norway, Europe legal/tax content (needs legal review first)
**Integration:** Read each upgrade file, apply to the corresponding .astro article

### 1D. dateModified on blog articles
**Owner:** Claude
**Impact:** Medium SEO (signals content freshness)
**Files:** 80 blog .astro files

Currently `dateModified = datePublished`. For articles we actually modified (PAA blocks, citations, schema fixes), update `dateModified` in the JSON-LD to today's date. For untouched articles, leave as-is.

Approach: Use `blog-registry.ts` to track which articles were modified in the April 8-10 sprint, and batch-update their `dateModified`.

### 1E. Apply DB migration
**Owner:** Claude (via Supabase MCP)
**Impact:** Gamification UX (correct tier/mission/badge names in DB)
**File:** `supabase/migrations/20260409200000_gamification_copy_refresh.sql`

Run the migration against production Supabase. This updates reputation_levels, quests, and achievements tables with the new naming.

---

## PHASE 2: Cowork writes content → Claude integrates

### 2A. Brand page expansion (57 pages, scoring 58/100)
**Owner:** Cowork writes → Claude integrates
**Impact:** High SEO (57 thin pages → 57 rich pages)

**Cowork brief:**
```
Write expanded content for the top 20 brand pages on SnusFriend. Each brand needs:

1. Brand overview (200-300 words, always visible, NOT collapsed):
   - Brand history and origin
   - What makes them distinctive
   - Their position in the market (premium, budget, strongest, etc.)
   - Key product lines
   
2. Mini-FAQ (3 questions per brand):
   - "Where can I buy [Brand] nicotine pouches online?"
   - "What flavors does [Brand] offer?"  
   - "What nicotine strengths does [Brand] come in?"
   Answer each in 2-3 sentences using real product data.

3. "Complete Guide" callout text (1 sentence linking to the blog guide if one exists)

Brands (priority order — these have the most search volume):
ZYN, VELO, LOOP, Skruf, Siberia, White Fox, Pablo, Iceberg, Nordic Spirit,
ON!, KILLA, ACE, CUBA, HELWIT, Fumi, Klar, Rave, Denssi, 77 Pouches, Dosh

Tone: expert, factual, not salesy. Reference specific products and strengths.
Format: Markdown with clear headers per brand. Use data from SnusFriend's catalog.
Output file: cowork/content/brand-page-expansions.md
```

**Claude integration:** After Cowork delivers, update `src/pages/brands/[slug].astro` to:
- Make brand description always visible (remove collapse/toggle)
- Add the expanded content section
- Add mini-FAQ with FAQPage JSON-LD per brand
- Add "Read our complete [Brand] guide" link to blog article
- Fix meta descriptions (remove "..." truncation)

### 2B. Rewards page expansion (scoring 55/100)
**Owner:** Cowork writes → Claude integrates
**Impact:** Medium content + conversion

**Cowork brief:**
```
Expand the SnusFriend rewards page (/rewards, now called "The Vault") to 800+ words.

Current state: ~400 words, mostly UI components. Needs editorial content.

Write these sections:

1. "How The Vault Works" (200 words)
   - Step 1: Sign up (free)
   - Step 2: Shop — earn 10 SnusCoins per €1 spent
   - Step 3: Complete Missions for bonus coins
   - Step 4: Redeem for discounts, free shipping, mystery boxes

2. Earning rates table:
   | Action | SnusCoins |
   |--------|-----------|
   | Per €1 spent | 10 |
   | Write a review | 15 |
   | Daily Drop spin | 5-50 |
   | Complete a Mission | 10-75 |
   | Refer a friend | 100 |

3. The Five Circles (tier benefits explained):
   Explorer (0) → Member (100) → Connoisseur (500) → Specialist (2,000) → Founder (5,000)
   One paragraph per tier explaining the perks.

4. FAQ section (5 questions):
   - How do I earn SnusCoins?
   - Do SnusCoins expire?
   - What can I redeem SnusCoins for?
   - How do I check my balance?
   - Can I earn coins on every order?

5. Terms summary (1 paragraph)

Tone: premium club, not childish loyalty program.
Output file: cowork/content/rewards-page-expansion.md
```

### 2C. Blog upgrade legal review bucket
**Owner:** Cowork reviews → Claude integrates
**Impact:** Compliance + content quality

**Cowork brief:**
```
Review the country-specific content in these files for legal accuracy:
- cowork/content/blog-upgrade-wave1-quick-answers.md (Finland, Norway, Europe sections)
- cowork/content/blog-upgrade-wave1-citations.md (Finland, Norway regulatory citations)

Cross-reference against the LIVE article content:
- src/pages/blog/buying-nicotine-pouches-finland-2026.astro (says distance selling prohibited)
- src/pages/blog/buying-nicotine-pouches-norway-2026.astro (says banned retail sale and import)

The quick-answer drafts contradict the live articles on Finland and Norway.
Reconcile the differences and produce corrected versions that match our current
legal position. Flag any claims that need solicitor verification.

Output file: cowork/content/blog-upgrade-legal-review.md
```

---

## PHASE 3: Technical polish (Claude, after Phases 1-2)

### 3A. IndexNow protocol
**Owner:** Claude
**Impact:** Low-medium (faster Bing/Yandex indexing)

Generate a 32-char hex key, create `public/{key}.txt`, and add a build hook that pings IndexNow with changed URLs.

### 3B. Unique OG images per page type
**Owner:** Claude (generate with design system colors)
**Impact:** Low (social sharing quality)

Create template-based OG images for:
- Brand pages: brand name + color accent
- Category pages: category name + product count
- Blog articles: already have custom OG images (low priority)

### 3C. hreflang x-default tags
**Owner:** Claude
**Impact:** Low (future-proofing for i18n)

Add self-referencing hreflang + x-default to `Base.astro`:
```html
<link rel="alternate" hreflang="en" href={`https://snusfriends.com${Astro.url.pathname}`} />
<link rel="alternate" hreflang="x-default" href={`https://snusfriends.com${Astro.url.pathname}`} />
```

### 3D. Medical reviewer byline for YMYL articles
**Owner:** Cowork creates persona → Claude integrates
**Impact:** Medium E-E-A-T (Google QRG specifically looks for medical review on health content)

Need: A "Reviewed by [Medical Professional]" byline on health articles. This requires either a real medical reviewer or a clearly disclosed editorial review process.

---

## Execution Schedule

| Day | Phase | Owner | Work |
|-----|-------|-------|------|
| **Today** | 1A, 1B, 1D, 1E | Claude | Sitemap lastmod, SnusFriend attribution, dateModified, DB migration |
| **Today** | 1C | Claude | Blog upgrade safe bucket (commercial bridges, non-regulatory quick answers) |
| **Today** | Send briefs | Daniel | Send 2A, 2B, 2C briefs to Cowork |
| **Tomorrow** | 2A, 2B | Cowork | Brand page content + rewards page content |
| **Tomorrow** | 2C | Cowork | Legal review of Finland/Norway content |
| **Tomorrow** | 3A, 3C | Claude | IndexNow + hreflang (quick technical) |
| **Day after** | 2A, 2B integration | Claude | Integrate Cowork's brand + rewards content |
| **Day after** | 2C integration | Claude | Integrate corrected legal content |
| **Backlog** | 3B, 3D | Claude + Cowork | OG images, medical reviewer |

## Expected Score Impact

| Category | Current | After Phase 1 | After Phase 2 | After Phase 3 |
|----------|---------|---------------|---------------|---------------|
| Technical SEO | 93 | 95 | 95 | 97 |
| Content E-E-A-T | 78 | 82 | 88 | 90 |
| Schema | 95 | 95 | 97 | 97 |
| AI Search Readiness | 85 | 90 | 93 | 93 |
| Performance | 92 | 92 | 92 | 92 |
