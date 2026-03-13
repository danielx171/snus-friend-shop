import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product as MockProduct } from '@/data/products';

export interface DbProduct {
  id: string;
  brand_id: string;
  slug: string;
  name: string;
  description_key: string | null;
  category_key: string;
  flavor_key: string;
  strength_key: string;
  format_key: string;
  nicotine_mg: number;
  portions_per_can: number;
  image_url: string | null;
  ratings: number;
  badge_keys: string[];
  manufacturer: string | null;
  is_active: boolean;
  nyehandel_id: string | null;
  created_at: string;
  updated_at: string;
  brands: { id: string; slug: string; name: string; manufacturer: string | null } | null;
  product_variants: { pack_size: number; price: number; sku: string | null; shopify_variant_id: string | null }[];
}

/** Convert DB product row to the frontend Product shape. */
function toProduct(row: DbProduct): MockProduct {
  const pricesMap: Record<string, number> = {};
  const shopifyVariantIds: Partial<Record<string, string>> = {};

  for (const v of row.product_variants ?? []) {
    pricesMap[`pack${v.pack_size}`] = Number(v.price);
    if (v.shopify_variant_id) {
      shopifyVariantIds[`pack${v.pack_size}`] = v.shopify_variant_id;
    }
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
    shopifyVariantIds: Object.keys(shopifyVariantIds).length > 0 ? shopifyVariantIds : undefined,
  };
}

export function useCatalogProducts() {
  return useQuery({
    queryKey: ['catalog-products'],
    queryFn: async (): Promise<MockProduct[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, shopify_variant_id)')
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
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, shopify_variant_id)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (data) return toProduct(data as unknown as DbProduct);

      // Fallback: try slug
      const { data: slugData, error: slugError } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, shopify_variant_id)')
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
