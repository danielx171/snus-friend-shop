/**
 * OG Social Images — Brand Pages (1200×630)
 * ==========================================
 * One OG image per brand page on snusfriends.com.
 * Uses each brand's primary color from brand-colors.ts as the accent.
 *
 * Template layout:
 *  ┌─────────────────────────────────────────────────────┐
 *  │ [4px accent bar — brand color]                      │
 *  │                                                     │
 *  │   ┌─ Left ──────────────┐  ┌─ Right ─────────────┐ │
 *  │   │ Brand pill (color)  │  │                      │ │
 *  │   │                     │  │   Abstract pouch     │ │
 *  │   │ BRAND NAME          │  │   icon with brand    │ │
 *  │   │ (large, white)      │  │   color accents      │ │
 *  │   │                     │  │                      │ │
 *  │   │ "Nicotine Pouches"  │  │                      │ │
 *  │   │ tagline / subtitle  │  └──────────────────────┘ │
 *  │   └─────────────────────┘                           │
 *  │                                                     │
 *  │ [snusfriends.com ·  Shop {Brand} ·  Free shipping] │
 *  │ [4px accent bar — brand color]                      │
 *  └─────────────────────────────────────────────────────┘
 *
 * Implementation:
 *  1. Export each SVG as 1200×630 PNG (Puppeteer, Sharp, or Satori)
 *  2. Save to /public/og/brands/{brand-slug}.png
 *  3. Reference from brand [slug].astro <meta property="og:image" ...>
 */

import React, { useState } from "react";

// ── Brand data from brand-colors.ts ──────────────────────────────────────────
const BRANDS = [
  { slug: "zyn",            name: "ZYN",            color: "#4CAF50", country: "Sweden",  tagline: "The world's #1 nicotine pouch" },
  { slug: "velo",           name: "VELO",           color: "#1565C0", country: "Sweden",  tagline: "Bold flavours, smooth delivery" },
  { slug: "loop",           name: "LOOP",           color: "#FF6F00", country: "Sweden",  tagline: "Eco-conscious pouches, vibrant taste" },
  { slug: "siberia",        name: "Siberia",        color: "#D32F2F", country: "Sweden",  tagline: "Extreme strength, not for beginners" },
  { slug: "skruf",          name: "Skruf",          color: "#1B5E20", country: "Sweden",  tagline: "Premium Swedish craftsmanship" },
  { slug: "white-fox",      name: "White Fox",      color: "#0D47A1", country: "Sweden",  tagline: "Clean, white, full-strength" },
  { slug: "pablo",          name: "Pablo",          color: "#B71C1C", country: "Europe",  tagline: "Ultra-strong for experienced users" },
  { slug: "nordic-spirit",  name: "Nordic Spirit",  color: "#37474F", country: "Sweden",  tagline: "Scandinavian simplicity" },
  { slug: "klar",           name: "Klar",           color: "#004D40", country: "Sweden",  tagline: "Crystal clear nicotine experience" },
  { slug: "fumi",           name: "Fumi",           color: "#6A1B9A", country: "Sweden",  tagline: "Japanese-inspired flavour craft" },
  { slug: "cuba",           name: "Cuba",           color: "#E65100", country: "Europe",  tagline: "Bold tropical character" },
  { slug: "iceberg",        name: "Iceberg",        color: "#00838F", country: "Europe",  tagline: "Icy cool, maximum freshness" },
  { slug: "ace",            name: "ACE",            color: "#2E7D32", country: "Sweden",  tagline: "Superwhite innovation" },
  { slug: "helwit",         name: "Helwit",         color: "#558B2F", country: "Sweden",  tagline: "Lighter pouches, lighter footprint" },
  { slug: "77-pouches",     name: "77 Pouches",     color: "#F9A825", country: "Europe",  tagline: "Seventy-seven ways to enjoy" },
  { slug: "apr-s",          name: "APRÈS",          color: "#795548", country: "Sweden",  tagline: "After-hours sophistication" },
  { slug: "chainpop",       name: "Chainpop",       color: "#AD1457", country: "Europe",  tagline: "Chain reactions of flavour" },
  { slug: "avant",          name: "Avant",          color: "#BF360C", country: "Europe",  tagline: "Avant-garde nicotine pouches" },
  { slug: "fix",            name: "FIX",            color: "#1A237E", country: "Europe",  tagline: "Your daily nicotine fix" },
  { slug: "fold",           name: "Fold",           color: "#33691E", country: "Sweden",  tagline: "Folded for comfort, packed with taste" },
  { slug: "klint",          name: "Klint",          color: "#00695C", country: "Sweden",  tagline: "Clean design, pure nicotine" },
  { slug: "xqs",            name: "XQS",            color: "#4A148C", country: "Sweden",  tagline: "Extra quality, extra satisfaction" },
  { slug: "on",             name: "ON!",            color: "#E53935", country: "Sweden",  tagline: "Micro pouches, mighty punch" },
  { slug: "killa",          name: "KILLA",          color: "#B71C1C", country: "Europe",  tagline: "Killer strength, killer flavour" },
  { slug: "denssi",         name: "Denssi",         color: "#283593", country: "Finland", tagline: "Finnish quality, dense satisfaction" },
  { slug: "clew",           name: "Clew",           color: "#0277BD", country: "Europe",  tagline: "Unravel the flavour" },
  { slug: "vid",            name: "VID",            color: "#4E342E", country: "Sweden",  tagline: "Wide range, wider appeal" },
  { slug: "garant",         name: "Garant",         color: "#1B5E20", country: "Sweden",  tagline: "Guaranteed Swedish tradition" },
  { slug: "rave",           name: "Rave",           color: "#7B1FA2", country: "Europe",  tagline: "Party-ready nicotine pouches" },
  { slug: "dope",           name: "DOPE",           color: "#00BFA5", country: "Sweden",  tagline: "Dopamine-level flavour hits" },
];

// ── Helper: lighten a hex color ──────────────────────────────────────────────
function lighten(hex, amount = 0.3) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

function darken(hex, amount = 0.3) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

// ── Abstract pouch icon with brand color ─────────────────────────────────────
function PouchIcon({ color, size = 200 }) {
  const light = lighten(color, 0.4);
  const dark = darken(color, 0.2);
  return (
    <g>
      {/* Outer glow ring */}
      <circle cx="600" cy="280" r={size * 0.6} fill="none" stroke={color} strokeWidth="1.5" opacity="0.15" />
      <circle cx="600" cy="280" r={size * 0.8} fill="none" stroke={color} strokeWidth="0.8" opacity="0.08" />
      {/* Pouch shape — rounded rectangle with pinch */}
      <ellipse cx="600" cy="260" rx={size * 0.45} ry={size * 0.55} fill={dark} opacity="0.25" />
      <ellipse cx="600" cy="255" rx={size * 0.4} ry={size * 0.5} fill={color} opacity="0.6" />
      {/* Inner highlight */}
      <ellipse cx="585" cy="230" rx={size * 0.2} ry={size * 0.3} fill={light} opacity="0.3" />
      {/* Pouch fold line */}
      <path
        d={`M${600 - size * 0.25} 280 Q600 ${280 + size * 0.15} ${600 + size * 0.25} 280`}
        fill="none"
        stroke={light}
        strokeWidth="2"
        opacity="0.4"
      />
      {/* Decorative dots pattern */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const dotR = size * 0.65;
        const cx = 600 + Math.cos(angle) * dotR;
        const cy = 270 + Math.sin(angle) * dotR;
        return <circle key={i} cx={cx} cy={cy} r="4" fill={color} opacity="0.2" />;
      })}
      {/* Small leaf / freshness accent */}
      <path
        d={`M${600 + size * 0.1} ${255 - size * 0.4} q${size * 0.15} ${size * 0.05} ${size * 0.08} ${size * 0.2} q-${size * 0.12} -${size * 0.02} -${size * 0.08} -${size * 0.2}`}
        fill={color}
        opacity="0.35"
      />
    </g>
  );
}

// ── Single OG Image Component ────────────────────────────────────────────────
function BrandOGImage({ brand, showGuides = false }) {
  const { name, color, tagline, country } = brand;
  const light = lighten(color, 0.5);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 630"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        {/* Background gradient — dark theme */}
        <linearGradient id={`bg-${brand.slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c1018" />
          <stop offset="100%" stopColor="#161d2b" />
        </linearGradient>
        {/* Brand color gradient for accents */}
        <linearGradient id={`accent-${brand.slug}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={light} />
        </linearGradient>
        {/* Subtle radial glow behind the icon */}
        <radialGradient id={`glow-${brand.slug}`} cx="0.65" cy="0.45" r="0.4">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="1200" height="630" fill={`url(#bg-${brand.slug})`} />

      {/* Radial glow */}
      <rect width="1200" height="630" fill={`url(#glow-${brand.slug})`} />

      {/* Top accent bar */}
      <rect x="0" y="0" width="1200" height="5" fill={`url(#accent-${brand.slug})`} />

      {/* Bottom accent bar */}
      <rect x="0" y="625" width="1200" height="5" fill={`url(#accent-${brand.slug})`} />

      {/* Subtle grid pattern overlay */}
      <g opacity="0.03">
        {[...Array(24)].map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="630" stroke="#fff" strokeWidth="0.5" />
        ))}
        {[...Array(13)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} stroke="#fff" strokeWidth="0.5" />
        ))}
      </g>

      {/* Abstract pouch icon — right side */}
      <PouchIcon color={color} size={200} />

      {/* Brand color pill */}
      <rect x="80" y="180" width={Math.max(name.length * 11 + 40, 120)} height="32" rx="16" fill={color} opacity="0.2" />
      <text x="100" y="202" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="600" fill={color} letterSpacing="1.5">
        {country.toUpperCase()}
      </text>

      {/* Brand name — large */}
      <text x="80" y="290" fontFamily="Inter, system-ui, sans-serif" fontSize={name.length > 12 ? "64" : "80"} fontWeight="800" fill="#f1f5f9" letterSpacing="-1">
        {name}
      </text>

      {/* Subtitle */}
      <text x="80" y="340" fontFamily="Inter, system-ui, sans-serif" fontSize="24" fontWeight="400" fill="#94a3b8">
        Nicotine Pouches
      </text>

      {/* Tagline */}
      <text x="80" y="385" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="400" fill="#64748b" fontStyle="italic">
        {tagline}
      </text>

      {/* Divider line */}
      <line x1="80" y1="420" x2="400" y2="420" stroke={color} strokeWidth="2" opacity="0.3" />

      {/* Bottom info bar */}
      <rect x="0" y="540" width="1200" height="85" fill="#0a0e15" opacity="0.6" />

      {/* snusfriends.com */}
      <text x="80" y="590" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="600" fill="#f1f5f9" letterSpacing="0.5">
        snusfriends.com
      </text>

      {/* Separator dot */}
      <circle cx="240" cy="586" r="2.5" fill="#475569" />

      {/* CTA */}
      <text x="260" y="590" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="400" fill="#94a3b8">
        Shop {name} · Free EU Shipping
      </text>

      {/* Brand color swatch (small) */}
      <rect x="1080" y="572" width="40" height="24" rx="4" fill={color} opacity="0.8" />

      {showGuides && (
        <g opacity="0.3">
          <line x1="600" y1="0" x2="600" y2="630" stroke="red" strokeWidth="0.5" strokeDasharray="4" />
          <line x1="0" y1="315" x2="1200" y2="315" stroke="red" strokeWidth="0.5" strokeDasharray="4" />
          <rect x="80" y="80" width="1040" height="470" fill="none" stroke="cyan" strokeWidth="0.5" strokeDasharray="4" />
        </g>
      )}
    </svg>
  );
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export default function BrandOGGallery() {
  const [selected, setSelected] = useState(0);
  const [showGuides, setShowGuides] = useState(false);

  return (
    <div style={{ background: "#0c1018", minHeight: "100vh", padding: "32px", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#f1f5f9", fontSize: 24, margin: 0, fontWeight: 700 }}>
            OG Images — Brand Pages
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>
            {BRANDS.length} brand OG images · 1200×630 · SVG → PNG export
          </p>
        </div>
        <label style={{ color: "#94a3b8", fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showGuides}
            onChange={(e) => setShowGuides(e.target.checked)}
            style={{ accentColor: "#a3e635" }}
          />
          Show guides
        </label>
      </div>

      {/* Selected preview */}
      <div style={{ maxWidth: 1200, margin: "0 auto 32px", borderRadius: 12, overflow: "hidden", border: `1px solid ${BRANDS[selected].color}33` }}>
        <BrandOGImage brand={BRANDS[selected]} showGuides={showGuides} />
      </div>

      {/* Brand name + slug */}
      <div style={{ maxWidth: 1200, margin: "0 auto 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 600 }}>{BRANDS[selected].name}</span>
        <code style={{ color: "#64748b", fontSize: 13, background: "#1e293b", padding: "2px 8px", borderRadius: 4 }}>
          /public/og/brands/{BRANDS[selected].slug}.png
        </code>
        <span style={{ width: 20, height: 20, borderRadius: 4, background: BRANDS[selected].color, display: "inline-block", border: "1px solid #ffffff20" }} />
        <code style={{ color: "#64748b", fontSize: 13 }}>{BRANDS[selected].color}</code>
      </div>

      {/* Thumbnail grid */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 12,
      }}>
        {BRANDS.map((brand, i) => (
          <button
            key={brand.slug}
            onClick={() => setSelected(i)}
            style={{
              background: i === selected ? "#1e293b" : "#161d2b",
              border: i === selected ? `2px solid ${brand.color}` : "2px solid transparent",
              borderRadius: 8,
              padding: 12,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: brand.color, flexShrink: 0 }} />
              <span style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>{brand.name}</span>
            </div>
            <div style={{ color: "#64748b", fontSize: 11 }}>{brand.slug}.png</div>
          </button>
        ))}
      </div>

      {/* Implementation notes */}
      <div style={{ maxWidth: 1200, margin: "40px auto 0", padding: 24, background: "#161d2b", borderRadius: 12, border: "1px solid #1e293b" }}>
        <h3 style={{ color: "#a3e635", fontSize: 15, margin: "0 0 12px", fontWeight: 600 }}>Implementation Notes</h3>
        <ul style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
          <li>Export: Render each SVG via Satori/Puppeteer → 1200×630 PNG</li>
          <li>Path: <code style={{ color: "#a3e635" }}>/public/og/brands/{"[slug]"}.png</code></li>
          <li>Meta tag: <code style={{ color: "#a3e635" }}>{'<meta property="og:image" content="https://snusfriends.com/og/brands/[slug].png" />'}</code></li>
          <li>Also set <code style={{ color: "#a3e635" }}>twitter:card=summary_large_image</code> for optimal X/Twitter display</li>
          <li>Brand colors are sourced from <code style={{ color: "#a3e635" }}>src/data/brand-colors.ts</code></li>
          <li>Taglines can be replaced with actual brand slogans or product counts from the catalog</li>
          <li>Category pages (flavour, strength, country) can reuse this template with different accent colors from <code style={{ color: "#a3e635" }}>flavorColors</code> / <code style={{ color: "#a3e635" }}>strengthColors</code></li>
        </ul>
      </div>
    </div>
  );
}
