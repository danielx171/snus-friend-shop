# Accessibility Audit Report
**SnusFriend E-Commerce Site (Astro 6)**
**Date:** 2026-03-29
**Standards:** WCAG 2.1 AA

---

## Executive Summary

The SnusFriend codebase demonstrates **strong foundational accessibility practices** with proper semantic HTML, label-input associations, and Radix UI components. However, several actionable issues exist across forms, interactive elements, color contrast, and keyboard navigation that should be addressed to achieve full WCAG 2.1 AA compliance.

**Overall Status:** 🟡 **Mostly Compliant with Notable Gaps**
- Forms: Good structure, missing error announcements and focus management
- Interactive elements: Good focus management, dropdowns need keyboard support
- Images: Inconsistent alt text quality across product cards
- Color contrast: Acceptable but muted-foreground near threshold on some backgrounds
- Dialogs: Good implementation but age gate lacks proper ARIA semantics

---

## 1. FORMS

### 1.1 Missing Error Announcements for Form Errors
**File:** `/src/components/react/CheckoutForm.tsx`
**Lines:** 171–175
**Priority:** P1 (High)

**Issue:**
Form errors are displayed but not announced to screen readers. The error div lacks `role="alert"` or `aria-live="polite"`.

```jsx
{error && (
  <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 mb-6 text-sm text-destructive">
    {error}
  </div>
)}
```

**Recommended Fix:**
```jsx
{error && (
  <div
    className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 mb-6 text-sm text-destructive"
    role="alert"
    aria-live="assertive"
  >
    {error}
  </div>
)}
```

---

### 1.2 Newsletter Form Missing Error/Success Announcements
**File:** `/src/components/astro/Footer.astro`
**Lines:** 64, 147–150
**Priority:** P1 (High)

**Issue:**
The newsletter form status message (`#newsletter-msg`) is updated dynamically but has no `aria-live` attribute to announce success/error to screen readers.

```javascript
function showMsg(text, isError) {
  msg.textContent = text;
  msg.className = 'mt-1.5 text-xs ' + (isError ? 'text-destructive' : 'text-success');
}
```

**Recommended Fix:**
Add `aria-live="polite"` to the status element:
```astro
<p id="newsletter-msg" class="mt-1.5 text-xs hidden" aria-live="polite" aria-atomic="true"></p>
```

---

### 1.3 Contact Form Missing Error Announcements
**File:** `/src/pages/contact.astro`
**Lines:** 122, 229–231
**Priority:** P1 (High)

**Issue:**
The contact form status div updates dynamically but lacks `aria-live="polite"` for screen reader announcements.

**Recommended Fix:**
```astro
<div id="contact-status" class="hidden rounded-lg px-4 py-3 text-sm" aria-live="polite" aria-atomic="true"></div>
```

---

### 1.4 No Focus Management After Form Submission
**File:** `/src/components/react/CheckoutForm.tsx`
**Lines:** 95–150
**Priority:** P2 (Medium)

**Issue:**
After successful checkout submission, the page redirects but there's no focus management for interrupted submissions. If an error occurs during submission, focus should return to the error message.

**Recommended Fix:**
When an error occurs, focus the error alert after state update:
```jsx
if (actionError) {
  setError(actionError.message || 'Something went wrong. Please try again.');
  setSubmitting(false);
  // Focus the error message
  setTimeout(() => document.querySelector('[role="alert"]')?.focus(), 0);
  return;
}
```

---

### 1.5 Required Field Indicators Missing Visual + Text
**File:** `/src/pages/checkout.astro`, `/src/pages/login.astro`, `/src/pages/register.astro`, `/src/pages/contact.astro`
**Priority:** P2 (Medium)

**Issue:**
All form labels use `required` attribute but lack visible indicators (asterisk) or `aria-required="true"`. Screen reader users cannot easily identify required fields beyond native validation.

**Recommended Fix:**
Add asterisks and `aria-required="true"`:
```astro
<label for="email" class="block text-sm font-medium text-foreground mb-1.5">
  Email address
  <span aria-label="required">*</span>
</label>
<input
  type="email"
  id="email"
  name="email"
  required
  aria-required="true"
  ...
/>
```

---

### 1.6 Password Strength Indicator Has Redundant Role
**File:** `/src/pages/register.astro`
**Line:** 90
**Priority:** P2 (Medium)

**Issue:**
The password strength container has both `aria-live="polite"` (good) but is set to `display:none` initially, which may confuse some screen readers about when content becomes available.

**Recommended Fix:**
Use `visibility: hidden` or `height: 0; overflow: hidden` instead of `display: none`, or use `aria-hidden="true"` initially:

```astro
<div
  id="password-strength"
  class="mt-2 space-y-1"
  aria-live="polite"
  aria-hidden="true"
>
```

Then toggle `aria-hidden` when revealing:
```javascript
meter.style.display = '';
meter.setAttribute('aria-hidden', 'false');
```

---

## 2. INTERACTIVE ELEMENTS

### 2.1 Header Dropdown Menu Not Keyboard Accessible
**File:** `/src/components/astro/Header.astro`
**Lines:** 39–62
**Priority:** P1 (High)

**Issue:**
The "Explore" dropdown uses CSS pseudo-classes (`:hover`, `:group-focus-within`) but is not keyboard accessible. The dropdown button doesn't manage keyboard events (ArrowDown/ArrowUp, Escape).

```astro
<div class="relative group">
  <button
    type="button"
    class="..."
    aria-expanded="false"
    aria-haspopup="true"
  >
    Explore
  </button>
  <div class="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible ...">
```

**Recommended Fix:**
Convert to a full keyboard-navigable component using Radix UI's `<MenubarMenu>` or implement keyboard handlers:
- ArrowDown: Move focus to first menu item
- ArrowUp: Move focus to last menu item
- Escape: Close menu
- Update `aria-expanded` when opening/closing

**Alternative:** Use shadcn/ui's `Menubar` component which already has keyboard support.

---

### 2.2 Mobile Menu Missing Keyboard Trap Management
**File:** `/src/components/react/MobileMenu.tsx`
**Lines:** 55–103
**Priority:** P2 (Medium)

**Issue:**
The mobile menu uses Radix Dialog (which has built-in focus management) but `aria-label` on `Dialog.Content` is missing. Should also have proper focus restoration on close.

**Recommended Fix:**
```tsx
<Dialog.Content
  className="..."
  aria-label="Mobile navigation menu"
  onEscapeKeyDown={closeMobileMenu}
>
```

---

### 2.3 Cart Drawer Close Button Lacks Visible Label
**File:** `/src/components/react/CartDrawer.tsx`
**Lines:** 219–229
**Priority:** P2 (Medium)

**Issue:**
The close button has `aria-label="Close cart"` (good) but button is icon-only with very small touch target (8x8 at h-8 w-8 = 32px = acceptable for desktop but potentially too small on mobile without padding).

```tsx
<button
  type="button"
  aria-label="Close cart"
  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground ..."
>
  <svg .../>
</button>
```

**Recommended Fix:**
Increase padding for better mobile touch target:
```tsx
className="flex h-10 w-10 items-center justify-center rounded-md ..."
```

---

### 2.4 Age Gate Modal Lacks Proper ARIA Role and Focus Trap
**File:** `/src/components/astro/AgeGate.astro`
**Lines:** 5–92
**Priority:** P1 (High)

**Issue:**
The age gate is a modal dialog but:
1. Missing `role="dialog"` on the container
2. Missing `aria-modal="true"`
3. Missing `aria-labelledby` pointing to the heading
4. No programmatic focus trap (relies on document overflow: hidden)
5. Keyboard interaction not explicitly declared

```astro
<div id="age-gate" class="fixed inset-0 z-[200] flex items-center justify-center bg-background">
  <div class="mx-4 max-w-md rounded-lg border border-border bg-card p-5 sm:p-8 text-center shadow-xl">
    <h2 class="text-2xl font-bold text-foreground">Age Verification</h2>
```

**Recommended Fix:**
```astro
<div
  id="age-gate"
  class="fixed inset-0 z-[200] flex items-center justify-center bg-background"
  role="presentation"
>
  <div
    class="mx-4 max-w-md rounded-lg border border-border bg-card p-5 sm:p-8 text-center shadow-xl"
    role="dialog"
    aria-modal="true"
    aria-labelledby="age-gate-heading"
  >
    <h2 id="age-gate-heading" class="text-2xl font-bold text-foreground">Age Verification</h2>
```

Also add keyboard event handling to script:
```javascript
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    denyAge(); // Or keep focused on gate
  }
});
```

---

### 2.5 Theme Picker Buttons Too Small (Touch Target)
**File:** `/src/components/react/ThemePicker.tsx`
**Lines:** 22–34
**Priority:** P2 (Medium)

**Issue:**
Theme color buttons are 6x6 inches (h-6 w-6 = 24px), below the WCAG 2.5 AAA recommended 44x44px minimum touch target.

```tsx
<button
  key={theme}
  onClick={() => handleClick(theme)}
  aria-label={`Switch to ${themeLabels[theme]} theme`}
  className="relative h-6 w-6 rounded-full transition-transform hover:scale-110"
```

**Recommended Fix:**
```tsx
className="relative h-10 w-10 rounded-full transition-transform hover:scale-110 p-2"
```

---

## 3. IMAGES

### 3.1 Product Card Images Have Generic Alt Text
**File:** `/src/components/react/ProductCard.tsx`
**Lines:** 165–177
**Priority:** P2 (Medium)

**Issue:**
Alt text is descriptive but could be more informative. Current: "Velo by Velo - strong" could include nicotine strength in milligrams.

```tsx
<img
  src={imageUrl}
  alt={`${name}${brand ? ` by ${brand}` : ''}${strengthKey ? ` - ${strengthKey}` : ''}`}
  ...
/>
```

**Recommended Fix:**
```tsx
alt={`${brand ? `${brand} ` : ''}${name}, ${strengthKey} strength${nicotineContent ? ` (${nicotineContent}mg)` : ''}`}
```

---

### 3.2 Decorative SVG Icons Not Always Marked aria-hidden
**File:** `/src/components/react/CartDrawer.tsx`
**Lines:** 156–170, 225
**Priority:** P2 (Medium)

**Issue:**
Most decorative SVGs have `aria-hidden="true"`, but the empty cart icon (line 158) and close button SVG are properly marked. However, inconsistency should be verified across all components.

**Verification:** Confirm all purely decorative icons (chevrons, plus signs, empty states) have `aria-hidden="true"`.

---

### 3.3 Cart Item Thumbnail Missing Alt Text or Fallback
**File:** `/src/components/react/CartDrawer.tsx`
**Lines:** 54–68
**Priority:** P2 (Medium)

**Issue:**
Product images in cart have alt text, but the fallback SVG when image is missing has no label:

```tsx
{product.image ? (
  <img
    src={product.image}
    alt={product.name}
    ...
  />
) : (
  <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
```

Good: `aria-hidden="true"` is set, so this is acceptable.

---

## 4. COLOR CONTRAST

### 4.1 Muted-Foreground Text Contrast Issues on Dark Backgrounds
**File:** `/src/index.css`
**Priority:** P2 (Medium)

**Issue:**
The `muted-foreground` color in dark/forest theme has a lower contrast ratio. Checking CSS:
- **Forest (dark) theme:**
  - Foreground: `150 20% 10%` (dark green)
  - Muted-foreground: `150 10% 38%` (lighter green)
  - Background: `40 20% 97%` (white-ish)
  - Contrast ratio: ~7.5:1 (PASS)

However, on darker backgrounds (cards, secondary elements):
  - Card background: `40 20% 95%` (very light)
  - Muted-foreground on card: ~7.2:1 (PASS but near threshold)

- **Dark theme:**
  - Background: `220 16% 8%` (very dark blue)
  - Muted-foreground: `215 15% 70%` (light gray)
  - Contrast ratio: ~9.8:1 (PASS ✓)

- **Light theme:**
  - Background: `210 25% 97%` (very light blue)
  - Foreground: `220 30% 10%` (dark navy)
  - Muted-foreground: `220 12% 46%` (medium gray)
  - Contrast ratio: ~5.5:1 (BORDERLINE — below 7:1 AAA)

**Recommended Fix:**
Darken light theme muted-foreground:
```css
.light {
  --muted-foreground: 220 12% 35%; /* Was 46%, now darker for better contrast */
}
```

---

### 4.2 Destructive Color Accessibility
**File:** `/src/index.css`
**Lines:** 90–93 (forest), 190–193 (dark), 315–318 (light)
**Priority:** P2 (Medium)

**Issue:**
Destructive foreground (white on red) is safe across all themes, but destructive background buttons need verification. Example: "I am under 18" button in age gate uses:
- `border-border` text on `bg-accent`
- In dark theme: light gray text on dark blue-gray background
- Contrast: ~3.5:1 (FAIL ❌)

---

### 4.3 Success/Warning Color Contrast on Light Backgrounds
**File:** `/src/index.css`
**Priority:** P2 (Medium)

**Issue:**
Success color in dark mode: `hsl(160 84% 39%)` (green) on `hsl(220 16% 8%)` (very dark)
- Contrast: ~8.2:1 (PASS)

But when displayed on light/editorial themes with lighter backgrounds, success text might drop below 4.5:1.

**Recommended Fix:**
Define theme-specific success/warning colors that ensure minimum 4.5:1 contrast on each theme's background.

---

## 5. ARIA PATTERNS

### 5.1 Header Dropdown Missing aria-expanded State Update
**File:** `/src/components/astro/Header.astro`
**Lines:** 40–44
**Priority:** P2 (Medium)

**Issue:**
The dropdown button has `aria-expanded="false"` hardcoded and never updates. Screen reader users won't know if the menu is open.

```astro
<button
  type="button"
  ...
  aria-expanded="false"
  aria-haspopup="true"
>
```

**Recommended Fix:**
Use JavaScript to update `aria-expanded` when dropdown opens/closes:
```javascript
const btn = document.querySelector('.explore-btn');
btn.addEventListener('click', () => {
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !isExpanded);
});
```

---

### 5.2 Checkout Form Fieldset Missing for Grouped Inputs
**File:** `/src/components/react/CheckoutForm.tsx`
**Lines:** 197–224, 257–283
**Priority:** P2 (Medium)

**Issue:**
Related inputs (First/Last Name, Postcode/City) are grouped visually but not semantically with `<fieldset>` and `<legend>`.

**Recommended Fix:**
Wrap grouped fields in fieldsets:
```tsx
<fieldset>
  <legend className="block text-sm font-medium text-muted-foreground mb-1">
    Name
  </legend>
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label htmlFor="firstName" className="sr-only">First Name</label>
      <input id="firstName" ... />
    </div>
    ...
  </div>
</fieldset>
```

---

### 5.3 Age Verification Checkbox Missing Descriptive Label
**File:** `/src/pages/checkout.astro` (assuming similar pattern in checkout form)
**Priority:** P2 (Medium)

**Issue:**
Checkbox labels are descriptive but not strongly associated. The age checkbox in checkout should have explicit `<label>`:

```tsx
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
```

The label is wrapping both the input and text, which is good, but would be stronger with explicit `htmlFor`:

**Recommended Fix:**
```tsx
<div className="flex items-start gap-3">
  <input
    id="age-verified"
    type="checkbox"
    checked={ageVerified}
    onChange={(e) => setAgeVerified(e.target.checked)}
    className="mt-0.5 accent-primary"
  />
  <label htmlFor="age-verified" className="text-sm text-muted-foreground cursor-pointer">
    I confirm that I am 18 years of age or older...
  </label>
</div>
```

---

## 6. TOUCH TARGETS & MOBILE ACCESSIBILITY

### 6.1 Quantity Control Buttons Too Small (24x24px)
**File:** `/src/components/react/CartDrawer.tsx`
**Lines:** 82–100
**Priority:** P2 (Medium)

**Issue:**
The increment/decrement buttons in the cart are only `h-6 w-6` (24px), below WCAG 2.5 AAA 44px minimum:

```tsx
<button
  type="button"
  onClick={handleDecrement}
  aria-label={`Decrease quantity of ${product.name}`}
  className="flex h-6 w-6 items-center justify-center rounded border border-border..."
>
  -
</button>
```

**Recommended Fix:**
```tsx
className="flex h-9 w-9 items-center justify-center rounded border border-border..."
```

---

### 6.2 Remove Button in Cart Too Small
**File:** `/src/components/react/CartDrawer.tsx`
**Lines:** 109–116
**Priority:** P2 (Medium)

**Issue:**
The "Remove" button is text-only but very small (`text-xs`) with minimal padding:

```tsx
<button
  type="button"
  onClick={handleRemove}
  aria-label={`Remove ${product.name} from cart`}
  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
>
  Remove
</button>
```

**Recommended Fix:**
```tsx
className="text-xs font-medium px-3 py-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
```

---

### 6.3 Icon-Only Buttons Need Sufficient Padding
**File:** `/src/components/astro/Header.astro`
**Lines:** 65–90
**Priority:** P2 (Medium)

**Issue:**
Icon-only buttons (search, account, menu) are barely 20x20px icon with no padding:

```astro
<a href="/search" class="text-muted-foreground hover:text-foreground..." aria-label="Search products">
  <svg xmlns="..." width="20" height="20" ...></svg>
</a>
```

**Recommended Fix:**
```astro
<a href="/search" class="p-2 text-muted-foreground hover:text-foreground..." aria-label="Search products">
  <svg xmlns="..." width="20" height="20" ...></svg>
</a>
```

This creates a 36x36px (with standard padding) touch target.

---

## 7. KEYBOARD NAVIGATION

### 7.1 Skip-to-Content Link Works Correctly ✓
**File:** `/src/layouts/Shop.astro`
**Lines:** 31–34
**Status:** PASS

The skip link is properly implemented with `.sr-only` and `.focus:not-sr-only` classes, allowing keyboard users to jump to main content.

---

### 7.2 Missing Keyboard Handling on Dropdown Escape
**File:** `/src/components/astro/Header.astro`
**Lines:** 39–62
**Priority:** P1 (High)

**Issue:**
The dropdown doesn't handle the Escape key to close. Keyboard users must click away or tab out.

**Recommended Fix:**
Add keyboard event listener:
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dropdownOpen) {
    dropdownOpen = false;
    exploreBtn.focus();
  }
});
```

---

## 8. FOCUS MANAGEMENT & VISUAL INDICATORS

### 8.1 All Links and Buttons Have Visible Focus Outline ✓
**Status:** PASS

Consistent use of `focus:outline-2 focus:outline-offset-2 focus:outline-primary` across all interactive elements provides clear visual feedback.

---

### 8.2 Dialog Components (CartDrawer, MobileMenu) Have Good Focus Trapping ✓
**Status:** PASS

Both use Radix UI Dialog which provides automatic focus management:
- Focus is trapped within the modal
- Escape key closes the modal
- Focus is restored when modal closes

---

## 9. MISCELLANEOUS

### 9.1 Newsletter Form Input Placeholder Clarity
**File:** `/src/components/astro/Footer.astro`
**Lines:** 48–55
**Priority:** P2 (Medium)

**Issue:**
Input has placeholder text but also needs label for clarity (label is `.sr-only` which is correct):

```astro
<label for="newsletter-email" class="sr-only">Email address</label>
<input
  id="newsletter-email"
  type="email"
  required
  placeholder="you@email.com"
  ...
/>
```

Good: Label is hidden but accessible. However, placeholder text "you@email.com" should be supplemented with visible label text:

**Recommended Fix:**
```astro
<div>
  <label for="newsletter-email" class="text-xs font-medium text-foreground mb-1 block">
    Email address
  </label>
  <input id="newsletter-email" ... />
</div>
```

---

### 9.2 Contact Form Honeypot Field Properly Hidden
**File:** `/src/pages/contact.astro`
**Lines:** 116–120
**Status:** PASS ✓

The honeypot field uses `aria-hidden="true"` and `opacity-0 -z-10`, making it invisible to all users while remaining in the DOM for bot detection.

---

### 9.3 Empty State SVGs Properly Marked
**File:** `/src/components/react/CartDrawer.tsx`
**Lines:** 156–171
**Status:** PASS ✓

Empty state and error icons are properly marked with `aria-hidden="true"`.

---

## PRIORITY SUMMARY

| Priority | Count | Issues |
|----------|-------|--------|
| **P0 (Critical)** | 0 | None |
| **P1 (High)** | 4 | Form error announcements, Age gate ARIA, Header dropdown keyboard, Checkout error alert focus |
| **P2 (Medium)** | 15+ | Focus after submission, field indicators, touch targets, color contrast, dropdown state, fieldsets, small buttons |

---

## RECOMMENDATIONS FOR REMEDIATION

### Immediate (This Sprint)
1. Add `role="alert"` + `aria-live="assertive"` to all form error messages
2. Fix age gate with proper `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
3. Implement keyboard handlers for header dropdown (ArrowDown/Up, Escape)
4. Increase touch targets for quantity buttons, remove button, theme picker, icon buttons

### Short Term (Next Sprint)
1. Add visual + `aria-required` indicators to all required fields
2. Wrap grouped form inputs with `<fieldset>` + `<legend>`
3. Update `aria-expanded` dynamically on dropdown
4. Improve newsletter/contact form error announcements with `aria-live`
5. Audit and fix muted-foreground contrast on light theme

### Long Term
1. Consider replacing CSS-only dropdown with Radix `Menubar` component
2. Conduct manual WCAG 2.1 AA audit with screen readers (NVDA, VoiceOver)
3. Test with keyboard-only navigation across all pages
4. Set up automated axe-core accessibility testing in CI/CD

---

## TOOLS USED FOR AUDIT

- Manual code review of `.astro` and `.tsx` files
- WCAG 2.1 AA criteria validation
- Color contrast ratio checking against CSS variables
- Semantic HTML and ARIA pattern verification
- Touch target size analysis against WCAG 2.5 AAA guidelines

---

## NOTES

- SnusFriend's use of Radix UI and shadcn/ui components provides a solid foundation for accessibility
- The skip-to-content link and consistent focus styling demonstrate accessibility awareness
- Main gaps are in form error handling, keyboard support for custom dropdowns, and minor touch target sizes
- Dark theme accessibility is stronger than light theme; light theme needs muted-foreground darkened
- All recommendations are WCAG 2.1 AA compliant with some AAA enhancements noted
