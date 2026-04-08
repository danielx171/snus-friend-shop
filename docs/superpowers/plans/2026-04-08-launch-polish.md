# Launch Polish Sprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring SnusFriend from SEO 80→90+, GEO 74→85+, fix all critical bugs, polish frontend UX — in one week using Claude Code (implementation), Codex (audit), and Cowork (content).

**Architecture:** Parallel streams — Codex audits feed Claude Code's implementation, Cowork writes content in parallel, Claude Code integrates. Four phases over 7 days.

**Tech Stack:** Astro 6, React islands, TypeScript, Tailwind v4, Supabase, Vercel

---

## Verified Baseline (April 8, 2026)

Before planning, I verified the actual state vs audit claims:

| Item | Audit Said | Actual State | Remaining Work |
|------|-----------|--------------|----------------|
| HowTo schema | 0/4 | **4/4 done** | None |
| Author schema (Person) | 55 use Org | **74/76 use Person** | 2 articles |
| Medical disclaimers | 50 missing | **73/76 have them** | 3 articles |
| /auth/confirm in sitemap | Yes | **Already excluded** | None |
| CheckoutForm aria-live | Missing | **Already added** | None |
| publishDate→date prop | Broken | **Already fixed** | None |
| RecommendationsIsland hooks | Violation | **Hooks are above returns** | None |
| Quick Answer blocks | 19/76 | **32/76 have them** | 44 articles |
| products.json | 666KB | **280KB** (improved) | Still optimize |
| OAI-SearchBot in robots.txt | Missing | **Already added** | None |
| llms.txt headers | Missing | **Already added** | None |
| compare.astro XSS | innerHTML | Uses `escapeHtml()` | Low risk, leave |

**Real remaining work is much smaller than the audit suggested.** Focus areas:
1. Add medical disclaimers to 3 articles
2. Add Quick Answer/PAA blocks to 44 articles
3. Optimize products.json (280KB → target <150KB)
4. Cookie banner mobile polish
5. Brand mentions + source citations for GEO
6. Content expansions for thin articles

---

## Phase 1: Foundation (Day 1-2)

### Task 1: Codex Audit Brief — Phase 1

**Files:**
- Create: `cowork/content/codex-audit-phase1.md`

- [ ] **Step 1: Write the Codex brief**

```markdown
# Codex Audit Brief — Phase 1: Baseline

## Context
We're starting a 7-day polish sprint. This audit establishes the baseline and identifies
everything that needs fixing. Claude Code will implement fixes based on your findings.

## Audit Tasks

### 1. Lighthouse Audit (5 pages)
Run Lighthouse on each page and report Performance, Accessibility, SEO, Best Practices scores:
- https://snusfriends.com/
- https://snusfriends.com/nicotine-pouches
- https://snusfriends.com/blog
- https://snusfriends.com/brands/zyn
- https://snusfriends.com/products/zyn-cool-mint-s2 (or any product page)

### 2. GSC Index Coverage
Use GSC MCP to check:
- Total indexed pages vs submitted pages
- Pages in "Discovered - not indexed" state
- Pages with crawl errors
- Top queries by impressions (last 28 days)
- Pages with high impressions but CTR < 3% (title tag optimization targets)

### 3. Blog Quality Scan
For ALL 76 blog articles in src/pages/blog/:
- Count articles WITH Quick Answer blocks (grep for `<details` with styled summary)
- Count articles WITHOUT medical disclaimers (3 known: can-you-swallow, klar-vs-fumi-2026, nicotine-pouch-side-effects)
- Identify any articles with Organization author schema instead of Person
- Identify articles with < 800 words (thin content)
- Check which articles have 0 internal links to other blog posts

### 4. Accessibility Scan
Check these specific components for WCAG 2.1 AA compliance:
- Age gate modal: Does it have role="dialog", aria-modal="true", aria-label?
- Newsletter signup forms: Do success/error messages have role="alert"?
- Product grid: Can it be navigated by keyboard?
- Mobile bottom nav: Are touch targets >= 44px?
- Color contrast: Check muted-foreground text on card backgrounds

### 5. Performance Check
- What is the size of /data/products.json? (currently 280KB)
- Are lucide-react icons tree-shaken or is the full bundle loaded?
- Is framer-motion loaded on pages that don't use it?
- Check for CLS issues (images without dimensions, font loading)

## Output Format
File: cowork/content/codex-audit-phase1.md
For each finding: severity (P0-P3), file path, line number, description
Summary table at top with pass/fail per category

## Do NOT
- Implement any fixes
- Modify any files
- Run destructive commands
```

- [ ] **Step 2: Save the brief**

Save to `cowork/content/codex-audit-phase1.md` and send to Codex.

---

### Task 2: Cowork Brief — PAA Blocks Batch 2

**Files:**
- Create: `cowork/content/cowork-paa-brief-phase1.md`

- [ ] **Step 1: Identify articles needing PAA blocks**

Run this to get the list of 44 articles missing Quick Answer blocks:

```bash
for f in src/pages/blog/*.astro; do
  [ "$(basename "$f")" = "index.astro" ] && continue
  slug=$(basename "$f" .astro)
  if ! grep -qi "quick answer\|What is the\|<details.*summary.*font-weight" "$f" 2>/dev/null; then
    echo "$slug"
  fi
done
```

- [ ] **Step 2: Write and save the Cowork brief**

Brief should request 2-3 `<details>` PAA blocks per article, targeting Google "People Also Ask" queries. Format matches the existing `cowork/content/paa-answer-blocks.md` structure. Each block needs:
- Article slug
- Insert location (after which section heading)
- Self-contained HTML `<details>` block with `hsl(var(--muted))` background
- Questions from real PAA boxes for that topic

Save to `cowork/content/cowork-paa-brief-phase1.md`.

---

### Task 3: Add Medical Disclaimers to 3 Articles

**Files:**
- Modify: `src/pages/blog/can-you-swallow-nicotine-pouches.astro`
- Modify: `src/pages/blog/klar-vs-fumi-2026.astro`
- Modify: `src/pages/blog/nicotine-pouch-side-effects.astro`

- [ ] **Step 1: Read each article to find the closing `</article>` tag location**

- [ ] **Step 2: Add disclaimer to `can-you-swallow-nicotine-pouches.astro`**

Insert before the closing `</article>` tag:

```html
<div style="margin-top: 48px; padding: 20px; border-radius: 12px; background: hsl(var(--muted)); border: 1px solid hsl(var(--border));">
  <p style="margin: 0; font-size: 0.85rem; color: hsl(var(--muted-foreground));">
    <strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute medical advice. Nicotine is an addictive substance. If you have health concerns about nicotine use, consult a qualified healthcare professional.
  </p>
</div>
```

- [ ] **Step 3: Add same disclaimer to `klar-vs-fumi-2026.astro`**

- [ ] **Step 4: Add same disclaimer to `nicotine-pouch-side-effects.astro`**

- [ ] **Step 5: Verify all 76 articles now have disclaimers**

```bash
for f in src/pages/blog/*.astro; do
  [ "$(basename "$f")" = "index.astro" ] && continue
  slug=$(basename "$f" .astro)
  if ! grep -qi "disclaimer.*informational\|medical disclaimer" "$f"; then
    echo "STILL MISSING: $slug"
  fi
done
# Expected: no output
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/blog/can-you-swallow-nicotine-pouches.astro \
        src/pages/blog/klar-vs-fumi-2026.astro \
        src/pages/blog/nicotine-pouch-side-effects.astro
git commit -m "fix: add medical disclaimers to 3 remaining blog articles"
```

---

### Task 4: Fix Author Schema on Remaining Articles

**Files:**
- Scan all 76 blog `.astro` files

- [ ] **Step 1: Find articles using Organization author**

```bash
for f in src/pages/blog/*.astro; do
  [ "$(basename "$f")" = "index.astro" ] && continue
  slug=$(basename "$f" .astro)
  if ! grep -q '"@type": "Person"' "$f" && ! grep -q '"@type":"Person"' "$f"; then
    echo "ORG AUTHOR: $slug"
  fi
done
```

- [ ] **Step 2: Fix each article**

For any articles found, replace the author object in the BlogPosting JSON-LD from:
```json
"author": { "@type": "Organization", "name": "SnusFriend" }
```
to:
```json
"author": { "@type": "Person", "name": "Erik Lindqvist", "url": "https://snusfriends.com/authors/erik-lindqvist" }
```

- [ ] **Step 3: Verify**

Re-run the scan from Step 1. Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/
git commit -m "fix: switch remaining blog articles from Organization to Person author schema"
```

---

### Task 5: Cookie Banner Mobile Polish

**Files:**
- Modify: `src/components/react/CookieConsentBanner.tsx`

- [ ] **Step 1: Read the current banner component**

Read `src/components/react/CookieConsentBanner.tsx` fully.

- [ ] **Step 2: Reduce spacer height**

Change line 49:
```tsx
// Before:
<div className="h-16 sm:h-14" />
// After:
<div className="h-12 sm:h-10" />
```

- [ ] **Step 3: Make banner more compact on mobile**

Update the banner container (line 50) to use smaller padding on mobile:
```tsx
// Before:
<div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card p-4 shadow-lg">
// After:
<div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card p-3 sm:p-4 shadow-lg">
```

- [ ] **Step 4: Compact the text on mobile**

Make the description text smaller on mobile:
```tsx
// Find the description paragraph and add text-xs sm:text-sm
```

- [ ] **Step 5: Test locally**

```bash
bun run dev
```

Open http://localhost:8080 and inspect mobile viewport (375px width). Verify:
- Banner doesn't overlap content excessively
- Buttons are still tappable (>= 44px touch targets)
- Text is readable

- [ ] **Step 6: Commit**

```bash
git add src/components/react/CookieConsentBanner.tsx
git commit -m "fix: compact cookie consent banner on mobile"
```

---

### Task 6: Accessibility — Age Gate ARIA

**Files:**
- Find the age gate component (likely in `src/components/` or inline in a layout)

- [ ] **Step 1: Find the age gate component**

```bash
grep -r "age.*gate\|age.*verif\|ageGate\|age-gate" src/components/ src/layouts/ --include="*.astro" --include="*.tsx" -l
```

- [ ] **Step 2: Read the component**

- [ ] **Step 3: Add ARIA attributes**

Add to the modal container:
```
role="dialog"
aria-modal="true"
aria-label="Age verification"
```

Ensure focus is trapped within the dialog when open.

- [ ] **Step 4: Commit**

```bash
git commit -m "fix: add ARIA dialog semantics to age gate modal"
```

---

### Task 7: Add HowTo Schema to `how-to-choose-your-strength.astro`

**Files:**
- Modify: `src/pages/blog/how-to-choose-your-strength.astro`

Note: This article already has HowTo schema (verified at line 244). **SKIP this task — already done.**

---

## Phase 2: SEO Push (Day 3-4)

### Task 8: Integrate PAA Blocks from Cowork

**Files:**
- Modify: 44 blog `.astro` files (those missing Quick Answer blocks)

- [ ] **Step 1: Read Cowork's PAA deliverable**

Read `cowork/content/paa-answer-blocks-batch2.md` (delivered by Cowork from Phase 1 brief).

- [ ] **Step 2: For each article, insert the PAA blocks**

Follow Cowork's insertion instructions. Each block is a self-contained `<details>` HTML snippet to be inserted at a specific location in the article.

Pattern for insertion — find the specified heading, then add the `<details>` blocks after that section:

```html
<!-- PAA blocks inserted after [section name] -->
<details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
  <summary style="font-weight: 600; cursor: pointer;">[Question]</summary>
  <p style="margin-top: 12px;">[Answer with internal links]</p>
</details>
```

- [ ] **Step 3: Verify count**

```bash
for f in src/pages/blog/*.astro; do
  [ "$(basename "$f")" = "index.astro" ] && continue
  slug=$(basename "$f" .astro)
  if grep -qi "quick answer\|<details.*summary.*font-weight\|<details.*padding.*background" "$f" 2>/dev/null; then
    echo "HAS QA: $slug"
  fi
done | wc -l
# Expected: 76 (all articles)
```

- [ ] **Step 4: Build check**

```bash
bun run build
# Expected: no errors
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add PAA answer blocks to 44 blog articles for featured snippets"
```

---

### Task 9: Brand Mention Embedding for GEO

**Files:**
- Modify: ~20 top-traffic blog `.astro` files

- [ ] **Step 1: Identify top articles by GSC impressions**

Use Codex's Phase 1 audit to get the top 20 articles by impressions. If not available, use these known high-traffic articles:
- strongest-nicotine-pouches-ranked-2026
- best-nicotine-pouches-2026
- zyn-flavours-complete-guide
- how-to-use-nicotine-pouches
- best-nicotine-pouches-for-beginners-2026
- are-nicotine-pouches-safe
- nicotine-pouches-vs-cigarettes
- what-are-nicotine-pouches
- nicotine-pouch-side-effects
- how-to-choose-your-strength

- [ ] **Step 2: For each article, add a citable brand passage**

Find the article's main conclusion or summary section. Add or modify one sentence to include "SnusFriend" in a naturally citable way. Examples:

```
"Based on SnusFriend's analysis of over 700 products across 35 brands, [specific finding]."
"SnusFriend's product database shows that [data-backed claim]."
"According to SnusFriend's testing methodology, [specific observation]."
```

The sentence must be:
- Factual and quotable by AI systems
- Natural (not forced)
- In a paragraph that could stand alone as a citation

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: embed SnusFriend brand mentions in top articles for AI citability"
```

---

### Task 10: Sitemap Lastmod Dates

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Read the astro sitemap integration docs**

Check if `@astrojs/sitemap` supports a `serialize` option to add lastmod.

- [ ] **Step 2: Add lastmod to sitemap**

In `astro.config.mjs`, update the sitemap integration:

```javascript
sitemap({
  filter: (page) => {
    // ... existing filter
  },
  serialize: (item) => {
    // Use build date as lastmod for all pages
    item.lastmod = new Date().toISOString().split('T')[0];
    return item;
  },
}),
```

- [ ] **Step 3: Build and verify**

```bash
bun run build
# Check the generated sitemap for lastmod entries
```

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: add lastmod dates to sitemap entries"
```

---

### Task 11: IndexNow for Bing/Yandex

**Files:**
- Create: `public/IndexNow-key.txt` (the key file)
- Create: `src/pages/indexnow.ts` (or API route for submissions)

- [ ] **Step 1: Generate an IndexNow API key**

Generate a UUID-format key for IndexNow.

- [ ] **Step 2: Create the key verification file**

```bash
echo "YOUR-KEY-HERE" > public/YOUR-KEY-HERE.txt
```

- [ ] **Step 3: Create a simple IndexNow submission script**

Create a bash script at `scripts/indexnow-ping.sh` that POSTs changed URLs to the IndexNow API:

```bash
#!/bin/bash
KEY="YOUR-KEY-HERE"
HOST="snusfriends.com"
curl -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"$HOST\",
    \"key\": \"$KEY\",
    \"urlList\": [
      \"https://$HOST/\",
      \"https://$HOST/blog\",
      \"https://$HOST/nicotine-pouches\"
    ]
  }"
```

- [ ] **Step 4: Commit**

```bash
git add public/ scripts/indexnow-ping.sh
git commit -m "feat: add IndexNow protocol for Bing/Yandex faster indexing"
```

---

### Task 12: CSP Header (Report-Only)

**Files:**
- Modify: `vercel.json` (or create if not exists)

- [ ] **Step 1: Check if vercel.json exists**

```bash
cat vercel.json 2>/dev/null || echo "No vercel.json"
```

- [ ] **Step 2: Add CSP header in report-only mode**

Add to vercel.json headers section:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy-Report-Only",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com https://*.sentry.io https://*.google-analytics.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://*.posthog.com https://*.sentry.io https://*.google-analytics.com; font-src 'self' data:; frame-src 'none'"
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat: add Content-Security-Policy-Report-Only header"
```

---

### Task 13: Codex Audit Brief — Phase 2

**Files:**
- Create: `cowork/content/codex-audit-phase2.md`

- [ ] **Step 1: Write the Codex brief**

```markdown
# Codex Audit Brief — Phase 2: SEO Verification + Keyword Gaps

## Context
Phase 1 fixes have been implemented: 3 medical disclaimers added, author schema fixed,
cookie banner compacted, age gate ARIA added. Verify these fixes and run keyword analysis.

## Audit Tasks

### 1. Verify Phase 1 Fixes
- Re-run Lighthouse on the same 5 pages. Compare scores vs Phase 1 baseline.
- Check that all 76 blog articles now have medical disclaimers
- Confirm /nicotine-pouches loads FilterableProductGrid correctly

### 2. Keyword Gap Analysis (DataForSEO MCP)
- Pull ranking keywords for snusfriends.com
- Pull ranking keywords for snusdaddy.com, northerner.com, haypp.com
- Identify queries where competitors rank top 10 and we don't appear
- Identify queries where we have impressions but rank 10-30 (strike distance)
- Focus on transactional intent queries (buy, order, best, review, vs)

### 3. Title Tag Optimization
From GSC data, find pages with:
- Impressions > 50/week but CTR < 3% — these need better titles
- Suggest improved title tags (max 60 chars) for each

### 4. Structured Data Validation
Use Google Rich Results Test (or manual review) on:
- 4 HowTo articles (verify schema is valid)
- Homepage (Organization + WebSite schema)
- 2 product pages (Product schema)
- Blog index (ItemList schema)
- Report any validation errors

### 5. Internal Linking Analysis
- Map which blog articles link to other blog articles
- Identify orphan articles (only linked from /blog index, nowhere else)
- Suggest 3-5 internal link additions for each orphan article
- Check for broken internal links

## Output Format
File: cowork/content/codex-audit-phase2.md

## Do NOT
- Implement any fixes
- Modify any files
```

- [ ] **Step 2: Save and send to Codex**

---

### Task 14: Cowork Brief — Source Citations + Author Bio

**Files:**
- Create: `cowork/content/cowork-citations-brief.md`

- [ ] **Step 1: Write the brief**

Request:
1. Source citations for top 20 articles (3-5 authoritative links each: WHO, PHE, regulatory bodies, peer-reviewed studies, market research)
2. Author bio for Erik Lindqvist (professional background, social links, credentials)
3. Brand page description expansions for the 5 thinnest brand pages

Deliver as:
- `cowork/content/source-citations-top20.md`
- `cowork/content/author-bio-expansion.md`
- `cowork/content/brand-descriptions-expanded.md`

---

## Phase 3: GEO + Polish (Day 5-6)

### Task 15: Integrate Source Citations

**Files:**
- Modify: ~20 blog `.astro` files

- [ ] **Step 1: Read Cowork's citation deliverable**

Read `cowork/content/source-citations-top20.md`.

- [ ] **Step 2: For each article, add citations**

Insert citation links at the relevant claims in each article. Format:

```html
<a href="https://source-url.org/study" target="_blank" rel="noopener noreferrer">Source Name (Year)</a>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add authoritative source citations to top 20 articles"
```

---

### Task 16: Author Schema sameAs Links

**Files:**
- Modify: All blog `.astro` files (bulk find-replace)

- [ ] **Step 1: Read Cowork's author bio**

Read `cowork/content/author-bio-expansion.md` for sameAs URLs.

- [ ] **Step 2: Update author schema across all articles**

Find-replace the author object in BlogPosting JSON-LD across all articles:

```json
// Before:
"author": { "@type": "Person", "name": "Erik Lindqvist", "url": "https://snusfriends.com/authors/erik-lindqvist" }

// After:
"author": { "@type": "Person", "name": "Erik Lindqvist", "url": "https://snusfriends.com/authors/erik-lindqvist", "sameAs": ["https://linkedin.com/in/erik-lindqvist", "https://twitter.com/eriklindqvist"] }
```

(Use actual URLs from Cowork's deliverable)

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add sameAs links to author schema for E-E-A-T"
```

---

### Task 17: Products JSON Optimization

**Files:**
- Modify: `src/lib/product-json.ts` (or wherever products.json is generated)

- [ ] **Step 1: Find where products.json is generated**

```bash
grep -r "products.json" src/ --include="*.ts" --include="*.mjs" -l
```

- [ ] **Step 2: Read the generator**

- [ ] **Step 3: Optimize the JSON payload**

Strip fields not needed by the client-side filter:
- Remove long descriptions (keep only short excerpt)
- Remove full image URLs if thumbnails are available
- Remove any metadata not used by FilterableProductGrid

Target: 280KB → <150KB

- [ ] **Step 4: Build and verify**

```bash
bun run build
ls -la public/data/products.json
# Verify FilterableProductGrid still works
```

- [ ] **Step 5: Commit**

```bash
git commit -m "perf: trim products.json payload for faster filter page loads"
```

---

### Task 18: Update llms.txt

**Files:**
- Modify: `public/llms.txt`

- [ ] **Step 1: Read current llms.txt**

- [ ] **Step 2: Update with latest article inventory**

Add any new blog articles to the article listing section. Update the `Last-Updated` header to today's date.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt
git commit -m "docs: update llms.txt with latest article inventory"
```

---

### Task 19: Internal Link Additions

**Files:**
- Modify: Blog `.astro` files identified as orphans by Codex Phase 2 audit

- [ ] **Step 1: Read Codex's internal linking findings**

Read `cowork/content/codex-audit-phase2.md` for the orphan article list and suggested links.

- [ ] **Step 2: Add internal links**

For each orphan article, add 3-5 contextual links to related articles within the body text. Also add a "Related Reading" section at the bottom if not present:

```html
<h2>Related Reading</h2>
<ul>
  <li><a href="/blog/related-article-slug">Related Article Title</a></li>
</ul>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: improve internal linking across blog articles"
```

---

### Task 20: Title Tag Optimization

**Files:**
- Modify: Blog `.astro` files identified by Codex as low-CTR

- [ ] **Step 1: Read Codex's title tag recommendations**

From `cowork/content/codex-audit-phase2.md`, get the list of pages with high impressions but low CTR.

- [ ] **Step 2: Update title tags**

For each page, update the `<Shop title="...">` prop with the improved title. Keep under 60 characters. Make titles more compelling with numbers, power words, or brackets.

Example patterns:
- "ZYN Flavours Guide" → "All 25+ ZYN Flavours Ranked [2026 Guide]"
- "Nicotine Pouch Guide" → "Nicotine Pouches: Complete Beginner's Guide (2026)"

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "seo: optimize title tags for higher CTR on top impression pages"
```

---

### Task 21: Codex Audit Brief — Phase 3

**Files:**
- Create: `cowork/content/codex-audit-phase3.md`

- [ ] **Step 1: Write the brief**

```markdown
# Codex Audit Brief — Phase 3: GEO + Visual Polish

## Context
PAA blocks added to all articles, brand mentions embedded, source citations added,
products.json optimized, internal links improved. Now verify GEO and check visual quality.

## Audit Tasks

### 1. GEO Re-Audit
Test the same 10 queries for AI citations:
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

Check ChatGPT, Perplexity, and Google AI Overviews for SnusFriend citations.

### 2. Mobile UX Review
Use Chrome DevTools MCP to screenshot and review on iPhone 14 viewport (390x844):
- Homepage
- /nicotine-pouches product grid
- A blog article
- Cookie consent banner
- Cart drawer
- Mobile bottom navigation
Report any spacing, alignment, or touch target issues.

### 3. Performance Re-Check
- Re-run Lighthouse on same 5 pages
- Check products.json size (should be < 150KB now)
- Check for any new CLS issues

### 4. E-E-A-T Signal Check
- Verify author sameAs links are in schema
- Verify source citations are present in top 20 articles
- Check brand mention density in top articles
- Verify editorial policy page exists and is linked

## Output Format
File: cowork/content/codex-audit-phase3.md

## Do NOT
- Implement any fixes
- Modify any files
```

---

## Phase 4: Verify + Ship (Day 7)

### Task 22: Fix Phase 3 Findings

**Files:** Depends on Codex Phase 3 audit findings

- [ ] **Step 1: Read Codex's Phase 3 audit**

Read `cowork/content/codex-audit-phase3.md`.

- [ ] **Step 2: Fix any P0/P1 issues**

Address critical and high-severity findings first.

- [ ] **Step 3: Commit fixes**

```bash
git commit -m "fix: address Phase 3 audit findings"
```

---

### Task 23: Deploy to Production

- [ ] **Step 1: Build check**

```bash
bun run build
# Must succeed with no errors
```

- [ ] **Step 2: Push and deploy**

```bash
git push origin astro-migration-clean
```

- [ ] **Step 3: Wait for Vercel preview build**

```bash
npx vercel ls | head -5
```

- [ ] **Step 4: Promote to production**

```bash
echo "y" | npx vercel promote <preview-url>
```

- [ ] **Step 5: Verify live site**

Use Chrome DevTools MCP to screenshot:
- Homepage
- /blog
- /nicotine-pouches
- A product page

Check Sentry for any new errors.

---

### Task 24: Post-Deploy Actions

- [ ] **Step 1: Resubmit sitemap to GSC**

Use GSC MCP:
```
submit_sitemap(site_url="sc-domain:snusfriends.com", sitemap_url="https://snusfriends.com/sitemap-index.xml")
```

- [ ] **Step 2: Run IndexNow ping**

```bash
bash scripts/indexnow-ping.sh
```

- [ ] **Step 3: Update CURRENT_PRIORITIES.md**

Mark completed items, add any new backlog items from Codex audits.

- [ ] **Step 4: Commit**

```bash
git add CURRENT_PRIORITIES.md
git commit -m "docs: update priorities after launch polish sprint"
```

---

### Task 25: Codex Final Audit Brief

**Files:**
- Create: `cowork/content/codex-audit-final.md`

- [ ] **Step 1: Write the brief**

```markdown
# Codex Final Audit — Sprint Results

## Context
The 7-day launch polish sprint is complete. Run the full audit suite and compare
against the Phase 1 baseline to measure improvement.

## Audit Tasks

### 1. Lighthouse Re-Run (same 5 pages)
Compare vs Phase 1 baseline scores.

### 2. SEO Score Recalculation
Using the same methodology as the April 7 full SEO audit, recalculate scores for:
- Technical SEO
- Content Quality (E-E-A-T)
- On-Page SEO
- Schema / Structured Data
- Performance (CWV)
- AI Search Readiness (GEO)
- Images
- Overall weighted score

### 3. Regression Check
- No new Sentry errors since deploy
- All sitemap URLs return 200
- Blog registry matches .astro file count
- No broken internal links

### 4. Before/After Summary
Produce a comparison table:
| Metric | Before (April 8) | After (April 14) | Change |

## Output Format
File: cowork/content/codex-audit-final.md
```

---

## Cowork Deliverables Summary

| Phase | Deliverable | File |
|-------|------------|------|
| 1 | PAA blocks for 44 articles | `cowork/content/paa-answer-blocks-batch2.md` |
| 2 | Source citations for 20 articles | `cowork/content/source-citations-top20.md` |
| 2 | Author bio expansion | `cowork/content/author-bio-expansion.md` |
| 2 | Brand description expansions | `cowork/content/brand-descriptions-expanded.md` |
| 3 | Content gap articles (from Codex keyword analysis) | `cowork/content/blog-*.html` |
| 3 | Editorial policy update | `cowork/content/editorial-policy-update.md` |

## Codex Audit Schedule

| Phase | Brief | Output |
|-------|-------|--------|
| 1 | Baseline audit | `cowork/content/codex-audit-phase1.md` |
| 2 | SEO verification + keyword gaps | `cowork/content/codex-audit-phase2.md` |
| 3 | GEO + visual polish | `cowork/content/codex-audit-phase3.md` |
| 4 | Final comparison | `cowork/content/codex-audit-final.md` |
