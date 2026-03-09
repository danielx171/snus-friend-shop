import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Package, Truck, MapPin, Home, ArrowRight, Copy } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/* ── mock data ── */
const mockOrder = {
  id: 'SF-20260309-4821',
  date: 'March 9, 2026',
  items: [
    { name: 'ZYN Cool Mint Slim', qty: 2, packLabel: '10-pack', price: 39.99 },
    { name: 'VELO Ice Cool Strong', qty: 1, packLabel: '5-pack', price: 19.99 },
    { name: 'LOOP Berry Frost', qty: 1, packLabel: '3-pack', price: 11.99 },
  ],
  subtotal: 111.96,
  shipping: 0,
  discount: -11.20,
  total: 100.76,
  address: {
    name: 'James Wilson',
    line1: '42 Camden High Street',
    line2: 'London NW1 0JH',
    country: 'United Kingdom',
  },
};

const timelineSteps = [
  { key: 'placed', label: 'Order Placed', icon: Check, done: true, active: false },
  { key: 'processing', label: 'Processing', icon: Package, done: false, active: true },
  { key: 'shipped', label: 'Shipped', icon: Truck, done: false, active: false },
  { key: 'delivered', label: 'Delivered', icon: Home, done: false, active: false },
] as const;

export default function OrderConfirmation() {
  const [showCheck, setShowCheck] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCheck(true), 150);
    return () => clearTimeout(t);
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(mockOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <span className="font-mono tracking-wide">{mockOrder.id}</span>
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
                    {/* Step node */}
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

                    {/* Connector line */}
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
              <span className="text-sm text-muted-foreground">{mockOrder.date}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockOrder.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.packLabel} × {item.qty}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}

            <Separator />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(mockOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-[hsl(var(--success))]">Free</span>
              </div>
              {mockOrder.discount !== 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-[hsl(var(--success))]">
                    {formatPrice(mockOrder.discount)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between pt-1 text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(mockOrder.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Shipping Address ── */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="text-sm leading-relaxed text-foreground">
                <p className="font-medium">{mockOrder.address.name}</p>
                <p className="text-muted-foreground">{mockOrder.address.line1}</p>
                <p className="text-muted-foreground">{mockOrder.address.line2}</p>
                <p className="text-muted-foreground">{mockOrder.address.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
