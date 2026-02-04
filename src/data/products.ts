import productPlaceholder from '@/assets/product-placeholder.jpg';
import productDark from '@/assets/product-dark.jpg';
import productBerry from '@/assets/product-berry.jpg';
import productCitrus from '@/assets/product-citrus.jpg';

// Map flavors to images
const flavorImages: Record<string, string> = {
  'Mint': productPlaceholder,
  'Frukt': productCitrus,
  'Bär': productBerry,
  'Citrus': productCitrus,
  'Lakrits': productDark,
  'Kaffe': productDark,
  'Cola': productDark,
  'Vanilj': productBerry,
  'Tropisk': productCitrus,
};

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  flavor: string;
  strength: 'Normal' | 'Stark' | 'Extra Stark' | 'Ultra Stark';
  format: 'Slim' | 'Mini' | 'Original' | 'Large';
  nicotineContent: number; // mg per portion
  portionsPerCan: number;
  description: string;
  image: string;
  ratings: number;
  badges: ('Nytt pris' | 'Nyhet' | 'Populär' | 'Begränsat')[];
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

export const packSizeLabels: Record<PackSize, string> = {
  pack1: '1-pack',
  pack3: '3-pack',
  pack5: '5-pack',
  pack10: '10-pack',
  pack30: '30-pack',
};

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

export const flavors = [
  'Mint',
  'Frukt',
  'Bär',
  'Citrus',
  'Lakrits',
  'Kaffe',
  'Cola',
  'Vanilj',
  'Tropisk',
];

export const strengths: Product['strength'][] = ['Normal', 'Stark', 'Extra Stark', 'Ultra Stark'];
export const formats: Product['format'][] = ['Slim', 'Mini', 'Original', 'Large'];

export const products: Product[] = [
  {
    id: '1',
    name: 'Cool Mint Slim',
    brand: 'ZYN',
    category: 'Nikotinpåsar',
    flavor: 'Mint',
    strength: 'Stark',
    format: 'Slim',
    nicotineContent: 9.6,
    portionsPerCan: 20,
    description: 'ZYN Cool Mint Slim ger en frisk och kylande mintsmak med en bekväm passform. Perfekt för den som söker en diskret och smidig upplevelse med lagom styrka.',
    image: flavorImages['Mint'],
    ratings: 342,
    badges: ['Nytt pris', 'Populär'],
    prices: { pack1: 59, pack3: 169, pack5: 265, pack10: 499, pack30: 1399 },
    manufacturer: 'Swedish Match',
  },
  {
    id: '2',
    name: 'Ice Cool Strong',
    brand: 'VELO',
    category: 'Nikotinpåsar',
    flavor: 'Mint',
    strength: 'Extra Stark',
    format: 'Slim',
    nicotineContent: 14,
    portionsPerCan: 20,
    description: 'VELO Ice Cool Strong levererar en intensiv kylande känsla med kraftfull nikotinleverans. Idealisk för erfarna användare som vill ha mer.',
    image: flavorImages['Mint'],
    ratings: 256,
    badges: ['Nyhet'],
    prices: { pack1: 55, pack3: 159, pack5: 249, pack10: 469, pack30: 1299 },
    manufacturer: 'British American Tobacco',
  },
  {
    id: '3',
    name: 'Citrus Burst',
    brand: 'ON!',
    category: 'Nikotinpåsar',
    flavor: 'Citrus',
    strength: 'Normal',
    format: 'Mini',
    nicotineContent: 6,
    portionsPerCan: 20,
    description: 'ON! Citrus Burst erbjuder en uppfriskande citrussmak i ett diskret miniformat. Perfekt för nybörjare eller de som föredrar en mildare upplevelse.',
    image: flavorImages['Citrus'],
    ratings: 189,
    badges: ['Nytt pris'],
    prices: { pack1: 49, pack3: 139, pack5: 219, pack10: 419, pack30: 1199 },
    manufacturer: 'Altria',
  },
  {
    id: '4',
    name: 'Berry Frost',
    brand: 'LOOP',
    category: 'Nikotinpåsar',
    flavor: 'Bär',
    strength: 'Stark',
    format: 'Slim',
    nicotineContent: 9.4,
    portionsPerCan: 22,
    description: 'LOOP Berry Frost kombinerar söta bärsmaker med en svalkande finish. Mjuk passform och långvarig smak.',
    image: flavorImages['Bär'],
    ratings: 412,
    badges: ['Populär'],
    prices: { pack1: 52, pack3: 149, pack5: 235, pack10: 449, pack30: 1249 },
    manufacturer: 'Another Snus Factory',
  },
  {
    id: '5',
    name: 'Super Strong Mint',
    brand: 'Siberia',
    category: 'Nikotinpåsar',
    flavor: 'Mint',
    strength: 'Ultra Stark',
    format: 'Large',
    nicotineContent: 43,
    portionsPerCan: 20,
    description: 'Siberia Super Strong Mint är för den som söker maximal styrka. Extremt starkt nikotininnehåll med intensiv mintsmak. Endast för erfarna användare.',
    image: flavorImages['Mint'],
    ratings: 567,
    badges: ['Begränsat'],
    prices: { pack1: 69, pack3: 195, pack5: 299, pack10: 559, pack30: 1549 },
    manufacturer: 'GN Tobacco',
  },
  {
    id: '6',
    name: 'Fresh Spearmint',
    brand: 'Lyft',
    category: 'Nikotinpåsar',
    flavor: 'Mint',
    strength: 'Normal',
    format: 'Slim',
    nicotineContent: 8,
    portionsPerCan: 24,
    description: 'Lyft Fresh Spearmint ger en klassisk spearmintsmak med bekväm slim-passform. Bra val för daglig användning.',
    image: flavorImages['Mint'],
    ratings: 298,
    badges: ['Nytt pris'],
    prices: { pack1: 54, pack3: 155, pack5: 245, pack10: 465, pack30: 1295 },
    manufacturer: 'British American Tobacco',
  },
  {
    id: '7',
    name: 'Tropical Thunder',
    brand: 'Nordic Spirit',
    category: 'Nikotinpåsar',
    flavor: 'Tropisk',
    strength: 'Stark',
    format: 'Slim',
    nicotineContent: 11,
    portionsPerCan: 20,
    description: 'Nordic Spirit Tropical Thunder tar dig till exotiska stränder med sin tropiska fruktsmak. Stark och uppfriskande.',
    image: flavorImages['Tropisk'],
    ratings: 178,
    badges: ['Nyhet', 'Nytt pris'],
    prices: { pack1: 56, pack3: 162, pack5: 255, pack10: 485, pack30: 1349 },
    manufacturer: 'JTI',
  },
  {
    id: '8',
    name: 'Dark Roast Coffee',
    brand: 'Skruf',
    category: 'Nikotinpåsar',
    flavor: 'Kaffe',
    strength: 'Extra Stark',
    format: 'Original',
    nicotineContent: 17,
    portionsPerCan: 18,
    description: 'Skruf Dark Roast Coffee ger en autentisk kaffeupplevelse med rökiga undertoner. För dig som älskar kaffe och vill ha en starkare upplevelse.',
    image: flavorImages['Kaffe'],
    ratings: 145,
    badges: [],
    prices: { pack1: 58, pack3: 165, pack5: 259, pack10: 495, pack30: 1379 },
    manufacturer: 'Imperial Brands',
  },
  {
    id: '9',
    name: 'Fresh Cola',
    brand: 'Pablo',
    category: 'Nikotinpåsar',
    flavor: 'Cola',
    strength: 'Ultra Stark',
    format: 'Large',
    nicotineContent: 50,
    portionsPerCan: 20,
    description: 'Pablo Fresh Cola kombinerar nostalgisk colasmak med extrem styrka. En av marknadens starkaste nikotinpåsar. Endast för mycket erfarna användare.',
    image: flavorImages['Cola'],
    ratings: 423,
    badges: ['Populär', 'Begränsat'],
    prices: { pack1: 72, pack3: 205, pack5: 319, pack10: 599, pack30: 1649 },
    manufacturer: 'NGP Empire',
  },
  {
    id: '10',
    name: 'Sweet Vanilla',
    brand: 'Killa',
    category: 'Nikotinpåsar',
    flavor: 'Vanilj',
    strength: 'Stark',
    format: 'Slim',
    nicotineContent: 16,
    portionsPerCan: 20,
    description: 'Killa Sweet Vanilla erbjuder en krämig vaniljsmak med stark nikotinleverans. Söt och tillfredsställande.',
    image: flavorImages['Vanilj'],
    ratings: 234,
    badges: ['Nyhet'],
    prices: { pack1: 62, pack3: 175, pack5: 275, pack10: 519, pack30: 1449 },
    manufacturer: 'NGP Empire',
  },
  {
    id: '11',
    name: 'Black Licorice',
    brand: 'ZYN',
    category: 'Nikotinpåsar',
    flavor: 'Lakrits',
    strength: 'Normal',
    format: 'Slim',
    nicotineContent: 6,
    portionsPerCan: 20,
    description: 'ZYN Black Licorice ger en klassisk svensk lakritsmak med mild nikotinstyrka. Traditionell smak i modernt format.',
    image: flavorImages['Lakrits'],
    ratings: 312,
    badges: ['Nytt pris'],
    prices: { pack1: 59, pack3: 169, pack5: 265, pack10: 499, pack30: 1399 },
    manufacturer: 'Swedish Match',
  },
  {
    id: '12',
    name: 'Frozen Berries',
    brand: 'VELO',
    category: 'Nikotinpåsar',
    flavor: 'Bär',
    strength: 'Extra Stark',
    format: 'Slim',
    nicotineContent: 14,
    portionsPerCan: 20,
    description: 'VELO Frozen Berries kombinerar iskalla bärsmaker med kraftfull styrka. Fräsch och intensiv upplevelse.',
    image: flavorImages['Bär'],
    ratings: 278,
    badges: ['Nyhet', 'Populär'],
    prices: { pack1: 55, pack3: 159, pack5: 249, pack10: 469, pack30: 1299 },
    manufacturer: 'British American Tobacco',
  },
];
