-- =============================================================================
-- Security fixes: SECURITY_DEFINER views, mutable search_path, RLS tightening
-- 2026-03-27
-- =============================================================================

-- P0 #2: Fix SECURITY_DEFINER views → SECURITY INVOKER
-- These views run with creator permissions, bypassing RLS on underlying tables.

-- Recreate user_reputation view with SECURITY INVOKER
CREATE OR REPLACE VIEW public.user_reputation
WITH (security_invoker = true)
AS
SELECT
  pb.user_id,
  pb.lifetime_earned,
  rl.level,
  rl.name        AS level_name,
  rl.badge_color,
  rl.perks,
  nl.level       AS next_level,
  nl.name        AS next_level_name,
  nl.min_points  AS next_level_min_points
FROM public.points_balances pb
JOIN public.reputation_levels rl
  ON rl.level = (
    SELECT max(r2.level)
    FROM public.reputation_levels r2
    WHERE r2.min_points <= pb.lifetime_earned
  )
LEFT JOIN public.reputation_levels nl
  ON nl.level = rl.level + 1;

-- Recreate leaderboard_top_users view with SECURITY INVOKER
CREATE OR REPLACE VIEW public.leaderboard_top_users
WITH (security_invoker = true)
AS
SELECT
  pb.user_id,
  pb.balance AS total_points,
  up.display_name,
  a.image_url AS avatar_url,
  rl.name     AS level_name,
  rl.badge_color
FROM public.points_balances pb
LEFT JOIN public.user_profiles up ON up.user_id = pb.user_id
LEFT JOIN public.avatars a ON a.id = up.avatar_id
LEFT JOIN public.user_reputation ur ON ur.user_id = pb.user_id
LEFT JOIN public.reputation_levels rl ON rl.level = ur.level
ORDER BY pb.balance DESC
LIMIT 50;

-- =============================================================================
-- P1 #7: Fix mutable search_path on remaining functions
-- Without explicit search_path, a malicious user could create a schema
-- that shadows public functions/tables.
-- =============================================================================

ALTER FUNCTION public.redeem_points SET search_path = public;
ALTER FUNCTION public.get_or_create_referral_code SET search_path = public;
ALTER FUNCTION public.redeem_referral_code SET search_path = public;
ALTER FUNCTION public.record_daily_login SET search_path = public;
ALTER FUNCTION public.update_flavor_profiles_updated_at SET search_path = public;
ALTER FUNCTION public.award_social_share_points SET search_path = public;
ALTER FUNCTION public.update_question_answers_count SET search_path = public;
ALTER FUNCTION public.search_products SET search_path = public;

-- =============================================================================
-- P1 #9: Tighten newsletter_subscribers and waitlist_emails INSERT policies
-- Replace permissive WITH CHECK (true) with email format validation.
-- =============================================================================

-- newsletter_subscribers: require valid-looking email
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe with valid email"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) >= 5
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- waitlist_emails: require valid-looking email
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist_emails;
DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist_emails;
CREATE POLICY "Anyone can join waitlist with valid email"
  ON public.waitlist_emails FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) >= 5
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
