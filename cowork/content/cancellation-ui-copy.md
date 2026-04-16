# Order Cancellation — UI Copy

> For Claude Code to use when building the cancellation UI (account page + ops dashboard)
> Matches SnusFriend's warm, direct tone. No corporate filler.

---

## Customer Account Page

### "Request Cancellation" Button
- **Label:** `Cancel Order`
- **Visibility:** Only for orders with status `pending` or `confirmed`
- **Style:** Ghost/outline button, muted red — not primary CTA styling

### Confirmation Dialog

**Title:** Cancel Order #{{orderId}}?

**Body:**
> Are you sure you want to cancel this order? If it hasn't been picked and packed yet, we'll cancel it right away and start your refund.
>
> **Refund timeline:** Once cancelled, your refund will be processed within 3–5 business days back to your original payment method. The exact timing depends on your bank.

**Reason field (optional):**
- Label: `Why are you cancelling? (optional)`
- Placeholder: `Changed my mind, ordered the wrong item, found a better deal…`

**Buttons:**
- Primary (destructive): `Yes, Cancel My Order`
- Secondary: `Keep My Order`

### Success State

**Title:** Order Cancelled

**Body:**
> Order #{{orderId}} has been cancelled. Your refund of {{currency}} {{amount}} is being processed and should arrive within 3–5 business days.
>
> Changed your mind? You can always [place a new order](/products).

### Error States

**Already shipped:**
> Sorry, this order has already been shipped and can't be cancelled. You can track your package on the [order details page](/account). If you'd like to return it once it arrives, please [contact us](/contact).

**Cancellation failed (NYE error):**
> Something went wrong while cancelling your order. Our team has been notified and will sort it out shortly. If you need it cancelled urgently, please [contact us](/contact).

**Already cancelled:**
> This order has already been cancelled. If you haven't received your refund within 5 business days, please [contact us](/contact).

---

## Ops Dashboard

### "Cancel Order" Button
- **Label:** `Cancel Order`
- **Style:** Destructive button (red)
- **Location:** Order detail view, top-right action area

### Ops Confirmation Dialog

**Title:** Cancel Order #{{orderId}}

**Body:**
> This will cancel the order on Nyehandel and trigger a refund to the customer.
>
> **Customer:** {{customerName}} ({{customerEmail}})
> **Items:** {{itemCount}} items — {{currency}} {{total}}

**Reason field (required for ops):**
- Label: `Cancellation reason (required — logged for audit)`
- Placeholder: `Customer request, stock issue, fraud suspected…`

**Checkbox:**
- `☐ Process refund automatically` (checked by default)

**Buttons:**
- Primary (destructive): `Confirm Cancellation`
- Secondary: `Back`

### Ops Success Toast
> Order #{{orderId}} cancelled. Refund {{refundStatus}}.

### Ops Error Toast
> Failed to cancel order #{{orderId}} on Nyehandel. The order remains active — check the ops alert for details.

---

## Order Status Badge Copy

| Status | Badge Text | Color |
|--------|-----------|-------|
| pending | Pending | Yellow/amber |
| confirmed | Confirmed | Blue |
| shipped | Shipped | Green |
| delivered | Delivered | Green (darker) |
| canceled | Cancelled | Red |
| cancellation_failed | Cancel Failed | Red (outline) |

---

## Email Notification Subject Lines

- **Customer:** `Your order #{{orderId}} has been cancelled`
- **Ops/internal:** `[SnusFriend Ops] Order #{{orderId}} cancelled — {{reason}}`
