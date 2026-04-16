CREATE TABLE IF NOT EXISTS discounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
  value numeric NOT NULL,
  currency text DEFAULT 'EUR',
  min_order_value numeric DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts (code) WHERE active = true;
