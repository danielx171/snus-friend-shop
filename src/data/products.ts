import productPlaceholder from '@/assets/product-placeholder.jpg';
import productDark from '@/assets/product-dark.jpg';
import productBerry from '@/assets/product-berry.jpg';
import productCitrus from '@/assets/product-citrus.jpg';

// Language-agnostic flavor keys mapped to images
const flavorImages: Record<string, string> = {
  'mint': productPlaceholder,
  'fruit': productCitrus,
  'berry': productBerry,
  'citrus': productCitrus,
  'licorice': productDark,
  'coffee': productDark,
  'cola': productDark,
  'vanilla': productBerry,
  'tropical': productCitrus,
};

// Stable enum keys for translation (language-agnostic)
export type FlavorKey = 'mint' | 'fruit' | 'berry' | 'citrus' | 'licorice' | 'coffee' | 'cola' | 'vanilla' | 'tropical';
export type StrengthKey = 'normal' | 'strong' | 'extraStrong' | 'ultraStrong';
export type FormatKey = 'slim' | 'mini' | 'original' | 'large';
export type BadgeKey = 'newPrice' | 'new' | 'popular' | 'limited';
export type CategoryKey = 'nicotinePouches' | 'nicotineFree' | 'energyPouches';

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryKey: CategoryKey;
  flavorKey: FlavorKey;
  strengthKey: StrengthKey;
  formatKey: FormatKey;
  nicotineContent: number; // mg per portion
  portionsPerCan: number;
  descriptionKey: string; // Translation key for description
  description?: string;   // Real product description text from Nyehandel (takes priority over descriptionKey)
  comparePrice?: number;  // Retail MSRP/compare price per can (for strikethrough display)
  stock?: number;         // Total units in stock (0 = out of stock, undefined = unknown)
  image: string;
  ratings: number;
  badgeKeys: BadgeKey[];
  prices: {
    pack1: number;
    pack3: number;
    pack5: number;
    pack10: number;
    pack30: number;
  };
  manufacturer: string;
}

export type PackSize = 'pack1' | 'pack3' | 'pack5' | 'pack10' | 'pack30';

export const packSizeMultipliers: Record<PackSize, number> = {
  pack1: 1,
  pack3: 3,
  pack5: 5,
  pack10: 10,
  pack30: 30,
};

/** Standard retail pack sizes shown to customers */
export const RETAIL_PACK_SIZES: PackSize[] = ['pack1', 'pack3', 'pack5', 'pack10'];

export const brands = [
  'ZYN',
  'VELO',
  'ON!',
  'Skruf',
  'LOOP',
  'Lyft',
  'Nordic Spirit',
  'Siberia',
  'Pablo',
  'Killa',
];

// Language-agnostic flavor keys for filter UI
export const flavorKeys: FlavorKey[] = [
  'mint',
  'fruit',
  'berry',
  'citrus',
  'licorice',
  'coffee',
  'cola',
  'vanilla',
  'tropical',
];

export const strengthKeys: StrengthKey[] = ['normal', 'strong', 'extraStrong', 'ultraStrong'];
export const formatKeys: FormatKey[] = ['slim', 'mini', 'original', 'large'];

// Mock products array removed — all product data now comes from Supabase via useCatalogProducts().
