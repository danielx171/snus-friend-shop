-- Track when review request emails are sent to avoid duplicates
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS review_email_sent_at TIMESTAMPTZ;
