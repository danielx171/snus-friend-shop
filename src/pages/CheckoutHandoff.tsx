import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Truck, Loader2 } from 'lucide-react';
import { packSizeMultipliers } from '@/data/products';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMarketPrice } from '@/lib/market';
import { getCartTotals } from '@/lib/cart-utils';
import { SEO } from '@/components/seo/SEO';
import { apiFetch } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

/* ── Types ── */

interface ShippingMethodsResponse {
  methods: string[];
}

interface CheckoutResponse {
  ok: boolean;
  orderId: string;
  nyehandelOrderId: string;
  prefix: string | null;
  requestId: string;
  idempotent?: boolean;
}

interface VariantRow {
  sku: string | null;
  pack_size: number;
  product_id: string;
}

/* ── Component ── */

export default function CheckoutHandoff() {
  const { items } = useCart();
  const { t, formatPrice, market } = useTranslation();
  const navigate = useNavigate();

  const { subtotal, shipping, finalTotal, freeShipping, progress } = getCartTotals(
    items,
    market,
  );

  const localSubtotal = subtotal * market.rateFromGBP;
  const amountToFreeShipping = Math.max(0, market.freeShippingThreshold - localSubtotal);
  const shippingProgress = progress;

  const formatLocalAmount = (amount: number): string => {
    return formatMarketPrice(amount, market, market.currencyCode === 'GBP' ? 2 : 0);
  };

  /* ── Form state ── */
  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    address: '',
    postcode: '',
    city: '',
    country: 'GB',
    shipping_method: '',
  });

  const [shippingMethods, setShippingMethods] = useState<string[]>([]);
  const [shippingLoading, setShippingLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Prefill email from auth session ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email;
      if (email) {
        setForm((prev) => ({ ...prev, email }));
      }
    });
  }, []);

  /* ── Fetch shipping methods ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await apiFetch<ShippingMethodsResponse>('get-shipping-methods');
        if (!cancelled && result.methods?.length) {
          setShippingMethods(result.methods);
          setForm((prev) => ({
            ...prev,
            shipping_method: prev.shipping_method || result.methods[0],
          }));
        }
      } catch {
        // Shipping methods unavailable — form will show error on submit
      } finally {
        if (!cancelled) setShippingLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Idempotency key — stable per mount ── */
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  /* ── Resolve SKUs from product_variants ── */
  async function resolveSkus(): Promise<Array<{
    sku: string;
    quantity: number;
    product_name: string;
    pack_label: string;
    unit_price: number;
  }>> {
    const productIds = [...new Set(items.map((i) => i.product.id))];

    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('sku, pack_size, product_id')
      .in('product_id', productIds);

    if (variantsError || !variants) {
      throw new Error('Failed to resolve product SKUs');
    }

    const variantMap = new Map<string, string>();
    for (const v of variants as VariantRow[]) {
      if (v.sku) {
        variantMap.set(`${v.product_id}:${v.pack_size}`, v.sku);
      }
    }

    const resolved = [];
    for (const item of items) {
      const packCount = packSizeMultipliers[item.packSize];
      const key = `${item.product.id}:${packCount}`;
      const sku = variantMap.get(key);
      if (!sku) {
        throw new Error(`No SKU found for ${item.product.name} (${item.packSize})`);
      }
      resolved.push({
        sku,
        quantity: item.quantity,
        product_name: item.product.name,
        pack_label: `${packCount} ${packCount === 1 ? 'can' : 'cans'}`,
        unit_price: item.product.prices[item.packSize],
      });
    }

    return resolved;
  }

  /* ── Form validation ── */
  function isFormValid(): boolean {
    return (
      form.email.includes('@') &&
      form.firstname.trim().length > 0 &&
      form.lastname.trim().length > 0 &&
      form.address.trim().length > 0 &&
      form.postcode.trim().length > 0 &&
      form.city.trim().length > 0 &&
      form.country.trim().length > 0 &&
      form.shipping_method.length > 0
    );
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const checkoutItems = await resolveSkus();

      const result = await apiFetch<CheckoutResponse>('create-nyehandel-checkout', {
        method: 'POST',
        body: {
          items: checkoutItems,
          customer: {
            email: form.email,
            firstname: form.firstname,
            lastname: form.lastname,
          },
          billing_address: {
            address: form.address,
            postcode: form.postcode,
            city: form.city,
            country: form.country,
          },
          shipping_method: form.shipping_method,
          idempotency_key: idempotencyKey,
          display_total: finalTotal,
          display_currency: market.currencyCode,
        },
      });

      if (result.ok && result.orderId) {
        navigate(`/order-confirmation/${result.orderId}`);
      } else {
        setError('Order creation failed. Please try again.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Update form field ── */
  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <>
        <SEO title={`${t('checkout.title')} | SnusFriend`} description={t('checkout.emptyDescription')} />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-8">{t('checkout.emptyDescription')}</p>
            <Button asChild size="lg">
              <Link to="/nicotine-pouches">{t('cart.browseProducts')}</Link>
            </Button>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEO title={`${t('checkout.title')} | SnusFriend`} description={t('checkout.emptyDescription')} />
      <Layout showNicotineWarning={false}>
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">{t('checkout.title')}</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* ── Left column: form + items ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Free Shipping Progress */}
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="h-5 w-5 text-primary" />
                      {freeShipping ? (
                        <span className="font-semibold text-primary">
                          {t('cart.freeShippingAchieved')}
                        </span>
                      ) : (
                        <span className="text-sm text-foreground">
                          {t('cart.freeShippingProgress', { amount: formatLocalAmount(amountToFreeShipping) })}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${shippingProgress}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Details */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Customer Details</h2>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstname">First name</Label>
                        <Input
                          id="firstname"
                          placeholder="First name"
                          value={form.firstname}
                          onChange={(e) => updateField('firstname', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname">Last name</Label>
                        <Input
                          id="lastname"
                          placeholder="Last name"
                          value={form.lastname}
                          onChange={(e) => updateField('lastname', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address"
                        value={form.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input
                          id="postcode"
                          placeholder="Postcode"
                          value={form.postcode}
                          onChange={(e) => updateField('postcode', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={form.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country code (e.g. GB)"
                        value={form.country}
                        onChange={(e) => updateField('country', e.target.value.toUpperCase().slice(0, 2))}
                        maxLength={2}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        2-letter country code (GB, SE, DE, etc.)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Shipping Method</h2>

                    {shippingLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading shipping options...
                      </div>
                    ) : shippingMethods.length === 0 ? (
                      <p className="text-sm text-destructive">
                        Shipping methods are temporarily unavailable. Please try again later.
                      </p>
                    ) : (
                      <Select
                        value={form.shipping_method}
                        onValueChange={(v) => updateField('shipping_method', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                        <SelectContent>
                          {shippingMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </CardContent>
                </Card>

                {/* Cart Items (read-only) */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const packCount = packSizeMultipliers[item.packSize];
                    const itemTotal = item.product.prices[item.packSize] * item.quantity;
                    const canLabel = packCount === 1 ? t('cart.can') : t('cart.cans');

                    return (
                      <Card key={`${item.product.id}-${item.packSize}`}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground line-clamp-1">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.product.brand} &bull; {packCount} {canLabel} &times; {item.quantity}
                              </p>
                              <p className="mt-1 font-medium text-foreground">{formatPrice(itemTotal)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* ── Right column: order summary ── */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4">{t('cart.orderSummary')}</h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('cart.delivery')}</span>
                        <span className="font-medium">
                          {freeShipping ? (
                            <span className="text-primary">{t('cart.free')}</span>
                          ) : (
                            formatPrice(shipping)
                          )}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base">
                        <span className="font-bold">{t('cart.total')}</span>
                        <span className="font-bold">{formatPrice(finalTotal)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('cart.includingVat')}</p>
                    </div>

                    {error && (
                      <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/30 p-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-6"
                      disabled={submitting || !isFormValid() || shippingMethods.length === 0}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Payment is handled securely by our fulfillment partner.
                    </p>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      {t('cart.secureCheckout')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
