import React from 'react';
import { cn } from '@/lib/utils';
import type { UserAttribute } from '@/hooks/useUserAttributes';

const PILL_COLORS: Record<string, string> = {
  flavor_preference: 'bg-[hsl(var(--color-success)/0.15)] text-[hsl(var(--color-success))]',
  strength_preference: 'bg-[hsl(var(--color-warning)/0.15)] text-[hsl(var(--color-warning))]',
  brand_preference: 'bg-[hsl(var(--color-info)/0.15)] text-[hsl(var(--color-info))]',
  usage_frequency: 'bg-[hsl(var(--color-rarity-epic)/0.15)] text-[hsl(var(--color-rarity-epic))]',
  format_preference: 'bg-[hsl(var(--color-tier-diamond)/0.15)] text-[hsl(var(--color-tier-diamond))]',
};

interface AttributePillsProps {
  attributes: UserAttribute[];
  maxVisible?: number;
  className?: string;
}

const AttributePills = React.memo(function AttributePills({
  attributes,
  maxVisible = 4,
  className,
}: AttributePillsProps) {
  if (attributes.length === 0) return null;

  const visible = attributes.slice(0, maxVisible);
  const remaining = attributes.length - maxVisible;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {visible.map((attr) => (
        <span
          key={`${attr.attribute_key}-${attr.attribute_value}`}
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium leading-tight',
            PILL_COLORS[attr.attribute_key] ?? 'bg-muted text-muted-foreground',
          )}
        >
          {attr.attribute_value}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium leading-tight text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
});

export default AttributePills;
