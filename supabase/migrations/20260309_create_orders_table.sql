-- Create orders table (originally with Shopify columns, now superseded by 20260318000000)
-- This migration is kept for history; the table already exists.

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_email TEXT,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'GBP',
    nyehandel_sync_status TEXT NOT NULL DEFAULT 'pending',
    nyehandel_order_id TEXT,
    last_sync_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Admins have full access to orders') THEN
    CREATE POLICY "Admins have full access to orders"
    ON public.orders
    FOR ALL
    TO authenticated
    USING (
      (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );
  END IF;
END $$;
