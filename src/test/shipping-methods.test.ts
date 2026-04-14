import { describe, expect, it } from 'vitest';
import { getShippingMethodsForCountry } from '@/lib/shipping';

describe('shipping methods', () => {
  it('returns the regional fallback methods when no live availability is provided', () => {
    const methods = getShippingMethodsForCountry('SE');
    expect(methods.map((method) => method.id)).toEqual(['ups-standard', 'ups-express']);
  });

  it('intersects local display metadata with the live Nyehandel method names', () => {
    const methods = getShippingMethodsForCountry('DE', ['DHL Express EU']);
    expect(methods.map((method) => method.id)).toEqual(['dhl-express-eu']);
  });

  it('falls back to the regional defaults when the live method list is empty or mismatched', () => {
    const methods = getShippingMethodsForCountry('CH', ['UPS Standard (J229F1)']);
    expect(methods.map((method) => method.id)).toEqual(['dhl-economy-intl', 'dhl-express-intl']);
  });
});
