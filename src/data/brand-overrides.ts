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
    name: "77 Pouches",
    slug: "77-pouches",
    tagline: "77 flavours of freedom.",
    description:
      "77 Pouches delivers a wide range of creative nicotine pouch flavours with a focus on variety and value. With over 20 products in the lineup, there is a 77 pouch for every palate.",
    manufacturer: "77 Pouches",
    faqs: [
      {
        question: "What flavours does 77 Pouches offer?",
        answer:
          "77 Pouches has one of the broadest flavour ranges on the market, spanning fruity, minty, and exotic profiles across multiple nicotine strengths.",
      },
      {
        question: "Are 77 Pouches tobacco-free?",
        answer:
          "Yes. All 77 Pouches products are completely tobacco-free and smoke-free.",
      },
      {
        question: "What nicotine strengths are available?",
        answer:
          "77 Pouches come in several strengths from mild to extra strong, so both beginners and experienced users can find a suitable option.",
      },
      {
        question: "Do you offer free delivery on 77 Pouches?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "ACE",
    slug: "ace",
    tagline: "Ace your nicotine experience.",
    description:
      "ACE by Ministry of Snus offers bold, satisfying nicotine pouches with a focus on intense flavour and clean design. A favourite among users who want premium quality without compromise.",
    manufacturer: "Ministry of Snus",
    faqs: [
      {
        question: "Who makes ACE nicotine pouches?",
        answer:
          "ACE is produced by Ministry of Snus, a Swedish manufacturer known for high-quality nicotine products.",
      },
      {
        question: "What flavours does ACE offer?",
        answer:
          "ACE offers a curated range including cool mint, citrus, and berry flavours in various strengths.",
      },
      {
        question: "Are ACE pouches tobacco-free?",
        answer:
          "Yes. ACE pouches contain no tobacco — only pharmaceutical-grade nicotine and food-grade ingredients.",
      },
      {
        question: "How many pouches are in an ACE can?",
        answer:
          "Each ACE can typically contains 20 slim pouches.",
      },
    ],
  },
  {
    name: "Après",
    slug: "apr-s",
    tagline: "Smooth pouches, refined taste.",
    description:
      "Après by NGRS combines elegant flavour profiles with a comfortable slim format. Known for well-balanced nicotine delivery and a smooth mouthfeel, Après is a refined choice for everyday use.",
    manufacturer: "NGRS",
    faqs: [
      {
        question: "What makes Après different from other brands?",
        answer:
          "Après focuses on balanced, sophisticated flavours with a smooth nicotine release, making it ideal for users who prefer a refined experience.",
      },
      {
        question: "What nicotine strengths does Après come in?",
        answer:
          "Après is available in multiple strengths from regular to strong, catering to a wide range of preferences.",
      },
      {
        question: "Are Après pouches comfortable to use?",
        answer:
          "Yes. Après uses a slim pouch format that sits comfortably and discreetly under the lip.",
      },
      {
        question: "Can I get free delivery on Après orders?",
        answer:
          "Yes — orders over €29 ship free across the EU from SnusFriend.",
      },
    ],
  },
  {
    name: "AVANT",
    slug: "avant",
    tagline: "Forward-thinking nicotine pouches.",
    description:
      "AVANT brings a modern approach to nicotine pouches with clean design and carefully crafted flavour profiles. A newer entrant that prioritises quality ingredients and user comfort.",
    manufacturer: "AVANT",
    faqs: [
      {
        question: "What flavours does AVANT offer?",
        answer:
          "AVANT offers a focused range of refreshing flavours including mint and fruit varieties.",
      },
      {
        question: "Are AVANT pouches tobacco-free?",
        answer:
          "Yes. AVANT pouches are 100% tobacco-free and designed for a clean nicotine experience.",
      },
      {
        question: "What format are AVANT pouches?",
        answer:
          "AVANT uses a slim format for comfortable, discreet use throughout the day.",
      },
    ],
  },
  {
    name: "BRUTE",
    slug: "brute",
    tagline: "Raw power in every pouch.",
    description:
      "BRUTE lives up to its name with high-strength nicotine pouches designed for experienced users who crave intensity. Not for the faint-hearted.",
    manufacturer: "BRUTE",
    faqs: [
      {
        question: "How strong are BRUTE pouches?",
        answer:
          "BRUTE pouches are high-strength and recommended only for experienced nicotine pouch users.",
      },
      {
        question: "Are BRUTE pouches tobacco-free?",
        answer:
          "Yes. BRUTE pouches are completely tobacco-free.",
      },
      {
        question: "Is BRUTE suitable for beginners?",
        answer:
          "No. Due to their high nicotine content, BRUTE pouches are intended for experienced users. Beginners should start with milder brands.",
      },
    ],
  },
  {
    name: "Chainpop",
    slug: "chainpop",
    tagline: "Link up with bold flavour.",
    description:
      "Chainpop by Swedish Pouch AB delivers creative, bold flavour combinations in a comfortable slim format. A fun and flavourful brand for users who enjoy variety.",
    manufacturer: "Swedish Pouch AB",
    faqs: [
      {
        question: "Who manufactures Chainpop?",
        answer:
          "Chainpop is produced by Swedish Pouch AB, a Swedish manufacturer also behind Snowman and SNOBERG.",
      },
      {
        question: "What flavours does Chainpop offer?",
        answer:
          "Chainpop features a range of bold and creative flavour profiles across multiple nicotine strengths.",
      },
      {
        question: "Are Chainpop pouches tobacco-free?",
        answer:
          "Yes. All Chainpop products are tobacco-free nicotine pouches.",
      },
      {
        question: "Do you ship Chainpop across the EU?",
        answer:
          "Yes — SnusFriend delivers Chainpop to EU addresses, with free shipping on orders over €29.",
      },
    ],
  },
  {
    name: "CLEW",
    slug: "clew",
    tagline: "Discover your perfect pouch.",
    description:
      "CLEW offers a generous selection of nicotine pouches with diverse flavours and strengths. With 20 products in the range, CLEW makes it easy to find your ideal everyday pouch.",
    manufacturer: "CLEW Pouches",
    faqs: [
      {
        question: "What makes CLEW stand out?",
        answer:
          "CLEW stands out with its wide variety of flavours and nicotine strengths, offering something for every type of user.",
      },
      {
        question: "Are CLEW pouches tobacco-free?",
        answer:
          "Yes. CLEW pouches are completely tobacco-free and smoke-free.",
      },
      {
        question: "What nicotine strengths does CLEW offer?",
        answer:
          "CLEW is available in multiple strengths from mild to strong, suitable for both new and experienced users.",
      },
      {
        question: "How do I get free delivery on CLEW?",
        answer:
          "Spend €29 or more at SnusFriend and your CLEW order ships free across the EU.",
      },
    ],
  },
  {
    name: "CUBA",
    slug: "cuba",
    tagline: "Bold taste, strong kick.",
    description:
      "CUBA by NGP Empire is known for its high-strength nicotine pouches and adventurous flavour lineup. With nearly 30 products available, CUBA offers everything from classic mint to exotic fruit blends.",
    manufacturer: "NGP Empire",
    faqs: [
      {
        question: "How strong are CUBA pouches?",
        answer:
          "CUBA pouches are available in strong and extra strong options, designed for experienced nicotine pouch users.",
      },
      {
        question: "What flavours does CUBA offer?",
        answer:
          "CUBA has one of the widest flavour ranges on the market, including mint, fruit, candy, and exotic blends.",
      },
      {
        question: "Are CUBA pouches tobacco-free?",
        answer:
          "Yes. All CUBA nicotine pouches are completely tobacco-free.",
      },
      {
        question: "Who makes CUBA pouches?",
        answer:
          "CUBA is manufactured by NGP Empire, a well-known producer of strong nicotine pouch brands.",
      },
    ],
  },
  {
    name: "DENSSI",
    slug: "denssi",
    tagline: "Dense flavour, smooth delivery.",
    description:
      "DENSSI offers a solid range of nicotine pouches with an emphasis on rich, full-bodied flavour and consistent nicotine release. A reliable everyday choice with 14 products to explore.",
    manufacturer: "DENSSI",
    faqs: [
      {
        question: "What flavours does DENSSI offer?",
        answer:
          "DENSSI features a diverse range including mint, berry, and citrus flavours across multiple strengths.",
      },
      {
        question: "Are DENSSI pouches comfortable?",
        answer:
          "Yes. DENSSI pouches use a slim format designed for comfortable, all-day use.",
      },
      {
        question: "Are DENSSI pouches tobacco-free?",
        answer:
          "Yes. DENSSI pouches are 100% tobacco-free.",
      },
    ],
  },
  {
    name: "DOSH",
    slug: "dosh",
    tagline: "Premium pouches, smart price.",
    description:
      "DOSH nicotine pouches combine quality ingredients with competitive pricing. A smart choice for users who want a reliable daily pouch without overspending.",
    manufacturer: "DOSH",
    faqs: [
      {
        question: "What makes DOSH a good value?",
        answer:
          "DOSH delivers quality nicotine pouches at a competitive price point, making it an excellent everyday option.",
      },
      {
        question: "What flavours does DOSH offer?",
        answer:
          "DOSH offers a focused selection of popular flavours including mint and fruit options.",
      },
      {
        question: "Are DOSH pouches tobacco-free?",
        answer:
          "Yes. DOSH pouches are completely tobacco-free and smoke-free.",
      },
    ],
  },
  {
    name: "Fix",
    slug: "fix",
    tagline: "Get your fix, tobacco-free.",
    description:
      "Fix nicotine pouches deliver straightforward, no-nonsense nicotine satisfaction. Simple, effective, and tobacco-free — Fix does exactly what the name promises.",
    manufacturer: "Fix",
    faqs: [
      {
        question: "What nicotine strengths does Fix offer?",
        answer:
          "Fix is available in several strengths to suit different user preferences, from moderate to strong.",
      },
      {
        question: "Are Fix pouches tobacco-free?",
        answer:
          "Yes. Fix pouches contain no tobacco whatsoever.",
      },
      {
        question: "How many pouches in a Fix can?",
        answer:
          "Fix cans typically contain 20 pouches.",
      },
    ],
  },
  {
    name: "FOLD",
    slug: "fold",
    tagline: "Unfold a fresh experience.",
    description:
      "FOLD nicotine pouches offer a curated selection of clean flavours in a comfortable format. Designed for users who appreciate simplicity and quality in equal measure.",
    manufacturer: "FOLD",
    faqs: [
      {
        question: "What flavours does FOLD offer?",
        answer:
          "FOLD features a focused range of fresh, clean flavour profiles.",
      },
      {
        question: "Are FOLD pouches tobacco-free?",
        answer:
          "Yes. FOLD pouches are 100% tobacco-free.",
      },
      {
        question: "What format are FOLD pouches?",
        answer:
          "FOLD uses a slim pouch format for comfortable and discreet daily use.",
      },
    ],
  },
  {
    name: "FUMI",
    slug: "fumi",
    tagline: "Japanese-inspired flavour artistry.",
    description:
      "FUMI by Another Snus Factory draws inspiration from Japanese aesthetics to create beautifully crafted nicotine pouches with unique, aromatic flavour profiles. Each can is a work of art.",
    manufacturer: "Another Snus Factory",
    faqs: [
      {
        question: "What makes FUMI unique?",
        answer:
          "FUMI combines Japanese-inspired design with innovative flavour profiles like salted caramel, green tea, and spiced blends that you won't find from other brands.",
      },
      {
        question: "Who manufactures FUMI?",
        answer:
          "FUMI is made by Another Snus Factory, the same Swedish company behind Loop nicotine pouches.",
      },
      {
        question: "Are FUMI pouches tobacco-free?",
        answer:
          "Yes. FUMI pouches are completely tobacco-free, using pharmaceutical-grade nicotine.",
      },
      {
        question: "What strengths does FUMI come in?",
        answer:
          "FUMI pouches are available in regular and strong nicotine options.",
      },
    ],
  },
  {
    name: "Garant",
    slug: "garant",
    tagline: "Guaranteed Swedish quality.",
    description:
      "Garant by Fiedler & Lundgren brings traditional Swedish snus craftsmanship to the nicotine pouch category. With 15 products available, Garant offers dependable quality and classic Scandinavian flavours.",
    manufacturer: "Fiedler & Lundgren",
    faqs: [
      {
        question: "Who makes Garant pouches?",
        answer:
          "Garant is produced by Fiedler & Lundgren, a well-established Swedish tobacco and nicotine company.",
      },
      {
        question: "What flavours does Garant offer?",
        answer:
          "Garant offers a range of classic Scandinavian-inspired flavours including traditional tobacco, mint, and herbal profiles.",
      },
      {
        question: "Are Garant pouches tobacco-free?",
        answer:
          "Yes. Garant nicotine pouches are tobacco-free, although the brand's heritage lies in traditional Swedish snus.",
      },
      {
        question: "What nicotine strengths are available?",
        answer:
          "Garant is available in several strengths from regular to strong, catering to a wide range of users.",
      },
    ],
  },
  {
    name: "GLICK",
    slug: "glick",
    tagline: "Click into great flavour.",
    description:
      "GLICK nicotine pouches offer a lively range of flavours with consistent quality and satisfying nicotine delivery. With 11 products, GLICK provides plenty of variety for everyday enjoyment.",
    manufacturer: "GLICK",
    faqs: [
      {
        question: "What flavours does GLICK offer?",
        answer:
          "GLICK has a diverse flavour lineup spanning mint, fruit, and unique blended profiles.",
      },
      {
        question: "Are GLICK pouches tobacco-free?",
        answer:
          "Yes. GLICK pouches are 100% tobacco-free.",
      },
      {
        question: "What strengths are available?",
        answer:
          "GLICK offers multiple nicotine strengths to suit different user preferences.",
      },
    ],
  },
  {
    name: "HELWIT",
    slug: "helwit",
    tagline: "Clever pouches, pure enjoyment.",
    description:
      "HELWIT by Helwit AB is a Swedish brand known for its clean, white pouches and thoughtfully designed flavours. With 18 products, HELWIT offers a sophisticated nicotine experience focused on comfort and taste.",
    manufacturer: "Helwit AB",
    faqs: [
      {
        question: "What makes HELWIT special?",
        answer:
          "HELWIT is known for its all-white, no-drip pouches and refined flavour profiles that deliver a clean, comfortable experience.",
      },
      {
        question: "What flavours does HELWIT offer?",
        answer:
          "HELWIT offers creative flavours including blueberry, mocha, salmiak, and tropical varieties alongside classic mints.",
      },
      {
        question: "Are HELWIT pouches tobacco-free?",
        answer:
          "Yes. All HELWIT products are completely tobacco-free and stain-free.",
      },
      {
        question: "Who manufactures HELWIT?",
        answer:
          "HELWIT is produced by Helwit AB, a Swedish company dedicated to high-quality nicotine pouches.",
      },
    ],
  },
  {
    name: "ICEBERG",
    slug: "iceberg",
    tagline: "Ice-cold intensity.",
    description:
      "ICEBERG nicotine pouches are renowned for their powerful cooling sensation and high nicotine strengths. A go-to brand for users who want maximum freshness and an intense nicotine hit.",
    manufacturer: "ICEBERG",
    faqs: [
      {
        question: "How strong are ICEBERG pouches?",
        answer:
          "ICEBERG pouches are among the strongest on the market, with high nicotine content designed for experienced users.",
      },
      {
        question: "What flavours does ICEBERG offer?",
        answer:
          "ICEBERG specialises in intense cooling flavours including various mint and menthol profiles, along with fruity options.",
      },
      {
        question: "Are ICEBERG pouches suitable for beginners?",
        answer:
          "Due to their high strength, ICEBERG pouches are recommended for experienced users. Beginners should start with milder brands.",
      },
      {
        question: "Are ICEBERG pouches tobacco-free?",
        answer:
          "Yes. ICEBERG pouches are 100% tobacco-free.",
      },
    ],
  },
  {
    name: "ICY WOLF",
    slug: "icy-wolf",
    tagline: "Unleash the chill.",
    description:
      "ICY WOLF nicotine pouches combine frosty cooling sensations with bold flavour profiles. Designed for users who want an invigorating, refreshing nicotine experience.",
    manufacturer: "ICY WOLF",
    faqs: [
      {
        question: "What makes ICY WOLF different?",
        answer:
          "ICY WOLF focuses on delivering intense cooling and refreshing flavour experiences in every pouch.",
      },
      {
        question: "What flavours does ICY WOLF offer?",
        answer:
          "ICY WOLF features a range of cooling flavours including mint and icy fruit blends.",
      },
      {
        question: "Are ICY WOLF pouches tobacco-free?",
        answer:
          "Yes. ICY WOLF pouches are completely tobacco-free.",
      },
    ],
  },
  {
    name: "Kelly White",
    slug: "kelly-white",
    tagline: "White pouches, pure taste.",
    description:
      "Kelly White Sweden crafts premium all-white nicotine pouches with a focus on natural flavours and gentle nicotine delivery. With 20 products, Kelly White is a top choice for discerning users.",
    manufacturer: "Kelly White Sweden",
    faqs: [
      {
        question: "What makes Kelly White special?",
        answer:
          "Kelly White focuses on natural-inspired flavours and a gentle, comfortable pouch experience with its all-white format.",
      },
      {
        question: "What flavours does Kelly White offer?",
        answer:
          "Kelly White has a broad range including mint, citrus, berry, and unique herbal flavours.",
      },
      {
        question: "Are Kelly White pouches tobacco-free?",
        answer:
          "Yes. All Kelly White products are tobacco-free and stain-free.",
      },
      {
        question: "Who manufactures Kelly White?",
        answer:
          "Kelly White is produced by Kelly White Sweden, a company dedicated to premium Swedish nicotine pouches.",
      },
    ],
  },
  {
    name: "KLAR",
    slug: "klar",
    tagline: "Crystal clear satisfaction.",
    description:
      "KLAR nicotine pouches deliver a clean and straightforward nicotine experience. Simple, effective, and designed for users who prefer no-frills quality.",
    manufacturer: "KLAR",
    faqs: [
      {
        question: "What flavours does KLAR offer?",
        answer:
          "KLAR offers a focused range of clean, refreshing flavours.",
      },
      {
        question: "Are KLAR pouches tobacco-free?",
        answer:
          "Yes. KLAR pouches are 100% tobacco-free.",
      },
      {
        question: "What strengths are available?",
        answer:
          "KLAR is available in multiple nicotine strengths to suit different preferences.",
      },
    ],
  },
  {
    name: "Klint",
    slug: "klint",
    tagline: "Crafted comfort, Swedish style.",
    description:
      "Klint by Habit Factory (The Art Factory) brings a creative, design-forward approach to nicotine pouches. Known for unique flavours and a premium feel, Klint stands out from the crowd.",
    manufacturer: "Habit Factory (The Art Factory)",
    faqs: [
      {
        question: "Who makes Klint pouches?",
        answer:
          "Klint is manufactured by Habit Factory (also known as The Art Factory), a Swedish company focused on innovative nicotine products.",
      },
      {
        question: "What flavours does Klint offer?",
        answer:
          "Klint offers distinctive flavours including honeymelon, passionfruit, and classic mint varieties.",
      },
      {
        question: "Are Klint pouches tobacco-free?",
        answer:
          "Yes. Klint pouches are completely tobacco-free and use pharmaceutical-grade nicotine.",
      },
    ],
  },
  {
    name: "KUMA",
    slug: "kuma",
    tagline: "Bold by nature.",
    description:
      "KUMA nicotine pouches offer a compact but flavourful range for users who appreciate bold taste and reliable nicotine delivery.",
    manufacturer: "KUMA",
    faqs: [
      {
        question: "What flavours does KUMA offer?",
        answer:
          "KUMA features a curated selection of bold, satisfying flavours.",
      },
      {
        question: "Are KUMA pouches tobacco-free?",
        answer:
          "Yes. KUMA pouches are 100% tobacco-free.",
      },
      {
        question: "How many products does KUMA have?",
        answer:
          "KUMA currently offers 4 products, each with a distinct flavour profile.",
      },
    ],
  },
  {
    name: "Loop",
    slug: "loop",
    tagline: "Instant flavour, lasting freshness.",
    description:
      "Loop pouches by Another Snus Factory use innovative Instant-release technology that delivers flavour from the very first second. With 32 products, Loop offers one of the widest selections of fun, fruity nicotine pouches.",
    manufacturer: "Another Snus Factory",
    faqs: [
      {
        question: "What is Loop's Instant technology?",
        answer:
          "Loop uses a special pouch material and flavour coating that releases taste immediately when placed under the lip.",
      },
      {
        question: "What flavours does Loop offer?",
        answer:
          "Loop has one of the widest ranges available, with over 30 products spanning fruity, minty, and creative flavour combinations like Jalapeño Lime.",
      },
      {
        question: "How many pouches are in a Loop can?",
        answer:
          "Each Loop can typically contains 20–22 slim pouches.",
      },
      {
        question: "Do you offer free delivery on Loop?",
        answer:
          "Yes — all orders over €29 at SnusFriend qualify for free EU delivery.",
      },
    ],
  },
  {
    name: "LUMI",
    slug: "lumi",
    tagline: "Bright flavours, light pouches.",
    description:
      "LUMI nicotine pouches bring a vibrant, flavour-forward approach with 18 products spanning fruity, minty, and refreshing profiles. A colourful brand for users who enjoy variety.",
    manufacturer: "LUMI",
    faqs: [
      {
        question: "What flavours does LUMI offer?",
        answer:
          "LUMI offers a wide range of vibrant flavours including tropical fruits, berries, and cooling mints.",
      },
      {
        question: "Are LUMI pouches tobacco-free?",
        answer:
          "Yes. All LUMI products are 100% tobacco-free.",
      },
      {
        question: "What nicotine strengths does LUMI come in?",
        answer:
          "LUMI is available in several strengths from regular to strong.",
      },
      {
        question: "Do you offer free delivery on LUMI?",
        answer:
          "Yes — spend €29 or more and enjoy free shipping across the EU.",
      },
    ],
  },
  {
    name: "Lundgrens",
    slug: "lundgrens",
    tagline: "Rooted in Swedish tradition.",
    description:
      "Lundgrens by Fiedler & Lundgren is a heritage Swedish brand that brings generations of snus-making expertise to the nicotine pouch category. Expect authentic Scandinavian craftsmanship in every can.",
    manufacturer: "Fiedler & Lundgren",
    faqs: [
      {
        question: "Who makes Lundgrens?",
        answer:
          "Lundgrens is produced by Fiedler & Lundgren, a long-established Swedish company with deep roots in the Scandinavian snus tradition.",
      },
      {
        question: "What flavours does Lundgrens offer?",
        answer:
          "Lundgrens is known for flavours inspired by Swedish regions and nature, including forest berry, juniper, and traditional tobacco-adjacent profiles.",
      },
      {
        question: "Are Lundgrens pouches tobacco-free?",
        answer:
          "Yes. Lundgrens nicotine pouches are tobacco-free while drawing on traditional snus craftsmanship.",
      },
      {
        question: "What strengths are available?",
        answer:
          "Lundgrens offers regular and strong nicotine options to suit different preferences.",
      },
    ],
  },
  {
    name: "MAGGIE",
    slug: "maggie",
    tagline: "Sweet, fun, and flavourful.",
    description:
      "MAGGIE nicotine pouches bring a playful, flavour-first approach with 12 fun products. Known for creative, candy-inspired flavours that make nicotine enjoyment a treat.",
    manufacturer: "MAGGIE",
    faqs: [
      {
        question: "What makes MAGGIE different?",
        answer:
          "MAGGIE stands out with its fun, candy-inspired flavour profiles that appeal to users who enjoy sweet and fruity nicotine pouches.",
      },
      {
        question: "Are MAGGIE pouches tobacco-free?",
        answer:
          "Yes. All MAGGIE products are completely tobacco-free.",
      },
      {
        question: "What nicotine strengths does MAGGIE offer?",
        answer:
          "MAGGIE is available in several strengths from mild to strong.",
      },
    ],
  },
  {
    name: "MYNT",
    slug: "mynt",
    tagline: "Mint-fresh, always.",
    description:
      "MYNT specialises in refreshing mint-flavoured nicotine pouches with a clean, invigorating sensation. With 18 products, MYNT is the go-to brand for mint lovers seeking variety.",
    manufacturer: "MYNT",
    faqs: [
      {
        question: "Does MYNT only offer mint flavours?",
        answer:
          "While mint is MYNT's speciality and inspiration, the range also includes complementary cooling and fresh flavour profiles.",
      },
      {
        question: "Are MYNT pouches tobacco-free?",
        answer:
          "Yes. MYNT pouches are 100% tobacco-free and smoke-free.",
      },
      {
        question: "What strengths does MYNT come in?",
        answer:
          "MYNT is available in multiple nicotine strengths from regular to extra strong.",
      },
      {
        question: "How do I get free delivery on MYNT?",
        answer:
          "Orders over €29 at SnusFriend qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "NEAFS",
    slug: "neafs",
    tagline: "Heat, don't burn.",
    description:
      "NEAFS by NEAFS Ltd produces tobacco-free heated sticks as an alternative to traditional cigarettes. Unlike nicotine pouches, NEAFS sticks are designed for use with heat-not-burn devices.",
    manufacturer: "NEAFS Ltd",
    faqs: [
      {
        question: "What are NEAFS sticks?",
        answer:
          "NEAFS are tobacco-free heated sticks designed for use with heat-not-burn devices. They offer a smoking alternative without tobacco combustion.",
      },
      {
        question: "Are NEAFS the same as nicotine pouches?",
        answer:
          "No. NEAFS are heated sticks for use with compatible devices, not oral nicotine pouches. They are a different product category.",
      },
      {
        question: "What flavours does NEAFS offer?",
        answer:
          "NEAFS has 18 products spanning classic tobacco-style, menthol, and fruit-flavoured heated sticks.",
      },
      {
        question: "Are NEAFS tobacco-free?",
        answer:
          "Yes. NEAFS sticks are made from tea leaves and other plant-based materials, containing no tobacco.",
      },
    ],
  },
  {
    name: "NOiS",
    slug: "nois",
    tagline: "Make some noise with flavour.",
    description:
      "NOiS nicotine pouches deliver bold, expressive flavours for users who want their nicotine experience to stand out. With 10 products, NOiS offers a focused but impactful range.",
    manufacturer: "NOiS",
    faqs: [
      {
        question: "What flavours does NOiS offer?",
        answer:
          "NOiS features a range of bold and creative flavour profiles spanning fruity and minty options.",
      },
      {
        question: "Are NOiS pouches tobacco-free?",
        answer:
          "Yes. All NOiS products are completely tobacco-free.",
      },
      {
        question: "What strengths are available?",
        answer:
          "NOiS is available in multiple nicotine strengths to suit different user preferences.",
      },
    ],
  },
  {
    name: "ON!",
    slug: "on",
    tagline: "Micro-sized pouches, full-sized satisfaction.",
    description:
      "ON! nicotine pouches by Burger Söhne stand out for their ultra-compact mini format. Each pouch is small enough to be barely noticeable yet delivers consistent nicotine and flavour — ideal for maximum discretion.",
    manufacturer: "Burger Söhne",
    faqs: [
      {
        question: "Why are ON! pouches so small?",
        answer:
          "ON! uses a proprietary mini format that packs nicotine and flavour into one of the smallest pouches on the market — perfect for all-day, discreet use.",
      },
      {
        question: "What flavours are available from ON!?",
        answer:
          "ON! offers Citrus, Mint, Berry, and Coffee flavours across multiple nicotine strengths.",
      },
      {
        question: "Are ON! pouches suitable for beginners?",
        answer:
          "Yes. ON!'s lower strength options (2 mg and 4 mg) are a great starting point for anyone new to nicotine pouches.",
      },
      {
        question: "How should I store ON! pouches?",
        answer:
          "Store ON! cans in a cool, dry place away from direct sunlight. The sealed can keeps pouches fresh for up to 12 months.",
      },
    ],
  },
  {
    name: "Pura",
    slug: "pura",
    tagline: "Pure and simple nicotine.",
    description:
      "Pura nicotine pouches focus on delivering a clean, uncomplicated nicotine experience with minimal ingredients and a focus on purity.",
    manufacturer: "Pura",
    faqs: [
      {
        question: "What makes Pura different?",
        answer:
          "Pura takes a minimalist approach, focusing on clean ingredients and a pure nicotine experience without unnecessary additives.",
      },
      {
        question: "Are Pura pouches tobacco-free?",
        answer:
          "Yes. Pura pouches are 100% tobacco-free.",
      },
      {
        question: "What flavours does Pura offer?",
        answer:
          "Pura offers a focused selection emphasising clean, natural-tasting flavours.",
      },
    ],
  },
  {
    name: "rabbit",
    slug: "rabbit",
    tagline: "Quick flavour, fast satisfaction.",
    description:
      "rabbit nicotine pouches offer a fun, approachable brand with 15 flavourful products. Known for quick flavour release and playful branding, rabbit appeals to users who enjoy a lighthearted nicotine experience.",
    manufacturer: "rabbit",
    faqs: [
      {
        question: "What flavours does rabbit offer?",
        answer:
          "rabbit has a diverse range of 15 flavours spanning fruity, minty, and creative flavour combinations.",
      },
      {
        question: "Are rabbit pouches tobacco-free?",
        answer:
          "Yes. All rabbit products are completely tobacco-free.",
      },
      {
        question: "What nicotine strengths does rabbit come in?",
        answer:
          "rabbit is available in several nicotine strengths from mild to strong.",
      },
      {
        question: "Do you ship rabbit across the EU?",
        answer:
          "Yes — SnusFriend delivers rabbit to EU addresses, with free shipping on orders over €29.",
      },
    ],
  },
  {
    name: "RAVE",
    slug: "rave",
    tagline: "Party in every pouch.",
    description:
      "RAVE Pouches bring high-energy flavours and vibrant branding to the nicotine pouch market. With 26 products, RAVE offers one of the largest and most colourful selections available.",
    manufacturer: "RAVE Pouches",
    faqs: [
      {
        question: "What makes RAVE different?",
        answer:
          "RAVE stands out with its vibrant, party-inspired branding and one of the widest flavour ranges in the market with 26 different products.",
      },
      {
        question: "What flavours does RAVE offer?",
        answer:
          "RAVE has an extensive range including fruity, sweet, cooling, and creative flavour blends.",
      },
      {
        question: "Are RAVE pouches tobacco-free?",
        answer:
          "Yes. All RAVE products are 100% tobacco-free.",
      },
      {
        question: "What strengths are available?",
        answer:
          "RAVE offers multiple nicotine strengths from regular to extra strong.",
      },
    ],
  },
  {
    name: "RELX",
    slug: "relx",
    tagline: "Premium pod technology.",
    description:
      "RELX by RELX Technology is a leading vape and pod system brand offering sleek devices and prefilled pods. Unlike nicotine pouches, RELX products are designed for vaping.",
    manufacturer: "RELX Technology",
    faqs: [
      {
        question: "What are RELX products?",
        answer:
          "RELX produces vape devices and prefilled e-liquid pods. They are not nicotine pouches but an alternative nicotine delivery system.",
      },
      {
        question: "What flavours does RELX offer?",
        answer:
          "RELX offers a range of prefilled pod flavours including tobacco, menthol, and fruit options.",
      },
      {
        question: "Are RELX products tobacco-free?",
        answer:
          "RELX pods contain nicotine e-liquid but no tobacco leaf. They are designed for use with RELX vape devices.",
      },
    ],
  },
  {
    name: "Royal White",
    slug: "royal-white",
    tagline: "Regal quality, white pouch.",
    description:
      "Royal White nicotine pouches offer a premium, all-white experience with a focus on refined flavour and clean design.",
    manufacturer: "Royal White",
    faqs: [
      {
        question: "What makes Royal White special?",
        answer:
          "Royal White focuses on delivering a premium, stain-free nicotine pouch experience with refined flavours.",
      },
      {
        question: "Are Royal White pouches tobacco-free?",
        answer:
          "Yes. Royal White pouches are completely tobacco-free and stain-free.",
      },
      {
        question: "Is Royal White available at SnusFriend?",
        answer:
          "Yes — Royal White is available for delivery across the EU from SnusFriend.",
      },
    ],
  },
  {
    name: "RUSH",
    slug: "rush",
    tagline: "Feel the rush.",
    description:
      "RUSH nicotine pouches deliver an energising nicotine experience with bold flavours and satisfying strength. Built for users who want their nicotine hit fast and flavourful.",
    manufacturer: "RUSH",
    faqs: [
      {
        question: "What flavours does RUSH offer?",
        answer:
          "RUSH features a range of bold, energising flavours across 9 different products.",
      },
      {
        question: "How strong are RUSH pouches?",
        answer:
          "RUSH offers multiple nicotine strengths including strong options for experienced users.",
      },
      {
        question: "Are RUSH pouches tobacco-free?",
        answer:
          "Yes. RUSH pouches are 100% tobacco-free.",
      },
    ],
  },
  {
    name: "Siberia",
    slug: "siberia",
    tagline: "Extremely strong. Not for the faint-hearted.",
    description:
      "Siberia by GN Tobacco is one of the strongest nicotine pouch brands on the market, famed for its intense nicotine hit and powerful cooling sensation. Recommended only for experienced users.",
    manufacturer: "GN Tobacco",
    faqs: [
      {
        question: "How strong is Siberia?",
        answer:
          "Siberia contains up to 43 mg of nicotine per pouch — one of the strongest available. It is only recommended for experienced users.",
      },
      {
        question: "What flavours does Siberia come in?",
        answer:
          "Siberia's signature flavour is a powerful spearmint / wintergreen blend with an intense cooling effect.",
      },
      {
        question: "Is Siberia suitable for beginners?",
        answer:
          "No. Siberia is designed for experienced nicotine users. Beginners should start with a lower-strength brand like ZYN or VELO.",
      },
      {
        question: "How many pouches per can?",
        answer:
          "Each Siberia can contains 20 pouches.",
      },
    ],
  },
  {
    name: "Skruf",
    slug: "skruf",
    tagline: "Premium Swedish pouches since 2002.",
    description:
      "Skruf by Imperial Brands is a Swedish heritage brand known for bold, complex flavours and high-quality ingredients. With 15 products, Skruf brings decades of expertise to every can.",
    manufacturer: "Imperial Brands",
    faqs: [
      {
        question: "What makes Skruf different?",
        answer:
          "Skruf focuses on rich, complex flavour profiles and uses premium ingredients sourced from Sweden, backed by over two decades of expertise.",
      },
      {
        question: "What formats does Skruf offer?",
        answer:
          "Skruf pouches are available in Original and Slim formats to suit different preferences.",
      },
      {
        question: "How strong are Skruf pouches?",
        answer:
          "Skruf offers a range of strengths from regular to extra strong, designed for users of all experience levels.",
      },
      {
        question: "Do you offer free delivery on Skruf?",
        answer:
          "Yes — spend €29 or more at SnusFriend and enjoy free delivery across the EU.",
      },
    ],
  },
  {
    name: "Smögen",
    slug: "sm-gen",
    tagline: "West coast Swedish craft.",
    description:
      "Smögen nicotine pouches take their name from the picturesque Swedish coastal village and bring a boutique, craft approach to the nicotine pouch category.",
    manufacturer: "Smögen",
    faqs: [
      {
        question: "Where does the name Smögen come from?",
        answer:
          "Smögen is named after a charming fishing village on the Swedish west coast, reflecting the brand's Swedish heritage.",
      },
      {
        question: "Are Smögen pouches tobacco-free?",
        answer:
          "Yes. Smögen pouches are completely tobacco-free.",
      },
      {
        question: "What flavours does Smögen offer?",
        answer:
          "Smögen offers a small, curated selection of craft-quality flavours.",
      },
    ],
  },
  {
    name: "SNOBERG",
    slug: "snoberg",
    tagline: "Cool as a mountain peak.",
    description:
      "SNOBERG by Swedish Pouch AB delivers crisp, cooling nicotine pouches inspired by icy Scandinavian landscapes. With 12 products, SNOBERG offers a refreshing range for mint and cool-flavour enthusiasts.",
    manufacturer: "Swedish Pouch AB",
    faqs: [
      {
        question: "Who manufactures SNOBERG?",
        answer:
          "SNOBERG is produced by Swedish Pouch AB, a Swedish company also behind Chainpop and Snowman brands.",
      },
      {
        question: "What flavours does SNOBERG offer?",
        answer:
          "SNOBERG specialises in cooling, refreshing flavour profiles with a strong emphasis on mint and icy varieties.",
      },
      {
        question: "Are SNOBERG pouches tobacco-free?",
        answer:
          "Yes. All SNOBERG products are 100% tobacco-free.",
      },
    ],
  },
  {
    name: "Snowman",
    slug: "snowman",
    tagline: "Frosty fresh, every time.",
    description:
      "Snowman by Swedish Pouch AB offers a cool, refreshing nicotine pouch experience with 12 products emphasising frosty flavours and comfortable all-day use.",
    manufacturer: "Swedish Pouch AB",
    faqs: [
      {
        question: "Who makes Snowman pouches?",
        answer:
          "Snowman is manufactured by Swedish Pouch AB, the same company behind Chainpop and SNOBERG.",
      },
      {
        question: "What flavours does Snowman offer?",
        answer:
          "Snowman features a range of cool, refreshing flavours with an emphasis on frosty, invigorating profiles.",
      },
      {
        question: "Are Snowman pouches tobacco-free?",
        answer:
          "Yes. Snowman pouches are completely tobacco-free.",
      },
      {
        question: "What strengths are available?",
        answer:
          "Snowman is available in multiple nicotine strengths to suit different preferences.",
      },
    ],
  },
  {
    name: "STNG",
    slug: "stng",
    tagline: "Sting your senses.",
    description:
      "STNG by Mochi AB delivers punchy, flavour-packed nicotine pouches with a bold edge. With 10 products, STNG offers a focused range for users who want intensity and taste.",
    manufacturer: "Mochi AB",
    faqs: [
      {
        question: "Who manufactures STNG?",
        answer:
          "STNG is produced by Mochi AB, a Swedish company focused on bold nicotine pouch products.",
      },
      {
        question: "What flavours does STNG offer?",
        answer:
          "STNG features a range of punchy, bold flavours across 10 products.",
      },
      {
        question: "Are STNG pouches tobacco-free?",
        answer:
          "Yes. STNG pouches are 100% tobacco-free.",
      },
    ],
  },
  {
    name: "Swag",
    slug: "swag",
    tagline: "Style meets substance.",
    description:
      "Swag nicotine pouches bring a stylish, confident vibe to the pouch market. A compact range focused on delivering quality flavour with a touch of attitude.",
    manufacturer: "Swag",
    faqs: [
      {
        question: "What flavours does Swag offer?",
        answer:
          "Swag offers a focused selection of flavourful nicotine pouches.",
      },
      {
        question: "Are Swag pouches tobacco-free?",
        answer:
          "Yes. Swag pouches are completely tobacco-free.",
      },
      {
        question: "Is Swag available at SnusFriend?",
        answer:
          "Yes — Swag is available for delivery across the EU from SnusFriend, with free shipping on orders over €29.",
      },
    ],
  },
  {
    name: "TOGO",
    slug: "togo",
    tagline: "Grab and go nicotine.",
    description:
      "TOGO nicotine pouches are built for convenience, perfect for on-the-move users who need a quick, satisfying nicotine fix without slowing down.",
    manufacturer: "TOGO",
    faqs: [
      {
        question: "What makes TOGO convenient?",
        answer:
          "TOGO is designed with an on-the-go lifestyle in mind, offering easy-to-carry cans and fast-acting pouches.",
      },
      {
        question: "Are TOGO pouches tobacco-free?",
        answer:
          "Yes. TOGO pouches are 100% tobacco-free.",
      },
      {
        question: "What flavours does TOGO offer?",
        answer:
          "TOGO features a compact range of popular flavours across its 4 products.",
      },
    ],
  },
  {
    name: "TYR",
    slug: "tyr",
    tagline: "Norse strength in every pouch.",
    description:
      "TYR nicotine pouches draw inspiration from Norse mythology to deliver powerful, characterful nicotine experiences. A bold choice for users who value strength and heritage.",
    manufacturer: "TYR",
    faqs: [
      {
        question: "What does the name TYR mean?",
        answer:
          "TYR is named after the Norse god of war and justice, reflecting the brand's focus on strength and bold character.",
      },
      {
        question: "Are TYR pouches tobacco-free?",
        answer:
          "Yes. TYR pouches are completely tobacco-free.",
      },
      {
        question: "What strengths does TYR offer?",
        answer:
          "TYR offers strong nicotine options designed for experienced users.",
      },
    ],
  },
  {
    name: "VELO",
    slug: "velo",
    tagline: "Modern nicotine pouches by BAT.",
    description:
      "VELO (formerly Lyft) is British American Tobacco's flagship nicotine pouch brand. With 53 products, VELO offers the widest range of flavours and strengths on the market in both slim and mini formats.",
    manufacturer: "British American Tobacco",
    faqs: [
      {
        question: "What nicotine strengths does VELO come in?",
        answer:
          "VELO pouches range from 4 mg (Low) up to 14 mg (Extra Strong), giving you full control over your nicotine intake.",
      },
      {
        question: "What is the difference between VELO and Lyft?",
        answer:
          "Lyft was rebranded to VELO in 2020. The product formulation and quality remain the same under the VELO name.",
      },
      {
        question: "Are VELO pouches discreet?",
        answer:
          "Yes. VELO's slim format sits comfortably under the lip and is virtually invisible, perfect for use anywhere.",
      },
      {
        question: "How long does a VELO pouch last?",
        answer:
          "Most users enjoy a VELO pouch for 20–30 minutes, though flavour and nicotine release can last up to 45 minutes.",
      },
    ],
  },
  {
    name: "VID",
    slug: "vid",
    tagline: "See flavour differently.",
    description:
      "VID nicotine pouches offer a creative, visual approach to the pouch experience. With bold packaging and distinctive flavours, VID is designed for users who appreciate standout design.",
    manufacturer: "VID",
    faqs: [
      {
        question: "What makes VID unique?",
        answer:
          "VID combines eye-catching design with creative flavour profiles for a distinctive nicotine pouch experience.",
      },
      {
        question: "Are VID pouches tobacco-free?",
        answer:
          "Yes. VID pouches are 100% tobacco-free.",
      },
      {
        question: "What flavours does VID offer?",
        answer:
          "VID features a range of creative flavours across its 6 products.",
      },
    ],
  },
  {
    name: "White Gold",
    slug: "white-gold",
    tagline: "Premium pouches, golden standard.",
    description:
      "White Gold nicotine pouches deliver a premium experience with refined flavours and high-quality craftsmanship. A brand for users who expect the best from their nicotine pouches.",
    manufacturer: "White Gold",
    faqs: [
      {
        question: "What makes White Gold premium?",
        answer:
          "White Gold uses high-quality ingredients and refined flavour profiles to deliver a premium pouch experience.",
      },
      {
        question: "Are White Gold pouches tobacco-free?",
        answer:
          "Yes. White Gold pouches are completely tobacco-free.",
      },
      {
        question: "What flavours does White Gold offer?",
        answer:
          "White Gold features 8 products with premium, carefully crafted flavour profiles.",
      },
    ],
  },
  {
    name: "white-fox",
    slug: "white-fox",
    tagline: "Arctic freshness, Swedish quality.",
    description:
      "white-fox by GN Tobacco delivers an intense, cooling nicotine experience in a slim all-white format. Known for its signature arctic freshness and strong nicotine content.",
    manufacturer: "GN Tobacco",
    faqs: [
      {
        question: "Who makes white-fox?",
        answer:
          "white-fox is manufactured by GN Tobacco, the Swedish company also known for the Siberia brand.",
      },
      {
        question: "How strong are white-fox pouches?",
        answer:
          "white-fox pouches are strong, delivering a significant nicotine hit alongside their signature cooling sensation.",
      },
      {
        question: "What flavours does white-fox offer?",
        answer:
          "white-fox is known for its intense mint and cooling flavour profiles with an arctic freshness.",
      },
      {
        question: "Are white-fox pouches stain-free?",
        answer:
          "Yes. white-fox uses an all-white pouch format that does not stain teeth or gums.",
      },
    ],
  },
  {
    name: "X-booster",
    slug: "x-booster",
    tagline: "Boost your experience.",
    description:
      "X-booster nicotine pouches are designed for users who want an extra kick of nicotine with bold, amplified flavours. A high-energy brand for those who demand more.",
    manufacturer: "X-booster",
    faqs: [
      {
        question: "How strong are X-booster pouches?",
        answer:
          "X-booster pouches are designed for users who want a stronger nicotine experience, with higher-strength options available.",
      },
      {
        question: "What flavours does X-booster offer?",
        answer:
          "X-booster features 8 bold flavour profiles spanning fruity and cooling options.",
      },
      {
        question: "Are X-booster pouches tobacco-free?",
        answer:
          "Yes. X-booster pouches are 100% tobacco-free.",
      },
    ],
  },
  {
    name: "XO",
    slug: "xo",
    tagline: "Extra ordinary pouches.",
    description:
      "XO nicotine pouches offer a refined selection of 10 products with a focus on smooth flavours and comfortable daily use. An excellent choice for users seeking balanced quality.",
    manufacturer: "XO",
    faqs: [
      {
        question: "What flavours does XO offer?",
        answer:
          "XO features a well-rounded range of 10 flavours including classic and creative profiles.",
      },
      {
        question: "Are XO pouches tobacco-free?",
        answer:
          "Yes. XO pouches are completely tobacco-free.",
      },
      {
        question: "What nicotine strengths are available?",
        answer:
          "XO is available in several strengths from regular to strong.",
      },
    ],
  },
  {
    name: "XPCT",
    slug: "xpct",
    tagline: "Expect the unexpected.",
    description:
      "XPCT nicotine pouches deliver surprising flavour combinations and reliable nicotine satisfaction. A brand for users who enjoy discovering new and unexpected taste experiences.",
    manufacturer: "XPCT",
    faqs: [
      {
        question: "What makes XPCT unique?",
        answer:
          "XPCT focuses on creative and unexpected flavour combinations that set it apart from more conventional brands.",
      },
      {
        question: "Are XPCT pouches tobacco-free?",
        answer:
          "Yes. XPCT pouches are 100% tobacco-free.",
      },
      {
        question: "What strengths does XPCT come in?",
        answer:
          "XPCT is available in multiple nicotine strengths across its 6 products.",
      },
    ],
  },
  {
    name: "XQS",
    slug: "xqs",
    tagline: "Flavour innovation from Sweden.",
    description:
      "XQS by XQS Nicotine offers one of the most creative flavour ranges in the market, with 28 products spanning everything from classic mints to exotic fruit blends. A Swedish brand built on flavour innovation.",
    manufacturer: "XQS Nicotine",
    faqs: [
      {
        question: "What makes XQS special?",
        answer:
          "XQS is known for its innovative and diverse flavour range, constantly introducing new and creative taste profiles.",
      },
      {
        question: "What flavours does XQS offer?",
        answer:
          "XQS has 28 products spanning mint, citrus, tropical, berry, and unique blended flavours — one of the widest selections available.",
      },
      {
        question: "Are XQS pouches tobacco-free?",
        answer:
          "Yes. All XQS products are completely tobacco-free.",
      },
      {
        question: "Who manufactures XQS?",
        answer:
          "XQS is produced by XQS Nicotine, a Swedish company dedicated to flavour-forward nicotine pouches.",
      },
    ],
  },
  {
    name: "Zeronito",
    slug: "zeronito",
    tagline: "All flavour, zero nicotine.",
    description:
      "Zeronito offers nicotine-free pouches for users who enjoy the ritual and flavour of pouches without any nicotine. Perfect for those cutting down or who simply enjoy the oral experience.",
    manufacturer: "Zeronito",
    faqs: [
      {
        question: "Do Zeronito pouches contain nicotine?",
        answer:
          "No. Zeronito pouches are completely nicotine-free, designed for users who want the pouch experience without any nicotine.",
      },
      {
        question: "Who are Zeronito pouches for?",
        answer:
          "Zeronito is ideal for users who are reducing their nicotine intake, have quit nicotine, or simply enjoy the flavour and ritual of using pouches.",
      },
      {
        question: "What flavours does Zeronito offer?",
        answer:
          "Zeronito has 18 flavour options spanning fruity, minty, and refreshing profiles — all completely nicotine-free.",
      },
      {
        question: "Are Zeronito pouches tobacco-free?",
        answer:
          "Yes. Zeronito pouches contain no tobacco and no nicotine.",
      },
    ],
  },
  {
    name: "Zeus",
    slug: "zeus",
    tagline: "Godly flavour, thunderous strength.",
    description:
      "Zeus Nicotine Pouches offer a powerful range of 32 products with bold flavours and strong nicotine delivery. Inspired by the king of the gods, Zeus brings thunderous satisfaction.",
    manufacturer: "Zeus Nicotine Pouches",
    faqs: [
      {
        question: "How strong are Zeus pouches?",
        answer:
          "Zeus offers multiple strength levels including strong and extra strong options for experienced users.",
      },
      {
        question: "What flavours does Zeus offer?",
        answer:
          "Zeus has an extensive range of 32 products covering mint, fruit, berry, and creative blended flavours.",
      },
      {
        question: "Are Zeus pouches tobacco-free?",
        answer:
          "Yes. All Zeus products are 100% tobacco-free.",
      },
      {
        question: "Do you offer free delivery on Zeus?",
        answer:
          "Yes — all orders over €29 at SnusFriend qualify for free EU delivery.",
      },
    ],
  },
  {
    name: "ZYN",
    slug: "zyn",
    tagline: "Scandinavian craftsmanship, smoke-free satisfaction.",
    description:
      "ZYN by Swedish Match (Philip Morris International) is the world's leading nicotine pouch brand. Completely tobacco-free, ZYN delivers a clean nicotine experience in a range of refreshing flavours and strengths with 52 products.",
    manufacturer: "Swedish Match (Philip Morris International)",
    faqs: [
      {
        question: "What strengths are ZYN pouches available in?",
        answer:
          "ZYN pouches are available in multiple strengths from mild to strong, suitable for both beginners and experienced users.",
      },
      {
        question: "What flavours does ZYN offer?",
        answer:
          "ZYN's extensive range includes Cool Mint, Spearmint, Citrus, and many more, with new varieties released regularly.",
      },
      {
        question: "Are ZYN pouches tobacco-free?",
        answer:
          "Yes. ZYN pouches contain pharmaceutical-grade nicotine and food-grade ingredients — no tobacco leaf, no smoke, no vapour.",
      },
      {
        question: "Do you offer free delivery on ZYN orders?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU from SnusFriend.",
      },
    ],
  },
];

/** Resolve a URL slug to a BrandInfo, or undefined */
export function getBrandBySlug(slug: string): BrandInfo | undefined {
  return brandDirectory.find((b) => b.slug === slug);
}
