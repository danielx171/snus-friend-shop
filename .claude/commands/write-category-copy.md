# Write Category Copy

Generate SEO-rich intro paragraphs for product category pages.

## Usage
- `/write-category-copy flavor` — write copy for all flavor category pages
- `/write-category-copy strength` — write copy for all strength category pages
- `/write-category-copy flavor/mint` — write copy for a specific category

## Steps

1. **Read target page(s):**
   - Flavor pages: `src/pages/products/flavor/[key].astro`
   - Strength pages: `src/pages/products/strength/[key].astro`

2. **Check current state** — Does the page already have intro copy or just a product grid?

3. **Write copy** — For each category, add:
   - 80-150 word intro paragraph below the H1
   - Primary keyword naturally in first sentence
   - 2-3 internal cross-links to related categories
   - Mention of popular brands in that category

4. **Cross-link grid** — Ensure "Browse by Flavour" / "Browse by Strength" nav exists

5. **Build** — `bun run build` to verify

## Category Keywords
| Category | Primary Keyword | Secondary Keywords |
|----------|----------------|-------------------|
| Mint | mint nicotine pouches | spearmint, peppermint, cool mint, menthol |
| Berry | berry nicotine pouches | mixed berry, strawberry, blueberry, raspberry |
| Citrus | citrus nicotine pouches | lemon, lime, orange, grapefruit |
| Coffee | coffee nicotine pouches | espresso, macchiato, mocha |
| Mild | mild nicotine pouches | low strength, beginner, 2mg, 4mg |
| Regular | regular nicotine pouches | medium strength, 6mg, 8mg |
| Strong | strong nicotine pouches | high strength, 10mg, 12mg |
| Extra Strong | extra strong nicotine pouches | very strong, 14mg, 16mg |
| Super Strong | super strong nicotine pouches | extreme, 20mg+, highest strength |
