# Cowork Audit Brief — April 8, 2026

## Context

snusfriends.com now has 74 blog articles, 30+ brand pages, 10 country pages, and 708 products. We're getting 942 impressions/week from Google but only 2 clicks — our CTR is terrible and we need Cowork's content expertise to fix it.

**Do NOT modify .astro files directly.** Deliver all findings and copy as markdown files in `cowork/content/`. Claude Code will integrate them.

---

## Audit 1: Title Tag & Meta Description Audit (ALL pages)

Crawl every page on snusfriends.com and audit the `<title>` and `<meta name="description">` tags.

### What to check for each page:

1. **Title length** — Is it 50-60 characters? Too short = missed keywords. Too long = truncated in SERP.
2. **Title power** — Does it have a number, bracket, or power word? (e.g., "10 Best...", "(Tested)", "Complete Guide")
3. **Title uniqueness** — Are any titles duplicated across pages?
4. **Meta description length** — 120-155 characters?
5. **Meta description CTA** — Does it include a call to action or value proposition?
6. **Keyword alignment** — Does the title match what users actually search for? (Use your judgment on search intent)

### Deliver as:

`cowork/content/audit-title-meta-tags.json`:

```json
[
  {
    "page": "/blog/best-nicotine-pouches-2026",
    "currentTitle": "Best Nicotine Pouches 2026 | SnusFriend",
    "titleLength": 42,
    "titleIssues": ["no number", "no bracket", "too generic"],
    "suggestedTitle": "10 Best Nicotine Pouches 2026 (708 Products Tested)",
    "currentDescription": "...",
    "descriptionLength": 120,
    "descriptionIssues": ["no CTA", "too vague"],
    "suggestedDescription": "We tested 708 nicotine pouches from 35+ brands. Here are the 10 best for flavour, strength, and value in 2026.",
    "priority": "P0"
  }
]
```

Priority: P0 = page 1 potential (position 1-20), P1 = page 2 potential (20-40), P2 = everything else.

---

## Audit 2: Internal Linking Gaps

Analyze the link structure across blog articles. For each article, identify:

1. **Outbound internal links** — How many links to other snusfriends.com pages? (Should be 5+ per article)
2. **Inbound internal links** — How many other pages link TO this article? (Should be 3+)
3. **Orphan pages** — Pages with 0-1 inbound internal links
4. **Missing contextual links** — Where should a link exist but doesn't? (e.g., ZYN guide should link to ZYN vs VELO comparison)

### Deliver as:

`cowork/content/audit-internal-links.md`:

For each article:
- Current outbound link count
- Current inbound link count (estimate)
- 3-5 specific link suggestions with exact anchor text and target URL
- Priority (orphan pages first)

---

## Audit 3: Content Freshness & Depth Check

Review all 74 blog articles for:

1. **Thin content** — Articles under 800 words that should be longer
2. **Missing sections** — Articles that lack FAQ, comparison tables, or product recommendations
3. **Stale data** — Articles with outdated prices, discontinued products, or old stats
4. **Missing structured data** — Articles without FAQPage or HowTo schema (should be rare — we added FAQ to most)
5. **Missing Key Takeaways** — Articles that would benefit from a summary box at the top

### Deliver as:

`cowork/content/audit-content-freshness.md`:

Table format:
```
| Article | Words | Issues | Suggested Improvements | Priority |
```

---

## Audit 4: Competitor Title Analysis

For these 10 high-value keywords, Google them and note what the top 3 ranking pages use for their titles and meta descriptions:

1. "best nicotine pouches 2026"
2. "strongest nicotine pouches"
3. "zyn flavours"
4. "zyn vs velo"
5. "nicotine pouches for beginners"
6. "buy nicotine pouches online"
7. "buy nicotine pouches germany"
8. "nicotine pouches austria"
9. "white fox vs siberia"
10. "best mint nicotine pouches"

### Deliver as:

`cowork/content/audit-competitor-titles.md`:

For each keyword:
- Top 3 ranking titles and descriptions
- What they have in common (patterns)
- How our title compares
- Suggested improvements to beat them

---

## Delivery Notes

- **Priority order:** Audit 1 (titles) → Audit 4 (competitor titles) → Audit 2 (links) → Audit 3 (content)
- Audits 1 and 4 together give us the data to rewrite all our titles/descriptions
- **Do NOT generate images.** Text analysis only.
- **Do NOT modify .astro files.** Deliver recommendations as markdown/JSON.
- Use snusfriends.com directly to check current titles/descriptions
