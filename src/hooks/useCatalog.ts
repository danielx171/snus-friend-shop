import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { products as mockProducts, type Product as MockProduct } from '@/data/products';

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
  product_variants: { pack_size: number; price: number; sku: string | null }[];
}

/** Convert DB product row to the frontend Product shape (backward compatible). */
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

      if (error || !data || data.length === 0) {
        // Fall back to mock data
        console.log('Using mock product data (DB empty or error):', error?.message);
        return mockProducts;
      }

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

      if (data) {
        return toProduct(data as unknown as DbProduct);
      }

      // Fallback: try slug
      const { data: slugData } = await supabase
        .from('products')
        .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku)')
        .eq('slug', id)
        .maybeSingle();

      if (slugData) {
        return toProduct(slugData as unknown as DbProduct);
      }

      // Final fallback: mock
      return mockProducts.find(p => p.id === id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
