# Launch Polish Sprint — Design Spec

**Date:** 2026-04-08
**Duration:** 7 days (April 8–14)
**Goal:** SEO 80→90+, GEO 74→85+, Visual 6→8+, zero critical bugs

---

## Current State

| Metric | Current | Target |
|--------|---------|--------|
| SEO Score | 80/100 | 90+ |
| GEO Score | 74/100 | 85+ |
| Visual Quality | 6.0/10 | 8+ |
| Blog Articles | 76 | 80+ (new content-gap articles from Cowork) |
| Quick Answer Blocks | 19/76 | 76/76 |
| Medical Disclaimers | 73/76 | 76/76 |
| Author Schema (Person) | 74/76 | 76/76 |
| HowTo Schema | 0/4 | 4/4 |
| AI Citations (10 queries) | 0 | 3+ |
| Lighthouse Accessibility | 83-100 | 95+ |

## Tool Roles

### Claude Code — Implementation & Architecture

Writes code, fixes bugs, integrates content, deploys. The only tool that touches `.astro`, `.tsx`, `.ts`, config files, and edge functions. Runs builds, tests, and Chrome DevTools for visual verification.

### Codex — Audit & Review (never implements)

Runs structured audits using MCPs (GSC, DataForSEO, Lighthouse, Sentry, Chrome DevTools). Produces findings lists with file paths, line numbers, and severity. Reviews Claude Code's work after each phase. Never writes code — only identifies what needs fixing and verifies fixes landed.

**Codex audit briefs go in:** `cowork/content/codex-audit-*.md`

### Cowork — Content & Copy (never touches .astro files)

Writes HTML content, PAA blocks, source citations, article expansions, brand descriptions. Delivers to `cowork/content/`. Claude Code integrates the deliverables into `.astro` pages.

**Cowork briefs go in:** `cowork/content/cowork-*-brief-*.md`

---

## Phase 1: Foundation (Day 1-2)

### Codex Tasks

1. **Lighthouse audit** — Run on 5 pages: `/`, `/nicotine-pouches`, `/blog`, `/brands/zyn`, a product page. Report scores for Performance, Accessibility, SEO, Best Practices.
2. **Blog content audit** — For each of 76 blog articles, check:
   - Has medical disclaimer? (grep for "disclaimer" class or text)
   - Has Quick Answer block? (grep for "Quick Answer" or styled `<details>` blocks)
   - Has source citations? (count `<a>` tags to external authority domains)
   - Author schema type (Person vs Organization)
   - Word count estimate
3. **GSC index coverage** — Use GSC MCP to check how many of our 1,130+ URLs are indexed, which pages have errors, and which are in "Discovered - not indexed" state.
4. **Accessibility scan** — Use Chrome DevTools MCP to check:
   - Form error announcements (CheckoutForm, newsletter signup)
   - Age gate dialog ARIA semantics
   - Color contrast on muted-foreground text
   - Touch target sizes on mobile
   - Keyboard navigation through product grid
5. **Internal linking audit** — Map which blog articles link to each other. Identify orphan articles (linked from blog index only, not from other articles).

### Claude Code Tasks

1. **HowTo schema** — Add JSON-LD HowTo schema to 4 articles:
   - `how-to-use-nicotine-pouches.astro`
   - `how-to-store-nicotine-pouches.astro`
   - `how-to-spot-fake-nicotine-pouches.astro`
   - `how-to-choose-your-strength.astro`

2. **Medical disclaimers** — Add to the ~3 articles still missing them. Standard disclaimer block:
   ```html
   <aside class="disclaimer">
     <strong>Medical Disclaimer:</strong> This article is for informational purposes only
     and does not constitute medical advice. Nicotine is an addictive substance.
     Consult a healthcare professional before using nicotine products.
   </aside>
   ```

3. **Bug fixes (Codex-flagged)**:
   - `RecommendationsIsland.tsx` — Move `useCallback` hooks above early `return null` (Rules-of-Hooks violation)
   - `compare.astro` — Replace `innerHTML` with Astro template expressions for product data
   - `BlogHero` prop naming — Fix `publishDate` → `date` in 2 articles

4. **Accessibility fixes**:
   - `CheckoutForm.tsx` — Add `role="alert" aria-live="assertive"` to error div
   - Age gate — Add `role="dialog" aria-modal="true" aria-label` to age verification modal
   - Newsletter signup — Add `role="alert"` to success/error messages

5. **Paginate /nicotine-pouches** — The page renders all 708 products in a single 657KB HTML response. Implement:
   - Server-side pagination: 48 products per page
   - URL structure: `/nicotine-pouches`, `/nicotine-pouches/2`, `/nicotine-pouches/3`, etc.
   - Preserve existing filter functionality (FilterableProductGrid still hydrates for client-side filtering within the page)
   - Add `<link rel="next/prev">` for SEO
   - Keep current category/strength/flavour filter pages unchanged (they have smaller product sets)

### Cowork Tasks

1. **PAA answer blocks** — Write 2-3 `<details>` Q&A blocks for each of the remaining ~57 articles that don't have them. Target "People Also Ask" queries from GSC data. Format: self-contained HTML blocks with insertion points specified per article. Deliver as `cowork/content/paa-answer-blocks-batch2.md`.

2. **Source citations** — For the top 20 highest-traffic articles (based on GSC impressions), add 3-5 authoritative external citations each. Sources: WHO, PHE, regulatory bodies, peer-reviewed studies, market research. Deliver as `cowork/content/source-citations-top20.md` with article slug + citation HTML.

3. **Author bio expansion** — Write a comprehensive author bio for Erik Lindqvist with:
   - Professional background in nicotine product testing
   - Social media / professional links for `sameAs` schema
   - Author photo description (for future OG image)
   - Deliver as `cowork/content/author-bio-expansion.md`

---

## Phase 2: SEO Push (Day 3-4)

### Codex Tasks

1. **Verify Phase 1 fixes** — Re-run Lighthouse on same 5 pages. Confirm:
   - Accessibility scores improved
   - /nicotine-pouches page size reduced (target: <100KB)
   - HowTo schema validates in Rich Results Test
   - No new errors in Sentry

2. **Keyword gap analysis** — Use DataForSEO MCP:
   - Compare our ranking keywords vs SnusDaddy, Northerner, Haypp
   - Identify high-volume queries where competitors rank and we don't
   - Find queries where we have impressions but rank 10-30 (strike distance)

3. **Title/meta optimization** — Use GSC MCP to find:
   - Pages with high impressions but low CTR (<3%) — these need better title tags
   - Pages with declining position — may need content refresh
   - Deliver as prioritized list with current vs suggested titles

4. **Structured data validation** — Test 10 key pages with Rich Results Test:
   - All 4 HowTo articles
   - Homepage (Organization, WebSite)
   - 3 product pages (Product schema)
   - 2 brand pages (CollectionPage, BreadcrumbList)
   - Blog index (ItemList)

5. **Sitemap audit** — Check:
   - Are lastmod dates present and accurate?
   - Is /auth/confirm excluded?
   - URL count matches expected (~1,150+)
   - Any 404s or redirects in sitemap URLs?

### Claude Code Tasks

1. **PAA block integration** — Bulk-integrate Cowork's PAA answer blocks into all articles. This is a large but mechanical operation: for each article, insert the `<details>` blocks at the specified location.

2. **Source citation integration** — Add external citations from Cowork's deliverable into the top 20 articles.

3. **Sitemap improvements**:
   - Add lastmod dates (use git commit dates or article publish dates)
   - Exclude `/auth/confirm` from sitemap config
   - Verify URL count after changes

4. **IndexNow** — Implement IndexNow protocol for Bing/Yandex:
   - Generate API key, host at `/{key}.txt`
   - Add IndexNow ping to deploy script
   - Ping on sitemap changes

5. **CSP header** — Add Content-Security-Policy header via Vercel config. Start with report-only mode to avoid breaking anything.

6. **Brand mention embedding** — For each blog article, ensure "SnusFriend" appears in at least one citable passage (a complete, quotable sentence that AI systems can extract). Target sentences like: "According to SnusFriend's testing of 700+ products, [specific finding]."

7. **Article quality pass** — All 11 planned articles are live. Review them for missing Quick Answer blocks, medical disclaimers, and PAA blocks. Add any that are missing.

### Cowork Tasks

1. **Content gap articles** — All 11 planned articles (5 country guides + 6 comparisons) are already published. Instead, Cowork should write NEW articles targeting content gaps identified by Codex's keyword analysis. Candidates from the content strategy:
   - "Can you swallow nicotine pouches" (1.5K/mo search volume — page exists but may need expansion)
   - "Nicotine pouch subscription box" (emerging query)
   - "Best nicotine pouches for [specific occasion]" variants not yet covered
   - Any high-volume gaps found in Codex's DataForSEO keyword gap analysis

2. **Existing article expansions** — For articles Codex identifies as thin or underperforming, write content expansions (additional sections, deeper analysis, updated data). Deliver as `cowork/content/article-expansions-phase2.md`.

3. **Homepage copy variations** — 3 hero headline/subtitle variations for A/B testing. Focus on: value prop (700+ products), trust (EU warehouse, fast shipping), and differentiation (widest selection). Deliver as `cowork/content/homepage-copy-variations.md`.

---

## Phase 3: GEO + Polish (Day 5-6)

### Codex Tasks

1. **GEO re-audit** — Test the same 10 queries from the original GEO audit:
   - "best nicotine pouches 2026"
   - "where to buy nicotine pouches in Europe"
   - "ZYN vs VELO"
   - "nicotine pouch side effects"
   - "strongest nicotine pouches"
   - "are nicotine pouches safe"
   - "nicotine pouch flavour guide"
   - "how to use nicotine pouches"
   - "nicotine pouch ingredients"
   - "best nicotine pouches for beginners"
   
   Check ChatGPT, Perplexity, Google AI Overviews for SnusFriend citations.

2. **Performance audit** — Check:
   - Bundle sizes (lucide-react tree-shaking, framer-motion code splitting)
   - Products JSON loading pattern (is it still a single 666KB fetch?)
   - LCP on mobile for key pages
   - CLS issues (image dimensions, font loading)

3. **Mobile UX review** — Use Chrome DevTools MCP to screenshot and review:
   - Homepage on iPhone 14 viewport
   - Product grid on mobile
   - Blog article reading experience
   - Cookie banner height/overlap
   - Mobile bottom nav interactions
   - Cart drawer on mobile

4. **E-E-A-T review of new content** — Check all 11 new articles for:
   - Medical disclaimers present
   - Author schema correct (Person, not Organization)
   - FAQPage schema validates
   - Quick Answer blocks present
   - Source citations included
   - Internal links to related articles

### Claude Code Tasks

1. **Integrate new content-gap articles** — Convert any new Cowork articles from Phase 2 into `.astro` pages. Add to blog registry, FAQPage schema, medical disclaimers, BlogProductCard components. Also integrate any article expansions into existing pages.

2. **Frontend polish**:
   - Cookie banner: reduce mobile spacer from `h-16` to `h-12`, compact text
   - Theme consistency: audit for hardcoded colors, replace with CSS custom properties
   - Mobile bottom nav: verify z-index layering with cookie banner

3. **Performance fixes**:
   - Lazy-load products.json on filter pages (dynamic import on user interaction)
   - Tree-shake lucide-react (switch to specific icon imports)
   - Code-split framer-motion (dynamic import only on gamification pages)

4. **Update llms.txt** — Add new articles to the llms.txt inventory. Update Last-Updated date.

5. **Author/org schema** — Add `sameAs` links from Cowork's author bio expansion.

6. **Visual polish** — Based on Codex mobile UX findings, fix any issues with:
   - Spacing, alignment, touch targets
   - Image dimensions / CLS
   - Font loading / FOUT

### Cowork Tasks

1. **Structured answer blocks** — For any remaining articles without Quick Answer blocks, write concise 2-sentence answer paragraphs optimized for AI extraction.

2. **Brand page descriptions** — Expand thin brand page descriptions (currently 50-200 words) to 300-500 words with:
   - Brand history and positioning
   - Product range summary
   - Why choose this brand
   - Deliver as `cowork/content/brand-descriptions-expanded.md`

3. **Editorial policy update** — Update the editorial policy page with:
   - Testing methodology details
   - Review process transparency
   - Author credentials
   - Deliver as `cowork/content/editorial-policy-update.md`

---

## Phase 4: Verify + Ship (Day 7)

### Codex Tasks

1. **Full re-audit** — Run the complete audit suite:
   - Lighthouse on 5 key pages (compare vs Day 1 baseline)
   - SEO score recalculation (same methodology as April 7 audit)
   - GEO score recalculation
   - Accessibility score
   - Performance metrics
   - Structured data validation

2. **Regression check**:
   - No new Sentry errors
   - No broken links (internal link audit)
   - No missing pages from sitemap
   - Blog registry matches actual .astro files

3. **Before/after report** — Produce a comparison document showing:
   - Score changes across all metrics
   - What was fixed, what remains
   - Recommendations for next sprint

### Claude Code Tasks

1. **Fix final audit issues** — Address any P0/P1 findings from Codex's final audit.

2. **Deploy to production**:
   ```bash
   git push origin astro-migration-clean
   npx vercel ls | head -5
   echo "y" | npx vercel promote <url>
   ```

3. **Post-deploy verification**:
   - Screenshot key pages via Chrome DevTools
   - Verify sitemap URL count
   - Check Sentry for new errors

4. **Resubmit sitemap** — Use GSC MCP to resubmit sitemap-index.xml.

5. **IndexNow ping** — Notify Bing/Yandex of all changed URLs.

6. **Update CURRENT_PRIORITIES.md** — Mark completed items, add new backlog items.

---

## Success Criteria

| Metric | Baseline | Target | How to Measure |
|--------|----------|--------|----------------|
| SEO Score | 80 | 90+ | Cowork methodology (same as April 7 audit) |
| GEO Score | 74 | 85+ | AI citation test on 10 queries |
| Lighthouse SEO | 100 | 100 | Lighthouse audit |
| Lighthouse Accessibility | 83 | 95+ | Lighthouse audit |
| Lighthouse Performance | LCP <200ms | LCP <200ms | Lighthouse audit |
| Blog articles | 76 | 80+ | File count in src/pages/blog/ |
| Quick Answer coverage | 19/76 | 80/80+ | Grep for "Quick Answer" |
| Medical disclaimer coverage | 73/76 | 80/80+ | Grep for "disclaimer" |
| /nicotine-pouches page size | 657KB | <100KB | curl + wc |
| HowTo schema | 0/4 | 4/4 | Rich Results Test |
| AI citations (10 queries) | 0 | 3+ | Manual test on ChatGPT/Perplexity |
| Critical bugs | 3 | 0 | Codex audit |

---

## Codex Brief Template

When briefing Codex for each phase, use this structure:

```markdown
# Codex Audit Brief — Phase [N]

## Context
[What Claude Code just finished, what to verify]

## Audit Tasks
1. [Specific task with tool/MCP to use]
2. [...]

## Output Format
- File: cowork/content/codex-audit-phase[N].md
- For each finding: severity (P0-P3), file path, line number, description, suggested fix
- Summary table at top with pass/fail per category

## Do NOT
- Implement any fixes
- Modify any files
- Run destructive commands
```

## Cowork Brief Template

When briefing Cowork for each phase, use this structure:

```markdown
# Cowork Content Brief — Phase [N]

## Context
[What's needed, why, how it fits the SEO/GEO strategy]

## Deliverables
1. [Specific deliverable with format, word count, file name]
2. [...]

## Tone & Format
- [Guidelines]

## Deliver to
cowork/content/[filename]

## Do NOT
- Modify .astro files
- Generate images
- Use hardcoded hex colors
```
