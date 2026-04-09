-- Gamification Copy Refresh — April 9, 2026
-- Updates tier names (Circles), quest titles (Missions), achievement titles (Badges)
-- per Cowork's gamification-copy-system.md and gamification-quest-achievement-copy.md

-- ═══════════════════════════════════════════════════════════════
-- 1. Reputation Levels → Circles (rename tiers + update perks)
-- ═══════════════════════════════════════════════════════════════

UPDATE public.reputation_levels SET
  name = 'Explorer',
  perks = '["Welcome Daily Drop bonus", "Member-only newsletter"]'::jsonb
WHERE level = 1;

UPDATE public.reputation_levels SET
  name = 'Member',
  perks = '["Community posting", "Review reactions", "Birthday bonus"]'::jsonb
WHERE level = 2;

UPDATE public.reputation_levels SET
  name = 'Connoisseur',
  perks = '["Custom avatar border", "Early sale access"]'::jsonb
WHERE level = 3;

UPDATE public.reputation_levels SET
  name = 'Specialist',
  perks = '["Double mission rewards", "Exclusive polls", "Priority support"]'::jsonb
WHERE level = 4;

UPDATE public.reputation_levels SET
  name = 'Founder',
  perks = '["Gold badge", "VIP support", "Founder-only vouchers"]'::jsonb
WHERE level = 5;

-- ═══════════════════════════════════════════════════════════════
-- 2. Quests → Missions (update existing + add new quest types + new quests)
-- ═══════════════════════════════════════════════════════════════

-- Expand quest_type CHECK to support new mission types
ALTER TABLE public.quests DROP CONSTRAINT IF EXISTS quests_quest_type_check;
ALTER TABLE public.quests ADD CONSTRAINT quests_quest_type_check
  CHECK (quest_type IN ('orders','reviews','spend','brands','products','spins','profile','login','suggestions','flavors','strengths'));

-- Update existing quests with new copy
UPDATE public.quests SET title = 'First Order', description = 'Place your first order on SnusFriend.', reward_points = 20 WHERE id = 'first-order';
UPDATE public.quests SET title = 'Brand Sampler', description = 'Try products from 3 different brands.', reward_points = 25 WHERE id = 'brand-explorer';
UPDATE public.quests SET title = 'The Critic', description = 'Write 10 reviews. Your opinions are shaping the community.', reward_points = 75 WHERE id = 'review-champion';
UPDATE public.quests SET title = 'Mint Specialist', description = 'Buy 3 different mint products.', reward_points = 75 WHERE id = 'mint-master';
UPDATE public.quests SET title = 'Big Spender', description = 'Spend over €100 in total.', reward_points = 200 WHERE id = 'big-spender';
UPDATE public.quests SET title = 'Weekly Rhythm', description = 'Log in on 5 different days in a single week.', quest_type = 'login', target_value = 5, reward_points = 20 WHERE id = 'daily-devotee';

-- Insert new missions (ON CONFLICT DO NOTHING for idempotency)
INSERT INTO public.quests (id, title, description, quest_type, target_value, reward_points, sort_order, active) VALUES
  ('first-taste',        'First Taste',         'Try your first nicotine pouch from any brand.',                              'orders',      1,  10,  1, true),
  ('category-hopper',    'Category Hopper',      'Order pouches from 3 different flavour categories.',                         'flavors',     3,  25,  3, true),
  ('full-spectrum',      'The Full Spectrum',     'Try pouches in at least 3 different nicotine strengths.',                   'strengths',   3,  30,  5, true),
  ('nordic-route',       'Nordic Route',          'Order from 3 Scandinavian brands (ZYN, Skruf, Loop, Klar, Fumi, Nordic Spirit).', 'brands', 3,  30,  6, true),
  ('first-words',        'First Words',           'Write your first product review.',                                         'reviews',     1,  15,  7, true),
  ('honest-voice',       'Honest Voice',          'Write 5 reviews with at least 50 words each.',                             'reviews',     5,  40,  8, true),
  ('pioneer-submission', 'Pioneer Submission',    'Submit your first product suggestion to the Pioneer Lab.',                  'suggestions', 1,  25, 10, true),
  ('helpful-vote',       'Helpful Vote',          'Vote on 5 other members'' Pioneer Lab suggestions.',                       'suggestions', 5,  15, 11, true),
  ('profile-setup',      'Profile Setup',         'Complete your profile — avatar, display name, and flavour preferences.',   'profile',     1,  15, 12, true),
  ('strength-finder',    'Strength Finder',       'Use the strength guide and log your preferred nicotine level.',             'profile',     1,  10, 13, true),
  ('monthly-regular',    'Monthly Regular',        'Place at least 2 orders in the same calendar month.',                     'orders',      2,  35, 15, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  quest_type = EXCLUDED.quest_type,
  target_value = EXCLUDED.target_value,
  reward_points = EXCLUDED.reward_points,
  sort_order = EXCLUDED.sort_order;

-- ═══════════════════════════════════════════════════════════════
-- 3. Achievements → Badges (update existing + add new)
-- ═══════════════════════════════════════════════════════════════

-- Update existing achievements with new copy
UPDATE public.achievements SET title = 'First Critic',       description = 'Your voice is in the system. The community is listening.'                        WHERE slug = 'reviews_bronze';
UPDATE public.achievements SET title = 'Trusted Voice',      description = 'People read what you write. That''s earned, not given.'                           WHERE slug = 'reviews_silver';
UPDATE public.achievements SET title = 'Top Reviewer',       description = 'One of the most prolific reviewers on SnusFriend. Your opinions carry weight.'    WHERE slug = 'reviews_gold';
UPDATE public.achievements SET title = 'Review Legend',       description = 'Fifty reviews. You practically wrote the field guide.'                            WHERE slug = 'reviews_diamond';

UPDATE public.achievements SET title = 'First Order',        description = 'Welcome to SnusFriend. Your journey starts here.'                                WHERE slug = 'orders_bronze';
UPDATE public.achievements SET title = 'Monthly Constant',   description = 'Reliable. Consistent. The kind of member every community needs.'                  WHERE slug = 'orders_silver';
UPDATE public.achievements SET title = 'Circle Climber',     description = 'You''re in the inner ring now. The perks reflect it.'                             WHERE slug = 'orders_gold';
UPDATE public.achievements SET title = 'The Vault Veteran',  description = 'You don''t just earn — you use what you''ve earned. Smart.'                       WHERE slug = 'orders_diamond';

UPDATE public.achievements SET title = 'Community Builder',  description = 'You show up for other people''s ideas. That''s what community looks like.'        WHERE slug = 'community_bronze';
UPDATE public.achievements SET title = 'Pioneer',            description = 'You''re not just buying — you''re shaping what we stock.'                         WHERE slug = 'community_silver';
UPDATE public.achievements SET title = 'Community Catalyst', description = 'People trust your judgment. That reputation is earned.'                            WHERE slug = 'community_gold';
UPDATE public.achievements SET title = 'Founding Contributor', description = 'You''re one of the people who built this community. Permanent status.'          WHERE slug = 'community_diamond';

UPDATE public.achievements SET title = 'Referral Ambassador', description = 'You brought people in. The community grew because of you.'                      WHERE slug = 'referrals_bronze';
UPDATE public.achievements SET title = 'Referral Pro',        description = 'Five friends who trusted your recommendation. Well done.'                        WHERE slug = 'referrals_silver';
UPDATE public.achievements SET title = 'Referral Expert',     description = 'Fifteen friends. You''re practically a brand ambassador.'                        WHERE slug = 'referrals_gold';
UPDATE public.achievements SET title = 'Referral Legend',     description = 'Thirty referrals. SnusFriend is bigger because of you.'                          WHERE slug = 'referrals_diamond';

UPDATE public.achievements SET title = 'Daily Drop Debut',   description = 'Your first spin. Let''s see what luck brings.'                                   WHERE slug = 'milestone_first_spin';
UPDATE public.achievements SET title = 'Flavor Scout',        description = 'You''ve explored the full spectrum. Your palate doesn''t play favourites.'       WHERE slug = 'milestone_quiz_complete';
UPDATE public.achievements SET title = 'All Set Up',          description = 'Profile complete. You''re ready for everything SnusFriend has to offer.'         WHERE slug = 'milestone_profile_setup';
UPDATE public.achievements SET title = 'Streak Keeper',       description = 'Seven days straight. You''ve built a rhythm.'                                   WHERE slug = 'milestone_streak_7';

-- Insert new badges
INSERT INTO public.achievements (slug, category, tier, title, description, icon, threshold, points_reward, sort_order) VALUES
  ('flavor_brand_explorer',   'milestone', 'single', 'Brand Explorer',    'You don''t settle for one name. You know the landscape.',                'globe',      5,  50, 54),
  ('flavor_mint_specialist',  'milestone', 'single', 'Mint Specialist',   'Cool, collected, and deeply informed. Mint is your territory.',          'snowflake',  10, 75, 55),
  ('flavor_full_passport',    'milestone', 'single', 'Full Passport',     'The rarest stamp. You''ve tasted it all.',                               'award',      12, 150, 56),
  ('flavor_nordic_collector', 'milestone', 'single', 'Nordic Collector',  'You''ve traced the pouches back to where they started.',                 'map-pin',    6,  100, 57)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;
