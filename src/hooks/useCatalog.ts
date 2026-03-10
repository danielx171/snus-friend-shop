import { useQuery } from '@tanstack/react-query';
import { fetchShopifyProducts, fetchShopifyProductByHandle, type ShopifyProduct } from '@/lib/shopify';
import type { Product } from '@/data/products';

/** Map a Shopify product to the frontend Product shape for backward compatibility. */
function toProduct(sp: ShopifyProduct): Product {
  const price = sp.price;

  return {
    id: sp.handle, // use handle as the ID for URL routing
    name: sp.title,
    brand: '', // Shopify doesn't expose brand in basic storefront query
    categoryKey: 'nicotinePouches',
    flavorKey: 'mint', // default; could be parsed from tags/metafields later
    strengthKey: 'normal',
    formatKey: 'slim',
    nicotineContent: 0,
    portionsPerCan: 0,
    descriptionKey: sp.description,
    image: sp.imageUrl,
    ratings: 0,
    badgeKeys: [],
    prices: {
      pack1: price,
      pack3: price * 3 * 0.95,
      pack5: price * 5 * 0.9,
      pack10: price * 10 * 0.85,
      pack30: price * 30 * 0.8,
    },
    manufacturer: '',
  };
}

export function useCatalogProducts() {
  return useQuery({
    queryKey: ['catalog-products'],
    queryFn: async (): Promise<Product[]> => {
      const shopifyProducts = await fetchShopifyProducts(20);
      return shopifyProducts.map(toProduct);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['catalog-product', id],
    queryFn: async (): Promise<Product | undefined> => {
      if (!id) return undefined;
      const sp = await fetchShopifyProductByHandle(id);
      return sp ? toProduct(sp) : undefined;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
