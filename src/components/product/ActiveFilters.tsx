import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterState } from './ProductFilters';
import { useTranslation } from '@/hooks/useTranslation';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (category: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

// Map strength to translation key
const strengthTranslationKeys: Record<string, string> = {
  'Normal': 'strength.normal',
  'Stark': 'strength.strong',
  'Extra Stark': 'strength.extraStrong',
  'Ultra Stark': 'strength.ultraStrong',
};

// Map format to translation key
const formatTranslationKeys: Record<string, string> = {
  'Slim': 'format.slim',
  'Mini': 'format.mini',
  'Original': 'format.original',
  'Large': 'format.large',
};

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const { t, translateFlavor } = useTranslation();

  const allFilters: { category: keyof FilterState; value: string; label: string }[] = [];

  // Brands stay as-is (proper nouns)
  filters.brands.forEach((v) => allFilters.push({ category: 'brands', value: v, label: v }));
  
  // Translate strengths
  filters.strengths.forEach((v) => allFilters.push({ 
    category: 'strengths', 
    value: v, 
    label: t(strengthTranslationKeys[v]) 
  }));
  
  // Translate flavors
  filters.flavors.forEach((v) => allFilters.push({ 
    category: 'flavors', 
    value: v, 
    label: translateFlavor(v) 
  }));
  
  // Translate formats
  filters.formats.forEach((v) => allFilters.push({ 
    category: 'formats', 
    value: v, 
    label: t(formatTranslationKeys[v]) 
  }));

  if (allFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">{t('filter.activeFilters')}:</span>
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
        {t('filter.clearAll')}
      </Button>
    </div>
  );
}
