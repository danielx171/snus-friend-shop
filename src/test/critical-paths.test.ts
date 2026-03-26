import { describe, it, expect } from 'vitest';
import { getCartTotals } from '@/lib/cart-utils';
import { formatMoney, formatPrice, formatPricePerUnit } from '@/lib/currency';
import type { CartItem } from '@/context/CartContext';
import type { Product, PackSize } from '@/data/products';
import type { MarketConfig } from '@/lib/market';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Canonical email regex from CLAUDE.md */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'test-product-1',
    name: 'Test Snus',
    brand: 'TestBrand',
    categoryKey: 'nicotine-pouches' as Product['categoryKey'],
    flavorKey: 'mint' as Product['flavorKey'],
    strengthKey: 'strong' as Product['strengthKey'],
    formatKey: 'slim' as Product['formatKey'],
    nicotineContent: 12,
    portionsPerCan: 20,
    descriptionKey: 'test_desc',
    image: '/img/test.webp',
    ratings: 4.5,
    badgeKeys: [],
    prices: { pack1: 5, pack3: 13.5, pack5: 21, pack10: 40, pack30: 110 },
    manufacturer: 'TestCo',
    ...overrides,
  };
}

function makeCartItem(
  overrides: Partial<CartItem> & { product?: Partial<Product> } = {},
): CartItem {
  const { product: productOverrides, ...rest } = overrides;
  return {
    product: makeProduct(productOverrides),
    packSize: 'pack1' as PackSize,
    quantity: 1,
    ...rest,
  };
}

const eurMarket: MarketConfig = {
  currencyCode: 'EUR',
  locale: 'en-IE',
  freeShippingThreshold: 29,
  shippingCost: 4.99,
  showTaxRate: false,
  rateFromGBP: 1,
};

// ---------------------------------------------------------------------------
// Email validation
// ---------------------------------------------------------------------------

describe('Email validation', () => {
  it.each([
    'user@example.com',
    'test+tag@domain.co.uk',
    'name.surname@company.org',
    'a@b.co',
  ])('accepts valid email: %s', (email) => {
    expect(EMAIL_REGEX.test(email.trim())).toBe(true);
  });

  it.each([
    'noatsign',
    '@nodomain',
    'user@',
    'user @space.com',
    'user@ space.com',
    '',
    'missing@.dot',
  ])('rejects invalid email: "%s"', (email) => {
    expect(EMAIL_REGEX.test(email.trim())).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cart operations (getCartTotals from cart-utils.ts)
// ---------------------------------------------------------------------------

describe('Cart operations — getCartTotals', () => {
  it('returns zero totals for an empty cart', () => {
    const totals = getCartTotals([], eurMarket);
    expect(totals.subtotal).toBe(0);
    expect(totals.finalTotal).toBe(eurMarket.shippingCost); // shipping only
    expect(totals.discount).toBe(0);
    expect(totals.freeShipping).toBe(false);
    expect(totals.progress).toBe(0);
  });

  it('calculates subtotal for a single item', () => {
    const items: CartItem[] = [makeCartItem({ quantity: 2 })];
    const totals = getCartTotals(items, eurMarket);
    // 2 * pack1 price (5) = 10
    expect(totals.subtotal).toBe(10);
  });

  it('adds duplicate item quantities into the total', () => {
    const product = makeProduct();
    const items: CartItem[] = [
      { product, packSize: 'pack1', quantity: 1 },
      { product, packSize: 'pack1', quantity: 3 },
    ];
    const totals = getCartTotals(items, eurMarket);
    // (1 + 3) * 5 = 20
    expect(totals.subtotal).toBe(20);
  });

  it('handles different pack sizes correctly', () => {
    const items: CartItem[] = [
      makeCartItem({ packSize: 'pack3', quantity: 1 }),
    ];
    const totals = getCartTotals(items, eurMarket);
    expect(totals.subtotal).toBe(13.5);
  });

  it('applies WELCOME10 discount code', () => {
    const items: CartItem[] = [makeCartItem({ quantity: 1 })];
    const totals = getCartTotals(items, eurMarket, null, 'WELCOME10');
    expect(totals.discount).toBeCloseTo(0.5); // 10% of 5
  });

  it('discount code is case-insensitive', () => {
    const items: CartItem[] = [makeCartItem({ quantity: 1 })];
    const totals = getCartTotals(items, eurMarket, null, 'welcome10');
    expect(totals.discount).toBeCloseTo(0.5);
  });

  it('grants free shipping when subtotal meets threshold', () => {
    // Need subtotal * rateFromGBP >= 29 — with EUR market rateFromGBP=1, need >= 29
    const items: CartItem[] = [makeCartItem({ quantity: 6 })]; // 6 * 5 = 30
    const totals = getCartTotals(items, eurMarket);
    expect(totals.freeShipping).toBe(true);
    expect(totals.shipping).toBe(0);
  });

  it('charges shipping when subtotal is below threshold', () => {
    const items: CartItem[] = [makeCartItem({ quantity: 1 })]; // 5 < 29
    const totals = getCartTotals(items, eurMarket);
    expect(totals.freeShipping).toBe(false);
    expect(totals.shipping).toBeGreaterThan(0);
  });

  it('computes finalTotal = subtotal - discount + shipping', () => {
    const items: CartItem[] = [makeCartItem({ quantity: 6 })]; // subtotal 30, free shipping
    const totals = getCartTotals(items, eurMarket, null, 'WELCOME10');
    // 30 - 3 + 0 = 27
    expect(totals.finalTotal).toBeCloseTo(27);
  });

  it('progress reaches 100 at or above threshold', () => {
    const items: CartItem[] = [makeCartItem({ quantity: 6 })]; // 30 >= 29
    const totals = getCartTotals(items, eurMarket);
    expect(totals.progress).toBe(100);
  });

  it('progress is proportional below threshold', () => {
    // subtotal 5 in EUR market (threshold 29)
    const items: CartItem[] = [makeCartItem({ quantity: 1 })];
    const totals = getCartTotals(items, eurMarket);
    const expected = (5 / 29) * 100;
    expect(totals.progress).toBeCloseTo(expected, 1);
  });

  it('uses delivery option price when provided', () => {
    const items: CartItem[] = [makeCartItem({ quantity: 1 })];
    const delivery = { id: 'express', priceGBP: 9.99 };
    const totals = getCartTotals(items, eurMarket, delivery);
    expect(totals.shipping).toBe(9.99);
  });
});

// ---------------------------------------------------------------------------
// Currency formatting
// ---------------------------------------------------------------------------

describe('Currency formatting — formatMoney', () => {
  it('formats a standard EUR amount', () => {
    const result = formatMoney(12.5);
    // Should contain the number and EUR symbol
    expect(result).toContain('12.50');
  });

  it('formats zero', () => {
    const result = formatMoney(0);
    expect(result).toContain('0.00');
  });

  it('formats negative amounts', () => {
    const result = formatMoney(-5.99);
    expect(result).toContain('5.99');
  });

  it('formats large numbers', () => {
    const result = formatMoney(1234567.89);
    expect(result).toMatch(/1.*234.*567.*89/); // allows locale-specific separators
  });

  it('respects custom decimal places', () => {
    const result = formatMoney(10, { decimals: 0 });
    expect(result).not.toContain('.'); // no decimal point when 0 decimals
  });
});

describe('Currency formatting — formatPrice', () => {
  it('is an alias for formatMoney', () => {
    expect(formatPrice(19.99)).toBe(formatMoney(19.99));
  });

  it('accepts decimals parameter', () => {
    expect(formatPrice(10, 0)).toBe(formatMoney(10, { decimals: 0 }));
  });
});

describe('Currency formatting — formatPricePerUnit', () => {
  it('appends /can suffix by default', () => {
    const result = formatPricePerUnit(1.05);
    expect(result).toContain('/can');
    expect(result).toContain('1.05');
  });

  it('accepts custom unit suffix', () => {
    const result = formatPricePerUnit(2.5, '/pouch');
    expect(result).toContain('/pouch');
  });
});
