import { addToCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import type { Product, PackSize } from '@/data/products';
import { RETAIL_PACK_SIZES, packSizeMultipliers } from '@/data/products';
import { memo, useCallback, useRef, useState } from 'react';

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

const CardAddToCart = memo(function CardAddToCart(props: CardAddToCartProps) {
  const isOutOfStock = props.stock === 0;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');

  const availablePacks = RETAIL_PACK_SIZES.filter(
    (pk) => (props.prices[pk] ?? 0) > 0
  );

  const pack1Price = props.prices.pack1 ?? 0;
  const getSavings = (pk: PackSize): number => {
    if (pk === 'pack1' || pack1Price <= 0) return 0;
    const perCan = (props.prices[pk] ?? 0) / packSizeMultipliers[pk];
    return Math.round((1 - perCan / pack1Price) * 100);
  };

  const displayPrice = props.prices[selectedPack] ?? pack1Price;
  const displayPerCan = selectedPack === 'pack1'
    ? displayPrice
    : displayPrice / packSizeMultipliers[selectedPack];

  const handleAdd = useCallback(() => {
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
    addToCart(product, selectedPack);
    window.dispatchEvent(new CustomEvent('open-cart'));
    cartToast(props.name);

    setJustAdded(true);
    btnRef.current?.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.94)', offset: 0.3 },
      { transform: 'scale(1.03)', offset: 0.6 },
      { transform: 'scale(1)' },
    ], { duration: 250, easing: 'ease' });
    setTimeout(() => setJustAdded(false), 1200);
  }, [props, selectedPack, isOutOfStock]);

  return (
    <div className="mt-auto flex flex-col gap-1.5 pt-1">
      {availablePacks.length > 1 && (
        <div className="flex gap-1 flex-wrap">
          {availablePacks.map((pk) => {
            const qty = packSizeMultipliers[pk];
            const savings = getSavings(pk);
            return (
              <button
                key={pk}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedPack(pk); }}
                className={cn(
                  "text-[10px] px-2 py-1 rounded-full border font-medium transition-all",
                  pk === selectedPack
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-transparent text-muted-foreground hover:border-primary/40"
                )}
                aria-label={`Select ${qty} can${qty > 1 ? 's' : ''}`}
              >
                {qty === 1 ? '1 can' : qty}
                {savings > 0 && (
                  <span className={cn(
                    "ml-0.5 text-[9px] font-bold",
                    pk === selectedPack ? "text-green-200" : "text-green-500"
                  )}>
                    -{savings}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-end justify-between">
        <div>
          <span className="text-lg font-bold text-foreground">
            &euro;{displayPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-muted-foreground ml-1">
            {selectedPack === 'pack1' ? '/ can' : `/ ${packSizeMultipliers[selectedPack]} cans`}
          </span>
          {selectedPack !== 'pack1' && (
            <span className="block text-[10px] text-muted-foreground">
              €{displayPerCan.toFixed(2)} per can
            </span>
          )}
        </div>
        <button
          ref={btnRef}
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? `Sold Out – ${props.name}` : `Add ${packSizeMultipliers[selectedPack]} to cart – ${props.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOutOfStock ? '✕' : justAdded ? '✓' : '+'}
        </button>
      </div>
    </div>
  );
});

export default CardAddToCart;
