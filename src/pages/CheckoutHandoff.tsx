import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { PREVIEW_MODE } from '@/config/brand';

/* ── Types ── */

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

/* ── Shipping methods from NordicPouch Nyehandel admin ── */

const SHIPPING_OPTIONS = [
  { name: 'UPS Standard', price: 8.2, label: 'UPS Standard — €8.20' },
  { name: 'UPS Express Saver', price: 17.9, label: 'UPS Express Saver — €17.90' },
  { name: 'DHL Economy (Non EU)', price: 9.9, label: 'DHL Economy (Non EU) — €9.90' },
  { name: 'DHL Express (Non EU)', price: 14.9, label: 'DHL Express (Non EU) — €14.90' },
  { name: 'DHL Express EU', price: 12.9, label: 'DHL Express EU — €12.90' },
  { name: 'DHL Economy EU', price: 7.9, label: 'DHL Economy EU — €7.90' },
] as const;

const COUNTRY_OPTIONS = [
  { value: 'GB', label: 'United Kingdom' },
  { value: 'SE', label: 'Sweden' },
  { value: 'DE', label: 'Germany' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NO', label: 'Norway' },
  { value: 'FI', label: 'Finland' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'BE', label: 'Belgium' },
] as const;

/* ── Component ── */

export default function CheckoutHandoff() {
  const { items } = useCart();
  const { t, formatPrice, market } = useTranslation();
  const navigate = useNavigate();

  /* ── Form state ── */
  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    address: '',
    postcode: '',
    city: '',
    country: 'GB',
    shipping_method: SHIPPING_OPTIONS[0].name,
  });

  // Find the selected shipping option's price (in EUR)
  const selectedShippingOption = SHIPPING_OPTIONS.find(o => o.name === form.shipping_method) ?? SHIPPING_OPTIONS[0];
  const shippingPriceEUR = selectedShippingOption.price;

  const { subtotal, freeShipping, progress } = getCartTotals(
    items,
    market,
  );

  // Use the actual selected shipping cost instead of the generic market.shippingCost
  const shippingCost = freeShipping ? 0 : shippingPriceEUR;
  const finalTotal = subtotal + shippingCost;

  const localSubtotal = subtotal * market.rateFromGBP;
  const amountToFreeShipping = Math.max(0, market.freeShippingThreshold - localSubtotal);
  const shippingProgress = progress;

  const formatLocalAmount = (amount: number): string => {
    return formatMarketPrice(amount, market, market.currencyCode === 'EUR' ? 2 : 0);
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [ageVerified, setAgeVerified] = useState(false);
  const [skuMap, setSkuMap] = useState<Map<string, string> | null>(null);
  const [skuLoading, setSkuLoading] = useState(true);
  const [skuError, setSkuError] = useState(false);

  /* ── Prefill email from auth session ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email;
      if (email) {
        setForm((prev) => ({ ...prev, email }));
      }
    });
  }, []);

  /* ── Resolve SKUs on mount — each product has one SKU ── */
  useEffect(() => {
    if (items.length === 0) {
      setSkuLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const productIds = [...new Set(items.map((i) => i.product.id))];
        const { data: variants, error: variantsError } = await supabase
          .from('product_variants')
          .select('sku, pack_size, product_id')
          .in('product_id', productIds);

        if (cancelled) return;

        if (variantsError || !variants) {
          setSkuError(true);
          setSkuLoading(false);
          return;
        }

        // Map product_id → SKU (one SKU per product from Nyehandel)
        const map = new Map<string, string>();
        for (const v of variants as VariantRow[]) {
          if (v.sku && !map.has(v.product_id)) {
            map.set(v.product_id, v.sku);
          }
        }
        setSkuMap(map);
      } catch {
        if (!cancelled) setSkuError(true);
      } finally {
        if (!cancelled) setSkuLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [items]);

  /* ── Idempotency key — stable per mount ── */
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  /* ── Check if all cart items have SKUs ── */
  const missingSkus = useMemo(() => {
    if (!skuMap || skuLoading) return false;
    return items.some((item) => !skuMap.has(item.product.id));
  }, [items, skuMap, skuLoading]);

  /* ── Form validation ── */
  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!form.email.includes('@')) errors.email = 'Valid email is required';
    if (!form.firstname.trim()) errors.firstname = 'First name is required';
    if (!form.lastname.trim()) errors.lastname = 'Last name is required';
    if (!form.address.trim()) errors.address = 'Address is required';
    if (!form.postcode.trim()) errors.postcode = 'Postcode is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.country.trim()) errors.country = 'Country is required';
    if (!form.shipping_method) errors.shipping_method = 'Shipping method is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

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
    if (!validateForm() || submitting || !skuMap) return;

    setSubmitting(true);
    setError(null);

    try {
      // Map cart items to checkout items with SKUs
      // Each product has one SKU; pack size becomes a quantity multiplier
      const checkoutItems = items.map((item) => {
        const packCount = packSizeMultipliers[item.packSize];
        const sku = skuMap.get(item.product.id);
        if (!sku) throw new Error(`No SKU found for ${item.product.name}`);
        return {
          sku,
          quantity: item.quantity * packCount, // e.g. 2x pack3 = 6 cans
          product_name: item.product.name,
          pack_label: `${packCount} ${packCount === 1 ? 'can' : 'cans'}`,
          unit_price: item.product.prices[item.packSize],
        };
      });

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
        navigate(`/order-confirmation/${result.orderId}`, {
          state: { email: form.email },
        });
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
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  /* ── Preview mode gate ── */
  if (PREVIEW_MODE) {
    return (
      <>
        <SEO title={`Checkout | SnusFriend`} description="Store coming soon" />
        <Layout showNicotineWarning={false}>
          <div className="container py-16 flex justify-center">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center space-y-3">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h1 className="text-xl font-bold text-foreground">This store is coming soon.</h1>
                <p className="text-muted-foreground">
                  Browsing is enabled — purchases are not yet active.
                </p>
                <Button variant="outline" asChild className="mt-2">
                  <Link to="/nicotine-pouches">Continue browsing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </>
    );
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

  const canSubmit = isFormValid() && ageVerified && !submitting && !missingSkus && !skuError && !skuLoading;

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

                {/* Contact */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Contact</h2>

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
                      {fieldErrors.email && (
                        <p className="text-xs text-destructive">{fieldErrors.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Delivery Address</h2>

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
                        {fieldErrors.firstname && (
                          <p className="text-xs text-destructive">{fieldErrors.firstname}</p>
                        )}
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
                        {fieldErrors.lastname && (
                          <p className="text-xs text-destructive">{fieldErrors.lastname}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address"
                        value={form.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        required
                      />
                      {fieldErrors.address && (
                        <p className="text-xs text-destructive">{fieldErrors.address}</p>
                      )}
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
                        {fieldErrors.postcode && (
                          <p className="text-xs text-destructive">{fieldErrors.postcode}</p>
                        )}
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
                        {fieldErrors.city && (
                          <p className="text-xs text-destructive">{fieldErrors.city}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={form.country}
                        onValueChange={(v) => updateField('country', v)}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_OPTIONS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldErrors.country && (
                        <p className="text-xs text-destructive">{fieldErrors.country}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Shipping Method</h2>

                    <Select
                      value={form.shipping_method}
                      onValueChange={(v) => updateField('shipping_method', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping method" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIPPING_OPTIONS.map((method) => (
                          <SelectItem key={method.name} value={method.name}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.shipping_method && (
                      <p className="text-xs text-destructive">{fieldErrors.shipping_method}</p>
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
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <span className="text-xs text-muted-foreground text-center px-1 line-clamp-2">{item.product.name}</span>
                              </div>
                            )}
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
                        <span className="text-muted-foreground">{t('cart.delivery')} ({selectedShippingOption.name})</span>
                        <span className="font-medium">
                          {freeShipping ? (
                            <span className="text-primary">{t('cart.free')}</span>
                          ) : (
                            formatPrice(shippingCost)
                          )}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base">
                        <span className="font-bold">{t('cart.total')}</span>
                        <span className="font-bold">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>

                    {error && (
                      <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/30 p-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    {skuLoading ? (
                      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    ) : (missingSkus || skuError) ? (
                      <div className="mt-6 rounded-md bg-destructive/10 border border-destructive/30 p-3">
                        <p className="text-sm text-destructive">
                          Some items are unavailable for checkout. Please remove them to continue.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 mt-6">
                          <Checkbox
                            id="age-verify"
                            checked={ageVerified}
                            onCheckedChange={(checked) => setAgeVerified(checked === true)}
                            className="mt-0.5"
                          />
                          <label htmlFor="age-verify" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                            I confirm I am 18 years or older and eligible to purchase nicotine products.
                          </label>
                        </div>

                        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                          <p>All prices include VAT where applicable.</p>
                          <p>
                            You have 14 days from delivery to withdraw from this purchase.{' '}
                            <Link to="/returns" className="underline hover:text-foreground">
                              Returns &amp; refunds policy
                            </Link>
                          </p>
                          <p>Estimated delivery: 3-10 business days.</p>
                          <p>
                            By placing this order you accept our{' '}
                            <Link to="/terms" className="underline hover:text-foreground">
                              terms &amp; conditions
                            </Link>.
                          </p>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full mt-6"
                          disabled={!canSubmit}
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
                      </>
                    )}

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
