import { CartItem } from '@/context/CartContext';
import type { MarketConfig } from '@/lib/market';

export interface CartDeliveryOption {
  id?: string;
  /** Shipping price expressed in GBP-equivalent */
  priceGBP: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  finalTotal: number;
  freeShipping: boolean;
  /** Free-shipping progress from 0–100 based on local currency subtotal */
  progress: number;
}

export function getCartTotals(
  items: CartItem[],
  market: MarketConfig,
  deliveryOption?: CartDeliveryOption | null,
  discountCode?: string | null,
): CartTotals {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.prices[item.packSize];
    return sum + price * item.quantity;
  }, 0);

  const localSubtotal = subtotal * market.rateFromGBP;
  const freeShipping = localSubtotal >= market.freeShippingThreshold;

  const baseShippingGBP = deliveryOption
    ? deliveryOption.priceGBP
    : market.shippingCost / market.rateFromGBP;

  const shipping =
    freeShipping && (!deliveryOption || deliveryOption.id === 'standard')
      ? 0
      : baseShippingGBP;

  let discount = 0;
  if (discountCode && discountCode.toUpperCase() === 'WELCOME10') {
    discount = subtotal * 0.1;
  }

  const finalTotal = subtotal - discount + shipping;

  const progress =
    market.freeShippingThreshold > 0
      ? Math.min(100, (localSubtotal / market.freeShippingThreshold) * 100)
      : 100;

  return {
    subtotal,
    discount,
    shipping,
    finalTotal,
    freeShipping,
    progress,
  };
}

