-- Skapa tabellen för ordrar
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopify_order_id TEXT UNIQUE,
    customer_email TEXT,
    total_price NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GBP',
    nyehandel_sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (nyehandel_sync_status IN ('pending', 'synced', 'failed')),
    nyehandel_order_id TEXT, -- ID:t vi får tillbaka från 3PL
    last_sync_error TEXT,    -- För att kunna se vad som gick fel vid 3PL-push
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktivera RLS (Row Level Security)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Endast administratörer kan läsa/skriva allt
CREATE POLICY "Admins have full access to orders" 
ON public.orders 
FOR ALL 
TO authenticated 
USING (
  (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
);

-- Index för snabbare sökning på Shopify ID
CREATE INDEX IF NOT EXISTS idx_orders_shopify_id ON public.orders(shopify_order_id);