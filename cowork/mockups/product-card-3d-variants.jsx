import { useState, useRef, useCallback, useEffect } from "react";

// SnusFriend — Premium 3D Product Card Exploration
// Three distinct approaches to making cards feel physical and premium
// Variant A: 3D Perspective Tilt (mouse-tracking)
// Variant B: Layered Glass Depth (parallax + glassmorphism)
// Variant C: Physical Edge Card (visible card thickness with strength color)

const PRODUCTS = [
  {
    id: 1, name: "Cool Mint", brand: "ZYN", strength: "strong", strengthLabel: "Strong",
    strengthDots: 4, mg: "9 mg", flavor: "mint", flavorLabel: "Mint", price: 4.29,
    earnPts: 43, rating: 4.8, reviewCount: 124,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/zyn-cool-mint-9mg_1.webp",
    brandColor: "#00A0DC", flavorColor: "#06B6D4", strengthColor: "#f97316",
    badge: "Bestseller", badgeColor: "#f59e0b", format: "Slim", pouchCount: 24,
  },
  {
    id: 2, name: "Freezing Peppermint", brand: "VELO", strength: "extra-strong",
    strengthLabel: "Extra Strong", strengthDots: 5, mg: "14 mg", flavor: "mint",
    flavorLabel: "Mint", price: 3.89, earnPts: 39, rating: 4.6, reviewCount: 87,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/velo-freezing-peppermint-strong_1.webp",
    brandColor: "#003DA5", flavorColor: "#06B6D4", strengthColor: "#ef4444",
    badge: null, format: "Slim", pouchCount: 20,
  },
  {
    id: 3, name: "Ruby Berry", brand: "VELO", strength: "normal", strengthLabel: "Medium",
    strengthDots: 3, mg: "6 mg", flavor: "berry", flavorLabel: "Berry", price: 3.89,
    earnPts: 39, rating: 4.5, reviewCount: 56,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/velo-ruby-berry_1.webp",
    brandColor: "#003DA5", flavorColor: "#A855F7", strengthColor: "#3b82f6",
    badge: "New", badgeColor: "#22c55e", format: "Slim", pouchCount: 20,
  },
  {
    id: 4, name: "Apple Mint", brand: "ZYN", strength: "normal", strengthLabel: "Medium",
    strengthDots: 3, mg: "6 mg", flavor: "fruit", flavorLabel: "Fruit", price: 4.29,
    earnPts: 43, rating: 4.9, reviewCount: 203,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/zyn-apple-mint-6mg_1.webp",
    brandColor: "#00A0DC", flavorColor: "#84CC16", strengthColor: "#3b82f6",
    badge: "#1 in EU", badgeColor: "#f59e0b", format: "Slim", pouchCount: 24,
  },
];

/* ─── Shared sub-components ─── */

function StrengthDots({ dots, maxDots = 5, color, glow = false }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxDots }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: i < dots ? color : "rgba(255,255,255,0.12)",
            boxShadow: i < dots && glow ? `0 0 6px ${color}80, 0 0 2px ${color}40` : "none",
          }} />
      ))}
    </div>
  );
}

function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 20 20"
            fill={s <= Math.round(rating) ? "#fbbf24" : "rgba(255,255,255,0.1)"}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-400 ml-0.5">({count})</span>
    </div>
  );
}

function PillBadge({ label, color, border = true }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: border ? `1px solid ${color}30` : "none",
        textShadow: `0 0 12px ${color}30`,
      }}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT A — 3D PERSPECTIVE TILT
   Mouse position controls rotateX/rotateY. Parallax layers
   (glow, image, content) shift at different rates.
   ═══════════════════════════════════════════════════════════ */

function TiltCard({ product }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientY - centerY) / (rect.height / 2);
    const y = -(e.clientX - centerX) / (rect.width / 2);
    setTilt({ x: x * 12, y: y * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div className="relative" style={{ perspective: "800px" }}>
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? "scale(1.02)" : "scale(1)"}`,
          transformStyle: "preserve-3d",
          transition: isHovered ? "none" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          background: "linear-gradient(160deg, #1c2233 0%, #111827 40%, #0d1117 100%)",
          boxShadow: isHovered
            ? `0 25px 50px rgba(0,0,0,0.5),
               0 0 30px ${product.flavorColor}12,
               inset 0 1px 0 rgba(255,255,255,0.08),
               inset 0 -1px 0 rgba(0,0,0,0.3)`
            : `0 8px 24px rgba(0,0,0,0.35),
               inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Holographic sheen layer */}
        <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.08 : 0,
            background: `linear-gradient(${135 + tilt.y * 5}deg,
              transparent 20%,
              rgba(255,255,255,0.4) ${48 + tilt.y * 2}%,
              transparent ${52 + tilt.y * 2}%,
              transparent 80%)`,
          }} />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{
              backgroundColor: product.badgeColor,
              boxShadow: `0 2px 10px ${product.badgeColor}50, 0 0 20px ${product.badgeColor}20`,
              transform: "translateZ(30px)",
            }}>
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isWishlisted ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${isWishlisted ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
            transform: "translateZ(30px)",
          }}>
          <svg className="w-4 h-4 transition-all duration-300" viewBox="0 0 24 24"
            fill={isWishlisted ? "#ef4444" : "none"}
            stroke={isWishlisted ? "#ef4444" : "rgba(255,255,255,0.5)"}
            strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image area with parallax glow */}
        <div className="relative h-52 flex items-center justify-center overflow-hidden">
          {/* Deep background glow — moves opposite to tilt */}
          <div className="absolute inset-0 transition-all duration-100"
            style={{
              background: `radial-gradient(ellipse at ${50 - tilt.y * 3}% ${55 - tilt.x * 3}%, ${product.flavorColor}50 0%, transparent 65%)`,
              opacity: isHovered ? 0.45 : 0.15,
              filter: "blur(20px)",
            }} />

          {/* Secondary brand glow */}
          <div className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${50 + tilt.y * 2}% ${40 + tilt.x * 2}%, ${product.brandColor}30 0%, transparent 50%)`,
              opacity: isHovered ? 0.3 : 0.05,
              filter: "blur(30px)",
            }} />

          {/* Product image — floats forward in 3D space */}
          <div className="relative z-10 w-36 h-36 transition-all"
            style={{
              transform: `translateZ(40px) translate(${tilt.y * -2}px, ${tilt.x * -2}px)
                ${isHovered ? "scale(1.08)" : "scale(1)"}`,
              transition: isHovered ? "scale 0.3s" : "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
              filter: `drop-shadow(0 12px 24px rgba(0,0,0,0.5))
                drop-shadow(0 0 20px ${product.flavorColor}25)`,
            }}>
            <img src={product.image} alt={`${product.brand} ${product.name}`}
              className="w-full h-full object-contain rounded-full" loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:white;background:linear-gradient(135deg,${product.brandColor},${product.flavorColor})">${product.brand[0]}</div>`;
              }} />
          </div>

          {/* Floating strength indicator — glass pill */}
          <div className="absolute bottom-3 left-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              transform: `translateX(-50%) translateZ(25px)`,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${product.strengthColor}30`,
              boxShadow: `0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}>
            <span className="text-xs font-semibold" style={{ color: product.strengthColor }}>
              {product.strengthLabel}
            </span>
            <StrengthDots dots={product.strengthDots} color={product.strengthColor} glow />
          </div>
        </div>

        {/* Content area */}
        <div className="relative z-10 p-4 pt-3" style={{ transform: "translateZ(15px)" }}>
          {/* Brand name */}
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: product.brandColor, textShadow: `0 0 20px ${product.brandColor}30` }}>
            {product.brand}
          </span>

          {/* Product name */}
          <h3 className="text-white font-semibold text-lg mt-0.5 mb-1.5 leading-tight">
            {product.name}
          </h3>

          {/* Stars */}
          <Stars rating={product.rating} count={product.reviewCount} />

          {/* Attribute pills */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <PillBadge label={product.flavorLabel} color={product.flavorColor} />
            <PillBadge label={product.mg} color={product.strengthColor} />
            <PillBadge label={`${product.format} · ${product.pouchCount}p`} color="rgba(255,255,255,0.5)" border={false} />
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
            <div>
              <span className="text-xl font-bold text-white">€{product.price.toFixed(2)}</span>
              <span className="text-xs text-emerald-400/80 ml-1.5 font-medium">+{product.earnPts} pts</span>
            </div>
            <button className="group/btn relative flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${product.flavorColor}, ${product.brandColor})`,
                boxShadow: isHovered
                  ? `0 6px 20px ${product.flavorColor}35, 0 2px 8px rgba(0,0,0,0.3)`
                  : "0 2px 8px rgba(0,0,0,0.2)",
              }}>
              {/* Shimmer effect on button */}
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                  animation: isHovered ? "shimmer 2s infinite" : "none",
                }} />
              <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

/* ═══════════════════════════════════════════════════════════
   VARIANT B — LAYERED GLASS DEPTH
   Multiple glass layers stacked with subtle offsets.
   The card feels like stacked panes of tinted glass.
   ═══════════════════════════════════════════════════════════ */

function GlassCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="relative" style={{ perspective: "600px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      {/* Back layer — colored depth shadow */}
      <div className="absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${product.flavorColor}40, ${product.brandColor}40)`,
          transform: isHovered ? "translateY(8px) translateX(4px) scale(0.97)" : "translateY(4px) translateX(2px) scale(0.99)",
          filter: "blur(4px)",
          opacity: isHovered ? 0.7 : 0.3,
        }} />

      {/* Mid layer — brand accent */}
      <div className="absolute inset-0 rounded-2xl transition-all duration-400"
        style={{
          background: `linear-gradient(160deg, ${product.brandColor}20, transparent 60%)`,
          transform: isHovered ? "translateY(4px) translateX(2px) scale(0.985)" : "translateY(2px) translateX(1px) scale(0.995)",
          border: `1px solid ${product.brandColor}15`,
          opacity: isHovered ? 0.8 : 0.4,
        }} />

      {/* Main card — frosted glass */}
      <div className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-400"
        style={{
          background: "linear-gradient(160deg, rgba(30,36,50,0.92) 0%, rgba(17,24,39,0.97) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: isHovered
            ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05),
               inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)`
            : `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        }}>

        {/* Top glass reflection strip */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${product.badgeColor}, ${product.badgeColor}dd)`,
              boxShadow: `0 2px 8px ${product.badgeColor}40`,
              backdropFilter: "blur(4px)",
            }}>
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isWishlisted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${isWishlisted ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)"}`,
          }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24"
            fill={isWishlisted ? "#ef4444" : "none"}
            stroke={isWishlisted ? "#ef4444" : "rgba(255,255,255,0.4)"}
            strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image area */}
        <div className="relative h-52 flex items-center justify-center overflow-hidden">
          {/* Ambient light */}
          <div className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, ${product.flavorColor}30 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, ${product.brandColor}20 0%, transparent 50%)
              `,
              opacity: isHovered ? 1 : 0.4,
              filter: "blur(25px)",
            }} />

          {/* Glass platform the product sits on */}
          <div className="absolute bottom-4 left-1/2 w-28 h-6 rounded-full transition-all duration-500"
            style={{
              transform: `translateX(-50%) ${isHovered ? "scaleX(1.15) scaleY(0.8)" : "scaleX(1) scaleY(1)"}`,
              background: `radial-gradient(ellipse, ${product.flavorColor}20 0%, transparent 70%)`,
              filter: "blur(8px)",
            }} />

          {/* Product */}
          <div className="relative z-10 w-36 h-36 transition-all duration-500"
            style={{
              transform: isHovered ? "translateY(-8px) scale(1.08)" : "translateY(0) scale(1)",
              filter: `drop-shadow(0 ${isHovered ? 20 : 8}px ${isHovered ? 30 : 16}px rgba(0,0,0,0.5))
                drop-shadow(0 0 ${isHovered ? 25 : 10}px ${product.flavorColor}20)`,
            }}>
            <img src={product.image} alt={`${product.brand} ${product.name}`}
              className="w-full h-full object-contain rounded-full" loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:white;background:linear-gradient(135deg,${product.brandColor},${product.flavorColor})">${product.brand[0]}</div>`;
              }} />
          </div>
        </div>

        {/* Inner glass divider */}
        <div className="mx-4 h-px" style={{
          background: `linear-gradient(90deg, transparent, ${product.flavorColor}25, ${product.brandColor}25, transparent)`
        }} />

        {/* Content */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: product.brandColor }}>
              {product.brand}
            </span>
            <StrengthDots dots={product.strengthDots} color={product.strengthColor} glow />
          </div>

          <h3 className="text-white font-semibold text-lg mb-1.5 leading-tight">
            {product.name}
          </h3>

          <Stars rating={product.rating} count={product.reviewCount} />

          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <PillBadge label={product.flavorLabel} color={product.flavorColor} />
            <PillBadge label={product.mg} color={product.strengthColor} />
            <PillBadge label={`${product.format} · ${product.pouchCount}p`} color="rgba(255,255,255,0.5)" border={false} />
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
            <div>
              <span className="text-xl font-bold text-white">€{product.price.toFixed(2)}</span>
              <span className="text-xs text-emerald-400/80 ml-1.5 font-medium">+{product.earnPts} pts</span>
            </div>
            <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${product.flavorColor}cc, ${product.brandColor})`,
                boxShadow: isHovered
                  ? `0 6px 20px ${product.flavorColor}30, inset 0 1px 0 rgba(255,255,255,0.15)`
                  : "inset 0 1px 0 rgba(255,255,255,0.1)",
                backdropFilter: "blur(4px)",
              }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIANT C — PHYSICAL EDGE CARD
   CSS 3D transform creates visible card "thickness".
   The side/edge is colored by strength. Card feels like
   a physical object you can almost pick up.
   ═══════════════════════════════════════════════════════════ */

function PhysicalCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const edgeThickness = 8; // px

  return (
    <div className="relative" style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      <div className="relative transition-all duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotateY(-5deg) rotateX(3deg) translateY(-6px)"
            : "rotateY(0deg) rotateX(0deg) translateY(0px)",
        }}>

        {/* Right edge — strength colored "thickness" */}
        <div className="absolute top-2 -right-[1px] bottom-2 rounded-r-lg transition-all duration-500"
          style={{
            width: `${edgeThickness}px`,
            transformOrigin: "left center",
            transform: `rotateY(90deg) translateX(-${edgeThickness / 2}px)`,
            background: `linear-gradient(180deg,
              ${product.strengthColor}ee 0%,
              ${product.strengthColor} 30%,
              ${product.strengthColor}cc 70%,
              ${product.strengthColor}88 100%)`,
            boxShadow: isHovered ? `0 0 15px ${product.strengthColor}40` : "none",
          }} />

        {/* Bottom edge — darker shade for grounding */}
        <div className="absolute -bottom-[1px] left-2 right-2 rounded-b-lg transition-all duration-500"
          style={{
            height: `${edgeThickness}px`,
            transformOrigin: "center top",
            transform: `rotateX(-90deg) translateY(-${edgeThickness / 2}px)`,
            background: "linear-gradient(90deg, rgba(10,14,23,0.9), rgba(20,28,46,0.9))",
          }} />

        {/* Main face */}
        <div className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: "linear-gradient(160deg, #1c2233 0%, #111827 40%, #0d1117 100%)",
            boxShadow: isHovered
              ? `8px 12px 40px rgba(0,0,0,0.5),
                 -2px 0 20px ${product.strengthColor}08,
                 inset 0 1px 0 rgba(255,255,255,0.08)`
              : `2px 4px 16px rgba(0,0,0,0.35),
                 inset 0 1px 0 rgba(255,255,255,0.06)`,
            transformStyle: "preserve-3d",
          }}>

          {/* Left accent — thin flavor color line (the "spine") */}
          <div className="absolute top-0 left-0 bottom-0 w-1 z-10"
            style={{
              background: `linear-gradient(180deg, ${product.flavorColor}80, ${product.flavorColor}, ${product.flavorColor}80)`,
              boxShadow: `2px 0 12px ${product.flavorColor}20`,
            }} />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-4 z-20 px-2.5 py-1 rounded-full text-xs font-bold text-white"
              style={{
                backgroundColor: product.badgeColor,
                boxShadow: `0 2px 10px ${product.badgeColor}40`,
              }}>
              {product.badge}
            </div>
          )}

          {/* Wishlist */}
          <button onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: isWishlisted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${isWishlisted ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)"}`,
            }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24"
              fill={isWishlisted ? "#ef4444" : "none"}
              stroke={isWishlisted ? "#ef4444" : "rgba(255,255,255,0.4)"}
              strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Image area */}
          <div className="relative h-52 flex items-center justify-center overflow-hidden">
            {/* Radial glow */}
            <div className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 55%, ${product.flavorColor}40 0%, transparent 60%)`,
                opacity: isHovered ? 0.5 : 0.2,
                filter: "blur(15px)",
              }} />

            {/* Strength color ambient from the right edge */}
            <div className="absolute top-0 right-0 bottom-0 w-1/3 transition-opacity duration-500"
              style={{
                background: `linear-gradient(270deg, ${product.strengthColor}15 0%, transparent 100%)`,
                opacity: isHovered ? 1 : 0.3,
              }} />

            {/* Product */}
            <div className="relative z-10 w-36 h-36 transition-all duration-500"
              style={{
                transform: isHovered ? "scale(1.1) translateX(-4px)" : "scale(1)",
                filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.5))
                  drop-shadow(0 0 15px ${product.flavorColor}20)`,
              }}>
              <img src={product.image} alt={`${product.brand} ${product.name}`}
                className="w-full h-full object-contain rounded-full" loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:white;background:linear-gradient(135deg,${product.brandColor},${product.flavorColor})">${product.brand[0]}</div>`;
                }} />
            </div>

            {/* Strength bar — spans full width at bottom, acts as the "shelf" */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 z-10"
              style={{
                background: `linear-gradient(90deg,
                  ${product.flavorColor}40,
                  ${product.strengthColor} 30%,
                  ${product.strengthColor} 70%,
                  ${product.strengthColor}40)`,
                boxShadow: `0 0 10px ${product.strengthColor}30`,
              }} />
          </div>

          {/* Content */}
          <div className="p-4 pt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: product.brandColor }}>
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: product.strengthColor }}>
                  {product.mg}
                </span>
                <StrengthDots dots={product.strengthDots} color={product.strengthColor} glow />
              </div>
            </div>

            <h3 className="text-white font-semibold text-lg mb-1.5 leading-tight">
              {product.name}
            </h3>

            <Stars rating={product.rating} count={product.reviewCount} />

            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <PillBadge label={product.flavorLabel} color={product.flavorColor} />
              <PillBadge label={`${product.format} · ${product.pouchCount}p`} color="rgba(255,255,255,0.5)" border={false} />
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
              <div>
                <span className="text-xl font-bold text-white">€{product.price.toFixed(2)}</span>
                <span className="text-xs text-emerald-400/80 ml-1.5 font-medium">+{product.earnPts} pts</span>
              </div>
              <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${product.flavorColor}, ${product.brandColor})`,
                  boxShadow: isHovered
                    ? `0 6px 20px ${product.flavorColor}30`
                    : "0 2px 6px rgba(0,0,0,0.2)",
                }}>
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

/* ═══════════════════════════════════════════════════════════
   MAIN LAYOUT — Side-by-side comparison of all three
   ═══════════════════════════════════════════════════════════ */

export default function ProductCard3DVariants() {
  const [activeVariant, setActiveVariant] = useState("tilt");

  const variants = [
    { id: "tilt", label: "A: 3D Tilt", desc: "Mouse-tracking perspective with parallax glow layers", Component: TiltCard },
    { id: "glass", label: "B: Glass Depth", desc: "Stacked translucent layers with floating product", Component: GlassCard },
    { id: "physical", label: "C: Physical Edge", desc: "Visible card thickness — strength color on the side edge", Component: PhysicalCard },
  ];

  const active = variants.find((v) => v.id === activeVariant);

  return (
    <div className="min-h-screen p-6 md:p-10"
      style={{ background: "linear-gradient(135deg, #080c15 0%, #111827 40%, #0a0f1a 100%)" }}>

      {/* Keyframe for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">SnusFriend — 3D Product Cards</h1>
        <p className="text-gray-400 text-sm mb-6">
          Three premium approaches. Hover over cards to experience the 3D effects.
        </p>

        {/* Variant selector */}
        <div className="flex flex-wrap gap-2 mb-2">
          {variants.map((v) => (
            <button key={v.id} onClick={() => setActiveVariant(v.id)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: activeVariant === v.id
                  ? "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeVariant === v.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                color: activeVariant === v.id ? "white" : "rgba(255,255,255,0.5)",
                boxShadow: activeVariant === v.id ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
              }}>
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">{active.desc}</p>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS.map((product) => (
          <active.Component key={product.id} product={product} />
        ))}
      </div>

      {/* Comparison notes */}
      <div className="max-w-6xl mx-auto mt-12 rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
        <h2 className="text-white font-bold mb-4">Variant Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">A</span>
              3D Tilt
            </h3>
            <p className="mb-2">The card physically rotates to follow your mouse. A holographic sheen sweeps across the surface. The product image and glow layers shift at different rates (parallax).</p>
            <p><strong className="text-white">Best for:</strong> Making the site feel cutting-edge and interactive. Strongest "wow" factor. Brands would love this for launch campaigns.</p>
            <p className="text-yellow-400/80 text-xs mt-2">Note: Disable tilt on mobile (no mouse). Falls back to simple hover lift.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xs font-bold text-white">B</span>
              Glass Depth
            </h3>
            <p className="mb-2">Multiple translucent layers create depth without requiring mouse tracking. The product floats above a soft glass platform. Colored shadow layers peek out behind the card on hover.</p>
            <p><strong className="text-white">Best for:</strong> A premium feel that works equally well on mobile and desktop. Most elegant and refined. The floating product sells the "premium" story.</p>
            <p className="text-emerald-400/80 text-xs mt-2">Recommended as the primary choice — best balance of impact and usability.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold text-white">C</span>
              Physical Edge
            </h3>
            <p className="mb-2">A visible "thick" side edge in the strength color makes the card feel like a physical object. On hover, the card tilts slightly to reveal the colored edge more prominently. A thin flavor-color spine on the left adds a second color accent.</p>
            <p><strong className="text-white">Best for:</strong> Directly solving the original "strength color on the side" request. The physical edge makes strength immediately visible and tactile.</p>
            <p className="text-blue-400/80 text-xs mt-2">Closest to original vision — strength color literally IS the card edge.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
