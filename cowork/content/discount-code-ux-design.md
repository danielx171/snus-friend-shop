# Discount Code Input — UX Design Spec

> For Claude Code to implement in `CheckoutForm.tsx` and `create-nyehandel-checkout`
> Based on competitor research (Haypp, Nicokick) + Baymard Institute best practices

---

## Research Summary

### Competitor Patterns
- **Haypp:** Discount code entry at first checkout step (before payment). Codes from newsletter signup (10% first order), referral program (10% per friend). Some codes exclude nicotine-free/trial packs.
- **Nicokick:** Visible "Promo Code" text box on checkout page. Click Apply to validate. Loyalty codes can't stack with promo codes — one code per order.
- **Both:** Single code per order, validation on Apply click, discount shown in order summary.

### Baymard Institute Findings (critical)
- **Visible promo fields cause abandonment** — users pause, then leave checkout to Google for codes. 35% of sites still show them prominently (a mistake).
- **Recommended:** Collapse behind a text link ("Have a discount code?"). Only expand on click.
- **Auto-apply when possible** — if the user qualifies for a discount (e.g., loyalty tier), apply it automatically rather than requiring a code.
- **Avoid "Apply" buttons in forms** — but for discount codes, an explicit Apply is acceptable since the code needs server validation.

---

## Recommended Design

### Placement
In the **Order Summary** section of `CheckoutForm.tsx`, below the line items and above the total — collapsed by default.

```
┌─────────────────────────────────────┐
│  Order Summary                       │
│                                      │
│  ZYN Cool Mint 6mg  x2    €7.80     │
│  VELO Berry Frost    x1    €4.20     │
│  ─────────────────────────────────── │
│                                      │
│  🏷️ Have a discount code?  ▸        │  ← collapsed link
│                                      │
│  Shipping (DHL Economy EU)   €6.90   │
│  ─────────────────────────────────── │
│  Total                      €18.90   │
└─────────────────────────────────────┘
```

### Expanded State (after clicking link)

```
┌─────────────────────────────────────┐
│  🏷️ Have a discount code?  ▾        │
│                                      │
│  ┌────────────────────┐ ┌─────────┐ │
│  │ Enter code          │ │  Apply  │ │
│  └────────────────────┘ └─────────┘ │
│                                      │
└─────────────────────────────────────┘
```

### Interaction Flow

1. **Default:** Collapsed — just a subtle text link "Have a discount code?" with a chevron
2. **Click to expand:** Reveals input field + Apply button
3. **Enter code + click Apply:**
   - Input disabled, Apply shows spinner
   - Server validates code (edge function checks `discounts` table)
4. **Success:**
   - Green checkmark replaces spinner
   - Input shows code in a "chip" style (code text + ✕ to remove)
   - Discount line appears in order summary: `Discount (WELCOME10)  −€1.89`
   - Total updates dynamically
5. **Error — invalid code:**
   - Red border on input
   - Error text below: "This code isn't valid. Check for typos and try again."
6. **Error — expired code:**
   - Error text: "This code has expired."
7. **Error — minimum not met:**
   - Error text: "This code requires a minimum order of €{{minOrder}}."
8. **Error — already used (max uses reached):**
   - Error text: "This code has already been used."
9. **Remove discount:** Click ✕ on the chip → discount line disappears, total recalculates

### Copy

| Element | Text |
|---------|------|
| Collapsed link | Have a discount code? |
| Input placeholder | Enter code |
| Apply button | Apply |
| Success chip | {{CODE}} ✕ |
| Discount summary line | Discount ({{CODE}}) |
| Invalid code error | This code isn't valid. Check for typos and try again. |
| Expired code error | This code has expired. |
| Min order error | This code requires a minimum order of {{currency}} {{minOrder}}. |
| Max uses error | This code has already been used. |
| Network error | Couldn't verify the code right now. Try again in a moment. |

### Styling (matches existing CheckoutForm)

- **Collapsed link:** `text-sm text-muted-foreground hover:text-foreground cursor-pointer` with chevron icon
- **Input:** Same styling as other checkout inputs (rounded-md, border, ring-on-focus)
- **Apply button:** Secondary button variant (not primary — the primary CTA is "Place Order")
- **Success chip:** `bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-sm`
- **Error text:** `text-sm text-destructive mt-1`
- **Discount line in summary:** Same row style as shipping, but negative amount in green

### Technical Notes

- Code validation happens client→edge function→`discounts` table
- The validated discount code + amount must be passed to `create-nyehandel-checkout`
- The edge function applies VAT-safe proportional distribution (spec in `2026-03-31-nyehandel-gaps-design.md`)
- Only ONE code per order (matches Haypp/Nicokick pattern — simpler, fewer edge cases)
- Codes are case-insensitive on the frontend (uppercase before sending)

### Auto-Apply Consideration (Phase 2)

For logged-in users with loyalty tier perks (e.g., Legend tier "Legend-only vouchers"), consider auto-applying their best available discount with a banner: "Your Legend discount has been applied!" This removes friction for loyal customers. Implement after the base discount system is stable.

---

## Sources
- Baymard Institute: coupon code fields should be hidden behind a link
- Baymard Institute: avoid visible promo fields that cause checkout abandonment
- Haypp: code entry at first checkout step, newsletter/referral codes
- Nicokick: visible promo code box with Apply button, no code stacking
- Contentsquare: 4 tips for promo code UX
- Voucherify: coupon and promotions UI/UX best practices
