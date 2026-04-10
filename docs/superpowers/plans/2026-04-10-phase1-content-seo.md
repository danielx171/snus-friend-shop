# Phase 1: Content & SEO Sprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise Content E-E-A-T from 78→82 and AI Search Readiness from 85→90 by adding SnusFriend attribution, integrating blog upgrades, fixing dateModified, and differentiating sitemap lastmod.

**Architecture:** All changes are to existing .astro blog articles, the sitemap config, and blog-registry metadata. No new components, no DB changes except applying the existing migration.

**Tech Stack:** Astro 6, JSON-LD, `astro.config.mjs` sitemap serialize, Supabase MCP

---

## File Map

| File | Change |
|------|--------|
| `src/pages/blog/best-nicotine-pouches-2026.astro` | Attribution + dateModified |
| `src/pages/blog/are-nicotine-pouches-safe.astro` | Attribution + dateModified |
| `src/pages/blog/zyn-nicotine-pouches-complete-guide.astro` | Attribution + dateModified |
| `src/pages/blog/strongest-nicotine-pouches-ranked-2026.astro` | Attribution + dateModified |
| `src/pages/blog/how-to-use-nicotine-pouches.astro` | Attribution + dateModified |
| `src/pages/blog/nicotine-pouches-vs-cigarettes.astro` | Attribution + dateModified |
| `src/pages/blog/best-nicotine-pouches-for-beginners-2026.astro` | Attribution + dateModified |
| `src/pages/blog/zyn-flavours-complete-guide.astro` | Attribution + dateModified |
| `src/pages/blog/nicotine-pouch-side-effects.astro` | Attribution + dateModified |
| `src/pages/blog/what-are-nicotine-pouches.astro` | Attribution + dateModified |
| 5-10 additional blog .astro files | Commercial bridges + quick answers from upgrade wave 1 |
| `astro.config.mjs` | Sitemap lastmod using URL-pattern dates |

---

### Task 1: SnusFriend attribution in top 10 articles

**Files:** 10 blog .astro files listed above

For each article, add 2-3 natural "According to SnusFriend" attributions in the article body. These must read naturally — not forced.

- [ ] **Step 1: Add attribution to best-nicotine-pouches-2026.astro**

Read the file. Find the intro paragraph (after BlogHero, inside the prose div). The current text starts with "The nicotine pouch market has exploded..."

Add after that paragraph:

```html
<p>
  Based on SnusFriend's testing of over 700 products across 55 brands, we identified clear winners in seven categories — from best overall to best value. Every recommendation below reflects real hands-on evaluation, not manufacturer marketing.
</p>
```

Also find the "Bottom Line" or conclusion section and add:

```html
According to SnusFriend's editorial team, the single most important factor for new users is starting with the right strength — not chasing a specific brand.
```

Update `dateModified` in the BlogPosting JSON-LD from `"2026-03-28"` to `"2026-04-10"`.

- [ ] **Step 2: Add attribution to are-nicotine-pouches-safe.astro**

Find the section after the Quick Answer block. Add:

```html
<p>
  SnusFriend's editorial position, informed by peer-reviewed research from the Royal College of Physicians and Public Health England, is that nicotine pouches represent a significantly lower-risk alternative to smoking — while acknowledging they are not risk-free.
</p>
```

Find the "What Health Authorities Say" or similar research section and add:

```html
According to SnusFriend's analysis of nine peer-reviewed sources, the consensus among European health authorities is clear: tobacco-free nicotine products carry substantially fewer health risks than combustible cigarettes.
```

Update `dateModified` to `"2026-04-10"`.

- [ ] **Step 3: Add attribution to zyn-nicotine-pouches-complete-guide.astro**

Find the intro paragraph about ZYN being the world's best-selling brand. Add nearby:

```html
<p>
  At SnusFriend, ZYN is our most-purchased brand — and based on our testing across 52 ZYN products, we can confirm why: consistent quality, reliable nicotine delivery, and a flavour range that covers every preference.
</p>
```

Update `dateModified` to `"2026-04-10"`.

- [ ] **Step 4: Add attribution to remaining 7 articles**

Apply the same pattern to each. For each article:
1. Read the file
2. Find the intro paragraph or first main section
3. Add 1-2 natural "SnusFriend" attributions using one of these templates:
   - "According to SnusFriend's testing across {X} products..."
   - "Based on SnusFriend's analysis of {topic}..."
   - "SnusFriend's editorial team recommends..."
4. Update `dateModified` in BlogPosting JSON-LD to `"2026-04-10"`

Articles:
- `strongest-nicotine-pouches-ranked-2026.astro` — "SnusFriend's strength database covers every product above 20mg..."
- `how-to-use-nicotine-pouches.astro` — "According to SnusFriend's beginner guide..."
- `nicotine-pouches-vs-cigarettes.astro` — "SnusFriend's harm reduction coverage, backed by PHE and RCP data..."
- `best-nicotine-pouches-for-beginners-2026.astro` — "Based on SnusFriend's testing of beginner-friendly pouches..."
- `zyn-flavours-complete-guide.astro` — "SnusFriend carries the full ZYN flavour range..."
- `nicotine-pouch-side-effects.astro` — "According to SnusFriend's review of clinical literature..."
- `what-are-nicotine-pouches.astro` — "SnusFriend's editorial team has tested over 700 products..."

- [ ] **Step 5: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/pages/blog/*.astro
git commit -m "feat: add SnusFriend attribution to top 10 articles + update dateModified"
```

---

### Task 2: Blog upgrade — commercial bridges

**Files:** 5-10 blog .astro files (targets from `cowork/content/blog-upgrade-wave1-commercial-bridges.md`)

- [ ] **Step 1: Read the commercial bridges file**

Read `cowork/content/blog-upgrade-wave1-commercial-bridges.md` in full. Identify which articles get bridge sections and where they should be placed.

- [ ] **Step 2: Insert bridges into each target article**

For each article in the commercial bridges file:
1. Read the target .astro file
2. Find the recommended insertion point (typically before FAQ section)
3. Add the bridge HTML section with appropriate heading, copy, and internal links
4. Use the site's prose styling: `[&_h2]:text-foreground [&_h2]:text-2xl` etc.

- [ ] **Step 3: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/pages/blog/*.astro
git commit -m "feat: add commercial bridge sections to 5+ articles"
```

---

### Task 3: Blog upgrade — safe quick answers

**Files:** Blog .astro files targeted in `cowork/content/blog-upgrade-wave1-quick-answers.md`

- [ ] **Step 1: Read the quick answers file**

Read `cowork/content/blog-upgrade-wave1-quick-answers.md` in full. Identify which articles get quick answers. **EXCLUDE any articles about Finland, Norway, or European legal/regulatory content** — those need legal review first.

- [ ] **Step 2: Insert quick answers into safe articles**

For each safe article:
1. Read the target .astro file
2. Check if it already has a Quick Answer block (some do from previous PAA work)
3. If no Quick Answer exists, add one after the BlogHero component using the `<details>` pattern already used across the blog
4. If a Quick Answer already exists, skip (don't duplicate)

- [ ] **Step 3: Build and commit**

```bash
bun run build 2>&1 | tail -5
git add src/pages/blog/*.astro
git commit -m "feat: add quick answer blocks from upgrade wave 1 (safe bucket)"
```

---

### Task 4: Sitemap lastmod differentiation

**File:** `astro.config.mjs` (lines 30-47)

- [ ] **Step 1: Update the serialize callback with URL-pattern-based dates**

The sitemap serialize callback only receives the URL. Use URL patterns to assign sensible dates:
- `/blog/` articles that were modified in the April sprint → `2026-04-10`
- `/blog/` articles from March → `2026-03-28`
- `/products/` → `2026-04-09` (last catalog sync)
- `/brands/` → `2026-04-09`
- Everything else → build date (today)

Replace the current serialize function:

```javascript
serialize: (item) => {
  const url = item.url;
  // Blog articles modified in April sprint
  const aprilModified = [
    'best-nicotine-pouches-2026', 'are-nicotine-pouches-safe',
    'zyn-nicotine-pouches-complete-guide', 'strongest-nicotine-pouches-ranked-2026',
    'how-to-use-nicotine-pouches', 'nicotine-pouches-vs-cigarettes',
    'best-nicotine-pouches-for-beginners-2026', 'zyn-flavours-complete-guide',
    'nicotine-pouch-side-effects', 'what-are-nicotine-pouches',
  ];
  if (url.includes('/blog/')) {
    const slug = url.split('/blog/')[1]?.replace(/\/$/, '');
    item.lastmod = aprilModified.includes(slug) ? '2026-04-10' : '2026-03-28';
  } else if (url.includes('/products/') || url.includes('/brands/')) {
    item.lastmod = '2026-04-09';
  } else {
    item.lastmod = new Date().toISOString().split('T')[0];
  }
  return item;
},
```

- [ ] **Step 2: Build and verify sitemap**

```bash
bun run build 2>&1 | tail -5
# Check sitemap has varied dates
grep 'lastmod' dist/client/sitemap-0.xml | sort -u | head -10
```

Expected: At least 3 different lastmod dates.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: differentiate sitemap lastmod by content type and modification date"
```

---

### Task 5: Apply gamification DB migration

**File:** `supabase/migrations/20260409200000_gamification_copy_refresh.sql`

- [ ] **Step 1: Apply migration via Supabase MCP**

Use the Supabase MCP `execute_sql` tool to run the migration SQL. The migration updates:
- `reputation_levels` table: tier names (Explorer, Member, Connoisseur, Specialist, Founder)
- `quests` table: new mission titles, descriptions, expanded quest_type CHECK
- `achievements` table: new badge titles and descriptions

Read the migration file and execute it via MCP.

- [ ] **Step 2: Verify**

Query the updated tables to confirm:
```sql
SELECT level, name FROM reputation_levels ORDER BY level;
SELECT id, title FROM quests WHERE active = true ORDER BY sort_order;
```

Expected: Explorer/Member/Connoisseur/Specialist/Founder for levels, new mission names for quests.

- [ ] **Step 3: Commit (no code change — migration already in repo)**

Migration file is already committed. No additional commit needed.

---

### Task 6: Final build, push, deploy

- [ ] **Step 1: Full build**

```bash
bun run build 2>&1 | tail -10
```

Expected: 1151+ pages, no errors.

- [ ] **Step 2: Push and deploy**

```bash
git push origin astro-migration-clean
npx vercel deploy --archive=tgz 2>&1 | tail -5
# Wait for preview, then promote
echo "y" | npx vercel promote <preview-url>
```

- [ ] **Step 3: Verify in production**

After deploy:
- Spot-check 3 articles for "According to SnusFriend" text
- Check sitemap.xml has varied lastmod dates
- Check dateModified on a modified article is `2026-04-10`
- Verify DB tiers via membership page (should show Explorer/Member/etc.)
