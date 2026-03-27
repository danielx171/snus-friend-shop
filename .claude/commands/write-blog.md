# Write Blog Post

Generate an SEO-optimized blog post as an Astro page with Article JSON-LD schema.

## Usage
- `/write-blog <topic>` — e.g. `/write-blog best berry flavoured pouches`

## Template

Every blog post MUST include:
1. Astro frontmatter with `export const prerender = true`
2. Import `Shop` layout, `Breadcrumb` component, `tenant` config
3. `<Shop>` wrapper with unique title and description
4. `<Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: 'Post Title' }]} />`
5. Article JSON-LD schema (`@type: Article`, headline, datePublished, author, publisher with logo)
6. 600–1000 words of original content
7. Internal cross-links to at least 3 other pages (products, categories, guides)
8. Cross-link navigation grid at bottom (Browse by Flavour / Browse by Strength)

## Steps

1. **Research** — Check existing blog posts in `src/pages/blog/` to avoid duplicate topics
2. **Write** — Create `src/pages/blog/<slug>.astro` following the template above
3. **Update index** — Add the new post to the articles array in `src/pages/blog/index.astro`
4. **Build** — Run `bun run build` to verify no errors
5. **Report** — Show word count, internal link count, and JSON-LD validation

## SEO Requirements
- Title: 50-60 chars, keyword-first
- Meta description: 150-160 chars, includes primary keyword
- H1 matches title (without site name suffix)
- At least one H2 per 200 words
- Primary keyword in first paragraph

## Cross-link Targets
- `/products` — All products
- `/products/flavor/mint`, `/products/flavor/berry`, `/products/flavor/citrus`
- `/products/strength/mild`, `/products/strength/regular`, `/products/strength/strong`, `/products/strength/extra-strong`, `/products/strength/super-strong`
- `/nicotine-pouches` — Main SEO landing page
- `/faq` — FAQ page
- `/blog/*` — Other blog posts
