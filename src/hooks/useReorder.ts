import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import type { Product, PackSize } from '@/data/products';
import type { DbProduct } from '@/hooks/useCatalog';

interface LineItemSnapshot {
  sku: string;
  product_name: string;
  quantity: number;
  [key: string]: unknown;
}

function parseSnapshot(snapshot: unknown): LineItemSnapshot[] {
  if (!Array.isArray(snapshot)) return [];
  return snapshot.filter(
    (item): item is LineItemSnapshot =>
      item !== null &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).sku === 'string' &&
      typeof (item as Record<string, unknown>).quantity === 'number',
  );
}

const RETAIL_MARKUP = 1.55;
const PACK_DISCOUNT: Record<string, number> = {
  pack1: 1.0,
  pack3: 0.95,
  pack5: 0.90,
  pack10: 0.85,
  pack30: 0.80,
};
const PACK_QUANTITIES: Record<string, number> = {
  pack1: 1,
  pack3: 3,
  pack5: 5,
  pack10: 10,
  pack30: 30,
};

function dbRowToProduct(row: DbProduct): Product {
  const variants = row.product_variants ?? [];
  const baseVariant = variants.find((v) => v.pack_size === 1) ?? variants[0];
  const wholesalePrice = baseVariant ? Number(baseVariant.price) : 0;
  const basePricePerCan = +(wholesalePrice * RETAIL_MARKUP).toFixed(2);
  const prices = {
    pack1:  Math.round(basePricePerCan * PACK_QUANTITIES.pack1  * PACK_DISCOUNT.pack1  * 100) / 100,
    pack3:  Math.round(basePricePerCan * PACK_QUANTITIES.pack3  * PACK_DISCOUNT.pack3  * 100) / 100,
    pack5:  Math.round(basePricePerCan * PACK_QUANTITIES.pack5  * PACK_DISCOUNT.pack5  * 100) / 100,
    pack10: Math.round(basePricePerCan * PACK_QUANTITIES.pack10 * PACK_DISCOUNT.pack10 * 100) / 100,
    pack30: Math.round(basePricePerCan * PACK_QUANTITIES.pack30 * PACK_DISCOUNT.pack30 * 100) / 100,
  };
  const comparePrice = row.compare_price
    ? +(Number(row.compare_price) * RETAIL_MARKUP).toFixed(2)
    : undefined;
  return {
    id: row.id,
    name: row.name,
    brand: row.brands?.name ?? '',
    categoryKey: (row.category_key as Product['categoryKey']) ?? 'nicotinePouches',
    flavorKey: row.flavor_key as Product['flavorKey'],
    strengthKey: row.strength_key as Product['strengthKey'],
    formatKey: row.format_key as Product['formatKey'],
    nicotineContent: Number(row.nicotine_mg),
    portionsPerCan: row.portions_per_can,
    descriptionKey: row.description_key ?? '',
    description: row.description ?? undefined,
    comparePrice,
    image: row.image_url ?? '',
    ratings: row.ratings,
    badgeKeys: (row.badge_keys ?? []) as Product['badgeKeys'],
    prices,
    manufacturer: row.manufacturer ?? row.brands?.manufacturer ?? '',
  };
}

export interface ReorderResult {
  added: number;
  unavailable: number;
}

export function useReorder() {
  const { addToCart } = useCart();
  const [isReordering, setIsReordering] = useState(false);

  const reorder = useCallback(
    async (snapshot: unknown): Promise<ReorderResult> => {
      setIsReordering(true);
      try {
        const items = parseSnapshot(snapshot);
        if (items.length === 0) return { added: 0, unavailable: 0 };

        const skus = items.map((item) => item.sku).filter(Boolean);
        if (skus.length === 0) return { added: 0, unavailable: items.length };

        // Look up product rows via product_variants.sku
        const { data, error } = await supabase
          .from('product_variants')
          .select('sku, pack_size, price, product_id, products(*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku))')
          .in('sku', skus)
          .eq('products.is_active', true);

        if (error) {
          console.error('[useReorder] DB error:', error.message);
          return { added: 0, unavailable: items.length };
        }

        // Build a map: sku -> Product
        const skuToProduct = new Map<string, Product>();
        for (const row of data ?? []) {
          if (!row.sku || !row.products) continue;
          const productRow = row.products as unknown as DbProduct;
          if (!productRow.is_active) continue;
          try {
            const product = dbRowToProduct(productRow);
            skuToProduct.set(row.sku, product);
          } catch {
            // skip malformed rows
          }
        }

        let added = 0;
        let unavailable = 0;

        for (const item of items) {
          const product = skuToProduct.get(item.sku);
          if (!product) {
            unavailable++;
            continue;
          }
          // Use pack1 as the default pack size when reordering
          const packSize: PackSize = 'pack1';
          addToCart(product, packSize, item.quantity);
          added++;
        }

        return { added, unavailable };
      } finally {
        setIsReordering(false);
      }
    },
    [addToCart],
  );

  return { reorder, isReordering };
}
