import { describe, expect, it } from 'vitest';
import {
  applyServerPricesToSnapshot,
  computeServerOrderTotal,
} from '../../supabase/functions/_shared/order-total';

describe('computeServerOrderTotal', () => {
  it('sums server-priced line items in cents so pending orders persist a non-null total', () => {
    expect(
      computeServerOrderTotal([
        { quantity: 1, serverPrice: 3.5 },
        { quantity: 2, serverPrice: 4.995 },
      ]),
    ).toBe(13.5);
  });

  it('returns zero for an empty priced item list', () => {
    expect(computeServerOrderTotal([])).toBe(0);
  });

  it('overwrites snapshot unit prices with server-priced values before persisting orders', () => {
    expect(
      applyServerPricesToSnapshot(
        [
          { sku: 'stng16', quantity: 1, unit_price: 3.5, product_name: 'STNG Berry Seltzer MAX' },
        ],
        [{ quantity: 1, serverPrice: 0.99 }],
      ),
    ).toEqual([
      { sku: 'stng16', quantity: 1, unit_price: 0.99, product_name: 'STNG Berry Seltzer MAX' },
    ]);
  });
});
