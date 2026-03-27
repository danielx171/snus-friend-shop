import React, { useCallback } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product } from '@/data/products';

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

const strengthMap: Record<string, number> = {
  light: 1,
  normal: 2,
  strong: 3,
  'extra-strong': 4,
  'super-strong': 5,
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
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" stroke="currentColor" strokeWidth="0.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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

function StrengthIndicator({ strengthKey }: { strengthKey: string }) {
  const level = strengthMap[strengthKey] ?? 2;
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Strength ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i < level ? 'bg-primary' : 'bg-muted-foreground/25'
          }`}
        />
      ))}
    </div>
  );
}

const ProductCard = React.memo<ProductCardProps>(function ProductCard({
  slug,
  name,
  brand,
  brandSlug,
  imageUrl,
  prices,
  stock,
  nicotineContent,
  strengthKey,
  flavorKey,
  ratings,
  badgeKeys,
}) {
  const isOutOfStock = stock === 0;
  const displayPrice = prices.pack1;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) return;

      // Build a minimal Product object compatible with the cart store
      const product: Product = {
        id: slug,
        name,
        brand,
        categoryKey: 'nicotinePouches',
        flavorKey: flavorKey as Product['flavorKey'],
        strengthKey: strengthKey as Product['strengthKey'],
        formatKey: 'slim',
        nicotineContent,
        portionsPerCan: 20,
        descriptionKey: '',
        image: imageUrl,
        ratings,
        badgeKeys: badgeKeys as Product['badgeKeys'],
        prices: prices as Product['prices'],
        manufacturer: brand,
        stock,
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
      className="product-card group relative flex flex-col overflow-hidden rounded-xl bg-card/60 backdrop-blur-sm border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/30"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
        {isOutOfStock && (
          <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
            Out of Stock
          </span>
        )}
        {badgeKeys.map((badge) => (
          <span
            key={badge}
            className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Image */}
      <div className="product-card-image relative aspect-square w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name}${brand ? ` by ${brand}` : ''}${strengthKey ? ` - ${strengthKey}` : ''}`}
            width={300}
            height={300}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="h-16 w-16 text-muted-foreground/40"
              aria-hidden="true"
            >
              <ellipse cx="32" cy="32" rx="28" ry="10" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="32" cy="28" rx="28" ry="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
              <path d="M4 28v4c0 5.523 12.536 10 28 10s28-4.477 28-10v-4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Brand */}
        <span
          role="link"
          tabIndex={0}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/brands/${brandSlug}`; }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); window.location.href = `/brands/${brandSlug}`; }}}
          className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors py-1"
        >
          {brand}
        </span>

        {/* Name */}
        <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
          {name}
        </h3>

        {/* Strength + Flavor */}
        <div className="flex items-center gap-2">
          <StrengthIndicator strengthKey={strengthKey} />
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {flavorKey}
          </span>
        </div>

        {/* Star rating */}
        {ratings > 0 && (
          <div className="flex items-center gap-1">
            <StarRating rating={ratings} />
            <span className="text-xs text-muted-foreground">{ratings.toFixed(1)}</span>
          </div>
        )}

        {/* Nicotine */}
        <span className="text-xs text-muted-foreground">
          {nicotineContent} mg/portion
        </span>

        {/* Price + Cart */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-lg font-bold text-foreground">
            &euro;{displayPrice.toFixed(2)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `Sold Out – ${name}` : `Add to Cart – ${name}`}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </a>
  );
});

export default ProductCard;
