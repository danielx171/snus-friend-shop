import { useState, useMemo, useCallback, type FormEvent } from 'react';
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal, clearCart } from '@/stores/cart';
import { packSizeMultipliers, type PackSize } from '@/data/products';
import { tenant } from '@/config/tenant';
import { actions } from 'astro:actions';

interface Props {
  userEmail?: string;
}

const SHIPPING_COUNTRIES = [
  { code: 'SE', name: 'Sweden' },
  { code: 'DE', name: 'Germany' },
  { code: 'AT', name: 'Austria' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NO', name: 'Norway' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'GB', name: 'United Kingdom' },
] as const;

/** Maps frontend shipping IDs to Nyehandel's expected method names */
const SHIPPING_NAME_MAP: Record<string, string> = {
  'ups-standard': 'UPS Standard (J229F1)',
  'ups-express': 'UPS Express Saver',
  'dhl-economy-eu': 'DHL Economy EU',
  'dhl-express-eu': 'DHL Express EU',
  'dhl-economy-intl': 'DHL Economy (Non EU)',
  'dhl-express-intl': 'DHL Express (Non EU)',
};

function getShippingMethods(country: string) {
  if (country === 'SE') {
    return [
      { id: 'ups-standard', label: 'UPS Standard (2-3 days)', price: 4.90 },
      { id: 'ups-express', label: 'UPS Express (1-2 days)', price: 9.90 },
    ];
  }
  const euCountries = ['DE', 'AT', 'DK', 'FI', 'NL', 'BE', 'FR', 'IT', 'ES', 'PL', 'CZ', 'IE', 'PT'];
  if (euCountries.includes(country)) {
    return [
      { id: 'dhl-economy-eu', label: 'DHL Economy EU (5-7 days)', price: 6.90 },
      { id: 'dhl-express-eu', label: 'DHL Express EU (2-3 days)', price: 12.90 },
    ];
  }
  return [
    { id: 'dhl-economy-intl', label: 'DHL Economy International (7-14 days)', price: 9.90 },
    { id: 'dhl-express-intl', label: 'DHL Express International (3-5 days)', price: 19.90 },
  ];
}

function packLabel(packSize: PackSize): string {
  const qty = packSizeMultipliers[packSize];
  return qty === 1 ? '1 can' : `${qty} cans`;
}

export default function CheckoutForm({ userEmail }: Props) {
  const cartItems = useStore($cartItems);
  const cartTotal = useStore($cartTotal);

  const [email, setEmail] = useState(userEmail || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('SE');
  const [phone, setPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shippingMethods = useMemo(() => getShippingMethods(country), [country]);
  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod);
  const shippingCost = selectedShipping?.price ?? 0;
  const orderTotal = cartTotal + shippingCost;

  // Reset shipping method when country changes
  const handleCountryChange = useCallback((newCountry: string) => {
    setCountry(newCountry);
    setShippingMethod('');
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!ageVerified) {
      setError('You must confirm you are 18 or older.');
      return;
    }
    if (!shippingMethod) {
      setError('Please select a shipping method.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const items = cartItems.map((item) => ({
        sku: `${item.product.id}-${item.packSize}`,
        quantity: item.quantity,
        product_name: item.product.name,
        pack_label: packLabel(item.packSize),
        unit_price: item.product.prices[item.packSize],
      }));

      const { data, error: actionError } = await actions.checkout.createCheckout({
        items,
        customer: {
          email,
          firstname: firstName,
          lastname: lastName,
        },
        billing_address: {
          address,
          postcode,
          city,
          country,
        },
        shipping_method: SHIPPING_NAME_MAP[shippingMethod] ?? shippingMethod,
        display_total: orderTotal,
        display_currency: tenant.currencyCode,
      });

      if (actionError) {
        setError(actionError.message || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      if (data?.redirect_url) {
        // Validate redirect URL to prevent open redirect attacks
        const allowedHosts = ['nyehandel.se', 'www.nyehandel.se', 'snusfriends.com', 'www.snusfriends.com'];
        try {
          const redirectUrl = new URL(data.redirect_url);
          if (!allowedHosts.some(host => redirectUrl.hostname === host || redirectUrl.hostname.endsWith('.' + host))) {
            setError('Invalid redirect URL received. Please contact support.');
            setSubmitting(false);
            return;
          }
        } catch {
          setError('Invalid redirect URL received. Please contact support.');
          setSubmitting(false);
          return;
        }
        clearCart();
        window.location.href = data.redirect_url;
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }, [cartItems, email, firstName, lastName, address, postcode, city, country, shippingMethod, ageVerified, orderTotal]);

  if (cartItems.length === 0 && !submitting) {
    return (
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8 text-center max-w-md mx-auto">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <a
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 mb-6 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Contact Details */}
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-muted-foreground mb-1">
                    Postcode
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-muted-foreground mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-muted-foreground mb-1">
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {SHIPPING_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
            <div className="space-y-2">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition ${
                    shippingMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm">{method.label}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {tenant.currencyCode} {method.price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Age Verification */}
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ageVerified}
                onChange={(e) => setAgeVerified(e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                I confirm that I am 18 years of age or older and legally permitted to purchase nicotine products in my country.
              </span>
            </label>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.packSize}`} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {packLabel(item.packSize)} x {item.quantity}
                    </p>
                  </div>
                  <span className="ml-3 shrink-0">
                    {tenant.currencyCode} {(item.product.prices[item.packSize] * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{tenant.currencyCode} {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shippingCost > 0
                    ? `${tenant.currencyCode} ${shippingCost.toFixed(2)}`
                    : shippingMethod
                      ? 'Free'
                      : 'Select method'}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span>{tenant.currencyCode} {orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0 || !shippingMethod || !ageVerified}
              className="w-full mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                `Pay ${tenant.currencyCode} ${orderTotal.toFixed(2)}`
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              You will be redirected to our secure payment provider.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
