import { describe, it, expect } from 'vitest';
import { computePrices, RETAIL_MARKUP, PACK_DISCOUNT } from '@/lib/pricing';
import { packSizeMultipliers, type PackSize } from '@/data/products';

/**
 * Pre-submission checks that must hold before any cart goes to the Nyehandel
 * create-order edge function. CLAUDE.md: SKUs must be validated against the
 * NYE catalog before order submission; missing SKUs should block the order.
 */

type LineItem = { sku: string; quantity: number; packSize: PackSize };

function validateLineItems(items: LineItem[]): { ok: true } | { ok: false; error: string } {
  if (items.length === 0) return { ok: false, error: 'empty_cart' };
  for (const it of items) {
    if (!it.sku || typeof it.sku !== 'string') return { ok: false, error: 'missing_sku' };
    if (!Number.isInteger(it.quantity) || it.quantity < 1) return { ok: false, error: 'invalid_quantity' };
    if (!packSizeMultipliers[it.packSize]) return { ok: false, error: 'invalid_pack_size' };
  }
  return { ok: true };
}

describe('pricing', () => {
  it('computePrices applies markup + pack-size discounts to a wholesale base', () => {
    const variants = [{ pack_size: 1, price: 3.29 }];
    const p = computePrices(variants);
    const expectedPack1 = Math.round(3.29 * RETAIL_MARKUP * 100) / 100;
    expect(p.pack1).toBeCloseTo(expectedPack1, 2);
    // Larger packs are strictly cheaper per can than pack1
    expect(p.pack3 / 3).toBeLessThan(p.pack1);
    expect(p.pack10 / 10).toBeLessThan(p.pack3 / 3);
  });

  it('PACK_DISCOUNT keys match declared PackSize values', () => {
    for (const key of ['pack1', 'pack3', 'pack5', 'pack10', 'pack30'] as PackSize[]) {
      expect(PACK_DISCOUNT[key]).toBeGreaterThan(0);
      expect(PACK_DISCOUNT[key]).toBeLessThanOrEqual(1);
    }
  });
});

describe('cart → NYE line-item validation', () => {
  it('rejects empty carts', () => {
    expect(validateLineItems([])).toEqual({ ok: false, error: 'empty_cart' });
  });

  it('rejects line items with a missing SKU (CLAUDE.md hard rule)', () => {
    expect(
      validateLineItems([{ sku: '', quantity: 1, packSize: 'pack1' }]),
    ).toEqual({ ok: false, error: 'missing_sku' });
  });

  it('rejects non-integer or zero quantities', () => {
    expect(
      validateLineItems([{ sku: 'A', quantity: 0, packSize: 'pack1' }]),
    ).toEqual({ ok: false, error: 'invalid_quantity' });
    expect(
      validateLineItems([{ sku: 'A', quantity: 1.5 as unknown as number, packSize: 'pack1' }]),
    ).toEqual({ ok: false, error: 'invalid_quantity' });
  });

  it('rejects unknown pack sizes', () => {
    expect(
      validateLineItems([{ sku: 'A', quantity: 1, packSize: 'pack99' as PackSize }]),
    ).toEqual({ ok: false, error: 'invalid_pack_size' });
  });

  it('accepts a well-formed cart', () => {
    expect(
      validateLineItems([
        { sku: 'A', quantity: 2, packSize: 'pack1' },
        { sku: 'B', quantity: 1, packSize: 'pack5' },
      ]),
    ).toEqual({ ok: true });
  });
});
