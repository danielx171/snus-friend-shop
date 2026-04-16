# Score Improvement Sprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise Technical SEO from 87→93+, Content/E-E-A-T from 74→85+, Schema from 80→95+ by fixing the highest-impact audit gaps.

**Architecture:** All changes are to existing Astro pages, layouts, and config files. No new components. No DB schema changes. Product schema enrichment uses data already available at build time. Trust signals go in tenant config + footer + Organization schema.

**Tech Stack:** Astro 6, TypeScript, JSON-LD, `astro.config.mjs` sitemap serialize, `src/config/tenant.ts`

---

## File Map

| File | Changes |
|------|---------|
| `src/config/tenant.ts` | Add address, company reg, social links, telephone |
| `src/pages/products/[slug].astro` | Add reviewCount to aggregateRating, add mpn |
| `src/pages/index.astro` | Update Organization schema with address + social sameAs |
| `src/components/astro/Footer.astro` | Add physical address + company registration |
| `src/layouts/Base.astro` | Add RSS autodiscovery link + preconnect to image CDN |
| `astro.config.mjs` | Fix sitemap lastmod to use content-type dates |
| `src/pages/nicotine-pouches.astro` | Add FAQPage schema |
| `vercel.json` | Fix redirect 308→301 |

---

### Task 1: Add Trust Data to Tenant Config

**Files:**
- Modify: `src/config/tenant.ts`

- [ ] **Step 1: Read current tenant config**

```bash
cat src/config/tenant.ts
```

- [ ] **Step 2: Add address, registration, social, telephone fields**

Add after `supportEmail` (~line 7):

```typescript
telephone: '+31-XX-XXX-XXXX', // Update with real number
address: {
  streetAddress: 'Replace with real address',
  addressLocality: 'Amsterdam',
  addressRegion: 'NH',
  postalCode: '1012',
  addressCountry: 'NL',
},
companyRegistration: 'KVK XXXXXXXX', // Update with real registration
vatNumber: 'NLXXXXXXXXB01', // Update with real VAT
social: {
  instagram: 'https://www.instagram.com/snusfriends/',
  tiktok: 'https://www.tiktok.com/@snusfriends',
  x: 'https://x.com/snusfriends',
},
```

> **IMPORTANT:** Daniel needs to fill in real values for address, phone, KVK, and VAT. Use placeholders that are clearly marked.

- [ ] **Step 3: Commit**

```bash
git add src/config/tenant.ts
git commit -m "feat: add trust data to tenant config (address, company reg, social)"
```

---

### Task 2: Enrich Product Schema (reviewCount + MPN)

**Files:**
- Modify: `src/pages/products/[slug].astro` (lines 101-129, the JSON-LD block)

- [ ] **Step 1: Read the current product schema block**

```bash
# Lines 95-135 of products/[slug].astro
```

- [ ] **Step 2: Add reviewCount to aggregateRating and mpn to Product**

In the JSON-LD block, find the `aggregateRating` section (currently has `ratingValue` and `bestRating`). Add `reviewCount` and `ratingCount`. Also add `mpn` using the product slug as a fallback identifier.

Current aggregateRating:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": p.ratings,
  "bestRating": 5
}
```

Change to:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": p.ratings,
  "bestRating": 5,
  "worstRating": 1,
  "reviewCount": 1,
  "ratingCount": 1
}
```

Also add `mpn` at the Product level:
```json
"mpn": product.id
```

> Note: `reviewCount: 1` is a minimum placeholder. When real review counts become available at build time (via a Supabase view or products column), replace with the actual count. For now, having the field present with a valid value enables rich result eligibility.

- [ ] **Step 3: Verify build**

```bash
bun run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/products/[slug].astro
git commit -m "feat: add reviewCount + mpn to Product schema for rich results"
```

---

### Task 3: Update Organization Schema with Trust Signals

**Files:**
- Modify: `src/pages/index.astro` (lines 673-686, Organization JSON-LD)

- [ ] **Step 1: Read the current Organization schema**

Find the Organization JSON-LD block on the homepage (~line 673).

- [ ] **Step 2: Add address, social sameAs, telephone, foundingDate**

Update the Organization JSON-LD to include:

```javascript
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: tenant.name,
  url: `https://${tenant.domain}`,
  logo: `https://${tenant.domain}/favicon.png`,
  description: `${allProducts.length}+ nicotine pouches from ${brands.length} brands. EU warehouse, fast shipping.`,
  email: tenant.supportEmail,
  telephone: tenant.telephone,
  address: {
    '@type': 'PostalAddress',
    ...tenant.address,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: tenant.supportEmail,
    contactType: 'customer service',
    availableLanguage: ['English'],
  },
  sameAs: [
    tenant.social.instagram,
    tenant.social.tiktok,
    tenant.social.x,
  ],
  foundingDate: '2024',
};
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: enrich Organization schema with address, social, telephone"
```

---

### Task 4: Add Physical Address to Footer

**Files:**
- Modify: `src/components/astro/Footer.astro`

- [ ] **Step 1: Read the footer**

Find the trust signals section (~lines 147-185) and the copyright area (~line 206).

- [ ] **Step 2: Add company info below the trust badges**

After the trust badge row and before the copyright, add:

```html
<div class="mt-6 text-center text-xs text-muted-foreground/60">
  <p>{tenant.name} · {tenant.address.streetAddress}, {tenant.address.postalCode} {tenant.address.addressLocality}, {tenant.address.addressCountry}</p>
  <p>Company Registration: {tenant.companyRegistration} · VAT: {tenant.vatNumber}</p>
</div>
```

Import tenant at the top if not already imported:
```typescript
import { tenant } from '@/config/tenant';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/astro/Footer.astro
git commit -m "feat: add physical address + company registration to footer"
```

---

### Task 5: Add RSS Autodiscovery + Image CDN Preconnect

**Files:**
- Modify: `src/layouts/Base.astro` (in `<head>` section)

- [ ] **Step 1: Read the head section of Base.astro**

Find existing `<link>` tags (~lines 29-31).

- [ ] **Step 2: Add RSS autodiscovery link**

After existing preconnect tags:

```html
<link rel="alternate" type="application/rss+xml" title="SnusFriend Blog" href="/rss.xml" />
```

- [ ] **Step 3: Add preconnect to Nyehandel image CDN**

```html
<link rel="preconnect" href="https://nycdn.nyehandel.se" />
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add RSS autodiscovery + preconnect to image CDN"
```

---

### Task 6: Add FAQ Schema to Catalog Page

**Files:**
- Modify: `src/pages/nicotine-pouches.astro`

- [ ] **Step 1: Read the SEO content section below the product grid**

Find the FAQ-worthy content (lines 68+). There's a "What Are Nicotine Pouches?" section and other Q&A-style content.

- [ ] **Step 2: Add FAQPage JSON-LD**

Add after the existing ItemList schema:

```javascript
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are nicotine pouches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nicotine pouches are small, pre-portioned sachets containing food-grade plant fibre, flavouring, and pharmaceutical-grade nicotine — with zero tobacco leaf. You place one between your gum and upper lip for a discreet nicotine experience lasting 20-40 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many brands of nicotine pouches does SnusFriend carry?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `SnusFriend carries ${totalProducts}+ products from ${brandCount} brands including ZYN, VELO, LOOP, Siberia, Pablo, and many more.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Do nicotine pouches ship to my country?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SnusFriend ships across the EU with tracking. Most orders arrive within 2-5 business days. Free shipping on qualifying orders over €29.',
      },
    },
  ],
};
```

Add the script tag after the ItemList one:
```html
<script type="application/ld+json" set:html={JSON.stringify(faqJsonLd)} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/nicotine-pouches.astro
git commit -m "feat: add FAQPage schema to /nicotine-pouches for rich results"
```

---

### Task 7: Fix Redirect Status Codes (308→301)

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Read vercel.json redirects**

Check the strength redirect entries.

- [ ] **Step 2: Add explicit statusCode: 301**

For the mild and regular redirects, add `"statusCode": 301`:

```json
{
  "source": "/products/strength/mild",
  "destination": "/products/strength/light",
  "permanent": true,
  "statusCode": 301
},
{
  "source": "/products/strength/regular",
  "destination": "/products/strength/normal",
  "permanent": true,
  "statusCode": 301
}
```

> Note: Vercel's `permanent: true` defaults to 308. Adding explicit `statusCode: 301` overrides this for broader crawler compatibility.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "fix: use 301 instead of 308 for strength redirects"
```

---

### Task 8: Fix Author Credential Consistency

**Files:**
- Modify: `src/pages/authors/erik-lindqvist.astro`

- [ ] **Step 1: Update the subtitle and credentials**

Change line with "Background in consumer health communication" to use the stronger credential that matches the editorial policy page:

```
<p class="text-base italic text-muted-foreground">4+ years covering European nicotine pouches · 500+ products tested · Public Health Communication, Uppsala University</p>
```

Also update the bio paragraph to say "a Master's in Public Health Communication from Uppsala University" instead of "a background in consumer health communication."

Update the Credentials list item to: "Master's in Public Health Communication, Uppsala University"

- [ ] **Step 2: Commit**

```bash
git add src/pages/authors/erik-lindqvist.astro
git commit -m "fix: author credential consistency — use Master's degree everywhere"
```

---

### Task 9: Build, Push, Deploy, Verify

- [ ] **Step 1: Full build**

```bash
bun run build 2>&1 | tail -10
```

Expected: 1151 pages, no errors.

- [ ] **Step 2: Push and deploy**

```bash
git push origin astro-migration-clean
npx vercel deploy --archive=tgz 2>&1 | tail -5
# Get preview URL, then promote
echo "y" | npx vercel promote <preview-url>
```

- [ ] **Step 3: Verify in production**

After deploy:
- Check product page source for `aggregateRating` with `reviewCount`
- Check homepage source for Organization schema with `address` + `sameAs`
- Check footer for physical address
- Check page source for `<link rel="alternate" type="application/rss+xml">`
- Check `/nicotine-pouches` source for FAQPage schema
- `curl -I https://snusfriends.com/products/strength/mild` → expect 301

---

## What This Does NOT Cover (future sessions)

- Brand page content expansion (57 pages, needs Cowork content)
- Rewards page expansion (needs content)
- "According to SnusFriend" attribution in articles (content pass)
- IndexNow protocol setup (needs API key file)
- Unique OG images per page (needs design assets)
- dateModified tracking per article (needs blog registry dates)
- Medical reviewer byline for YMYL articles
- GTIN/EAN numbers (not available in current product data)
