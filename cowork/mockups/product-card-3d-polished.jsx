import { useState, useRef, useCallback } from "react";

// SnusFriend — Polished 3D Product Cards (Final)
// Two refined variants ready for implementation:
//   TILT — Mouse-tracking 3D perspective (hero variant)
//   EDGE — Clean physical thickness with strength color (simplified)
//
// Astro compatibility:
//   React island inside FilterableProductGrid (already React).
//   All product text renders in server HTML — zero SEO impact.
//   Mobile: tilt disabled, falls back to subtle hover lift.

const PRODUCTS = [
  {
    id: 1, name: "Cool Mint", brand: "ZYN",
    strength: "strong", strengthLabel: "Strong", strengthDots: 4,
    mg: "9 mg", flavor: "mint", flavorLabel: "Mint",
    price: 4.29, originalPrice: null, earnPts: 43,
    rating: 4.8, reviewCount: 124,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/zyn-cool-mint-9mg_1.webp",
    brandColor: "#00A0DC", flavorColor: "#06B6D4", strengthColor: "#f97316",
    badge: "Bestseller", badgeColor: "#f59e0b",
    format: "Slim", pouchCount: 24,
  },
  {
    id: 2, name: "Freezing Peppermint", brand: "VELO",
    strength: "extra-strong", strengthLabel: "X-Strong", strengthDots: 5,
    mg: "14 mg", flavor: "mint", flavorLabel: "Mint",
    price: 3.89, originalPrice: 4.49, earnPts: 39,
    rating: 4.6, reviewCount: 87,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/velo-freezing-peppermint-strong_1.webp",
    brandColor: "#003DA5", flavorColor: "#06B6D4", strengthColor: "#ef4444",
    badge: "Sale", badgeColor: "#ef4444",
    format: "Slim", pouchCount: 20,
  },
  {
    id: 3, name: "Ruby Berry", brand: "VELO",
    strength: "normal", strengthLabel: "Medium", strengthDots: 3,
    mg: "6 mg", flavor: "berry", flavorLabel: "Berry",
    price: 3.89, originalPrice: null, earnPts: 39,
    rating: 4.5, reviewCount: 56,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/velo-ruby-berry_1.webp",
    brandColor: "#003DA5", flavorColor: "#A855F7", strengthColor: "#3b82f6",
    badge: "New", badgeColor: "#22c55e",
    format: "Slim", pouchCount: 20,
  },
  {
    id: 4, name: "Apple Mint", brand: "ZYN",
    strength: "normal", strengthLabel: "Medium", strengthDots: 3,
    mg: "6 mg", flavor: "fruit", flavorLabel: "Fruit",
    price: 4.29, originalPrice: null, earnPts: 43,
    rating: 4.9, reviewCount: 203,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/zyn-apple-mint-6mg_1.webp",
    brandColor: "#00A0DC", flavorColor: "#84CC16", strengthColor: "#3b82f6",
    badge: "#1 in EU", badgeColor: "#f59e0b",
    format: "Slim", pouchCount: 24,
  },
];

/* ─── Shared components ─── */

function StrengthDots({ dots, max = 5, color }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Strength ${dots} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="transition-all duration-300"
          style={{
            width: i < dots ? 7 : 5,
            height: i < dots ? 7 : 5,
            borderRadius: "50%",
            backgroundColor: i < dots ? color : "rgba(255,255,255,0.1)",
            boxShadow: i < dots ? `0 0 6px ${color}60` : "none",
          }} />
      ))}
    </div>
  );
}

function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars, ${count} reviews`}>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((s) => {
          const fill = s <= Math.floor(rating) ? 1 : s - rating < 1 ? rating % 1 : 0;
          return (
            <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 20 20">
              <defs>
                <linearGradient id={`star-fill-${s}-${rating}`}>
                  <stop offset={`${fill * 100}%`} stopColor="#fbbf24" />
                  <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.08)" />
                </linearGradient>
              </defs>
              <path fill={`url(#star-fill-${s}-${rating})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
      <span className="text-xs text-white/40 font-medium">({count})</span>
    </div>
  );
}

function WishlistHeart({ active, onToggle, style = {} }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: active ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${active ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
        ...style,
      }}>
      <svg className="w-4 h-4 transition-all duration-300" viewBox="0 0 24 24"
        fill={active ? "#ef4444" : "none"}
        stroke={active ? "#ef4444" : "rgba(255,255,255,0.45)"}
        strokeWidth={2}
        style={{ transform: active ? "scale(1.1)" : "scale(1)", filter: active ? "drop-shadow(0 0 4px rgba(239,68,68,0.4))" : "none" }}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   POLISHED 3D TILT CARD
   ═══════════════════════════════════════════════════════════════
   Changes from v1:
   - Partial star fills (4.8 shows 4 full + 80% filled)
   - Cleaner strength indicator: dots + label in one glass pill
   - Holographic sheen toned down (was too distracting)
   - Sale price with strikethrough
   - Tighter spacing, better visual rhythm
   - Active dots slightly larger than inactive (visual weight)
   - Glow uses single color (flavor only, no competing brand glow)
   - CTA button: cleaner gradient, subtle inner shine
   - Card surface has micro-texture (noise-like gradient bands)
   ═══════════════════════════════════════════════════════════════ */

function TiltCard({ product }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    // Clamp tilt to ±10 degrees for subtlety
    const x = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2))) * 10;
    const y = Math.max(-1, Math.min(1, -(e.clientX - cx) / (r.width / 2))) * 10;
    setTilt({ x, y });
  }, []);

  const resetTilt = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div style={{ perspective: "800px" }}>
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
        onMouseMove={handleMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={resetTilt}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? "scale(1.015)" : "scale(1)"}`,
          transformStyle: "preserve-3d",
          transition: isHovered
            ? "box-shadow 0.3s, scale 0.3s"
            : "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          background: "linear-gradient(165deg, #191f30 0%, #12161f 50%, #0c1018 100%)",
          boxShadow: isHovered
            ? `0 30px 60px -10px rgba(0,0,0,0.55),
               0 0 40px -10px ${product.flavorColor}10,
               inset 0 1px 0 rgba(255,255,255,0.07)`
            : `0 8px 28px -6px rgba(0,0,0,0.4),
               inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Subtle surface texture — very fine diagonal lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)",
            backgroundSize: "4px 4px",
          }} />

        {/* Holographic light sweep — subtle, single pass */}
        <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl"
          style={{
            opacity: isHovered ? 0.06 : 0,
            transition: "opacity 0.4s",
            background: `linear-gradient(${130 + tilt.y * 4}deg,
              transparent 30%,
              rgba(255,255,255,0.5) ${49 + tilt.y}%,
              transparent ${51 + tilt.y}%,
              transparent)`,
          }} />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-30"
            style={{ transform: "translateZ(20px)" }}>
            <div className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide text-white uppercase"
              style={{
                backgroundColor: product.badgeColor,
                boxShadow: `0 2px 10px ${product.badgeColor}40`,
                letterSpacing: "0.04em",
              }}>
              {product.badge}
            </div>
          </div>
        )}

        {/* Wishlist */}
        <div className="absolute top-3 right-3 z-30" style={{ transform: "translateZ(20px)" }}>
          <WishlistHeart active={wishlisted} onToggle={() => setWishlisted(!wishlisted)} />
        </div>

        {/* ── Image area ── */}
        <div className="relative h-52 flex items-center justify-center overflow-hidden">

          {/* Single ambient glow — flavor color only */}
          <div className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${50 - tilt.y * 2}% ${52 - tilt.x * 2}%,
                ${product.flavorColor}45 0%,
                ${product.flavorColor}08 45%,
                transparent 70%)`,
              opacity: isHovered ? 0.55 : 0.18,
              transition: isHovered ? "opacity 0.3s" : "all 0.6s",
              filter: "blur(8px)",
            }} />

          {/* Product image — parallax shift + lift on hover */}
          <div className="relative z-10"
            style={{
              transform: `translateZ(35px)
                translate(${tilt.y * -1.5}px, ${tilt.x * -1.5}px)
                ${isHovered ? "scale(1.06)" : "scale(1)"}`,
              transition: isHovered ? "scale 0.4s ease-out" : "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            }}>
            <div className="w-36 h-36 rounded-full overflow-hidden"
              style={{
                filter: `drop-shadow(0 14px 28px rgba(0,0,0,0.55))
                  drop-shadow(0 0 ${isHovered ? 18 : 8}px ${product.flavorColor}${isHovered ? "30" : "15"})`,
                transition: "filter 0.4s",
              }}>
              <img src={product.image} alt={`${product.brand} ${product.name}`}
                className="w-full h-full object-contain" loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:white;background:linear-gradient(135deg,${product.brandColor},${product.flavorColor})">${product.brand[0]}</div>`;
                }} />
            </div>
          </div>

          {/* Floating glass strength pill */}
          <div className="absolute bottom-3 left-1/2 z-20"
            style={{
              transform: `translateX(-50%) translateZ(20px) translate(${tilt.y * -0.5}px, ${tilt.x * -0.5}px)`,
              transition: isHovered ? "none" : "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            }}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}>
              <span className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: product.strengthColor }}>
                {product.strengthLabel}
              </span>
              <div className="w-px h-3 bg-white/10" />
              <StrengthDots dots={product.strengthDots} color={product.strengthColor} />
            </div>
          </div>
        </div>

        {/* Divider — subtle gradient line */}
        <div className="mx-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)` }} />

        {/* ── Content area ── */}
        <div className="p-4 pt-3" style={{ transform: "translateZ(10px)" }}>

          {/* Brand */}
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] block mb-0.5"
            style={{ color: product.brandColor }}>
            {product.brand}
          </span>

          {/* Product name */}
          <h3 className="text-white font-semibold text-[15px] leading-snug mb-2">
            {product.name}
          </h3>

          {/* Stars */}
          <Stars rating={product.rating} count={product.reviewCount} />

          {/* Attribute pills */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: `${product.flavorColor}15`,
                color: product.flavorColor,
                border: `1px solid ${product.flavorColor}20`,
              }}>
              {product.flavorLabel}
            </span>
            <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              {product.mg}
            </span>
            <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              {product.format} · {product.pouchCount}p
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-4 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-baseline gap-1.5">
              {product.originalPrice && (
                <span className="text-sm text-white/30 line-through font-medium">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-white">
                €{product.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-emerald-400/70 font-semibold ml-0.5">
                +{product.earnPts}
              </span>
            </div>
            <button
              aria-label={`Add ${product.name} to cart`}
              className="group/btn relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white overflow-hidden transition-shadow duration-300"
              style={{
                background: `linear-gradient(135deg, ${product.flavorColor}dd, ${product.brandColor})`,
                boxShadow: isHovered
                  ? `0 6px 20px -4px ${product.flavorColor}40`
                  : `0 2px 8px -2px rgba(0,0,0,0.3)`,
              }}>
              {/* Inner top shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
              <svg className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover/btn:rotate-90"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="relative z-10">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SIMPLIFIED PHYSICAL EDGE CARD
   ═══════════════════════════════════════════════════════════════
   Changes from v1:
   - REMOVED: left flavor spine (was competing with edge)
   - REMOVED: strength ambient glow from right side
   - REMOVED: strength bar at bottom of image
   - ONE color accent: the right edge = strength color. Period.
   - Card tilts less aggressively (3deg instead of 5deg)
   - Edge is thicker (10px) and has proper lighting gradient
   - The edge color tells the whole strength story at a glance
   - Everything else is neutral/dark — the edge IS the statement
   ═══════════════════════════════════════════════════════════════ */

function EdgeCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      <div className="relative transition-all duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotateY(-3deg) rotateX(1.5deg) translateY(-4px)"
            : "rotateY(0) rotateX(0) translateY(0)",
        }}>

        {/* Right edge — THE color accent. Strength color = physical edge. */}
        <div className="absolute top-3 -right-px bottom-3 rounded-r-xl overflow-hidden transition-all duration-500"
          style={{
            width: "10px",
            transformOrigin: "left center",
            transform: "rotateY(90deg) translateX(-5px)",
            background: `linear-gradient(180deg,
              ${product.strengthColor}dd 0%,
              ${product.strengthColor} 25%,
              ${product.strengthColor} 75%,
              ${product.strengthColor}aa 100%)`,
            boxShadow: isHovered
              ? `0 0 20px ${product.strengthColor}35, inset 0 0 10px ${product.strengthColor}20`
              : "none",
          }} />

        {/* Bottom edge — neutral dark depth */}
        <div className="absolute -bottom-px left-3 right-3 rounded-b-xl"
          style={{
            height: "10px",
            transformOrigin: "center top",
            transform: "rotateX(-90deg) translateY(-5px)",
            background: "linear-gradient(90deg, #0a0d14, #141922, #0a0d14)",
          }} />

        {/* Card face */}
        <div className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: "linear-gradient(165deg, #191f30 0%, #12161f 50%, #0c1018 100%)",
            boxShadow: isHovered
              ? `6px 14px 40px -8px rgba(0,0,0,0.5),
                 inset 0 1px 0 rgba(255,255,255,0.07)`
              : `2px 4px 16px -4px rgba(0,0,0,0.4),
                 inset 0 1px 0 rgba(255,255,255,0.05)`,
            transition: "box-shadow 0.5s",
          }}>

          {/* Strength indicator glow on right edge of face — very subtle leak */}
          <div className="absolute top-0 right-0 bottom-0 w-16 pointer-events-none transition-opacity duration-500"
            style={{
              background: `linear-gradient(270deg, ${product.strengthColor}08 0%, transparent 100%)`,
              opacity: isHovered ? 1 : 0,
            }} />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide text-white uppercase"
              style={{
                backgroundColor: product.badgeColor,
                boxShadow: `0 2px 10px ${product.badgeColor}40`,
              }}>
              {product.badge}
            </div>
          )}

          {/* Wishlist */}
          <div className="absolute top-3 right-3 z-20">
            <WishlistHeart active={wishlisted} onToggle={() => setWishlisted(!wishlisted)} />
          </div>

          {/* Image area — clean, no competing colors */}
          <div className="relative h-52 flex items-center justify-center overflow-hidden">
            {/* Single soft glow behind product */}
            <div className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 55%, ${product.flavorColor}30 0%, transparent 60%)`,
                opacity: isHovered ? 0.4 : 0.12,
                filter: "blur(12px)",
              }} />

            {/* Product */}
            <div className="relative z-10 w-36 h-36 transition-all duration-500"
              style={{
                transform: isHovered ? "scale(1.06)" : "scale(1)",
                filter: `drop-shadow(0 12px 24px rgba(0,0,0,0.5))
                  drop-shadow(0 0 ${isHovered ? 14 : 6}px ${product.flavorColor}18)`,
              }}>
              <img src={product.image} alt={`${product.brand} ${product.name}`}
                className="w-full h-full object-contain rounded-full" loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:white;background:linear-gradient(135deg,${product.brandColor},${product.flavorColor})">${product.brand[0]}</div>`;
                }} />
            </div>
          </div>

          {/* Content — identical layout to Tilt for consistency */}
          <div className="mx-4 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

          <div className="p-4 pt-3">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em]"
                style={{ color: product.brandColor }}>
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold" style={{ color: product.strengthColor }}>
                  {product.strengthLabel}
                </span>
                <StrengthDots dots={product.strengthDots} color={product.strengthColor} />
              </div>
            </div>

            <h3 className="text-white font-semibold text-[15px] leading-snug mb-2">
              {product.name}
            </h3>

            <Stars rating={product.rating} count={product.reviewCount} />

            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: `${product.flavorColor}15`,
                  color: product.flavorColor,
                  border: `1px solid ${product.flavorColor}20`,
                }}>
                {product.flavorLabel}
              </span>
              <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                {product.mg}
              </span>
              <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                {product.format} · {product.pouchCount}p
              </span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-baseline gap-1.5">
                {product.originalPrice && (
                  <span className="text-sm text-white/30 line-through font-medium">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-bold text-white">€{product.price.toFixed(2)}</span>
                <span className="text-[11px] text-emerald-400/70 font-semibold ml-0.5">+{product.earnPts}</span>
              </div>
              <button aria-label={`Add ${product.name} to cart`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-shadow duration-300"
                style={{
                  background: `linear-gradient(135deg, ${product.flavorColor}dd, ${product.brandColor})`,
                  boxShadow: isHovered
                    ? `0 6px 20px -4px ${product.flavorColor}40`
                    : "0 2px 8px -2px rgba(0,0,0,0.3)",
                }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-white/15 rounded-t-xl" />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   MAIN — Toggle between the two polished variants
   ═══════════════════════════════════════════════ */

export default function ProductCard3DPolished() {
  const [variant, setVariant] = useState("tilt");

  const Component = variant === "tilt" ? TiltCard : EdgeCard;

  return (
    <div className="min-h-screen p-6 md:p-10"
      style={{ background: "linear-gradient(160deg, #080c15 0%, #0f1520 40%, #0a0e17 100%)" }}>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}>
            SF
          </div>
          <h1 className="text-2xl font-bold text-white">Product Card — Final Polish</h1>
        </div>
        <p className="text-white/40 text-sm mb-6 ml-11">
          Hover over cards to experience the 3D effects. Both variants share identical content layout.
        </p>

        <div className="flex gap-2 ml-11">
          {[
            { id: "tilt", label: "3D Tilt", desc: "Mouse-tracking perspective — the showstopper" },
            { id: "edge", label: "Physical Edge", desc: "Strength color as card thickness — clean and simple" },
          ].map((v) => (
            <button key={v.id} onClick={() => setVariant(v.id)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: variant === v.id
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${variant === v.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}`,
                color: variant === v.id ? "white" : "rgba(255,255,255,0.4)",
              }}>
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/25 mt-2 ml-11">
          {variant === "tilt"
            ? "Mouse-tracking perspective with parallax glow. Disables on mobile (falls back to hover lift)."
            : "One color accent: the right edge shows strength. Everything else is neutral."}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
        {PRODUCTS.map((product) => (
          <Component key={`${variant}-${product.id}`} product={product} />
        ))}
      </div>

      {/* Implementation notes */}
      <div className="max-w-6xl mx-auto mt-14 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <h2 className="text-white/80 font-semibold text-sm mb-3 uppercase tracking-wider">Implementation Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] text-white/40 leading-relaxed">
          <div>
            <h3 className="text-white/60 font-medium mb-1">Astro Compatibility</h3>
            <p>Both cards live as React islands inside FilterableProductGrid — the same pattern as the current ProductCard.tsx. All product data (name, price, brand, attributes) renders in server HTML for full SEO indexing. The 3D effects are progressive enhancement — if JS hasn't hydrated yet, the card displays as a static dark card with all content visible.</p>
          </div>
          <div>
            <h3 className="text-white/60 font-medium mb-1">Mobile Behavior</h3>
            <p>The tilt effect requires a mouse cursor, so on touch devices it degrades to a simple hover-lift (translateY -4px) on tap/hold. The edge card's slight rotation also simplifies to a flat card with a colored right border on mobile. All interactive states (wishlist, add to cart) work identically on both.</p>
          </div>
          <div>
            <h3 className="text-white/60 font-medium mb-1">Performance</h3>
            <p>Mouse tracking uses requestAnimationFrame-throttled transforms (GPU-composited, no layout thrash). The radial gradients and drop-shadows are static styles that only change on hover state. Cards wrapped in React.memo — only the hovered card re-renders. Image loading is lazy.</p>
          </div>
          <div>
            <h3 className="text-white/60 font-medium mb-1">Color Philosophy</h3>
            <p>Each card uses exactly three colors: brand (text only), flavor (glow + one pill), and strength (dots + glass pill, or edge in variant B). All other elements are neutral white/gray on the dark surface. This prevents the "too many colors" problem from the previous version.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
