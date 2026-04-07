# Cowork Task Brief — April 8, 2026 (Quick Fixes)

## Context

Codex audited our codebase and found that 7 blog pages are missing from the blog index and 16 are missing from RSS. We need you to verify which articles are missing and provide the metadata for each.

## Task: Verify Blog Registry Completeness

Check every `.astro` file in `src/pages/blog/` (excluding `index.astro`) and verify it appears in both:
1. The `articles` array in `src/pages/blog/index.astro`
2. The `articles` array in `src/pages/rss.xml.ts`

### Deliver as:

`cowork/content/missing-blog-registry-entries.json`:

```json
[
  {
    "slug": "article-slug-here",
    "title": "Full Article Title",
    "excerpt": "1-2 sentence description for blog index card",
    "tag": "Category Tag",
    "missingFrom": ["blog-index", "rss"] 
  }
]
```

**Valid tags:** Comparison, Brand Spotlight, Buying Guide, Guide, Ranking, Flavour Guide, FAQ, Data Report, Safety & Health, Country Guide

### Also check:
- Are there any entries in the blog index that point to non-existent pages? (dead links)
- Are there any entries with `slug` starting with `../` (relative path issues)?
- Do all 11 new articles (6 comparisons + 5 country guides) appear in both registries?

**Priority:** This is blocking SEO — missing articles can't be discovered by users or search engines from the blog listing page.
