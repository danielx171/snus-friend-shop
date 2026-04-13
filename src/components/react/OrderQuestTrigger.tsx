import { useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';

/**
 * Invisible component that fires the order_placed quest trigger
 * when mounted on the order confirmation page. Fires once per order
 * using sessionStorage to survive page refreshes.
 */
export default function OrderQuestTrigger({ orderId }: { orderId: string }): null {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !orderId) return;

    const storageKey = `quest_fired_${orderId}`;
    if (sessionStorage.getItem(storageKey)) return;

    fired.current = true;
    sessionStorage.setItem(storageKey, '1');

    // Fire-and-forget: trigger quest progress for order placement
    apiFetch('update-quest-progress', {
      method: 'POST',
      body: { action: 'order_placed', orderId },
    }).catch(() => {
      // Non-critical — don't block the confirmation page
      console.warn('[quest] Failed to trigger order_placed progress');
    });
  }, [orderId]);

  return null;
}
