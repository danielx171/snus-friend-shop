import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Product, PackSize } from '@/data/products';
import { packSizeMultipliers } from '@/data/products';
import { tenant } from '@/config/tenant';
import { trackAddToCart, trackRemoveFromCart } from '@/lib/analytics';

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

/**
 * Re-read cart items from localStorage into the in-memory atom.
 * Called by CartDrawer before opening to sync cross-island state —
 * Astro bundles each island separately, so persistentAtom instances
 * don't share in-memory state within the same page.
 */
export function syncCartFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(tenant.storage.cartKey);
    if (raw) {
      const items: CartItem[] = JSON.parse(raw);
      $cartItems.set(items);
    }
  } catch { /* ignore malformed storage */ }
}

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

/** Total number of individual cans in cart (across all products/pack sizes) */
export const $cartCanCount = computed($cartItems, (items) =>
  items.reduce((sum, item) => {
    const multiplier = packSizeMultipliers[item.packSize] ?? 1;
    return sum + multiplier * item.quantity;
  }, 0),
);

/** Mix discount tiers: buy more cans from any mix of products, get a percentage off */
const MIX_TIERS = [
  { minCans: 20, pct: 15 },
  { minCans: 10, pct: 10 },
  { minCans: 5, pct: 5 },
] as const;

export const $mixDiscount = computed([$cartCanCount, $cartTotal], (canCount, total) => {
  const tier = MIX_TIERS.find((t) => canCount >= t.minCans);
  if (!tier) {
    // Show next tier as incentive
    const nextTier = MIX_TIERS[MIX_TIERS.length - 1]; // 5 cans = 5%
    return {
      active: false,
      pct: 0,
      amount: 0,
      canCount,
      nextTierCans: nextTier.minCans,
      nextTierPct: nextTier.pct,
      cansNeeded: nextTier.minCans - canCount,
    };
  }
  // Find next higher tier (if any)
  const tierIdx = MIX_TIERS.indexOf(tier);
  const nextTier = tierIdx > 0 ? MIX_TIERS[tierIdx - 1] : null;
  return {
    active: true,
    pct: tier.pct,
    amount: Math.round(total * tier.pct) / 100,
    canCount,
    nextTierCans: nextTier?.minCans ?? null,
    nextTierPct: nextTier?.pct ?? null,
    cansNeeded: nextTier ? nextTier.minCans - canCount : 0,
  };
});

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

  // PostHog: track add_to_cart
  trackAddToCart({
    productId: product.id,
    productName: product.name,
    brand: product.brand ?? '',
    packSize,
    quantity,
    price: product.prices[packSize] ?? 0,
  });
}

export function removeFromCart(productId: string, packSize: PackSize) {
  const removed = $cartItems.get().find(
    (item) => item.product.id === productId && item.packSize === packSize,
  );
  $cartItems.set(
    $cartItems.get().filter(
      (item) => !(item.product.id === productId && item.packSize === packSize),
    ),
  );

  // PostHog: track remove_from_cart
  if (removed) {
    trackRemoveFromCart({
      productId,
      productName: removed.product.name,
      packSize,
    });
  }
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

/** Upgrade a cart item from pack1 to a larger pack size. */
export function upgradePackSize(productId: string, fromPack: PackSize, toPack: PackSize) {
  $cartItems.set(
    $cartItems.get().map((item) =>
      item.product.id === productId && item.packSize === fromPack
        ? { ...item, packSize: toPack }
        : item,
    ),
  );
}

/** Compute pack savings for a cart item. Returns null if no savings available. */
export function getPackSavings(item: CartItem): { bestPack: PackSize; savingsPercent: number; pricePerCan: number } | null {
  if (item.packSize !== 'pack1') return null;
  const pack1Price = item.product.prices.pack1;
  if (!pack1Price || pack1Price <= 0) return null;

  // Find the best pack deal
  const packs: { key: PackSize; qty: number }[] = [
    { key: 'pack3', qty: 3 },
    { key: 'pack5', qty: 5 },
    { key: 'pack10', qty: 10 },
  ];

  let bestSaving = 0;
  let bestPack: PackSize = 'pack1';
  let bestPerCan = pack1Price;

  for (const { key, qty } of packs) {
    const packPrice = item.product.prices[key];
    if (!packPrice || packPrice <= 0) continue;
    const perCan = packPrice / qty;
    const saving = Math.round((1 - perCan / pack1Price) * 100);
    if (saving > bestSaving) {
      bestSaving = saving;
      bestPack = key;
      bestPerCan = perCan;
    }
  }

  if (bestSaving < 5) return null; // Only show if >5% savings
  return { bestPack, savingsPercent: bestSaving, pricePerCan: bestPerCan };
}

/* ── Abandoned cart snapshot (debounced server sync) ── */

let _snapshotTimer: ReturnType<typeof setTimeout> | null = null;
const SNAPSHOT_DEBOUNCE_MS = 30_000; // 30 seconds after last cart change

$cartItems.listen((items) => {
  if (typeof window === 'undefined') return;
  if (_snapshotTimer) clearTimeout(_snapshotTimer);
  if (items.length === 0) return; // Don't snapshot empty carts

  _snapshotTimer = setTimeout(() => {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
    if (!supabaseUrl) return;

    const total = items.reduce((sum, item) => {
      const price = item.product.prices[item.packSize] ?? 0;
      return sum + price * item.quantity;
    }, 0);

    const canCount = items.reduce((sum, item) => {
      return sum + (packSizeMultipliers[item.packSize] ?? 1) * item.quantity;
    }, 0);

    const auth = (window as any).__AUTH_STATE__;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    fetch(`${supabaseUrl}/functions/v1/save-cart-snapshot`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        cart_data: items,
        cart_total: total,
        item_count: canCount,
      }),
    }).catch(() => {}); // Fire-and-forget
  }, SNAPSHOT_DEBOUNCE_MS);
});
