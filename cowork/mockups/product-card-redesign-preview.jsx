import { useState } from "react";

// Product Card Redesign Mockup — SnusFriend Premium Cards
// Based on competitive audit of 10 nicotine pouch stores
// Key inspiration: VELO official (gradient backgrounds), SnuZone (clean badges),
// EuropeSnus (strength bars), Haypp (pack selector)

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Cool Mint",
    brand: "ZYN",
    strength: "strong",
    strengthLabel: "Strong",
    strengthDots: 4,
    mg: "9 mg",
    flavor: "mint",
    flavorLabel: "Mint",
    price: 4.29,
    earnPts: 43,
    rating: 4.8,
    reviewCount: 124,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/zyn-cool-mint-9mg_1.webp",
    brandColor: "#00A0DC",
    flavorColor: "#06B6D4",
    strengthColor: "#f97316",
    badge: "Bestseller",
    badgeColor: "#f59e0b",
    format: "Slim",
    pouchCount: 24,
  },
  {
    id: 2,
    name: "Freezing Peppermint",
    brand: "VELO",
    strength: "strong",
    strengthLabel: "Strong",
    strengthDots: 4,
    mg: "10 mg",
    flavor: "mint",
    flavorLabel: "Mint",
    price: 3.89,
    earnPts: 39,
    rating: 4.6,
    reviewCount: 87,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/velo-freezing-peppermint-strong_1.webp",
    brandColor: "#003DA5",
    flavorColor: "#06B6D4",
    strengthColor: "#f97316",
    badge: null,
    format: "Slim",
    pouchCount: 20,
  },
  {
    id: 3,
    name: "Ruby Berry",
    brand: "VELO",
    strength: "normal",
    strengthLabel: "Medium",
    strengthDots: 3,
    mg: "6 mg",
    flavor: "berry",
    flavorLabel: "Berry",
    price: 3.89,
    earnPts: 39,
    rating: 4.5,
    reviewCount: 56,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/velo-ruby-berry_1.webp",
    brandColor: "#003DA5",
    flavorColor: "#A855F7",
    strengthColor: "#3b82f6",
    badge: "New",
    badgeColor: "#22c55e",
    format: "Slim",
    pouchCount: 20,
  },
  {
    id: 4,
    name: "Apple Mint",
    brand: "ZYN",
    strength: "normal",
    strengthLabel: "Medium",
    strengthDots: 3,
    mg: "6 mg",
    flavor: "fruit",
    flavorLabel: "Fruit",
    price: 4.29,
    earnPts: 43,
    rating: 4.9,
    reviewCount: 203,
    image: "https://snusfriends.com/cdn-cgi/image/width=300,quality=80/https://images.nyehandel.com/images/product/zyn-apple-mint-6mg_1.webp",
    brandColor: "#00A0DC",
    flavorColor: "#84CC16",
    strengthColor: "#3b82f6",
    badge: "#1 in EU",
    badgeColor: "#f59e0b",
    format: "Slim",
    pouchCount: 24,
  },
];

const STRENGTH_COLORS = {
  light: "#22c55e",
  normal: "#3b82f6",
  strong: "#f97316",
  "extra-strong": "#ef4444",
  "super-strong": "#a855f7",
};

function StrengthBar({ dots, maxDots = 5, color }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxDots }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all"
          style={{
            backgroundColor: i < dots ? color : "rgba(255,255,255,0.2)",
            boxShadow: i < dots ? `0 0 4px ${color}40` : "none",
          }}
        />
      ))}
    </div>
  );
}

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-3 h-3"
            viewBox="0 0 20 20"
            fill={star <= Math.round(rating) ? "#fbbf24" : "#374151"}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-400">({count})</span>
    </div>
  );
}

function ProductCard({ product, variant = "premium" }) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === "premium") {
    return (
      <div
        className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          background: "linear-gradient(145deg, #1a1f2e 0%, #0f1219 100%)",
          boxShadow: isHovered
            ? `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${product.flavorColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`
            : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge */}
        {product.badge && (
          <div
            className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{
              backgroundColor: product.badgeColor,
              boxShadow: `0 2px 8px ${product.badgeColor}40`,
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image area with gradient glow */}
        <div className="relative h-48 flex items-center justify-center overflow-hidden">
          {/* Background glow effect */}
          <div
            className="absolute inset-0 opacity-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${product.flavorColor}60 0%, transparent 70%)`,
              opacity: isHovered ? 0.35 : 0.15,
            }}
          />
          {/* Product image with 3D tilt effect */}
          <div
            className="relative z-10 w-32 h-32 rounded-full overflow-hidden transition-transform duration-500"
            style={{
              transform: isHovered
                ? "scale(1.1) rotate(-3deg)"
                : "scale(1) rotate(0deg)",
              filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 0 12px ${product.flavorColor}20)`,
            }}
          >
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold" style="background: linear-gradient(135deg, ${product.brandColor}, ${product.flavorColor}); color: white;">${product.brand[0]}</div>`;
              }}
            />
          </div>

          {/* Strength strip — bottom of image area */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${product.strengthColor}, transparent)`,
              opacity: 0.8,
            }}
          />
        </div>

        {/* Content area */}
        <div className="p-4 pt-3">
          {/* Brand + strength row */}
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: product.brandColor }}
            >
              {product.brand}
            </span>
            <StrengthBar
              dots={product.strengthDots}
              color={product.strengthColor}
            />
          </div>

          {/* Product name */}
          <h3 className="text-white font-semibold text-base mb-1.5 leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <StarRating rating={product.rating} count={product.reviewCount} />

          {/* Tags row */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${product.flavorColor}20`,
                color: product.flavorColor,
                border: `1px solid ${product.flavorColor}30`,
              }}
            >
              {product.flavorLabel}
            </span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${product.strengthColor}20`,
                color: product.strengthColor,
                border: `1px solid ${product.strengthColor}30`,
              }}
            >
              {product.mg}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
              {product.format} · {product.pouchCount}p
            </span>
          </div>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div>
              <span className="text-lg font-bold text-white">
                €{product.price.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-400/80 ml-1.5">
                +{product.earnPts} pts
              </span>
            </div>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${product.flavorColor}, ${product.brandColor})`,
                boxShadow: isHovered
                  ? `0 4px 12px ${product.flavorColor}40`
                  : "none",
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }

  // "Clean" variant — light theme alternative
  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border border-gray-100"
      style={{
        boxShadow: isHovered
          ? "0 12px 32px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.badge && (
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: product.badgeColor }}
        >
          {product.badge}
        </div>
      )}

      <div
        className="relative h-44 flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${product.flavorColor}08 0%, ${product.flavorColor}03 100%)`,
        }}
      >
        <div
          className="w-28 h-28 rounded-full overflow-hidden transition-transform duration-400"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
          }}
        >
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center text-xl font-bold" style="background: linear-gradient(135deg, ${product.brandColor}, ${product.flavorColor}); color: white;">${product.brand[0]}</div>`;
            }}
          />
        </div>

        {/* Thin strength accent bar */}
        <div
          className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
          style={{ backgroundColor: product.strengthColor }}
        />
      </div>

      <div className="p-4 pt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {product.brand}
          </span>
          <StrengthBar
            dots={product.strengthDots}
            color={product.strengthColor}
          />
        </div>

        <h3 className="text-gray-900 font-semibold text-base mb-1 leading-tight">
          {product.name}
        </h3>

        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${product.flavorColor}12`,
              color: product.flavorColor,
            }}
          >
            {product.flavorLabel}
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${product.strengthColor}12`,
              color: product.strengthColor,
            }}
          >
            {product.mg}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">
              €{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-emerald-600 ml-1.5">
              +{product.earnPts} pts
            </span>
          </div>
          <button
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
            style={{
              backgroundColor: product.brandColor,
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCardRedesign() {
  const [variant, setVariant] = useState("premium");

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background:
          variant === "premium"
            ? "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)"
            : "#f8fafc",
      }}
    >
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1
          className={`text-2xl font-bold mb-2 ${variant === "premium" ? "text-white" : "text-gray-900"}`}
        >
          SnusFriend — Product Card Redesign
        </h1>
        <p
          className={`text-sm mb-6 ${variant === "premium" ? "text-gray-400" : "text-gray-500"}`}
        >
          Based on competitive audit of 10 nicotine pouch stores. Hover over
          cards for interaction effects.
        </p>

        {/* Variant toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setVariant("premium")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              variant === "premium"
                ? "bg-white text-gray-900"
                : variant === "premium"
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Premium Dark (Recommended)
          </button>
          <button
            onClick={() => setVariant("clean")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              variant === "clean"
                ? "bg-white text-gray-900 shadow"
                : variant === "premium"
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Clean Light
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} variant={variant} />
        ))}
      </div>

      {/* Design Notes */}
      <div className="max-w-5xl mx-auto mt-12">
        <div
          className={`rounded-xl p-6 ${variant === "premium" ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"}`}
        >
          <h2
            className={`font-bold mb-3 ${variant === "premium" ? "text-white" : "text-gray-900"}`}
          >
            Design Changes from Current
          </h2>
          <div
            className={`text-sm space-y-2 ${variant === "premium" ? "text-gray-300" : "text-gray-600"}`}
          >
            <p>
              <strong>Removed:</strong> Left flavor border (inconsistent feel),
              separate strength color strip (redundant with dots)
            </p>
            <p>
              <strong>Added:</strong> Radial glow behind product image (matches
              flavor), hover lift + scale animation, gradient add-to-cart button
              (brand→flavor), wishlist heart, review stars + count, format/pouch
              count tag
            </p>
            <p>
              <strong>Improved:</strong> Strength dots moved to brand row
              (cleaner hierarchy), flavor/mg pills use translucent fills instead
              of solid borders, price area separated with subtle border, points
              shown inline with price
            </p>
            <p>
              <strong>Inspired by:</strong> VELO official (gradient glow),
              SnuZone (strength badges + wishlist), EuropeSnus (attribute
              indicators), Nicokick (review counts), Haypp (pack selectors)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
