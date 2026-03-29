import React, { useCallback, useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  $cartOpen,
  $cartItems,
  $cartTotal,
  $cartCount,
  $freeShippingProgress,
  closeCart,
  removeFromCart,
  updateCartQuantity,
  upgradePackSize,
  getPackSavings,
} from '@/stores/cart';
import type { CartItem } from '@/stores/cart';
import type { PackSize } from '@/data/products';
import { tenant } from '@/config/tenant';

const packSizeLabels: Record<string, string> = {
  pack1: '1 can',
  pack3: '3-pack',
  pack5: '5-pack',
  pack10: '10-pack',
  pack30: '30-pack',
};

// ── Cart Item Row ──────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow = React.memo<CartItemRowProps>(function CartItemRow({ item }) {
  const { product, packSize, quantity } = item;
  const unitPrice = product.prices[packSize];
  const lineTotal = unitPrice * quantity;

  const handleDecrement = useCallback(() => {
    updateCartQuantity(product.id, packSize, quantity - 1);
  }, [product.id, packSize, quantity]);

  const handleIncrement = useCallback(() => {
    updateCartQuantity(product.id, packSize, quantity + 1);
  }, [product.id, packSize, quantity]);

  const handleRemove = useCallback(() => {
    removeFromCart(product.id, packSize);
  }, [product.id, packSize]);

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-b-0">
      {/* Thumbnail */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-xs text-muted-foreground">{product.brand}</span>
        <span className="text-sm font-medium text-foreground leading-tight truncate">
          {product.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {packSizeLabels[packSize] ?? packSize}
        </span>

        {/* Quantity controls */}
        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            aria-label={`Decrease quantity of ${product.name}`}
            className="flex h-6 w-6 items-center justify-center rounded border border-border text-sm transition-colors hover:bg-muted"
          >
            -
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-medium text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            aria-label={`Increase quantity of ${product.name}`}
            className="flex h-6 w-6 items-center justify-center rounded border border-border text-sm transition-colors hover:bg-muted"
          >
            +
          </button>
        </div>
      </div>

      {/* Price + Remove */}
      <div className="flex flex-col items-end justify-between">
        <span className="text-sm font-bold text-foreground">
          &euro;{lineTotal.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${product.name} from cart`}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

// ── Free Shipping Progress ─────────────────────────────────────

function FreeShippingBar() {
  const progress = useStore($freeShippingProgress);
  const pct = progress.reached
    ? 100
    : Math.min(100, ((progress.threshold - progress.remaining) / progress.threshold) * 100);

  return (
    <div className="px-1 pb-3">
      {progress.reached ? (
        <p className="text-xs font-medium text-primary text-center">
          You qualify for free shipping!
        </p>
      ) : (
        <p className="text-xs text-muted-foreground text-center">
          Add &euro;{progress.remaining.toFixed(2)} more for free shipping
        </p>
      )}
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="h-16 w-16 text-muted-foreground/30"
        aria-hidden="true"
      >
        <path
          d="M10 16h6l8 28h22l6-20H22"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="52" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="42" cy="52" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
      <p className="text-sm text-muted-foreground">Your cart is empty</p>
      <a
        href="/products"
        onClick={() => closeCart()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Continue Shopping
      </a>
    </div>
  );
}

// ── Cart Drawer (main export) ──────────────────────────────────

export default function CartDrawer() {
  const isOpen = useStore($cartOpen);
  const items = useStore($cartItems);
  const total = useStore($cartTotal);
  const count = useStore($cartCount);

  // Prevent hydration mismatch: server has no localStorage, so
  // render nothing until after first mount when persistentAtom syncs.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) closeCart();
  }, []);

  // On server / first client render, the drawer is closed and empty — matches SSR output
  if (!mounted) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background border-l border-border shadow-xl transition-transform duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Dialog.Title className="text-lg font-bold text-foreground">
              Your Cart ({count})
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {/* Body — scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <FreeShippingBar />
                {/* Pack upsell nudges */}
                {items.map((item) => {
                  const savings = getPackSavings(item);
                  if (!savings) return null;
                  const packLabel = savings.bestPack.replace('pack', '') + '-pack';
                  return (
                    <div key={`upsell-${item.product.id}`} className="mb-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <p className="text-xs text-foreground">
                        <strong>Save {savings.savingsPercent}%</strong> — switch {item.product.name} to a {packLabel} (€{savings.pricePerCan.toFixed(2)}/can)
                      </p>
                      <button
                        type="button"
                        onClick={() => upgradePackSize(item.product.id, item.packSize, savings.bestPack)}
                        className="mt-1.5 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        Upgrade to {packLabel}
                      </button>
                    </div>
                  );
                })}
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <CartItemRow
                      key={`${item.product.id}-${item.packSize}`}
                      item={item}
                    />
                  ))}
                </div>

                {/* Quick add suggestion */}
                {items.length > 0 && items.length < 5 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Complete your order</p>
                    <div className="flex gap-2">
                      <a
                        href="/products"
                        onClick={closeCart}
                        className="flex-1 rounded-lg border border-border bg-card/60 p-2 text-center text-xs font-medium text-foreground transition hover:border-primary/30"
                      >
                        Browse more pouches
                      </a>
                      <a
                        href="/flavor-quiz"
                        onClick={closeCart}
                        className="flex-1 rounded-lg border border-primary/20 bg-primary/5 p-2 text-center text-xs font-medium text-primary transition hover:bg-primary/10"
                      >
                        Take the flavour quiz
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer — sticky bottom */}
              <div className="border-t border-border px-4 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold text-foreground">
                    &euro;{total.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <a
                    href="/cart"
                    onClick={() => closeCart()}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    View Cart
                  </a>
                  <a
                    href="/checkout"
                    onClick={() => closeCart()}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
