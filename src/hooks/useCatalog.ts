import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product as MockProduct } from '@/data/products';

/** Shape returned by the joined products query (not in generated types). */
export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  category_key: string;
  flavor_key: string;
  format_key: string;
  strength_key: string;
  nicotine_mg: number;
  portions_per_can: number;
  description_key: string | null;
  description?: string | null;
  compare_price?: number | null;
  image_url: string | null;
  is_active: boolean;
  manufacturer: string | null;
  ratings: number;
  badge_keys: string[];
  brands?: { id: string; slug: string; name: string; manufacturer: string | null } | null;
  product_variants?: Array<{
    pack_size: number;
    price: number;
    sku: string | null;
    inventory?: Array<{ quantity: number }>;
  }>;
}

/**
 * Retail markup on wholesale (Nyehandel) price.
 * Wholesale ~€3.29/can → retail ~€5.10/can at 1.55×.
 * Adjust this to change the margin. Set to 1.0 to sell at wholesale.
 */
const RETAIL_MARKUP = 1.55;

/**
 * Volume discount multipliers per can.
 * pack1 = full price, pack3 = 5% off per can, etc.
 * Adjust these to change the volume discount tiers.
 */
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

/** Derive strength from nicotine mg for display.
 *  Thresholds chosen to give good variety across 734+ products:
 *  Normal ≤6, Strong ≤10, Extra Strong ≤16, Ultra Strong >16.
 *  Keep in sync with sync-nyehandel/index.ts.
 */
function deriveStrengthKey(mgPerPouch: number): MockProduct['strengthKey'] {
  if (mgPerPouch <= 6) return 'normal';
  if (mgPerPouch <= 10) return 'strong';
  if (mgPerPouch <= 16) return 'extraStrong';
  return 'ultraStrong';
}

/** Convert DB product row to the frontend Product shape. */
function toProduct(row: DbProduct): MockProduct {
  // Find the base per-can price from pack_size=1 variant (or first variant)
  // Apply retail markup — Nyehandel prices are wholesale
  const variants = row.product_variants ?? [];
  const baseVariant = variants.find((v) => v.pack_size === 1) ?? variants[0];
  const wholesalePrice = baseVariant ? Number(baseVariant.price) : 0;
  const basePricePerCan = +(wholesalePrice * RETAIL_MARKUP).toFixed(2);

  // Compute pack prices: quantity × per-can price × discount
  const prices = {
    pack1: Math.round(basePricePerCan * PACK_QUANTITIES.pack1 * PACK_DISCOUNT.pack1 * 100) / 100,
    pack3: Math.round(basePricePerCan * PACK_QUANTITIES.pack3 * PACK_DISCOUNT.pack3 * 100) / 100,
    pack5: Math.round(basePricePerCan * PACK_QUANTITIES.pack5 * PACK_DISCOUNT.pack5 * 100) / 100,
    pack10: Math.round(basePricePerCan * PACK_QUANTITIES.pack10 * PACK_DISCOUNT.pack10 * 100) / 100,
    pack30: Math.round(basePricePerCan * PACK_QUANTITIES.pack30 * PACK_DISCOUNT.pack30 * 100) / 100,
  };

  // Apply retail markup to compare/MSRP price so it's ready for display
  const comparePrice = row.compare_price
    ? +(Number(row.compare_price) * RETAIL_MARKUP).toFixed(2)
    : undefined;

  // Sum stock across variants. Only count variants that have an actual inventory row.
  // If no inventory rows exist at all → undefined (unknown). Only 0 when rows exist but qty is 0.
  const knownQtys = variants
    .map(v => {
      const inv = v.inventory;
      // Supabase returns an array for plural relations, but a single object for 1:1
      if (Array.isArray(inv) && inv.length > 0) return inv[0].quantity;
      if (inv && typeof inv === 'object' && 'quantity' in inv) return (inv as { quantity: number }).quantity;
      return null;
    })
    .filter((q): q is number => q !== null);
  const stock: number | undefined = knownQtys.length > 0 ? knownQtys.reduce((a, b) => a + b, 0) : undefined;

  return {
    id: row.id,
    name: row.name,
    brand: row.brands?.name ?? '',
    categoryKey: (row.category_key as MockProduct['categoryKey']) ?? 'nicotinePouches',
    flavorKey: row.flavor_key as MockProduct['flavorKey'],
    strengthKey: deriveStrengthKey(Number(row.nicotine_mg)),
    formatKey: row.format_key as MockProduct['formatKey'],
    nicotineContent: Number(row.nicotine_mg),
    portionsPerCan: row.portions_per_can,
    descriptionKey: row.description_key ?? '',
    description: row.description ?? undefined,
    comparePrice,
    stock,
    image: row.image_url ?? '',
    ratings: row.ratings,
    badgeKeys: (row.badge_keys ?? []) as MockProduct['badgeKeys'],
    prices,
    manufacturer: row.manufacturer ?? row.brands?.manufacturer ?? '',
  };
}

export function useCatalogProducts() {
  return useQuery({
    queryKey: ['catalog-products'],
    queryFn: async (): Promise<MockProduct[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, inventory(quantity))')
        .eq('is_active', true)
        .order('name');

      if (error) throw new Error(error.message);
      if (!data) return [];

      return (data as unknown as DbProduct[]).map(toProduct);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['catalog-product', id],
    queryFn: async (): Promise<MockProduct | undefined> => {
      if (!id) return undefined;

      // Try UUID lookup first
      const { data, error } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, inventory(quantity))')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (data) return toProduct(data as unknown as DbProduct);

      // Fallback: try slug
      const { data: slugData, error: slugError } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, inventory(quantity))')
        .eq('slug', id)
        .eq('is_active', true)
        .maybeSingle();

      if (slugError) throw new Error(slugError.message);
      if (slugData) return toProduct(slugData as unknown as DbProduct);

      return undefined;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
