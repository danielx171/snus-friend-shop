# Round 2 Design Research — March 27, 2026

## Research Sources
- Vervaunt: Best DTC e-commerce websites
- Awwwards: 2025-2026 e-commerce winners (Lusano, BOMBON, Belle Oaks)
- Baymard Institute: Product page & checkout UX (2025)
- Optimonk: 37 high-converting e-commerce examples
- Commerce-UI: 21 best PDP examples
- Crobox: 9 product page best practices
- Direct competitor analysis: velo.com, nicokick.com, ritual.com

## Key Insights for Round 2

### 1. What the Highest-Scoring Sites Do Differently

**Image-First Layouts**
- Top DTC sites make product images 60-70% of viewport (Mansur Gavriel, CDLP)
- Video-first PDPs are emerging (Magda Butrym, Stojo — scroll-triggered demos)
- Full-width immersive galleries dominate viewport (On, ARK/8)
- 360-degree views particularly effective on mobile (Polene)

**Sticky/Floating CTAs**
- Every top-converting site has sticky "Add to Bag" positioned for thumb-reach on mobile
- PANGAIA: Sticky CTA bar with engaging scroll animations and impact icons
- Alo Yoga: Free shipping bar at top + trending section + discount triggers
- Rare Beauty: Free shipping bar as primary conversion driver

**Variant Selection Innovation**
- MR MARVIS: Color wheels for instant switching (not dropdowns)
- Ace & Tate: Drawer-based journeys for upselling upgraded materials
- On: Separate toggles for gender variants
- Rains: "Find Your Size" quiz with personalized recommendations
- **CRITICAL (Baymard):** Avoid dropdown menus; use clickable swatches/buttons

**Social Proof Placement**
- Reviews HIGH in page hierarchy, not buried at bottom (MR MARVIS)
- User-generated content ON product pages (Peppermayo: +50K engagement boost)
- "Recently viewed" tracking (Maap)
- Model dimensions displayed prominently (reduces returns)

**Cross-Sell/Upsell Patterns**
- "Complete the Look" with same model (The Attico, Magda Butrym)
- "Styled with X items" outfit combinations (J. Lindenberg)
- Bundle discounts: "Save on Packs" (Bombas)
- Subscription tiers (Velo: Basic/Standard/Select by can quantity)

### 2. Baymard Institute Critical Findings (2025)

- Only 49% of top sites have "decent" product page UX
- Only 2% of sites have "good" checkout UX
- **35% conversion rate increase** possible from design changes alone
- Price-per-unit display is critical for bulk/variant products
- Return policy must be visible early in product journey
- Quantity updates must be immediate (no page reload)

### 3. What Our Round 1 Designs Were Missing

Based on scoring Round 1 (Cart Drawer 8.45, PDP 7.95, Homepage 7.6):

| Gap | Evidence | Fix for Round 2 |
|-----|----------|-----------------|
| No UGC/social proof on PDP | Commerce-UI: reviews high in hierarchy | Add star rating + review count + "Verified Buyer" tags |
| No sticky CTA | Every top site has this | Sticky "Add to Cart" bar on scroll |
| Generic cross-sell | "You may also like" is weak | "Complete Your Routine" with flavor matching |
| No size/format comparison | Baymard: visual comparison critical | Side-by-side slim vs. regular format visual |
| Missing urgency (ethical) | "Only X left" drives action | Low stock indicator (truthful) |
| No subscription option | Velo offers Basic/Standard/Select | Subscribe & save toggle with % discount |
| Limited trust signals | Baymard: return policy early | Shipping + returns + guarantee in CTA area |

### 4. Design Directions for Round 2

#### Direction A: "The Connoisseur PDP" (Target: 9.0+)
Focus: Component-level PDP that applies ALL research insights.
Theme: Dark (#1A1A2E) — proven to score higher for component designs.
Key innovations:
- Full-width product image gallery with zoom
- Sticky CTA bar with price + Add to Cart
- Flavor wheel variant selector (inspired by MR MARVIS color wheels)
- Pack selector with per-unit savings breakdown
- "Complete Your Routine" cross-sell with flavor matching
- Trust bar: Free shipping threshold + Easy returns + Lab-tested
- Review summary with star distribution chart
Reference sites: ouraring.com PDP, glossier.com PDP, aceandtate.com PDP

#### Direction B: "The Ritual Homepage" (Target: 8.5+)
Focus: Homepage that tells a brand story, not just lists products.
Theme: Light (#FAFAF8) — proven better for page-level designs.
Key innovations:
- Video-first hero (parallax product shot, not stock photo)
- "Find Your Perfect Pouch" interactive quiz CTA (inspired by Takecareof, Rains)
- Strength discovery visual (horizontal spectrum, not just badges)
- Social proof carousel: customer reviews with product photos
- Bundle builder section: "Build Your Subscription Box"
- Editorial content: "The SnusFriend Guide" article cards
Reference sites: ritual.com, glossier.com, takecareof.com

#### Direction C: "The Impulse Cart" (Target: 9.0+)
Focus: Cart drawer that maximizes AOV through smart upsell.
Theme: Dark (#1A1A2E) — highest scorer from Round 1.
Key innovations:
- Dynamic upsell engine: "Pairs well with [current item flavor]"
- Subscription toggle per line item: "Subscribe & save 15%"
- Savings summary: "You're saving €12.50 on this order"
- Estimated delivery date (not just "2-3 days")
- Express checkout strip: Apple Pay / Google Pay / Klarna
- Gift option: "Add gift wrapping + message" expansion
- Loyalty points preview: "+45 points with this order"
Reference sites: glossier.com cart, allbirds.com cart, mejuri.com cart

## Stitch Prompt Strategy

### New Design System Forcing
To avoid the reuse trap, each prompt uses DIFFERENT:
- Accent colors (copper #B87333, sage #8FBC8F, indigo #4B0082)
- Visual vocabulary (glass-morphism, editorial, brutalist-minimal)
- Reference URLs (no repeats from Round 1)
- Font suggestions (different from Satoshi/Plus Jakarta)
