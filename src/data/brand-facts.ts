export interface BrandFactSource {
  label: string;
  url: string;
}

export interface BrandFact {
  name: string;
  owner: string;
  manufacturer: string;
  positioningLabel: string;
  flavourSkuLabel: string;
  lastVerified: string;
  sources: BrandFactSource[];
}

export const brandFacts = {
  on: {
    name: 'ON!',
    owner: 'Altria Group via Helix Innovations',
    manufacturer: 'Helix / Altria oral nicotine operations',
    positioningLabel:
      'Compact mini-format nicotine pouches positioned around discretion and straightforward flavour profiles.',
    flavourSkuLabel:
      'The ON! lineup varies by market, so use current retailer stock rather than assuming one universal flavour count or product family.',
    lastVerified: '2026-04-14',
    sources: [
      { label: 'on! official', url: 'https://www.onnicotine.com/' },
      {
        label: 'Altria science presentation',
        url: 'https://sciences.altria.com/-/media/Project/Altria/Sciences/presentations/2024/TSRC-Dissolution-and-Physical-Characterization-of-Oral-Nicotine-Products.pdf',
      },
    ],
  },
  nordicSpirit: {
    name: 'Nordic Spirit',
    owner: 'Japan Tobacco International (JTI)',
    manufacturer: 'JTI oral nicotine operations',
    positioningLabel:
      'A mainstream European pouch brand focused on clean design, mint-led flavours, and wide UK retail visibility.',
    flavourSkuLabel:
      'Nordic Spirit availability changes by market, so treat flavour counts as approximate unless you are referring to a specific country lineup.',
    lastVerified: '2026-04-14',
    sources: [
      { label: 'Nordic Spirit official', url: 'https://nordicspirit.co.uk/' },
      { label: 'JTI official', url: 'https://www.jti.com/' },
    ],
  },
  loop: {
    name: 'LOOP',
    owner: 'Another Snus Factory',
    manufacturer: 'Another Snus Factory in Sweden',
    positioningLabel:
      'A flavour-led Swedish brand known for distinctive formats, bold profiles, and faster-feeling pouch activation.',
    flavourSkuLabel:
      'LOOP frequently rotates flavours and strengths, so speak in terms of categories or current stock instead of fixed all-market counts.',
    lastVerified: '2026-04-14',
    sources: [
      { label: 'LOOP official', url: 'https://loopnicotinepouches.com/' },
      { label: 'Another Snus Factory', url: 'https://anothersnusfactory.com/' },
    ],
  },
  skruf: {
    name: 'Skruf',
    owner: 'Imperial Brands',
    manufacturer: 'Skruf Snus AB in Sweden',
    positioningLabel:
      'A Swedish heritage brand positioned around reliable mint and licorice profiles, slim formats, and a more traditional Nordic identity.',
    flavourSkuLabel:
      'Skruf keeps a tighter, more stable catalogue than brands like ZYN or VELO, but actual flavour availability still varies by retailer and market.',
    lastVerified: '2026-04-14',
    sources: [
      { label: 'Skruf official', url: 'https://skruf.se/' },
      {
        label: 'Imperial Brands annual report',
        url: 'https://www.imperialbrandsplc.com/content/dam/imperialbrands/corporate/documents/investor-hub/debt-information/others/Annual%20Report%202019.pdf.downloadasset.pdf',
      },
    ],
  },
  velo: {
    name: 'VELO',
    owner: 'British American Tobacco (BAT)',
    manufacturer: 'BAT modern oral nicotine operations',
    positioningLabel:
      'A wide-ranging mainstream pouch brand built around broad flavour choice, strong distribution, and multiple strength tiers.',
    flavourSkuLabel:
      'VELO’s assortment changes often, so use live retailer stock or market-specific wording instead of fixed “all Europe” counts.',
    lastVerified: '2026-04-14',
    sources: [
      { label: 'BAT product categories', url: 'https://www.bat.com/brands-and-innovation/product-categories' },
      { label: 'VELO official', url: 'https://www.velo.com/' },
    ],
  },
  zyn: {
    name: 'ZYN',
    owner: 'Swedish Match, part of Philip Morris International (PMI)',
    manufacturer: 'Swedish Match',
    positioningLabel:
      'A mainstream pouch brand with broad retail availability, clean mint-led profiles, and both mini and slim formats depending on market.',
    flavourSkuLabel:
      'Use separate wording for global SKUs and Europe-visible flavours: the global ZYN assortment is broader, while most European retailers stock a smaller market-specific flavour lineup.',
    lastVerified: '2026-04-14',
    sources: [
      { label: 'Swedish Match official', url: 'https://www.swedishmatch.com/' },
      { label: 'PMI acquisition news', url: 'https://www.pmi.com/media-center/news/pmi-completes-acquisition-of-swedish-match' },
    ],
  },
} satisfies Record<string, BrandFact>;
