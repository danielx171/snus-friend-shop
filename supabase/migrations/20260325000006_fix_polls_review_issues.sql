-- Fix: Drop redundant index on community_polls.post_id
-- The UNIQUE constraint already creates an implicit unique index
DROP INDEX IF EXISTS idx_community_polls_post_id;
