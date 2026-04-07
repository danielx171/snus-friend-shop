import { useState } from "react";

// SnusFriend — Brand Page Header Template
// Mosaic/collage of 4-6 product images as background,
// dark overlay, brand name in large text, brand color accent.
// Fully template-based — works automatically with any brand.
//
// Data structure matches the Astro brand page:
//   - brand.name, brand.logoUrl, brand.manufacturer, brand.countryCode
//   - brandColor from brand-colors.ts
//   - products[].imageUrl (first 6 used for mosaic)

const DEMO_BRANDS = [
  {
    id: "zyn",
    name: "ZYN",
    manufacturer: "Swedish Match",
    country: "Sweden",
    color: "#00A0DC",
    productCount: 42,
    mgRange: "3-12 mg",
    logoUrl: null,
    products: [
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/zyn-cool-mint-9mg_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/zyn-apple-mint-6mg_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/zyn-spearmint-6mg_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/zyn-citrus-6mg_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/zyn-espressino-6mg_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/zyn-cool-mint-6mg_1.webp",
    ],
  },
  {
    id: "velo",
    name: "VELO",
    manufacturer: "BAT",
    country: "Sweden",
    color: "#003DA5",
    productCount: 38,
    mgRange: "4-14 mg",
    logoUrl: null,
    products: [
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/velo-freezing-peppermint-strong_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/velo-ruby-berry_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/velo-ice-cool_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/velo-tropic-breeze_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/velo-royal-purple_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/velo-mighty-peppermint_1.webp",
    ],
  },
  {
    id: "loop",
    name: "LOOP",
    manufacturer: "Another Snus Factory",
    country: "Sweden",
    color: "#FF6B35",
    productCount: 24,
    mgRange: "6-12.5 mg",
    logoUrl: null,
    products: [
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/loop-mint-mania_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/loop-red-chili-melon_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/loop-sicily-spritz_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/loop-jalapeno-lime_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/loop-salty-ludicris_1.webp",
      "https://snusfriends.com/cdn-cgi/image/width=200,quality=75/https://images.nyehandel.com/images/product/loop-habanero-mint_1.webp",
    ],
  },
];

/* ─── Mosaic grid positions ─── */
// 6 cells: 2 rows x 3 columns, with the first cell spanning 2 rows (hero product)
const MOSAIC_POSITIONS = [
  { gridColumn: "1 / 2", gridRow: "1 / 3", size: "lg" },     // Large left
  { gridColumn: "2 / 3", gridRow: "1 / 2", size: "sm" },     // Top middle
  { gridColumn: "3 / 4", gridRow: "1 / 2", size: "sm" },     // Top right
  { gridColumn: "2 / 3", gridRow: "2 / 3", size: "sm" },     // Bottom middle
  { gridColumn: "3 / 4", gridRow: "2 / 3", size: "sm" },     // Bottom right
];

function MosaicCell({ src, alt, position, brandColor }) {
  const imgSize = position.size === "lg" ? 140 : 80;
  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        gridColumn: position.gridColumn,
        gridRow: position.gridRow,
        background: `radial-gradient(circle at 50% 50%, ${brandColor}15 0%, transparent 70%)`,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="object-contain rounded-full transition-transform duration-700 hover:scale-110"
        style={{
          width: imgSize,
          height: imgSize,
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
          opacity: 0.75,
        }}
        loading="lazy"
        onError={(e) => { e.target.style.display = "none"; }}
      />
    </div>
  );
}

function BrandHeader({ brand }) {
  const mosaicProducts = brand.products.slice(0, 5);
  const initials = brand.name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "220px" }}>
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{ background: "#0c1018" }}
      />

      {/* Brand color ambient glow — subtle, anchored to top-left */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 10% 30%, ${brand.color}25 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, ${brand.color}10 0%, transparent 40%)
          `,
        }}
      />

      {/* Product mosaic grid — right side */}
      <div
        className="absolute top-0 right-0 bottom-0 hidden sm:grid"
        style={{
          width: "55%",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "2px",
          maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
        }}
      >
        {mosaicProducts.map((imgUrl, i) => (
          <MosaicCell
            key={i}
            src={imgUrl}
            alt={`${brand.name} product ${i + 1}`}
            position={MOSAIC_POSITIONS[i]}
            brandColor={brand.color}
          />
        ))}
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #0c1018 0%, #0c1018dd 40%, #0c101888 70%, #0c101866 100%)",
        }}
      />

      {/* Top accent line — brand color */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{
          background: `linear-gradient(90deg, ${brand.color}, ${brand.color}88, transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 sm:p-8">
        {/* Logo or initials */}
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.color}30, ${brand.color}15)`,
            border: `1px solid ${brand.color}25`,
            backdropFilter: "blur(12px)",
          }}
        >
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <span
              className="text-2xl font-extrabold"
              style={{ color: brand.color }}
            >
              {initials}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Brand name */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{
              color: "#f1f5f9",
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
            }}
          >
            {brand.name}
          </h1>

          {/* Metadata chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {brand.country && (
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {brand.country}
              </span>
            )}
            {brand.manufacturer && (
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                by {brand.manufacturer}
              </span>
            )}
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: `${brand.color}15`,
                color: brand.color,
                border: `1px solid ${brand.color}25`,
              }}
            >
              {brand.productCount} products
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {brand.mgRange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Demo page ─── */
export default function BrandPageHeader() {
  const [activeBrand, setActiveBrand] = useState(0);
  const brand = DEMO_BRANDS[activeBrand];

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ background: "#0c1018" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
          >
            SF
          </div>
          <h2 className="text-xl font-bold text-white">Brand Page Header — Mosaic Template</h2>
        </div>
        <p className="text-white/40 text-sm mb-6 ml-11">
          Click a brand to see the header adapt automatically. Product images form a background mosaic.
        </p>

        {/* Brand selector */}
        <div className="flex gap-2 mb-6 ml-11">
          {DEMO_BRANDS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setActiveBrand(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeBrand === i ? `${b.color}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeBrand === i ? `${b.color}40` : "rgba(255,255,255,0.06)"}`,
                color: activeBrand === i ? b.color : "rgba(255,255,255,0.4)",
              }}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* The header */}
        <BrandHeader brand={brand} />

        {/* Implementation notes */}
        <div
          className="mt-10 rounded-2xl p-6 text-[13px] text-white/40 leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <h3 className="text-white/60 font-semibold text-sm mb-3 uppercase tracking-wider">
            Astro Conversion Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white/50 font-medium mb-1">Template Logic</h4>
              <p>
                The component takes <code className="text-white/60">products</code> and <code className="text-white/60">brand</code> props.
                It picks the first 5 product images automatically — no per-brand configuration.
                The brand color from <code className="text-white/60">brand-colors.ts</code> drives the accent line,
                logo background, product count chip, and ambient glow. Everything else is neutral dark theme.
              </p>
            </div>
            <div>
              <h4 className="text-white/50 font-medium mb-1">Mosaic Masking</h4>
              <p>
                The product images fade in from the right using a CSS <code className="text-white/60">mask-image</code> gradient
                (transparent left → opaque right). This ensures the brand name on the left is always readable regardless
                of product image colors. On mobile (&lt;640px), the mosaic is hidden entirely since there isn't enough
                horizontal space. The overlay gradient also darkens left-to-right as a safety net.
              </p>
            </div>
            <div>
              <h4 className="text-white/50 font-medium mb-1">Performance</h4>
              <p>
                Product images use <code className="text-white/60">loading="lazy"</code> and are served at 200px width through
                the CDN image transform. The mosaic images are decorative — they have alt text but no interactive function.
                The component is pure CSS (no JS hover state needed), so it can be a static Astro component with no client JS.
              </p>
            </div>
            <div>
              <h4 className="text-white/50 font-medium mb-1">Fallbacks</h4>
              <p>
                If a brand has fewer than 5 products, the mosaic gracefully shows fewer cells.
                If a product image fails to load, <code className="text-white/60">onError</code> hides it.
                If no logo URL exists, the brand initials are shown in the brand color.
                All visual effects are CSS-only — no JavaScript required in the Astro version.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
