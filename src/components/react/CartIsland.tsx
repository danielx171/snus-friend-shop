import React, { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cartItems,
  $cartTotal,
  $freeShippingProgress,
  updateCartQuantity,
  removeFromCart,
} from '@/stores/cart';
import type { PackSize } from '@/data/products';

function CartIsland() {
  const items = useStore($cartItems);
  const total = useStore($cartTotal);
  const shipping = useStore($freeShippingProgress);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          >
            <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any pouches yet.
        </p>
        <a
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Free shipping progress */}
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4">
        {shipping.reached ? (
          <p className="text-sm font-medium text-primary">
            You've unlocked free shipping!
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Add <span className="font-semibold text-foreground">&euro;{shipping.remaining.toFixed(2)}</span> more
              for free shipping
            </p>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${Math.min(100, ((shipping.threshold - shipping.remaining) / shipping.threshold) * 100)}%`,
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Cart items */}
      <ul className="divide-y divide-border rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
        {items.map((item) => (
          <CartItemRow
            key={`${item.product.id}-${item.packSize}`}
            productId={item.product.id}
            name={item.product.name}
            brand={item.product.brand}
            image={item.product.image}
            packSize={item.packSize}
            price={item.product.prices[item.packSize]}
            quantity={item.quantity}
          />
        ))}
      </ul>

      {/* Subtotal + checkout */}
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-2xl font-bold text-foreground">&euro;{total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Shipping and taxes calculated at checkout.
        </p>
        <a
          href="/checkout"
          className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Proceed to Checkout
        </a>
        <a
          href="/products"
          className="flex w-full items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}

interface CartItemRowProps {
  productId: string;
  name: string;
  brand: string;
  image: string;
  packSize: PackSize;
  price: number;
  quantity: number;
}

const CartItemRow = React.memo<CartItemRowProps>(function CartItemRow({
  productId,
  name,
  brand,
  image,
  packSize,
  price,
  quantity,
}) {
  const handleDecrement = useCallback(() => {
    updateCartQuantity(productId, packSize, quantity - 1);
  }, [productId, packSize, quantity]);

  const handleIncrement = useCallback(() => {
    updateCartQuantity(productId, packSize, quantity + 1);
  }, [productId, packSize, quantity]);

  const handleRemove = useCallback(() => {
    removeFromCart(productId, packSize);
  }, [productId, packSize]);

  const packLabel = packSize.replace('pack', '') + (packSize === 'pack1' ? ' can' : ' cans');

  return (
    <li className="flex gap-4 p-4">
      {/* Product image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-2xl text-muted-foreground/40">&#9673;</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <p className="text-xs text-muted-foreground">{brand}</p>
          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground">{packLabel}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrement}
              aria-label={`Decrease quantity of ${name}`}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-sm text-foreground transition-colors hover:bg-muted"
            >
              &minus;
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              aria-label={`Increase quantity of ${name}`}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-sm text-foreground transition-colors hover:bg-muted"
            >
              +
            </button>
          </div>

          {/* Line total + remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground">
              &euro;{(price * quantity).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove ${name} from cart`}
              className="text-xs text-muted-foreground underline hover:text-destructive transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
});

export default CartIsland;
