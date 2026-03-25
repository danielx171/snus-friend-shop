-- Issue 2: Fix likes_count race condition — gate increment on FOUND
CREATE OR REPLACE FUNCTION public.toggle_community_post_like(p_post_id UUID)
RETURNS TABLE(liked BOOLEAN, new_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_deleted INT;
  v_count INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM public.community_post_likes
    WHERE community_post_likes.post_id = p_post_id
      AND community_post_likes.user_id = v_user_id;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  IF v_deleted > 0 THEN
    UPDATE public.community_posts SET likes_count = GREATEST(likes_count - 1, 0)
      WHERE id = p_post_id;
    SELECT community_posts.likes_count INTO v_count FROM public.community_posts WHERE id = p_post_id;
    RETURN QUERY SELECT false, v_count;
  ELSE
    INSERT INTO public.community_post_likes (post_id, user_id)
      VALUES (p_post_id, v_user_id)
      ON CONFLICT DO NOTHING;
    IF FOUND THEN
      UPDATE public.community_posts SET likes_count = likes_count + 1
        WHERE id = p_post_id;
    END IF;
    SELECT community_posts.likes_count INTO v_count FROM public.community_posts WHERE id = p_post_id;
    RETURN QUERY SELECT true, v_count;
  END IF;
END;
$$;

-- Issue 3: Prevent authors from deleting flagged posts before moderator review
DROP POLICY IF EXISTS "Users delete own community posts" ON public.community_posts;
CREATE POLICY "Users delete own community posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND flagged = false);

-- Issue 7: Fix comments_count trigger to exclude flagged comments
CREATE OR REPLACE FUNCTION public.update_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NOT NEW.flagged THEN
    UPDATE public.community_posts SET comments_count = comments_count + 1
      WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND NOT OLD.flagged THEN
    UPDATE public.community_posts SET comments_count = GREATEST(comments_count - 1, 0)
      WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Issue 1 (DB layer): Add CHECK constraint on photo_url to restrict to Supabase storage
ALTER TABLE public.community_posts
  ADD CONSTRAINT chk_community_posts_photo_url
  CHECK (photo_url IS NULL OR photo_url LIKE 'https://bozdnoctcszbhemdjsek.supabase.co/storage/v1/object/public/%');
