/**
 * Canonical shape for items stored in orders.line_items_snapshot.
 * All producers MUST write this shape. All consumers MUST read these field names.
 */
export interface LineItemSnapshot {
  sku: string;
  slug: string;
  product_name: string;
  brand: string;
  image_url: string;
  pack_label: string;
  unit_price: number;
  quantity: number;
}
