import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterState } from './ProductFilters';
import { useTranslation } from '@/hooks/useTranslation';
import { FlavorKey, StrengthKey, FormatKey } from '@/data/products';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (category: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const { t, translateFlavor, translateStrength, translateFormat } = useTranslation();

  const allFilters: { category: keyof FilterState; value: string; label: string }[] = [];

  // Brands stay as-is (proper nouns)
  filters.brands.forEach((v) => allFilters.push({ category: 'brands', value: v, label: v }));
  
  // Translate strengths
  filters.strengths.forEach((v) => allFilters.push({ 
    category: 'strengths', 
    value: v, 
    label: translateStrength(v as StrengthKey) 
  }));
  
  // Translate flavors
  filters.flavors.forEach((v) => allFilters.push({ 
    category: 'flavors', 
    value: v, 
    label: translateFlavor(v as FlavorKey) 
  }));
  
  // Translate formats
  filters.formats.forEach((v) => allFilters.push({ 
    category: 'formats', 
    value: v, 
    label: translateFormat(v as FormatKey) 
  }));

  if (allFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground shrink-0">{t('filter.activeFilters')}:</span>
      {allFilters.map((filter) => (
        <Button
          key={`${filter.category}-${filter.value}`}
          variant="secondary"
          size="sm"
          className="h-7 gap-1.5 rounded-full px-3 text-xs font-medium"
          onClick={() => onRemoveFilter(filter.category, filter.value)}
        >
          <span className="truncate max-w-[120px]">{filter.label}</span>
          <X className="h-3 w-3 shrink-0" />
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-primary hover:text-primary/80 shrink-0"
        onClick={onClearAll}
      >
        {t('filter.clearAll')}
      </Button>
    </div>
  );
}
