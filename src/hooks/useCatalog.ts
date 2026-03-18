import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product as MockProduct } from '@/data/products';
import type { DbProduct } from '@/integrations/supabase/types';

export type { DbProduct };

/** Convert DB product row to the frontend Product shape. */
function toProduct(row: DbProduct): MockProduct {
  const pricesMap: Record<string, number> = {};

  for (const v of row.product_variants ?? []) {
    pricesMap[`pack${v.pack_size}`] = Number(v.price);
  }

  return {
    id: row.id,
    name: row.name,
    brand: row.brands?.name ?? '',
    categoryKey: (row.category_key as MockProduct['categoryKey']) ?? 'nicotinePouches',
    flavorKey: row.flavor_key as MockProduct['flavorKey'],
    strengthKey: row.strength_key as MockProduct['strengthKey'],
    formatKey: row.format_key as MockProduct['formatKey'],
    nicotineContent: Number(row.nicotine_mg),
    portionsPerCan: row.portions_per_can,
    descriptionKey: row.description_key ?? '',
    image: row.image_url ?? '',
    ratings: row.ratings,
    badgeKeys: (row.badge_keys ?? []) as MockProduct['badgeKeys'],
    prices: {
      pack1: pricesMap['pack1'] ?? 0,
      pack3: pricesMap['pack3'] ?? 0,
      pack5: pricesMap['pack5'] ?? 0,
      pack10: pricesMap['pack10'] ?? 0,
      pack30: pricesMap['pack30'] ?? 0,
    },
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
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (data) return toProduct(data as unknown as DbProduct);

      // Fallback: try slug
      const { data: slugData, error: slugError } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku)')
        .eq('slug', id)
        .maybeSingle();

      if (slugError) throw new Error(slugError.message);
      if (slugData) return toProduct(slugData as unknown as DbProduct);

      return undefined;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
