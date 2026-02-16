import { brands, flavorKeys, strengthKeys, formatKeys, FlavorKey, StrengthKey, FormatKey } from '@/data/products';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface FilterState {
  brands: string[];
  strengths: StrengthKey[];
  flavors: FlavorKey[];
  formats: FormatKey[];
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function ProductFilters({
  filters,
  onFilterChange,
  onClose,
  isMobile = false,
}: ProductFiltersProps) {
  const { t, translateFlavor, translateStrength, translateFormat } = useTranslation();

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = filters[category] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [category]: updated });
  };

  const clearFilters = () => {
    onFilterChange({ brands: [], strengths: [], flavors: [], formats: [] });
  };

  const hasActiveFilters =
    filters.brands.length > 0 || filters.strengths.length > 0 ||
    filters.flavors.length > 0 || filters.formats.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-foreground tracking-tight">{t('filter.title')}</h2>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary text-xs">
          {t('filter.clearAll')}
        </Button>
      )}

      <Separator className="bg-border/40" />

      {/* Brand Filter */}
      <div>
        <h3 className="mb-3 font-medium text-sm text-foreground">{t('filter.brand')}</h3>
        <div className="space-y-2.5 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2.5">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleFilter('brands', brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm text-foreground cursor-pointer truncate">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* Strength Filter */}
      <div>
        <h3 className="mb-3 font-medium text-sm text-foreground">{t('filter.strength')}</h3>
        <div className="space-y-2.5">
          {strengthKeys.map((strength) => (
            <div key={strength} className="flex items-center gap-2.5">
              <Checkbox
                id={`strength-${strength}`}
                checked={filters.strengths.includes(strength)}
                onCheckedChange={() => toggleFilter('strengths', strength)}
              />
              <Label htmlFor={`strength-${strength}`} className="text-sm text-foreground cursor-pointer truncate">
                {translateStrength(strength)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* Flavor Filter */}
      <div>
        <h3 className="mb-3 font-medium text-sm text-foreground">{t('filter.flavor')}</h3>
        <div className="space-y-2.5 max-h-48 overflow-y-auto">
          {flavorKeys.map((flavor) => (
            <div key={flavor} className="flex items-center gap-2.5">
              <Checkbox
                id={`flavor-${flavor}`}
                checked={filters.flavors.includes(flavor)}
                onCheckedChange={() => toggleFilter('flavors', flavor)}
              />
              <Label htmlFor={`flavor-${flavor}`} className="text-sm text-foreground cursor-pointer truncate">
                {translateFlavor(flavor)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* Format Filter */}
      <div>
        <h3 className="mb-3 font-medium text-sm text-foreground">{t('filter.format')}</h3>
        <div className="space-y-2.5">
          {formatKeys.map((format) => (
            <div key={format} className="flex items-center gap-2.5">
              <Checkbox
                id={`format-${format}`}
                checked={filters.formats.includes(format)}
                onCheckedChange={() => toggleFilter('formats', format)}
              />
              <Label htmlFor={`format-${format}`} className="text-sm text-foreground cursor-pointer truncate">
                {translateFormat(format)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {isMobile && onClose && (
        <Button className="w-full rounded-xl" onClick={onClose}>
          {t('filter.showResults')}
        </Button>
      )}
    </div>
  );
}
