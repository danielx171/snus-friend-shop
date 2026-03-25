-- Fix TOCTOU race in max-tags trigger: add advisory lock per post
-- Also remove unnecessary SECURITY DEFINER (only reads data)
CREATE OR REPLACE FUNCTION public.check_max_product_tags()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_count INT;
BEGIN
  -- Lock per-post to serialize concurrent tag inserts
  PERFORM pg_advisory_xact_lock(hashtext(NEW.post_id::text));

  SELECT COUNT(*) INTO v_count
    FROM public.community_post_product_tags
    WHERE post_id = NEW.post_id;
  IF v_count >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 product tags per post';
  END IF;
  RETURN NEW;
END;
$$;
