import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';

/* ── Types ── */

export interface UpsellItem {
  sku: string;
  display_name: string;
  price: number;
}

interface CheckoutUpsellProps {
  onUpsellChange: (items: UpsellItem[]) => void;
}

const MAX_SELECTIONS = 3;

/* ── Component ── */

const CheckoutUpsell = React.memo(function CheckoutUpsell({
  onUpsellChange,
}: CheckoutUpsellProps) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const { data: upsells, isLoading, isError } = useQuery({
    queryKey: ['checkout-upsells'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_upsells')
        .select('id, sku, display_name, price_override, sort_order')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .limit(6);

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleToggle = useCallback(
    (item: { sku: string; display_name: string; price_override: number }) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(item.sku)) {
          next.delete(item.sku);
        } else {
          if (next.size >= MAX_SELECTIONS) return prev;
          next.add(item.sku);
        }

        // Notify parent — derive items from next set and current upsells
        const selectedItems: UpsellItem[] = (upsells ?? [])
          .filter((u) => next.has(u.sku))
          .map((u) => ({
            sku: u.sku,
            display_name: u.display_name,
            price: u.price_override,
          }));
        onUpsellChange(selectedItems);

        return next;
      });
    },
    [upsells, onUpsellChange],
  );

  if (isLoading || isError || !upsells || upsells.length === 0) return null;

  const cappedCount = Math.min(upsells.length, MAX_SELECTIONS);
  const totalSavings = (cappedCount * 0.99).toFixed(2);

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-base font-semibold text-foreground">
            Add to your order &mdash; save up to &euro;{totalSavings}
          </h2>
        </div>

        {selected.size === MAX_SELECTIONS && (
          <p className="text-xs text-muted-foreground mb-3">
            Maximum {MAX_SELECTIONS} add-ons selected.
          </p>
        )}

        {/* 2-col grid on mobile, 3-col on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {upsells.map((item) => {
            const isSelected = selected.has(item.sku);
            const isDisabled = !isSelected && selected.size >= MAX_SELECTIONS;

            return (
              <button
                key={item.sku}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${isSelected ? 'Remove' : 'Add'} ${item.display_name} for €${item.price_override.toFixed(2)}`}
                disabled={isDisabled}
                onClick={() => handleToggle(item)}
                className={[
                  'relative rounded-xl border-2 p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background hover:border-primary/50',
                  isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
              >
                {/* Selected indicator dot */}
                {isSelected && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                )}

                <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 pr-3">
                  {item.display_name}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  &euro;{item.price_override.toFixed(2)}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

export default CheckoutUpsell;
