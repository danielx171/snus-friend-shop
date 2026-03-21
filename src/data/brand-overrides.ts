export interface BrandInfo {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  manufacturer: string;
  faqs: { question: string; answer: string }[];
}

export const brandDirectory: BrandInfo[] = [
  {
    name: "ZYN",
    slug: "zyn",
    tagline: "Scandinavian craftsmanship, smoke-free satisfaction.",
    description: "ZYN nicotine pouches are made by Swedish Match, one of Scandinavia's most trusted tobacco companies. Completely tobacco-free, ZYN delivers a clean nicotine experience in a range of refreshing flavours and strengths. Each slim pouch is designed for comfort and discretion.",
    manufacturer: "Swedish Match",
    faqs: [
      { question: "What strengths are ZYN pouches available in?", answer: "ZYN pouches are available in Normal (6 mg) and Strong (9.6 mg) nicotine per pouch, suitable for both beginners and experienced users." },
      { question: "What flavours does ZYN offer?", answer: "ZYN's UK range includes Cool Mint, Spearmint, Citrus, and Black Licorice among others, with new limited editions released seasonally." },
      { question: "Are ZYN pouches tobacco-free?", answer: "Yes. ZYN pouches contain pharmaceutical-grade nicotine and food-grade ingredients - no tobacco leaf, no smoke, no vapour." },
      { question: "How many pouches are in a ZYN can?", answer: "Each ZYN can contains 20 slim pouches." },
      { question: "Do you offer free delivery on ZYN orders?", answer: "Absolutely - all orders over 25 GBP qualify for free standard UK delivery. Orders under 25 GBP ship for a flat fee of 2.99 GBP." },
      { question: "Can I subscribe and save on ZYN?", answer: "Yes. Subscribe to any ZYN product on SnusFriend and save 10% on every delivery, with flexible frequency options." },
    ],
  },
  {
    name: "VELO",
    slug: "velo",
    tagline: "Modern nicotine pouches by BAT.",
    description: "VELO (formerly Lyft) is British American Tobacco's flagship nicotine pouch brand. Known for bold flavours and satisfying nicotine delivery, VELO pouches come in slim and mini formats. They are 100% tobacco-free and designed for on-the-go convenience.",
    manufacturer: "British American Tobacco",
    faqs: [
      { question: "What nicotine strengths does VELO come in?", answer: "VELO pouches range from 4 mg (Low) up to 14 mg (Extra Strong), giving you full control over your nicotine intake." },
      { question: "What is the difference between VELO and Lyft?", answer: "Lyft was rebranded to VELO in 2020. The product formulation and quality remain the same under the VELO name." },
      { question: "Are VELO pouches discreet?", answer: "Yes. VELO's slim format sits comfortably under the lip and is virtually invisible, perfect for use anywhere." },
      { question: "How long does a VELO pouch last?", answer: "Most users enjoy a VELO pouch for 20-30 minutes, though flavour and nicotine release can last up to 45 minutes." },
      { question: "What is your returns policy for VELO products?", answer: "Unopened, sealed VELO products can be returned within 14 days of delivery for a full refund. See our returns page for details." },
    ],
  },
  {
    name: "ON!",
    slug: "on",
    tagline: "Micro-sized pouches, full-sized satisfaction.",
    description: "ON! nicotine pouches are manufactured by Altria and stand out for their ultra-compact mini format. Each pouch is small enough to be barely noticeable, yet delivers consistent nicotine and flavour. ON! is ideal for users who prefer maximum discretion.",
    manufacturer: "Altria",
    faqs: [
      { question: "Why are ON! pouches so small?", answer: "ON! uses a proprietary mini format that packs nicotine and flavour into one of the smallest pouches on the market - perfect for all-day, discreet use." },
      { question: "What flavours are available from ON!?", answer: "ON! offers Citrus, Mint, Berry, and Coffee flavours across multiple nicotine strengths." },
      { question: "Are ON! pouches suitable for beginners?", answer: "Yes. ON!'s lower strength options (2 mg and 4 mg) are a great starting point for anyone new to nicotine pouches." },
      { question: "How should I store ON! pouches?", answer: "Store ON! cans in a cool, dry place away from direct sunlight. The sealed can keeps pouches fresh for up to 12 months." },
      { question: "Do you ship ON! pouches across the UK?", answer: "Yes - we deliver ON! to all UK mainland addresses. Orders over 25 GBP ship free; otherwise a flat 2.99 GBP rate applies." },
    ],
  },
  {
    name: "Skruf",
    slug: "skruf",
    tagline: "Premium Swedish pouches since 2002.",
    description: "Skruf is a Swedish heritage brand known for bold, complex flavours and high-quality ingredients. Their nicotine pouch line delivers satisfying strength in an original or slim format.",
    manufacturer: "Imperial Brands",
    faqs: [
      { question: "What makes Skruf different?", answer: "Skruf focuses on rich, complex flavour profiles like Dark Roast Coffee and uses high-quality ingredients sourced from Sweden." },
      { question: "What formats does Skruf offer?", answer: "Skruf pouches are available in Original and Slim formats to suit different preferences." },
      { question: "How strong are Skruf pouches?", answer: "Skruf offers Extra Strong pouches with 17 mg nicotine per pouch, designed for experienced users." },
      { question: "Can I get free delivery on Skruf?", answer: "Yes - spend 25 GBP or more and enjoy free standard delivery to any UK mainland address." },
    ],
  },
  {
    name: "LOOP",
    slug: "loop",
    tagline: "Instant flavour, lasting freshness.",
    description: "LOOP pouches by Another Snus Factory use an innovative Instant-release technology that delivers flavour from the first second. Available in fun, fruity profiles with a focus on freshness.",
    manufacturer: "Another Snus Factory",
    faqs: [
      { question: "What is LOOP's Instant technology?", answer: "LOOP uses a special pouch material and flavour coating that releases taste immediately when placed under the lip." },
      { question: "What flavours does LOOP offer?", answer: "LOOP's range includes Berry Frost, Mint Mania, and Jalapeno Lime among creative flavour combinations." },
      { question: "How many pouches are in a LOOP can?", answer: "Each LOOP can contains 22 slim pouches." },
      { question: "Is LOOP available on subscription?", answer: "Yes - subscribe on SnusFriend and save 10% on every LOOP delivery." },
    ],
  },
  {
    name: "Lyft",
    slug: "lyft",
    tagline: "The original all-white pouch.",
    description: "Lyft pioneered the all-white nicotine pouch category. Now largely succeeded by VELO, some Lyft products remain available. Light, clean, and tobacco-free.",
    manufacturer: "British American Tobacco",
    faqs: [
      { question: "Is Lyft the same as VELO?", answer: "Lyft was rebranded to VELO in most markets. Any remaining Lyft stock uses the same formulation." },
      { question: "What strengths are available?", answer: "Lyft pouches are typically available in Normal (8 mg) strength." },
      { question: "Are Lyft pouches tobacco-free?", answer: "Yes - Lyft pouches are completely tobacco-free and stain-free." },
      { question: "Do you offer free delivery?", answer: "Free UK delivery on all orders over 25 GBP." },
    ],
  },
  {
    name: "Nordic Spirit",
    slug: "nordic-spirit",
    tagline: "Made in Sweden, loved worldwide.",
    description: "Nordic Spirit is JTI's premium nicotine pouch brand. Known for unique flavours like Elderflower, Watermelon, and Mocha, Nordic Spirit appeals to adventurous users who want variety.",
    manufacturer: "JTI",
    faqs: [
      { question: "What makes Nordic Spirit unique?", answer: "Nordic Spirit is known for creative flavour combinations you won't find from other brands, such as Elderflower and Watermelon." },
      { question: "What strengths does Nordic Spirit offer?", answer: "Nordic Spirit comes in Regular (6 mg), Strong (9 mg), and Extra Strong (11 mg) options." },
      { question: "Are Nordic Spirit pouches comfortable?", answer: "Yes - the slim format is soft and designed to sit discreetly under the lip for up to 30 minutes." },
      { question: "Can I subscribe to Nordic Spirit?", answer: "Yes - set up a subscription on SnusFriend and save 10% automatically." },
    ],
  },
  {
    name: "Siberia",
    slug: "siberia",
    tagline: "Extremely strong. Not for the faint-hearted.",
    description: "Siberia is GN Tobacco's ultra-strong nicotine pouch, famed for its intense 43 mg hit. Recommended only for experienced users who crave maximum nicotine strength.",
    manufacturer: "GN Tobacco",
    faqs: [
      { question: "How strong is Siberia?", answer: "Siberia contains up to 43 mg of nicotine per pouch - one of the strongest on the market. It is only recommended for experienced users." },
      { question: "What flavours does Siberia come in?", answer: "Siberia's signature flavour is a powerful spearmint / wintergreen blend." },
      { question: "Is Siberia suitable for beginners?", answer: "No. Siberia is designed for experienced nicotine users. Beginners should start with a lower-strength brand like ZYN or VELO." },
      { question: "How many pouches per can?", answer: "Each Siberia can contains 20 pouches." },
    ],
  },
  {
    name: "Pablo",
    slug: "pablo",
    tagline: "Bold flavours, ultra-strong kick.",
    description: "Pablo nicotine pouches by NGP Empire push the limits of strength with up to 50 mg of nicotine per pouch. Available in bold flavours like Fresh Cola, Pablo is built for thrill seekers.",
    manufacturer: "NGP Empire",
    faqs: [
      { question: "How strong are Pablo pouches?", answer: "Pablo pouches contain up to 50 mg of nicotine - among the very strongest available. They are for experienced users only." },
      { question: "What flavours does Pablo offer?", answer: "Pablo offers unique flavours including Fresh Cola, Ice Cold, and Grape Ice." },
      { question: "What format are Pablo pouches?", answer: "Pablo pouches use a large format for maximum flavour and nicotine release." },
      { question: "Can I return Pablo products?", answer: "Unopened, sealed Pablo products can be returned within 14 days for a full refund." },
    ],
  },
  {
    name: "Killa",
    slug: "killa",
    tagline: "Strong pouches, creative flavours.",
    description: "Killa by NGP Empire delivers strong nicotine in creative flavour profiles like Sweet Vanilla, Watermelon, and Blueberry. Slim format for comfort and style.",
    manufacturer: "NGP Empire",
    faqs: [
      { question: "What strength are Killa pouches?", answer: "Killa pouches contain 16 mg of nicotine per pouch - classified as Strong." },
      { question: "What flavours does Killa offer?", answer: "Killa's range includes Sweet Vanilla, Watermelon, Blueberry, Cold Mint, and more." },
      { question: "Are Killa pouches slim format?", answer: "Yes - Killa uses a slim format that is comfortable and discreet under the lip." },
      { question: "Do you offer subscriptions for Killa?", answer: "Yes - subscribe on SnusFriend to save 10% on every Killa delivery." },
    ],
  },
];

/** Resolve a URL slug to a BrandInfo, or undefined */
export function getBrandBySlug(slug: string): BrandInfo | undefined {
  return brandDirectory.find((b) => b.slug === slug);
}
