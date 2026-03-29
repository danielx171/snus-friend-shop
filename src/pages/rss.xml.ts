import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

const articles = [
  { title: 'ZYN Nicotine Pouches: The Complete Guide', slug: 'zyn-nicotine-pouches-complete-guide', excerpt: 'Everything about the world\'s best-selling nicotine pouch brand — 52 products, strengths from 1.5 to 16.5 mg, and the full ZYN flavour range explained.', date: '2026-03-27' },
  { title: 'VELO Nicotine Pouches: Complete Brand Guide', slug: 'velo-nicotine-pouches-complete-guide', excerpt: 'Discover BAT\'s global nicotine pouch leader — 53 products from Mighty Peppermint to Tropical Mango, available in mini and slim formats.', date: '2026-03-27' },
  { title: 'LOOP Nicotine Pouches: The Flavour-First Brand', slug: 'loop-nicotine-pouches-complete-guide', excerpt: 'Swedish-made with Instant Rush technology for faster nicotine delivery. 32 bold products from jalapeño lime to habanero mint.', date: '2026-03-27' },
  { title: 'ZYN vs VELO in 2026: The Definitive Comparison', slug: 'zyn-vs-velo-2026', excerpt: 'Updated 2026 head-to-head — flavours, strength, format, pricing, nicotine delivery curves, and which brand suits your style.', date: '2026-03-27' },
  { title: 'LOOP vs Skruf: Which Swedish Brand Is Right for You?', slug: 'loop-vs-skruf', excerpt: 'A detailed comparison of LOOP and Skruf — flavour range, strength, pouch format, and which brand suits different users.', date: '2026-03-27' },
  { title: 'Best Nicotine Pouches for Beginners: 2026 Starter Guide', slug: 'best-nicotine-pouches-for-beginners-2026', excerpt: 'Overwhelmed by pouch options? Exactly which low-strength brands to try first, what strength to start with, and what to expect in your first week.', date: '2026-03-27' },
  { title: 'The Complete Nicotine Pouch Buying Guide for Europe (2026)', slug: 'nicotine-pouch-buying-guide-europe', excerpt: 'Everything European buyers need to know — strength tiers, regulations by country, top brands, storage tips, and honest pricing guidance.', date: '2026-03-27' },
  { title: 'Switching from Cigarettes to Nicotine Pouches', slug: 'switching-from-cigarettes-to-nicotine-pouches', excerpt: 'A practical week-by-week transition plan — which pouch strength matches your cigarette intake, best brands for switchers, and how to make it stick.', date: '2026-03-26' },
  { title: 'Strongest Nicotine Pouches in 2026: Complete Strength Ranking', slug: 'strongest-nicotine-pouches-ranked-2026', excerpt: 'Ranked from 50 mg ultra-extreme to 10 mg strong — NOIS, Rabbit, CUBA, Siberia, ICEBERG, and more with safety guidance and tolerance tips.', date: '2026-03-27' },
  { title: 'The 10 Best Mint Nicotine Pouches in 2026: Expert Picks', slug: 'best-mint-nicotine-pouches-2026', excerpt: 'Expert ranking of mint nicotine pouches compared by cooling, strength, duration, and pouch feel.', date: '2026-03-27' },
  { title: 'Best Citrus Nicotine Pouches: 2026 Flavour Guide', slug: 'best-citrus-nicotine-pouches', excerpt: 'From zesty lemon and lime to smooth orange and grapefruit — the top 8 citrus pouches ranked by flavour, strength, and duration.', date: '2026-03-27' },
  { title: 'Best Berry Nicotine Pouches: Top 10 for 2026', slug: 'best-berry-nicotine-pouches', excerpt: 'From sweet strawberry to tart mixed berries — our expert ranking of the best berry-flavoured pouches across all strengths and brands.', date: '2026-03-27' },
  { title: 'Best Coffee-Flavoured Nicotine Pouches', slug: 'best-coffee-nicotine-pouches', excerpt: 'From rich espresso to smooth macchiato — the best coffee nicotine pouches ranked by flavour, strength, and value.', date: '2026-03-27' },
  { title: 'Nicotine Pouches vs Snus: What\'s the Difference?', slug: 'nicotine-pouches-vs-snus', excerpt: 'The key differences between tobacco-free nicotine pouches and traditional snus — ingredients, legality, strength, flavour, and which suits you.', date: '2026-03-26' },
  { title: 'How Long Do Nicotine Pouches Last?', slug: 'how-long-do-nicotine-pouches-last', excerpt: 'A nicotine pouch lasts 20-40 minutes per use. We cover usage time, shelf life, storage tips, and how format and strength affect duration.', date: '2026-03-26' },
  { title: 'Nicotine Pouch Side Effects: What to Expect', slug: 'nicotine-pouch-side-effects', excerpt: 'Honest guide to common side effects — tingling, hiccups, nausea — what causes them, how to avoid them, and when to lower your strength.', date: '2026-03-26' },
  { title: 'What Are Nicotine Pouches? A Complete Guide', slug: 'what-are-nicotine-pouches', excerpt: 'A beginner-friendly guide to tobacco-free nicotine pouches — how they work, how to use them, and why millions of Europeans are making the switch.', date: '2026-03-26' },
  { title: 'How to Choose the Right Nicotine Strength', slug: 'how-to-choose-your-strength', excerpt: 'From light (2 mg) to super strong (20 mg+), picking the right strength matters. A practical framework based on your experience level.', date: '2026-03-26' },
  { title: 'Top 10 Mint Nicotine Pouches in 2026', slug: 'top-10-mint-flavours', excerpt: 'We ranked the best mint and menthol nicotine pouches from top European brands.', date: '2026-03-26' },
  // New articles — March 28, 2026
  { title: 'ZYN Flavours: The Complete 2026 Guide & Rankings', slug: 'zyn-flavours-complete-guide', excerpt: 'Every ZYN flavour available in Europe — grouped by category, ranked, with strength options and format details.', date: '2026-03-28' },
  { title: 'VELO Flavours: Complete 2026 Guide & Rankings', slug: 'velo-flavours-complete-guide', excerpt: 'The full VELO flavour range — mint, citrus, berry, tropical and more. Rankings, strengths, and format comparisons.', date: '2026-03-28' },
  { title: 'Best Nicotine Pouches 2026: Expert Picks', slug: 'best-nicotine-pouches-2026', excerpt: 'Our editorial team picks the best nicotine pouches of 2026 across every category.', date: '2026-03-28' },
  { title: 'How to Use Nicotine Pouches: A Complete Guide', slug: 'how-to-use-nicotine-pouches', excerpt: 'Step-by-step guide to using nicotine pouches — placement, timing, what to expect.', date: '2026-03-28' },
  { title: 'Nicotine Pouches vs Vaping: Which Is Better in 2026?', slug: 'nicotine-pouches-vs-vaping', excerpt: 'Head-to-head comparison of nicotine pouches and vaping — cost, health, convenience, discretion.', date: '2026-03-28' },
  { title: 'Nicotine Pouches Legal in Europe: 2026 Country Guide', slug: 'nicotine-pouches-legal-europe-2026', excerpt: 'Country-by-country legal status of nicotine pouches across Europe including France ban and EU TPD3.', date: '2026-03-28' },
  { title: 'Nicotine Pouch Flavour Guide: Every Category Explained', slug: 'nicotine-pouch-flavour-guide', excerpt: 'From mint to coffee to cola — every nicotine pouch flavour category explained.', date: '2026-03-28' },
  { title: 'Pablo Nicotine Pouches: Complete Brand Guide', slug: 'pablo-nicotine-pouches-complete-guide', excerpt: 'Everything about Pablo — the ultra-strong brand. Product range, strengths, safety guidance.', date: '2026-03-28' },
  { title: 'ICEBERG Nicotine Pouches: Complete Brand Guide', slug: 'iceberg-nicotine-pouches-complete-guide', excerpt: 'The full ICEBERG range — flavours, strengths, and who this brand is best for.', date: '2026-03-28' },
  { title: 'Nicotine Pouches vs Gum vs Lozenges: Which NRT?', slug: 'nicotine-pouches-vs-gum-vs-lozenges', excerpt: 'Comparing nicotine pouches with traditional NRT — gum, lozenges, and patches.', date: '2026-03-28' },
  // Brand spotlights batch 2
  { title: 'Skruf Nicotine Pouches: Complete Brand Guide', slug: 'skruf-nicotine-pouches-complete-guide', excerpt: 'Imperial Brands\' Swedish pouch brand — strength system, flavours, and full review.', date: '2026-03-28' },
  { title: 'White Fox Nicotine Pouches: Complete Brand Guide', slug: 'white-fox-nicotine-pouches-complete-guide', excerpt: 'GN Tobacco\'s extreme mint specialist — Full Charge, Double Mint, and more.', date: '2026-03-28' },
  { title: 'Siberia Nicotine Pouches & Snus: Complete Guide', slug: 'siberia-nicotine-pouches-complete-guide', excerpt: 'The legendary ultra-strong brand — up to 49.5mg per pouch.', date: '2026-03-28' },
  { title: 'Nordic Spirit Nicotine Pouches: Complete Brand Guide', slug: 'nordic-spirit-nicotine-pouches-complete-guide', excerpt: 'JTI\'s smooth pouch brand, popular in the UK.', date: '2026-03-28' },
  { title: 'KLAR Nicotine Pouches: Complete Brand Guide', slug: 'klar-nicotine-pouches-complete-guide', excerpt: 'Swedish craft pouches with bioceramic technology.', date: '2026-03-28' },
  { title: 'FUMI Nicotine Pouches: Complete Brand Guide', slug: 'fumi-nicotine-pouches-complete-guide', excerpt: 'Unconventional Nordic flavours — salty raspberry, rhubarb, and more.', date: '2026-03-28' },
  // Buying guides
  { title: 'Best Nicotine Pouches for Quitting Smoking (2026)', slug: 'best-nicotine-pouches-for-quitting-smoking', excerpt: 'Match cigarette intake to pouch strength with a week-by-week plan.', date: '2026-03-28' },
  { title: 'Best Budget Nicotine Pouches Under €3', slug: 'best-budget-nicotine-pouches', excerpt: 'Price-per-pouch comparison of the best value pouches.', date: '2026-03-28' },
  { title: 'Best Strong Nicotine Pouches (10-20mg)', slug: 'best-strong-nicotine-pouches', excerpt: 'For experienced users — strong pouches compared across brands.', date: '2026-03-28' },
  { title: 'Best Nicotine Pouches with No Aftertaste', slug: 'best-nicotine-pouches-no-aftertaste', excerpt: 'Clean flavour, no chemical aftertaste.', date: '2026-03-28' },
  { title: 'Best Nicotine Pouches for All-Day Use', slug: 'best-nicotine-pouches-all-day-use', excerpt: 'Comfort and long duration for extended wear.', date: '2026-03-28' },
  { title: 'Best Slim Nicotine Pouches', slug: 'best-slim-nicotine-pouches', excerpt: 'The most comfortable and discreet pouches ranked.', date: '2026-03-28' },
  { title: 'Best Nicotine Pouches for Women in 2026', slug: 'best-nicotine-pouches-for-women', excerpt: 'Data-driven picks based on discretion, strength, and flavour.', date: '2026-03-28' },
  { title: 'Nicotine Pouch Subscription Guide 2026', slug: 'nicotine-pouch-subscription-guide', excerpt: 'Compare subscriptions, calculate savings, and decide if auto-delivery is worth it.', date: '2026-03-28' },
  // New articles — March 30, 2026 (SEO gap targets)
  { title: 'Are Nicotine Pouches Safe? Evidence-Based Health Guide', slug: 'are-nicotine-pouches-safe', excerpt: 'Clinical evidence on nicotine pouch safety — comparison with cigarettes, snus, and vaping.', date: '2026-03-30' },
  { title: 'Nicotine Pouch Ingredients Explained', slug: 'nicotine-pouch-ingredients-explained', excerpt: 'Complete breakdown of every ingredient — nicotine source, fillers, pH adjusters, flavourings, and sweeteners.', date: '2026-03-30' },
  { title: 'How to Spot Fake Nicotine Pouches', slug: 'how-to-spot-fake-nicotine-pouches', excerpt: 'Authentication guide — packaging, batch codes, holograms, and authorised retailers.', date: '2026-03-30' },
];

export async function GET(context: APIContext) {
  return rss({
    title: 'SnusFriend Blog',
    description: 'Guides, reviews, and tips about nicotine pouches from SnusFriend.',
    site: context.site!.toString(),
    items: articles.map((a) => ({
      title: a.title,
      description: a.excerpt,
      pubDate: new Date(a.date),
      link: `/blog/${a.slug}`,
    })),
  });
}

export const prerender = true;
