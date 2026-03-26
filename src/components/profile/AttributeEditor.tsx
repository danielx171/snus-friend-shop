import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAttributeCategories, useUserAttributes } from '@/hooks/useUserAttributes';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface AttributeEditorProps {
  userId: string;
}

export function AttributeEditor({ userId }: AttributeEditorProps) {
  const { data: categories, isLoading: loadingCats } = useAttributeCategories();
  const { attributes, isLoading: loadingAttrs, updateCategory } = useUserAttributes(userId);
  const { toast } = useToast();

  const getSelectedValues = useCallback(
    (categoryKey: string) =>
      attributes
        .filter((a) => a.attribute_key === categoryKey)
        .map((a) => a.attribute_value),
    [attributes],
  );

  const handleToggle = useCallback(
    async (categoryKey: string, value: string) => {
      const current = attributes
        .filter((a) => a.attribute_key === categoryKey)
        .map((a) => a.attribute_value);

      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      try {
        await updateCategory(categoryKey, next);
      } catch {
        toast({
          title: 'Failed to update',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    },
    [attributes, updateCategory, toast],
  );

  if (loadingCats || loadingAttrs) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-7 w-16 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Select your preferences. These appear as badges on your reviews and profile.
      </p>
      {(categories ?? []).map((cat) => {
        const selected = getSelectedValues(cat.key);
        return (
          <div key={cat.key} className="space-y-2">
            <p className="text-sm font-medium text-foreground">{cat.label}</p>
            <div className="flex flex-wrap gap-2">
              {cat.options.map((opt) => {
                const isSelected = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggle(cat.key, opt)}
                    aria-pressed={isSelected}
                    aria-label={`${opt} (${cat.label})`}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
