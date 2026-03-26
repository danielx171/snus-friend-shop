create table if not exists public.blog_posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  excerpt     text not null,
  body        text not null,  -- markdown
  cover_image_url text,
  author_name text not null default 'SnusFriend Team',
  tags        text[] not null default '{}',
  published   boolean not null default false,
  published_at timestamptz,
  seo_title   text,
  seo_description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

-- Public can read published posts only
create policy "public_read_published_posts"
  on public.blog_posts for select
  using (published = true);

-- Seed 3 sample posts
insert into public.blog_posts (slug, title, excerpt, body, author_name, tags, published, published_at, seo_title, seo_description) values
(
  'what-are-nicotine-pouches',
  'What Are Nicotine Pouches? A Complete Guide',
  'Nicotine pouches are a smoke-free, tobacco-free alternative to cigarettes. Here''s everything you need to know about how they work, what brands are available, and how to choose the right one.',
  E'## What are nicotine pouches?\n\nNicotine pouches are small, white pouches that you place under your upper lip. Unlike traditional snus, they contain no tobacco leaf — just nicotine, plant-based fibres, flavourings, and water.\n\nThey deliver nicotine through the mucous membrane in your mouth, giving you a steady release over 30–60 minutes.\n\n## How do they work?\n\nPlace the pouch between your upper lip and gum. You''ll feel a tingling sensation as nicotine absorbs. Most pouches last 30–60 minutes before the flavour fades.\n\n## Choosing the right strength\n\nNicotine pouches come in a range of strengths, typically measured in mg/g:\n\n- **Light (2–4 mg)** — ideal for beginners or those switching from light cigarettes\n- **Regular (6–8 mg)** — most popular, suits moderate smokers\n- **Strong (10–14 mg)** — for heavier smokers making the switch\n- **Extra Strong (16+ mg)** — experienced users only\n\n## Top brands to try\n\nAt SnusFriend we stock 700+ products from 91 brands. Popular choices include ZYN, VELO, Lyft, Pablo, White Fox, and LOOP.\n\n## Are nicotine pouches right for you?\n\nNicotine pouches are a great tool for smokers looking to quit or switch to a smoke-free lifestyle. They''re discreet, tobacco-free, and available in dozens of flavours.',
  'SnusFriend Team',
  ARRAY['beginners', 'guide', 'nicotine-pouches'],
  true,
  now() - interval '14 days',
  'What Are Nicotine Pouches? A Complete Beginner''s Guide | SnusFriend',
  'Learn everything about nicotine pouches — how they work, strengths, top brands, and how to choose the right one for you. Expert guide from SnusFriend.'
),
(
  'best-mint-nicotine-pouches',
  'The Best Mint Nicotine Pouches in 2026',
  'Mint is the most popular nicotine pouch flavour — and for good reason. From fresh spearmint to icy cool blends, we''ve rounded up the best mint pouches you can buy right now.',
  E'## Why mint dominates the nicotine pouch market\n\nMint flavours account for nearly half of all nicotine pouch sales globally. The cooling sensation complements nicotine delivery perfectly, and the clean, fresh taste appeals to smokers switching from menthol cigarettes.\n\n## Our top picks\n\n### ZYN Cool Mint\nThe gold standard. Consistent, not too sweet, with a long-lasting cool finish. Available in multiple strengths.\n\n### VELO Ice Cool\nA stronger mint experience with an almost mentholated kick. Popular with heavy menthol cigarette smokers.\n\n### Pablo Ice Cold\nFor those who like it intense. High-strength with an aggressive mint hit that lingers.\n\n### Lyft Freeze\nA balanced spearmint that''s less icy than ZYN but more complex. Great everyday pouch.\n\n### White Fox Peppered Mint\nUnique peppery twist on classic mint. Surprising and refreshing — worth trying.\n\n## How to choose\n\n- **Want clean and classic?** → ZYN Cool Mint\n- **Former menthol smoker?** → VELO Ice Cool\n- **Maximum intensity?** → Pablo Ice Cold\n- **Something different?** → White Fox Peppered Mint\n\nAll of these are available at SnusFriend with free EU delivery on orders over €29.',
  'SnusFriend Team',
  ARRAY['mint', 'flavours', 'top-picks', 'zyn', 'velo'],
  true,
  now() - interval '7 days',
  'Best Mint Nicotine Pouches 2026 — Top Picks | SnusFriend',
  'Discover the best mint nicotine pouches in 2026. Expert picks from ZYN, VELO, Pablo, Lyft, and White Fox — with tasting notes and strength guides.'
),
(
  'how-to-quit-smoking-with-nicotine-pouches',
  'How to Use Nicotine Pouches to Quit Smoking',
  'Switching to nicotine pouches is one of the most effective ways to stop smoking. Here''s a practical step-by-step plan to make the transition.',
  E'## Why nicotine pouches work for quitting smoking\n\nSmoking is both a nicotine dependency and a behavioural habit. Nicotine pouches address the chemical dependency by delivering nicotine without combustion, while letting you gradually reduce your intake.\n\nUnlike patches, pouches give you more control — you use one when you feel a craving.\n\n## Step-by-step switching plan\n\n### Week 1–2: Replace, don''t restrict\nEvery time you''d reach for a cigarette, use a nicotine pouch instead. Match the strength to your cigarettes — heavy smokers should start at 8–12 mg.\n\n### Week 3–4: Identify your triggers\nMorning coffee, after meals, stress — identify when you crave nicotine most. Use pouches for those moments specifically.\n\n### Month 2: Step down\nMove to a lower strength. If you''ve been on 8 mg, move to 6 mg. The nicotine delivery is the same; you''re just reducing dependency.\n\n### Month 3+: Taper frequency\nUse fewer pouches per day. From 10/day → 7 → 5 → 3 → 1 → none.\n\n## Tips for success\n\n- **Tell someone** — accountability matters\n- **Track your pouches** — use a journal to count usage\n- **Don''t rush the step-down** — go at your own pace\n- **Combine with exercise** — physical activity reduces cravings\n\n## What strength to start with\n\n| Cigarettes/day | Starting strength |\n|---------------|------------------|\n| Under 10 | 4–6 mg |\n| 10–20 | 6–8 mg |\n| 20+ | 8–12 mg |\n\nShop our full range at SnusFriend with free EU delivery on orders over €29.',
  'SnusFriend Team',
  ARRAY['quit-smoking', 'guide', 'health'],
  true,
  now() - interval '3 days',
  'How to Quit Smoking with Nicotine Pouches — Step-by-Step Guide | SnusFriend',
  'A practical step-by-step plan for using nicotine pouches to quit smoking. Includes strength guide, tapering schedule, and expert tips from SnusFriend.'
);
