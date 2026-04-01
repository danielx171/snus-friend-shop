import React, { useCallback } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product } from '@/data/products';
import { brandColors, strengthColors, strengthLabels, defaultBrandColor, flavorColors, defaultFlavorColor } from '@/data/brand-colors';

interface ProductCardProps {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  ratings: number;
  badgeKeys: string[];
}

const badgeLabelMap: Record<string, string> = {
  NewPrice: 'New Price', newPrice: 'New Price', popular: 'Popular',
  bestseller: 'Bestseller', new: 'New',
};
function formatBadge(key: string): string {
  return badgeLabelMap[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
}

const strengthMap: Record<string, number> = {
  light: 1, normal: 2, strong: 3, 'extra-strong': 4, 'super-strong': 5,
};

const flavorLabelMap: Record<string, string> = {
  mint: 'Mint', berry: 'Berry', citrus: 'Citrus', fruit: 'Fruit',
  coffee: 'Coffee', cola: 'Cola', menthol: 'Menthol', wintergreen: 'Wintergreen',
  tropical: 'Tropical', ice: 'Ice', original: 'Original', tobacco: 'Tobacco',
  licorice: 'Licorice', vanilla: 'Vanilla',
};

function StarRating({ rating }: { rating: number }) {
  if (!rating || rating <= 0) return null;
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" aria-hidden="true">
          <defs>
            <linearGradient id="half-star-react">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star-react)" stroke="currentColor" strokeWidth="0.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} className="h-3 w-3 text-muted-foreground/30" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const ProductCard = React.memo<ProductCardProps>(function ProductCard({
  slug, name, brand, brandSlug, imageUrl, prices, stock,
  nicotineContent, strengthKey, flavorKey, ratings, badgeKeys,
}) {
  const isOutOfStock = stock === 0;
  const displayPrice = prices.pack1;
  const brandColor = brandColors[brandSlug] ?? defaultBrandColor;
  const strengthColor = strengthColors[strengthKey] ?? strengthColors['normal'];
  const flavorColor = flavorColors[flavorKey] ?? defaultFlavorColor;
  const strengthDots = strengthMap[strengthKey] ?? 2;
  const flavorLabel = flavorLabelMap[flavorKey] ?? flavorKey;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) return;
      const product: Product = {
        id: slug, name, brand, categoryKey: 'nicotinePouches',
        flavorKey: flavorKey as Product['flavorKey'],
        strengthKey: strengthKey as Product['strengthKey'],
        formatKey: 'slim', nicotineContent, portionsPerCan: 20,
        descriptionKey: '', image: imageUrl, ratings,
        badgeKeys: badgeKeys as Product['badgeKeys'],
        prices: prices as Product['prices'],
        manufacturer: brand, stock,
      };
      addToCart(product, 'pack1');
      openCart();
      cartToast(name);
    },
    [slug, name, brand, imageUrl, prices, stock, nicotineContent, strengthKey, flavorKey, ratings, badgeKeys, isOutOfStock],
  );

  return (
    <a
      href={`/products/${slug}`}
      className="product-card group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Badges — pill style with glow */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1">
        {isOutOfStock && (
          <span className="rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold text-destructive-foreground shadow-sm">
            Out of Stock
          </span>
        )}
        {badgeKeys.map((badge) => (
          <span
            key={badge}
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
            style={{
              backgroundColor: badge === 'popular' || badge === 'bestseller' ? '#f59e0b'
                : badge === 'new' ? '#22c55e' : 'hsl(var(--primary))',
            }}
          >
            {formatBadge(badge)}
          </span>
        ))}
      </div>

      {/* Image area with radial flavor glow */}
      <div className="product-card-image relative aspect-square w-full overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 transition-opacity duration-300 group-hover:opacity-30"
          style={{ background: `radial-gradient(circle at 50% 60%, ${flavorColor}90 0%, transparent 70%)` }}
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name}${brand ? ` by ${brand}` : ''}${strengthKey ? ` - ${strengthKey}` : ''}`}
            width={300}
            height={300}
            loading="lazy"
            className="relative z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            style={{ filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.3)) drop-shadow(0 0 8px ${flavorColor}15)` }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center"
            style={{ background: `radial-gradient(circle at 50% 60%, ${brandColor}30 0%, transparent 70%)` }}>
            <span className="text-4xl font-bold" style={{ color: `${brandColor}90` }} aria-hidden="true">
              {brand.split(/[\s-]+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')}
            </span>
          </div>
        )}

        {/* Strength accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] z-[2]"
          style={{ background: `linear-gradient(90deg, transparent, ${strengthColor}, transparent)`, opacity: 0.8 }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Brand + strength dots */}
        <div className="flex items-center justify-between">
          <span
            role="link"
            tabIndex={0}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/brands/${brandSlug}`; }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); window.location.href = `/brands/${brandSlug}`; } }}
            className="text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all hover:brightness-125"
            style={{ color: brandColor }}
          >
            {brand}
          </span>
          <div className="flex items-center gap-0.5" role="img" aria-label={`${strengthLabels[strengthKey] ?? 'Normal'} strength, ${strengthDots} of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: i < strengthDots ? 6 : 5,
                  height: i < strengthDots ? 6 : 5,
                  backgroundColor: i < strengthDots ? strengthColor : 'rgba(128,128,128,0.2)',
                  boxShadow: i < strengthDots ? `0 0 4px ${strengthColor}50` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">{name}</h3>

        {/* Pill badges — flavor + mg */}
        <div className="flex items-center gap-1 flex-wrap">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border"
            style={{ backgroundColor: `${flavorColor}15`, color: flavorColor, borderColor: `${flavorColor}25` }}
          >
            {flavorLabel}
          </span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border"
            style={{ backgroundColor: `${strengthColor}15`, color: strengthColor, borderColor: `${strengthColor}25` }}
          >
            {nicotineContent} mg
          </span>
        </div>

        {/* Star rating */}
        {ratings > 0 && (
          <div className="flex items-center gap-1">
            <StarRating rating={ratings} />
            <span className="text-xs text-muted-foreground">{ratings.toFixed(1)}</span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              &euro;{displayPrice.toFixed(2)}
            </span>
            {displayPrice > 0 && (
              <span className="text-[10px] font-medium text-primary">
                +{Math.floor(displayPrice * 10)} pts
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `Sold Out – ${name}` : `Add to Cart – ${name}`}
            className="min-h-[44px] rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </a>
  );
});

export default ProductCard;
