// ---------------------------------------------------------------------------
// PostHog custom event helpers.
//
// All calls are safe to use in SSR / non-browser contexts — they silently
// no-op when `window.posthog` is unavailable (e.g. SSR, bot, consent denied).
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (id: string, properties?: Record<string, unknown>) => void;
      __loaded?: boolean;
    };
  }
}

function ph() {
  return typeof window !== 'undefined' ? window.posthog : undefined;
}

// ── E-commerce events ──

export function trackAddToCart(props: {
  productId: string;
  productName: string;
  brand: string;
  packSize: string;
  quantity: number;
  price: number;
  currency?: string;
}) {
  ph()?.capture('add_to_cart', {
    product_id: props.productId,
    product_name: props.productName,
    brand: props.brand,
    pack_size: props.packSize,
    quantity: props.quantity,
    price: props.price,
    currency: props.currency ?? 'EUR',
  });
}

export function trackRemoveFromCart(props: {
  productId: string;
  productName: string;
  packSize: string;
}) {
  ph()?.capture('remove_from_cart', {
    product_id: props.productId,
    product_name: props.productName,
    pack_size: props.packSize,
  });
}

export function trackProductViewed(props: {
  productId: string;
  productName: string;
  brand: string;
  price: number;
  strengthKey: string;
  flavorKey: string;
}) {
  ph()?.capture('product_viewed', {
    product_id: props.productId,
    product_name: props.productName,
    brand: props.brand,
    price: props.price,
    strength: props.strengthKey,
    flavor: props.flavorKey,
    currency: 'EUR',
  });
}

export function trackCheckoutStarted(props: {
  cartTotal: number;
  itemCount: number;
  currency?: string;
}) {
  ph()?.capture('checkout_started', {
    cart_total: props.cartTotal,
    item_count: props.itemCount,
    currency: props.currency ?? 'EUR',
  });
}

// ── Engagement events ──

export function trackSearchPerformed(props: {
  query: string;
  resultCount: number;
}) {
  ph()?.capture('search_performed', {
    query: props.query,
    result_count: props.resultCount,
  });
}

export function trackNewsletterSignup(props: {
  source: string;
}) {
  ph()?.capture('newsletter_signup', {
    source: props.source,
  });
}

export function trackSpinWheelUsed(props: {
  prize?: string;
}) {
  ph()?.capture('spin_wheel_used', {
    prize: props.prize ?? 'unknown',
  });
}

export function trackQuizCompleted(props: {
  flavors: string[];
  strength: string;
  resultCount: number;
}) {
  ph()?.capture('quiz_completed', {
    flavors: props.flavors,
    strength: props.strength,
    result_count: props.resultCount,
  });
}

export function trackBeginnerModeToggled(props: {
  enabled: boolean;
}) {
  ph()?.capture('beginner_mode_toggled', {
    enabled: props.enabled,
  });
}
