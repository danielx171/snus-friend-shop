import { memo, useState, useEffect, useCallback } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product, PackSize } from '@/data/products';

interface StickyAddToCartProps {
  productId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  flavorKey: string;
  strengthKey: string;
  nicotineContent: number;
  ratings: number;
  badgeKeys: string[];
  prices: Record<string, number>;
  stock: number;
}

const StickyAddToCart = memo(function StickyAddToCart(props: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const isOutOfStock = props.stock === 0;

  useEffect(() => {
    const mainButton = document.querySelector('[data-add-to-cart-main]');
    if (!mainButton) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when main button is NOT visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(mainButton);
    return () => observer.disconnect();
  }, []);

  const handleAdd = useCallback(() => {
    if (isOutOfStock) return;
    const product: Product = {
      id: props.productId,
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
  }, [props]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{props.name}</p>
          <p className="text-sm font-bold text-foreground">€{props.price.toFixed(2)}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="shrink-0 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
});

export default StickyAddToCart;
