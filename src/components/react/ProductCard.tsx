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

function StrengthIndicator({ strengthKey }: { strengthKey: string }) {
  const level = strengthMap[strengthKey] ?? 2;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Strength ${level} of 5`}>
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
            alt={name}
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
        <a
          href={`/brands/${brandSlug}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {brand}
        </a>

        {/* Name */}
        <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
          {name}
        </h3>

        {/* Strength + Flavor */}
        <div className="flex items-center gap-2">
          <StrengthIndicator strengthKey={strengthKey} />
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {flavorKey}
          </span>
        </div>

        {/* Nicotine */}
        <span className="text-[10px] text-muted-foreground">
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
            aria-label={`Add ${name} to cart`}
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
