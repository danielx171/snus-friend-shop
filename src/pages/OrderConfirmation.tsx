import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Package, Truck, MapPin, Home, ArrowRight, Copy, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';
import { useCart } from '@/context/CartContext';

/* ── Types ── */

interface LineItem {
  name: string;
  qty: number;
  packLabel: string;
  price: number;
}

interface Address {
  name: string;
  line1: string;
  line2: string;
  country: string;
}

type PageState =
  | { kind: 'loading' }
  | { kind: 'no-id' }
  | { kind: 'not-auth' }
  | { kind: 'not-found' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ok';
      orderId: string;
      date: string;
      items: LineItem[];
      total: number;
      currency: string;
      address: Address | null;
    };

/* ── Defensive normalisers ── */

function normalizeLineItems(snapshot: unknown): LineItem[] {
  if (!Array.isArray(snapshot)) return [];
  return snapshot.flatMap((raw): LineItem[] => {
    if (!raw || typeof raw !== 'object') return [];
    const r = raw as Record<string, unknown>;
    const name =
      typeof r.product_name === 'string'
        ? r.product_name
        : typeof r.name === 'string'
        ? r.name
        : typeof r.sku === 'string'
        ? r.sku
        : 'Product';
    const qty =
      typeof r.quantity === 'number'
        ? r.quantity
        : typeof r.qty === 'number'
        ? r.qty
        : 1;
    const packLabel =
      typeof r.pack_label === 'string'
        ? r.pack_label
        : typeof r.pack_size === 'string'
        ? r.pack_size
        : typeof r.packLabel === 'string'
        ? r.packLabel
        : '';
    const price =
      typeof r.unit_price === 'number'
        ? r.unit_price
        : typeof r.price === 'number'
        ? r.price
        : 0;
    return [{ name, qty, packLabel, price }];
  });
}

function normalizeAddress(raw: unknown): Address | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  // Handle both Nyehandel-style (firstname/lastname) and legacy (first_name/name) shapes
  const firstName =
    typeof r.firstname === 'string' ? r.firstname
    : typeof r.first_name === 'string' ? r.first_name
    : '';
  const lastName =
    typeof r.lastname === 'string' ? r.lastname
    : typeof r.last_name === 'string' ? r.last_name
    : '';
  const fullName =
    typeof r.name === 'string'
      ? r.name
      : [firstName, lastName].filter(Boolean).join(' ');
  if (!fullName) return null;

  const line1 =
    typeof r.address === 'string' ? r.address
    : typeof r.address1 === 'string' ? r.address1
    : typeof r.line1 === 'string' ? r.line1
    : '';
  const city = typeof r.city === 'string' ? r.city : '';
  const zip =
    typeof r.postcode === 'string' ? r.postcode
    : typeof r.zip === 'string' ? r.zip
    : '';
  const line2 =
    typeof r.line2 === 'string'
      ? r.line2
      : [city, zip].filter(Boolean).join(' ');
  const country =
    typeof r.country === 'string'
      ? r.country
      : typeof r.country_name === 'string'
      ? r.country_name
      : '';

  return { name: fullName, line1, line2, country };
}

/* ── Static timeline ── */

const timelineSteps = [
  { key: 'placed', label: 'Order Placed', icon: Check, done: true, active: false },
  { key: 'processing', label: 'Processing', icon: Package, done: false, active: true },
  { key: 'shipped', label: 'Shipped', icon: Truck, done: false, active: false },
  { key: 'delivered', label: 'Delivered', icon: Home, done: false, active: false },
] as const;

/* ── Component ── */

/* ── Edge function response shape ── */

interface OrderConfirmationResponse {
  ok: boolean;
  order: {
    id: string;
    created_at: string;
    total_price: number;
    currency: string;
    checkout_status: string;
    line_items_snapshot: unknown;
    shipping_address: unknown;
  };
  error?: string;
}

export default function OrderConfirmation() {
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const orderId = paramOrderId ?? searchParams.get('orderId') ?? undefined;

  const [state, setState] = useState<PageState>({ kind: 'loading' });
  const [showCheck, setShowCheck] = useState(false);
  const [copied, setCopied] = useState(false);

  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  /* ── Fetch order via server-side edge function ── */
  useEffect(() => {
    if (!orderId) {
      setState({ kind: 'no-id' });
      return;
    }

    let cancelled = false;

    (async () => {
      // Resolve email: navigation state (from checkout) > auth session
      const navEmail = (location.state as { email?: string } | null)?.email;
      let email = typeof navEmail === 'string' ? navEmail.trim() : '';

      if (!email) {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        email = session?.user?.email ?? '';
      }

      if (!email) {
        setState({ kind: 'not-auth' });
        return;
      }

      try {
        const result = await apiFetch<OrderConfirmationResponse>(
          'get-order-confirmation',
          {
            method: 'POST',
            body: { orderId, email },
          },
        );

        if (cancelled) return;

        if (!result.ok || !result.order) {
          setState({ kind: 'not-found' });
          return;
        }

        const { order } = result;
        setState({
          kind: 'ok',
          orderId: order.id,
          date: new Date(order.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          items: normalizeLineItems(order.line_items_snapshot),
          total: typeof order.total_price === 'number' ? order.total_price : 0,
          currency: typeof order.currency === 'string' ? order.currency : 'SEK',
          address: normalizeAddress(order.shipping_address),
        });
      } catch {
        if (cancelled) return;
        setState({ kind: 'not-found' });
      }
    })();

    return () => { cancelled = true; };
  }, [orderId, location.state]);

  /* ── Clear cart once on success ── */
  useEffect(() => {
    if (state.kind === 'ok' && !cartCleared.current) {
      cartCleared.current = true;
      clearCart();
    }
  }, [state.kind, clearCart]);

  /* ── Animate check icon on success ── */
  useEffect(() => {
    if (state.kind !== 'ok') return;
    const t = setTimeout(() => setShowCheck(true), 150);
    return () => clearTimeout(t);
  }, [state.kind]);

  const copyOrderId = () => {
    if (state.kind !== 'ok') return;
    navigator.clipboard.writeText(state.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Non-ok states ── */

  if (state.kind === 'loading') {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (state.kind === 'no-id') {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-semibold">No order found</h1>
          <p className="mt-2 text-muted-foreground">No order ID was provided in the URL.</p>
          <Button asChild className="mt-6">
            <Link to="/">Back to shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (state.kind === 'not-auth') {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-semibold">Sign in required</h1>
          <p className="mt-2 text-muted-foreground">
            Please sign in to view your order confirmation.
          </p>
          <Button asChild className="mt-6">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (state.kind === 'not-found') {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-semibold">Order not found</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find that order on your account.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/account">View orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Back to shop</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (state.kind === 'error') {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground text-sm">{state.message}</p>
          <Button asChild className="mt-6">
            <Link to="/account">View orders</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  /* ── Success state ── */

  const { orderId: displayId, date, items, total, address } = state;

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* ── Success header ── */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div
            className={cn(
              'mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--success))] transition-all duration-700',
              showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
            )}
          >
            <Check className="h-10 w-10 text-[hsl(var(--success-foreground))]" strokeWidth={3} />
          </div>

          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your order has been confirmed and is being prepared.
          </p>

          <button
            onClick={copyOrderId}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <span className="font-mono tracking-wide">{displayId}</span>
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            {copied && <span className="text-xs text-[hsl(var(--success))]">Copied</span>}
          </button>
        </div>

        {/* ── Order Status Timeline ── */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === timelineSteps.length - 1;

                return (
                  <div key={step.key} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors sm:h-12 sm:w-12',
                          step.done && 'border-[hsl(var(--success))] bg-[hsl(var(--success))]',
                          step.active && 'border-primary bg-primary/10',
                          !step.done && !step.active && 'border-border bg-secondary/40',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 sm:h-5 sm:w-5',
                            step.done && 'text-[hsl(var(--success-foreground))]',
                            step.active && 'text-primary',
                            !step.done && !step.active && 'text-muted-foreground',
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-center text-[11px] font-medium leading-tight sm:text-xs',
                          step.done || step.active ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {step.label}
                      </span>
                    </div>

                    {!isLast && (
                      <div className="mx-1 mb-6 h-0.5 flex-1 sm:mx-2">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            step.done ? 'bg-[hsl(var(--success))]' : 'bg-border',
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Order Summary ── */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Order Summary</CardTitle>
              <span className="text-sm text-muted-foreground">{date}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items available.</p>
            ) : (
              items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    {item.packLabel && (
                      <p className="text-xs text-muted-foreground">
                        {item.packLabel} × {item.qty}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))
            )}

            <Separator />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between pt-1 text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Shipping Address ── */}
        {address && (
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="text-sm leading-relaxed text-foreground">
                  <p className="font-medium">{address.name}</p>
                  {address.line1 && <p className="text-muted-foreground">{address.line1}</p>}
                  {address.line2 && <p className="text-muted-foreground">{address.line2}</p>}
                  {address.country && <p className="text-muted-foreground">{address.country}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link to="/">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/account">View Account</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
