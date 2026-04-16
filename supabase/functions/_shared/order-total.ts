export interface PricedOrderItem {
  quantity: number;
  serverPrice: number;
}

export function computeServerOrderTotal(items: PricedOrderItem[]): number {
  const totalCents = items.reduce(
    (sum, item) => sum + Math.round(item.serverPrice * 100) * item.quantity,
    0,
  );

  return totalCents / 100;
}

export function applyServerPricesToSnapshot<T extends { unit_price?: number }>(
  snapshotItems: T[],
  pricedItems: PricedOrderItem[],
): T[] {
  return snapshotItems.map((item, index) => ({
    ...item,
    unit_price: pricedItems[index]?.serverPrice ?? item.unit_price,
  }));
}
