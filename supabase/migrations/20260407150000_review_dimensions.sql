-- Add industry-specific review dimensions for nicotine pouches
-- All nullable to preserve existing reviews
ALTER TABLE product_reviews
  ADD COLUMN IF NOT EXISTS flavor_intensity SMALLINT CHECK (flavor_intensity BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS sweetness SMALLINT CHECK (sweetness BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS burn SMALLINT CHECK (burn BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS moisture SMALLINT CHECK (moisture BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS longevity SMALLINT CHECK (longevity BETWEEN 1 AND 5);
