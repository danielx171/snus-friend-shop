import { useState, useMemo } from 'react';
import { useReductionGoal } from '@/hooks/useReductionGoal';
import type { CartItem } from '@/stores/cart';

interface Props {
  cartItems: CartItem[];
  userId: string | null;
}

/**
 * Shows a gentle, non-blocking alert when the user's cart average nicotine
 * strength exceeds their active reduction goal target.
 */
export default function ReductionAlert({ cartItems, userId }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const { data: goal } = useReductionGoal(userId);

  const cartAvgMg = useMemo(() => {
    if (cartItems.length === 0) return 0;

    // Only count items that have a nicotine value > 0
    const nicotineItems = cartItems.filter(
      (item) => item.product.nicotineContent > 0,
    );
    if (nicotineItems.length === 0) return 0;

    const totalMg = nicotineItems.reduce(
      (sum, item) => sum + item.product.nicotineContent * item.quantity,
      0,
    );
    const totalQty = nicotineItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return totalMg / totalQty;
  }, [cartItems]);

  // Don't render if: no goal, goal not active, dismissed, or cart avg is within target
  if (!goal || goal.status !== 'active' || dismissed) return null;
  if (cartAvgMg <= goal.target_mg) return null;

  return (
    <div
      role="status"
      className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 mb-6"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <svg
          className="h-5 w-5 shrink-0 text-amber-400 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-200">
            Heads up — your cart averages{' '}
            <span className="font-semibold">{cartAvgMg.toFixed(1)}mg</span> per
            portion. Your current reduction target is{' '}
            <span className="font-semibold">{goal.target_mg}mg</span>.
          </p>
          <a
            href="/nicotine-reduction-guide"
            className="inline-block mt-1.5 text-xs font-medium text-amber-300 hover:text-amber-100 underline underline-offset-2 transition"
          >
            Need help finding lower-strength alternatives?
          </a>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 text-amber-400 hover:text-amber-200 hover:bg-amber-500/20 transition"
          aria-label="Dismiss reduction goal alert"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
