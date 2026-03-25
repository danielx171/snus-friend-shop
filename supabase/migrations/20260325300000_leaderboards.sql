-- Leaderboard view: top 50 users by points balance
create or replace view public.leaderboard_top_users as
select
  pb.user_id,
  pb.balance as total_points,
  up.display_name,
  a.image_url as avatar_url
from public.points_balances pb
left join public.user_profiles up on up.user_id = pb.user_id
left join public.avatars a on a.id = up.avatar_id
order by pb.balance desc
limit 50;

-- Grant read access
grant select on public.leaderboard_top_users to anon, authenticated;
