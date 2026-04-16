# Cancellation Confirmation Page — Design & Copy

> Shown after a customer successfully cancels an order from their account page.
> For Claude Code: this can be a dynamic section within the account/order-detail page,
> or a standalone `/account/order-cancelled` route. Either works.

---

## Layout

```
┌──────────────────────────────────────────────┐
│                                              │
│         ✓  (green checkmark icon)            │
│                                              │
│     Your order has been cancelled            │
│                                              │
│  Order #NB12345 has been cancelled and your  │
│  refund of EUR 18.90 is on its way. It       │
│  typically takes 3–5 business days to show   │
│  up on your original payment method.         │
│                                              │
│  We've sent a confirmation to                │
│  daniel@example.com with the details.        │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  Refund summary                      │    │
│  │                                      │    │
│  │  ZYN Cool Mint 6mg × 2    €7.80     │    │
│  │  VELO Berry Frost × 1     €4.20     │    │
│  │  Shipping (DHL Economy)   €6.90     │    │
│  │  ───────────────────────────────     │    │
│  │  Total refund             €18.90    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  [ Browse Products ]   [ Contact Support ]   │
│       (primary)            (secondary)       │
│                                              │
│  Changed your mind? You can place a new      │
│  order anytime — your cart items are still    │
│  saved.                                      │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Copy — All Elements

### Icon
Green circle checkmark (Lucide `CheckCircle2` or `CircleCheck`), `text-green-600`, `w-16 h-16`, centered.

### Headline
**Your order has been cancelled**

Style: `text-2xl font-bold text-foreground`, centered.

### Body Paragraph
> Order #{{orderId}} has been cancelled and your refund of {{currency}} {{total}} is on its way. It typically takes 3–5 business days to show up on your original payment method.

> We've sent a confirmation to {{customerEmail}} with the details.

Style: `text-muted-foreground text-base leading-relaxed`, centered, max-w-md.

### Refund Summary Card
Bordered card with the line items from the cancelled order, same layout as the order confirmation page. Shows each item + quantity + price, shipping cost, and total refund amount.

Style: `bg-card border rounded-lg p-6`, left-aligned within the card.

### Primary CTA
**Browse Products** → links to `/products`

Style: Standard primary button (`bg-primary text-primary-foreground`).

### Secondary CTA
**Contact Support** → links to `/contact`

Style: Ghost/outline button (`variant="outline"`).

### Reassurance Text
> Changed your mind? You can place a new order anytime — your cart items are still saved.

Style: `text-sm text-muted-foreground`, centered, below buttons.

---

## States

### Default (successful cancellation)
As described above.

### Cancellation pending (NYE processing delay)
If the cancellation hasn't been confirmed by NYE yet (rare, but possible):

**Headline:** Your cancellation is being processed

**Body:**
> We've received your request to cancel order #{{orderId}}. It's being processed now and you'll receive a confirmation email at {{customerEmail}} shortly. This usually takes just a few minutes.

**CTA:** `Back to My Orders` (primary) + `Contact Support` (secondary)

### Error (cancellation failed)
If the NYE API call failed:

**Headline:** Something went wrong

**Body:**
> We couldn't cancel order #{{orderId}} right now. Our team has been notified and will follow up within 24 hours. If you need it sorted urgently, please contact us.

**CTA:** `Contact Support` (primary) + `Back to My Orders` (secondary)

---

## Accessibility Notes
- Checkmark icon: `role="img" aria-label="Success"`
- Ensure refund summary table has proper `th` / `td` semantics
- Both CTA buttons must be keyboard-navigable
- Use `aria-live="polite"` on the status area if the page updates dynamically
