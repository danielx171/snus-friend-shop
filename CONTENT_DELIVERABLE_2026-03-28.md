# Content Deliverable — March 28, 2026

All copy is plain HTML ready to paste into Astro pages. Optimised for Google SEO + AI citability (GEO).

---

## TASK 1 — Brands Page Intro Copy

**Target file:** `src/pages/brands/index.astro`
**Replace:** The current `<p class="mt-2 ...">Explore {brands.length} nicotine pouch brands</p>` block (lines 54–56)
**Replace with the entire `<div class="mb-8">` block (lines 50–57):**

```html
<div class="mb-8">
  <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
    Nicotine Pouch Brands
  </h1>
  <div class="mt-3 max-w-3xl space-y-3 text-base leading-relaxed text-muted-foreground">
    <p>
      We carry <strong class="text-foreground">{brands.length} nicotine pouch brands</strong> from
      Scandinavia, the UK, the Baltics, and beyond — the widest selection of tobacco-free pouches
      you'll find in one European shop. Whether you've used pouches for years or you're switching
      from cigarettes for the first time, our brand wall makes it easy to compare manufacturers,
      country of origin, strength ranges, and flavour profiles side by side.
    </p>
    <p>
      Household names like <a href="/brands/zyn" class="underline hover:text-foreground">ZYN</a>,
      <a href="/brands/velo" class="underline hover:text-foreground">VELO</a>, and
      <a href="/brands/loop" class="underline hover:text-foreground">LOOP</a> sit alongside
      specialist labels such as <a href="/brands/siberia" class="underline hover:text-foreground">Siberia</a>,
      <a href="/brands/pablo" class="underline hover:text-foreground">Pablo</a>,
      <a href="/brands/killa" class="underline hover:text-foreground">Killa</a>,
      <a href="/brands/skruf" class="underline hover:text-foreground">Skruf</a>, and
      <a href="/brands/fumi" class="underline hover:text-foreground">FUMI</a> — so you can
      explore everything from mild 2 mg everyday pouches to ultra-strong 50 mg options.
      Every brand page lists the full product range with available strengths, flavour
      descriptions, and current pricing — plus the manufacturer and country of origin
      so you always know exactly who makes the product you're buying.
    </p>
    <p>
      Not sure where to start? Our
      <a href="/blog/best-nicotine-pouches-for-beginners-2026" class="underline hover:text-foreground">beginner's guide</a>
      walks you through choosing the right brand and strength for your experience level,
      or take the <a href="/flavor-quiz" class="underline hover:text-foreground">flavour quiz</a>
      for a personalised recommendation in under a minute. You can also read our detailed
      <a href="/blog/zyn-vs-velo-2026" class="underline hover:text-foreground">ZYN vs VELO comparison</a>
      or the <a href="/blog/strongest-nicotine-pouches-ranked-2026" class="underline hover:text-foreground">strongest
      pouches ranking</a> if you already know what you're looking for.
    </p>
  </div>
</div>
```

**Word count:** ~210

---

## TASK 2 — Homepage "Why SnusFriend" Body Copy

**Target file:** `src/pages/index.astro`
**Action:** Add a new section between the "Trust Signals" section and the "Shop by Brand" section (between lines ~166 and ~168).

```html
<!-- Why SnusFriend -->
<section class="border-b border-border bg-background py-16 sm:py-20">
  <div class="mx-auto max-w-3xl px-4">
    <h2 class="mb-6 text-center text-2xl font-bold text-foreground sm:text-3xl">
      Why Thousands of Europeans Shop at SnusFriend
    </h2>
    <div class="space-y-4 text-base leading-relaxed text-muted-foreground">
      <p>
        SnusFriend exists for one reason: to give nicotine pouch users the selection, the
        information, and the service that mainstream tobacco retailers never bothered with.
        We stock <strong class="text-foreground">{allProducts.length}+ products</strong> from
        <strong class="text-foreground">{brands.length} brands</strong> — from global leaders
        like ZYN and VELO to cult favourites like Siberia, LOOP, and Pablo — all in one place,
        all with transparent pricing and honest product descriptions.
      </p>
      <p>
        Because Google Ads bans nicotine advertising, you won't find us through flashy paid
        campaigns. Instead, we earn every visit by publishing the most thorough
        <a href="/blog" class="underline hover:text-foreground">guides and reviews</a> in the
        nicotine pouch space — fact-checked, regularly updated, and written for real users
        rather than search algorithms. That editorial approach shapes our entire store: every
        brand page includes the manufacturer, country of origin, strength range, and an honest
        description so you know exactly what you're buying.
      </p>
      <p>
        Orders ship from our EU warehouse within 24 hours, with tracking on every parcel and
        free shipping on orders over &euro;{tenant.freeShippingThreshold}. Our
        <a href="/rewards" class="underline hover:text-foreground">loyalty program</a> rewards
        repeat customers with points, quests, and exclusive perks — because the pouch community
        deserves better than one-and-done checkout experiences. We only sell to customers aged
        18 and over, and we comply with all applicable EU regulations on nicotine products.
      </p>
    </div>
  </div>
</section>
```

**Word count:** ~230

---

## TASK 3 — Nicotine Pouches Landing Page Expansion

**Target file:** `src/pages/nicotine-pouches.astro`
**Action:** Add this content block after the existing quick-category navigation (after line ~83, before the `</article>` tag).

```html
<!-- Expanded landing copy -->
<div class="mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
  <h2 class="text-xl font-semibold text-foreground">
    What Are Nicotine Pouches?
  </h2>
  <p>
    Nicotine pouches are small, pre-portioned sachets containing food-grade plant fibre,
    flavouring, and pharmaceutical-grade nicotine — with zero tobacco leaf. You place one
    between your upper lip and gum, and the nicotine absorbs through the oral mucosa over
    20 to 40 minutes. There is no smoke, no vapour, and no spit, which makes pouches one
    of the most discreet nicotine formats available. Clinical research shows that peak
    nicotine absorption typically occurs at
    <a href="/blog/how-long-do-nicotine-pouches-last" class="underline hover:text-foreground">20 to 30 minutes</a>,
    comparable to traditional snus but without the tobacco.
  </p>
  <h2 class="text-xl font-semibold text-foreground">
    How to Choose the Right Pouch
  </h2>
  <p>
    Two things matter most: <strong class="text-foreground">strength</strong> and
    <strong class="text-foreground">flavour</strong>. Strengths range from light
    (2–4 mg nicotine per pouch) through normal (6–8 mg), strong (10–14 mg), and
    extra-strong (16–20 mg) up to super-strong (20 mg+). If you're new to pouches,
    start at 4–6 mg — our
    <a href="/blog/how-to-choose-your-strength" class="underline hover:text-foreground">strength guide</a>
    explains why. Flavours span
    <a href="/products/flavor/mint" class="underline hover:text-foreground">mint</a> (the most popular
    category, making up an estimated 45–60% of sales),
    <a href="/products/flavor/berry" class="underline hover:text-foreground">berry</a>,
    <a href="/products/flavor/citrus" class="underline hover:text-foreground">citrus</a>,
    <a href="/products/flavor/coffee" class="underline hover:text-foreground">coffee</a>, and
    dozens of creative blends like jalapeño lime and habanero mint.
  </p>
  <h2 class="text-xl font-semibold text-foreground">
    Buying Nicotine Pouches in Europe
  </h2>
  <p>
    The European nicotine pouch market is growing rapidly — industry analysts project a
    compound annual growth rate above 28% through 2033. Regulations vary by country:
    pouches are widely available in Sweden, Germany, the UK, and most of the EU, but
    France banned commercial sales in February 2025, and the Netherlands followed with
    a retail ban the same month. The EU's upcoming Tobacco Products Directive 3 (TPD3),
    expected in draft form by mid-2026, will bring pouches under harmonised regulation for
    the first time. SnusFriend ships from within the EU with full compliance and tracking
    on every order. For a country-by-country breakdown, read our
    <a href="/blog/nicotine-pouch-buying-guide-europe" class="underline hover:text-foreground">European buying guide</a>.
  </p>
</div>
```

**Word count:** ~340

---

## TASK 4 — Blog Index Intro

**Target file:** `src/pages/blog/index.astro`
**Replace:** The current `<p class="text-lg ...">Guides, reviews, and tips...</p>` (line 162)
**Replace with:**

```html
<div class="mb-10 max-w-2xl space-y-3 text-base leading-relaxed text-muted-foreground">
  <p>
    Honest, fact-checked content is the backbone of SnusFriend. Because nicotine advertising
    is banned on most platforms, we built our reputation the old-fashioned way: by publishing
    the most thorough guides, brand comparisons, and buying advice in the European nicotine
    pouch space. Every article below is written by our editorial team, verified against
    manufacturer data and independent sources, and updated whenever the market moves.
  </p>
  <p>
    Whether you're a first-time buyer choosing your
    <a href="/blog/best-nicotine-pouches-for-beginners-2026" class="underline hover:text-foreground">starter pouch</a>,
    an experienced user comparing
    <a href="/blog/zyn-vs-velo-2026" class="underline hover:text-foreground">ZYN vs VELO</a>,
    or just curious about
    <a href="/blog/nicotine-pouch-side-effects" class="underline hover:text-foreground">side effects</a>
    and <a href="/blog/nicotine-pouch-buying-guide-europe" class="underline hover:text-foreground">EU regulations</a>,
    you'll find straightforward answers below — no filler, no upsell.
  </p>
</div>
```

**Word count:** ~150

---

## TASK 5 — FAQ Sections with JSON-LD (3 Pages × 5 Q&As)

### 5A — Nicotine Pouches Landing Page (`/nicotine-pouches`)

Add before the closing `</Shop>` tag, after the existing CollectionPage schema:

```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are nicotine pouches safer than cigarettes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nicotine pouches contain no tobacco leaf and produce no smoke or vapour, which eliminates exposure to tar and combustion byproducts. While no nicotine product is risk-free, Public Health England and the Royal College of Physicians consider tobacco-free nicotine products significantly less harmful than smoking. Long-term studies specific to nicotine pouches are still ongoing."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a nicotine pouch last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most users keep a nicotine pouch in for 20 to 40 minutes. Nicotine absorption peaks at around 20 to 30 minutes, after which the flavour and effect gradually fade. Slim pouches tend to release flavour slightly faster than regular format pouches."
      }
    },
    {
      "@type": "Question",
      "name": "What nicotine strength should a beginner start with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Beginners should start with a light or normal strength pouch — typically 2 to 6 mg of nicotine per pouch. If you currently smoke fewer than 10 cigarettes a day, 4 mg is a common starting point. You can increase gradually if the effect feels too mild. Our strength guide has a full breakdown by experience level."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use nicotine pouches on a plane or indoors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Because nicotine pouches produce no smoke, vapour, or odour, they can generally be used anywhere — including on flights, in offices, and in restaurants. There is no legal restriction on using them indoors in most European countries, though individual venues may set their own policies."
      }
    },
    {
      "@type": "Question",
      "name": "Do nicotine pouches stain your teeth?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Unlike traditional snus or chewing tobacco, nicotine pouches are white and contain no tobacco leaf, so they do not cause the brown staining associated with tobacco-based oral products. Some users notice mild gum sensitivity when starting out, which typically subsides within a few days."
      }
    }
  ]
})} />
```

### 5B — Brands Page (`/brands`)

Add before the closing `</Shop>` tag:

```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the most popular nicotine pouch brand?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ZYN by Swedish Match (now part of Philip Morris International) is the world's best-selling nicotine pouch brand, with approximately 61% volume share in the United States and availability in over 56 markets. In Europe, VELO by British American Tobacco is the volume leader in most markets, followed by brands like LOOP, Nordic Spirit, and Skruf."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between ZYN and VELO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ZYN and VELO are both tobacco-free nicotine pouches but differ in format, flavour range, and nicotine delivery. ZYN uses a drier pouch with a slower nicotine release, while VELO tends to be slightly moister with faster onset. ZYN offers fewer flavours but dominates in the US market; VELO has a wider flavour range and leads in most European markets. Our ZYN vs VELO comparison covers all the differences in detail."
      }
    },
    {
      "@type": "Question",
      "name": "Which nicotine pouch brand is the strongest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The strongest nicotine pouches come from brands like NOiS (up to 50 mg), Rabbit (up to 40 mg), CUBA (up to 43 mg), and Siberia (33 mg per gram). Most mainstream brands like ZYN and VELO max out around 10-17 mg per pouch. Ultra-strong pouches above 20 mg are intended for experienced users only."
      }
    },
    {
      "@type": "Question",
      "name": "Are all nicotine pouch brands tobacco-free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all brands sold at SnusFriend are 100% tobacco-free. Nicotine pouches use pharmaceutical-grade or synthetic nicotine combined with plant-based fibres, flavourings, and pH adjusters — there is no tobacco leaf in any product. This distinguishes them from traditional snus, which contains ground tobacco."
      }
    },
    {
      "@type": "Question",
      "name": "How many nicotine pouch brands does SnusFriend carry?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SnusFriend currently stocks products from over 50 nicotine pouch brands, ranging from global manufacturers like ZYN (Philip Morris International), VELO (British American Tobacco), and ON! (Altria) to independent Scandinavian labels like LOOP, Skruf, FUMI, and Kelly White. Our catalogue is updated regularly as new brands launch."
      }
    }
  ]
})} />
```

### 5C — Blog Index Page (`/blog`)

Add before the closing `</Shop>` tag:

```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the side effects of nicotine pouches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common side effects include a tingling or burning sensation under the lip, hiccups, and mild nausea — especially for new users or when using a higher strength than your tolerance allows. These effects are typically temporary and subside as you adjust. Reducing your strength or switching to a smaller pouch format usually helps. Our side effects guide covers each symptom in detail."
      }
    },
    {
      "@type": "Question",
      "name": "Are nicotine pouches legal in Europe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nicotine pouches are legal to buy and use in most European countries, including Sweden, Germany, the UK, Spain, Italy, and Poland. However, France banned commercial sales in February 2025, the Netherlands introduced a retail ban the same month, and Luxembourg effectively banned them in November 2025. The EU's Tobacco Products Directive 3 (TPD3), expected in draft form by mid-2026, will introduce harmonised regulation across member states."
      }
    },
    {
      "@type": "Question",
      "name": "How do I switch from cigarettes to nicotine pouches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start by matching your cigarette intake to an appropriate pouch strength: light smokers (under 10 per day) should try 4-6 mg pouches, moderate smokers (10-20 per day) should start at 6-10 mg, and heavy smokers may need 10-14 mg. Use a pouch whenever you feel a craving. Most people adjust within one to two weeks. Our switching guide provides a week-by-week transition plan."
      }
    },
    {
      "@type": "Question",
      "name": "Which nicotine pouch flavour is best for beginners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mint is the most popular starting flavour — it accounts for an estimated 45-60% of all nicotine pouch sales and offers a familiar, refreshing taste. Spearmint and peppermint are milder options, while menthol provides more cooling. If you dislike mint, citrus flavours (lemon, bergamot) are the next most popular choice for newcomers."
      }
    },
    {
      "@type": "Question",
      "name": "How should I store nicotine pouches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Store nicotine pouches in a cool, dry place away from direct sunlight. An unopened can typically stays fresh for 12 to 14 months from the production date. Once opened, the pouches are best used within a week or two, as they will gradually dry out and lose flavour intensity. Refrigeration can extend freshness but is not required."
      }
    }
  ]
})} />
```

---

## TASK 6 — External Authority Links for Blog Posts

Verified, live links for Claude Code to weave into existing blog posts as inline citations:

### Medical / Scientific
| Link | Organization | Use In |
|------|-------------|--------|
| https://www.cochrane.org/evidence/CD016220 | Cochrane Library | nicotine-pouches-vs-snus, switching-from-cigarettes |
| https://pmc.ncbi.nlm.nih.gov/articles/PMC10944327/ | PMC — Harm Reduction Scoping Review | nicotine-pouches-vs-snus, what-are-nicotine-pouches |
| https://www.nature.com/articles/s41415-023-6383-7 | British Dental Journal | nicotine-pouch-side-effects |
| https://link.springer.com/article/10.1186/s12903-024-04598-8 | BMC Oral Health | nicotine-pouch-side-effects, how-long-do-nicotine-pouches-last |
| https://academic.oup.com/ntr/article/27/4/598/7693924 | Nicotine & Tobacco Research | what-are-nicotine-pouches |

### Regulatory / Government
| Link | Organization | Use In |
|------|-------------|--------|
| https://www.fda.gov/news-events/press-announcements/fda-authorizes-marketing-20-zyn-nicotine-pouch-products-after-extensive-scientific-review | FDA (ZYN PMTA) | zyn-nicotine-pouches-complete-guide, zyn-vs-velo-2026 |
| https://health.ec.europa.eu/tobacco/product-regulation/implementing-tobacco-products-directive-directive-201440eu/revision-tobacco-products-directive_en | EU Commission (TPD3) | nicotine-pouch-buying-guide-europe |
| https://www.cdc.gov/tobacco/nicotine-pouches/index.html | CDC Nicotine Pouches | what-are-nicotine-pouches, nicotine-pouch-side-effects |

### Harm Reduction
| Link | Organization | Use In |
|------|-------------|--------|
| https://www.rcp.ac.uk/improving-care/resources/nicotine-without-smoke-tobacco-harm-reduction/ | Royal College of Physicians | switching-from-cigarettes, nicotine-pouches-vs-snus |
| https://ash.org.uk/media-centre/news/press-releases/ash-calls-for-swift-legislation-on-nicotine-pouches | ASH UK | nicotine-pouch-buying-guide-europe |

### Brand / Industry
| Link | Organization | Use In |
|------|-------------|--------|
| https://www.pmi.com/sustainability/fundamentals/nicotine-science/ | PMI Nicotine Science | zyn-nicotine-pouches-complete-guide (disclose manufacturer source) |
| https://www.grandviewresearch.com/industry-analysis/nicotine-pouches-market-report | Grand View Research | nicotine-pouch-buying-guide-europe |

### Safety
| Link | Organization | Use In |
|------|-------------|--------|
| https://my.clevelandclinic.org/health/diseases/21582-nicotine-poisoning | Cleveland Clinic | nicotine-pouch-side-effects, strongest-nicotine-pouches-ranked-2026 |
| https://www.fda.gov/consumers/consumer-updates/properly-store-nicotine-pouches-prevent-accidental-exposure-children-and-pets | FDA Storage Safety | how-long-do-nicotine-pouches-last |

---

## TASK 7 — Brand Descriptions

**Status: Already complete.** All brands with active products in the catalogue already have descriptions in the Supabase `brands` table. The only brand without a description that has a product is "Unknown" (1 product), which is a catch-all and does not need marketing copy. No action required.

**Note:** The ON! brand still shows the old manufacturer name "Burger Söhne (Altria)" in the database. The content audit from earlier today identified this should be "Helix Innovations (Altria)". Claude Code should update this in a migration.

---

## Implementation Notes for Claude Code

1. **Brands page** — Replace the entire `<div class="mb-8">` header block (lines 50–57) with the Task 1 copy.
2. **Homepage** — Insert the Task 2 section between "Trust Signals" (`</section>` at ~line 166) and "Shop by Brand" (`<section>` at ~line 168).
3. **Nicotine pouches page** — Insert Task 3 copy after line 83 (after the quick-category nav grid closes), before `</article>`.
4. **Blog index** — Replace the single `<p>` at line 162 with the Task 4 `<div>` block. Also remove the old `mb-10` class from the `<p>` since the new `<div>` has its own `mb-10`.
5. **FAQ schemas** — Add each Task 5 `<script>` block before the closing `</Shop>` tag on its respective page. These are additive — don't remove existing schemas.
6. **Authority links** — Task 6 links should be added as inline citations in existing blog posts during the next content pass.
7. **ON! manufacturer** — Run a Supabase migration: `UPDATE brands SET manufacturer = 'Helix Innovations (Altria)' WHERE slug = 'on';`
