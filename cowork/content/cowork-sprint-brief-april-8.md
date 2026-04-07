# Cowork Sprint Brief — April 8, 2026

## Project Context

**Site:** snusfriends.com — headless B2C nicotine pouch shop
**Stack:** Astro 6 + React islands + Supabase + Vercel
**Traffic model:** 100% organic (Google Ads bans nicotine). All growth comes from SEO, content, and community.
**Current scale:** 708 products, 63 blog articles, 30 brand pages, 10 country pages, ~1,130 indexed URLs
**GSC:** 403 impressions/week, top pages: strongest-pouches (142), best-2026 (81), zyn-flavours (78)

Previous sprint deliverables (reduction guide, ZYN FAQ, product card selections, suggestions copy, country enrichments) are being integrated now. This brief covers the next two content workstreams.

---

## Deliverable 1: Country Buying Guide Articles (5 blog posts)

The 10 country pages (`/countries/[slug]`) already have enriched data sections (intro, market context, buying tips, FAQ). Now we need **standalone blog articles** that go deeper — these target long-tail search queries like "buy nicotine pouches in Austria", "best snus alternative Finland", "nikotinbeutel kaufen Deutschland".

### What to write

For each of the 5 countries below, write a **1,500–2,000 word blog article** in HTML format (ready for `.astro` integration).

**Countries:**

| # | Country | Slug | Key Angle |
|---|---------|------|-----------|
| 1 | Austria | `buying-nicotine-pouches-austria-2026` | Trafik culture vs online, regulatory grey area, price comparison with German shops |
| 2 | Denmark | `buying-nicotine-pouches-denmark-2026` | Post-snus-ban landscape, what Danish users switched to, popular brands |
| 3 | Norway | `buying-nicotine-pouches-norway-2026` | Norwegian snus tradition vs tobacco-free pouches, tax/import implications, cross-border buying |
| 4 | Finland | `buying-nicotine-pouches-finland-2026` | Snus ban but pouches legal paradox, rapid market growth, local preferences |
| 5 | Poland | `buying-nicotine-pouches-poland-2026` | Fastest-growing EU market, saszetki nikotynowe culture, price-sensitive buyers, local brands vs imports |

### Article structure (follow for each)

```
1. Meta title (max 60 chars): "Buy Nicotine Pouches in [Country]: Complete 2026 Guide"
2. Meta description (max 155 chars): targeting "[country] nicotine pouches" + "buy" + "online"
3. Target keywords (3-5 per article, include local language terms)

4. Introduction (~200 words)
   - Legal status summary (1 paragraph)
   - Why this country's market is interesting/growing
   - What this guide covers

5. Legal & Regulatory Landscape (~300 words)
   - Current legal classification of nicotine pouches
   - Age restrictions
   - Any pending legislation or recent changes
   - How pouches differ legally from snus/tobacco in this country
   - Source: cite actual regulatory bodies (not generic "EU law")

6. How Locals Buy (~300 words)
   - Physical retail: what stores stock pouches, typical brand selection (usually 2-3 brands), pricing
   - Online: domestic shops vs international (like SnusFriend), price comparison
   - Cross-border: any relevant patterns (e.g., Norwegians buying from Sweden, Austrians from Germany)

7. Most Popular Brands & Flavours (~300 words)
   - Top 5 brands in this market (by consumer preference, not just availability)
   - Local flavour preferences (e.g., Poles prefer strong mint, Danes like traditional flavours)
   - Strength preferences (beginner-heavy vs experienced market)
   - Link to each brand's page: /brands/[brand-slug]

8. Shipping & Ordering from SnusFriend (~200 words)
   - Delivery time from EU warehouse
   - Customs/tax situation for this country
   - Free shipping threshold (€29)
   - Payment methods popular in this country

9. Beginner Recommendations (~200 words)
   - 3-5 specific products for someone in this country trying pouches for the first time
   - Use real product names from our catalog: ZYN, VELO, Skruf, LOOP, Nordic Spirit, HELWIT, ON!
   - Include strength in mg

10. FAQ Section (5-7 Q&As)
    - In <details><summary> HTML format (same as ZYN guide FAQ)
    - Include FAQPage JSON-LD schema block
    - Questions should reflect what locals actually search for (use local language keywords in some questions)

11. Related Reading
    - Link to the country page: /countries/[slug]
    - Link to relevant comparison articles
    - Link to beginner guide: /beginners
```

### Tone & E-E-A-T

- Authoritative but not dry. We're helping real people buy real products.
- Include specific data: prices in local currency, delivery times, brand counts.
- Cite regulatory sources by name (not "according to EU regulations").
- Show experience: mention things only someone who actually ships to these countries would know (customs delays, popular payment methods, seasonal demand patterns).

### Format

Deliver as 5 separate files:
- `blog-buying-pouches-austria.html`
- `blog-buying-pouches-denmark.html`
- `blog-buying-pouches-norway.html`
- `blog-buying-pouches-finland.html`
- `blog-buying-pouches-poland.html`

---

## Deliverable 2: New Comparison Articles (6 blog posts)

"Brand vs Brand" articles target high purchase-intent searches. Users searching "ZYN vs LOOP" are actively deciding what to buy. We already have 9 comparison articles live:

- ZYN vs VELO
- ZYN vs Nordic Spirit
- VELO vs Nordic Spirit
- VELO vs ON!
- LOOP vs Skruf
- Nicotine pouches vs cigarettes
- Nicotine pouches vs vaping
- Nicotine pouches vs snus
- Nicotine pouches vs gum vs lozenges

### What to write

6 new comparison articles, each **1,800–2,200 words** in HTML format.

| # | Article | Slug | Target Keywords |
|---|---------|------|----------------|
| 1 | ZYN vs LOOP | `zyn-vs-loop-2026` | zyn vs loop, loop vs zyn, zyn or loop |
| 2 | ZYN vs Skruf | `zyn-vs-skruf-2026` | zyn vs skruf, skruf vs zyn |
| 3 | VELO vs LOOP | `velo-vs-loop-2026` | velo vs loop, loop vs velo |
| 4 | White Fox vs Siberia | `white-fox-vs-siberia-2026` | white fox vs siberia, siberia vs white fox, strongest pouches compared |
| 5 | KLAR vs FUMI | `klar-vs-fumi-2026` | klar vs fumi, fumi vs klar, scandinavian pouch brands |
| 6 | Best Nicotine Pouches for Each Occasion | `best-nicotine-pouches-by-occasion` | best pouch for work, best pouch for sports, best pouch for socialising |

### Article structure (follow for each comparison)

```
1. Meta title (max 60 chars): "[Brand A] vs [Brand B]: Which Is Better in 2026?"
2. Meta description (max 155 chars)
3. Target keywords (3-5)

4. Introduction (~150 words)
   - One sentence on each brand's positioning
   - What this comparison covers
   - Quick verdict teaser (don't bury the lede)

5. Brand Backgrounds (~200 words each brand)
   - Parent company, country of origin
   - Market position (mainstream vs niche, market share if known)
   - Key innovation or USP

6. Head-to-Head Sections (5-6 sections, ~200 words each):
   - Flavour Range (count SKUs, describe categories, note exclusives)
   - Strength Range (exact mg values, compare ladders)
   - Format & Comfort (slim vs mini vs regular, session duration, moisture)
   - Price & Value (per-can and per-mg comparison, bulk discounts)
   - European Availability (which countries, retail vs online)
   - Special Features (FDA status, sustainability, unique tech like LOOP Instant Rush)

   Each section ends with a one-line **Verdict:** declaring a winner or tie.

7. Side-by-Side Comparison Table
   - HTML <table> with columns: Feature | Brand A | Brand B
   - Cover: Maker, Formats, Strength range, Flavour count, Can size, Session duration, Price range, Best for

8. Who Should Choose [Brand A]? (~100 words)
   - 4-5 bullet points describing the ideal user

9. Who Should Choose [Brand B]? (~100 words)
   - 4-5 bullet points describing the ideal user

10. Final Verdict (~100 words)
    - Clear recommendation with nuance
    - "Many users keep both" angle if appropriate

11. Product Recommendations (4-6 products per article)
    - List specific product slugs from our catalog for BlogProductCard integration
    - Format: JSON array like the product-card-selections file
    - Pick 2-3 hero products from each brand

12. FAQ Section (5-6 Q&As)
    - <details><summary> HTML format
    - FAQPage JSON-LD schema
    - Questions: "Is [A] stronger than [B]?", "Which has more flavours?", "Which is cheaper?", "Can I use both?", "Which is better for beginners?"

13. Related Reading
    - Link to each brand's complete guide: /blog/[brand]-nicotine-pouches-complete-guide
    - Link to relevant best-of lists
    - Link to strength guide: /blog/how-to-choose-your-strength
```

### Special note for Article 6 (Best by Occasion)

This is NOT a brand-vs-brand comparison. Structure it as:

| Occasion | What matters | Top pick | Runner-up |
|----------|-------------|----------|-----------|
| Office/work | Discretion, mild strength | ON! Mint 3mg | ZYN Spearmint Mini |
| Gym/sports | Quick hit, won't dislodge | VELO Freeze Max | LOOP Hyper Strong |
| Social/pub | Conversation-starter flavours | LOOP Jalapeno Lime | Skruf Passion Fruit |
| Morning coffee | Pairs well, medium strength | ZYN Espressino | Nordic Spirit Bergamot |
| Before bed | Light, calming | ZYN Gentle Mint Mini | HELWIT Violet |
| Long drive | Sustained release, 30+ min | Skruf Fresh Mint S4 | White Fox Peppered Mint |

Verify all product names exist in the catalog. Include BlogProductCard slugs for each recommendation.

### Tone & E-E-A-T

- Opinionated but fair. Pick winners, explain why, acknowledge the loser's strengths.
- Include specific numbers: exact mg values, SKU counts, price ranges, session durations.
- Write like someone who has actually tried both brands, not like a spec sheet comparison.
- Reference our own guides and data (internal links) to build topical authority.

### Format

Deliver as 6 separate files:
- `blog-zyn-vs-loop.html`
- `blog-zyn-vs-skruf.html`
- `blog-velo-vs-loop.html`
- `blog-white-fox-vs-siberia.html`
- `blog-klar-vs-fumi.html`
- `blog-best-pouches-by-occasion.html`

Each file must include:
1. Full HTML article content (no `<html>`, `<head>`, `<body>` tags — just the article content starting from the first `<section>` or `<h2>`)
2. FAQPage JSON-LD schema block at the end
3. Product slug selections as a JSON comment block at the bottom

---

## Delivery Notes

- **Priority:** Comparison articles first (higher SEO impact per article), country guides second.
- **Product verification:** Check product names and slugs on snusfriends.com/brands/[brand-slug] pages. If a specific product doesn't exist, substitute with the closest match and note the substitution.
- **Inline styles:** Use `hsl(var(--border))`, `hsl(var(--muted))`, `hsl(var(--primary))` CSS custom properties for any styling (same as ZYN guide FAQ). No hardcoded hex colors.
- **Internal links:** Use relative paths starting with `/` (e.g., `/blog/zyn-vs-velo-2026`, `/brands/zyn`, `/beginners`).
- **Do not generate AI images.** No SVGs, no illustrations, no OG images. Text content only.
