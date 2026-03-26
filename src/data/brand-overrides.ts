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
      "77 Pouches by 77 Group offers 23 tobacco-free nicotine pouches in slim and mini formats, spanning flavours like cola, mint, berry, candy, and liquorice. Strengths range from 10.4–20.0mg per pouch, with 20–24 pouches per can.",
    manufacturer: "77 Group",
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
      "ACE by Ministry of Snus delivers 8 premium slim nicotine pouches in flavours including mint, berry, eucalyptus, and fruit. Available in strengths from 3.0–11.5mg per pouch, with 18–20 pouches per can.",
    manufacturer: "Ministry of Snus",
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
      "Après by NGRS offers 16 elegant slim nicotine pouches with flavours like cola, citrus, berry, mint, tea, and fruit. Nicotine strengths range from 4.4–11.0mg per pouch, with 20 pouches per can.",
    manufacturer: "NGRS",
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
      "AVANT offers 6 slim nicotine pouches with bold flavours including tropical banana, berry, and coffee. Strengths range from 7.8–13.0mg per pouch, with 20 pouches per can.",
    manufacturer: "AVANT",
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
      "BRUTE delivers a powerful slim nicotine pouch with a zesty citrus flavour and 9.5mg nicotine per pouch. Each can contains 20 tobacco-free pouches built for a refreshing, invigorating experience.",
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
      "Chainpop by Swedish Pouch AB offers 9 creative slim nicotine pouches with unique combinations like apple cinnamon, eucalyptus, berry, and candy. Strengths range from 5.0–11.4mg per pouch, with 20 pouches per can.",
    manufacturer: "Swedish Pouch AB",
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
      "CLEW Pouches are crafted in the USA, offering 20 slim nicotine pouches in flavours like cool mint, berry, coffee, and flower. Strengths range from 5.0–20.0mg per pouch, with 20 pouches per can.",
    manufacturer: "CLEW Pouches",
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
      "CUBA by NGP Empire pushes the limits with 29 high-strength slim nicotine pouches in flavours including berry, cola, candy, mint, and energy drink. Strengths reach up to 43mg per pouch, with 20–25 pouches per can.",
    manufacturer: "NGP Empire",
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
      "DENSSI delivers 14 Nordic-inspired slim nicotine pouches in berry, fruit, and mint flavours with an intense cooling effect. Available in 4.0–8.0mg per pouch, with 20 pouches per can.",
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
      "DOSH specialises in ultra-thin slim nicotine pouches that deliver fast nicotine release despite weighing just 2g per can. With 6 flavours including mint, berry, citrus, and cola, strengths range from 6.0–9.0mg per pouch.",
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
      "Fix by Habit Factory offers 6 flavourful slim nicotine pouches in berry, cinnamon, and fruit varieties. Strengths range from 5.6–11.5mg per pouch, with 20 pouches per can.",
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
      "FOLD offers 4 straightforward slim nicotine pouches with a focus on clean flavour and reliable strength. Nicotine strengths span 6.0–13.0mg per pouch, with 20 pouches per can.",
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
      "FUMI by Another Snus Factory creates 9 distinctive slim nicotine pouches with adventurous flavours like salty raspberry, licorice, and spices. Strengths range from 8.0–11.0mg per pouch, with 20 pouches per can.",
    manufacturer: "Another Snus Factory",
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
      "Garant by Fiedler & Lundgren delivers 15 high-strength slim nicotine pouches with 27 pouches per can — more than most brands. Flavours span berry, citrus, cola, licorice, and mint, with strengths reaching up to 38mg per pouch.",
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
      "GLICK packs serious strength into 11 slim nicotine pouches with flavours like ice mint, berry, citrus, and sweet. Strengths range from 4.0–25.0mg per pouch, with 20 pouches per can.",
    manufacturer: "GLICK",
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
      "HELWIT by Helwit AB offers 18 gentle yet flavourful slim nicotine pouches in berry, coffee, cola, flower, fruit, licorice, and mint. Strengths range from 3.5–7.5mg per pouch, with 20 pouches per can.",
    manufacturer: "Helwit AB",
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
      "ICEBERG delivers 13 ice-cold slim nicotine pouches in flavours like cherry apricot, berry, candy, and mint. Available in 6–40mg per pouch, these pouches are built for users who want extreme strength and bold flavour.",
    manufacturer: "ICEBERG",
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
      "ICY WOLF offers 6 ultra-cool slim nicotine pouches in mint and fruit flavours with strengths from 9.0–16.0mg per pouch. Each can contains 20 tobacco-free pouches with crisp, invigorating freshness.",
    manufacturer: "ICY WOLF",
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
      "Kelly White by Kelly White Sweden offers 22 premium slim and mini nicotine pouches in mint, berry, fruit, and spice flavours. Strengths range from 4.0–8.0mg per pouch, with 20 pouches per can.",
    manufacturer: "Kelly White Sweden",
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
      "KLAR features 6 nicotine pouches in both mini and slim formats with patented bioceramic technology for faster, smoother nicotine release. Available in mint and original flavours, with strengths from 3.0–9.0mg per pouch.",
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
      "Klint by Habit Factory delivers 8 bold slim nicotine pouches in flavours like pink grapefruit, cola, licorice, and mint. Strengths range from 8.4–20.0mg per pouch, with 18–20 pouches per can.",
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
      "KUMA delivers 4 extra-strong slim nicotine pouches in mint, wintergreen, and fruit flavours with 13.75mg nicotine per pouch. Each can contains 20 powerful, cool, and refreshing tobacco-free pouches.",
    manufacturer: "KUMA",
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
      "Loop by Another Snus Factory features one of the largest ranges with 32 slim and mini nicotine pouches, including nicotine-free options. Flavours span mint, berry, citrus, coffee, licorice, and fruit, with strengths from 0–15.6mg per pouch and 20–22 pouches per can.",
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
      "LUMI offers 18 smooth slim nicotine pouches in mint, citrus, fruit, and mixed flavours, including a 100-pouch mega can option. Strengths range from 6.0–18.0mg per pouch for every preference.",
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
      "Lundgrens by Fiedler & Lundgren offers 10 traditional normal-format nicotine pouches inspired by Swedish heritage. Flavours include berry, fruit, licorice, mint, and tobacco, with 21 pouches per can and strengths from 6.0–10.0mg per pouch.",
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
      "MAGGIE delivers 12 Caribbean-inspired slim nicotine pouches with bold flavours like cherry tonic wine and tropical cola. Available in 13.6–45.0mg per pouch, with 20 pouches per can.",
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
      "MYNT offers 18 mint-focused slim nicotine pouches with fresh, clean flavour profiles plus sweet and fruit varieties. Strengths range from 6.0–18.0mg per pouch, with 20 pouches per can.",
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
      "NEAFS delivers 18 slim nicotine pouches with 25 pouches per can — more than standard brands. Flavours include berry, fruit, and mint, with strengths from 8.0–16.0mg per pouch.",
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
      "NOiS offers 10 slim nicotine pouches in mint, berry, eucalyptus, and fruit flavours with one of the widest strength ranges on the market. From 6.0–25.0mg per pouch, with 22–27 pouches per can.",
    manufacturer: "NOiS",
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
      "ON! by Burger Söhne (Altria) delivers 5 discreet mini-format nicotine pouches in coffee and mint flavours. Small, dry, and easy to use, each pouch delivers 3.0–9.28mg nicotine and lasts up to 20 minutes.",
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
      "Pura Energy pouches are caffeine-powered, nicotine-free alternatives in slim format with 180mg caffeine per pouch. Available in mint and fruit flavours, they are sugar-free, calorie-free, and ideal for a discreet energy boost during workouts or work.",
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
      "Rabbit delivers 15 high-strength slim nicotine pouches for experienced users, with flavours spanning berry, candy, citrus, cola, energy drink, fruit, hemp, and mint. Strengths range from 26.0–50.0mg per pouch — among the strongest on the market.",
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
      "RAVE delivers 26 party-ready slim nicotine pouches in cola, berry, candy, citrus, fruit, and mint flavours, plus caffeine energy pouches. Nicotine strengths range from 9.6–19.5mg per pouch, with 20 pouches per can.",
    manufacturer: "RAVE Pouches",
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
      "RELX AirPouch is an ultra-thin nicotine pouch format by RELX Technology, weighing just 2g per can for maximum discretion. Available in 7 flavours including citrus, berry, cola, and mint, with strengths from 9.0–20.0mg per pouch.",
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
      "Royal White offers a premium slim nicotine pouch with fresh mint flavour and 8.3mg nicotine per pouch. Each can contains 22 pouches for a smooth, refined experience.",
    manufacturer: "Royal White",
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
      "RUSH delivers 9 bold slim nicotine pouches with tropical and fruity flavours like mango freeze, berry, and mint. Strengths range from 11.2–21.0mg per pouch, with 20 pouches per can.",
    manufacturer: "RUSH",
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
      "Siberia by GN Tobacco is legendary for extreme nicotine strength, offering 7 pouches in slim, normal, mini, and large formats — all with 33mg/g nicotine. Per-pouch strength ranges from 16.5–49.5mg, with 12–22 pouches per can.",
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
      "Skruf by Imperial Brands offers 15 premium slim nicotine pouches in berry, fruit, licorice, and mint flavours. With 20–26 pouches per can and strengths from 6.0–12.0mg per pouch, Skruf delivers Swedish quality in every can.",
    manufacturer: "Imperial Brands",
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
      "Smögen offers 3 artisan slim nicotine pouches inspired by the Swedish west coast, with flavours like stormy licorice, berry, and mint. Each pouch contains 8mg nicotine, with 20 pouches per can.",
    manufacturer: "Smögen",
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
      "SNOBERG by Swedish Pouch AB offers 12 Swedish-made slim nicotine pouches in berry, fruit, and mint flavours. Available in 6.5–10.0mg per pouch, with 20 pouches per can.",
    manufacturer: "Swedish Pouch AB",
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
      "Snowman by Swedish Pouch AB delivers 12 icy slim nicotine pouches in mint, berry, citrus, and fruit flavours. Strengths range from 9.0–12.0mg per pouch, with 20 pouches per can.",
    manufacturer: "Swedish Pouch AB",
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
      "STNG by Mochi AB delivers 10 slim nicotine pouches with creative flavours like berry seltzer, candy, cola, and mint. Strengths range from 9.2–27.5mg per pouch, with 20 pouches per can.",
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
      "Swag offers 2 slim nicotine pouches with bold berry flavours and a touch of mint. Available in 7.2–15.0mg per pouch, with 20 pouches per can.",
    manufacturer: "Swag",
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
      "TOGO delivers 4 slim nicotine pouches with light, refreshing flavours like strawberry melonade, berry, citrus, and mint. Strengths range from 8.0–10.0mg per pouch, with 20 pouches per can.",
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
      "TYR offers 4 Norse-inspired slim nicotine pouches in mint, berry, and citrus flavours. Each pouch delivers around 12mg nicotine in a clean, cool, and balanced format with 20 pouches per can.",
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
      "Velo by British American Tobacco is one of the world's most popular nicotine pouch brands, offering 53 products in slim and mini formats — including nicotine-free options. Flavours span berry, citrus, fruit, licorice, mint, and more, with strengths from 0–17mg per pouch.",
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
      "VID delivers 6 slim nicotine pouches in berry, coffee, cola, fruit, and mint flavours. Strengths range from 7.2–9.6mg per pouch, with 20 pouches per can.",
    manufacturer: "VID",
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
      "White Gold offers 8 slim nicotine pouches in fruit, citrus, coffee, and mint flavours, all with 6mg nicotine per pouch. A balanced, medium-strength option with 20 pouches per can.",
    manufacturer: "White Gold",
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
      "White Fox by GN Tobacco is an iconic slim nicotine pouch brand known for its cool mint flavour in both slim and normal formats. Strengths range from 12.0–24.0mg per pouch, with 15–20 pouches per can.",
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
      "X-Booster Energy Pouches are caffeine-powered, nicotine-free energy pouches in slim format. With 8 flavours including energy drink, mint, coffee, and candy, each pouch delivers 40–80mg caffeine for a quick boost without nicotine.",
    manufacturer: "X-Booster",
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
      "XO offers 10 slim nicotine pouches with 8mg per pouch across berry, citrus, cola, fruit, and mint flavours. A consistent, strong option with 20 tobacco-free pouches per can.",
    manufacturer: "XO",
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
      "XPCT stands out with mega cans containing 308 pouches — the largest cans on the market at 200g net weight. Available in 6 flavours including berry, cola, fruit, and licorice, with strengths from 6.5–10.4mg per pouch.",
    manufacturer: "XPCT",
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
      "XQS by XQS Nicotine offers 28 slim nicotine pouches in berry, candy, citrus, fruit, licorice, and mint — including nicotine-free and caffeine options. Strengths range from 0–11.2mg per pouch, with 20 pouches per can.",
    manufacturer: "XQS Nicotine",
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
      "Zeronito by Microzero AB is a completely nicotine-free pouch brand, offering 18 products in slim and large formats for users who want the pouch experience without any nicotine. Flavours include berry, coffee, cola, fruit, licorice, and mint.",
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
      "Zeus offers 32 slim nicotine pouches with a god-tier range of flavours including berry, candy, citrus, fruit, mint, and spices. Strengths span 4.0–25.0mg per pouch, with 20 pouches per can.",
    manufacturer: "Zeus Nicotine Pouches",
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
      "ZYN by Swedish Match (Philip Morris International) is the benchmark nicotine pouch brand, offering 52 products in slim and mini formats across flavours like citrus, mint, berry, coffee, licorice, spices, and tobacco. Strengths range from 1.5–16.5mg per pouch, with 20–21 pouches per can.",
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
