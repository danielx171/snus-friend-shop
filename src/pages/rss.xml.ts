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
