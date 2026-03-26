
-- =====================================================
-- CATALOG SYNC TABLES
-- =====================================================

-- 1. Brands
CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  manufacturer text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands (slug);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='brands' AND policyname='Public can read brands') THEN
    CREATE POLICY "Public can read brands" ON public.brands FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='brands' AND policyname='Admins can manage brands') THEN
    CREATE POLICY "Admins can manage brands" ON public.brands FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description_key text,
  category_key text NOT NULL DEFAULT 'nicotinePouches',
  flavor_key text NOT NULL,
  strength_key text NOT NULL,
  format_key text NOT NULL,
  nicotine_mg numeric(5,1) NOT NULL DEFAULT 0,
  portions_per_can int NOT NULL DEFAULT 20,
  image_url text,
  ratings int NOT NULL DEFAULT 0,
  badge_keys text[] NOT NULL DEFAULT '{}',
  manufacturer text,
  is_active boolean NOT NULL DEFAULT true,
  nyehandel_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_nyehandel ON public.products (nyehandel_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products (is_active) WHERE is_active = true;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Public can read active products') THEN
    CREATE POLICY "Public can read active products" ON public.products FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Admins can manage products') THEN
    CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 3. Product variants (pack pricing)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  pack_size int NOT NULL, -- 1, 3, 5, 10, 30
  price numeric(8,2) NOT NULL,
  sku text UNIQUE,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, pack_size)
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants (product_id);
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_variants' AND policyname='Public can read variants') THEN
    CREATE POLICY "Public can read variants" ON public.product_variants FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='product_variants' AND policyname='Admins can manage variants') THEN
    CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 4. Inventory
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  quantity int NOT NULL DEFAULT 0,
  warehouse text DEFAULT 'default',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_variant ON public.inventory (variant_id);
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='inventory' AND policyname='Public can read inventory') THEN
    CREATE POLICY "Public can read inventory" ON public.inventory FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='inventory' AND policyname='Admins can manage inventory') THEN
    CREATE POLICY "Admins can manage inventory" ON public.inventory FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 5. SKU Mappings (admin only)
CREATE TABLE IF NOT EXISTS public.sku_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nyehandel_sku text NOT NULL,
  shopify_sku text,
  product_name text NOT NULL,
  status text NOT NULL DEFAULT 'missing' CHECK (status IN ('mapped', 'missing', 'conflict')),
  last_verified timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sku_mappings_status ON public.sku_mappings (status);
CREATE INDEX IF NOT EXISTS idx_sku_mappings_nyehandel ON public.sku_mappings (nyehandel_sku);
ALTER TABLE public.sku_mappings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sku_mappings' AND policyname='Admins can read sku_mappings') THEN
    CREATE POLICY "Admins can read sku_mappings" ON public.sku_mappings FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sku_mappings' AND policyname='Admins can manage sku_mappings') THEN
    CREATE POLICY "Admins can manage sku_mappings" ON public.sku_mappings FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 6. Sync Runs (admin only)
CREATE TABLE IF NOT EXISTS public.sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('catalog', 'inventory')),
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('success', 'partial', 'failed', 'running')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_ms int NOT NULL DEFAULT 0,
  items_processed int NOT NULL DEFAULT 0,
  errors int NOT NULL DEFAULT 0,
  error_details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sync_runs_type ON public.sync_runs (type, started_at DESC);
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sync_runs' AND policyname='Admins can read sync_runs') THEN
    CREATE POLICY "Admins can read sync_runs" ON public.sync_runs FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sync_runs' AND policyname='Admins can manage sync_runs') THEN
    CREATE POLICY "Admins can manage sync_runs" ON public.sync_runs FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 7. Webhook Inbox (admin only)
CREATE TABLE IF NOT EXISTS public.webhook_inbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  topic text NOT NULL,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed')),
  attempts int NOT NULL DEFAULT 0,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_webhook_inbox_provider ON public.webhook_inbox (provider);
CREATE INDEX IF NOT EXISTS idx_webhook_inbox_status ON public.webhook_inbox (status);
CREATE INDEX IF NOT EXISTS idx_webhook_inbox_received ON public.webhook_inbox (received_at DESC);
ALTER TABLE public.webhook_inbox ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='webhook_inbox' AND policyname='Admins can read webhook_inbox') THEN
    CREATE POLICY "Admins can read webhook_inbox" ON public.webhook_inbox FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='webhook_inbox' AND policyname='Admins can manage webhook_inbox') THEN
    CREATE POLICY "Admins can manage webhook_inbox" ON public.webhook_inbox FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Update trigger function for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_brands_updated_at ON public.brands;
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_inventory_updated_at ON public.inventory;
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
