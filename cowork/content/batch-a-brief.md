# Cowork Batch A Brief: Brand Stories + OG Images + FAQ Schema

## Overview

snusfriends.com is a headless e-commerce site for nicotine pouches. All traffic is organic (Google Ads bans nicotine). We need three deliverables to close our biggest content gaps.

---

## Deliverable 1: Brand Page Descriptions (30 brands)

For each brand below, write a **150-300 word description** covering:
- **Brand origin** (country, parent company, founding year if known)
- **What makes them unique** (USP, innovation, market position)
- **Flagship products** (2-3 specific products with strength/flavor)
- **Who they're for** (beginner, experienced, specific preferences)

**Tone:** Informative, conversational, authoritative. E-E-A-T signals (expertise, experience). No marketing fluff. Include 1-2 specific data points (mg ranges, pouch counts, market share).

**Format:** Deliver as a single JSON file:
```json
[
  { "brandSlug": "zyn", "brandName": "ZYN", "description": "..." },
  ...
]
```

### Brand List (28 brands, sorted by catalog size)

| # | Slug | Brand Name | Color (for reference) |
|---|------|-----------|----------------------|
| 1 | zyn | ZYN | #4CAF50 |
| 2 | velo | VELO | #1565C0 |
| 3 | loop | LOOP | #FF6F00 |
| 4 | siberia | Siberia | #D32F2F |
| 5 | skruf | Skruf | #1B5E20 |
| 6 | white-fox | White Fox | #0D47A1 |
| 7 | pablo | Pablo | #B71C1C |
| 8 | nordic-spirit | Nordic Spirit | #37474F |
| 9 | klar | KLAR | #004D40 |
| 10 | fumi | FUMI | #6A1B9A |
| 11 | cuba | Cuba | #E65100 |
| 12 | iceberg | ICEBERG | #00838F |
| 13 | ace | ACE | #2E7D32 |
| 14 | helwit | HELWIT | #558B2F |
| 15 | 77-pouches | 77 Pouches | #F9A825 |
| 16 | apr-s | APR:S | #795548 |
| 17 | chainpop | ChainPop | #AD1457 |
| 18 | avant | Avant | #BF360C |
| 19 | fix | FIX | #1A237E |
| 20 | fold | FOLD | #33691E |
| 21 | klint | KLINT | #00695C |
| 22 | xqs | XQS | #4A148C |
| 23 | on | ON! | #E53935 |
| 24 | killa | KILLA | #B71C1C |
| 25 | denssi | Denssi | #283593 |
| 26 | clew | CLEW | #0277BD |
| 27 | vid | VID | #4E342E |
| 28 | garant | Garant | #1B5E20 |

---

## Deliverable 2: OG Social Images (60+ pages)

Create **1200x630px** JSX/HTML mockups for social sharing previews. One per page.

### Design system:
- Background: `#0c1018` to `#161d2b` gradient (dark theme)
- Title text: `#f1f5f9` (bright white), font-weight 700
- Subtitle: `#94a3b8` (muted gray)
- Accent: brand color (from table above) or `#a3e635` (lime green default)
- Include: article title (max 2 lines), category/brand icon or can illustration, `snusfriends.com` watermark bottom-right
- Style: dark, premium, minimal — same aesthetic as our existing blog hero illustrations

### Pages needing OG images:

**Blog posts (60):**
1. all-velo-flavors-ranked-2026
2. are-nicotine-pouches-safe
3. are-zyns-bad-for-you
4. best-berry-nicotine-pouches
5. best-budget-nicotine-pouches
6. best-citrus-nicotine-pouches
7. best-coffee-nicotine-pouches
8. best-mint-nicotine-pouches-2026
9. best-nicotine-pouches-2026
10. best-nicotine-pouches-all-day-use
11. best-nicotine-pouches-for-beginners-2026
12. best-nicotine-pouches-for-quitting-smoking
13. best-nicotine-pouches-for-women
14. best-nicotine-pouches-no-aftertaste
15. best-slim-nicotine-pouches
16. best-strong-nicotine-pouches
17. can-you-swallow-nicotine-pouches
18. fumi-nicotine-pouches-complete-guide
19. how-long-do-nicotine-pouches-last
20. how-many-nicotine-pouches-a-day
21. how-much-do-nicotine-pouches-cost
22. how-to-choose-your-strength
23. how-to-spot-fake-nicotine-pouches
24. how-to-store-nicotine-pouches
25. how-to-use-nicotine-pouches
26. iceberg-nicotine-pouches-complete-guide
27. klar-nicotine-pouches-complete-guide
28. loop-nicotine-pouches-complete-guide
29. loop-vs-skruf
30. nicotine-pouch-buying-guide-europe
31. nicotine-pouch-flavour-guide
32. nicotine-pouch-ingredients-explained
33. nicotine-pouch-side-effects
34. nicotine-pouch-subscription-guide
35. nicotine-pouch-tax-regulations-2026
36. nicotine-pouch-trends-new-brands-2026
37. nicotine-pouches-legal-europe-2026
38. nicotine-pouches-vs-cigarettes
39. nicotine-pouches-vs-gum-vs-lozenges
40. nicotine-pouches-vs-snus
41. nicotine-pouches-vs-vaping
42. nordic-spirit-nicotine-pouches-complete-guide
43. on-nicotine-pouches-complete-guide
44. pablo-nicotine-pouches-complete-guide
45. rave-nicotine-pouches-review
46. siberia-nicotine-pouches-complete-guide
47. skruf-nicotine-pouches-complete-guide
48. strongest-nicotine-pouches-ranked-2026
49. strongest-snus-brands-compared-beginners-warning
50. switching-from-cigarettes-to-nicotine-pouches
51. top-10-mint-flavours
52. velo-flavours-complete-guide
53. velo-nicotine-pouches-complete-guide
54. velo-vs-nordic-spirit
55. what-are-nicotine-pouches
56. white-fox-nicotine-pouches-complete-guide
57. zyn-flavours-complete-guide
58. zyn-nicotine-pouches-complete-guide
59. zyn-strength-chart-every-level-explained
60. zyn-vs-velo-2026

**Deliver as:** 6-8 JSX batch files (same pattern as `blog-illustrations-batch1-brands.jsx`), each containing 8-10 OG image components with `export const metadata = { id, article, dimensions: '1200x630' }`.

---

## Deliverable 3: FAQ Sections for 18 Blog Posts

These posts are missing FAQPage schema. Write **5-8 Q&A pairs** per article targeting "People Also Ask" queries.

### Posts needing FAQ:

1. **best-berry-nicotine-pouches** — e.g. "What's the best berry nicotine pouch?", "Are berry pouches sweet?"
2. **best-citrus-nicotine-pouches** — e.g. "Which citrus pouch has the strongest flavor?"
3. **best-coffee-nicotine-pouches** — e.g. "Do coffee pouches taste like real coffee?"
4. **best-mint-nicotine-pouches-2026** — e.g. "What's the difference between peppermint and spearmint pouches?"
5. **best-nicotine-pouches-for-beginners-2026** — e.g. "What strength should a beginner start with?"
6. **how-to-choose-your-strength** — e.g. "How many mg should I start with?", "What if a pouch is too strong?"
7. **loop-nicotine-pouches-complete-guide** — e.g. "Who makes LOOP?", "What flavors does LOOP have?"
8. **loop-vs-skruf** — e.g. "Is LOOP better than Skruf?", "Which is stronger?"
9. **nicotine-pouch-buying-guide-europe** — e.g. "Can I buy nicotine pouches online in Germany?"
10. **nicotine-pouch-trends-new-brands-2026** — e.g. "What new nicotine pouch brands launched in 2026?"
11. **nicotine-pouches-vs-snus** — e.g. "Is snus the same as nicotine pouches?", "Which is healthier?"
12. **rave-nicotine-pouches-review** — e.g. "Are RAVE pouches good?", "How strong are RAVE pouches?"
13. **switching-from-cigarettes-to-nicotine-pouches** — e.g. "How many pouches equal a cigarette?"
14. **top-10-mint-flavours** — e.g. "Which mint pouch lasts longest?"
15. **velo-nicotine-pouches-complete-guide** — e.g. "Who owns VELO?", "What strengths does VELO come in?"
16. **what-are-nicotine-pouches** — e.g. "Are nicotine pouches FDA approved?", "How long do you keep a pouch in?"
17. **zyn-nicotine-pouches-complete-guide** — e.g. "Where is ZYN made?", "How many ZYN flavors are there?"
18. **zyn-vs-velo-2026** — e.g. "Is ZYN stronger than VELO?", "Which tastes better?"

### Format per article:
```html
<!-- FAQ Section -->
<section style="margin-top: 48px;">
  <h2 style="...">Frequently Asked Questions</h2>
  <div class="faq-grid">
    <details>
      <summary>Question here?</summary>
      <p>Answer here (2-4 sentences, factual, includes a product recommendation where relevant)</p>
    </details>
    <!-- repeat 5-8 times -->
  </div>
</section>
```

Also provide the JSON-LD FAQPage schema for each article:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

---

## Delivery Format

- **Brand descriptions:** Single JSON file (`brand-descriptions.json`)
- **OG images:** 6-8 JSX batch files in `cowork/mockups/og-images-batch[N].jsx`
- **FAQ sections:** 18 HTML files in `cowork/content/faq-[article-slug].html` (one per article)

## Priority Order

1. FAQ sections (fastest ROI — rich results in Google)
2. Brand descriptions (fills thin content gap)
3. OG images (social sharing improvement)
