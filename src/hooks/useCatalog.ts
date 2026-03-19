import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product as MockProduct } from '@/data/products';
import type { DbProduct } from '@/integrations/supabase/types';

export type { DbProduct };

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
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku)')
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
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku)')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (data) return toProduct(data as unknown as DbProduct);

      // Fallback: try slug
      const { data: slugData, error: slugError } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku)')
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
