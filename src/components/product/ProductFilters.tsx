import React, { useState, useMemo, useCallback } from 'react';
import { flavorKeys, strengthKeys, formatKeys, FlavorKey, StrengthKey, FormatKey, CategoryKey } from '@/data/products';
import { useBrands } from '@/hooks/useBrands';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface FilterState {
  brands: string[];
  strengths: StrengthKey[];
  flavors: FlavorKey[];
  formats: FormatKey[];
  categories: CategoryKey[];
  nicotineRange: [number, number] | null; // [min, max] mg
  priceMax: number | null;                // max price per can
  hideOutOfStock: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  brands: [],
  strengths: [],
  flavors: [],
  formats: [],
  categories: [],
  nicotineRange: null,
  priceMax: null,
  hideOutOfStock: false,
};

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

/* Nicotine ranges for quick selection */
const NICOTINE_RANGES: { label: string; range: [number, number] }[] = [
  { label: '0 – 6 mg (Light)', range: [0, 6] },
  { label: '6 – 10 mg (Medium)', range: [6, 10] },
  { label: '10 – 16 mg (Strong)', range: [10, 16] },
  { label: '16+ mg (Extra Strong)', range: [16, 100] },
];

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  nicotinePouches: 'Nicotine Pouches',
  nicotineFree: 'Nicotine Free',
  energyPouches: 'Energy Pouches',
};

/* Collapsible filter section */
function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`${open ? 'Collapse' : 'Expand'} ${title} filter`}
        className="flex w-full items-center justify-between py-1 mb-2"
      >
        <h3 className="font-medium text-sm text-foreground">{title}</h3>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && children}
      <Separator className="bg-border/30 mt-5" />
    </div>
  );
}

export const ProductFilters = React.memo(function ProductFilters({ filters, onFilterChange, onClose, isMobile = false }: ProductFiltersProps) {
  const { t, translateFlavor, translateStrength, translateFormat } = useTranslation();
  const { brands: allBrands } = useBrands();
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  const sortedBrands = useMemo(
    () => [...allBrands].sort((a, b) => b.productCount - a.productCount),
    [allBrands],
  );

  const filteredBrandList = useMemo(() => {
    const list = brandSearch
      ? sortedBrands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
      : sortedBrands;
    return showAllBrands || brandSearch ? list : list.slice(0, 15);
  }, [sortedBrands, brandSearch, showAllBrands]);

  const toggleFilter = useCallback((category: keyof FilterState, value: string) => {
    const current = filters[category] as string[];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [category]: updated });
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => onFilterChange(EMPTY_FILTERS), [onFilterChange]);

  const hasActiveFilters = filters.brands.length > 0 || filters.strengths.length > 0 ||
    filters.flavors.length > 0 || filters.formats.length > 0 ||
    filters.categories.length > 0 || filters.nicotineRange !== null ||
    filters.priceMax !== null || filters.hideOutOfStock;

  const setNicotineRange = useCallback((range: [number, number] | null) => {
    // Toggle: if clicking the same range, clear it
    const isSame = filters.nicotineRange &&
      range &&
      filters.nicotineRange[0] === range[0] &&
      filters.nicotineRange[1] === range[1];
    onFilterChange({ ...filters, nicotineRange: isSame ? null : range });
  }, [filters, onFilterChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-foreground tracking-tight">{t('filter.title')}</h2>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary text-xs hover:bg-primary/8">
              Clear all
            </Button>
          )}
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:text-primary" aria-label="Close filters">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Stock toggle */}
      <div className="flex items-center justify-between py-1">
        <Label htmlFor="hide-oos" className="text-sm text-foreground cursor-pointer">
          Hide out of stock
        </Label>
        <Switch
          id="hide-oos"
          checked={filters.hideOutOfStock}
          onCheckedChange={(checked) => onFilterChange({ ...filters, hideOutOfStock: checked })}
        />
      </div>

      <Separator className="bg-border/30" />

      {/* Category */}
      <FilterSection title="Category" defaultOpen={filters.categories.length > 0}>
        <div className="space-y-2.5">
          {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((cat) => (
            <div key={cat} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${cat}`}
                checked={filters.categories.includes(cat)}
                onCheckedChange={() => toggleFilter('categories', cat)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm text-foreground cursor-pointer">
                {CATEGORY_LABELS[cat]}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title={t('filter.brand')} defaultOpen={filters.brands.length > 0}>
        <Input
          placeholder="Search brands..."
          className="h-8 text-sm mb-2"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
        />
        <div className={`space-y-2 ${filteredBrandList.length > 8 ? 'max-h-56 overflow-y-auto pr-1' : ''}`}>
          {filteredBrandList.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`brands-${brand.name}`}
                checked={filters.brands.includes(brand.name)}
                onCheckedChange={() => toggleFilter('brands', brand.name)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`brands-${brand.name}`} className="text-sm text-foreground cursor-pointer truncate">
                {brand.name}
                <span className="text-muted-foreground ml-1">({brand.productCount})</span>
              </Label>
            </div>
          ))}
        </div>
        {!brandSearch && sortedBrands.length > 15 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary text-xs hover:bg-primary/8 mt-2 p-0 h-auto"
            onClick={() => setShowAllBrands(!showAllBrands)}
          >
            {showAllBrands ? 'Show less' : `Show all ${sortedBrands.length} brands`}
          </Button>
        )}
      </FilterSection>

      {/* Nicotine Content */}
      <FilterSection title="Nicotine (mg/pouch)" defaultOpen={filters.nicotineRange !== null}>
        <div className="space-y-2">
          {NICOTINE_RANGES.map((nr) => {
            const isActive = filters.nicotineRange &&
              filters.nicotineRange[0] === nr.range[0] &&
              filters.nicotineRange[1] === nr.range[1];
            return (
              <button
                key={nr.label}
                type="button"
                onClick={() => setNicotineRange(nr.range)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-card border border-border/30 text-foreground hover:border-primary/30'
                }`}
              >
                {nr.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Max Price (per can)" defaultOpen={filters.priceMax !== null}>
        <div className="flex gap-2">
          {[5, 8, 10, 15].map((max) => {
            const isActive = filters.priceMax === max;
            return (
              <button
                key={max}
                type="button"
                onClick={() => onFilterChange({ ...filters, priceMax: isActive ? null : max })}
                className={`flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-card border border-border/30 text-foreground hover:border-primary/30'
                }`}
              >
                €{max}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Strength */}
      <FilterSection title={t('filter.strength')}>
        <div className="space-y-2.5">
          {strengthKeys.map((s) => (
            <div key={s} className="flex items-center gap-2.5">
              <Checkbox
                id={`strengths-${s}`}
                checked={filters.strengths.includes(s)}
                onCheckedChange={() => toggleFilter('strengths', s)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`strengths-${s}`} className="text-sm text-foreground cursor-pointer">
                {translateStrength(s)}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Flavor */}
      <FilterSection title={t('filter.flavor')}>
        <div className="space-y-2.5">
          {flavorKeys.map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <Checkbox
                id={`flavors-${f}`}
                checked={filters.flavors.includes(f)}
                onCheckedChange={() => toggleFilter('flavors', f)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`flavors-${f}`} className="text-sm text-foreground cursor-pointer">
                {translateFlavor(f)}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Format */}
      <FilterSection title={t('filter.format')} defaultOpen={false}>
        <div className="space-y-2.5">
          {formatKeys.map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <Checkbox
                id={`formats-${f}`}
                checked={filters.formats.includes(f)}
                onCheckedChange={() => toggleFilter('formats', f)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`formats-${f}`} className="text-sm text-foreground cursor-pointer">
                {translateFormat(f)}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {isMobile && onClose && (
        <Button className="w-full rounded-xl glow-primary" onClick={onClose}>
          {t('filter.showResults')}
        </Button>
      )}
    </div>
  );
});
