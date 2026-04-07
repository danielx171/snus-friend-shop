-- Seed VIP multiplier config for spin wheel
-- Edge function was falling back to hardcoded defaults because this row was missing
insert into public.spin_config (key, value)
values ('vip_multiplier', '{"points_multiplier": 2, "discount_boost": 5}'::jsonb)
on conflict (key) do nothing;
