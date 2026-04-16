# Cowork Content Sprint — April 9, 2026

## Context

GSC data shows our top queries are clustered around ZYN flavours, strongest pouches, and "best 2026" searches. We're ranking but not yet on page 1 for most queries. Cowork's job this sprint: write content that targets the exact queries Google is already sending us impressions for.

**Do NOT modify .astro files.** Deliver HTML content files to `cowork/content/`.

---

## Deliverable 1: Missing "Best-Of" Articles (3 new articles)

These are high-intent queries we're getting impressions for but don't have dedicated pages:

### Article 1: Best Nicotine Pouches for Sensitive Gums (2026)
- **Slug:** `best-nicotine-pouches-sensitive-gums`
- **Target queries:** "nicotine pouches gum irritation", "best pouches for sensitive gums", "gentle nicotine pouches"
- **Word count:** 1,500-2,000
- **Sections:** Why gum irritation happens, pouch material differences, 8 product picks (softer materials, lower pH), prevention tips
- **Product slugs:** helwit-blueberry-medium, zyn-gentle-mint-mini-s1, on-mint, nordic-spirit-spearmint, skruf-fresh-mint-s4

### Article 2: Best Nicotine Pouches Under €2 (2026 Value Guide)
- **Slug:** `best-nicotine-pouches-under-2-euros`
- **Target queries:** "cheap nicotine pouches", "budget snus", "cheapest nicotine pouches online"
- **Word count:** 1,500-2,000
- **Sections:** Price-per-pouch methodology, 10 products under €2/can ranked, bulk discount tips, value vs premium comparison
- **Use real prices from snusfriends.com/nicotine-pouches** — sort by price and pick the cheapest good options

### Article 3: Nicotine Pouches for the Gym & Sports (2026)
- **Slug:** `best-nicotine-pouches-gym-sports`
- **Target queries:** "nicotine pouches gym", "snus for sports", "nicotine pouches workout"
- **Word count:** 1,500-2,000
- **Sections:** How nicotine affects exercise performance (cite studies), format recommendations for active use, 6 product picks, hydration considerations
- **Angle:** Not endorsing, just factual — many athletes use them, here's what to know

## Format for each:

```html
<!--
Meta title: [50-60 chars]
Meta description: [120-155 chars]
Target keywords: [3-5]
Slug: [slug]
-->

[Article HTML content — h2, h3, p, ul, tables]

<!-- PRODUCT_CARDS: ["slug1", "slug2", ...] -->

<script type="application/ld+json">
{ FAQPage schema }
</script>
```

---

## Deliverable 2: "People Also Ask" Content Blocks (10 articles)

Google "People Also Ask" (PAA) boxes appear for almost every nicotine pouch query. We need to add PAA-optimized answer blocks to our top articles. These are 2-3 sentence answers formatted specifically for featured snippets.

For each of these 10 articles, write 3 PAA-style Q&A pairs that Google commonly shows for queries related to that article. Format as `<details><summary>` HTML blocks.

**Articles:**
1. `best-nicotine-pouches-2026` — PAA about: "What is the #1 nicotine pouch?", "Are nicotine pouches FDA approved?", "Which nicotine pouch has the best flavour?"
2. `strongest-nicotine-pouches-ranked-2026` — PAA about: "What is the strongest nicotine pouch in the world?", "Is 50mg nicotine safe?", "What is stronger than ZYN?"
3. `zyn-flavours-complete-guide` — PAA about: "What is the best ZYN flavour?", "How many ZYN flavours are there?", "What is the new ZYN flavour 2026?"
4. `nicotine-pouches-vs-cigarettes` — PAA about: "Are nicotine pouches safer than smoking?", "Can nicotine pouches help you quit?", "How many pouches equal one cigarette?"
5. `how-to-use-nicotine-pouches` — PAA about: "How long should you keep a pouch in?", "Can you swallow the juice?", "Do you chew nicotine pouches?"
6. `what-are-nicotine-pouches` — PAA about: "Are nicotine pouches tobacco?", "Do nicotine pouches stain teeth?", "Are nicotine pouches legal?"
7. `best-nicotine-pouches-for-beginners-2026` — PAA about: "What strength pouch for a beginner?", "How many pouches a day is normal?", "What's the mildest nicotine pouch?"
8. `nicotine-pouches-vs-snus` — PAA about: "Is snus the same as nicotine pouches?", "Why is snus banned in the EU?", "Which is safer, snus or pouches?"
9. `zyn-vs-velo-2026` — PAA about: "Is ZYN or VELO stronger?", "Which has more flavours?", "Are ZYN and VELO the same company?"
10. `are-nicotine-pouches-safe` — PAA about: "Can nicotine pouches cause cancer?", "What are the long-term effects?", "Are nicotine pouches better than vaping?"

### Deliver as:

`cowork/content/paa-answer-blocks.md`:

```markdown
## best-nicotine-pouches-2026

### Insert after: Quick Answer block

<details style="margin-top: 12px; padding: 16px; background: hsl(var(--muted)); border-radius: 8px;">
  <summary style="font-weight: 600; cursor: pointer;">What is the #1 nicotine pouch in 2026?</summary>
  <p style="margin-top: 12px;">[2-3 sentence answer optimized for featured snippet]</p>
</details>

[repeat for each Q&A]
```

---

## Deliverable 3: Homepage Copy Refresh

The homepage hero section needs fresh copy. Current version is functional but generic. Write 3 variations of:

1. **Hero headline** (max 8 words)
2. **Hero subheadline** (max 20 words)
3. **CTA button text** (max 4 words)
4. **Trust bar text** (the strip below the hero — max 15 words)

**Variation A:** Authority-focused ("Europe's largest selection...")
**Variation B:** Value-focused ("Free EU shipping, lowest prices...")
**Variation C:** Community-focused ("Join 10,000+ pouch enthusiasts...")

### Deliver as:
`cowork/content/homepage-copy-variations.md`

---

## Priority Order

1. PAA answer blocks (30 min) — highest SEO impact, targets featured snippets
2. New articles (3-4 hours) — targets untapped queries
3. Homepage copy (30 min) — quick creative task

## Delivery Notes
- All files to `cowork/content/`
- Use `hsl(var(--muted))`, `hsl(var(--primary))` CSS custom properties
- Internal links as relative paths (`/blog/...`, `/brands/...`)
- Verify product slugs on snusfriends.com before including
- No AI-generated images
