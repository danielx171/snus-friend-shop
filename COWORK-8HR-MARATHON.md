# SnusFriend 8-Hour Design Marathon
## Autonomous Research → Screenshot → Stitch → Review → Iterate → Stack

You are running an 8-hour autonomous design marathon for snusfriends.com. Work continuously through all phases. When you hit rate limits, PAUSE, wait for the timer to expire, then resume exactly where you left off. Keep a running log of everything you produce.

---

## YOUR TOOLS

You have these capabilities — use ALL of them:

1. **Claude in Chrome** — Browse websites, take screenshots, navigate to Stitch, upload images, interact with web pages
2. **Web Search** — Research best-designed sites, find inspiration, look up design patterns
3. **Frontend Design Skill** — When you generate code from Stitch exports, use the frontend-design principles to critique and improve: bold aesthetic direction, distinctive typography, color commitment, motion/micro-interactions, spatial composition
4. **Canvas Design Skill** — Create design philosophy documents that guide the visual direction before generating in Stitch
5. **Theme Factory Skill** — Generate cohesive color palettes and font pairings for each design variant
6. **File Creation** — Save all results, scores, and code to disk for the human to review

---

## MASTER SCHEDULE (8 hours)

### HOUR 1-2: RESEARCH PHASE
- Search for the best e-commerce sites to reference
- Visit 15-20 sites, take screenshots of the best pages
- Evaluate and rank which screenshots will make the best Stitch references
- Create a design philosophy document for SnusFriend

### HOUR 2-3: STITCH GENERATION ROUND 1
- Navigate to stitch.withgoogle.com
- Generate 6 core designs using screenshot references
- Screenshot and score each result

### HOUR 3-4: REVIEW & IMPROVE ROUND 1
- Use frontend-design principles to critique each generated design
- Identify specific weaknesses in typography, color, spacing, interactions
- Write improved Stitch prompts that address the weaknesses
- Generate 3 refined versions

### HOUR 4-5: STITCH GENERATION ROUND 2 — NEW DIRECTIONS
- Try completely different aesthetic directions (editorial, brutalist, playful, luxury)
- Use different reference site screenshots for each
- Score and compare against Round 1

### HOUR 5-6: CODE GENERATION FROM WINNERS
- Take the top 3 scoring designs
- Using frontend-design skill, generate actual React + Tailwind + shadcn/ui code for the best product card component
- Generate code for the best homepage hero section
- Save all code files to disk

### HOUR 6-7: DEEP RESEARCH — WHAT ELSE CAN WE STEAL?
- Search for micro-interaction patterns in e-commerce
- Research cart drawer best practices with real examples
- Find mobile navigation patterns for high-SKU stores
- Screenshot any new discoveries and feed to Stitch

### HOUR 7-8: FINAL ROUND & COMPILATION
- Generate any remaining designs
- Create the final ranked summary
- Compile all screenshots, scores, code, and recommendations into one document
- Write the implementation plan for the human

**IF YOU HIT RATE LIMITS:** Write "⏸️ PAUSED — Rate limit reached at [time]. Will resume in [X] minutes." Save your current progress, wait, then continue exactly where you left off. Don't waste the pause — use it to write design critiques or plan next prompts.

---

## PHASE 1: RESEARCH (Hours 1-2)

### 1A: Web Search — Find sites to reference

Search for these topics and compile a list of URLs:

**Search queries to run:**
1. "best designed e-commerce websites 2025 2026 Awwwards winners"
2. "best DTC supplement beverage Shopify stores design"
3. "nicotine pouch snus e-commerce website design"
4. "best dark theme e-commerce sites premium design"
5. "best product card design e-commerce consumables"
6. "best cart drawer slide-out design examples"
7. "best mobile e-commerce navigation high SKU"
8. "best subscription-first product page design"

From the search results, compile a ranked list of 15-20 sites worth visiting.

### 1B: Visit and screenshot the top sites

For each site, use Claude in Chrome to:
1. Navigate to the URL
2. Wait for it to load (2 seconds)
3. Handle any age gates (click "I am 18+", "Ja", "Enter", etc.)
4. Take a screenshot with `save_to_disk: true`
5. If the site has a great product page, navigate there and screenshot that too
6. If the site has a visible cart drawer, add an item and screenshot the drawer

**MUST-VISIT sites (in order):**

| # | URL | What to look for |
|---|-----|-----------------|
| 1 | velo.com/gb/en/our-products | Strength selectors, subscription tiers, experience nav |
| 2 | ritual.com | Minimalism, trust badges, whitespace, yellow accent |
| 3 | nicokick.com/us | Filters, bulk pricing, product cards, rewards |
| 4 | drinkag1.com | Subscription PDP, social proof, pricing layout |
| 5 | athleticbrewing.com | Cart drawer, membership, product grid |
| 6 | takearecess.com | Color shifts, can animations, playful personality |
| 7 | drinkolipop.com | Color-per-flavor, health positioning, bold cards |
| 8 | snusbolaget.se | Mega menu, pack pricing, Swedish e-com leader |
| 9 | xqs.com/uk | Lifestyle brand, dark theme, flavor descriptions |
| 10 | seed.com | Editorial design, transparency, subscription-only |
| 11 | deathwishcoffee.com | Dark theme, skull branding, bold typography |
| 12 | mudwtr.com | Alternative product positioning, earthy aesthetic |
| 13 | drinkghia.com | Non-alcoholic positioning, luxury consumable |
| 14 | grfrnd.com | Clean supplement design |
| 15 | ouraring.com | Premium dark PDP, science-backed messaging |

**Age gate tips:** Nicotine sites (velo, nicokick, snusbolaget, xqs) will show age verification. Look for buttons containing: "18", "older", "enter", "Ja", "I am", "confirm age". Click them. If a site requires login or is completely blocked, screenshot whatever loads and move on.

### 1C: Create SnusFriend Design Philosophy

Using the canvas-design skill principles, write a design philosophy document:

```markdown
# SnusFriend Design Philosophy

## Brand Identity
- **Who we are:** Europe's friendliest nicotine pouch marketplace
- **Tone:** Premium but approachable. Not clinical, not streetwear — the sweet spot
- **Feeling:** Like walking into a well-curated specialty shop, not a pharmacy

## Visual Direction
- **Primary:** Dark charcoal (#1A1A2E) — makes colorful product cans pop
- **Accent:** Teal (#0F6E56) — trust, freshness, premium
- **System:** Color-per-flavor (mint=blue-green, fruit=orange, berry=purple, coffee=brown)

## Typography
[Pick 2-3 font pairings to test — NOT Inter, NOT Space Grotesk, NOT Roboto]
Options: Satoshi, General Sans, Cabinet Grotesk, Switzer, Plus Jakarta Sans, Outfit

## Key Principles
1. Products are the hero — every UI decision should make the cans look gorgeous
2. Strength at a glance — color-coded system (green/yellow/orange/red)
3. Bulk buying made effortless — quantity selection without friction
4. Trust through transparency — lab tested, tobacco-free, ingredient clarity
```

Save this to disk as `snusfriend-design-philosophy.md`.

### 1D: Generate Theme Variants

Using theme-factory principles, create 3 theme variants:

**Theme A: "Midnight Teal" (Dark Premium)**
- Background: #1A1A2E, Surface: #252538, Teal: #0F6E56
- Font: Satoshi (headings), General Sans (body)
- Vibe: Like a premium spirits website

**Theme B: "Clean Ritual" (Light Minimal)**
- Background: #FAFAF8, Surface: #FFFFFF, Teal: #0F6E56
- Font: Cabinet Grotesk (headings), Plus Jakarta Sans (body)
- Vibe: Like ritual.com but for pouches

**Theme C: "Neon Pouch" (Bold Playful)**
- Background: #0A0A0A, Accents: bright per-flavor colors
- Font: Outfit (headings), Switzer (body)
- Vibe: Like Recess/Olipop but edgier

Save to disk as `snusfriend-themes.md`.

---

## PHASE 2: STITCH GENERATION ROUND 1 (Hours 2-3)

### 2A: Open Stitch

1. Navigate to stitch.withgoogle.com
2. Switch to **Webb** mode (click "Webb" toggle)
3. Switch to **3.1 Pro** model (click model dropdown, select Pro)
4. You can use the existing project or create new

### 2B: Generate 6 core designs

For EACH design below:
1. Click the `+` or image upload icon in Stitch's input area
2. Upload your best reference screenshot for that design type
3. Type the prompt
4. Click send/submit
5. Wait for completion (30-60 seconds — watch for checkmark)
6. Take a screenshot of the result with `save_to_disk: true`
7. Score it immediately (see scoring section)

**DESIGN 1: Dark Homepage (Theme A)**
Reference screenshot: velo.com or nicokick.com
> "Create a premium e-commerce homepage for 'SnusFriend' selling nicotine pouches from 139 brands. Use the attached screenshot as layout reference. Dark charcoal (#1A1A2E) background with teal (#0F6E56) accents. Hero: 'Your Favorite Pouches, Delivered Fast' + search bar. Brand carousel: ZYN, VELO, LOOP, XQS, White Fox. 4-column product grid: can images on dark cards, brand name small, product name bold, color-coded strength badge (green=mild, yellow=regular, orange=strong, red=extra strong), quantity pills (1/5/10/30), per-unit price, teal Add to Cart. Sticky header with mega menu. Free shipping progress bar. Use Satoshi font for headings, General Sans for body."

**DESIGN 2: Light Homepage (Theme B)**
Reference screenshot: ritual.com
> "Clean light homepage for 'SnusFriend'. Use attached screenshot as style reference. White (#FAFAF8) + teal (#0F6E56). Hero: 'Discover 2200+ Premium Pouches' + search. Trust bar: Lab Tested, Tobacco-Free, 139 Brands, Fast Shipping, Rewards. Category cards: Mint (blue), Fruit (orange), Strong (red), New (teal). Product grid: white cards, strength dots, flavor description, pack tabs, price, outlined Add to Cart. Use Cabinet Grotesk headings, Plus Jakarta Sans body. Ritual-level whitespace."

**DESIGN 3: Bold Playful Homepage (Theme C)**
Reference screenshot: takearecess.com or drinkolipop.com
> "Bold playful homepage for 'SnusFriend'. Use attached as reference. Black (#0A0A0A) background with vibrant per-flavor accent colors. Hero: oversized typography 'FIND YOUR FLAVOR' with animated gradient text. Product cards with colored borders matching each product's flavor. Hover effects change the card's background glow. Rounded pill shapes for navigation. Playful micro-interactions. Use Outfit font for headings. Personality-driven, not corporate."

**DESIGN 4: Product Listing Page**
Reference screenshot: nicokick.com or snusbolaget.se
> "Product listing page for SnusFriend, dark charcoal theme. Use attached as filter reference. Left sidebar: Brand checkboxes (ZYN (45), VELO (38), LOOP (24)), Flavor, Strength (color badges), Format. Top: breadcrumbs, '234 products', sort. 3-column grid: can photo, brand teal, name white, flavor text, strength bar, pack pills (1/5/10/30), per-unit price, teal Add to Cart. Active filter chips. Satoshi/General Sans fonts."

**DESIGN 5: Product Detail Page**
Reference screenshot: drinkag1.com or velo.com
> "PDP for SnusFriend, dark theme. Use attached for layout. Left: image gallery. Right: breadcrumbs, brand, 'ZYN Cool Mint', 4.7★ (128 reviews), strength toggles (3/6/9mg), pack selector (1/5/10/30), crossed price + sale + savings, Subscribe & Save 15% toggle, big teal Add to Cart. Tabs: Description/Ingredients/Reviews. 'You May Also Like' carousel. Satoshi headings."

**DESIGN 6: Cart Drawer**
Reference screenshot: athleticbrewing.com (add item to cart first, then screenshot drawer)
> "Slide-out cart drawer, dark theme, 420px right. 'Your Cart (3)' + X. Teal shipping progress bar. Items: thumbnail, name, strength, quantity stepper, price, remove. Upsell section with 3 cards. Subscribe toggle. Totals. Teal Checkout button. Payment icons. Show overlaying homepage."

---

## PHASE 3: REVIEW & IMPROVE (Hours 3-4)

### 3A: Score every design

For each of the 6 designs, write this evaluation and save to disk:

```
╔══════════════════════════════════════════╗
║ DESIGN [#]: [Name]                       ║
║ Reference: [site used]                   ║
║ Theme: [A/B/C]                           ║
╠══════════════════════════════════════════╣

SCORES (1-10):
  Visual Impact ........... _/10
  E-commerce UX ........... _/10
  Brand Consistency ....... _/10
  Implementability ........ _/10
  Mobile Readiness ........ _/10
  
  WEIGHTED TOTAL: _/10
  (Visual×0.25 + UX×0.25 + Brand×0.20 + Impl×0.20 + Mobile×0.10)

STRENGTHS:
  1. 
  2.
  3.

WEAKNESSES:
  1.
  2.
  3.

FRONTEND DESIGN CRITIQUE:
  Typography: [Is the font choice distinctive? Does it avoid generic AI slop?]
  Color: [Is the palette committed? Sharp accents vs timid distribution?]
  Spacing: [Generous whitespace or controlled density? Intentional?]
  Motion: [Any micro-interactions suggested? What should animate?]
  Differentiation: [What makes this UNFORGETTABLE vs generic e-commerce?]

KEEP: [specific elements]
DISCARD: [specific elements]
REFINEMENT PROMPT: "[improved Stitch prompt]"
╚══════════════════════════════════════════╝
```

### 3B: Generate 3 refined designs

Take the top 3 scorers and generate improved versions using the refinement prompts.

---

## PHASE 4: NEW DIRECTIONS (Hours 4-5)

### 4A: Research-driven new approaches

Search for design patterns you haven't tried yet:
- "editorial magazine e-commerce layout"  
- "brutalist e-commerce design"
- "luxury dark mode product showcase"
- "Japanese minimalist e-commerce"
- "Scandinavian design e-commerce clean"

Screenshot any inspiring results.

### 4B: Generate 3 wildcard designs

**WILDCARD 1: "Editorial Magazine"**
> "SnusFriend homepage as if it were a fashion magazine website. Large serif headlines, asymmetric grid, editorial product photography, article-style product features, mix of full-bleed images and text columns. Dark theme. Think Kinfolk magazine meets e-commerce."

**WILDCARD 2: "Scandinavian Minimal"**
> "SnusFriend with extreme Scandinavian minimalism. Off-white background, thin hairline borders, lots of negative space, subtle gray typography, product images as the only color. No badges, no banners, no noise. Just products presented beautifully. Like a gallery exhibition."

**WILDCARD 3: "Premium Club"**
> "SnusFriend as an exclusive members club. Dark background with warm gold (#C9A96E) accents instead of teal. VIP feel. 'Welcome to the Club' hero. Members pricing prominently displayed. Loyalty tier badges (Bronze/Silver/Gold). Rich textures. Premium serif headings."

Score all 3 wildcards.

---

## PHASE 5: CODE GENERATION (Hours 5-6)

### 5A: Build the Product Card component

Take the highest-scoring product card design and implement it using frontend-design principles.

Create a file `snusfriend-product-card.tsx`:
```tsx
// React + Tailwind + shadcn/ui product card component
// Based on [winning design] scored [X/10]
// 
// Features:
// - Can image with hover zoom
// - Brand name + product name
// - Color-coded strength badge
// - Quantity selector pills (1/5/10/30)
// - Dynamic per-unit pricing
// - Add to Cart button with loading state
```

Use the frontend-design skill guidelines:
- Distinctive typography (NOT Inter/Roboto)
- Committed color palette with sharp accents
- Micro-interactions on hover/click
- Production-grade, not a prototype

### 5B: Build the Homepage Hero

Create `snusfriend-hero.tsx`:
- Based on the winning homepage design
- Search bar component
- Trust badges bar
- Responsive layout

### 5C: Build the Cart Drawer

Create `snusfriend-cart-drawer.tsx`:
- Using shadcn/ui Sheet component as base
- Free shipping progress bar
- Upsell section
- Quantity stepper
- Subscribe & Save toggle

Save ALL code files to disk.

---

## PHASE 6: DEEP DIVE RESEARCH (Hours 6-7)

### 6A: Search for specific patterns

Run these searches and compile findings:
1. "e-commerce product card variant selector UX best practice 2026"
2. "free shipping progress bar implementation conversion rate"
3. "nicotine pouch age verification UX design"
4. "e-commerce mega menu 100+ brands design pattern"
5. "shadcn/ui e-commerce components examples"
6. "Tailwind CSS dark theme e-commerce template"

### 6B: Visit any new sites discovered

Screenshot interesting new finds and evaluate for Stitch references.

### 6C: Generate designs from new research

If you found compelling new references, generate 2-3 more Stitch designs using them.

---

## PHASE 7: FINAL COMPILATION (Hours 7-8)

### 7A: Create the Master Rankings

Save to disk as `FINAL-RANKINGS.md`:

```markdown
# SnusFriend Design Marathon — Final Rankings
## Generated [date] — 8-Hour Overnight Run

### RANKINGS (Best to Worst)

| Rank | Design | Theme | Score | Best For |
|------|--------|-------|-------|----------|
| 🏆 1 | [name] | [A/B/C/Wild] | _/10 | [page type] |
| 🥈 2 | [name] | | _/10 | |
| 🥉 3 | [name] | | _/10 | |
| 4 | [name] | | _/10 | |
| ... | ... | | _/10 | |

### TOP 3 DETAILED REVIEWS
[Full review of each top design]

### COMPONENT MAP
- Sheet → Cart drawer
- ToggleGroup → Strength/pack selectors
- Command → Search autocomplete
- Badge → Strength indicators
- Card → Product cards
- Tabs → PDP content tabs
- Progress → Free shipping bar
- Accordion → Mobile filters

### IMPLEMENTATION ORDER
1. Product Card (reused everywhere) — use code from Phase 5
2. Homepage Hero + Layout
3. Product Listing with Filters
4. Product Detail Page
5. Cart Drawer
6. Brand Page
7. Navigation / Mega Menu

### FILES GENERATED
- snusfriend-design-philosophy.md
- snusfriend-themes.md
- snusfriend-product-card.tsx
- snusfriend-hero.tsx
- snusfriend-cart-drawer.tsx
- [screenshots — list all saved screenshot paths]
- [Stitch project URL]

### WHAT TO DO TOMORROW
1. Review this document
2. Open Stitch project and browse all designs on the canvas
3. Export top 2-3 designs (click Exportera)
4. Open Claude Code → paste implementation prompt
5. Start with Product Card → Homepage → PLP → PDP
```

### 7B: Create the Claude Code Implementation Prompt

Save to disk as `CLAUDE-CODE-PROMPT.md`:

```markdown
# Claude Code Implementation Task

I have designs from Google Stitch and component code ready to implement 
on snusfriends.com.

## Context
- Read CLAUDE.md for all project conventions
- This is a Vite + React + TypeScript + Tailwind + shadcn/ui app
- Supabase backend (auth, DB, edge functions)
- Deployed on Vercel
- Package manager: Bun (not npm)
- Domain: snusfriends.com

## Design Direction
[Paste the winning design philosophy here]

## Files to Implement
1. Product Card component: [paste product-card.tsx code]
2. Homepage Hero: [paste hero.tsx code]
3. Cart Drawer: [paste cart-drawer.tsx code]

## Implementation Rules
- Match the Stitch design EXACTLY — colors, spacing, typography
- Use shadcn/ui components as base (Sheet, ToggleGroup, Badge, Card, etc.)
- Make everything responsive (mobile-first)
- Connect to existing Supabase data
- Use existing React patterns from src/components/
- Run `bun run build` to verify TypeScript before committing

## Start with: Product Card component
```

---

## RATE LIMIT HANDLING

When you hit a rate limit:

1. Write: "⏸️ RATE LIMITED at [current phase]. Pausing for [X] minutes."
2. Save all current progress to disk immediately
3. Use the pause time productively:
   - Write design critiques for unscrored designs
   - Plan the next set of Stitch prompts
   - Draft component code
   - Review and refine your scoring notes
4. When the timer expires, write: "▶️ RESUMING at [phase]."
5. Continue exactly where you left off

**Do NOT stop working during rate limits.** The only thing limited is web search and API calls. You can still write, plan, score, and generate code locally.

---

## CRITICAL REMINDERS

- **Save EVERYTHING to disk** — screenshots, scores, code, notes. Use save_to_disk: true for screenshots.
- **Be genuinely harsh in scoring** — 6/10 is honest. 9/10 is exceptional. Don't inflate.
- **Use the frontend-design skill** for every code generation and critique — no generic AI aesthetics.
- **Handle Stitch's Swedish UI** — Webb = Web, Exportera = Export, Dela = Share
- **Handle age gates** — Click "I am 18+", "Ja", "Enter" to get past nicotine site verifications
- **If Stitch fails** — refresh page, try again. After 3 failures, skip and move on.
- **Track your time** — note what hour you're in at the start of each phase
- **The goal is VOLUME** — generate as many scored designs as possible. More options = better decisions tomorrow.

---

## START NOW

Begin with Phase 1A: Run your first web search for "best designed e-commerce websites 2025 2026 consumable DTC". Let's go.
