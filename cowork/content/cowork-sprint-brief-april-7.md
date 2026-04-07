# Cowork Sprint Brief — April 7, 2026

## Project Context

**Site:** snusfriends.com — headless B2C nicotine pouch shop  
**Stack:** Astro 6 + React islands + Supabase + Vercel  
**Traffic model:** 100% organic (Google Ads bans nicotine). All growth comes from SEO, content, and community.  
**Current scale:** 708 products, 63 blog articles, 30 brand pages, 11 country pages, ~1,130 indexed URLs  
**GSC:** 403 impressions/week, top pages: strongest-pouches, best-2026, zyn-flavours  

We just shipped a major feature sprint adding review dimensions, smart recommendations, a nicotine reduction guide, nicotine-free catalog, flavor quiz improvements, and a community suggestion board. Several of these need Cowork's content expertise to reach their full potential.

---

## Deliverable 1: Nicotine Reduction Guide Content Polish

**Page:** `/nicotine-reduction-guide` (already live with placeholder content)  
**Goal:** Make this the definitive step-down resource — something no competitor has.

**What exists now:** A 5-tier step-down schedule (12mg → 0mg), a basic nicotine timeline, and product recommendations at each tier. The content is functional but lacks research depth and authority.

**What Cowork needs to write:**

### 1a. Research-Backed Nicotine Timeline (replace current placeholder)
Write 400-500 words covering:
- **Blood clearance:** Nicotine half-life is ~2 hours. Cotinine (metabolite) detectable for 1-3 days.
- **Withdrawal peak:** Days 2-3 are hardest. Symptoms: irritability, anxiety, difficulty concentrating, increased appetite.
- **Physical dependence fades:** 2-4 weeks for most physiological symptoms to subside.
- **Psychological cravings:** Can persist 1-3 months, triggered by habits/routines.
- **Full neurological reset:** Nicotine receptors return to baseline density in 6-12 weeks.

**Sources to cite:** NHS Smokefree, Mayo Clinic nicotine dependence page, PHE evidence reviews. Include inline citations like `(NHS Smokefree, 2024)` — we'll add the full reference list.

**Tone:** Empathetic and factual. Not preachy. The reader is a nicotine user who WANTS to reduce — they don't need to be convinced, they need practical guidance.

### 1b. Enhanced Step-Down Schedule (expand each tier)
For each of the 5 tiers, write 100-150 words covering:
- **What to expect** at this strength level (physical sensations, satisfaction level)
- **How long to stay** before stepping down (4 weeks minimum, but listen to your body)
- **Warning signs** you're moving too fast (constant cravings, mood swings, reverting to higher strength)
- **2-3 specific product recommendations** with brand, product name, exact mg, and why it's good for this tier

**Tier breakdown:**
| Tier | mg Range | Example Products |
|------|----------|-----------------|
| 1 (Heavy) | 12-20 mg | Siberia -80 (43mg/g), Pablo Exclusive (50mg), KILLA Cold Mint (16mg) |
| 2 (Strong) | 8-11 mg | ZYN Black Cherry (9.5mg), VELO Freeze Max (11mg), LOOP Jalapeno Lime (9.4mg) |
| 3 (Medium) | 5-7 mg | ZYN Cool Mint (6mg), VELO Ice Cool (6mg), Nordic Spirit Spearmint (6mg) |
| 4 (Light) | 2-4 mg | ZYN Citrus (3mg), HELWIT Mint (4mg), ON! Citrus (3mg) |
| 5 (Zero) | 0 mg | VELO Nicotine Free, nicotine-free energy pouches, any 0mg product |

Verify these product names and mg values exist in our catalog (check snusfriends.com/brands/[brand-slug] pages). If a product doesn't exist, substitute with one that does.

### 1c. Craving Management Tips (expand existing section)
Write 300 words organized as:
- **Oral fixation replacements:** Sugar-free gum, toothpicks, nicotine-free pouches
- **Behavioral triggers:** Post-meal, with coffee, during stress — specific strategies for each
- **Physical activity:** Even 5-minute walks reduce craving intensity by 30-50% (cite source)
- **Hydration:** Dehydration intensifies cravings — aim for 2L/day during reduction
- **Community support:** Link to our community page, mention that sharing your journey earns SnusPoints

### 1d. Medical Disclaimer
Write a 2-sentence disclaimer: "This guide is for informational purposes only and does not constitute medical advice. If you experience severe withdrawal symptoms, consult a healthcare professional."

**Delivery format:** Single markdown file with clear section headers matching the structure above. We'll drop the content directly into the existing Astro page.

---

## Deliverable 2: Blog Product Card Selections

**Context:** We built a new `BlogProductCard` component that embeds product cards (with images, prices, and add-to-cart buttons) inline in blog articles. Currently only the "best coffee pouches" article has them. We need selections for all "best of" and brand guide articles.

**For each article below, provide 4-6 product slugs** that should be embedded as cards. The slug format is the URL-friendly product name (e.g., `zyn-cool-mint-6mg-slim`). You can find exact slugs by browsing the product pages on snusfriends.com.

**Selection criteria:**
- Pick products that are actually MENTIONED or recommended in the article
- Prioritize products with high ratings and good stock availability
- Include a mix of strengths (at least 1 beginner-friendly option)
- Include products from at least 2-3 different brands when the article covers multiple brands

### Articles needing product card selections:

**"Best of" articles (pick 4-6 products each):**
1. `best-nicotine-pouches-2026` — overall best picks
2. `best-nicotine-pouches-for-beginners-2026` — starter-friendly products
3. `best-mint-nicotine-pouches-2026` — top mint products
4. `best-berry-nicotine-pouches` — top berry products
5. `best-citrus-nicotine-pouches` — top citrus products
6. `best-strong-nicotine-pouches` — strongest recommendations
7. `best-slim-nicotine-pouches` — slim format picks
8. `best-budget-nicotine-pouches` — value picks
9. `best-nicotine-pouches-for-quitting-smoking` — transition products
10. `best-nicotine-pouches-for-women` — recommended for women
11. `best-nicotine-pouches-all-day-use` — all-day comfort picks
12. `best-nicotine-pouches-no-aftertaste` — clean flavor picks
13. `top-10-mint-flavours` — mint ranking
14. `strongest-nicotine-pouches-ranked-2026` — strength ranking
15. `strongest-snus-brands-compared-beginners-warning` — strong brand picks

**Brand guide articles (pick 3-4 flagship products each):**
16. `zyn-nicotine-pouches-complete-guide` — ZYN flagships
17. `velo-nicotine-pouches-complete-guide` — VELO flagships
18. `loop-nicotine-pouches-complete-guide` — LOOP flagships
19. `nordic-spirit-nicotine-pouches-complete-guide` — Nordic Spirit flagships
20. `on-nicotine-pouches-complete-guide` — ON! flagships
21. `skruf-nicotine-pouches-complete-guide` — Skruf flagships
22. `white-fox-nicotine-pouches-complete-guide` — White Fox flagships
23. `pablo-nicotine-pouches-complete-guide` — Pablo flagships
24. `siberia-nicotine-pouches-complete-guide` — Siberia flagships

**Delivery format:** JSON file:
```json
[
  {
    "article": "best-nicotine-pouches-2026",
    "products": ["zyn-cool-mint-6mg-slim", "velo-ice-cool-strong", ...]
  },
  ...
]
```

**Important:** Verify each slug exists on the site. Browse snusfriends.com/products/[slug] to confirm. If a product slug doesn't work, provide the brand name + product name and we'll find the correct slug.

---

## Deliverable 3: ZYN Complete Guide FAQ

**Article:** `/blog/zyn-nicotine-pouches-complete-guide`  
**Problem:** This is our most important brand guide (ZYN is the #1 brand worldwide) and it's the only brand guide article missing FAQ schema. This was accidentally skipped in the last batch.

**Write 8 Q&A pairs** targeting "People Also Ask" queries for ZYN:

1. Where is ZYN made? (Swedish Match / Philip Morris International, manufactured in Sweden and the US)
2. How many ZYN flavors are there? (list the count from our catalog — check snusfriends.com/brands/zyn)
3. What is the strongest ZYN? (check our product pages for the highest mg ZYN product)
4. Is ZYN FDA approved? (No — ZYN has not received FDA marketing authorization. Only ON! PLUS has.)
5. How long does a ZYN pouch last? (30-60 minutes typical use)
6. Can you swallow ZYN spit? (Yes, the small amount of saliva generated is safe to swallow)
7. Is ZYN better than VELO? (Brief neutral comparison — link to our /blog/zyn-vs-velo-2026 article)
8. How much nicotine is in a ZYN? (Range across their product line — e.g., 1.5mg to 11mg per pouch)

**Format:** HTML snippet with `<details>/<summary>` accordion + JSON-LD FAQPage schema (same format as the other 17 FAQ sections we just integrated).

**Tone:** Factual, concise, 2-4 sentences per answer. Include specific numbers where possible.

---

## Deliverable 4: Country Page Enrichments (5 countries)

**Pages:** Austria, Denmark, Norway, Finland, Poland — at `/countries/[slug]`  
**Reference:** The Germany page (`/countries/germany`) is fully enriched — use it as the quality bar.

For each country, write:

### 4a. Enriched Introduction (200-250 words)
Replace the auto-generated intro with a country-specific narrative covering:
- The nicotine pouch market in this country (growing? established? new?)
- Local cultural context (relationship with tobacco/snus tradition)
- Legal status summary (is it legal? any restrictions? age limits?)
- Why SnusFriend ships there (EU-wide delivery, competitive pricing)

### 4b. Market Context (150-200 words)
- Market size estimate or growth trend if available
- Most popular brands in this country (may differ from overall EU trends)
- Any local competitors or distribution channels
- Price comparison context (are pouches cheaper/more expensive than cigarettes locally?)

### 4c. Buying Tips (100-150 words)
- Customs/import considerations for this country
- Typical delivery time from our EU warehouse
- Any VAT or duty implications
- Payment method preferences (some countries prefer specific methods)

### 4d. FAQ (3-5 Q&A pairs)
Country-specific questions like:
- "Are nicotine pouches legal in [country]?"
- "How long does delivery take to [country]?"
- "Do I need to pay customs on nicotine pouches in [country]?"
- "What's the most popular pouch brand in [country]?"
- "What age do you need to be to buy nicotine pouches in [country]?"

### Country-specific research notes:

**Austria:** Legal, no specific pouch regulation yet. Growing market. Strong snus culture from proximity to Sweden. Age 18+.

**Denmark:** Flavour ban on non-menthol/non-tobacco pouches takes effect April 2026. Major market shift — users stockpiling or switching. Age 18+. High awareness.

**Norway:** Snus is deeply culturally embedded (highest per-capita consumption globally). Nicotine pouches legal alongside traditional snus. Price-sensitive market (Norwegian tobacco taxes are very high). Age 18+.

**Finland:** Part of the Nordic snus belt but nicotine pouches in a legal gray area. Sale of snus is banned but personal import is allowed (EU law). Nicotine pouches (tobacco-free) have a different classification. Age 18+.

**Poland:** Growing market, relatively new. Legal, minimal regulation. Price-competitive — users appreciate good value. Major growth potential. Age 18+.

**Delivery format:** Single markdown file with clear country headers. Each country section should have all 4 sub-sections (intro, market, tips, FAQ) clearly labeled.

---

## Deliverable 5: Feature Suggestion Page + Community Copy

**Page:** `/suggestions` (already live with placeholder form)

Write:
1. **Hero copy** (2 sentences) — exciting but clear. "Help shape the future of SnusFriend" type messaging.
2. **How it works** section (4 steps, 1 sentence each):
   - Submit your idea
   - The community votes on suggestions
   - We build the most-requested features
   - You earn the Pioneer badge + 200 SnusPoints when your suggestion ships
3. **Guidelines** (5 bullet points) — what makes a good suggestion, what's out of scope
4. **Reward details** — explain the Pioneer badge, that it's exclusive to users whose suggestions get implemented, and the 200 point bonus

**Tone:** Enthusiastic, community-focused, but not corporate-cringe. Think Discord community vibes, not corporate suggestion box.

---

## General Guidelines for All Deliverables

**Tone:** Informative, conversational, authoritative. We're experts who use these products daily, not a faceless corporation.

**E-E-A-T signals:** Include specific numbers, product names, mg values, brand origins. Demonstrate first-hand experience ("In our testing...", "We've found that...").

**Internal links:** Where relevant, suggest links to our existing pages. Use the format `[anchor text](/path)`. Key pages to link to:
- `/nicotine-pouches` (main catalog)
- `/blog/how-to-use-nicotine-pouches` (beginner guide)
- `/blog/how-to-choose-your-strength` (strength guide)
- `/blog/nicotine-pouch-flavour-guide` (flavor guide)
- `/brands/[slug]` (brand pages)
- `/nicotine-reduction-guide` (step-down guide)
- `/community` (community page)

**No curly/smart quotes:** Use straight ASCII quotes only (' and "). Smart quotes break our build system.

**Accuracy:** If you're unsure about a product name, mg value, or legal fact — flag it with `[VERIFY]` and we'll check. Don't guess.

---

## Delivery Format

All deliverables as markdown files in `cowork/content/`:
1. `reduction-guide-content-v2.md`
2. `blog-product-card-selections.json`
3. `faq-zyn-complete-guide.html`
4. `country-enrichments-batch2.md`
5. `suggestions-page-copy.md`

## Priority Order

1. Blog product card selections (quick, high conversion impact)
2. ZYN FAQ (quick, high SEO impact — our top brand guide)
3. Reduction guide polish (medium effort, unique competitive moat)
4. Country enrichments (medium effort, international SEO)
5. Suggestion page copy (low priority, can iterate later)
