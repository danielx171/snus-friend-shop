import { useState, useMemo } from 'react';
import { flavorKeys, strengthKeys, formatKeys, FlavorKey, StrengthKey, FormatKey } from '@/data/products';
import { useBrands } from '@/hooks/useBrands';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export function ProductFilters({ filters, onFilterChange, onClose, isMobile = false }: ProductFiltersProps) {
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
    return showAllBrands || brandSearch ? list : list.slice(0, 10);
  }, [sortedBrands, brandSearch, showAllBrands]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = filters[category] as string[];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [category]: updated });
  };

  const clearFilters = () => onFilterChange({ brands: [], strengths: [], flavors: [], formats: [] });

  const hasActiveFilters = filters.brands.length > 0 || filters.strengths.length > 0 || filters.flavors.length > 0 || filters.formats.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-foreground tracking-tight">{t('filter.title')}</h2>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:text-primary" aria-label="Close filters">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary text-xs hover:bg-primary/8">
          {t('filter.clearAll')}
        </Button>
      )}

      <Separator className="bg-border/30" />

      <div>
        <h3 className="mb-3 font-medium text-sm text-foreground">{t('filter.brand')}</h3>
        <Input
          placeholder="Search brands..."
          className="h-8 text-sm mb-2"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
        />
        <div className={`space-y-2.5 ${filteredBrandList.length > 6 ? 'max-h-48 overflow-y-auto' : ''}`}>
          {filteredBrandList.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`brands-${brand.name}`}
                checked={filters.brands.includes(brand.name)}
                onCheckedChange={() => toggleFilter('brands', brand.name)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`brands-${brand.name}`} className="text-sm text-foreground cursor-pointer truncate">
                {brand.name} ({brand.productCount})
              </Label>
            </div>
          ))}
        </div>
        {!brandSearch && sortedBrands.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary text-xs hover:bg-primary/8 mt-2 p-0 h-auto"
            onClick={() => setShowAllBrands(!showAllBrands)}
          >
            {showAllBrands ? 'Show less' : `Show all ${sortedBrands.length} brands`}
          </Button>
        )}
        <Separator className="bg-border/30 mt-6" />
      </div>

      {[
        { key: 'strengths' as const, title: t('filter.strength'), items: strengthKeys.map(s => ({ value: s, label: translateStrength(s) })) },
        { key: 'flavors' as const, title: t('filter.flavor'), items: flavorKeys.map(f => ({ value: f, label: translateFlavor(f) })) },
        { key: 'formats' as const, title: t('filter.format'), items: formatKeys.map(f => ({ value: f, label: translateFormat(f) })) },
      ].map((section) => (
        <div key={section.key}>
          <h3 className="mb-3 font-medium text-sm text-foreground">{section.title}</h3>
          <div className={`space-y-2.5 ${section.items.length > 6 ? 'max-h-48 overflow-y-auto' : ''}`}>
            {section.items.map((item) => (
              <div key={item.value} className="flex items-center gap-2.5">
                <Checkbox
                  id={`${section.key}-${item.value}`}
                  checked={(filters[section.key] as string[]).includes(item.value)}
                  onCheckedChange={() => toggleFilter(section.key, item.value)}
                  className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={`${section.key}-${item.value}`} className="text-sm text-foreground cursor-pointer truncate">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
          <Separator className="bg-border/30 mt-6" />
        </div>
      ))}

      {isMobile && onClose && (
        <Button className="w-full rounded-xl glow-primary" onClick={onClose}>
          {t('filter.showResults')}
        </Button>
      )}
    </div>
  );
}
