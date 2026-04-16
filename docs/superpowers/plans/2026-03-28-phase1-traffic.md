# Phase 1: Traffic — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 171+ programmatic SEO pages, integrate 10 editorial articles, add 5 country landing pages, and fix indexing blockers — targeting 250K+ monthly search volume.

**Architecture:** Three new Astro page templates under `src/pages/brands/[slug]/` generate 171 pages at build time from existing Supabase content layer data. Country pages use a static TypeScript data map. Editorial articles arrive as HTML from Cowork and get pasted into `.astro` files. All pages are SSG with JSON-LD schemas.

**Tech Stack:** Astro 6, Supabase Content Layer, TypeScript, JSON-LD, Vercel SSG

---

## File Map

### New files (programmatic pages)
- `src/pages/brands/[slug]/flavours.astro` — Brand flavour guide (57 pages)
- `src/pages/brands/[slug]/strengths.astro` — Brand strength guide (57 pages)
- `src/pages/brands/[slug]/review.astro` — Brand review/overview (57 pages)

### New files (country pages)
- `src/pages/countries/[slug].astro` — Country-specific landing page (5-8 pages)
- `src/data/countries.ts` — Static country data map (legal status, shipping info, etc.)

### New files (editorial — created as Cowork delivers)
- `src/pages/blog/zyn-flavours-complete-guide.astro`
- `src/pages/blog/velo-flavours-complete-guide.astro`
- `src/pages/blog/best-nicotine-pouches-2026.astro`
- `src/pages/blog/how-to-use-nicotine-pouches.astro`
- `src/pages/blog/nicotine-pouches-vs-vaping.astro`
- `src/pages/blog/nicotine-pouches-legal-europe-2026.astro`
- `src/pages/blog/nicotine-pouch-flavour-guide.astro`
- `src/pages/blog/pablo-nicotine-pouches-complete-guide.astro`
- `src/pages/blog/iceberg-nicotine-pouches-complete-guide.astro`
- `src/pages/blog/nicotine-pouches-vs-gum-vs-lozenges.astro`

### Modified files
- `astro.config.mjs` — Update sitemap filter to exclude country auth/checkout pages
- `src/components/astro/Footer.astro` — Add link to /countries or key country pages
- `src/pages/brands/[slug].astro` — Add links to flavours/strengths/review sub-pages
- `src/pages/blog/index.astro` — Add new articles to the articles array
- `src/pages/rss.xml.ts` — Add new articles to RSS feed

---

## Task 1: Brand Flavours Programmatic Page

**Files:**
- Create: `src/pages/brands/[slug]/flavours.astro`

- [ ] **Step 1: Create the brand flavours template**

```astro
---
export const prerender = true;
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import ProductCard from '@/components/astro/ProductCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const brands = await getCollection('brands');
  const allProducts = await getCollection('products');

  return brands
    .filter((brand) => allProducts.some((p) => p.data.brandSlug === brand.id))
    .map((brand) => {
      const products = allProducts.filter((p) => p.data.brandSlug === brand.id);
      const flavourGroups = new Map<string, typeof products>();
      for (const p of products) {
        const key = p.data.flavorKey;
        if (!flavourGroups.has(key)) flavourGroups.set(key, []);
        flavourGroups.get(key)!.push(p);
      }
      return {
        params: { slug: brand.id },
        props: { brand, products, flavourGroups: Object.fromEntries(flavourGroups) },
      };
    });
}

const { brand, products, flavourGroups } = Astro.props;
const b = brand.data;
const flavourCount = Object.keys(flavourGroups).length;

const flavourLabels: Record<string, string> = {
  mint: 'Mint', citrus: 'Citrus', berry: 'Berry', fruit: 'Fruit',
  coffee: 'Coffee', cola: 'Cola', menthol: 'Menthol', wintergreen: 'Wintergreen',
  tropical: 'Tropical', ice: 'Ice', original: 'Original', licorice: 'Licorice',
};

const title = `${b.name} Flavours: Complete Guide & Full Range`;
const description = `Explore all ${products.length} ${b.name} nicotine pouches across ${flavourCount} flavour categories. Compare tastes, strengths, and find your perfect ${b.name} pouch.`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `${b.name} Flavours`,
  description,
  url: `https://snusfriends.com/brands/${brand.id}/flavours`,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://snusfriends.com/products/${p.id}`,
      name: p.data.name,
    })),
  },
};
---

<Shop title={title} description={description} canonical={`/brands/${brand.id}/flavours`}>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

  <div class="mx-auto max-w-7xl px-4 py-8">
    <Breadcrumb items={[
      { label: 'Brands', href: '/brands' },
      { label: b.name, href: `/brands/${brand.id}` },
      { label: 'Flavours' },
    ]} />

    <div class="mb-8 max-w-3xl">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {b.name} Flavours: Complete Range
      </h1>
      <p class="mt-3 text-base leading-relaxed text-muted-foreground">
        {b.name} offers <strong class="text-foreground">{products.length} nicotine pouches</strong> across
        <strong class="text-foreground">{flavourCount} flavour {flavourCount === 1 ? 'category' : 'categories'}</strong>.
        Browse by flavour below to find your perfect {b.name} pouch, or visit the
        <a href={`/brands/${brand.id}/strengths`} class="underline hover:text-foreground">strength guide</a> to
        compare nicotine levels across the range.
      </p>
    </div>

    {Object.entries(flavourGroups).sort(([, a], [, b]) => b.length - a.length).map(([key, group]) => (
      <section class="mb-12">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          {flavourLabels[key] ?? key} ({group.length} {group.length === 1 ? 'product' : 'products'})
        </h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {group.sort((a, b) => a.data.nicotineContent - b.data.nicotineContent).map((p) => (
            <ProductCard product={p.data} slug={p.id} />
          ))}
        </div>
      </section>
    ))}

    <div class="mt-12 rounded-xl border border-border bg-card/60 p-8 text-center">
      <h2 class="text-xl font-semibold text-foreground mb-3">Explore More {b.name}</h2>
      <div class="flex flex-wrap justify-center gap-3">
        <a href={`/brands/${brand.id}`} class="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary/30">All {b.name} Products</a>
        <a href={`/brands/${brand.id}/strengths`} class="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary/30">{b.name} Strength Guide</a>
        <a href={`/brands/${brand.id}/review`} class="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary/30">{b.name} Review</a>
      </div>
    </div>
  </div>
</Shop>
```

- [ ] **Step 2: Build and verify**

Run: `bun run build 2>&1 | tail -15`
Expected: Build completes successfully. Check output for `/brands/zyn/flavours/index.html` in the generated pages.

- [ ] **Step 3: Spot-check a generated page**

Run: `cat dist/client/brands/zyn/flavours/index.html | grep -o '<h1[^>]*>[^<]*</h1>' | head -1`
Expected: `<h1 ...>ZYN Flavours: Complete Range</h1>`

- [ ] **Step 4: Commit**

```bash
git add src/pages/brands/\[slug\]/flavours.astro
git commit -m "feat: add programmatic brand flavours pages (57 pages)"
```

---

## Task 2: Brand Strengths Programmatic Page

**Files:**
- Create: `src/pages/brands/[slug]/strengths.astro`

- [ ] **Step 1: Create the brand strengths template**

```astro
---
export const prerender = true;
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import ProductCard from '@/components/astro/ProductCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const brands = await getCollection('brands');
  const allProducts = await getCollection('products');

  return brands
    .filter((brand) => allProducts.some((p) => p.data.brandSlug === brand.id))
    .map((brand) => {
      const products = allProducts.filter((p) => p.data.brandSlug === brand.id);
      return { params: { slug: brand.id }, props: { brand, products } };
    });
}

const { brand, products } = Astro.props;
const b = brand.data;

const strengthOrder = ['light', 'normal', 'strong', 'extra-strong', 'super-strong'];
const strengthLabels: Record<string, string> = {
  light: 'Light (1-4mg)', normal: 'Normal (4-6mg)', strong: 'Strong (6-12mg)',
  'extra-strong': 'Extra Strong (12-20mg)', 'super-strong': 'Super Strong (20mg+)',
};

const strengthGroups = new Map<string, typeof products>();
for (const p of products) {
  const key = p.data.strengthKey;
  if (!strengthGroups.has(key)) strengthGroups.set(key, []);
  strengthGroups.get(key)!.push(p);
}

const minMg = Math.min(...products.map((p) => p.data.nicotineContent).filter(Boolean));
const maxMg = Math.max(...products.map((p) => p.data.nicotineContent).filter(Boolean));

const title = `${b.name} Nicotine Strengths: ${minMg}mg to ${maxMg}mg Guide`;
const description = `Compare all ${b.name} nicotine pouch strengths from ${minMg}mg to ${maxMg}mg. ${products.length} products across ${strengthGroups.size} strength levels with detailed comparison.`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `${b.name} Nicotine Strengths`,
  description,
  url: `https://snusfriends.com/brands/${brand.id}/strengths`,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://snusfriends.com/products/${p.id}`,
      name: p.data.name,
    })),
  },
};
---

<Shop title={title} description={description} canonical={`/brands/${brand.id}/strengths`}>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

  <div class="mx-auto max-w-7xl px-4 py-8">
    <Breadcrumb items={[
      { label: 'Brands', href: '/brands' },
      { label: b.name, href: `/brands/${brand.id}` },
      { label: 'Strengths' },
    ]} />

    <div class="mb-8 max-w-3xl">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {b.name} Nicotine Strengths: {minMg}mg to {maxMg}mg
      </h1>
      <p class="mt-3 text-base leading-relaxed text-muted-foreground">
        {b.name} offers nicotine pouches ranging from <strong class="text-foreground">{minMg}mg</strong> to
        <strong class="text-foreground">{maxMg}mg</strong> per pouch across {strengthGroups.size} strength levels.
        Not sure which strength is right for you? Read our
        <a href="/blog/how-to-choose-your-strength" class="underline hover:text-foreground">strength guide</a> or
        explore <a href={`/brands/${brand.id}/flavours`} class="underline hover:text-foreground">{b.name} flavours</a>.
      </p>
    </div>

    <!-- Strength comparison table -->
    <div class="mb-10 overflow-x-auto">
      <table class="w-full text-sm border border-border rounded-lg">
        <thead class="bg-muted/30">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-foreground">Strength Level</th>
            <th class="px-4 py-3 text-left font-semibold text-foreground">Range</th>
            <th class="px-4 py-3 text-left font-semibold text-foreground">Products</th>
            <th class="px-4 py-3 text-left font-semibold text-foreground">Best For</th>
          </tr>
        </thead>
        <tbody>
          {strengthOrder.filter((k) => strengthGroups.has(k)).map((key) => (
            <tr class="border-t border-border">
              <td class="px-4 py-3 font-medium text-foreground">{strengthLabels[key]?.split(' (')[0]}</td>
              <td class="px-4 py-3 text-muted-foreground">{strengthLabels[key]?.match(/\(([^)]+)\)/)?.[1]}</td>
              <td class="px-4 py-3 text-muted-foreground">{strengthGroups.get(key)?.length}</td>
              <td class="px-4 py-3 text-muted-foreground">
                {key === 'light' && 'Beginners, light smokers'}
                {key === 'normal' && 'Daily use, most users'}
                {key === 'strong' && 'Experienced users, ex-smokers'}
                {key === 'extra-strong' && 'High tolerance users'}
                {key === 'super-strong' && 'Extreme — experienced only'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {strengthOrder.filter((k) => strengthGroups.has(k)).map((key) => (
      <section class="mb-12">
        <h2 class="mb-4 text-xl font-semibold text-foreground">
          {strengthLabels[key]} ({strengthGroups.get(key)!.length} {strengthGroups.get(key)!.length === 1 ? 'product' : 'products'})
        </h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {strengthGroups.get(key)!.sort((a, b) => a.data.nicotineContent - b.data.nicotineContent).map((p) => (
            <ProductCard product={p.data} slug={p.id} />
          ))}
        </div>
      </section>
    ))}
  </div>
</Shop>
```

- [ ] **Step 2: Build and verify**

Run: `bun run build 2>&1 | tail -15`
Expected: Build succeeds. Verify `/brands/zyn/strengths/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/brands/\[slug\]/strengths.astro
git commit -m "feat: add programmatic brand strengths pages (57 pages)"
```

---

## Task 3: Brand Review Programmatic Page

**Files:**
- Create: `src/pages/brands/[slug]/review.astro`

- [ ] **Step 1: Create the brand review template**

```astro
---
export const prerender = true;
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const brands = await getCollection('brands');
  const allProducts = await getCollection('products');

  return brands
    .filter((brand) => allProducts.some((p) => p.data.brandSlug === brand.id))
    .map((brand) => {
      const products = allProducts.filter((p) => p.data.brandSlug === brand.id);
      return { params: { slug: brand.id }, props: { brand, products } };
    });
}

const { brand, products } = Astro.props;
const b = brand.data;

const strengthKeys = [...new Set(products.map((p) => p.data.strengthKey))];
const flavourKeys = [...new Set(products.map((p) => p.data.flavorKey))];
const nicotineValues = products.map((p) => p.data.nicotineContent).filter(Boolean);
const minMg = Math.min(...nicotineValues);
const maxMg = Math.max(...nicotineValues);
const avgRating = products.reduce((s, p) => s + p.data.ratings, 0) / products.length;
const prices = products.flatMap((p) => Object.values(p.data.prices).filter((v): v is number => typeof v === 'number' && v > 0));
const minPrice = Math.min(...prices);

const flavourLabels: Record<string, string> = {
  mint: 'Mint', citrus: 'Citrus', berry: 'Berry', fruit: 'Fruit',
  coffee: 'Coffee', cola: 'Cola', menthol: 'Menthol', wintergreen: 'Wintergreen',
  tropical: 'Tropical', ice: 'Ice', original: 'Original', licorice: 'Licorice',
};
const strengthLabels: Record<string, string> = {
  light: 'Light', normal: 'Normal', strong: 'Strong',
  'extra-strong': 'Extra Strong', 'super-strong': 'Super Strong',
};

const title = `${b.name} Nicotine Pouches Review: ${products.length} Products Rated`;
const description = `Honest ${b.name} review — ${products.length} products, ${flavourKeys.length} flavours, ${minMg}-${maxMg}mg strength range. Prices from €${minPrice.toFixed(2)}. Everything you need to know before buying.`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: {
    '@type': 'Brand',
    name: b.name,
    ...(b.logoUrl && { logo: b.logoUrl }),
  },
  author: { '@type': 'Organization', name: 'SnusFriends Editorial' },
  reviewBody: description,
  publisher: { '@type': 'Organization', name: 'SnusFriend', url: 'https://snusfriends.com' },
};
---

<Shop title={title} description={description} canonical={`/brands/${brand.id}/review`}>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

  <div class="mx-auto max-w-4xl px-4 py-8">
    <Breadcrumb items={[
      { label: 'Brands', href: '/brands' },
      { label: b.name, href: `/brands/${brand.id}` },
      { label: 'Review' },
    ]} />

    <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
      {b.name} Nicotine Pouches: Full Brand Review
    </h1>

    <!-- Quick stats -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
      <div class="rounded-xl border border-border bg-card/60 p-4 text-center">
        <div class="text-2xl font-bold text-foreground">{products.length}</div>
        <div class="text-xs text-muted-foreground">Products</div>
      </div>
      <div class="rounded-xl border border-border bg-card/60 p-4 text-center">
        <div class="text-2xl font-bold text-foreground">{flavourKeys.length}</div>
        <div class="text-xs text-muted-foreground">Flavours</div>
      </div>
      <div class="rounded-xl border border-border bg-card/60 p-4 text-center">
        <div class="text-2xl font-bold text-foreground">{minMg}-{maxMg}mg</div>
        <div class="text-xs text-muted-foreground">Strength Range</div>
      </div>
      <div class="rounded-xl border border-border bg-card/60 p-4 text-center">
        <div class="text-2xl font-bold text-foreground">€{minPrice.toFixed(2)}</div>
        <div class="text-xs text-muted-foreground">From (per can)</div>
      </div>
    </div>

    <div class="space-y-6 text-base leading-relaxed text-muted-foreground max-w-3xl">
      {b.description && <p>{b.description}</p>}

      <h2 class="text-xl font-semibold text-foreground">What {b.name} Offers</h2>
      <p>
        {b.name} currently has <strong class="text-foreground">{products.length} products</strong> in our catalogue,
        spanning {flavourKeys.length} flavour {flavourKeys.length === 1 ? 'category' : 'categories'}
        ({flavourKeys.map((k) => flavourLabels[k] ?? k).join(', ')}) and
        {strengthKeys.length} strength {strengthKeys.length === 1 ? 'level' : 'levels'}
        ({strengthKeys.map((k) => strengthLabels[k] ?? k).join(', ')}).
        {b.manufacturer && ` Manufactured by ${b.manufacturer}.`}
      </p>

      <h2 class="text-xl font-semibold text-foreground">Who Is {b.name} Best For?</h2>
      <p>
        {maxMg <= 6 && `${b.name} focuses on lighter strengths, making it an excellent choice for beginners and users who prefer a gentle nicotine experience with emphasis on flavour.`}
        {maxMg > 6 && maxMg <= 14 && `${b.name} covers the light to strong range, suitable for most regular pouch users. A solid all-rounder brand.`}
        {maxMg > 14 && maxMg <= 25 && `${b.name} offers a wide strength range that caters to both beginners and experienced users looking for a stronger kick.`}
        {maxMg > 25 && `${b.name} includes ultra-strong options above 20mg — strictly for experienced users with established tolerance. Start with the lower strengths and work up.`}
      </p>

      <h2 class="text-xl font-semibold text-foreground">Explore {b.name}</h2>
      <div class="flex flex-wrap gap-3">
        <a href={`/brands/${brand.id}`} class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30">All {b.name} Products</a>
        <a href={`/brands/${brand.id}/flavours`} class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30">{b.name} Flavours</a>
        <a href={`/brands/${brand.id}/strengths`} class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30">{b.name} Strengths</a>
      </div>
    </div>
  </div>
</Shop>
```

- [ ] **Step 2: Build and verify**

Run: `bun run build 2>&1 | tail -15`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/pages/brands/\[slug\]/review.astro
git commit -m "feat: add programmatic brand review pages (57 pages)"
```

---

## Task 4: Cross-Link Brand Sub-Pages from Main Brand Page

**Files:**
- Modify: `src/pages/brands/[slug].astro`

- [ ] **Step 1: Add navigation links to brand sub-pages**

After the brand description section and before the product grid, add:

```astro
<!-- Brand sub-pages nav -->
<div class="mb-8 flex flex-wrap gap-3">
  <a href={`/brands/${brand.id}/flavours`} class="rounded-lg border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">
    {b.name} Flavours
  </a>
  <a href={`/brands/${brand.id}/strengths`} class="rounded-lg border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">
    {b.name} Strengths
  </a>
  <a href={`/brands/${brand.id}/review`} class="rounded-lg border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5">
    {b.name} Review
  </a>
</div>
```

- [ ] **Step 2: Build and verify**

Run: `bun run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add src/pages/brands/\[slug\].astro
git commit -m "feat: cross-link brand sub-pages from main brand page"
```

---

## Task 5: Country Landing Pages

**Files:**
- Create: `src/data/countries.ts`
- Create: `src/pages/countries/[slug].astro`

- [ ] **Step 1: Create country data map**

Create `src/data/countries.ts` with static data for each target market:

```typescript
export interface CountryData {
  name: string;
  slug: string;
  code: string;
  legalStatus: 'legal' | 'restricted' | 'banned';
  legalNote: string;
  ageLimit: number;
  shippingNote: string;
  popularBrands: string[];
  h1: string;
  metaDescription: string;
  intro: string;
}

export const countries: CountryData[] = [
  {
    name: 'Germany',
    slug: 'germany',
    code: 'DE',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal to buy and use in Germany. They are classified as consumer products, not tobacco products, and are widely available online and in physical stores.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Germany from our EU warehouse. Standard delivery takes 3-5 business days. Free shipping on orders over €29.',
    popularBrands: ['zyn', 'velo', 'skruf', 'loop', 'nordic-spirit'],
    h1: 'Buy Nicotine Pouches in Germany',
    metaDescription: 'Buy nicotine pouches in Germany — legal, 18+, fast EU delivery. Shop ZYN, VELO, Skruf, LOOP from SnusFriend. Free shipping over €29.',
    intro: 'Germany is one of Europe\'s largest nicotine pouch markets, with growing demand driven by health-conscious consumers switching from cigarettes and vaping. Nicotine pouches are legal, widely available, and not subject to the tobacco advertising restrictions that limit traditional snus. All major brands — ZYN, VELO, Skruf, LOOP, and Nordic Spirit — are available for delivery to German addresses.',
  },
  {
    name: 'United Kingdom',
    slug: 'uk',
    code: 'GB',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal in the UK and regulated as consumer products. The UK government has indicated support for tobacco harm reduction, making pouches widely accessible.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to the UK. Delivery typically takes 5-7 business days. Free shipping on orders over €29.',
    popularBrands: ['velo', 'zyn', 'nordic-spirit', 'loop', 'white-fox'],
    h1: 'Buy Nicotine Pouches in the UK',
    metaDescription: 'Buy nicotine pouches in the UK — legal, 18+, EU delivery. Shop VELO, ZYN, Nordic Spirit, LOOP. Free shipping over €29 from SnusFriend.',
    intro: 'The UK is one of Europe\'s most progressive markets for tobacco harm reduction, and nicotine pouches have seen rapid growth since 2020. VELO (by BAT, headquartered in London) leads the UK market, followed by ZYN and Nordic Spirit. The UK government\'s supportive stance on nicotine alternatives means pouches are legal, widely available in convenience stores and supermarkets, and increasingly popular as a smoking cessation tool.',
  },
  {
    name: 'Sweden',
    slug: 'sweden',
    code: 'SE',
    legalStatus: 'legal',
    legalNote: 'Sweden is the birthplace of both snus and modern nicotine pouches. Both are legal and culturally mainstream. Sweden has the lowest smoking rate in the EU, partly attributed to the popularity of oral nicotine products.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Sweden from our EU warehouse. Standard delivery takes 2-4 business days.',
    popularBrands: ['zyn', 'loop', 'skruf', 'velo', 'lundgrens'],
    h1: 'Buy Nicotine Pouches in Sweden',
    metaDescription: 'Buy nicotine pouches in Sweden — the home of snus. Shop ZYN, LOOP, Skruf, VELO. Fast delivery from SnusFriend.',
    intro: 'Sweden is where nicotine pouches were born. Swedish Match (now part of Philip Morris) launched ZYN here, and the country\'s long tradition of snus use created the perfect market for tobacco-free alternatives. Swedish consumers are the most experienced pouch users in the world, with brands like LOOP (Another Snus Factory), Skruf, FUMI, and Lundgrens all originating here. The Swedish market is sophisticated — users are knowledgeable about strength levels, pouch formats, and flavour profiles.',
  },
  {
    name: 'Spain',
    slug: 'spain',
    code: 'ES',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal in Spain. They are not classified as tobacco products and can be sold online and in stores without tobacco-specific restrictions.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Spain. Standard delivery takes 4-6 business days. Free shipping on orders over €29.',
    popularBrands: ['velo', 'zyn', 'pablo', 'killa', 'cuba'],
    h1: 'Buy Nicotine Pouches in Spain',
    metaDescription: 'Buy nicotine pouches in Spain — legal, 18+, EU delivery. Shop VELO, ZYN, Pablo, Killa. Free shipping over €29 from SnusFriend.',
    intro: 'Spain\'s nicotine pouch market is one of Europe\'s fastest-growing, driven by warm-weather lifestyles where discreet, smokeless products are particularly appealing. VELO and ZYN lead the market, while brands like Pablo and Killa have built strong followings among younger consumers. Spanish regulations are relatively permissive compared to neighbouring France, making Spain an increasingly important market for online pouch retailers.',
  },
  {
    name: 'Italy',
    slug: 'italy',
    code: 'IT',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal in Italy. As tobacco-free products, they are not subject to the state tobacco monopoly that governs cigarette sales.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Italy. Standard delivery takes 4-6 business days. Free shipping on orders over €29.',
    popularBrands: ['velo', 'zyn', 'pablo', 'loop', 'nordic-spirit'],
    h1: 'Buy Nicotine Pouches in Italy',
    metaDescription: 'Buy nicotine pouches in Italy — legal, 18+, fast EU delivery. Shop VELO, ZYN, Pablo, LOOP. Free shipping over €29.',
    intro: 'Italy\'s nicotine pouch market is emerging rapidly, particularly among younger adults and former smokers. Because nicotine pouches contain no tobacco, they bypass the Italian state tobacco monopoly (Monopolio di Stato) that controls cigarette distribution. This has allowed online retailers to serve Italian consumers directly. VELO and ZYN are the most recognised brands, with Pablo and LOOP gaining traction in urban areas.',
  },
];
```

- [ ] **Step 2: Create the country page template**

Create `src/pages/countries/[slug].astro`:

```astro
---
export const prerender = true;
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { countries } from '@/data/countries';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  return countries.map((c) => ({ params: { slug: c.slug }, props: { country: c } }));
}

const { country } = Astro.props;
const allBrands = await getCollection('brands');
const popularBrands = country.popularBrands
  .map((slug) => allBrands.find((b) => b.id === slug))
  .filter(Boolean);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: country.h1,
  description: country.metaDescription,
  url: `https://snusfriends.com/countries/${country.slug}`,
};
---

<Shop title={`${country.h1} | SnusFriend`} description={country.metaDescription} canonical={`/countries/${country.slug}`}>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

  <div class="mx-auto max-w-4xl px-4 py-8">
    <Breadcrumb items={[
      { label: 'Nicotine Pouches', href: '/nicotine-pouches' },
      { label: country.name },
    ]} />

    <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
      {country.h1}
    </h1>

    <div class="space-y-6 text-base leading-relaxed text-muted-foreground max-w-3xl">
      <p>{country.intro}</p>

      <h2 class="text-xl font-semibold text-foreground">Legal Status</h2>
      <div class="rounded-xl border border-border bg-card/60 p-6">
        <div class="flex items-center gap-3 mb-3">
          <span class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            country.legalStatus === 'legal' ? 'bg-emerald-500/10 text-emerald-600' :
            country.legalStatus === 'restricted' ? 'bg-amber-500/10 text-amber-600' :
            'bg-red-500/10 text-red-600'
          }`}>
            {country.legalStatus === 'legal' ? 'Legal' : country.legalStatus === 'restricted' ? 'Restricted' : 'Banned'}
          </span>
          <span class="text-sm text-muted-foreground">Age limit: {country.ageLimit}+</span>
        </div>
        <p class="text-sm text-muted-foreground">{country.legalNote}</p>
      </div>

      <h2 class="text-xl font-semibold text-foreground">Popular Brands in {country.name}</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {popularBrands.map((brand) => brand && (
          <a href={`/brands/${brand.id}`} class="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 transition hover:border-primary/30">
            <span class="font-medium text-foreground">{brand.data.name}</span>
          </a>
        ))}
      </div>

      <h2 class="text-xl font-semibold text-foreground">Shipping to {country.name}</h2>
      <p>{country.shippingNote}</p>

      <h2 class="text-xl font-semibold text-foreground">Start Shopping</h2>
      <div class="flex flex-wrap gap-3">
        <a href="/nicotine-pouches" class="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Browse All Pouches</a>
        <a href="/brands" class="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-primary/30">View All Brands</a>
        <a href="/blog/best-nicotine-pouches-for-beginners-2026" class="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-primary/30">Beginner's Guide</a>
      </div>
    </div>
  </div>
</Shop>
```

- [ ] **Step 3: Build and verify**

Run: `bun run build 2>&1 | tail -15`
Expected: Build succeeds with `/countries/germany/index.html`, `/countries/uk/index.html`, etc.

- [ ] **Step 4: Commit**

```bash
git add src/data/countries.ts src/pages/countries/\[slug\].astro
git commit -m "feat: add country-specific landing pages (5 countries)"
```

---

## Task 6: Update Sitemap, Footer, and Navigation

**Files:**
- Modify: `astro.config.mjs` — ensure country and brand sub-pages are in sitemap
- Modify: `src/components/astro/Footer.astro` — add country links

- [ ] **Step 1: Verify sitemap includes new pages**

The new pages use `prerender = true` so they'll be auto-included by `@astrojs/sitemap`. Verify after build:

Run: `bun run build && grep -c '<loc>' dist/client/sitemap-0.xml`
Expected: Count should be 925 + 171 (brand sub-pages) + 5 (countries) ≈ 1,100+

- [ ] **Step 2: Add country links to footer**

Add a "Shop by Country" section or add key country links to the existing footer Shop column.

- [ ] **Step 3: Build, verify, commit**

```bash
git add astro.config.mjs src/components/astro/Footer.astro
git commit -m "feat: update sitemap and footer with new page links"
```

---

## Task 7: Integrate Cowork Editorial Articles (repeatable)

This task is repeated for each batch of articles Cowork delivers. The process for each article:

**Files:**
- Create: `src/pages/blog/<slug>.astro`
- Modify: `src/pages/blog/index.astro` (add to articles array)
- Modify: `src/pages/rss.xml.ts` (add to RSS items)

- [ ] **Step 1: Create the .astro file from Cowork HTML**

Take the HTML content + JSON-LD from the deliverable. Wrap in the standard blog template:

```astro
---
export const prerender = true;
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';
---

<Shop
  title="[Meta title from deliverable] | SnusFriend"
  description="[Meta description from deliverable]"
  canonical="/blog/[slug]"
  ogType="article"
>
  <!-- BlogPosting JSON-LD from deliverable -->
  <script type="application/ld+json" set:html={JSON.stringify({...})} />
  <!-- FAQPage JSON-LD from deliverable -->
  <script type="application/ld+json" set:html={JSON.stringify({...})} />

  <article class="mx-auto max-w-3xl px-4 py-12">
    <Breadcrumb items={[
      { label: 'Blog', href: '/blog' },
      { label: '[Article title]' },
    ]} />

    <!-- Paste HTML content from deliverable here -->
  </article>
</Shop>
```

- [ ] **Step 2: Add to blog index articles array**

In `src/pages/blog/index.astro`, add the new article to the `articles` array.

- [ ] **Step 3: Add to RSS feed**

In `src/pages/rss.xml.ts`, add the article to the `articles` array.

- [ ] **Step 4: Build and verify**

Run: `bun run build 2>&1 | tail -5`

- [ ] **Step 5: Commit**

```bash
git add src/pages/blog/<slug>.astro src/pages/blog/index.astro src/pages/rss.xml.ts
git commit -m "feat: add blog post — [article title]"
```

---

## Task 8: Final Build, Deploy, and GSC Submission

- [ ] **Step 1: Full build**

Run: `bun run build 2>&1 | tail -20`
Verify: Page count in sitemap is 1,100+

- [ ] **Step 2: Push and promote**

```bash
git push origin astro-migration-clean
# Wait for Vercel build
echo "y" | npx vercel promote <deployment-url>
```

- [ ] **Step 3: Verify live pages**

Test a sample of new URLs:
- `https://snusfriends.com/brands/zyn/flavours`
- `https://snusfriends.com/brands/velo/strengths`
- `https://snusfriends.com/brands/zyn/review`
- `https://snusfriends.com/countries/germany`

- [ ] **Step 4: Submit to GSC**

Use GSC MCP to request indexing for key new pages.

---

## Phase 2 & 3 — Outlined (detailed plans written when Phase 1 completes)

### Phase 2 Tasks (Weeks 4-8)
- Task P2-1: Product comparison tool (/compare) — React island
- Task P2-2: Price-per-pouch display + filter + badge
- Task P2-3: Build Your Sampler page (/sampler) — React island
- Task P2-4: Enhanced multi-dimension reviews
- Task P2-5: Subscription/auto-reorder system

### Phase 3 Tasks (Weeks 8-16)
- Task P3-1: User flavour ratings (quick 1-tap ratings)
- Task P3-2: "What's In Your Rotation" collections
- Task P3-3: Ambassador program + referral tracking
- Task P3-4: User content contributions
- Task P3-5: Enhanced community leaderboard
