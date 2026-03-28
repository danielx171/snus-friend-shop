-- P2 Performance & Security: Indexes on unindexed FKs + RLS policy optimization
-- Applied: 2026-03-28

BEGIN;

-- ============================================================================
-- 1. ADD INDEXES ON UNINDEXED FOREIGN KEYS (public schema only)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_community_answers_question_id ON community_answers (question_id);
CREATE INDEX IF NOT EXISTS idx_community_answers_user_id ON community_answers (user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments (user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts (user_id);
CREATE INDEX IF NOT EXISTS idx_community_questions_user_id ON community_questions (user_id);
CREATE INDEX IF NOT EXISTS idx_points_redemptions_voucher_id ON points_redemptions (voucher_id);
CREATE INDEX IF NOT EXISTS idx_quests_reward_avatar_id ON quests (reward_avatar_id);
CREATE INDEX IF NOT EXISTS idx_raw_articles_blog_post_id ON raw_articles (blog_post_id);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referral_code_id ON referral_redemptions (referral_code_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_tier_id ON user_memberships (tier_id);
CREATE INDEX IF NOT EXISTS idx_user_pouch_avatars_accessory_id ON user_pouch_avatars (accessory_id);
CREATE INDEX IF NOT EXISTS idx_user_pouch_avatars_background_id ON user_pouch_avatars (background_id);
CREATE INDEX IF NOT EXISTS idx_user_pouch_avatars_color_id ON user_pouch_avatars (color_id);
CREATE INDEX IF NOT EXISTS idx_user_pouch_avatars_expression_id ON user_pouch_avatars (expression_id);
CREATE INDEX IF NOT EXISTS idx_user_pouch_avatars_shape_id ON user_pouch_avatars (shape_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_avatar_id ON user_profiles (avatar_id);

-- ============================================================================
-- 2. FIX DUPLICATE PERMISSIVE RLS POLICIES
--    Combine user + admin SELECT policies into single policies per table.
--    Permissive policies are OR'd, so two separate ones work but cause extra
--    planning overhead. A single policy with OR is more efficient.
-- ============================================================================

-- orders: merge "Users can read own orders" + "Admins can read all orders"
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
CREATE POLICY "Users and admins can read orders" ON orders
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id
    OR has_role((SELECT auth.uid()), 'admin'::app_role)
  );

-- products: merge "Public can read active products" + "Admins can read all products"
DROP POLICY IF EXISTS "Public can read active products" ON products;
DROP POLICY IF EXISTS "Admins can read all products" ON products;
CREATE POLICY "Public and admins can read products" ON products
  FOR SELECT USING (
    is_active = true
    OR has_role((SELECT auth.uid()), 'admin'::app_role)
  );

-- user_roles: merge "Users can view own roles" + "Admins can read all roles"
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON user_roles;
CREATE POLICY "Users and admins can read roles" ON user_roles
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id
    OR has_role((SELECT auth.uid()), 'admin'::app_role)
  );

-- ============================================================================
-- 3. OPTIMIZE auth.uid() CALLS IN RLS POLICIES
--    Replace bare auth.uid() with (SELECT auth.uid()) to avoid per-row
--    re-evaluation. Skip storage.objects (managed by Supabase).
-- ============================================================================

-- challenge_participants
DROP POLICY IF EXISTS "Users can join challenges" ON challenge_participants;
CREATE POLICY "Users can join challenges" ON challenge_participants
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own challenge participation" ON challenge_participants;
CREATE POLICY "Users can read own challenge participation" ON challenge_participants
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own challenge progress" ON challenge_participants;
CREATE POLICY "Users can update own challenge progress" ON challenge_participants
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- community_answer_votes
DROP POLICY IF EXISTS "community_answer_votes_own_delete" ON community_answer_votes;
CREATE POLICY "community_answer_votes_own_delete" ON community_answer_votes
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "community_answer_votes_own_insert" ON community_answer_votes;
CREATE POLICY "community_answer_votes_own_insert" ON community_answer_votes
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "community_answer_votes_own_update" ON community_answer_votes;
CREATE POLICY "community_answer_votes_own_update" ON community_answer_votes
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- community_answers
DROP POLICY IF EXISTS "community_answers_auth_insert" ON community_answers;
CREATE POLICY "community_answers_auth_insert" ON community_answers
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "community_answers_own_update" ON community_answers;
CREATE POLICY "community_answers_own_update" ON community_answers
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- community_comments
DROP POLICY IF EXISTS "Authenticated insert community comments" ON community_comments;
CREATE POLICY "Authenticated insert community comments" ON community_comments
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- community_poll_options
DROP POLICY IF EXISTS "poll_options_insert" ON community_poll_options;
CREATE POLICY "poll_options_insert" ON community_poll_options
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM community_polls cp
      JOIN community_posts cpost ON cpost.id = cp.post_id
      WHERE cp.id = community_poll_options.poll_id
        AND cpost.user_id = (SELECT auth.uid())
    )
  );

-- community_polls
DROP POLICY IF EXISTS "polls_insert" ON community_polls;
CREATE POLICY "polls_insert" ON community_polls
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM community_posts cp
      WHERE cp.id = community_polls.post_id
        AND cp.user_id = (SELECT auth.uid())
    )
  );

-- community_post_likes
DROP POLICY IF EXISTS "Authenticated manage own community post likes" ON community_post_likes;
CREATE POLICY "Authenticated manage own community post likes" ON community_post_likes
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users delete own community post likes" ON community_post_likes;
CREATE POLICY "Users delete own community post likes" ON community_post_likes
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- community_post_product_tags
DROP POLICY IF EXISTS "Post author delete community post product tags" ON community_post_product_tags;
CREATE POLICY "Post author delete community post product tags" ON community_post_product_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.id = community_post_product_tags.post_id
        AND community_posts.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Post author insert community post product tags" ON community_post_product_tags;
CREATE POLICY "Post author insert community post product tags" ON community_post_product_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.id = community_post_product_tags.post_id
        AND community_posts.user_id = (SELECT auth.uid())
    )
  );

-- community_posts
DROP POLICY IF EXISTS "Authenticated insert community posts" ON community_posts;
CREATE POLICY "Authenticated insert community posts" ON community_posts
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users delete own community posts" ON community_posts;
CREATE POLICY "Users delete own community posts" ON community_posts
  FOR DELETE USING ((SELECT auth.uid()) = user_id AND flagged = false);

-- community_questions
DROP POLICY IF EXISTS "community_questions_auth_insert" ON community_questions;
CREATE POLICY "community_questions_auth_insert" ON community_questions
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "community_questions_own_update" ON community_questions;
CREATE POLICY "community_questions_own_update" ON community_questions
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- event_participants
DROP POLICY IF EXISTS "Users can join events" ON event_participants;
CREATE POLICY "Users can join events" ON event_participants
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own participation" ON event_participants;
CREATE POLICY "Users can read own participation" ON event_participants
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- flavor_profiles
DROP POLICY IF EXISTS "Users can insert own flavor profile" ON flavor_profiles;
CREATE POLICY "Users can insert own flavor profile" ON flavor_profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own flavor profile" ON flavor_profiles;
CREATE POLICY "Users can read own flavor profile" ON flavor_profiles
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own flavor profile" ON flavor_profiles;
CREATE POLICY "Users can update own flavor profile" ON flavor_profiles
  FOR UPDATE USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- login_streaks
DROP POLICY IF EXISTS "Users can read own streak" ON login_streaks;
CREATE POLICY "Users can read own streak" ON login_streaks
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- points_redemptions
DROP POLICY IF EXISTS "Users can read own redemptions" ON points_redemptions;
CREATE POLICY "Users can read own redemptions" ON points_redemptions
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- referral_codes
DROP POLICY IF EXISTS "Users can read own referral codes" ON referral_codes;
CREATE POLICY "Users can read own referral codes" ON referral_codes
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- referral_redemptions
DROP POLICY IF EXISTS "Users can read own referral redemptions" ON referral_redemptions;
CREATE POLICY "Users can read own referral redemptions" ON referral_redemptions
  FOR SELECT USING ((SELECT auth.uid()) = referred_user_id);

-- social_shares
DROP POLICY IF EXISTS "Users can insert own shares" ON social_shares;
CREATE POLICY "Users can insert own shares" ON social_shares
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own shares" ON social_shares;
CREATE POLICY "Users can read own shares" ON social_shares
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- spin_config
DROP POLICY IF EXISTS "Authenticated read spin config" ON spin_config;
CREATE POLICY "Authenticated read spin config" ON spin_config
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

-- user_achievements
DROP POLICY IF EXISTS "user_achievements_own_insert" ON user_achievements;
CREATE POLICY "user_achievements_own_insert" ON user_achievements
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_achievements_own_read" ON user_achievements;
CREATE POLICY "user_achievements_own_read" ON user_achievements
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_achievements_own_update" ON user_achievements;
CREATE POLICY "user_achievements_own_update" ON user_achievements
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- user_memberships
DROP POLICY IF EXISTS "Users can read own membership" ON user_memberships;
CREATE POLICY "Users can read own membership" ON user_memberships
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- user_pouch_avatars
DROP POLICY IF EXISTS "user_pouch_avatars_own_insert" ON user_pouch_avatars;
CREATE POLICY "user_pouch_avatars_own_insert" ON user_pouch_avatars
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_pouch_avatars_own_read" ON user_pouch_avatars;
CREATE POLICY "user_pouch_avatars_own_read" ON user_pouch_avatars
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_pouch_avatars_own_update" ON user_pouch_avatars;
CREATE POLICY "user_pouch_avatars_own_update" ON user_pouch_avatars
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

COMMIT;
