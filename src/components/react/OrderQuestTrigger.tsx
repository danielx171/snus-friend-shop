import { useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';

/**
 * Invisible component that fires the order_placed quest trigger
 * when mounted on the order confirmation page. Fires once per order.
 */
export default function OrderQuestTrigger({ orderId }: { orderId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !orderId) return;
    fired.current = true;

    // Fire-and-forget: trigger quest progress for order placement
    apiFetch('update-quest-progress', {
      method: 'POST',
      body: { action: 'order_placed' },
    }).catch(() => {
      // Non-critical — don't block the confirmation page
      console.warn('[quest] Failed to trigger order_placed progress');
    });
  }, [orderId]);

  return null;
}
