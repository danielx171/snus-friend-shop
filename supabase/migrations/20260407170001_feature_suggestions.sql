CREATE TABLE IF NOT EXISTS feature_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 5 AND 100),
  description TEXT CHECK (length(description) <= 500),
  votes INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'planned', 'shipped', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS suggestion_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id),
  suggestion_id UUID NOT NULL REFERENCES feature_suggestions(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, suggestion_id)
);
ALTER TABLE feature_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read suggestions" ON feature_suggestions FOR SELECT USING (true);
CREATE POLICY "Users create own suggestions" ON feature_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read votes" ON suggestion_votes FOR SELECT USING (true);
CREATE POLICY "Users manage own votes" ON suggestion_votes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
