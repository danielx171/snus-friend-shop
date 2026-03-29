import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product } from '@/data/products';

interface CardAddToCartProps {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  ratings: number;
  badgeKeys: string[];
}

import { memo, useCallback, useRef, useState } from 'react';

const CardAddToCart = memo(function CardAddToCart(props: CardAddToCartProps) {
  const isOutOfStock = props.stock === 0;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = useCallback(() => {
    if (isOutOfStock) return;
    const product: Product = {
      id: props.slug,
      name: props.name,
      brand: props.brand,
      categoryKey: 'nicotinePouches',
      flavorKey: props.flavorKey as Product['flavorKey'],
      strengthKey: props.strengthKey as Product['strengthKey'],
      formatKey: 'slim',
      nicotineContent: props.nicotineContent,
      portionsPerCan: 20,
      descriptionKey: '',
      image: props.imageUrl,
      ratings: props.ratings,
      badgeKeys: props.badgeKeys as Product['badgeKeys'],
      prices: props.prices as Product['prices'],
      manufacturer: props.brand,
      stock: props.stock,
    };
    addToCart(product, 'pack1');
    openCart();
    cartToast(props.name);

    // Tin-snap micro-animation
    setJustAdded(true);
    btnRef.current?.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.94)', offset: 0.3 },
      { transform: 'scale(1.03)', offset: 0.6 },
      { transform: 'scale(1)' },
    ], { duration: 250, easing: 'ease' });
    setTimeout(() => setJustAdded(false), 1200);
  }, [props.slug, props.name, props.brand, props.imageUrl, props.flavorKey, props.strengthKey, props.nicotineContent, props.ratings, props.badgeKeys, props.prices, props.stock, isOutOfStock]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock}
      aria-label={isOutOfStock ? `Sold Out – ${props.name}` : `Add to Cart – ${props.name}`}
      className="min-h-[44px] rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
    >
      {isOutOfStock ? 'Sold Out' : justAdded ? 'Added ✓' : 'Add to Cart'}
    </button>
  );
});

export default CardAddToCart;
