# SEO Quick Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture existing search traffic by fixing the blog index (category sections), trailing slash duplicates, low-CTR meta tags, and adding internal links to 11 new articles.

**Architecture:** Blog index gets category sections (static HTML, no JS). Trailing slashes get a catch-all Vercel redirect. Meta tags get rewritten for CTR on top-impression pages. Internal links added contextually to high-authority pages.

**Tech Stack:** Astro 6, vercel.json redirects, GSC MCP for sitemap resubmit

**Spec:** `docs/superpowers/specs/2026-04-07-seo-quickwins-design.md`

---

## Task 1: Blog Index — Add Category Sections

**Files:**
- Modify: `src/pages/blog/index.astro`

The blog index already lists all 73 articles in a flat grid. We need to group them by category with section headings.

- [ ] **Step 1: Read the current blog index and add category grouping**

The `articles` array already has a `tag` field. We need to:
1. Define category display order
2. Group articles by tag
3. Render each group as a section with a heading

Add this after the `tagColors` definition (around line 249) and before the `blogJsonLd`:

```astro
const categoryOrder = [
  'Comparison',
  'Brand Spotlight',
  'Buying Guide',
  'Ranking',
  'Flavour Guide',
  'Guide',
  'Safety & Health',
  'FAQ',
  'Data Report',
];

const categoryDescriptions: Record<string, string> = {
  'Comparison': 'Head-to-head brand comparisons to help you choose.',
  'Brand Spotlight': 'Deep-dive guides into every major pouch brand.',
  'Buying Guide': 'Best-of lists and recommendations for every need.',
  'Ranking': 'Data-driven rankings across categories.',
  'Flavour Guide': 'Explore every flavour category in detail.',
  'Guide': 'Practical how-to guides and reference articles.',
  'Safety & Health': 'Evidence-based health and safety information.',
  'FAQ': 'Quick answers to common questions.',
  'Data Report': 'Live data from our catalog of 708 products.',
};

// Featured articles (top performers by GSC impressions)
const featuredSlugs = [
  'best-nicotine-pouches-2026',
  'strongest-nicotine-pouches-ranked-2026',
  'zyn-flavours-complete-guide',
  'best-nicotine-pouches-for-beginners-2026',
];

const featured = featuredSlugs
  .map(slug => articles.find(a => a.slug === slug))
  .filter(Boolean);

const grouped = categoryOrder.map(cat => ({
  category: cat,
  description: categoryDescriptions[cat] ?? '',
  items: articles.filter(a => a.tag === cat && !featuredSlugs.includes(a.slug)),
})).filter(g => g.items.length > 0);
```

- [ ] **Step 2: Replace the flat grid with featured + category sections**

Replace the rendering section (from the `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">` around line 301 through its closing `</div>` around line 318) with:

```astro
      {/* Featured articles */}
      <h2 class="text-2xl font-bold mb-6">Featured</h2>
      <div class="grid gap-6 sm:grid-cols-2 mb-16">
        {featured.map((article) => (
          <a href={`/blog/${article.slug}`} class="group rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div class="h-1.5 w-full" style={`background: ${tagColors[article.tag] ?? '#2E7D32'};`} />
            <div class="p-6 flex flex-col flex-1">
              <span class="inline-flex self-start items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-3" style={`background: ${tagColors[article.tag] ?? '#2E7D32'}15; color: ${tagColors[article.tag] ?? '#2E7D32'};`}>
                {article.tag}
              </span>
              <h3 class="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">{article.title}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed flex-1">{article.excerpt}</p>
              <div class="mt-4 pt-4 border-t border-border">
                <span class="text-sm font-medium text-primary">Read article &rarr;</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Category sections */}
      {grouped.map((group) => (
        <section class="mb-16">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-foreground">{group.category}</h2>
            <p class="text-sm text-muted-foreground mt-1">{group.description}</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((article) => (
              <a href={`/blog/${article.slug}`} class="group rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div class="h-1 w-full" style={`background: ${tagColors[article.tag] ?? '#2E7D32'};`} />
                <div class="p-5 flex flex-col flex-1">
                  <h3 class="text-base font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors">{article.title}</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">{article.excerpt}</p>
                  <div class="mt-3 pt-3 border-t border-border">
                    <span class="text-xs font-medium text-primary">Read &rarr;</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -10`

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: blog index with category sections and featured articles"
```

---

## Task 2: Trailing Slash Catch-All Redirect

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add catch-all trailing slash redirect**

Add this as the FIRST entry in the `redirects` array in `vercel.json` (before the existing specific redirects):

```json
{
  "source": "/:path((?!api/).+)/",
  "destination": "/:path",
  "permanent": true
}
```

This strips trailing slashes from all URLs except `/api/` paths. Being first in the array means it runs before the specific redirects (which already handle some trailing slash cases).

- [ ] **Step 2: Remove now-redundant trailing slash redirects**

The catch-all makes these existing individual rules redundant. Remove these entries from the `redirects` array:

```json
{ "source": "/blog/zyn-vs-velo/", "destination": "/blog/zyn-vs-velo-2026", "permanent": true },
{ "source": "/blog/strongest-nicotine-pouches/", "destination": "/blog/strongest-nicotine-pouches-ranked-2026", "permanent": true },
{ "source": "/blog/best-nicotine-pouches-for-beginners/", "destination": "/blog/best-nicotine-pouches-for-beginners-2026", "permanent": true }
```

Keep the non-trailing-slash versions (they redirect old slugs to new slugs, which is different from the trailing slash issue).

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "fix: catch-all trailing slash redirect to prevent URL duplication in GSC"
```

---

## Task 3: Meta Title & Description Optimization

**Files:**
- Modify: `src/pages/blog/best-nicotine-pouches-2026.astro`
- Modify: `src/pages/blog/strongest-nicotine-pouches-ranked-2026.astro`
- Modify: `src/pages/blog/zyn-flavours-complete-guide.astro`
- Modify: `src/pages/nicotine-pouches.astro`
- Modify: `src/pages/faq.astro`
- Modify: `src/pages/products/index.astro`

- [ ] **Step 1: Optimize best-nicotine-pouches-2026**

In `src/pages/blog/best-nicotine-pouches-2026.astro`, find the title and description variables in the frontmatter:

Change:
```
const title = 'Best Nicotine Pouches 2026: Expert Picks Across Every Category';
const description = '...';
```

To:
```
const title = '10 Best Nicotine Pouches 2026 (708 Products Tested)';
const description = 'We tested 708 nicotine pouches from 35+ brands. Here are the 10 best for flavour, strength, and value — updated monthly by our editorial team.';
```

Also update the BlogHero title if it uses a different string.

- [ ] **Step 2: Optimize strongest-nicotine-pouches-ranked-2026**

Change title/description to:
```
const title = 'Strongest Nicotine Pouches 2026: 12mg to 50mg Ranked';
const description = 'Every strong nicotine pouch ranked by mg — from White Fox (16mg) to Siberia (49mg). Includes beginner warnings and a step-down guide.';
```

- [ ] **Step 3: Optimize zyn-flavours-complete-guide**

Change title/description to:
```
const title = 'All 15+ ZYN Flavours Ranked (2026 Complete Guide)';
const description = 'Every ZYN flavour ranked by taste, strength, and popularity. Cool Mint, Citrus, Espressino, and more — with prices and where to buy in Europe.';
```

- [ ] **Step 4: Optimize nicotine-pouches.astro**

Find the Shop title prop and change to:
```
title="Buy Nicotine Pouches Online — 708 Products, 35+ Brands"
description="Shop 708 nicotine pouches with free EU shipping over €29. ZYN, VELO, LOOP, Siberia, and more. Filter by strength, flavour, and brand."
```

- [ ] **Step 5: Optimize faq.astro**

Change title/description to:
```
title="Nicotine Pouches FAQ: 30+ Questions Answered (2026)"
description="Everything you need to know about nicotine pouches — safety, strength, flavours, how to use, and where to buy. Expert answers updated for 2026."
```

- [ ] **Step 6: Optimize products/index.astro**

Change title/description to:
```
title="Buy Nicotine Pouches — 708 Products, Free EU Shipping"
description="Browse 708 nicotine pouches from ZYN, VELO, LOOP, Siberia, and 30+ more brands. Free shipping on orders over €29. Same-day dispatch."
```

- [ ] **Step 7: Verify build**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -10`

- [ ] **Step 8: Commit**

```bash
git add src/pages/blog/best-nicotine-pouches-2026.astro src/pages/blog/strongest-nicotine-pouches-ranked-2026.astro src/pages/blog/zyn-flavours-complete-guide.astro src/pages/nicotine-pouches.astro src/pages/faq.astro src/pages/products/index.astro
git commit -m "seo: optimize titles and meta descriptions for top 6 pages by impressions"
```

---

## Task 4: Internal Links to New Articles

**Files:**
- Modify: `src/pages/blog/zyn-nicotine-pouches-complete-guide.astro`
- Modify: `src/pages/blog/velo-nicotine-pouches-complete-guide.astro`
- Modify: `src/pages/blog/white-fox-nicotine-pouches-complete-guide.astro`
- Modify: `src/pages/blog/klar-nicotine-pouches-complete-guide.astro`
- Modify: `src/pages/blog/strongest-nicotine-pouches-ranked-2026.astro`
- Modify: `src/pages/countries/[slug].astro`

- [ ] **Step 1: Add comparison links to ZYN guide**

In `src/pages/blog/zyn-nicotine-pouches-complete-guide.astro`, find the end of the article content (before the FAQ section or closing tags). Add a "Related Comparisons" section:

```html
<h2>How Does ZYN Compare?</h2>
<p>See how ZYN stacks up against the competition in our head-to-head comparisons:</p>
<ul>
  <li><a href="/blog/zyn-vs-velo-2026">ZYN vs VELO: The Definitive 2026 Comparison</a></li>
  <li><a href="/blog/zyn-vs-loop-2026">ZYN vs LOOP: Which Is Better in 2026?</a></li>
  <li><a href="/blog/zyn-vs-skruf-2026">ZYN vs Skruf: Which Is Better in 2026?</a></li>
  <li><a href="/blog/zyn-vs-nordic-spirit">ZYN vs Nordic Spirit</a></li>
</ul>
```

- [ ] **Step 2: Add comparison links to VELO guide**

In `src/pages/blog/velo-nicotine-pouches-complete-guide.astro`, add:

```html
<h2>How Does VELO Compare?</h2>
<p>See how VELO compares to other top brands:</p>
<ul>
  <li><a href="/blog/zyn-vs-velo-2026">ZYN vs VELO: The Definitive 2026 Comparison</a></li>
  <li><a href="/blog/velo-vs-loop-2026">VELO vs LOOP: Which Is Better in 2026?</a></li>
  <li><a href="/blog/velo-vs-nordic-spirit">VELO vs Nordic Spirit</a></li>
  <li><a href="/blog/velo-vs-on-nicotine-pouches">VELO vs ON!</a></li>
</ul>
```

- [ ] **Step 3: Add comparison link to White Fox guide**

In `src/pages/blog/white-fox-nicotine-pouches-complete-guide.astro`, add:

```html
<h2>How Does White Fox Compare?</h2>
<p>Curious how White Fox stacks up against the other ultra-strong brand? Read our detailed comparison:</p>
<ul>
  <li><a href="/blog/white-fox-vs-siberia-2026">White Fox vs Siberia: Strongest Pouches Compared</a></li>
</ul>
```

- [ ] **Step 4: Add comparison link to KLAR guide**

In `src/pages/blog/klar-nicotine-pouches-complete-guide.astro`, add:

```html
<h2>How Does KLAR Compare?</h2>
<p>See how KLAR compares to its closest Scandinavian rival:</p>
<ul>
  <li><a href="/blog/klar-vs-fumi-2026">KLAR vs FUMI: Which Scandinavian Pouch Wins?</a></li>
</ul>
```

- [ ] **Step 5: Add comparison link to strongest-pouches article**

In `src/pages/blog/strongest-nicotine-pouches-ranked-2026.astro`, find a suitable place (near mentions of White Fox or Siberia) and add:

```html
<p>Want to see these two ultra-strong brands compared head-to-head? Read our <a href="/blog/white-fox-vs-siberia-2026">White Fox vs Siberia comparison</a>.</p>
```

- [ ] **Step 6: Add country buying guide links to country pages**

In `src/pages/countries/[slug].astro`, find where the country content is rendered. After the FAQ section or at the bottom, add a conditional link to the buying guide:

```astro
{['austria', 'denmark', 'norway', 'finland', 'poland'].includes(country.slug) && (
  <div class="mt-8 p-6 rounded-xl border border-border bg-card/60">
    <h3 class="text-lg font-semibold mb-2">Read the Full Buying Guide</h3>
    <p class="text-sm text-muted-foreground mb-4">
      Get detailed advice on regulations, pricing, popular brands, and how to order to {country.name}.
    </p>
    <a href={`/blog/buying-nicotine-pouches-${country.slug}-2026`} class="text-sm font-medium text-primary hover:underline">
      Read: Buying Nicotine Pouches in {country.name} →
    </a>
  </div>
)}
```

- [ ] **Step 7: Verify build**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -10`

- [ ] **Step 8: Commit**

```bash
git add src/pages/blog/zyn-nicotine-pouches-complete-guide.astro src/pages/blog/velo-nicotine-pouches-complete-guide.astro src/pages/blog/white-fox-nicotine-pouches-complete-guide.astro src/pages/blog/klar-nicotine-pouches-complete-guide.astro src/pages/blog/strongest-nicotine-pouches-ranked-2026.astro src/pages/countries/\[slug\].astro
git commit -m "seo: add internal links from brand guides and country pages to new articles"
```

---

## Task 5: Sitemap Resubmit

**Files:** None (API call only)

- [ ] **Step 1: Resubmit sitemap via GSC MCP**

After deploy, use the GSC MCP tool:
```
mcp__gsc__submit_sitemap(site_url="sc-domain:snusfriends.com", sitemap_url="https://snusfriends.com/sitemap-index.xml")
```

- [ ] **Step 2: Verify new URL count**

Use GSC MCP:
```
mcp__gsc__list_sitemaps_enhanced(site_url="sc-domain:snusfriends.com")
```

Expected: URL count should increase from 1,127 to ~1,140+

---

## Task 6: Update Blog Index Article Entries for New Pages

**Files:**
- Modify: `src/pages/blog/index.astro`

The blog index `articles` array was already updated with the 11 new articles in our earlier commit. Verify they're present:

- [ ] **Step 1: Verify all 11 new articles are in the array**

Grep for the new slugs:
```bash
grep -c "zyn-vs-loop-2026\|zyn-vs-skruf-2026\|velo-vs-loop-2026\|white-fox-vs-siberia-2026\|klar-vs-fumi-2026\|best-nicotine-pouches-by-occasion\|buying-nicotine-pouches-austria\|buying-nicotine-pouches-denmark\|buying-nicotine-pouches-norway\|buying-nicotine-pouches-finland\|buying-nicotine-pouches-poland" src/pages/blog/index.astro
```

Expected: 11 matches. If any are missing, add them to the `articles` array with appropriate `tag`, `title`, `excerpt`, and `slug`.

- [ ] **Step 2: Commit if changes were needed**

```bash
git add src/pages/blog/index.astro
git commit -m "chore: verify all 11 new articles in blog index"
```
