# FAQ Entries — Cancellation, Discounts, Out of Stock

> For the FAQ page (`src/pages/faq.astro`). Matches existing Q&A format.
> Also add to FAQPage JSON-LD structured data for rich snippets.

---

## How do I cancel my order?

You can cancel your order from your [account page](/account) as long as it hasn't been shipped yet. Open the order you'd like to cancel and click "Cancel Order." You'll see a confirmation dialog — once you confirm, the cancellation is processed immediately.

If your order has already been shipped, it can't be cancelled. In that case, you can return it once it arrives — just [contact us](/contact) and we'll walk you through the process.

---

## How long does a refund take after cancellation?

Once your order is cancelled, your refund is processed automatically. It typically takes 3–5 business days for the money to appear back on your original payment method. The exact timing depends on your bank or card issuer — some are faster than others.

You'll receive an email confirming the cancellation and the refund amount.

---

## How do I use a discount code?

During checkout, look for the "Have a discount code?" link in the order summary section. Click it to reveal the input field, enter your code, and press Apply. If the code is valid, you'll see the discount reflected in your order total straight away.

A few things to keep in mind: only one discount code can be used per order, codes are not case-sensitive, and some codes have a minimum order value or an expiry date. If a code isn't working, double-check it for typos or check whether it's still within its valid period.

---

## Where can I find discount codes?

We share discount codes through our newsletter, social media, and occasional promotions on the site. The best way to stay in the loop is to [sign up for our newsletter](/newsletter) — subscribers hear about deals first.

If you're a returning customer, keep an eye on your email after purchases too — we sometimes send exclusive offers to loyal shoppers.

---

## Why is a product showing as out of stock?

Our stock levels are synced regularly with our fulfilment warehouse. When a product shows as out of stock, it means the warehouse currently doesn't have it available for shipping. This can happen when a popular product sells faster than expected or when a brand is between production runs.

Out-of-stock products can't be added to your cart. If you'd like to know when a product is back, you can join the waitlist on the product page (where available) and we'll email you as soon as it's restocked.

---

## Can I be notified when an out-of-stock product is back?

Yes — on product pages that are currently out of stock, you'll see a "Notify Me" option. Enter your email address and we'll send you a one-time notification when the product is available again. We won't spam you — it's a single email per restock.

---

## What happens if an item in my cart goes out of stock before I check out?

If stock runs out between the time you add an item and the time you place your order, our checkout will let you know which item(s) are no longer available. You'll be able to remove them and continue with the rest of your order, or wait for the item to come back in stock.

We do our best to keep stock levels accurate, but popular products can move fast — especially new releases and limited editions.

---

## JSON-LD additions for faq.astro

```json
{
  "@type": "Question",
  "name": "How do I cancel my order?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "You can cancel your order from your account page as long as it hasn't been shipped yet. Open the order and click Cancel Order. If your order has already been shipped, contact us to arrange a return once it arrives."
  }
},
{
  "@type": "Question",
  "name": "How long does a refund take after cancellation?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Refunds are processed automatically after cancellation and typically take 3-5 business days to appear on your original payment method."
  }
},
{
  "@type": "Question",
  "name": "How do I use a discount code?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "During checkout, click 'Have a discount code?' in the order summary, enter your code, and press Apply. Only one code can be used per order."
  }
},
{
  "@type": "Question",
  "name": "Why is a product showing as out of stock?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Stock levels are synced regularly with our fulfilment warehouse. When a product is out of stock, it means the warehouse currently doesn't have it available. You can join the waitlist on the product page to be notified when it's back."
  }
}
```
