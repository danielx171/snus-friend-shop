export interface CountryData {
  name: string;
  slug: string;
  code: string;
  flag: string;
  legalStatus: 'legal' | 'restricted' | 'banned';
  legalNote: string;
  ageLimit: number;
  shippingNote: string;
  popularBrands: string[];
  h1: string;
  metaDescription: string;
  intro: string;
}

export const countries: CountryData[] = [
  {
    name: 'Germany',
    slug: 'germany',
    code: 'DE',
    flag: '🇩🇪',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal in Germany. They are classified as consumer products, not tobacco, and are widely available online and in stores.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Germany from our EU warehouse. Standard delivery takes 3-5 business days. Free shipping on orders over €29.',
    popularBrands: ['zyn', 'velo', 'skruf', 'loop', 'nordic-spirit'],
    h1: 'Buy Nicotine Pouches in Germany',
    metaDescription: 'Buy nicotine pouches in Germany — legal, 18+, fast EU delivery. Shop ZYN, VELO, Skruf, LOOP from SnusFriend. Free shipping over €29.',
    intro: 'Germany is one of Europe\'s largest nicotine pouch markets, with growing demand driven by health-conscious consumers switching from cigarettes and vaping. All major brands are available for delivery to German addresses.',
  },
  {
    name: 'United Kingdom',
    slug: 'uk',
    code: 'GB',
    flag: '🇬🇧',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal in the UK and regulated as consumer products. The UK government supports tobacco harm reduction.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to the UK. Delivery typically takes 5-7 business days. Free shipping on orders over €29.',
    popularBrands: ['velo', 'zyn', 'nordic-spirit', 'loop', 'white-fox'],
    h1: 'Buy Nicotine Pouches in the UK',
    metaDescription: 'Buy nicotine pouches in the UK — legal, 18+, EU delivery. Shop VELO, ZYN, Nordic Spirit, LOOP. Free shipping over €29.',
    intro: 'The UK is one of Europe\'s most progressive markets for tobacco harm reduction. VELO leads the UK market, followed by ZYN and Nordic Spirit.',
  },
  {
    name: 'Sweden',
    slug: 'sweden',
    code: 'SE',
    flag: '🇸🇪',
    legalStatus: 'legal',
    legalNote: 'Sweden is the birthplace of snus and modern nicotine pouches. Both are legal and culturally mainstream.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Sweden from our EU warehouse. Standard delivery takes 2-4 business days.',
    popularBrands: ['zyn', 'loop', 'skruf', 'velo', 'fumi'],
    h1: 'Buy Nicotine Pouches in Sweden',
    metaDescription: 'Buy nicotine pouches in Sweden — the home of snus. Shop ZYN, LOOP, Skruf, VELO. Fast delivery from SnusFriend.',
    intro: 'Sweden is where nicotine pouches were born. Swedish consumers are the most experienced pouch users in the world.',
  },
  {
    name: 'Spain',
    slug: 'spain',
    code: 'ES',
    flag: '🇪🇸',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal in Spain and not classified as tobacco products.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Spain. Standard delivery takes 4-6 business days. Free shipping on orders over €29.',
    popularBrands: ['velo', 'zyn', 'pablo', 'killa', 'cuba'],
    h1: 'Buy Nicotine Pouches in Spain',
    metaDescription: 'Buy nicotine pouches in Spain — legal, 18+, EU delivery. Shop VELO, ZYN, Pablo, Killa. Free shipping over €29.',
    intro: 'Spain\'s nicotine pouch market is one of Europe\'s fastest-growing, driven by warm-weather lifestyles where discreet, smokeless products are appealing.',
  },
  {
    name: 'Italy',
    slug: 'italy',
    code: 'IT',
    flag: '🇮🇹',
    legalStatus: 'legal',
    legalNote: 'Nicotine pouches are legal in Italy. As tobacco-free products, they bypass the state tobacco monopoly.',
    ageLimit: 18,
    shippingNote: 'SnusFriend ships to Italy. Standard delivery takes 4-6 business days. Free shipping on orders over €29.',
    popularBrands: ['velo', 'zyn', 'pablo', 'loop', 'nordic-spirit'],
    h1: 'Buy Nicotine Pouches in Italy',
    metaDescription: 'Buy nicotine pouches in Italy — legal, 18+, fast EU delivery. Shop VELO, ZYN, Pablo, LOOP. Free shipping over €29.',
    intro: 'Italy\'s nicotine pouch market is emerging rapidly, particularly among younger adults and former smokers.',
  },
];
