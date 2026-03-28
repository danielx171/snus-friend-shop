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

export default function CardAddToCart(props: CardAddToCartProps) {
  const isOutOfStock = props.stock === 0;

  function handleClick() {
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
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock}
      aria-label={isOutOfStock ? `Sold Out – ${props.name}` : `Add to Cart – ${props.name}`}
      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
    </button>
  );
}
