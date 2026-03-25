import React from 'react';
import { cn } from '@/lib/utils';
import type { UserAttribute } from '@/hooks/useUserAttributes';

const PILL_COLORS: Record<string, string> = {
  flavor_preference: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  strength_preference: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  brand_preference: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  usage_frequency: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  format_preference: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
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
            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight',
            PILL_COLORS[attr.attribute_key] ?? 'bg-muted text-muted-foreground',
          )}
        >
          {attr.attribute_value}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium leading-tight text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
});

export default AttributePills;
