'use client';

import React, { useCallback, useState, useMemo } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product, PackSize } from '@/data/products';

/**
 * Redesigned ProductCard component based on SnusFriend Design Marathon findings.
 *
 * DESIGN PRINCIPLES (from marathon):
 * 1. Color-coded strength badges (green MILD, yellow REGULAR, orange STRONG, red EXTRA STRONG)
 *    with text labels for accessibility (WCAG + colorblind support).
 * 2. Pack selector pills (1/3/5/10) with active state highlighting — bulk buying made effortless.
 * 3. Per-unit price that updates dynamically based on pack selection.
 * 4. Flavor-coded left border/glow (mint=teal, fruit=orange, berry=purple, citrus=lime, coffee=brown).
 * 5. Product can image as the hero (large, centered).
 * 6. Brand name in teal, product name in bold.
 * 7. Star rating with review count.
 * 8. Add to Cart button in teal.
 * 9. Hover state with subtle lift shadow and teal glow.
 * 10. React.memo wrapped for performance.
 *
 * IMPROVEMENTS OVER CURRENT CARD:
 * - Adds pack selector pills (SnusFriend's competitive advantage)
 * - Color-coded strength badges instead of dot indicators
 * - Per-unit pricing calculation
 * - Flavor-coded left border for visual scanning
 * - Enhanced hover state with glow effect
 * - Better use of whitespace and visual hierarchy
 */

/** Flavor-to-glow-color mapping: drives visual brand identity */
const flavorGlowMap: Record<string, { borderColor: string; glowColor: string; glowRgb: string }> = {
  'mint': { borderColor: 'border-cyan-500', glowColor: 'from-cyan-500/20', glowRgb: '34, 211, 238' },
  'fruit': { borderColor: 'border-orange-500', glowColor: 'from-orange-500/20', glowRgb: '249, 115, 22' },
  'berry': { borderColor: 'border-purple-500', glowColor: 'from-purple-500/20', glowRgb: '168, 85, 247' },
  'citrus': { borderColor: 'border-lime-500', glowColor: 'from-lime-500/20', glowRgb: '132, 204, 22' },
  'licorice': { borderColor: 'border-neutral-700', glowColor: 'from-neutral-700/20', glowRgb: '64, 64, 64' },
  'coffee': { borderColor: 'border-amber-900', glowColor: 'from-amber-900/20', glowRgb: '120, 53, 15' },
  'cola': { borderColor: 'border-amber-800', glowColor: 'from-amber-800/20', glowRgb: '146, 64, 14' },
  'vanilla': { borderColor: 'border-yellow-600', glowColor: 'from-yellow-600/20', glowRgb: '202, 138, 4' },
  'tropical': { borderColor: 'border-orange-500', glowColor: 'from-orange-500/20', glowRgb: '249, 115, 22' },
};

/** Strength mapping: key → (label, color, Tailwind class) */
const strengthConfig: Record<string, { label: string; color: string; bgClass: string; textClass: string }> = {
  'normal': { label: 'MILD', color: '#22C55E', bgClass: 'bg-green-100 dark:bg-green-950', textClass: 'text-green-700 dark:text-green-300' },
  'strong': { label: 'REGULAR', color: '#EAB308', bgClass: 'bg-yellow-100 dark:bg-yellow-950', textClass: 'text-yellow-700 dark:text-yellow-300' },
  'extraStrong': { label: 'STRONG', color: '#F97316', bgClass: 'bg-orange-100 dark:bg-orange-950', textClass: 'text-orange-700 dark:text-orange-300' },
  'ultraStrong': { label: 'EXTRA STRONG', color: '#EF4444', bgClass: 'bg-red-100 dark:bg-red-950', textClass: 'text-red-700 dark:text-red-300' },
};

interface ProductCardProps {
  /**
   * Complete product object from the catalog. Contains pricing, metadata, and catalog keys.
   * Compatible with nanostores cart system (@/stores/cart).
   */
  product: Product;
}

interface PackSelectorState {
  /** Currently selected pack size */
  activePackSize: PackSize;
  /** Quantity in cart for this pack size (used in cart sync scenarios) */
  quantity: number;
}

/**
 * StrengthBadge: Displays color-coded, labeled strength indicator.
 * Accessible to colorblind users (text labels required per WCAG + Baymard research).
 */
const StrengthBadge: React.FC<{ strengthKey: string }> = ({ strengthKey }) => {
  const config = strengthConfig[strengthKey] || strengthConfig['normal'];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgClass}`}>
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
      <span className={`text-xs font-bold tracking-wide ${config.textClass}`}>{config.label}</span>
    </div>
  );
};

/**
 * PackSelector: Interactive pill buttons (1/3/5/10) with active state.
 * Shows per-unit price dynamically. Core SnusFriend competitive advantage:
 * 86% of e-commerce sites don't show price-per-unit (Baymard Institute).
 */
const PackSelector: React.FC<{
  prices: Product['prices'];
  activePackSize: PackSize;
  onPackSelect: (packSize: PackSize) => void;
}> = ({ prices, activePackSize, onPackSelect }) => {
  const packSizes: Array<{ size: PackSize; label: string; cans: number }> = [
    { size: 'pack1', label: '1', cans: 1 },
    { size: 'pack3', label: '3', cans: 3 },
    { size: 'pack5', label: '5', cans: 5 },
    { size: 'pack10', label: '10', cans: 10 },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Pack selector pills */}
      <div className="flex gap-2">
        {packSizes.map(({ size, label }) => {
          const isActive = activePackSize === size;
          const price = prices[size];
          const perUnit = (price / parseInt(label)).toFixed(2);

          return (
            <button
              key={size}
              onClick={() => onPackSelect(size)}
              className={`flex-1 px-2 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-600/50'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-label={`Select ${label} pack`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Per-unit price (dynamically updates) */}
      <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
        €{(prices[activePackSize] / parseInt(activePackSize.slice(4))).toFixed(2)}/can
      </div>
    </div>
  );
};

/**
 * StarRating: Displays star rating with review count.
 * Placeholder implementation; integrate with review system as needed.
 */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;
          return (
            <span
              key={i}
              className={`text-xs ${
                isFull || isHalf
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              {isFull ? '★' : isHalf ? '⭐' : '☆'}
            </span>
          );
        })}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
    </div>
  );
};

/**
 * ProductCard: Main component. Implements all design marathon findings.
 *
 * Layout hierarchy:
 * 1. Flavor-coded left border (flavor accent)
 * 2. Product image hero (large, centered)
 * 3. Strength badge (color-coded, accessible)
 * 4. Brand name (teal accent)
 * 5. Product name (bold)
 * 6. Star rating
 * 7. Pack selector pills
 * 8. Add to Cart button (teal)
 * 9. Hover: lift shadow + glow effect
 */
export const ProductCard = React.memo<ProductCardProps>(
  function ProductCard({ product }) {
    const [packState, setPackState] = useState<PackSelectorState>({
      activePackSize: 'pack1',
      quantity: 1,
    });

    const flavorGlow = flavorGlowMap[product.flavorKey] || flavorGlowMap['mint'];
    const displayPrice = product.prices[packState.activePackSize];
    const isOutOfStock = (product.stock ?? 0) === 0;

    // Per-unit price for the selected pack
    const perUnitPrice = useMemo(() => {
      const packMultiplier = parseInt(packState.activePackSize.slice(4));
      return displayPrice / packMultiplier;
    }, [displayPrice, packState.activePackSize]);

    const handlePackSelect = useCallback((packSize: PackSize) => {
      setPackState((prev) => ({ ...prev, activePackSize: packSize }));
    }, []);

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        addToCart(product, packState.activePackSize, packState.quantity);
        openCart();
        cartToast(product.name);
      },
      [product, packState.activePackSize, packState.quantity, isOutOfStock],
    );

    return (
      <a
        href={`/products/${product.id}`}
        className={`group relative flex flex-col h-full overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-teal-600/20 hover:-translate-y-1 hover:border-teal-400/50 ${flavorGlow.borderColor} border-l-4`}
        style={{
          boxShadow: `inset -4px 0 0 -3px rgba(${flavorGlow.glowRgb}, 0.2)`,
        }}
      >
        {/* Out of Stock Overlay Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hero Image Section */}
        <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                }
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                className="h-16 w-16 text-gray-300 dark:text-gray-700"
                aria-hidden="true"
              >
                <ellipse cx="32" cy="32" rx="28" ry="10" stroke="currentColor" strokeWidth="2" />
                <ellipse
                  cx="32"
                  cy="28"
                  rx="28"
                  ry="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
                <path
                  d="M4 28v4c0 5.523 12.536 10 28 10s28-4.477 28-10v-4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Brand Name (teal accent) */}
          <a
            href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            {product.brand}
          </a>

          {/* Product Name (bold, clear hierarchy) */}
          <h3 className="text-sm font-bold leading-tight text-gray-900 dark:text-white line-clamp-2">
            {product.name}
          </h3>

          {/* Strength Badge (color-coded, accessible) */}
          <StrengthBadge strengthKey={product.strengthKey} />

          {/* Star Rating with Review Count */}
          <StarRating rating={product.ratings} />

          {/* Nicotine Content Info */}
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {product.nicotineContent} mg/portion
          </span>

          {/* Pack Selector Pills (core UX advantage) */}
          <PackSelector
            prices={product.prices}
            activePackSize={packState.activePackSize}
            onPackSelect={handlePackSelect}
          />

          {/* Price Display (per-unit + total) */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                €{perUnitPrice.toFixed(2)}/can
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                €{displayPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button (teal, accessible) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="mt-auto w-full px-4 py-2.5 rounded-lg bg-teal-600 dark:bg-teal-500 text-white font-semibold text-sm transition-all duration-200 hover:bg-teal-700 dark:hover:bg-teal-600 active:scale-95 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>

        {/* Hover Glow Effect (subtle, premium feel) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at top right, rgba(${flavorGlow.glowRgb}, 0.15), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      </a>
    );
  },
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
