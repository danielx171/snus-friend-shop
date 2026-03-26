import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Product, PackSize } from '@/data/products';
import { tenant } from '@/config/tenant';

export interface CartItem {
  product: Product;
  packSize: PackSize;
  quantity: number;
}

export const $cartItems = persistentAtom<CartItem[]>(
  tenant.storage.cartKey,
  [],
  { encode: JSON.stringify, decode: JSON.parse },
);

export const $cartOpen = atom(false);

export const $cartTotal = computed($cartItems, (items) =>
  items.reduce((sum, item) => {
    const price = item.product.prices[item.packSize];
    return sum + price * item.quantity;
  }, 0),
);

export const $cartCount = computed($cartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const $freeShippingProgress = computed($cartTotal, (total) => ({
  reached: total >= tenant.freeShippingThreshold,
  remaining: Math.max(0, tenant.freeShippingThreshold - total),
  threshold: tenant.freeShippingThreshold,
}));

export function addToCart(product: Product, packSize: PackSize, quantity = 1) {
  const items = $cartItems.get();
  const existingIndex = items.findIndex(
    (item) => item.product.id === product.id && item.packSize === packSize,
  );
  if (existingIndex >= 0) {
    const updated = [...items];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity,
    };
    $cartItems.set(updated);
  } else {
    $cartItems.set([...items, { product, packSize, quantity }]);
  }
}

export function removeFromCart(productId: string, packSize: PackSize) {
  $cartItems.set(
    $cartItems.get().filter(
      (item) => !(item.product.id === productId && item.packSize === packSize),
    ),
  );
}

export function updateCartQuantity(productId: string, packSize: PackSize, quantity: number) {
  if (quantity <= 0) { removeFromCart(productId, packSize); return; }
  $cartItems.set(
    $cartItems.get().map((item) =>
      item.product.id === productId && item.packSize === packSize
        ? { ...item, quantity }
        : item,
    ),
  );
}

export function clearCart() { $cartItems.set([]); }
export function openCart() { $cartOpen.set(true); }
export function closeCart() { $cartOpen.set(false); }
