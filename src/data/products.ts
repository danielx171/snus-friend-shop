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
export type CategoryKey = 'nicotinePouches';

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

export const products: Product[] = [
  {
    id: '1',
    name: 'Cool Mint Slim',
    brand: 'ZYN',
    categoryKey: 'nicotinePouches',
    flavorKey: 'mint',
    strengthKey: 'strong',
    formatKey: 'slim',
    nicotineContent: 9.6,
    portionsPerCan: 20,
    descriptionKey: 'product.zyn.coolMint.description',
    image: flavorImages['mint'],
    ratings: 342,
    badgeKeys: ['newPrice', 'popular'],
    prices: { pack1: 59, pack3: 169, pack5: 265, pack10: 499, pack30: 1399 },
    manufacturer: 'Swedish Match',
  },
  {
    id: '2',
    name: 'Ice Cool Strong',
    brand: 'VELO',
    categoryKey: 'nicotinePouches',
    flavorKey: 'mint',
    strengthKey: 'extraStrong',
    formatKey: 'slim',
    nicotineContent: 14,
    portionsPerCan: 20,
    descriptionKey: 'product.velo.iceCool.description',
    image: flavorImages['mint'],
    ratings: 256,
    badgeKeys: ['new'],
    prices: { pack1: 55, pack3: 159, pack5: 249, pack10: 469, pack30: 1299 },
    manufacturer: 'British American Tobacco',
  },
  {
    id: '3',
    name: 'Citrus Burst',
    brand: 'ON!',
    categoryKey: 'nicotinePouches',
    flavorKey: 'citrus',
    strengthKey: 'normal',
    formatKey: 'mini',
    nicotineContent: 6,
    portionsPerCan: 20,
    descriptionKey: 'product.on.citrusBurst.description',
    image: flavorImages['citrus'],
    ratings: 189,
    badgeKeys: ['newPrice'],
    prices: { pack1: 49, pack3: 139, pack5: 219, pack10: 419, pack30: 1199 },
    manufacturer: 'Altria',
  },
  {
    id: '4',
    name: 'Berry Frost',
    brand: 'LOOP',
    categoryKey: 'nicotinePouches',
    flavorKey: 'berry',
    strengthKey: 'strong',
    formatKey: 'slim',
    nicotineContent: 9.4,
    portionsPerCan: 22,
    descriptionKey: 'product.loop.berryFrost.description',
    image: flavorImages['berry'],
    ratings: 412,
    badgeKeys: ['popular'],
    prices: { pack1: 52, pack3: 149, pack5: 235, pack10: 449, pack30: 1249 },
    manufacturer: 'Another Snus Factory',
  },
  {
    id: '5',
    name: 'Super Strong Mint',
    brand: 'Siberia',
    categoryKey: 'nicotinePouches',
    flavorKey: 'mint',
    strengthKey: 'ultraStrong',
    formatKey: 'large',
    nicotineContent: 43,
    portionsPerCan: 20,
    descriptionKey: 'product.siberia.superStrong.description',
    image: flavorImages['mint'],
    ratings: 567,
    badgeKeys: ['limited'],
    prices: { pack1: 69, pack3: 195, pack5: 299, pack10: 559, pack30: 1549 },
    manufacturer: 'GN Tobacco',
  },
  {
    id: '6',
    name: 'Fresh Spearmint',
    brand: 'Lyft',
    categoryKey: 'nicotinePouches',
    flavorKey: 'mint',
    strengthKey: 'normal',
    formatKey: 'slim',
    nicotineContent: 8,
    portionsPerCan: 24,
    descriptionKey: 'product.lyft.freshSpearmint.description',
    image: flavorImages['mint'],
    ratings: 298,
    badgeKeys: ['newPrice'],
    prices: { pack1: 54, pack3: 155, pack5: 245, pack10: 465, pack30: 1295 },
    manufacturer: 'British American Tobacco',
  },
  {
    id: '7',
    name: 'Tropical Thunder',
    brand: 'Nordic Spirit',
    categoryKey: 'nicotinePouches',
    flavorKey: 'tropical',
    strengthKey: 'strong',
    formatKey: 'slim',
    nicotineContent: 11,
    portionsPerCan: 20,
    descriptionKey: 'product.nordicSpirit.tropicalThunder.description',
    image: flavorImages['tropical'],
    ratings: 178,
    badgeKeys: ['new', 'newPrice'],
    prices: { pack1: 56, pack3: 162, pack5: 255, pack10: 485, pack30: 1349 },
    manufacturer: 'JTI',
  },
  {
    id: '8',
    name: 'Dark Roast Coffee',
    brand: 'Skruf',
    categoryKey: 'nicotinePouches',
    flavorKey: 'coffee',
    strengthKey: 'extraStrong',
    formatKey: 'original',
    nicotineContent: 17,
    portionsPerCan: 18,
    descriptionKey: 'product.skruf.darkRoast.description',
    image: flavorImages['coffee'],
    ratings: 145,
    badgeKeys: [],
    prices: { pack1: 58, pack3: 165, pack5: 259, pack10: 495, pack30: 1379 },
    manufacturer: 'Imperial Brands',
  },
  {
    id: '9',
    name: 'Fresh Cola',
    brand: 'Pablo',
    categoryKey: 'nicotinePouches',
    flavorKey: 'cola',
    strengthKey: 'ultraStrong',
    formatKey: 'large',
    nicotineContent: 50,
    portionsPerCan: 20,
    descriptionKey: 'product.pablo.freshCola.description',
    image: flavorImages['cola'],
    ratings: 423,
    badgeKeys: ['popular', 'limited'],
    prices: { pack1: 72, pack3: 205, pack5: 319, pack10: 599, pack30: 1649 },
    manufacturer: 'NGP Empire',
  },
  {
    id: '10',
    name: 'Sweet Vanilla',
    brand: 'Killa',
    categoryKey: 'nicotinePouches',
    flavorKey: 'vanilla',
    strengthKey: 'strong',
    formatKey: 'slim',
    nicotineContent: 16,
    portionsPerCan: 20,
    descriptionKey: 'product.killa.sweetVanilla.description',
    image: flavorImages['vanilla'],
    ratings: 234,
    badgeKeys: ['new'],
    prices: { pack1: 62, pack3: 175, pack5: 275, pack10: 519, pack30: 1449 },
    manufacturer: 'NGP Empire',
  },
  {
    id: '11',
    name: 'Black Licorice',
    brand: 'ZYN',
    categoryKey: 'nicotinePouches',
    flavorKey: 'licorice',
    strengthKey: 'normal',
    formatKey: 'slim',
    nicotineContent: 6,
    portionsPerCan: 20,
    descriptionKey: 'product.zyn.blackLicorice.description',
    image: flavorImages['licorice'],
    ratings: 312,
    badgeKeys: ['newPrice'],
    prices: { pack1: 59, pack3: 169, pack5: 265, pack10: 499, pack30: 1399 },
    manufacturer: 'Swedish Match',
  },
  {
    id: '12',
    name: 'Frozen Berries',
    brand: 'VELO',
    categoryKey: 'nicotinePouches',
    flavorKey: 'berry',
    strengthKey: 'extraStrong',
    formatKey: 'slim',
    nicotineContent: 14,
    portionsPerCan: 20,
    descriptionKey: 'product.velo.frozenBerries.description',
    image: flavorImages['berry'],
    ratings: 278,
    badgeKeys: ['new', 'popular'],
    prices: { pack1: 55, pack3: 159, pack5: 249, pack10: 469, pack30: 1299 },
    manufacturer: 'British American Tobacco',
  },
];
