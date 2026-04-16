/**
 * CartDrawer.tsx
 *
 * Design Reference Component — SnusFriend Cart Drawer
 * Implements: Theme A "Midnight Teal" (Dark Premium) + Theme B trust patterns
 *
 * Created: 2026-03-27
 * Design philosophy: Premium dark canvas, teal accents, clean affordances
 * Color tokens: Charcoal (#1A1A2E), Teal (#0F6E56), Strength badges (green/yellow/orange/red)
 * Typography: Plus Jakarta Sans (body), Inter Tight (pricing)
 *
 * Features:
 * - Dark charcoal (#1A1A2E) slide-out drawer from right (420px wide)
 * - Dimmed overlay behind drawer
 * - Header with item count + close button
 * - Free shipping progress bar (teal fill)
 * - Cart items with: thumbnail, brand (teal), name, strength badge, quantity stepper, pack size, line price, remove link
 * - "Frequently Bought Together" upsell section (2 mini cards)
 * - Order summary (subtotal, shipping, discount code, total)
 * - "Continue Shopping" outline + "Proceed to Checkout" solid teal CTA
 * - Trust badges (secure checkout, 30-day returns, tobacco-free)
 * - Smooth animations (CSS transitions or Framer Motion)
 * - Mobile responsive (full-width on small screens)
 *
 * Dependencies:
 * - React 18
 * - TypeScript
 * - Tailwind v4
 * - nanostores (for cart state)
 * - lucide-react (icons: X, Minus, Plus, Lock, Package, Leaf, AlertCircle)
 * - Framer Motion (optional, for slide animation)
 *
 * Not production code — a design reference showing how Theme A patterns
 * apply to the cart drawer component and checkout UX.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Minus,
  Plus,
  Lock,
  Package,
  Leaf,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

/**
 * Mock types — in production, import from @/integrations/supabase/types
 */
interface CartItem {
  id: string;
  productId: string;
  brand: string;
  name: string;
  strength: 'mild' | 'regular' | 'strong' | 'extra-strong'; // 1-4, 5-8, 9-14, 15+
  strengthLabel: string;
  nicotineLevel: number;
  flavor?: string;
  quantity: number;
  packSize: number; // pouches per can
  pricePerCan: number;
  imageUrl: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onProceedCheckout?: () => void;
  onContinueShopping?: () => void;
  upsellItems?: CartItem[];
}

// Strength color mapping
const strengthColors: Record<string, { bg: string; text: string; badge: string }> = {
  'mild': {
    bg: '#22C55E',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
  },
  'regular': {
    bg: '#EAB308',
    text: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  'strong': {
    bg: '#F97316',
    text: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-800',
  },
  'extra-strong': {
    bg: '#EF4444',
    text: 'text-red-600',
    badge: 'bg-red-100 text-red-800',
  },
};

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items = [],
  onQuantityChange,
  onRemoveItem,
  onProceedCheckout,
  onContinueShopping,
  upsellItems = [],
}) => {
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.pricePerCan * item.quantity, 0);
  }, [items]);

  const FREE_SHIPPING_THRESHOLD = 50;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const discountAmount = appliedDiscount?.amount || 0;
  const total = subtotal + shipping - discountAmount;
  const shippingNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      // Mock discount — 10% off
      setAppliedDiscount({
        code: discountCode,
        amount: subtotal * 0.1,
      });
    }
  };

  const trustBadges = [
    { icon: Lock, label: 'Secure Checkout', desc: 'Encrypted payment' },
    { icon: Package, label: '30-Day Returns', desc: 'Hassle-free guarantee' },
    { icon: Leaf, label: 'Tobacco-Free', desc: '100% nicotine pouches' },
  ];

  return (
    <>
      {/* Overlay — dims background when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer container */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: '#1A1A2E',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sm:p-6 border-b"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.08)',
            backgroundColor: '#252538',
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{
              color: '#F5F5F5',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
            }}
          >
            Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} style={{ color: '#F5F5F5' }} />
          </button>
        </div>

        {/* Main content scroll area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {items.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <Package size={40} style={{ color: '#6B6B80', marginLeft: 'auto', marginRight: 'auto' }} className="mb-4" />
              <p
                style={{
                  color: '#A0A0B8',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 400,
                }}
              >
                Your cart is empty
              </p>
            </div>
          ) : (
            <>
              {/* Free shipping progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: '#0F6E56',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {shipping === 0
                      ? '✓ Free Shipping'
                      : `Add €${shippingNeeded.toFixed(2)} more for FREE shipping!`}
                  </p>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#2D2D44' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                      backgroundColor: '#0F6E56',
                    }}
                  />
                </div>
              </div>

              {/* Cart items list */}
              <div className="space-y-6 mb-8">
                {items.map((item) => {
                  const strength = strengthColors[item.strength];
                  const linePrice = item.pricePerCan * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6 border-b"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      {/* Product thumbnail */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-800">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        {/* Brand (teal) */}
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{
                            color: '#0F6E56',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {item.brand}
                        </p>

                        {/* Name (white) */}
                        <h4
                          className="text-sm font-medium mb-2 line-clamp-2"
                          style={{
                            color: '#F5F5F5',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontWeight: 500,
                          }}
                        >
                          {item.name}
                        </h4>

                        {/* Strength badge + pack size */}
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: strength.bg,
                              color: '#FFFFFF',
                              fontFamily: 'Inter Tight, monospace',
                            }}
                          >
                            {item.strengthLabel}
                          </span>
                          <span
                            className="text-xs"
                            style={{
                              color: '#8A8A9A',
                              fontFamily: 'Plus Jakarta Sans, sans-serif',
                            }}
                          >
                            {item.packSize} pouches/can
                          </span>
                        </div>

                        {/* Line price — monospaced */}
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: '#F5F5F5',
                            fontFamily: 'Inter Tight, monospace',
                          }}
                        >
                          €{linePrice.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity stepper + Remove */}
                      <div className="flex flex-col justify-between items-end">
                        {/* Quantity stepper */}
                        <div className="flex items-center gap-2 p-1 rounded" style={{ backgroundColor: '#2D2D44' }}>
                          <button
                            onClick={() =>
                              onQuantityChange?.(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="p-1 hover:opacity-80 transition-opacity"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} style={{ color: '#A0A0B8' }} />
                          </button>
                          <span
                            className="w-6 text-center text-xs font-semibold"
                            style={{ color: '#F5F5F5' }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onQuantityChange?.(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:opacity-80 transition-opacity"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} style={{ color: '#A0A0B8' }} />
                          </button>
                        </div>

                        {/* Remove link */}
                        <button
                          onClick={() => onRemoveItem?.(item.id)}
                          className="text-xs font-medium transition-colors hover:opacity-80"
                          style={{
                            color: '#0F6E56',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Frequently Bought Together (upsell) */}
              {upsellItems.length > 0 && (
                <div className="mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <p
                    className="text-sm font-semibold mb-4"
                    style={{
                      color: '#F5F5F5',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    Frequently Bought Together
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {upsellItems.slice(0, 2).map((item) => (
                      <button
                        key={item.id}
                        className="p-3 rounded-lg border transition-colors hover:border-opacity-100"
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.12)',
                          backgroundColor: '#2D2D44',
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full aspect-square object-cover rounded mb-2"
                        />
                        <p
                          className="text-xs mb-1"
                          style={{
                            color: '#0F6E56',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.65rem',
                          }}
                        >
                          {item.brand}
                        </p>
                        <p
                          className="text-xs font-medium line-clamp-1 mb-2"
                          style={{
                            color: '#F5F5F5',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs font-semibold"
                          style={{
                            color: '#F5F5F5',
                            fontFamily: 'Inter Tight, monospace',
                          }}
                        >
                          €{item.pricePerCan.toFixed(2)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Discount code input */}
              <div className="mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <p
                  className="text-xs font-medium mb-2 uppercase"
                  style={{
                    color: '#A0A0B8',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    letterSpacing: '0.05em',
                  }}
                >
                  Discount Code
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: '#2D2D44',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#F5F5F5',
                      fontSize: '0.875rem',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 rounded text-sm font-medium transition-all"
                    style={{
                      backgroundColor: '#0F6E56',
                      color: '#FFFFFF',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div className="space-y-3 mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="flex justify-between text-sm" style={{ color: '#A0A0B8' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Subtotal</span>
                  <span style={{ fontFamily: 'Inter Tight, monospace' }}>€{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: '#A0A0B8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Shipping
                  </span>
                  <span
                    style={{
                      color: shipping === 0 ? '#0F6E56' : '#A0A0B8',
                      fontFamily: 'Inter Tight, monospace',
                      fontWeight: 500,
                    }}
                  >
                    {shipping === 0 ? 'FREE' : `€${shipping.toFixed(2)}`}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#0F6E56', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {appliedDiscount.code}
                    </span>
                    <span style={{ color: '#0F6E56', fontFamily: 'Inter Tight, monospace' }}>
                      -€{appliedDiscount.amount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div
                  className="flex justify-between text-base font-semibold pt-3"
                  style={{
                    borderTop: 'rgba(255, 255, 255, 0.08) 1px solid',
                    color: '#F5F5F5',
                  }}
                >
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Total</span>
                  <span style={{ fontFamily: 'Inter Tight, monospace' }}>€{total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer (sticky) */}
        {items.length > 0 && (
          <div
            className="border-t p-4 sm:p-6 space-y-3"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.08)',
              backgroundColor: '#252538',
            }}
          >
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mb-6 pb-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="text-center">
                    <Icon
                      size={16}
                      style={{
                        color: '#0F6E56',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginBottom: '0.5rem',
                      }}
                    />
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: '#F5F5F5',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.65rem',
                        lineHeight: '1.2',
                      }}
                    >
                      {badge.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA buttons */}
            <button
              onClick={onProceedCheckout}
              className="w-full py-3 rounded-lg font-semibold transition-all text-white"
              style={{
                backgroundColor: '#0F6E56',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 600,
              }}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full py-3 rounded-lg font-semibold border-2 transition-all"
              style={{
                borderColor: '#0F6E56',
                color: '#0F6E56',
                backgroundColor: 'transparent',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 600,
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
