import React, { useState, useCallback } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import type { Product, PackSize } from '@/data/products';

interface AddToCartButtonProps {
  product: {
    slug: string;
    name: string;
    brand: string;
    imageUrl: string;
    prices: Record<string, number>;
    stock: number;
    flavorKey?: string;
    strengthKey?: string;
    formatKey?: string;
    nicotineContent?: number;
    portionsPerCan?: number;
  };
}

const packOptions: { key: PackSize; label: string; qty: number }[] = [
  { key: 'pack1', label: '1 can', qty: 1 },
  { key: 'pack3', label: '3 cans', qty: 3 },
  { key: 'pack5', label: '5 cans', qty: 5 },
  { key: 'pack10', label: '10 cans', qty: 10 },
];

const AddToCartButton = React.memo<AddToCartButtonProps>(
  function AddToCartButton({ product }) {
    const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
    const [quantity, setQuantity] = useState(1);
    const isOutOfStock = product.stock === 0;

    const selectedPrice = product.prices[selectedPack];
    const availablePacks = packOptions.filter((p) => product.prices[p.key] != null && product.prices[p.key] > 0);

    const handleAdd = useCallback(() => {
      if (isOutOfStock) return;

      // Build a minimal Product object compatible with the cart store
      const cartProduct: Product = {
        id: product.slug,
        name: product.name,
        brand: product.brand,
        categoryKey: 'nicotinePouches',
        flavorKey: (product.flavorKey ?? 'mint') as Product['flavorKey'],
        strengthKey: (product.strengthKey ?? 'normal') as Product['strengthKey'],
        formatKey: (product.formatKey ?? 'slim') as Product['formatKey'],
        nicotineContent: product.nicotineContent ?? 0,
        portionsPerCan: product.portionsPerCan ?? 20,
        descriptionKey: '',
        image: product.imageUrl,
        ratings: 0,
        badgeKeys: [],
        prices: product.prices as Product['prices'],
        manufacturer: product.brand,
        stock: product.stock,
      };

      addToCart(cartProduct, selectedPack, quantity);
      openCart();
    }, [product, selectedPack, quantity, isOutOfStock]);

    const decrement = useCallback(() => {
      setQuantity((q) => Math.max(1, q - 1));
    }, []);

    const increment = useCallback(() => {
      setQuantity((q) => q + 1);
    }, []);

    return (
      <div className="space-y-4">
        {/* Pack size selector */}
        {availablePacks.length > 1 && (
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-foreground">
              Pack Size
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availablePacks.map(({ key, label }) => {
                const price = product.prices[key];
                const isSelected = selectedPack === key;
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer flex-col items-center rounded-lg border p-3 text-center transition ${
                      isSelected
                        ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-card/30 hover:border-primary/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pack-size"
                      value={key}
                      checked={isSelected}
                      onChange={() => setSelectedPack(key)}
                      className="sr-only"
                    />
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-bold text-foreground">
                      &euro;{price.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Quantity selector + Add to cart */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              &minus;
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              aria-label="Increase quantity"
              className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-muted"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {/* Selected price summary */}
        {selectedPrice != null && quantity > 1 && (
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">&euro;{(selectedPrice * quantity).toFixed(2)}</span>
          </p>
        )}
      </div>
    );
  },
);

export default AddToCartButton;
