# The complete SEO playbook for snusfriends.com

**Snusfriends.com is currently invisible to Google — zero pages indexed, zero search presence, zero backlinks.** This is the single most critical finding from this audit and represents both an emergency and an opportunity. Because nicotine pouch advertising is banned across Google Ads, Meta, and TikTok, organic SEO is effectively the only scalable customer acquisition channel in a market growing at **24.7% CAGR** toward $42.5 billion by 2033. Every week without indexation is direct revenue loss. The good news: the migration from Vite React SPA to Astro with SSR positions the site perfectly to fix this. Astro ships full HTML to crawlers with zero JavaScript dependency — a decisive advantage over SPA competitors, especially for AI search engines that cannot execute JavaScript at all.

---

## The zero-indexation emergency demands immediate action

The audit revealed that `site:snusfriends.com` returns **zero results** across every search variation tested. No homepage, no product pages, no brand pages appear in Google's index. Searching for "snusfriends" returns only competitor snus shops. No cached version exists, confirming the site has never been indexed or was de-indexed completely. **Zero external backlinks** were detected anywhere on the web.

The most likely root causes, in order of probability: a `robots.txt` containing `Disallow: /` that blocks all crawling; `<meta name="robots" content="noindex">` tags left from a staging environment that persisted through migration; the server returning non-200 status codes to Googlebot; or an age-verification interstitial that blocks crawlers entirely. Any of these would explain total invisibility.

**Fix within 24 hours:** Verify the site returns HTTP 200 to Googlebot by running `curl -A "Googlebot" https://snusfriends.com`. Check `robots.txt` for `Disallow: /`. View page source for `noindex` meta tags. Check response headers for `X-Robots-Tag: noindex`. Set up Google Search Console immediately using domain-level DNS TXT verification through Vercel's dashboard. Submit the XML sitemap. Use the URL Inspection tool to request indexing of the homepage, top brand pages, and top category pages.

**Fix within one week:** Generate a comprehensive XML sitemap with all 2,200+ product URLs. Reference it in `robots.txt`. Build at least one external backlink (even a directory listing or social profile) so Google has a discovery path. Verify that the Astro site actually ships full server-rendered HTML by checking view-source in a browser — the product content, meta tags, and structured data should all be visible in the raw HTML without JavaScript execution.

The competitive landscape is fierce. SnusDirect has **7,991+ Trustpilot reviews**, Snussie has 11,507+, and dozens of established competitors are fully indexed and ranking. Starting from zero means every technical SEO decision must be correct from day one.

---

## Astro configuration that maximizes crawlability and performance

Astro's architecture is ideal for e-commerce SEO because it renders complete HTML server-side in all output modes. Google, Bing, and AI crawlers receive fully-formed pages without executing JavaScript. The key configuration decisions center on rendering strategy, sitemap generation, URL structure, and structured data.

**The hybrid rendering approach is optimal for 2,200+ products.** Astro 5.0 simplified this: everything is static by default, and adding `export const prerender = false` to any page enables SSR for that route. Pre-render product pages at build time (Astro handles 2,200 pages in **1–5 minutes**) and trigger daily rebuilds via CI/CD when product data changes. Use SSR only for cart, checkout, search results, and account pages. For product pages that need fresher pricing data, serve them via SSR with Vercel's ISR caching: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`. This gives sub-100ms TTFB from CDN for static pages and ~200-500ms for SSR pages — both well within Google's LCP threshold of **≤2.5 seconds**.

**The sitemap must cover all 2,200+ products.** Configure `@astrojs/sitemap` with `entryLimit: 1000` to split into manageable files, though Google allows up to 50,000 URLs per file. Split by type for monitoring purposes in Google Search Console — separate sitemaps for products, brands, categories, and content pages. Include only indexable, canonical URLs. Exclude paginated pages, filtered URLs, cart, checkout, and account pages. Reference the sitemap index in `robots.txt` with `Sitemap: https://snusfriends.com/sitemap-index.xml`.

**The recommended `robots.txt` for Astro on Vercel:**

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/
Disallow: /search?
Disallow: /*?sort=
Disallow: /*?filter=

User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /

Sitemap: https://snusfriends.com/sitemap-index.xml
```

Place this as a static file in `public/robots.txt` for Vercel's CDN to serve directly, or generate it dynamically via an Astro API route in hybrid mode. Block low-value pages (cart, checkout, filtered URLs) but never block product, brand, or category paths. Explicitly allow AI crawlers — **62% of news publishers block GPTBot**, creating opportunity for sites that don't.

**URL structure should be flat, keyword-rich, and consistent.** Use `/product/zyn-cool-mint-6mg` for products (brand + product + variant in the slug), `/brands/zyn` for brand pages, and `/mint-nicotine-pouches` for category pages (keyword-rich slug without a generic `/category/` prefix). Set `trailingSlash` to either `'always'` or `'never'` in `astro.config.mjs` and enforce it — inconsistency creates duplicate URLs. Every page needs a self-referencing canonical tag built from `Astro.url.pathname` and `Astro.site`.

**Pagination must use traditional HTML links, not infinite scroll.** Googlebot cannot trigger scroll events or click "load more" buttons, which means products below the initial viewport on infinite-scroll pages are invisible to crawlers. Use numbered pagination with crawlable `<a href>` links. Each paginated page gets its own self-referencing canonical — do not point all canonicals to page 1, and do not noindex paginated pages. Show **24 products per page** as a reasonable balance between page load and crawl depth. Include paginated page links in the HTML navigation so Googlebot can discover all products within 3 clicks of the homepage.

**Core Web Vitals targets for 2025-2026** are LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1, measured at the 75th percentile. Astro has a structural advantage here: it ships **zero JavaScript by default**, giving an enormous INP advantage. Use Astro's `<Image>` component with explicit `width` and `height` attributes to prevent CLS. Serve product images in WebP/AVIF via the `<Picture>` component with `formats={['avif', 'webp']}` and `widths={[320, 640, 1280]}` for responsive srcset. Set `loading="eager"` and `fetchpriority="high"` only for above-the-fold hero images; lazy-load everything else. CWV now carries an estimated **10–15% weight** in Google's ranking algorithm.

---

## Structured data implementation for every page type

Structured data dramatically affects both traditional and AI search visibility. **65% of pages cited by Google AI Mode** include structured data, and pages with properly implemented JSON-LD are cited **3.1x more frequently** in AI Overviews. However, there is a critical constraint for this niche: **Google explicitly prohibits rich results for tobacco and nicotine products.** Star ratings, price badges, and availability indicators will not appear in SERPs. Still, implement Product schema — it feeds Google's Shopping Graph of 35B+ product listings and helps AI crawlers extract product information.

For product pages, embed JSON-LD in the `<head>` using Astro's `set:html={JSON.stringify(structuredData)}` pattern to prevent escaping. Include `@type: Product` with `name`, `brand`, `sku`, `description`, `image`, `offers` (price, currency, availability), and custom `additionalProperty` fields for nicotine strength, flavor, format, and pouch count. For category pages, use `BreadcrumbList` and `ItemList` schemas. Add `Organization` schema site-wide on every page. For blog content, use `Article` or `BlogPosting` with named authors who have credentials — this strengthens E-E-A-T signals.

**FAQ schema was deprecated by Google in January 2026** and no longer triggers rich results, but FAQ-formatted content remains highly valuable for AI citation. Structure FAQs with clear question headings and immediate answers — AI search engines parse this format heavily even without the schema markup.

---

## The nicotine pouch keyword landscape and competitive positioning

The keyword research reveals a market where **zero paid ads appear** for commercial nicotine pouch queries, confirming that organic rankings are the entire battleground. Transactional queries like "buy nicotine pouches" and "nicotine pouches online" show product category pages from Northerner.com, Nicokick.com, SnusDirect.com, and others dominating page one. Informational queries like "best nicotine pouches" show a mix of retailer bestseller pages and editorial guides. Brand queries like "ZYN pouches" surface the official brand site followed by authorized retailers.

**The highest-value keyword categories are:** transactional terms ("buy nicotine pouches online," "cheap nicotine pouches"), brand-specific terms ("ZYN pouches," "VELO nicotine pouches" — for all 139 brands), flavor-based terms ("mint nicotine pouches," "coffee nicotine pouches"), strength-based terms ("strong nicotine pouches," "extra strong snus"), comparison terms ("ZYN vs VELO," "best nicotine pouch brand"), and informational terms ("how to use nicotine pouches," "are nicotine pouches safe"). Each category requires different content types: product listings for transactional, brand landing pages for brand queries, category pages for flavor/strength, dedicated articles for comparisons, and blog content for informational.

**Competitor analysis reveals clear patterns.** Haypp Group dominates through content with their "Nicopedia" hub on Haypp.com — a comprehensive content section featuring original research, brand comparisons, beginner guides, and regulatory news. They commission original studies on consumer habits, creating authoritative linkable assets. Nicokick.com (also Haypp Group) runs "Pouch Perfect," a blog with expert-attributed content featuring named authorities like their VP of Regulatory Affairs — textbook E-E-A-T. Prilla.com (again Haypp Group) has 494 products with brand-keyword-optimized URLs like `/us/zyn-nicotine-pouches`. SnusDirect.com emphasizes authenticity and freshness from their Swedish warehouse. Snusbolaget.se leads the Swedish domestic market with a 4.8 Trustpilot rating.

**Google treats nicotine content as YMYL** (Your Money Your Life), applying heightened E-E-A-T scrutiny. This means snusfriends.com must demonstrate experience (real product knowledge), expertise (detailed specifications), authoritativeness (industry recognition, original data), and trustworthiness (age verification, transparent business info, lab testing). The competitors who win in this space invest heavily in these signals — Northerner's "Nicoleaks" independent lab testing program and Haypp's commissioned consumer studies are examples of E-E-A-T strategies that simultaneously build authority and earn backlinks.

---

## Content strategy across product, category, brand, and blog pages

**Product descriptions for 2,200 SKUs require a template-based AI generation approach.** Manual writing is impractical at this scale. Build a structured template with variables for product name, brand, flavor profile, nicotine strength, format, pouch count, and unique differentiators. Use AI tools like Describely.ai or Hypotenuse AI for bulk generation from CSV data, then human-review for accuracy. Each description must include unique flavor commentary even for same-flavor different-strength variants to avoid duplicate content. Target **150–300 words per product** with specific attributes that match how people search: "ZYN Cool Mint delivers a refreshing peppermint experience with 6mg of nicotine per slim pouch. Each can contains 20 pouches..." This format naturally captures long-tail queries.

**Category pages need concise, conversion-oriented copy — not walls of text.** Research on 300 #1-ranking category pages found the average word count was just **310 words**, with 44% having under 200 words. For a "Mint Nicotine Pouches" page, write a 50-100 word intro above the product grid emphasizing the collection size, brands available, and strength range. Below the grid, add 150-250 words of buying guidance plus 3-5 FAQ questions. Create categories across three dimensions: flavor-based (mint, citrus, berry, coffee, tropical), strength-based (light 1-4mg, regular 4-8mg, strong 8-14mg, extra strong 14mg+), and format-based (slim, regular, mini). Cross-category pages like "Strong Mint Pouches" capture highly specific purchase intent.

**Brand pages must capture "[Brand] pouches" and "buy [Brand] online" searches.** Each of the 139 brands needs a dedicated page with structured brand facts (manufacturer, country of origin, flavor count, strength range), a 100-150 word brand description, the full product grid with filters, and 200-300 words of editorial content below. Include FAQs like "Where can I buy [Brand] online?" and "What flavors does [Brand] offer?" — these precisely match search queries. Title tags should follow "ZYN Nicotine Pouches | Buy Online at SnusFriends" format.

**Comparison content is a massive opportunity.** Every major brand pairing ("ZYN vs VELO," "VELO vs Nordic Spirit," "On! vs ZYN") deserves a dedicated page. Structure with an immediate answer capsule, a comparison table covering flavors, strengths, price, format, and manufacturer, then 200-300 words per comparison dimension. Princeton GEO research found that **comparison-structured content increases AI search visibility by up to 115%**. These pages also perform exceptionally in traditional search, with both retailer and editorial sites ranking for "vs" queries.

**Blog content should follow a topic cluster architecture.** Build pillar pages — "Complete Guide to Nicotine Pouches" (3,000+ words) and "Best Nicotine Pouches 2026" (updated quarterly) — supported by cluster articles on specific subtopics: strength guides, flavor guides, health comparisons vs smoking/vaping, regulatory news, brand deep-dives. Publish **4 articles per month**: one educational pillar piece, one product comparison, one regulatory/news update, and one roundup/best-of list. Internally link cluster articles to pillar pages and from blog content to relevant product and category pages to flow link equity.

**Customer reviews are both a ranking signal and a content multiplier.** Display reviews directly on product pages (not hidden in tabs — Google may ignore tabbed content). Each review adds unique long-tail keyword content to the page. Post-purchase emails at 5-7 days drive collection. Offering loyalty points for reviews increases submission rates. Responding to reviews increases engagement and shows **33% more revenue** for brands that do it consistently.

---

## AI search optimization is no longer optional

AI-referred traffic grew **527% year-over-year**, and brands cited in AI Overviews earn **35% more organic clicks**. AI-referred visitors convert at **4.4x to 9x** the rate of standard organic traffic. With Google AI Overviews appearing on over 50% of searches and ChatGPT processing 2.5 billion prompts daily, optimization for AI search is now a core SEO requirement.

**The critical technical advantage: most AI crawlers cannot execute JavaScript.** GPTBot, ClaudeBot, and PerplexityBot fetch raw HTML only — they download JavaScript files but do not execute them. This means client-side rendered SPAs are essentially invisible to AI search. Astro's server-rendered HTML is immediately parseable by all AI crawlers, giving snusfriends.com a **structural advantage** over any competitor still running a JavaScript SPA. Verify this advantage by testing critical pages with JavaScript disabled — all product content, prices, and descriptions should be visible.

**Content that gets cited by AI follows specific patterns.** Factual specificity matters: "ZYN Cool Mint contains 6mg of nicotine per pouch in a 0.7g slim format" beats vague descriptions. Original data and proprietary research increase citation probability by **30-40%**. Each paragraph should be self-contained and independently citeable. Use clear Q&A formats with the question as a heading and the answer immediately following. Include comparison tables — they are heavily cited in AI-generated responses. Display "Last Updated" dates prominently and refresh content quarterly.

**Allow all AI crawlers in robots.txt** and consider creating an `llms.txt` file (emerging standard) to help AI models understand the site structure. Monitor AI referral traffic by tracking visits from `ai.chatgpt.com`, `perplexity.ai`, and similar domains in analytics. Test monthly with 20-50 manual prompts across ChatGPT, Perplexity, and Google to monitor citation patterns.

---

## Link building and international SEO for restricted markets

Building backlinks without advertising requires creative content-led strategies. The highest-impact linkable asset for snusfriends.com is a **"European Nicotine Pouch Regulation Map"** — an interactive resource showing legal status, restrictions, and recent changes by country. With Denmark restricting flavors in April 2026, the UK's Tobacco and Vapes Bill advancing, and EU TPD3 expected mid-2026, regulatory content attracts links from journalists, researchers, and industry publications. Update it monthly to maintain freshness and link value.

**Data-driven PR is the primary link acquisition strategy** in restricted industries. Commission original consumer surveys ("European Nicotine Pouch Consumer Habits 2026"), publish sales data analysis ("Flavor Popularity Trends by Country"), and create annual market reports. Haypp Group leads here — their commissioned studies generate backlinks from news outlets and build topical authority. Target trade publications like TobaccoIntelligence, 2Firsts, and ECIPE for coverage. Use HARO (Help A Reporter Out) to position team members as expert sources for journalist queries about nicotine pouch trends and regulations.

**Directory listings build foundational authority:** Trustpilot (critical in Scandinavia), Google Business Profile for each target country, Eniro.se and Hitta.se for Sweden, Gulesider.no for Norway, Krak.dk for Denmark, Gelbe Seiten for Germany, and Yell.com for the UK. Join relevant trade associations and e-commerce industry groups in each country. Seek manufacturer partnerships to be listed as an authorized retailer — Nicokick and Northerner both benefit from being listed on ZYN's official website.

**International SEO requires subdirectories, not subdomains or ccTLDs.** Use `snusfriends.com/se/` for Sweden, `/no/` for Norway, `/dk/` for Denmark, `/de/` for Germany, and `/uk/` for the UK, with the root domain serving as `x-default` in English. Subdirectories consolidate all domain authority — every backlink benefits the entire domain. Implement hreflang tags on every page with bidirectional references and self-referencing tags. Use Astro's built-in i18n support or the `astro-i18next` package with its `<HeadHrefLangs />` component. For large catalogs, implement hreflang in the XML sitemap rather than HTML head for easier maintenance. **65% of international sites have significant hreflang errors** — audit quarterly with Screaming Frog or Ahrefs.

Content localization goes beyond translation. Localize currency (SEK, NOK, DKK, EUR, GBP), payment methods (Swish in Sweden, Vipps in Norway), legal disclaimers per country's regulations, and product availability. Denmark's April 2026 flavor restrictions mean the Danish catalog will be smaller — the `/dk/` version must dynamically reflect compliant products only. Norway's complex regulation around trace-tobacco pouches requires careful content positioning. Germany's grey-area classification means informational content is safer than explicit e-commerce promotion.

---

## Monitoring, measurement, and the timeline to results

**Set up Google Search Console as a domain property** using DNS TXT verification through Vercel's dashboard. Also create URL-prefix properties for each country subdirectory (`/se/`, `/no/`, `/dk/`, `/de/`, `/uk/`) to monitor hreflang performance per market. Use the URL Inspection tool to verify Google sees full server-rendered HTML — the "Rendered page" screenshot should show complete product content, not empty shells.

**For keyword tracking across multiple European countries, SE Ranking ($65/month) offers the best value** with 500 tracked keywords, multi-location support, and AI visibility monitoring. Ahrefs ($129/month) is the best for backlink analysis and competitor monitoring. Both tools track rankings across `google.se`, `google.no`, `google.de`, and `google.co.uk`. Build a Looker Studio dashboard connecting GSC and GA4 data with weekly automated email delivery. Track indexed pages, impressions, clicks, CTR, average position, Core Web Vitals, crawl stats, and new/lost referring domains.

**SEO A/B testing requires at least 100+ similar templated pages** for statistical significance. With 2,200 product pages, snusfriends.com has plenty. Use SplitSignal (Semrush add-on) or SEOTesting.com to test title tag modifications, meta description changes, and structured data additions. Run tests for 4-6 weeks minimum. The highest-impact first test: adding "Buy" or "Free Shipping" to product page title tags to measure CTR improvement.

**Set up a tiered alert system:** Critical alerts (instant) for site downtime and noindex detection via SE Ranking or Sitechecker Pro. High-priority alerts (daily) for top-10 keyword drops >5 positions and indexed page drops >20%. Medium alerts (weekly) for organic click drops >20% and Core Web Vitals regressions via PageRadar. Low alerts (weekly) for new competitors entering top 10 and backlink losses via Ahrefs.

**Realistic timeline for snusfriends.com from zero indexation:**

The SPA-to-SSR migration on the same domain is the favorable scenario — URLs stay the same, and Google simply needs to re-crawl to find full HTML. With the indexation blocker fixed, expect pages to appear in Google's index within **1-7 days** of submitting the sitemap. First search impressions appear at **2-6 weeks**. Long-tail, low-competition keywords (brand-specific product queries, specific flavor+strength combinations) can reach page one in **2-4 months**. Medium-competition category terms ("mint nicotine pouches," "strong nicotine pouches") should reach top 10 in **4-8 months** with good content and emerging authority. Competitive head terms ("buy nicotine pouches online") realistically take **6-18 months** depending on backlink acquisition pace.

Benchmark data supports this: a sauna e-commerce brand grew from 5,594 to 17,219 monthly organic clicks (**207% increase**) in 6 months, with revenue rising 88%. A D2C fragrance brand built from 44 to 6,125 monthly clicks over 33 months in three distinct phases: foundation (months 1-8), acceleration (months 9-18), and compounding (months 19-33). SPA-to-SSR migrations specifically show **20-50% organic traffic increases** after implementation, with LCP and FCP improving by **30-60%**. A Next.js-to-Astro migration achieved #1 Google ranking within 3 weeks for terms the old site never ranked for, with PageSpeed scores jumping to 100.

One sobering statistic: the average domain migration takes **523 days** to recover prior traffic levels, and **17% never recover**. However, same-domain SPA-to-SSR migrations with no URL changes recover dramatically faster — typically **2-6 weeks** — because Google simply re-renders existing URLs and finds complete HTML.

---

## The 90-day implementation roadmap

**Days 1-7 (Emergency):** Diagnose and fix the indexation blocker. Verify `robots.txt`, check for `noindex` tags, confirm HTTP 200 responses to Googlebot. Set up Google Search Console. Submit sitemap. Request indexing of the top 50 pages. Create the first external link (Trustpilot profile, social media profiles, one directory listing).

**Days 8-30 (Foundation):** Implement the `BaseHead.astro` component with canonical URLs, meta tags, and Open Graph tags on every page. Add Product JSON-LD schema to all 2,200 product pages. Add BreadcrumbList schema site-wide. Add Organization schema. Configure `robots.txt` with AI crawler allowances. Verify SSR renders full HTML on all page types. Set up SE Ranking or Ahrefs for rank tracking. Create the Looker Studio dashboard.

**Days 31-60 (Content):** Launch the top 20 brand pages with full editorial content. Write category page copy for the top 30 categories. Publish the first 4 blog articles (pillar guide, comparison, strength guide, "Best Nicotine Pouches 2026"). Begin AI-generating product descriptions at scale using the template system. Set up the review collection system with post-purchase emails. Implement hreflang tags for the primary market (Sweden first, then expand).

**Days 61-90 (Growth):** Publish the "European Nicotine Pouch Regulation Map" as the flagship linkable asset. Create 10 brand comparison articles. Submit to business directories in all target countries. Begin HARO monitoring for media outreach. Set up the country subdirectory structure for `/se/`, `/no/`, `/dk/`, `/de/`, `/uk/`. Populate all 139 brand pages. Launch the topic cluster content calendar at 4 posts per month.

**Measurable targets at 90 days:** 2,000+ pages indexed in Google. First organic impressions and clicks appearing in Search Console. Core Web Vitals passing on all page types. Product schema validated on all product pages. At least 10 referring domains acquired. Blog content beginning to rank for long-tail informational queries.

**Measurable targets at 6 months:** Top-10 rankings for 50+ long-tail product and brand queries. 5,000+ monthly organic clicks. 30+ referring domains. Category pages ranking on page 1-2 for flavor and strength queries. AI search citations appearing for brand comparison and guide content.

**Measurable targets at 12 months:** Top-10 rankings for 200+ keywords including medium-competition category terms. 20,000+ monthly organic clicks. 100+ referring domains. Revenue from organic search representing a significant and growing share of total revenue. AI search referral traffic measurable and growing.

The market opportunity is extraordinary. With the global nicotine pouch market at **$6.96 billion** and growing, paid advertising locked out across all major platforms, and organic search as the only scalable acquisition channel — the company that wins SEO wins the customer. Every day that snusfriends.com remains invisible to Google is market share handed to competitors who already solved this problem.