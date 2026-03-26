import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterState, EMPTY_FILTERS } from './ProductFilters';
import { useTranslation } from '@/hooks/useTranslation';
import { FlavorKey, StrengthKey, FormatKey, CategoryKey } from '@/data/products';

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  nicotinePouches: 'Nicotine Pouches',
  nicotineFree: 'Nicotine Free',
  energyPouches: 'Energy Pouches',
};

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (category: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const { t, translateFlavor, translateStrength, translateFormat } = useTranslation();

  const allFilters: { category: keyof FilterState; value: string; label: string }[] = [];

  filters.brands.forEach((v) => allFilters.push({ category: 'brands', value: v, label: v }));
  filters.strengths.forEach((v) => allFilters.push({ category: 'strengths', value: v, label: translateStrength(v as StrengthKey) }));
  filters.flavors.forEach((v) => allFilters.push({ category: 'flavors', value: v, label: translateFlavor(v as FlavorKey) }));
  filters.formats.forEach((v) => allFilters.push({ category: 'formats', value: v, label: translateFormat(v as FormatKey) }));
  filters.categories.forEach((v) => allFilters.push({ category: 'categories', value: v, label: CATEGORY_LABELS[v as CategoryKey] ?? v }));
  if (filters.nicotineRange) allFilters.push({ category: 'nicotineRange', value: 'active', label: `${filters.nicotineRange[0]}–${filters.nicotineRange[1]} mg` });
  if (filters.priceMax !== null) allFilters.push({ category: 'priceMax', value: 'active', label: `≤ €${filters.priceMax}` });
  if (filters.hideOutOfStock) allFilters.push({ category: 'hideOutOfStock', value: 'active', label: 'In stock only' });

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
