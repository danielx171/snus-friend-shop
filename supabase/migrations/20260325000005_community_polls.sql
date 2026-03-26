-- Community Polls: poll questions on posts, options, and votes
-- Polls are 1:1 with posts (a post can optionally have a poll)

-- Poll table (one per post, optional)
CREATE TABLE public.community_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL UNIQUE REFERENCES public.community_posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL CHECK (char_length(question) BETWEEN 1 AND 200),
  ends_at TIMESTAMPTZ NULL, -- null = never expires
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_polls ENABLE ROW LEVEL SECURITY;

-- Anyone can read polls
CREATE POLICY "polls_select" ON public.community_polls
  FOR SELECT USING (true);

-- Only authenticated users can create polls (via post creation)
CREATE POLICY "polls_insert" ON public.community_polls
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.community_posts cp
      WHERE cp.id = post_id AND cp.user_id = auth.uid()
    )
  );

-- No update/delete by users (admin only via service role)

-- Poll options
CREATE TABLE public.community_poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.community_polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL CHECK (char_length(label) BETWEEN 1 AND 100),
  votes_count INT NOT NULL DEFAULT 0 CHECK (votes_count >= 0),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_poll_options ENABLE ROW LEVEL SECURITY;

-- Anyone can read options
CREATE POLICY "poll_options_select" ON public.community_poll_options
  FOR SELECT USING (true);

-- Only the poll creator can insert options
CREATE POLICY "poll_options_insert" ON public.community_poll_options
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.community_polls cp
      JOIN public.community_posts cpost ON cpost.id = cp.post_id
      WHERE cp.id = poll_id AND cpost.user_id = auth.uid()
    )
  );

-- Poll votes (one per user per poll)
CREATE TABLE public.community_poll_votes (
  poll_id UUID NOT NULL REFERENCES public.community_polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.community_poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (poll_id, user_id)
);

ALTER TABLE public.community_poll_votes ENABLE ROW LEVEL SECURITY;

-- Users can read all votes (needed for showing results)
CREATE POLICY "poll_votes_select" ON public.community_poll_votes
  FOR SELECT USING (true);

-- Votes are cast via RPC only (no direct insert to prevent races)
-- No INSERT/UPDATE/DELETE policies for client — RPC uses SECURITY DEFINER

-- Indexes for performance
CREATE INDEX idx_poll_options_poll_id ON public.community_poll_options(poll_id);
CREATE INDEX idx_poll_votes_poll_id ON public.community_poll_votes(poll_id);
CREATE INDEX idx_poll_votes_option_id ON public.community_poll_votes(option_id);
CREATE INDEX idx_community_polls_post_id ON public.community_polls(post_id);

-- Atomic vote RPC: one vote per user per poll, enforced server-side
-- Uses advisory lock to prevent TOCTOU race on concurrent votes
CREATE OR REPLACE FUNCTION public.cast_poll_vote(
  p_poll_id UUID,
  p_option_id UUID
)
RETURNS TABLE(voted boolean, option_id UUID, votes_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_existing_option UUID;
  v_poll_ends_at TIMESTAMPTZ;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Serialize votes per poll to prevent races
  PERFORM pg_advisory_xact_lock(hashtext(p_poll_id::text));

  -- Check poll exists and hasn't expired
  SELECT cp.ends_at INTO v_poll_ends_at
    FROM public.community_polls cp
    WHERE cp.id = p_poll_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Poll not found';
  END IF;
  IF v_poll_ends_at IS NOT NULL AND v_poll_ends_at < now() THEN
    RAISE EXCEPTION 'Poll has ended';
  END IF;

  -- Verify option belongs to this poll
  IF NOT EXISTS (
    SELECT 1 FROM public.community_poll_options cpo
    WHERE cpo.id = p_option_id AND cpo.poll_id = p_poll_id
  ) THEN
    RAISE EXCEPTION 'Invalid option for this poll';
  END IF;

  -- Check if user already voted
  SELECT cpv.option_id INTO v_existing_option
    FROM public.community_poll_votes cpv
    WHERE cpv.poll_id = p_poll_id AND cpv.user_id = v_user_id;

  IF FOUND THEN
    IF v_existing_option = p_option_id THEN
      -- Same option: remove vote (toggle off)
      DELETE FROM public.community_poll_votes cpv
        WHERE cpv.poll_id = p_poll_id AND cpv.user_id = v_user_id;
      UPDATE public.community_poll_options cpo
        SET votes_count = votes_count - 1
        WHERE cpo.id = p_option_id;
    ELSE
      -- Different option: switch vote
      UPDATE public.community_poll_votes cpv
        SET option_id = p_option_id
        WHERE cpv.poll_id = p_poll_id AND cpv.user_id = v_user_id;
      UPDATE public.community_poll_options cpo
        SET votes_count = votes_count - 1
        WHERE cpo.id = v_existing_option;
      UPDATE public.community_poll_options cpo
        SET votes_count = votes_count + 1
        WHERE cpo.id = p_option_id;
    END IF;
  ELSE
    -- New vote
    INSERT INTO public.community_poll_votes (poll_id, user_id, option_id)
      VALUES (p_poll_id, v_user_id, p_option_id);
    UPDATE public.community_poll_options cpo
      SET votes_count = votes_count + 1
      WHERE cpo.id = p_option_id;
  END IF;

  -- Return updated state for all options
  RETURN QUERY
    SELECT
      EXISTS (
        SELECT 1 FROM public.community_poll_votes cpv2
        WHERE cpv2.poll_id = p_poll_id AND cpv2.user_id = v_user_id
        AND cpv2.option_id = cpo2.id
      ) AS voted,
      cpo2.id AS option_id,
      cpo2.votes_count
    FROM public.community_poll_options cpo2
    WHERE cpo2.poll_id = p_poll_id
    ORDER BY cpo2.sort_order;
END;
$$;

-- Limit max poll options per poll (max 6)
CREATE OR REPLACE FUNCTION public.check_max_poll_options()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_count INT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(NEW.poll_id::text));
  SELECT COUNT(*) INTO v_count
    FROM public.community_poll_options
    WHERE poll_id = NEW.poll_id;
  IF v_count >= 6 THEN
    RAISE EXCEPTION 'Maximum 6 options per poll';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_max_poll_options
  BEFORE INSERT ON public.community_poll_options
  FOR EACH ROW EXECUTE FUNCTION public.check_max_poll_options();
