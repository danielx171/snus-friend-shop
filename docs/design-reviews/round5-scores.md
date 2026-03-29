# SnusFriend Design Marathon — Round 5 Scores

**Date:** 2026-03-28
**Reviewer:** Claude (Harsh Design Director mode)
**Showcase:** docs/design-reviews/design-round5-themes.html

---

## Scoring System (same as Rounds 1-4)
*(Visual Impact × 0.25 + E-commerce UX × 0.25 + Brand Consistency × 0.20 + Implementability × 0.20 + Mobile Readiness × 0.10)*

### 5 Signature UX Patterns (must be present):
1. Color-coded strength badges (green/yellow/orange/red)
2. Pack selector pills (1 Can / 5-Pack / 10-Pack)
3. Free shipping progress bar (€29 threshold)
4. Per-unit pricing display
5. Trust bar with service badges

---

## DESIGN N: Arctic Frost Homepage

**Theme:** Scandinavian luxury pharmacy — clinical precision meets warmth
**Palette:** Pure white #FEFEFE + steel blue hsl(210, 45%, 55%) + frost silver
**Typography:** Manrope (geometric sans-serif)
**Reference:** Aesop, Nordic pharmacy, Ritual.com

### SCORES (1-10):
| Criteria | Score |
|----------|-------|
| Visual Impact | 7 |
| E-commerce UX | 8 |
| Brand Consistency | 7 |
| Implementability | 9 |
| Mobile Readiness | 8 |
| **WEIGHTED TOTAL** | **7.65** |

### STRENGTHS:
1. Clean, clinical aesthetic communicates product purity — aligns with "tobacco-free" positioning
2. Steel blue is trustworthy and professional — excellent for health-adjacent products
3. Frosted glass panels add premium depth without visual noise
4. High contrast white-on-blue for CTAs ensures excellent conversion visibility
5. All 5 signature UX patterns present and well-integrated

### WEAKNESSES:
1. Very similar to existing "Light" (Scandinavian) theme — not different enough to justify a new theme slot
2. Steel blue may feel cold/corporate — lacks the warmth that makes shoppers browse longer
3. White backgrounds risk feeling generic against pharmacy/wellness competitors (Ritual, Hims)
4. Hero headline "Premium Pouches, Pure Experience" is functional but not memorable
5. Low personality score — could be any DTC wellness brand

### FRONTEND CRITIQUE:
- **Typography:** Manrope is clean but unremarkable — similar feel to Inter (already in use)
- **Color:** The frost silver accent is too subtle — needs more contrast between card backgrounds and page background
- **Differentiation:** Overlaps significantly with existing Light theme. Would need very different card interactions to feel distinct

### KEEP: Frosted glass panels, clinical trust aesthetic, clean search bar design
### DISCARD: Too similar to Light theme — merge best elements instead of adding a 6th theme

---

## DESIGN O: Noir Luxe Homepage

**Theme:** Ultra-premium dark luxury — exclusive members' club feel
**Palette:** Pure black #080808 + gold #D4AF37 + warm cream #FAF7F0
**Typography:** Cormorant Garant (serif headings) + Inter (body)
**Reference:** SSENSE, Berluti, The Vault (Round 4)

### SCORES (1-10):
| Criteria | Score |
|----------|-------|
| Visual Impact | 9 |
| E-commerce UX | 7 |
| Brand Consistency | 6 |
| Implementability | 7 |
| Mobile Readiness | 6 |
| **WEIGHTED TOTAL** | **7.25** |

### STRENGTHS:
1. Stunning visual impact — black + gold is immediately premium and memorable
2. Serif headings (Cormorant Garant) add editorial gravitas that no competitor uses
3. Gold line accents create visual rhythm without clutter
4. "The Art of the Perfect Pouch" hero headline has personality and editorial weight
5. The dark canvas makes product packaging colors pop dramatically

### WEAKNESSES:
1. Gold accent on pure black may feel too "luxury fashion" and alienate budget-conscious bulk buyers (80% of SnusFriend's audience)
2. Serif typography, while beautiful, slows scanning speed on product-heavy pages
3. Brand consistency drops — SnusFriend is positioned as friendly/accessible, not exclusive/intimidating
4. Gold strength badges lose the intuitive color-coding (green=mild, red=strong) — accessibility issue
5. Dark backgrounds on long PLPs cause eye fatigue during extended browsing sessions
6. Very similar to "The Vault" from Round 4 (scored 8.65) — but that was purpose-built, this is simpler

### FRONTEND CRITIQUE:
- **Typography:** Cormorant Garant is gorgeous but heavy to load (adds ~40KB). Worth it if this becomes a real theme
- **Color:** Gold #D4AF37 needs careful WCAG checking against black backgrounds — may fail AA for small text
- **Differentiation:** Overlaps with existing Velo (dark) and Copper (dark) themes. Too many dark themes in the lineup

### KEEP: Editorial serif headings concept, gold as accent color for premium moments
### DISCARD: As a standalone theme, too overlapping with Velo/Copper. Better as an "event" skin (Black Friday, VIP)

---

## DESIGN P: Sunset Terracotta Homepage

**Theme:** Warm artisanal editorial — pottery studio meets Kinfolk magazine
**Palette:** Warm sand #FDF6EC + terracotta hsl(16, 65%, 48%) + sage green hsl(150, 25%, 45%)
**Typography:** DM Serif Display (headings) + DM Sans (body)
**Reference:** Kinfolk, Aesop, Ceramics studios

### SCORES (1-10):
| Criteria | Score |
|----------|-------|
| Visual Impact | 9 |
| E-commerce UX | 8 |
| Brand Consistency | 8 |
| Implementability | 8 |
| Mobile Readiness | 8 |
| **WEIGHTED TOTAL** | **8.30** |

### STRENGTHS:
1. Completely unique in the nicotine pouch market — no competitor uses warm earth tones
2. Terracotta + sage green is a proven DTC palette (see: Aesop, Glossier, Le Labo) — warm and trustworthy
3. DM Serif Display headings add editorial personality without slowing readability
4. Warm sand background reduces eye strain during long browsing sessions — proven by usability studies
5. "Crafted for Your Ritual" hero headline perfectly bridges health/lifestyle positioning
6. 16px rounded corners and warm shadows create tactile, approachable feel
7. Sage green secondary works beautifully for CTAs — associates with health/nature
8. All 5 signature UX patterns present with warm color adaptations

### WEAKNESSES:
1. Terracotta may read as "old-fashioned" to younger demographics (18-25) who expect tech/neon aesthetics
2. The editorial serif + earth tone combo could feel more "home goods" than "nicotine products"
3. Sage green CTAs need to be high enough contrast against sand backgrounds — WCAG validation needed
4. Two-tone (terracotta + sage) palette is harder to maintain consistently than single-primary themes
5. Brand carousel on warm sand needs careful product image treatment to not look washed out

### FRONTEND CRITIQUE:
- **Typography:** DM Serif Display + DM Sans is an excellent free font pairing — both on Google Fonts, reasonable weights
- **Color:** Terracotta primary is instantly recognizable and warm. The sage secondary provides excellent contrast variety
- **Spacing:** Rounded corners and generous padding create a premium artisanal feel without wasting space
- **Differentiation:** HIGHEST differentiation from both competitors AND existing SnusFriend themes. No overlap with forest, light, editorial, copper, or velo

### KEEP: Everything — this is the strongest new theme concept
### IMPROVE: Validate sage green contrast ratios, add a darker terracotta variant for hover states

---

## DESIGN Q: Ocean Depth Homepage

**Theme:** Premium outdoor/surf brand energy — deep ocean with coral pops
**Palette:** Deep navy #0A1628 + coral hsl(16, 85%, 60%) + seafoam hsl(175, 50%, 75%)
**Typography:** Outfit (modern geometric)
**Reference:** Outerknown, Patagonia, reef brands

### SCORES (1-10):
| Criteria | Score |
|----------|-------|
| Visual Impact | 8 |
| E-commerce UX | 7 |
| Brand Consistency | 7 |
| Implementability | 8 |
| Mobile Readiness | 7 |
| **WEIGHTED TOTAL** | **7.45** |

### STRENGTHS:
1. Coral accent is eye-catching and unique in the nicotine pouch space
2. Deep navy-to-midnight gradient hero creates depth and sophistication
3. "Dive Into Flavor" headline is playful and brand-appropriate
4. Seafoam secondary color works well for subtle highlights and trust badges
5. Outfit typography is modern and energetic — appeals to 18-30 demographic
6. Dark canvas with coral CTAs creates excellent contrast for conversion elements

### WEAKNESSES:
1. Ocean/surf branding doesn't connect naturally to nicotine pouches — needs more thematic bridging
2. Coral + seafoam is a trendy palette that may date quickly (peak 2024-2025)
3. Three-color palette (navy + coral + seafoam) is more complex to maintain than two-color themes
4. Dark theme fatigue — this is the 4th dark variant after Velo, Copper, and Noir Luxe
5. Coral strength badges may conflict with the orange/red strength color system
6. Mobile readiness drops with complex gradient backgrounds

### FRONTEND CRITIQUE:
- **Typography:** Outfit is lightweight and modern — excellent for digital. But very similar to Inter in feel
- **Color:** Navy is darker than Velo's navy (#0A1628 vs Velo's blue) — may feel too similar to some users
- **Differentiation:** Moderate — different from competitors but overlaps with Velo (dark + blue family)

### KEEP: Coral accent concept, gradient hero treatment
### DISCARD: As a full theme, too many dark options already. Better as seasonal variation

---

## ROUND 5 RANKINGS

| Rank | Design | Theme | Score | Verdict |
|------|--------|-------|-------|---------|
| 1 | **Sunset Terracotta** | P | **8.30** | **STRONG ADD — fills a gap no other theme covers** |
| 2 | Arctic Frost | N | 7.65 | Skip — too similar to existing Light theme |
| 3 | Ocean Depth | Q | 7.45 | Interesting but too many dark themes already |
| 4 | Noir Luxe | O | 7.25 | Beautiful but wrong brand fit for daily shopping |

---

## MASTER RANKINGS (All Rounds Combined)

| Rank | Design | Round | Type | Score |
|------|--------|-------|------|-------|
| 1 | **Connoisseur Hybrid PDP** | R3 | PDP | **9.18** |
| 2 | **Copper Glass Checkout** | R3 | Checkout | **8.93** |
| 3 | **Scandinavian Zen PDP** | R4 | PDP | **8.80** |
| 4 | **Forest Mobile HP** | R3 | Mobile HP | **8.73** |
| 5 | **The Vault Dark HP** | R4 | HP | **8.65** |
| 6 | **Cart Drawer** | R1 | Cart | **8.45** |
| 7 | **🆕 Sunset Terracotta HP** | R5 | HP | **8.30** |
| 8 | **PDP (Midnight Teal)** | R1 | PDP | **7.95** |
| 9 | Light Homepage | R1 | HP | 7.60 |
| 10 | 🆕 Arctic Frost HP | R5 | HP | 7.65 |
| 11 | Bold Playful HP | R1 | HP | 7.50 |
| 12 | 🆕 Ocean Depth HP | R5 | HP | 7.45 |
| 13 | PLP (Midnight Curator) | R1 | PLP | 7.35 |
| 14 | 🆕 Noir Luxe HP | R5 | HP | 7.25 |
| 15 | Dark Homepage | R1 | HP | 7.00 |

---

## RECOMMENDATION: Optimal Theme Lineup for SnusFriend

### Current 5 themes: forest, light, editorial, copper, velo

### Proposed action:

**ADD Sunset Terracotta as 6th theme** — It fills the "warm artisanal" gap that none of the existing 5 cover:
- Forest = nature/trust (green)
- Light = Scandinavian clean (white/blue)
- Editorial = sophisticated warm (cream/cognac)
- Copper = dark premium (charcoal/copper)
- Velo = electric dark (navy/blue)
- **Terracotta = earthy/artisanal (sand/terracotta/sage)** ← NEW

The Sunset Terracotta theme would:
- Appeal to the health-conscious, lifestyle-oriented segment
- Differentiate SnusFriend from ALL competitors (none use earth tones)
- Work beautifully on both desktop and mobile
- Add warmth without overlapping with Editorial (which is cream/cognac vs sand/terracotta)

### CSS implementation cost:
- ~200 lines of CSS custom properties (same pattern as forest/copper)
- ~0.6KB gzipped addition to index.css
- Homepage would still be well under 14KB gzipped threshold
- DM Serif Display + DM Sans need to be added to font stack (~45KB total, loaded async)

### DO NOT ADD the other 3:
- Arctic Frost: Redundant with Light theme
- Noir Luxe: Beautiful but wrong brand personality for daily use
- Ocean Depth: Too many dark themes already (velo + copper is enough)
