-- Add Nyehandel parity field for future 1:1 status mapping with B2B logic
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS nyehandel_order_status text;

-- Nightly-generated operational alerts for B2B queue monitoring
CREATE TABLE IF NOT EXISTS public.ops_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_date date NOT NULL DEFAULT (timezone('utc'::text, now()))::date,
  rule_key text NOT NULL CHECK (rule_key IN ('unpaid_deadline', 'deliverable_delay')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  source_shopify_order_id text,
  title text NOT NULL,
  message text NOT NULL,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ops_alerts_unique_open
  ON public.ops_alerts (alert_date, rule_key, source_order_id);

CREATE INDEX IF NOT EXISTS idx_ops_alerts_status_date
  ON public.ops_alerts (status, alert_date DESC);

ALTER TABLE public.ops_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read ops_alerts"
ON public.ops_alerts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage ops_alerts"
ON public.ops_alerts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_ops_alerts_updated_at ON public.ops_alerts;
CREATE TRIGGER update_ops_alerts_updated_at
BEFORE UPDATE ON public.ops_alerts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
