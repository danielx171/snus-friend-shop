# Cowork Overnight Brief — April 8, 2026

## Context

snusfriends.com now has 73 blog articles, but the blog index is missing 7 and the RSS feed is missing 16. Several articles are also very thin on prose content. This brief has 3 deliverables — do them in order.

**Do NOT modify .astro files directly.** Deliver all work as markdown/JSON files in `cowork/content/`. Claude Code will integrate.

---

## Deliverable 1: Fix Blog Registry (missing entries)

### Problem

7 articles are missing from the blog index page. 16 are missing from the RSS feed. These articles exist as pages but are invisible from the blog listing and RSS.

### Missing from blog index (7):

1. `all-velo-flavors-ranked-2026`
2. `nicotine-pouch-trends-new-brands-2026`
3. `rave-nicotine-pouches-review`
4. `strongest-snus-brands-compared-beginners-warning`
5. `velo-vs-on-nicotine-pouches`
6. `zyn-strength-chart-every-level-explained`
7. `zyn-vs-nordic-spirit`

### Missing from RSS (16 — includes the 7 above plus 9 more):

8. `are-zyns-bad-for-you`
9. `can-you-swallow-nicotine-pouches`
10. `how-many-nicotine-pouches-a-day`
11. `how-much-do-nicotine-pouches-cost`
12. `how-to-store-nicotine-pouches`
13. `nicotine-pouch-tax-regulations-2026`
14. `nicotine-pouches-vs-cigarettes`
15. `on-nicotine-pouches-complete-guide`
16. `velo-vs-nordic-spirit`

### What to deliver

`cowork/content/missing-blog-entries.json`:

```json
[
  {
    "slug": "all-velo-flavors-ranked-2026",
    "title": "Full article title (read from the .astro file)",
    "excerpt": "1-2 sentence description for the blog card",
    "tag": "One of: Comparison | Brand Spotlight | Buying Guide | Guide | Ranking | Flavour Guide | FAQ | Safety & Health | Country Guide | Data Report",
    "missingFrom": ["blog-index", "rss"]
  }
]
```

For each of the 16 articles:
1. Read the .astro file at `src/pages/blog/{slug}.astro`
2. Extract the title from the frontmatter or BlogHero component
3. Write a fresh 1-2 sentence excerpt (NOT the meta description — write something that works as a card teaser)
4. Assign the correct tag based on content type
5. Note whether it's missing from blog-index, rss, or both

---

## Deliverable 2: Content Expansion for Thin Articles

Several articles have very little prose content — they rely heavily on product cards, tables, and structured data. While the pages aren't truly "thin" (they have substantial HTML), adding more editorial prose will help Google understand and rank them better.

### Articles to expand (write 300-500 words of additional prose for each):

1. **best-nicotine-pouches-for-beginners-2026** — Add an intro section explaining what beginners should look for (strength, format, flavour). Currently jumps straight to product picks.

2. **best-mint-nicotine-pouches-2026** — Add a "Why Mint Dominates" section explaining why 45-60% of all pouch sales are mint. What makes mint work so well with nicotine delivery?

3. **best-berry-nicotine-pouches** — Add a "Berry Flavour Profiles Explained" section. What's the difference between mixed berry, blueberry, raspberry, and açaí in pouch form?

4. **best-citrus-nicotine-pouches** — Add a "Citrus vs Mint" section. When should you choose citrus over mint? What's the nicotine delivery difference?

5. **nicotine-pouches-vs-cigarettes** — Add a "Cost Comparison" section with monthly spend calculations (1 pack/day smoker = €X/month vs pouch user = €Y/month). Real numbers.

6. **nicotine-pouches-vs-snus** — Add a "Legality Difference" section. Snus is banned in the EU (except Sweden). Pouches are legal everywhere. This is the #1 practical difference and it's barely covered.

7. **nicotine-pouch-side-effects** — Add a "When to See a Doctor" section. Specific symptoms that warrant medical attention vs normal adjustment effects.

8. **switching-from-cigarettes-to-nicotine-pouches** — Add a "Week-by-Week Timeline" section. What to expect in week 1, 2, 3, and 4 of the switch.

### Format

`cowork/content/content-expansions.md`:

For each article:
```markdown
## [slug]

### Section title: [heading to add]
### Insert after: [describe where in the article this goes — e.g., "after the intro paragraph", "before the product picks"]

[300-500 words of content]
```

### Tone
- Authoritative but conversational
- Include specific numbers and data where possible
- Cite sources where health claims are made (NHS, Mayo Clinic, etc.)
- Don't repeat information already in the article — read it first

---

## Deliverable 3: Internal Link Suggestions for Under-Linked Pages

The internal linking audit found 15 "under-linked" pages (2-3 inbound links). For each, suggest 3 specific link insertions.

### Pages to fix:

| Page | Current Inbound |
|------|----------------|
| best-nicotine-pouches-for-women | 2 |
| best-nicotine-pouches-no-aftertaste | 2 |
| can-you-swallow-nicotine-pouches | 2 |
| nicotine-pouches-vs-cigarettes | 2 |
| on-nicotine-pouches-complete-guide | 2 |
| strongest-snus-brands-compared-beginners-warning | 2 |
| velo-vs-on-nicotine-pouches | 2 |
| zyn-vs-nordic-spirit | 2 |
| all-velo-flavors-ranked-2026 | 3 |
| iceberg-nicotine-pouches-complete-guide | 3 |
| nicotine-pouch-tax-regulations-2026 | 3 |
| how-to-spot-fake-nicotine-pouches | 0 |
| nicotine-pouch-subscription-guide | 2 |
| nicotine-pouch-trends-new-brands-2026 | 2 |
| rave-nicotine-pouches-review | 0 |

### What to deliver

`cowork/content/internal-link-insertions.md`:

For each page, provide 3 specific link insertions:

```markdown
## [target-slug]

### Link 1
- **From:** [source-slug]
- **Find text:** "[exact sentence or phrase in the source article where the link should go]"
- **Replace with:** "[same text but with the link added]"
- **Why:** [1 sentence explaining the contextual relevance]

### Link 2
...
```

The "Find text" and "Replace with" must be EXACT strings that Claude Code can search-and-replace. Read the actual source articles to find natural insertion points — don't guess.

---

## Priority Order

1. **Deliverable 1** (missing entries) — 30 minutes, unblocks blog discovery immediately
2. **Deliverable 2** (content expansion) — 2-3 hours, improves ranking quality
3. **Deliverable 3** (link insertions) — 1-2 hours, improves internal link equity

## Delivery Notes

- All files go in `cowork/content/`
- Do NOT modify .astro files
- Do NOT generate images
- Read the actual source articles before writing content — don't duplicate what's already there
- Use `hsl(var(--border))`, `hsl(var(--muted))` CSS custom properties if any styling is needed (no hex colors)
