import { expandImageUrl } from '@/lib/image-cdn';

export interface SlimProductCardData {
  slug: string;
  name: string;
  brand: string;
  brandSlug?: string;
  imageUrl?: string;
  prices?: {
    pack1?: number;
  };
  nicotineContent?: number;
  strengthKey?: string;
  flavorKey?: string;
  formatKey?: string;
  ratings?: number;
  stock?: number;
  portionsPerCan?: number;
  badgeKeys?: string[];
}

const hydrateSlimProducts = (products: SlimProductCardData[]) =>
  products.map((product) => ({
    ...product,
    imageUrl: expandImageUrl(product.imageUrl),
  }));

export const parseSlimProducts = (productsJson: string) => {
  const parsed = JSON.parse(productsJson) as SlimProductCardData[];
  return hydrateSlimProducts(parsed);
};

export const fetchSlimProducts = async (productsJsonUrl: string) => {
  const response = await fetch(productsJsonUrl);
  if (!response.ok) {
    throw new Error(`Failed to load ${productsJsonUrl}: ${response.status}`);
  }

  const parsed = (await response.json()) as SlimProductCardData[];
  return hydrateSlimProducts(parsed);
};
