import { describe, it, expect, beforeEach, vi } from 'vitest';

const { apiFetchMock } = vi.hoisted(() => ({
  apiFetchMock: vi.fn(),
}));

// Analytics fires fetch on add/remove; stub so the cart store stays pure in tests.
vi.mock('@/lib/analytics', () => ({
  trackAddToCart: vi.fn(),
  trackRemoveFromCart: vi.fn(),
  trackCheckoutStarted: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  apiFetch: apiFetchMock,
}));

vi.mock('@/integrations/supabase/client', () => ({
  hasSupabaseEnv: true,
}));

import {
  $cartItems,
  $cartTotal,
  $cartCount,
  $cartCanCount,
  $mixDiscount,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setStoredGuestEmail,
} from '@/stores/cart';
import type { Product } from '@/data/products';

const baseProduct: Omit<Product, 'id' | 'name' | 'brand' | 'prices'> = {
  categoryKey: 'nicotinePouches',
  flavorKey: 'mint',
  strengthKey: 'normal',
  formatKey: 'slim',
  nicotineContent: 6,
  portionsPerCan: 20,
  descriptionKey: '',
  image: '',
  ratings: 4.5,
  badgeKeys: [],
  manufacturer: 'Test',
};

function makeProduct(id: string, pack1 = 5): Product {
  return {
    id,
    name: `Product ${id}`,
    brand: 'Test',
    ...baseProduct,
    prices: { pack1, pack3: pack1 * 3 * 0.95, pack5: pack1 * 5 * 0.9, pack10: pack1 * 10 * 0.85, pack30: pack1 * 30 * 0.8 },
  };
}

describe('cart operations', () => {
  beforeEach(() => {
    vi.useRealTimers();
    apiFetchMock.mockReset().mockResolvedValue({ ok: true });
    clearCart();
    window.localStorage.clear();
  });

  it('addToCart inserts a new line item', () => {
    addToCart(makeProduct('a'), 'pack1');
    const items = $cartItems.get();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe('a');
    expect(items[0].packSize).toBe('pack1');
    expect(items[0].quantity).toBe(1);
  });

  it('addToCart merges duplicate pack sizes by incrementing quantity', () => {
    addToCart(makeProduct('a'), 'pack1');
    addToCart(makeProduct('a'), 'pack1', 2);
    const items = $cartItems.get();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('addToCart keeps different pack sizes of the same product as separate lines', () => {
    addToCart(makeProduct('a'), 'pack1');
    addToCart(makeProduct('a'), 'pack3');
    expect($cartItems.get()).toHaveLength(2);
  });

  it('updateCartQuantity sets exact quantity; zero removes the line', () => {
    addToCart(makeProduct('a'), 'pack1');
    updateCartQuantity('a', 'pack1', 4);
    expect($cartItems.get()[0].quantity).toBe(4);
    updateCartQuantity('a', 'pack1', 0);
    expect($cartItems.get()).toHaveLength(0);
  });

  it('removeFromCart only removes the matching pack size', () => {
    addToCart(makeProduct('a'), 'pack1');
    addToCart(makeProduct('a'), 'pack3');
    removeFromCart('a', 'pack1');
    const items = $cartItems.get();
    expect(items).toHaveLength(1);
    expect(items[0].packSize).toBe('pack3');
  });

  it('computed $cartTotal sums price × quantity across lines', () => {
    addToCart(makeProduct('a', 5), 'pack1', 2); // 10
    addToCart(makeProduct('b', 8), 'pack1', 1); //  8
    expect($cartTotal.get()).toBeCloseTo(18, 2);
  });

  it('computed $cartCount and $cartCanCount reflect pack multipliers', () => {
    addToCart(makeProduct('a'), 'pack1', 2);  // count 2, cans 2
    addToCart(makeProduct('b'), 'pack5', 1);  // count 1, cans 5
    expect($cartCount.get()).toBe(3);
    expect($cartCanCount.get()).toBe(7);
  });

  it('$mixDiscount stays inactive below the 5-can threshold and surfaces the next tier', () => {
    addToCart(makeProduct('a'), 'pack1', 3); // 3 cans
    const d = $mixDiscount.get();
    expect(d.active).toBe(false);
    expect(d.pct).toBe(0);
    expect(d.nextTierCans).toBe(5);
    expect(d.nextTierPct).toBe(5);
    expect(d.cansNeeded).toBe(2);
  });

  it('$mixDiscount tiers: 5 cans → 5%, 10 → 10%, 20 → 15% (regression for nanostores computed args bug)', () => {
    // Regression: $mixDiscount used to destructure a tuple and get undefined values.
    // Now confirms the computed receives (canCount, total) as separate args.
    addToCart(makeProduct('a', 4), 'pack5', 1); // 5 cans, €20
    let d = $mixDiscount.get();
    expect(d.active).toBe(true);
    expect(d.pct).toBe(5);
    expect(d.amount).toBeGreaterThan(0);

    clearCart();
    addToCart(makeProduct('a', 4), 'pack10', 1); // 10 cans, €40
    d = $mixDiscount.get();
    expect(d.active).toBe(true);
    expect(d.pct).toBe(10);

    clearCart();
    addToCart(makeProduct('a', 4), 'pack10', 2); // 20 cans, €80
    d = $mixDiscount.get();
    expect(d.active).toBe(true);
    expect(d.pct).toBe(15);
  });

  it('clearCart empties the store', () => {
    addToCart(makeProduct('a'), 'pack1');
    addToCart(makeProduct('b'), 'pack3');
    clearCart();
    expect($cartItems.get()).toHaveLength(0);
    expect($cartTotal.get()).toBe(0);
  });

  it('includes a valid guest email in abandoned-cart snapshot payloads', async () => {
    vi.useFakeTimers();
    setStoredGuestEmail('Guest@Example.com');

    addToCart(makeProduct('a'), 'pack1');
    await vi.advanceTimersByTimeAsync(30_000);

    expect(apiFetchMock).toHaveBeenCalledWith(
      'save-cart-snapshot',
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          guest_email: 'guest@example.com',
          item_count: 1,
        }),
      }),
    );
  });
});
