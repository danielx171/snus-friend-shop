# SnusFriend Product Photography Guidelines

Standard guidelines for consistent, high-quality catalog images across all 700+ products. These ensure visual consistency on product cards, PDPs, brand pages, and marketing materials.

---

## 1. Shot Types (Required Per Product)

Every product listing needs **3 shots minimum**, with 2 optional extras for hero products:

### Shot A — Hero Front (Required)
The primary catalog image shown on product cards and search results.

- **Angle:** Straight-on, camera at can level (0° tilt), very slight 5-10° rotation so both the front face and the can's depth are visible.
- **Orientation:** Can standing upright on its base.
- **Focus:** Entire can sharp, no selective focus. Label and branding must be fully legible.
- **Crop:** Can fills ~65-70% of the frame height. Equal breathing room on all sides.
- **Shadow:** Soft contact shadow beneath the can (no hard shadows, no dramatic lighting).

### Shot B — Lid Open / Pouches Visible (Required)
Shows the product inside — builds trust and shows what the customer receives.

- **Angle:** 30-40° top-down, enough to see inside the can while still showing the front label.
- **Lid:** Open and resting against the back of the can (not removed, not floating).
- **Pouches:** 2-3 pouches visible inside, neatly arranged. One pouch may sit partially on top of the others to show the pouch format (slim, mini, regular).
- **Focus:** Label and pouches both sharp.

### Shot C — Single Pouch Close-Up (Required)
Isolates the pouch itself — shows texture, size, and format.

- **Angle:** Flat lay, camera directly above (90° top-down).
- **Subject:** Single pouch centred in frame, on a clean dark surface.
- **Scale reference:** Optional — a coin or ruler at frame edge for size context. Not required for every shot.
- **Focus:** Full pouch sharp. Texture of the fleece/material should be visible.

### Shot D — Lifestyle/Context (Optional, Hero Products Only)
Shows the product in a real-world setting. Reserved for top-selling SKUs and new launches.

- **Setting:** Clean desk, café table, gym bag pocket, jacket pocket, car cupholder.
- **Style:** Product clearly identifiable but part of a natural scene. Not staged-looking.
- **People:** Hands may be in frame (holding can, placing pouch). No faces — keeps it universal and avoids model licensing complexity.
- **Lighting:** Natural light preferred. No harsh artificial flash.

### Shot E — Can Collection/Group (Optional, Brand Pages)
Shows multiple products from the same brand together.

- **Use:** Brand page headers, marketing materials, social media.
- **Arrangement:** 3-6 cans in a staggered row, slight overlapping, tallest/most popular in centre.
- **Background:** Dark gradient matching the brand colour (see brand-colors.ts).

---

## 2. Background & Surface

### Primary Background: Dark Gradient
All product shots use a dark gradient background for consistency with the site's dark theme.

- **Base:** #0c1018 to #161d2b gradient (left-to-right or centre-out radial).
- **Surface:** Matte dark surface (not glossy, not reflective). Dark slate, dark wood, or dark fabric.
- **No white backgrounds.** These clash with the site design and require post-processing to composite.
- **No busy backgrounds.** No patterns, textures, or props that compete with the product.

### Brand Colour Accent (Optional)
For hero/featured products, a subtle brand-colour accent can be added:

- A very soft coloured glow behind the can (matching brand colour from `brand-colors.ts`).
- Keep it subtle — 5-10% opacity. The product must dominate, not the glow.
- Example: ZYN (#00A0DC) gets a faint blue radial glow; VELO (#003DA5) gets a deeper blue.

---

## 3. Lighting Setup

### Primary: Softbox (Key Light)
- Position: 45° above, slightly to the left of camera.
- Quality: Large softbox or umbrella for even, diffused light.
- Purpose: Illuminates the front label evenly with no hotspots.

### Fill Light
- Position: Opposite side of key light, lower intensity (about 50% of key).
- Purpose: Lifts shadows on the opposite side of the can. Prevents the can from looking "half-lit."

### Rim/Back Light (Optional)
- Position: Behind and above the product.
- Purpose: Creates a subtle edge highlight that separates the can from the dark background.
- Intensity: Very subtle — just enough for edge separation, not enough to create glare on the can's surface.

### Key Principles
- **No harsh shadows.** Every shadow should be soft and gradual.
- **No reflections on can surfaces.** Matte lighting only. If the can's surface is glossy, use a polarising filter or adjust softbox angle.
- **Label readability first.** If the lighting makes the label hard to read, it's wrong.
- **Consistent colour temperature.** All shots at 5500K (daylight balanced). No warm/cool colour casts.

---

## 4. Camera Settings

| Setting | Value | Why |
|---------|-------|-----|
| Aperture | f/8 – f/11 | Deep depth of field, entire can sharp |
| ISO | 100 | Minimum noise, maximum sharpness |
| Shutter | 1/125+ (tripod) | No motion blur; adjust for exposure |
| White balance | 5500K (custom) | Consistent across all shots |
| Format | RAW + JPEG | RAW for editing, JPEG for reference |
| Lens | 50-85mm equivalent | Minimal distortion at product scale |

### Tripod Required
All shots must be tripod-mounted for consistency. Handheld introduces angle and framing variation that makes the catalog look inconsistent.

---

## 5. Post-Processing Standards

### Colour
- Match can colours to the physical product under daylight. No artistic colour grading.
- White balance correction if needed — cans should look identical to how they look in person.
- Saturation: Natural. Do not boost. If anything, reduce by 5% to avoid oversaturation on screens.

### Exposure
- Label text fully readable at 200×200px thumbnail size.
- No blown highlights. No crushed blacks (keep shadow detail).

### Sharpening
- Light output sharpening for web (Unsharp Mask: Amount 80, Radius 0.8, Threshold 2).
- Do not over-sharpen — creates haloing artefacts on can edges.

### Background Cleanup
- Remove any dust, surface imperfections, or reflections in post.
- Ensure background gradient is smooth and even (no banding).

### File Output

| Use Case | Format | Dimensions | Max Size |
|----------|--------|-----------|----------|
| Product card (grid) | WebP | 400×400 | 40 KB |
| PDP hero | WebP | 800×800 | 80 KB |
| Zoom/detail | WebP | 1600×1600 | 150 KB |
| Open Graph / social | PNG | 1200×630 | 200 KB |
| Original archive | TIFF/PSD | Full resolution | — |

Always export at 2× the display size for retina screens. A 400×400 display image should be exported from an 800×800 source.

---

## 6. Naming Convention

```
{brand-slug}_{product-slug}_{shot-type}.webp
```

Examples:
- `zyn_cool-mint-strong_hero.webp`
- `zyn_cool-mint-strong_open.webp`
- `zyn_cool-mint-strong_pouch.webp`
- `velo_freeze-max_hero.webp`
- `loop_jalapeño-lime_lifestyle.webp`

Shot type suffixes: `hero`, `open`, `pouch`, `lifestyle`, `group`

---

## 7. Common Mistakes to Avoid

1. **Inconsistent angles across products.** If ZYN cans are shot at 5° rotation and VELO at 15°, the product grid looks messy. Stick to 5-10° for all hero shots.

2. **Label not facing camera.** The brand name and flavour name must be the most prominent text visible. If the nutritional info side is showing, rotate the can.

3. **White/light backgrounds.** These don't work with our dark theme. They create jarring cards that break visual flow.

4. **Over-editing.** Don't add lens flares, dramatic colour grading, or excessive vignetting. The products should look like products, not movie posters.

5. **Inconsistent can sizes.** Different brands have different can dimensions. Normalise the visual size so all cans appear roughly the same height in product cards. This is done through crop/framing, not by resizing the can image.

6. **Missing open-can shot.** Customers want to see what's inside. Every product needs Shot B.

7. **Ignoring mobile.** 70%+ of SnusFriend traffic is mobile. Test every image at 160×160px — the smallest it'll appear on a product card. If the brand name isn't readable at that size, the image needs revision.

---

## 8. Brand-Specific Notes

| Brand | Can Shape | Special Considerations |
|-------|-----------|----------------------|
| ZYN | Round, squat | Distinctive top-click mechanism — show it clearly in Shot B |
| VELO | Round, slim | Very reflective surface — may need polariser |
| LOOP | Round, standard | Colourful labels — check colour accuracy carefully |
| Skruf | Round, textured | Matte texture is a selling point — show it in pouch close-up |
| Pablo | Round, tall-ish | Bold graphics — ensure full label visibility |
| Nordic Spirit | Round, slim | Subtle branding — may need tighter framing |
| White Fox | Round, standard | White can on dark bg = high contrast, adjust exposure accordingly |
| KILLA | Round, standard | Busy label design — wider framing to show full design |

---

## 9. Batch Shooting Workflow

For efficiency when photographing 50+ products in a session:

1. **Set up the rig once.** Tripod, lights, background, camera settings. Don't change anything between products.
2. **Shoot all hero shots first.** Same angle, same lighting, same crop. Swap cans only.
3. **Then all open shots.** Adjust camera angle to 30-40°, reshoot entire batch.
4. **Then all pouch close-ups.** Flat lay setup, shoot all.
5. **Lifestyle last.** Different setups per shot, so batch these by location/setting.
6. **Colour check every 20 products.** Place a colour reference card in frame, shoot, compare to the first batch to ensure lighting hasn't drifted.

Target pace: 3-4 minutes per product for the 3 required shots once the rig is set.

---

## 10. Image Delivery to Site

All final images go to Supabase Storage (`product-images` bucket) with the naming convention above. The Astro content layer pulls `image_url` from the products table at build time. When uploading new images:

1. Export WebP at the correct dimensions (see Section 5).
2. Upload to Supabase Storage with the correct filename.
3. Update the product's `image_url` in the products table if the filename changed.
4. Trigger a site rebuild to pick up the new images.

CDN caching: images are served through Supabase's CDN with `?width=400` transform parameter for product cards. Original high-res versions are available by omitting the transform.
