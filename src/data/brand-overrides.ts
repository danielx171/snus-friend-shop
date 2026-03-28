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
    tagline: "77 ways to enjoy your pouch.",
    description:
      "77 Pouches comes from Luna Corporate, a Polish company with over two decades of experience in the nicotine industry (they previously built CHIC Group before selling it to BAT). Manufactured at the Tobacco Concept Factory in Poland using Swedish quality standards, 77 Pouches has carved out a niche with one of the more diverse flavour lineups you will find anywhere. With 23 products spanning cola, mint, berry, candy, and liquorice in both slim and mini formats, there is something for almost every palate. Strengths run from 10.4 to 20.0mg per pouch, putting most of the range in medium-to-strong territory. The cans hold 20 to 24 pouches depending on the product. If you like variety and do not mind stepping outside the big Scandinavian names, 77 is well worth exploring.",
    manufacturer: "Luna Corporate",
    faqs: [
      {
        question: "What flavours does 77 Pouches offer?",
        answer:
          "77 Pouches pouches are available in berry, candy, cola, fruit, liquorice, mint, original, tobacco flavours across 23 products in our store.",
      },
      {
        question: "What nicotine strengths does 77 Pouches come in?",
        answer:
          "77 Pouches pouches range from 10.4mg to 20.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a 77 Pouches can?",
        answer:
          "Each 77 Pouches can contains 20, 24 pouches in mini and slim format.",
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
    tagline: "Ace your nicotine moment.",
    description:
      "ACE has roots that run surprisingly deep. The brand comes from Ministry of Snus, a Danish company that traces its snus heritage back to 1826 across four generations of craftsmen. The brand launched in 2020 and has since been acquired by Scandinavian Tobacco Group, making it a sibling to XQS. What sets ACE apart is the pouch engineering: they are designed for quick nicotine release within the first couple of minutes, then sustain flavour for 30 to 45 minutes per session. The 8-product lineup covers mint, berry, eucalyptus, and fruit in slim format, with strengths from a gentle 3.0mg up to 11.5mg per pouch. Cans contain 18 to 20 pouches. A solid choice for users who value heritage and a well-balanced release curve.",
    manufacturer: "Scandinavian Tobacco Group",
    faqs: [
      {
        question: "What flavours does ACE offer?",
        answer:
          "ACE pouches are available in berry, eucalyptus, fruit, mint, mint flavours across 8 products in our store.",
      },
      {
        question: "What nicotine strengths does ACE come in?",
        answer:
          "ACE pouches range from 3.0mg to 11.5mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a ACE can?",
        answer:
          "Each ACE can contains 18, 20 pouches in normal and slim format.",
      },
      {
        question: "Do you offer free delivery on ACE?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Après",
    slug: "apr-s",
    tagline: "Smooth satisfaction, refined taste.",
    description:
      "Designed in Stockholm by Apres Nicotine AB, Apres launched around 2020 with a clear mission: merge style with substance. The minimalist can designs look genuinely premium, and the plant-based pouch materials reflect a real commitment to sustainability. Inside, you will find 16 flavours spanning cola, citrus, berry, mint, tea, and fruit, all in a comfortable slim format. Strengths run from 4.4 to 11.0mg per pouch with 20 pouches per can. Apres occupies the mid-strength sweet spot that works well for everyday use without being overwhelming. The brand has no connection to big tobacco and positions itself as a modern, eco-conscious alternative. If you appreciate thoughtful design and want your pouch brand to feel a bit more considered, Apres delivers.",
    manufacturer: "Apres Nicotine AB",
    faqs: [
      {
        question: "What flavours does Après offer?",
        answer:
          "Après pouches are available in berry, citrus, cola, fruit, mint, tea flavours across 16 products in our store.",
      },
      {
        question: "What nicotine strengths does Après come in?",
        answer:
          "Après pouches range from 4.4mg to 11.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Après can?",
        answer:
          "Each Après can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Après?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "AVANT",
    slug: "avant",
    tagline: "Bold flavours, forward thinking.",
    description:
      "AVANT is a newer Swedish entry from Kurbits Snus AB, launched in 2023. Kurbits has roots in the traditional snus industry and brings that craftsmanship to the tobacco-free pouch format. The range is deliberately focused rather than sprawling: 6 slim products covering tropical banana, berry, and coffee flavours. Strengths sit in the medium-to-strong bracket at 7.8 to 13.0mg per pouch, with 20 pouches per can. AVANT keeps things straightforward, letting flavour quality speak for itself rather than chasing the widest possible lineup. It is a good pick for users who want Swedish-made quality without the complexity of navigating a massive product catalogue.",
    manufacturer: "Kurbits Snus AB",
    faqs: [
      {
        question: "What flavours does AVANT offer?",
        answer:
          "AVANT pouches are available in berry, caffee, fruit flavours across 6 products in our store.",
      },
      {
        question: "What nicotine strengths does AVANT come in?",
        answer:
          "AVANT pouches range from 7.8mg to 13.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a AVANT can?",
        answer:
          "Each AVANT can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on AVANT?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "BRUTE",
    slug: "brute",
    tagline: "Raw citrus power in every pouch.",
    description:
      "BRUTE does exactly what the name suggests: it hits hard and does not apologise. This is a focused, single-product brand built around one thing: a zesty citrus slim pouch with 9.5mg nicotine per pouch. No sprawling flavour range, no gimmicks, just a well-executed citrus kick in a can of 20 tobacco-free pouches. Sometimes a brand that does one thing confidently is more appealing than one trying to cover every base. If citrus is your flavour and you want a straightforward, punchy pouch without overthinking it, BRUTE is a solid no-nonsense option.",
    manufacturer: "BRUTE",
    faqs: [
      {
        question: "What flavours does BRUTE offer?",
        answer:
          "BRUTE pouches are available in citrus flavours across 1 products in our store.",
      },
      {
        question: "What nicotine strengths does BRUTE come in?",
        answer:
          "BRUTE pouches contain 9.5mg nicotine per pouch. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a BRUTE can?",
        answer:
          "Each BRUTE can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on BRUTE?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Chainpop",
    slug: "chainpop",
    tagline: "Flavour combinations that pop.",
    description:
      "Born in Gothenburg in the summer of 2023, Chainpop is a premium Swedish brand that wants to be the best-tasting nicotine pouch on the market. Everything is manufactured in Sweden from ingredients to plant-based filling to pouch materials. The range focuses on fruit-forward flavour combinations like apple cinnamon, eucalyptus, berry, and candy across 9 slim products. Strengths sit in the 5.0 to 11.4mg range with 20 pouches per can. What makes Chainpop stand out is the moist-but-long-lasting format and the eye-catching glitter-dusted cans that match each flavour profile. This is a brand that takes presentation as seriously as taste, aimed at connoisseurs who are not afraid to prioritise flavour over raw strength.",
    manufacturer: "Chainpop AB",
    faqs: [
      {
        question: "What flavours does Chainpop offer?",
        answer:
          "Chainpop pouches are available in berry, candy, eucalyptus, fruit, mint, spices flavours across 9 products in our store.",
      },
      {
        question: "What nicotine strengths does Chainpop come in?",
        answer:
          "Chainpop pouches range from 5.0mg to 11.4mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Chainpop can?",
        answer:
          "Each Chainpop can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Chainpop?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "CLEW",
    slug: "clew",
    tagline: "Crafted in the USA, enjoyed everywhere.",
    description:
      "CLEW is one of the newest American entries in the nicotine pouch space, launched in 2024 by Nevcore Innovations Inc. What sets CLEW apart from most competitors is its manufacturing rigour: production takes place in cGMP- and HACCP-certified facilities, and the brand received FDA acceptance for its Premarket Tobacco Product Application (PMTA) in June 2024. The lineup covers 20 slim products across cool mint, berry, coffee, and flower flavours, with a wide strength range from 5.0 to 20.0mg per pouch and 20 pouches per can. If you are curious about what American pouch manufacturing looks like when built from scratch with pharmaceutical-grade standards, CLEW is worth a look.",
    manufacturer: "Nevcore Innovations",
    faqs: [
      {
        question: "What flavours does CLEW offer?",
        answer:
          "CLEW pouches are available in berry, coffee, fruit, mint, flower flavours across 20 products in our store.",
      },
      {
        question: "What nicotine strengths does CLEW come in?",
        answer:
          "CLEW pouches range from 5.0mg to 20.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a CLEW can?",
        answer:
          "Each CLEW can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on CLEW?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "CUBA",
    slug: "cuba",
    tagline: "Extreme strength, no compromises.",
    description:
      "CUBA comes from Nicotobacco Factory in Poland and is firmly aimed at experienced users who want serious nicotine strength. The lineup is divided into three tiers: White (around 4mg for lighter use), Ninja (mid-range), and Black (up to a staggering 43mg per pouch). Across 29 slim products, flavours cover berry, cola, candy, mint, and energy drink. Cans hold 20 to 25 pouches depending on the product. CUBA pouches have moderate moisture and deliver an intense, fast-acting nicotine kick that hits quickly after placement. This is not a beginner brand. If you already know your strength tolerance and want pouches that do not hold back, CUBA is one of the most powerful options in our catalogue.",
    manufacturer: "Nicotobacco Factory",
    faqs: [
      {
        question: "What flavours does CUBA offer?",
        answer:
          "CUBA pouches are available in berry, candy, cola, energy drink, fruit, mint flavours across 29 products in our store.",
      },
      {
        question: "What nicotine strengths does CUBA come in?",
        answer:
          "CUBA pouches range from 10.4mg to 43.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a CUBA can?",
        answer:
          "Each CUBA can contains 20, 25 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on CUBA?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "DENSSI",
    slug: "denssi",
    tagline: "Nordic freshness, dense satisfaction.",
    description:
      "DENSSI is a premium Finnish brand founded in 2017 by Sami Saamanen, an entrepreneur with over a decade of nicotine industry experience who previously built one of Northern Europe's leading vape businesses. The pivot to pouches reflects sharp market insight, and DENSSI now operates across 26 companies with 100+ staff. The brand recently expanded into the Middle East through a partnership with ANDS. On the product side, expect 14 slim pouches in berry, fruit, and mint flavours with a signature cooling effect. Strengths stay in the moderate 4.0 to 8.0mg range with 20 pouches per can. DENSSI targets users who want a refined everyday pouch rather than extreme strength.",
    manufacturer: "DENSSI",
    faqs: [
      {
        question: "What flavours does DENSSI offer?",
        answer:
          "DENSSI pouches are available in berry, fruit, mint flavours across 14 products in our store.",
      },
      {
        question: "What nicotine strengths does DENSSI come in?",
        answer:
          "DENSSI pouches range from 4.0mg to 8.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a DENSSI can?",
        answer:
          "Each DENSSI can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on DENSSI?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "DOSH",
    slug: "dosh",
    tagline: "Ultra-thin pouches, ultra-strong kick.",
    description:
      "DOSH represents a genuine format innovation in the pouch world. Made by PT. CFU Technology in Indonesia, these are not traditional pouches but rather AirPouches: ultra-thin, leaf-style nicotine films built with DuraPress medical-grade engineering. The result is a pouch that weighs almost nothing (about 2g per can), sits invisibly under your lip, and delivers notably fast nicotine release thanks to the thin-film design. The range covers 6 flavours including mint, berry, citrus, and cola, with strengths from 6.0 to 9.0mg per pouch. If you have ever wished your pouch was more discreet or faster-acting, DOSH's AirPouch format is worth trying as a different take on what a nicotine pouch can be.",
    manufacturer: "DOSH",
    faqs: [
      {
        question: "What flavours does DOSH offer?",
        answer:
          "DOSH pouches are available in berry, citrus, cola, fruit, mint flavours across 6 products in our store.",
      },
      {
        question: "What nicotine strengths does DOSH come in?",
        answer:
          "DOSH pouches range from 6.0mg to 9.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a DOSH can?",
        answer:
          "Each DOSH can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on DOSH?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Fix",
    slug: "fix",
    tagline: "Get your fix, your way.",
    description:
      "Fix comes from Habit Factory, a Stockholm-based company founded in 2023 by former snus users who wanted to build something independent of big tobacco. The brand has its own in-house flavour development lab staffed by European flavour experts, and it shows in the 6-product lineup: berry, cinnamon, and fruit varieties that taste genuinely crafted rather than mass-produced. Strengths range from 5.6 to 11.5mg per pouch in slim format, with 20 pouches per can. Habit Factory is also planning to expand with a dedicated factory in Finland. Fix is a good pick if you value independent brands with a hands-on approach to flavour and want to support something outside the corporate tobacco ecosystem.",
    manufacturer: "Habit Factory",
    faqs: [
      {
        question: "What flavours does Fix offer?",
        answer:
          "Fix pouches are available in berry, cinnamon, fruit flavours across 6 products in our store.",
      },
      {
        question: "What nicotine strengths does Fix come in?",
        answer:
          "Fix pouches range from 5.6mg to 11.5mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Fix can?",
        answer:
          "Each Fix can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Fix?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "FOLD",
    slug: "fold",
    tagline: "Simple, strong, satisfying.",
    description:
      "FOLD brings German precision to nicotine pouches. Manufactured in Germany with pharmaceutical-grade production standards, the brand's standout feature is its proprietary Polarcilex nicotine formula, which is engineered to last up to three times longer than standard pouches. Combined with natural flavour oils for cleaner, more intense taste, the result is a pouch that delivers sustained satisfaction. The range is intentionally tight: 4 slim products with strengths from 6.0 to 13.0mg per pouch and 20 pouches per can. FOLD is not chasing the biggest flavour range. Instead, it is betting that scientific accuracy and a genuinely longer-lasting formula will matter more to users than having 30 options to choose from.",
    manufacturer: "FOLD",
    faqs: [
      {
        question: "What flavours does FOLD offer?",
        answer:
          "FOLD pouches are available in berry flavours across 4 products in our store.",
      },
      {
        question: "What nicotine strengths does FOLD come in?",
        answer:
          "FOLD pouches range from 6.0mg to 13.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a FOLD can?",
        answer:
          "Each FOLD can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on FOLD?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "FUMI",
    slug: "fumi",
    tagline: "Unique flavours from Another Snus Factory.",
    description:
      "FUMI has one of the best origin stories in nicotine pouches. Brothers Kaj and Dennis, known as The Snus Brothers, started the brand in a Swedish garage in 2014. Today they operate a 2,500-square-metre factory in Odeshog with capacity for 50 million cans per year. Altria Group now owns the company through Helix Sweden AB. What makes FUMI genuinely different is the flavour philosophy: where most brands lean heavily on mint, FUMI goes for salty, savoury, and earthy profiles inspired by Nordic taste traditions. The 9-product slim lineup includes salty raspberry, licorice, and spice combinations you will not find elsewhere. Strengths run from 8.0 to 11.0mg per pouch with 20 pouches per can.",
    manufacturer: "Helix Sweden AB (Altria)",
    faqs: [
      {
        question: "What flavours does FUMI offer?",
        answer:
          "FUMI pouches are available in berry, fruit, licorice, mint, spices flavours across 9 products in our store.",
      },
      {
        question: "What nicotine strengths does FUMI come in?",
        answer:
          "FUMI pouches range from 8.0mg to 11.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a FUMI can?",
        answer:
          "Each FUMI can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on FUMI?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Garant",
    slug: "garant",
    tagline: "Guaranteed strength in every can.",
    description:
      "Formerly known as Grant, Garant is an Estonian brand that combines Nordic manufacturing with a value-forward approach. The most obvious differentiator is the can size: 27 pouches instead of the standard 20 you get from most competitors. That extra 35% makes a real difference for regular users. The brand also leans into the high-strength end of the market, with 15 slim products reaching up to a hefty 38mg per pouch. Flavours cover berry, citrus, cola, licorice, and mint. Garant is built for experienced users who go through pouches at a steady pace and want more bang for their money per can. If you are tired of cans running out too fast, this one is worth checking out.",
    manufacturer: "Fiedler & Lundgren",
    faqs: [
      {
        question: "What flavours does Garant offer?",
        answer:
          "Garant pouches are available in berry, citrus, cola, energy drink, fruit, licorice, mint flavours across 15 products in our store.",
      },
      {
        question: "Why do Garant cans have 27 pouches?",
        answer:
          "Garant cans contain 27 pouches — more than the standard 20 found in most brands. This gives better value per can while maintaining high-strength nicotine content up to 38mg per pouch.",
      },
      {
        question: "What nicotine strengths does Garant come in?",
        answer:
          "Garant pouches range from 15.0mg to 38.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Garant can?",
        answer:
          "Each Garant can contains 27 pouches in slim format.",
      },
    ],
  },
  {
    name: "GLICK",
    slug: "glick",
    tagline: "Click into high-strength satisfaction.",
    description:
      "GLICK comes from Glick Labs, an ISO-certified Estonian manufacturer that also produces snus, energy pouches, and vape liquids. The brand has built a following around its ice mint and menthol blends in particular, though the 11-product slim lineup also covers berry, citrus, and sweet flavours. The strength range is one of the wider ones in our catalogue, spanning from a mild 4.0mg all the way up to a punchy 25.0mg per pouch, with 20 pouches per can. GLICK appeals to users who want a brand that takes manufacturing standards seriously while still delivering bold, icy flavour profiles.",
    manufacturer: "Glick Labs",
    faqs: [
      {
        question: "What flavours does GLICK offer?",
        answer:
          "GLICK pouches are available in berry, citrus, mint, sweet flavours across 11 products in our store.",
      },
      {
        question: "What nicotine strengths does GLICK come in?",
        answer:
          "GLICK pouches range from 4.0mg to 25.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a GLICK can?",
        answer:
          "Each GLICK can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on GLICK?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "HELWIT",
    slug: "helwit",
    tagline: "Gentle flavours, Swedish craftsmanship.",
    description:
      "HELWIT was founded by a group of friends in the Smaland forest and is owned by Yoik AB. The brand launched in 2021 with a purpose-built factory at Gransholms Bruk near Vaxjo, and the sustainability credentials are genuinely impressive: the factory runs on hydroelectric power, and the cans are made from ISCC-certified pine oil with 85% lower CO2 emissions than conventional plastic. HELWIT has no connection to the tobacco industry. The 18-product slim lineup covers a remarkably wide flavour spectrum including berry, coffee, cola, flower, fruit, licorice, and mint, with strengths kept gentle at 3.5 to 7.5mg per pouch. Twenty pouches per can. A great choice for users who care about sustainability and prefer lower-strength pouches with sophisticated flavours.",
    manufacturer: "Yoik AB",
    faqs: [
      {
        question: "What flavours does HELWIT offer?",
        answer:
          "HELWIT pouches are available in berry, coffee, cola, flower, fruit, licorice, mint flavours across 18 products in our store.",
      },
      {
        question: "What nicotine strengths does HELWIT come in?",
        answer:
          "HELWIT pouches range from 3.5mg to 7.5mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a HELWIT can?",
        answer:
          "Each HELWIT can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on HELWIT?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "ICEBERG",
    slug: "iceberg",
    tagline: "Ice-cold strength from the north.",
    description:
      "ICEBERG is manufactured by Neoptolem in Poland and has earned a reputation as one of the most extreme brands in the nicotine pouch world. While the 13 products in our store cover the 6 to 40mg per pouch range, the brand's full catalogue elsewhere goes even higher. Flavours lean into bold territory with cherry apricot, berry, candy-inspired, and mint combinations, often with an icy cooling kick that matches the name. All pouches are slim, all-white, and tobacco-free. ICEBERG is squarely aimed at experienced users with established nicotine tolerance who want strength and flavour intensity that most mainstream brands simply do not offer. Not for beginners.",
    manufacturer: "Neoptolem",
    faqs: [
      {
        question: "What flavours does ICEBERG offer?",
        answer:
          "ICEBERG pouches are available in berry, candy, fruit, mint, berry flavours across 13 products in our store.",
      },
      {
        question: "What nicotine strengths does ICEBERG come in?",
        answer:
          "ICEBERG pouches range from 6.0mg to 40.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a ICEBERG can?",
        answer:
          "Each ICEBERG can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on ICEBERG?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "ICY WOLF",
    slug: "icy-wolf",
    tagline: "Unleash the wolf within.",
    description:
      "ICY WOLF is made by Arktic Studio with a design philosophy that prioritises comfort over brute force. Rather than chasing extreme strength numbers, the brand focuses on a smooth, balanced nicotine release that suits both newcomers and regular users who prefer a more measured experience. The 6-product slim lineup covers mint and fruit flavours including sweet mint, ice mint, peach honey, mango chili, and watermelon, with strengths from 9.0 to 16.0mg per pouch and 20 pouches per can. If you find the extreme-strength brands too aggressive and want something that delivers a crisp, cool hit without overwhelming you, ICY WOLF hits that middle ground nicely.",
    manufacturer: "Arktic Studio",
    faqs: [
      {
        question: "What flavours does ICY WOLF offer?",
        answer:
          "ICY WOLF pouches are available in fruit, mint flavours across 6 products in our store.",
      },
      {
        question: "What nicotine strengths does ICY WOLF come in?",
        answer:
          "ICY WOLF pouches range from 9.0mg to 16.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a ICY WOLF can?",
        answer:
          "Each ICY WOLF can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on ICY WOLF?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Kelly White",
    slug: "kelly-white",
    tagline: "Premium pouches, timeless quality.",
    description:
      "Kelly White is produced by White Industries AB in Stockholm and launched in 2021 with a distinctive approach: it was designed with women in mind. That does not mean the pouches are any less effective, just that the flavour development, pouch sizing, and brand presentation were considered from a perspective that most snus-heritage brands overlook. The 22-product range spans both slim and mini formats across mint, berry, fruit, and spice flavours, with gentle strengths from 4.0 to 8.0mg per pouch and 20 pouches per can. Made entirely in Sweden. Kelly White is a strong pick for anyone who prefers lower nicotine with diverse, well-crafted flavours in discreet formats.",
    manufacturer: "White Industries AB",
    faqs: [
      {
        question: "What flavours does Kelly White offer?",
        answer:
          "Kelly White pouches are available in berry, fruit, mint, spices flavours across 22 products in our store.",
      },
      {
        question: "What nicotine strengths does Kelly White come in?",
        answer:
          "Kelly White pouches range from 4.0mg to 8.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Kelly White can?",
        answer:
          "Each Kelly White can contains 20 pouches in mini and slim format.",
      },
      {
        question: "Do you offer free delivery on Kelly White?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "KLAR",
    slug: "klar",
    tagline: "Clear taste, clever technology.",
    description:
      "KLAR is arguably the most scientifically innovative nicotine pouch on the market. Launched in 2024 by Emplicure Consumer AB from their bioceramic laboratory in Uppsala, Sweden, KLAR uses patented SERATEK bioceramic technology: a biocompatible calcium compound replaces the standard cellulose filling, enabling up to 80% faster nicotine release than leading brands. The parent company Emplicure has a pharmaceutical background dating to 2014, and it shows. The range is focused: 6 products in mini and slim formats covering mint and original flavours, with strengths from 3.0 to 9.0mg per pouch. If you are the type of user who cares about the science behind your pouch and wants genuinely faster, smoother delivery, KLAR is in a category of one.",
    manufacturer: "KLAR",
    faqs: [
      {
        question: "What flavours does KLAR offer?",
        answer:
          "KLAR pouches are available in mint, mint, original flavours across 6 products in our store.",
      },
      {
        question: "What nicotine strengths does KLAR come in?",
        answer:
          "KLAR pouches range from 3.0mg to 9.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "What is KLAR's bioceramic technology?",
        answer:
          "KLAR uses a patented bioceramic technology in their pouches that enables faster and smoother nicotine release compared to standard pouches, providing a more consistent and long-lasting experience.",
      },
      {
        question: "How many pouches are in a KLAR can?",
        answer:
          "Each KLAR can contains 20 pouches in mini and slim format.",
      },
    ],
  },
  {
    name: "Klint",
    slug: "klint",
    tagline: "Bold taste meets Swedish design.",
    description:
      "Klint is the sibling brand to Fix, both made by Habit Factory in Stockholm. Where Fix focuses on lighter fare, Klint pushes into bolder territory. The brand launched in 2021 after three years of deliberate planning and research since Habit Factory's founding in 2018. The 8-product slim lineup features standout flavours like pink grapefruit, cola, licorice, and mint, with strengths spanning from 8.4mg up to a strong 20.0mg per pouch. Cans contain 18 to 20 pouches in large and slim formats. Klint is for users who already know they like nicotine pouches and want something with more character than the safe, mass-market options.",
    manufacturer: "Habit Factory",
    faqs: [
      {
        question: "What flavours does Klint offer?",
        answer:
          "Klint pouches are available in cola, fruit, licorice, mint flavours across 8 products in our store.",
      },
      {
        question: "What nicotine strengths does Klint come in?",
        answer:
          "Klint pouches range from 8.4mg to 20.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Klint can?",
        answer:
          "Each Klint can contains 18, 20 pouches in large and slim format.",
      },
      {
        question: "Do you offer free delivery on Klint?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "KUMA",
    slug: "kuma",
    tagline: "Extra strong, extra cool.",
    description:
      "KUMA is made by Apres Nicotine AB in Stockholm, the same company behind the Apres brand. The name means bear in Japanese, and the strength matches: every pouch delivers 13.75mg of nicotine, putting KUMA firmly in the extra-strong category. What makes it particularly interesting is the flavour approach. Where most high-strength brands stick to safe mint variants, KUMA goes bold with options like blood orange, banana toffee, cherry, and wintergreen across 4 slim products with 20 pouches per can. This is a brand built for experienced users who find the typical 6 to 8mg pouches too mild and want something that pairs genuine flavour creativity with real strength.",
    manufacturer: "Apres Nicotine AB",
    faqs: [
      {
        question: "What flavours does KUMA offer?",
        answer:
          "KUMA pouches are available in fruit, mint flavours across 4 products in our store.",
      },
      {
        question: "What nicotine strengths does KUMA come in?",
        answer:
          "KUMA pouches contain 13.75mg nicotine per pouch. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a KUMA can?",
        answer:
          "Each KUMA can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on KUMA?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Loop",
    slug: "loop",
    tagline: "Loop in your perfect flavour.",
    description:
      "Loop comes from Another Snus Factory AB in Sweden, which built its own factory in 2019 specifically to make nicotine pouches on their own terms. The brand launched in 2020 and quickly became known for fearless flavour combinations that most competitors would never attempt: jalapeno lime, raspberry licorice, and habanero mint sit alongside more conventional options. Loop also features Instant Rush technology designed for faster nicotine delivery. With 32 products in slim and mini formats, including nicotine-free options, the range covers mint, berry, citrus, coffee, licorice, and fruit at strengths from 0 to 15.6mg per pouch. Cans hold 20 to 22 pouches. If you are bored of the same mint-berry-citrus rotation and want a brand that genuinely experiments, Loop is for you.",
    manufacturer: "Another Snus Factory",
    faqs: [
      {
        question: "What flavours does Loop offer?",
        answer:
          "Loop pouches are available in berry, citrus, coffee, fruit, licorice, mint flavours across 32 products in our store.",
      },
      {
        question: "What nicotine strengths does Loop come in?",
        answer:
          "Loop pouches range from 6.3mg to 15.6mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Loop can?",
        answer:
          "Each Loop can contains 20, 22 pouches in mini and slim format.",
      },
      {
        question: "Do you offer free delivery on Loop?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "LUMI",
    slug: "lumi",
    tagline: "Light up your senses.",
    description:
      "LUMI was founded by Joonas and Sandra Kylmakorpi in Finland, and the name means freshly fallen snow in Finnish. The founders previously ran Taxfreesnus, giving them deep industry knowledge before spending over two years developing their own pouch line. LUMI uses synthetic nicotine rather than tobacco-derived, and the mission is straightforward: make nicotine pouches more accessible, enjoyable, and affordable. The 18-product slim lineup covers mint, citrus, fruit, and mixed flavours with strengths from 6.0 to 18.0mg per pouch. A standout feature is the 100-pouch mega can option, which offers exceptional value for regular users. Clean Scandinavian design, honest pricing, and a range that covers beginners through experienced users alike.",
    manufacturer: "LUMI",
    faqs: [
      {
        question: "What flavours does LUMI offer?",
        answer:
          "LUMI pouches are available in citrus, fruit, mint, mixed flavours across 18 products in our store.",
      },
      {
        question: "What nicotine strengths does LUMI come in?",
        answer:
          "LUMI pouches range from 6.0mg to 18.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "Does LUMI offer a mega can?",
        answer:
          "Yes — LUMI offers a 100-pouch mega can option alongside their standard 20-pouch cans, making it a great value choice for regular users.",
      },
      {
        question: "How many pouches are in a LUMI can?",
        answer:
          "Each LUMI can contains 20, 100 pouches in slim format.",
      },
    ],
  },
  {
    name: "Lundgrens",
    slug: "lundgrens",
    tagline: "Traditional Swedish craft, tobacco-free.",
    description:
      "Lundgrens by Fiedler & Lundgren is one of the few brands that uses the traditional normal (large) format instead of the now-standard slim. That deliberate choice gives Lundgrens a more classic, snus-like feel under the lip that long-time snus users will immediately recognise. The 10-product lineup draws on Swedish heritage with flavours including berry, fruit, licorice, mint, and tobacco, and each can holds 21 pouches. Strengths stay in the moderate 6.0 to 10.0mg per pouch range. If you grew up with traditional snus and want a tobacco-free pouch that still feels familiar in the mouth rather than paper-thin and modern, Lundgrens bridges that gap between old-school and new better than almost anyone.",
    manufacturer: "Fiedler & Lundgren",
    faqs: [
      {
        question: "What flavours does Lundgrens offer?",
        answer:
          "Lundgrens pouches are available in berry, fruit, licorice, mint, tobacco flavours across 10 products in our store.",
      },
      {
        question: "What nicotine strengths does Lundgrens come in?",
        answer:
          "Lundgrens pouches range from 6.0mg to 10.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "What makes Lundgrens different from other brands?",
        answer:
          "Lundgrens uses a normal (large) format rather than slim, giving a more traditional snus-like feel. Each can contains 21 pouches, and the brand is known for its Swedish heritage flavour profiles.",
      },
      {
        question: "How many pouches are in a Lundgrens can?",
        answer:
          "Each Lundgrens can contains 21 pouches in normal format.",
      },
    ],
  },
  {
    name: "MAGGIE",
    slug: "maggie",
    tagline: "Caribbean-inspired flavour explosions.",
    description:
      "MAGGIE draws inspiration from Caribbean culture, specifically the Magnum Tonic Wine tradition from Jamaica. This gives the brand a completely unique identity in a market dominated by Scandinavian minimalism. The 12-product slim lineup features genuinely distinctive flavours like cherry tonic wine and tropical cola that you simply will not find from other brands. Strengths are serious, running from 13.6mg up to a formidable 45.0mg per pouch, with 20 pouches per can. MAGGIE is built for experienced users who want high nicotine paired with bold, culturally rooted flavour profiles. If your usual rotation feels too safe and you want something with real character and heritage behind it, MAGGIE is a refreshing change of pace.",
    manufacturer: "MAGGIE",
    faqs: [
      {
        question: "What flavours does MAGGIE offer?",
        answer:
          "MAGGIE pouches are available in cola, fruit flavours across 12 products in our store.",
      },
      {
        question: "What nicotine strengths does MAGGIE come in?",
        answer:
          "MAGGIE pouches range from 13.6mg to 45.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a MAGGIE can?",
        answer:
          "Each MAGGIE can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on MAGGIE?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "MYNT",
    slug: "mynt",
    tagline: "Mint lovers, meet your match.",
    description:
      "MYNT is produced by Sun Products Ltd, a company with over 75 years of manufacturing experience that pivoted into oral nicotine in 2019. The brand is export-focused with a strong emphasis on research and development. As the name suggests, mint is the core identity here, though the 18-product slim lineup also branches into sweet and fruit varieties. Strengths cover a wide range from 6.0 to 18.0mg per pouch, with 20 pouches per can. If you are a mint enthusiast who wants depth and variety within that flavour family rather than the token one or two mint options most brands offer, MYNT delivers exactly what it promises.",
    manufacturer: "MYNT",
    faqs: [
      {
        question: "What flavours does MYNT offer?",
        answer:
          "MYNT pouches are available in fruit, mint, sweet, sweet flavours across 18 products in our store.",
      },
      {
        question: "What nicotine strengths does MYNT come in?",
        answer:
          "MYNT pouches range from 6.0mg to 18.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a MYNT can?",
        answer:
          "Each MYNT can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on MYNT?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "NEAFS",
    slug: "neafs",
    tagline: "Next-level nicotine pouches.",
    description:
      "NEAFS is produced by ESON in the UK, founded in 2021 with a focus on pharmaceutical-grade nicotine and plant-based materials. The brand uses food-grade flavourings and sweeteners throughout its range. One practical advantage: each can holds 25 pouches instead of the standard 20, giving you 25% more per purchase. The 18-product slim lineup covers berry, fruit, and mint flavours with strengths from 8.0 to 16.0mg per pouch. Worth noting: NEAFS also makes heated tobacco sticks, but the products in our store are exclusively their nicotine pouch line. A solid UK-made option for users who value quality ingredients and a bit more value per can.",
    manufacturer: "NEAFS",
    faqs: [
      {
        question: "What flavours does NEAFS offer?",
        answer:
          "NEAFS pouches are available in berry, fruit, mint flavours across 18 products in our store.",
      },
      {
        question: "What nicotine strengths does NEAFS come in?",
        answer:
          "NEAFS pouches range from 8.0mg to 16.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "Are NEAFS pouches the same as NEAFS heated sticks?",
        answer:
          "No — the NEAFS products in our store are slim nicotine pouches, not heated tobacco sticks. Each can contains 25 tobacco-free nicotine pouches.",
      },
      {
        question: "How many pouches are in a NEAFS can?",
        answer:
          "Each NEAFS can contains 25 pouches in slim format.",
      },
    ],
  },
  {
    name: "NOiS",
    slug: "nois",
    tagline: "Make some noise with your pouch.",
    description:
      "NOiS is manufactured by HRJ Production in Estonia and has been operating for over six years, building a particularly strong following in Finland where it has become one of the top-selling nicotine pouch brands. The company also offers white-label and OEM manufacturing for other brands, which speaks to their production capabilities. The 10-product slim lineup covers mint, berry, eucalyptus, and fruit flavours with one of the wider strength ranges available, spanning 6.0 to 25.0mg per pouch. Cans hold 22 to 27 pouches, which is notably more generous than the industry standard of 20. NOiS quietly delivers quality, value, and variety without the flashy marketing budgets of the bigger names.",
    manufacturer: "HRJ Production",
    faqs: [
      {
        question: "What flavours does NOiS offer?",
        answer:
          "NOiS pouches are available in berry, eucalyptus, fruit, mint flavours across 10 products in our store.",
      },
      {
        question: "What nicotine strengths does NOiS come in?",
        answer:
          "NOiS pouches range from 6.0mg to 25.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a NOiS can?",
        answer:
          "Each NOiS can contains 22, 27 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on NOiS?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "ON!",
    slug: "on",
    tagline: "Small pouch, big experience.",
    description:
      "ON! is backed by Altria and manufactured by Helix Innovations in Virginia, making it the number two nicotine pouch brand in the United States with roughly 20% market share. The brand has earned FDA authorisation for several of its products. What distinguishes ON! is the mini format: these are noticeably smaller and drier than most competitors, making them extremely discreet. The 5 products in our store cover coffee and mint flavours with strengths from 3.0 to 9.28mg per pouch and 20 pouches per can. Each pouch is designed for sessions of up to 20 minutes. If discretion is your top priority and you want a brand with serious regulatory backing, ON! is one of the most established names in the category.",
    manufacturer: "Burger Söhne (Altria)",
    faqs: [
      {
        question: "What flavours does ON! offer?",
        answer:
          "ON! pouches are available in coffee, mint flavours across 5 products in our store.",
      },
      {
        question: "What nicotine strengths does ON! come in?",
        answer:
          "ON! pouches range from 3.0mg to 9.28mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a ON! can?",
        answer:
          "Each ON! can contains 20 pouches in mini format.",
      },
      {
        question: "Do you offer free delivery on ON!?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Pura",
    slug: "pura",
    tagline: "Pure energy, zero nicotine.",
    description:
      "Pura is not a nicotine pouch at all. Instead, these are caffeine-powered energy pouches that deliver 180mg of caffeine per pouch with zero nicotine, zero tobacco, zero sugar, and zero calories. Pop one under your lip for a discreet energy boost during workouts, long drives, or afternoon slumps without reaching for another coffee or energy drink. The 2-product slim lineup covers mint and fruit flavours. Pura is ideal for users who already enjoy the pouch format and want the same convenience for caffeine delivery, or for anyone curious about the format who does not want nicotine at all. A genuinely different product in our catalogue.",
    manufacturer: "Pura",
    faqs: [
      {
        question: "What flavours does Pura offer?",
        answer:
          "Pura energy pouches are available in fruit, mint flavours across 2 products in our store.",
      },
      {
        question: "How much caffeine is in Pura pouches?",
        answer:
          "Each Pura pouch contains 180mg caffeine. These are nicotine-free energy pouches — they contain no tobacco or nicotine.",
      },
      {
        question: "Do you offer free delivery on Pura?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "rabbit",
    slug: "rabbit",
    tagline: "High-strength pouches that hop above the rest.",
    description:
      "Rabbit is one of the highest-strength brands in our entire catalogue. With nicotine content ranging from 26.0 to 50.0mg per pouch, these are built exclusively for experienced users with well-established tolerance levels. The brand uses a herbal blend in its tobacco-free formulation and offers 15 slim products across an unusually wide flavour spectrum: berry, candy, citrus, cola, energy drink, fruit, hemp, and mint, including some bold options like jalapeno lime and bubble gum. Twenty pouches per can. Rabbit makes no pretence about what it is. This is not a brand for beginners or casual users. If you already know you need serious strength and want flavour variety at the extreme end of the scale, Rabbit delivers without apology.",
    manufacturer: "rabbit",
    faqs: [
      {
        question: "What flavours does rabbit offer?",
        answer:
          "rabbit pouches are available in berry, candy, citrus, cola, energy drink, fruit, hemp, mint flavours across 15 products in our store.",
      },
      {
        question: "What nicotine strengths does rabbit come in?",
        answer:
          "rabbit pouches range from 26.0mg to 50.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a rabbit can?",
        answer:
          "Each rabbit can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on rabbit?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "RAVE",
    slug: "rave",
    tagline: "Party-ready pouches with bold flavour.",
    description:
      "RAVE takes its cues from dance and rave culture, and the brand identity is accordingly vibrant and energetic. What makes RAVE interesting is the hybrid approach: alongside standard nicotine pouches, the lineup also includes caffeine energy pouches for users who want a boost without nicotine. The 26-product slim range covers cola, berry, candy, citrus, fruit, and mint flavours with nicotine strengths from 9.6 to 19.5mg per pouch and 20 pouches per can. The caffeine pouches deliver 80 to 100mg per pouch. Tropical and fruity profiles dominate the flavour lineup. If you want a brand that feels more fun and less clinical than the typical Scandinavian minimalist approach, RAVE brings genuine personality to the pouch experience.",
    manufacturer: "RAVE",
    faqs: [
      {
        question: "What flavours does RAVE offer?",
        answer:
          "RAVE pouches are available in berry, candy, citrus, cola, fruit, mint, berry flavours across 26 products in our store.",
      },
      {
        question: "How much caffeine is in RAVE pouches?",
        answer:
          "Each RAVE pouch contains 100mg and 80mg caffeine. These are nicotine-free energy pouches — they contain no tobacco or nicotine.",
      },
      {
        question: "How many pouches are in a RAVE can?",
        answer:
          "Each RAVE can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on RAVE?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "RELX",
    slug: "relx",
    tagline: "Ultra-thin innovation meets bold flavour.",
    description:
      "RELX is a major global vape company that has expanded into nicotine pouches with its AirPouch format, marketed as the world's thinnest nicotine pouch. Using plant-based fibres and food-grade flavourings, the AirPouch delivers up to 2x faster nicotine release than conventional pouches while being extremely discreet at just 2g per can. The 7-product lineup covers citrus, berry, cola, and mint flavours with strengths from 9.0 to 20.0mg per pouch. Each pouch lasts up to 30 minutes with gradual nicotine and flavour release. If you are coming from the vaping world and want something you can use anywhere without a device, RELX brings that same innovation-first mindset to the pouch format.",
    manufacturer: "RELX Technology",
    faqs: [
      {
        question: "What flavours does RELX offer?",
        answer:
          "RELX pouches are available in berry, citrus, cola, mint flavours across 7 products in our store.",
      },
      {
        question: "What nicotine strengths does RELX come in?",
        answer:
          "RELX pouches range from 9.0mg to 20.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "What is the RELX AirPouch format?",
        answer:
          "RELX AirPouch is an ultra-thin nicotine pouch format that weighs just 2g per can, making it one of the most discreet pouch formats available. Despite the ultra-thin design, each can contains 20 pouches.",
      },
      {
        question: "How many pouches are in a RELX can?",
        answer:
          "Each RELX can contains 20 pouches in slim format.",
      },
    ],
  },
  {
    name: "Royal White",
    slug: "royal-white",
    tagline: "The royal mint experience.",
    description:
      "Royal White is made by Nicobros in Estonia and focuses on doing one thing well: a premium fresh mint slim pouch with 8.3mg nicotine per pouch. The semi-moist, soft pouch design is engineered for 30 to 40 minutes of consistent flavour longevity, and each can holds 22 pouches rather than the standard 20. Sometimes the best brands are the ones that resist the temptation to offer 30 flavours and instead perfect a single experience. If mint is your go-to and you want a reliable, well-made pouch with a bit of extra value in the can, Royal White is a quiet achiever worth trying.",
    manufacturer: "Nicobros",
    faqs: [
      {
        question: "What flavours does Royal White offer?",
        answer:
          "Royal White pouches are available in mint flavours across 1 products in our store.",
      },
      {
        question: "What nicotine strengths does Royal White come in?",
        answer:
          "Royal White pouches contain 8.3mg nicotine per pouch. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Royal White can?",
        answer:
          "Each Royal White can contains 22 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Royal White?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "RUSH",
    slug: "rush",
    tagline: "Rush into bold tropical flavours.",
    description:
      "RUSH is produced by Dholokia Tobacco, one of the largest and most respected nicotine pouch manufacturers globally. The brand launched in 2019 with a clear mission: provide a premium tobacco-free alternative for adult nicotine users. The 9-product slim lineup leans into tropical and fruity territory with flavours like mango freeze, berry, and mint. Strengths range from 11.2 to 21.0mg per pouch, putting RUSH in the medium-to-strong category, with 20 pouches per can. The manufacturing pedigree behind RUSH means consistent quality even if the brand name does not carry the same recognition as ZYN or VELO. A solid option for users who want strong, fruit-forward pouches from a manufacturer that knows what it is doing.",
    manufacturer: "Dholokia Tobacco",
    faqs: [
      {
        question: "What flavours does RUSH offer?",
        answer:
          "RUSH pouches are available in berry, fruit, mint, berry flavours across 9 products in our store.",
      },
      {
        question: "What nicotine strengths does RUSH come in?",
        answer:
          "RUSH pouches range from 11.2mg to 21.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a RUSH can?",
        answer:
          "Each RUSH can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on RUSH?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Siberia",
    slug: "siberia",
    tagline: "Legendary strength since day one.",
    description:
      "Siberia is legendary. Made by GN Tobacco in Sweden (originally founded as Snus AB in 2004, renamed in 2007), the brand earned its reputation as the strongest snus in the world long before nicotine pouches existed. Siberia Red in particular has cult status among strength-seeking users. In 2022, GN Tobacco expanded Siberia into the tobacco-free pouch format while maintaining the brand's defining characteristic: 33mg/g nicotine concentration across every product. The 7 products come in slim, normal, mini, and large formats, with per-pouch strength ranging from 16.5 to a staggering 49.5mg depending on format. Cans hold 12 to 22 pouches. Siberia is for users who already know they want extreme strength and have the tolerance to handle it.",
    manufacturer: "GN Tobacco",
    faqs: [
      {
        question: "What flavours does Siberia offer?",
        answer:
          "Siberia pouches are available in mint flavours across 7 products in our store.",
      },
      {
        question: "What nicotine strengths does Siberia come in?",
        answer:
          "Siberia pouches range from 16.5mg to 49.5mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "Why is Siberia so strong?",
        answer:
          "Siberia uses 33mg/g nicotine concentration across all its products, making it one of the strongest nicotine pouch brands on the market. Per-pouch strength varies by format, ranging from 16.5mg to 49.5mg.",
      },
      {
        question: "How many pouches are in a Siberia can?",
        answer:
          "Each Siberia can contains 12, 14, 15, 16, 20, 22 pouches in large and mini and normal and slim format.",
      },
    ],
  },
  {
    name: "Skruf",
    slug: "skruf",
    tagline: "Swedish heritage, modern pouches.",
    description:
      "Skruf was founded in 2002 by Adam Gillberg and Jonas Engwall with the explicit goal of challenging Swedish Match's dominance in Swedish smokeless products. They succeeded: Skruf is now the second-largest smokeless product manufacturer in Sweden. The tobacco-free Super White line launched in 2018 and uses natural plant fibre fillings. With 15 slim products covering berry, fruit, licorice, and mint, strengths range from 6.0 to 12.0mg per pouch. Cans hold 20 to 26 pouches depending on the product. Skruf has become particularly popular in the UK despite its Swedish roots. If you want a brand with real heritage, proven quality, and the credibility of being a genuine industry challenger rather than a corporate spinoff, Skruf is an excellent choice.",
    manufacturer: "Skruf Snus AB",
    faqs: [
      {
        question: "What flavours does Skruf offer?",
        answer:
          "Skruf pouches are available in berry, fruit, licorice, mint flavours across 15 products in our store.",
      },
      {
        question: "What nicotine strengths does Skruf come in?",
        answer:
          "Skruf pouches range from 6.0mg to 12.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Skruf can?",
        answer:
          "Each Skruf can contains 20, 22, 24, 26 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Skruf?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Smögen",
    slug: "sm-gen",
    tagline: "Coastal Swedish character in every pouch.",
    description:
      "Smogen launched in late 2024 from Smogensnus AB and draws its entire identity from the Swedish west coast. Named after the coastal town of Smogen, the brand evokes salty cliffs, archipelago winds, and maritime life through both its design and flavour philosophy. The 3-product slim lineup features evocatively named options: Stormy Licorice, West Coast Berries, and Seabreeze Mint, each delivering 8mg nicotine per pouch with 20 pouches per can. This is one of the newest brands in our catalogue and one of the most distinctive in terms of identity. If you appreciate brands that tell a story and connect their products to a sense of place, Smogen offers something genuinely different.",
    manufacturer: "Smogensnus AB",
    faqs: [
      {
        question: "What flavours does Smögen offer?",
        answer:
          "Smögen pouches are available in berry, licorice, mint flavours across 3 products in our store.",
      },
      {
        question: "What nicotine strengths does Smögen come in?",
        answer:
          "Smögen pouches contain 8.0mg nicotine per pouch. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Smögen can?",
        answer:
          "Each Smögen can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Smögen?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "SNOBERG",
    slug: "snoberg",
    tagline: "Swedish pouches at their finest.",
    description:
      "SNOBERG is manufactured by NICOMPOLAND in Poland but positions itself firmly around Scandinavian design principles. The brand emphasises elegance in every detail, from the clean can aesthetics to the pouch construction. The 12-product slim lineup focuses on berry, fruit, and mint flavours with a mint-forward strategy across the range. Strengths sit in the moderate 6.5 to 10.0mg per pouch bracket with 20 pouches per can. SNOBERG is a good everyday option for users who want reliable mid-strength pouches with a polished presentation. Not trying to be the strongest or the most innovative, just consistently well-made.",
    manufacturer: "NICOMPOLAND",
    faqs: [
      {
        question: "What flavours does SNOBERG offer?",
        answer:
          "SNOBERG pouches are available in berry, fruit, mint flavours across 12 products in our store.",
      },
      {
        question: "What nicotine strengths does SNOBERG come in?",
        answer:
          "SNOBERG pouches range from 6.5mg to 10.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a SNOBERG can?",
        answer:
          "Each SNOBERG can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on SNOBERG?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Snowman",
    slug: "snowman",
    tagline: "Cool as ice, bold as winter.",
    description:
      "Snowman comes from Tridots in Denmark and delivers exactly what the branding promises: icy, intense flavour experiences. The brand leans into bold, trendy flavour profiles with 12 slim products covering mint, berry, citrus, and fruit. Strengths sit in a tight 9.0 to 12.0mg per pouch band with 20 pouches per can, keeping things firmly in the medium-strength zone. The Danish manufacturing and focus on refreshing intensity gives Snowman a clear identity in a crowded market. If you enjoy pouches with a cool, icy kick and want consistent strength without the extreme ends of the spectrum, Snowman is a straightforward, well-executed choice.",
    manufacturer: "Tridots",
    faqs: [
      {
        question: "What flavours does Snowman offer?",
        answer:
          "Snowman pouches are available in berry, citrus, fruit, mint flavours across 12 products in our store.",
      },
      {
        question: "What nicotine strengths does Snowman come in?",
        answer:
          "Snowman pouches range from 9.0mg to 12.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Snowman can?",
        answer:
          "Each Snowman can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Snowman?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "STNG",
    slug: "stng",
    tagline: "Sting your senses with every pouch.",
    description:
      "STNG is a Swedish brand built with a philosophy of being made for those who actually use the product. What that means in practice is a hybrid pouch size that sits between mini and slim, designed for better delivery and comfort based on real user feedback. The 10-product lineup features creative flavours like berry seltzer, candy, cola cherry, bubble gum, and several mint variants. Strengths split into two tiers: Regular at 9.2mg per pouch and MAX at 27.5mg per pouch, with 20 pouches per can. The playful, nostalgic flavour naming and user-testing ethos give STNG a distinct personality. If you want a brand that feels like it was designed by pouch enthusiasts rather than a marketing department, give STNG a try.",
    manufacturer: "Mochi AB",
    faqs: [
      {
        question: "What flavours does STNG offer?",
        answer:
          "STNG pouches are available in berry, candy, cola, mint flavours across 10 products in our store.",
      },
      {
        question: "What nicotine strengths does STNG come in?",
        answer:
          "STNG pouches range from 9.2mg to 27.5mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a STNG can?",
        answer:
          "Each STNG can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on STNG?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Swag",
    slug: "swag",
    tagline: "Fresh flavour with swagger.",
    description:
      "Swag is made by AM Swedish, the same company behind the 24k Snus brand. In a market dominated by minimalist Scandinavian design and mint-heavy flavour ranges, Swag deliberately goes the other direction: bold, colourful branding and a focus on non-mint flavours using soft plant fibre pouches. The current 2-product slim lineup covers berry flavours with strengths from 7.2 to 15.0mg per pouch and 20 pouches per can. The brand clearly targets a younger demographic that wants their pouch to have some visual personality. Swag is still a small range, but it represents an interesting counter-trend in a category where every other brand seems to compete on who can look the most Scandinavian.",
    manufacturer: "AM Swedish",
    faqs: [
      {
        question: "What flavours does Swag offer?",
        answer:
          "Swag pouches are available in berry flavours across 2 products in our store.",
      },
      {
        question: "What nicotine strengths does Swag come in?",
        answer:
          "Swag pouches range from 7.2mg to 15.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Swag can?",
        answer:
          "Each Swag can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Swag?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "TOGO",
    slug: "togo",
    tagline: "Great taste to go.",
    description:
      "TOGO is a Swedish-made brand built around the idea of bold, modern nicotine pouches that fit seamlessly into your lifestyle. The name says it all: these are designed for people on the move. The 4-product slim lineup features light, refreshing flavours including strawberry melonade, berry, citrus, and mint. Strengths stay in a comfortable 8.0 to 10.0mg per pouch range with 20 pouches per can. TOGO does not try to compete on extreme strength or massive flavour variety. Instead, it focuses on delivering a reliable, pleasant everyday pouch experience at medium strength. A good option if you want something straightforward and Swedish-made without overthinking it.",
    manufacturer: "TOGO",
    faqs: [
      {
        question: "What flavours does TOGO offer?",
        answer:
          "TOGO pouches are available in berry, citrus, fruit, mint flavours across 4 products in our store.",
      },
      {
        question: "What nicotine strengths does TOGO come in?",
        answer:
          "TOGO pouches range from 8.0mg to 10.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a TOGO can?",
        answer:
          "Each TOGO can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on TOGO?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "TYR",
    slug: "tyr",
    tagline: "Norse-inspired strength and freshness.",
    description:
      "TYR draws its identity from Norse mythology, named after the god of war and justice. The brand channels that heritage into 4 slim nicotine pouches with a clean, balanced character. Flavours cover mint, berry, and citrus, with each pouch delivering around 12mg nicotine and 20 pouches per can. TYR keeps things focused and uncomplicated: strong enough to satisfy without venturing into extreme territory, and a tight flavour lineup that covers the essentials well. If you appreciate brands with a clear identity and do not need dozens of options to find something you enjoy, TYR is a solid, no-fuss contender in the mid-strength category.",
    manufacturer: "TYR",
    faqs: [
      {
        question: "What flavours does TYR offer?",
        answer:
          "TYR pouches are available in berry, citrus, mint flavours across 4 products in our store.",
      },
      {
        question: "What nicotine strengths does TYR come in?",
        answer:
          "TYR pouches range from 12.0mg to 12.2mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a TYR can?",
        answer:
          "Each TYR can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on TYR?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Velo",
    slug: "velo",
    tagline: "The world's favourite nicotine pouch.",
    description:
      "Velo is British American Tobacco's flagship nicotine pouch brand and one of the two biggest names in the global market alongside ZYN. Originally launched as Lyft before being rebranded, Velo has grown explosively, with volume up 55% in 2024 to 8.3 billion pouches sold worldwide. The brand now generates nearly 800 million pounds in annual revenue. With 53 products in slim and mini formats including nicotine-free options, the range covers berry, citrus, fruit, licorice, mint, and more at strengths from 0 to 17mg per pouch. Velo Plus, launching with synthetic nicotine, represents the next generation. The sheer scale of the range means there is a Velo for almost every preference. If you want the safety of a mainstream, globally established brand with massive variety, Velo is hard to beat.",
    manufacturer: "British American Tobacco",
    faqs: [
      {
        question: "What flavours does Velo offer?",
        answer:
          "Velo pouches are available in berry, citrus, flower, fruit, licorice, mint, strawberry flavours across 53 products in our store.",
      },
      {
        question: "What nicotine strengths does Velo come in?",
        answer:
          "Velo pouches range from 4.0mg to 17.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Velo can?",
        answer:
          "Each Velo can contains 15, 20 pouches in mini and slim format.",
      },
      {
        question: "Do you offer free delivery on Velo?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "VID",
    slug: "vid",
    tagline: "Wide range, bold taste.",
    description:
      "VID is another brand from Kurbits Snus AB in Sweden, the same company behind AVANT. Launched in 2021, VID uses laboratory-manufactured nicotine rather than tobacco-derived, which means the nicotine is synthesised rather than extracted from tobacco plants. The 6-product slim lineup covers berry, coffee, cola, fruit, and mint flavours with strengths in the moderate 7.2 to 9.6mg per pouch range and 20 pouches per can. VID occupies a comfortable middle ground: not too strong, not too mild, with enough flavour variety for daily rotation. A clean, Swedish-made option for users who prefer knowing their nicotine comes from a lab rather than a tobacco field.",
    manufacturer: "Kurbits Snus AB",
    faqs: [
      {
        question: "What flavours does VID offer?",
        answer:
          "VID pouches are available in berry, coffee, cola, fruit, mint flavours across 6 products in our store.",
      },
      {
        question: "What nicotine strengths does VID come in?",
        answer:
          "VID pouches range from 7.2mg to 9.6mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a VID can?",
        answer:
          "Each VID can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on VID?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "White Gold",
    slug: "white-gold",
    tagline: "Premium quality at every strength.",
    description:
      "White Gold is made by Snustrading i Nykoping AB in Sweden using natural plant fibres, purified nicotine, and food-grade flavourings. The brand has been gaining traction across the EU and UAE markets thanks to competitive pricing that undercuts most premium brands while maintaining Swedish manufacturing quality. The 8-product slim lineup covers fruit, citrus, coffee, and mint flavours, all at a consistent 6mg nicotine per pouch with 20 pouches per can. That single-strength approach simplifies the choice: if 6mg works for you, just pick your favourite flavour. White Gold is a smart option for everyday users who want good quality Swedish pouches without paying premium-brand prices.",
    manufacturer: "Snustrading i Nykoping AB",
    faqs: [
      {
        question: "What flavours does White Gold offer?",
        answer:
          "White Gold pouches are available in caffee, citrus, fruit, mint flavours across 8 products in our store.",
      },
      {
        question: "What nicotine strengths does White Gold come in?",
        answer:
          "White Gold pouches contain 6.0mg nicotine per pouch. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a White Gold can?",
        answer:
          "Each White Gold can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on White Gold?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "white-fox",
    slug: "white-fox",
    tagline: "The white fox — cool and iconic.",
    description:
      "White Fox was launched in 2019 by GN Tobacco as their first tobacco-free nicotine pouch, and it quickly became iconic. GN Tobacco, based in Enkoping, Sweden, is one of the largest smokeless product manufacturers in the market and also makes Siberia. White Fox was specifically created to fill a gap for experienced users who wanted a strong tobacco-free alternative to traditional snus products like Siberia and Oden. The brand focuses primarily on cool mint across 5 products in slim and normal formats, with strengths from 12.0 to 24.0mg per pouch and 15 to 20 pouches per can. This is a brand made by veterans, for veterans of the nicotine pouch world.",
    manufacturer: "GN Tobacco",
    faqs: [
      {
        question: "What flavours does white-fox offer?",
        answer:
          "white-fox pouches are available in mint flavours across 5 products in our store.",
      },
      {
        question: "What nicotine strengths does white-fox come in?",
        answer:
          "white-fox pouches range from 12.0mg to 24.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a white-fox can?",
        answer:
          "Each white-fox can contains 15, 20 pouches in normal and slim format.",
      },
      {
        question: "Do you offer free delivery on white-fox?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "X-booster",
    slug: "x-booster",
    tagline: "Caffeine energy in a pouch.",
    description:
      "X-Booster comes from Luna Corporate, the same Polish company behind 77 Pouches, but these are a completely different product: caffeine energy pouches with zero nicotine. Each pouch delivers 40 to 80mg of caffeine across 8 slim-format products in energy drink, mint, coffee, and candy flavours. Luna Corporate brings over 20 years of pouch manufacturing experience to the format. X-Booster is designed for users who want a discreet energy boost without nicotine, whether during a workout, a long meeting, or an afternoon slump. If you already enjoy the pouch format and want to add a caffeine option to your rotation, X-Booster fills that niche.",
    manufacturer: "Luna Corporate",
    faqs: [
      {
        question: "What flavours does X-booster offer?",
        answer:
          "X-booster energy pouches are available in candy, coffee, energy drink, mint flavours across 8 products in our store.",
      },
      {
        question: "How much caffeine is in X-booster pouches?",
        answer:
          "Each X-booster pouch contains 40mg and 80mg caffeine. These are nicotine-free energy pouches — they contain no tobacco or nicotine.",
      },
      {
        question: "How many pouches are in a X-booster can?",
        answer:
          "Each X-booster can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on X-booster?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "XO",
    slug: "xo",
    tagline: "Extra ordinary pouches.",
    description:
      "XO is manufactured by BAS Nordic AB in Malmo, Sweden, with possible Dutch origins dating to 2018. The brand takes a simple, consistent approach: every one of its 10 slim products delivers exactly 8mg nicotine per pouch with 20 pouches per can. Flavours cover berry, citrus, cola, fruit, and mint. That uniformity is actually a strength for users who have found their sweet spot at 8mg and just want to explore different flavours without worrying about accidentally grabbing something too strong or too weak. XO is a no-surprises brand that does the basics well.",
    manufacturer: "BAS Nordic AB",
    faqs: [
      {
        question: "What flavours does XO offer?",
        answer:
          "XO pouches are available in berry, citrus, cola, fruit, mint flavours across 10 products in our store.",
      },
      {
        question: "What nicotine strengths does XO come in?",
        answer:
          "XO pouches contain 8.0mg nicotine per pouch. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a XO can?",
        answer:
          "Each XO can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on XO?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "XPCT",
    slug: "xpct",
    tagline: "Expect more — 308 pouches per mega can.",
    description:
      "XPCT, made by LIW Innovation AB in Hokerum, Sweden, has the most distinctive packaging concept in our catalogue: supersize mega cans holding up to 308 pouches at 200g net weight. That is roughly 15 times what a standard can holds. The lid includes a built-in refill mini-can for on-the-go use. Beyond the sheer value proposition, there is an eco-conscious angle: fewer purchases means less packaging waste over time. The 6-product slim lineup covers berry, cola, fruit, and licorice flavours with strengths from 6.5 to 10.4mg per pouch. If you go through pouches at a steady pace and want to stop buying cans every few days, XPCT's mega format makes practical and environmental sense.",
    manufacturer: "LIW Innovation AB",
    faqs: [
      {
        question: "What flavours does XPCT offer?",
        answer:
          "XPCT pouches are available in berry, cola, fruit, licorice flavours across 6 products in our store.",
      },
      {
        question: "What nicotine strengths does XPCT come in?",
        answer:
          "XPCT pouches range from 6.5mg to 10.4mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in an XPCT mega can?",
        answer:
          "Each XPCT mega can contains 308 slim pouches with a net weight of 200g — the largest cans available on the market. The lid includes a built-in refill mini-can for on-the-go use.",
      },
      {
        question: "Do you offer free delivery on XPCT?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "XQS",
    slug: "xqs",
    tagline: "Exquisite flavour, exceptional quality.",
    description:
      "XQS has one of the longest origin stories in the nicotine pouch world. Founded in 2005 by two Swedish snus users in Jamtland who wanted to quit snus, the brand spent nearly two decades building its reputation before being acquired by Scandinavian Tobacco Group in April 2023. That makes XQS a sibling brand to ACE. The 28-product slim lineup is one of the most comprehensive available, covering berry, candy, citrus, fruit, licorice, and mint along with nicotine-free and caffeine options. Strengths range from 0 to 11.2mg per pouch with 20 pouches per can. XQS combines genuine independent heritage with the backing of a major tobacco group, giving it both credibility and resources.",
    manufacturer: "Scandinavian Tobacco Group",
    faqs: [
      {
        question: "What flavours does XQS offer?",
        answer:
          "XQS pouches are available in berry, candy, citrus, fruit, licorice, mint flavours across 28 products in our store.",
      },
      {
        question: "What nicotine strengths does XQS come in?",
        answer:
          "XQS pouches range from 4.0mg to 11.2mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a XQS can?",
        answer:
          "Each XQS can contains 20 pouches in slim and slim format.",
      },
      {
        question: "Do you offer free delivery on XQS?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Zeronito",
    slug: "zeronito",
    tagline: "All the flavour, zero nicotine.",
    description:
      "Zeronito is made by Microzero AB, a family-run company in Gothenburg founded in 2020, and occupies a completely unique position: zero nicotine, zero tobacco, zero caffeine. These are purely flavour-experience pouches made from natural plant fibres including oats and cocoa vegetable fibres. The 18-product range in slim and large formats covers berry, coffee, cola, fruit, licorice, and mint with all production and lab testing done in-house. Zeronito is designed for users who enjoy the ritual and sensation of having a pouch under their lip but do not want any active substances. Whether you are cutting back on nicotine, taking a tolerance break, or simply curious about the format without commitment, Zeronito gives you the experience with none of the nicotine.",
    manufacturer: "Microzero AB",
    faqs: [
      {
        question: "What flavours does Zeronito offer?",
        answer:
          "Zeronito nicotine-free pouches come in berry, coffee, cola, fruit, licorice, mint flavours, with 18 products available in our store.",
      },
      {
        question: "Does Zeronito contain nicotine?",
        answer:
          "No. Zeronito pouches are completely nicotine-free and tobacco-free. They are designed for users who enjoy the pouch format without any nicotine.",
      },
      {
        question: "How many pouches are in a Zeronito can?",
        answer:
          "Each Zeronito can contains 20 pouches in large and slim format.",
      },
      {
        question: "Do you offer free delivery on Zeronito?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "Zeus",
    slug: "zeus",
    tagline: "God-tier flavour and strength.",
    description:
      "Zeus is a newcomer from Vivasnus in Latvia and Estonia, registered in 2023 and already making waves with one of the larger product ranges for a young brand. The 32-product slim lineup covers berry, candy, citrus, fruit, mint, and spices with strengths spanning a wide 4.0 to 25.0mg per pouch and 20 pouches per can. The breadth of the range is impressive for such a new brand, covering everything from gentle everyday use to serious high-strength options. Zeus is still establishing its reputation, but the combination of variety, accessible pricing, and a full strength spectrum makes it worth watching as it matures in the market.",
    manufacturer: "Vivasnus",
    faqs: [
      {
        question: "What flavours does Zeus offer?",
        answer:
          "Zeus pouches are available in berry, candy, citrus, fruit, mint, spices flavours across 32 products in our store.",
      },
      {
        question: "What nicotine strengths does Zeus come in?",
        answer:
          "Zeus pouches range from 4.0mg to 25.0mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a Zeus can?",
        answer:
          "Each Zeus can contains 20 pouches in slim format.",
      },
      {
        question: "Do you offer free delivery on Zeus?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
  {
    name: "zyn",
    slug: "zyn",
    tagline: "The original, the benchmark.",
    description:
      "ZYN is the brand that launched the modern nicotine pouch category. Developed by Swedish Match and introduced in Scandinavia in 2014, ZYN now commands over 70% of the US nicotine pouch market after Philip Morris International acquired Swedish Match for $16 billion in November 2022. The numbers are staggering: 384.8 million cans sold worldwide in 2023, up 62% year-on-year, with PMI investing over $800 million in new US manufacturing capacity. Our catalogue includes 52 ZYN products in slim and mini formats covering citrus, mint, berry, coffee, licorice, spices, and tobacco at strengths from a gentle 1.5mg to a strong 16.5mg per pouch. Cans hold 20 to 21 pouches. ZYN is the benchmark against which every other pouch brand is measured.",
    manufacturer: "Swedish Match (Philip Morris International)",
    faqs: [
      {
        question: "What flavours does zyn offer?",
        answer:
          "zyn pouches are available in berry, citrus, coffee, fruit, licorice, mint, spices, tobacco flavours across 52 products in our store.",
      },
      {
        question: "What nicotine strengths does zyn come in?",
        answer:
          "zyn pouches range from 1.5mg to 16.5mg nicotine per pouch, covering options from mild to extra strong. All products are tobacco-free.",
      },
      {
        question: "How many pouches are in a zyn can?",
        answer:
          "Each zyn can contains 20, 21 pouches in mini and slim format.",
      },
      {
        question: "Do you offer free delivery on zyn?",
        answer:
          "Yes — all orders over €29 qualify for free delivery across the EU.",
      },
    ],
  },
];

export function getBrandBySlug(slug: string): BrandInfo | undefined {
  return brandDirectory.find((b) => b.slug === slug);
}
