import { brands, flavors, strengths, formats } from '@/data/products';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterState {
  brands: string[];
  strengths: string[];
  flavors: string[];
  formats: string[];
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
  const toggleFilter = (
    category: keyof FilterState,
    value: string
  ) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [category]: updated });
  };

  const clearFilters = () => {
    onFilterChange({ brands: [], strengths: [], flavors: [], formats: [] });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.strengths.length > 0 ||
    filters.flavors.length > 0 ||
    filters.formats.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-foreground">Filter</h2>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
          Rensa alla filter
        </Button>
      )}

      <Separator />

      {/* Brand Filter */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Varumärke</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleFilter('brands', brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Strength Filter */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Styrka</h3>
        <div className="space-y-2">
          {strengths.map((strength) => (
            <div key={strength} className="flex items-center gap-2">
              <Checkbox
                id={`strength-${strength}`}
                checked={filters.strengths.includes(strength)}
                onCheckedChange={() => toggleFilter('strengths', strength)}
              />
              <Label
                htmlFor={`strength-${strength}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {strength}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Flavor Filter */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Smak</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {flavors.map((flavor) => (
            <div key={flavor} className="flex items-center gap-2">
              <Checkbox
                id={`flavor-${flavor}`}
                checked={filters.flavors.includes(flavor)}
                onCheckedChange={() => toggleFilter('flavors', flavor)}
              />
              <Label
                htmlFor={`flavor-${flavor}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {flavor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Format Filter */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">Format</h3>
        <div className="space-y-2">
          {formats.map((format) => (
            <div key={format} className="flex items-center gap-2">
              <Checkbox
                id={`format-${format}`}
                checked={filters.formats.includes(format)}
                onCheckedChange={() => toggleFilter('formats', format)}
              />
              <Label
                htmlFor={`format-${format}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {format}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && onClose && (
        <Button className="w-full" onClick={onClose}>
          Visa resultat
        </Button>
      )}
    </div>
  );
}
