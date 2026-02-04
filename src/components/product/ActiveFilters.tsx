import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterState } from './ProductFilters';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (category: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const allFilters: { category: keyof FilterState; value: string; label: string }[] = [];

  filters.brands.forEach((v) => allFilters.push({ category: 'brands', value: v, label: v }));
  filters.strengths.forEach((v) => allFilters.push({ category: 'strengths', value: v, label: v }));
  filters.flavors.forEach((v) => allFilters.push({ category: 'flavors', value: v, label: v }));
  filters.formats.forEach((v) => allFilters.push({ category: 'formats', value: v, label: v }));

  if (allFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Aktiva filter:</span>
      {allFilters.map((filter) => (
        <Button
          key={`${filter.category}-${filter.value}`}
          variant="secondary"
          size="sm"
          className="h-7 gap-1.5 rounded-full px-3 text-xs font-medium"
          onClick={() => onRemoveFilter(filter.category, filter.value)}
        >
          {filter.label}
          <X className="h-3 w-3" />
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-primary hover:text-primary/80"
        onClick={onClearAll}
      >
        Rensa alla
      </Button>
    </div>
  );
}
