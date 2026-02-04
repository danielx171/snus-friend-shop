import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, BadgeKey, StrengthKey, FlavorKey, FormatKey } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';
import { ActiveFilters } from '@/components/product/ActiveFilters';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AgeGate } from '@/components/compliance/AgeGate';
import { useTranslation } from '@/hooks/useTranslation';

type SortOption = 'popularity' | 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const ITEMS_PER_PAGE = 12;

// Map URL badge params to internal badge keys
const urlBadgeToKey: Record<string, BadgeKey> = {
  'Nytt+pris': 'newPrice',
  'Nytt pris': 'newPrice',
  'Nyhet': 'new',
  'Populär': 'popular',
  'Begränsat': 'limited',
};

// Map URL strength params to internal strength keys
const urlStrengthToKey: Record<string, StrengthKey> = {
  'Normal': 'normal',
  'Stark': 'strong',
  'Extra+Stark': 'extraStrong',
  'Extra Stark': 'extraStrong',
  'Ultra+Stark': 'ultraStrong',
  'Ultra Stark': 'ultraStrong',
};

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const badgeFilter = searchParams.get('badge');
  const brandFilter = searchParams.get('brand');
  const strengthFilter = searchParams.get('strength');
  const { t, translateBadge } = useTranslation();

  // Convert URL params to internal keys
  const badgeKeyFilter = badgeFilter ? urlBadgeToKey[badgeFilter] : undefined;
  const strengthKeyFilter = strengthFilter ? urlStrengthToKey[strengthFilter] : undefined;

  const sortLabels: Record<SortOption, string> = {
    popularity: t('sort.popularity'),
    newest: t('sort.newest'),
    oldest: t('sort.newest'),
    'name-asc': 'A-Z',
    'name-desc': 'Z-A',
    'price-asc': t('sort.priceLow'),
    'price-desc': t('sort.priceHigh'),
  };

  const [filters, setFilters] = useState<FilterState>({
    brands: brandFilter ? [brandFilter] : [],
    strengths: strengthKeyFilter ? [strengthKeyFilter] : [],
    flavors: [],
    formats: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // URL badge filter
      if (badgeKeyFilter && !product.badgeKeys.includes(badgeKeyFilter)) {
        return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      if (filters.strengths.length > 0 && !filters.strengths.includes(product.strengthKey)) {
        return false;
      }
      if (filters.flavors.length > 0 && !filters.flavors.includes(product.flavorKey)) {
        return false;
      }
      if (filters.formats.length > 0 && !filters.formats.includes(product.formatKey)) {
        return false;
      }
      return true;
    });
  }, [filters, badgeKeyFilter]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'popularity':
        return sorted.sort((a, b) => b.ratings - a.ratings);
      case 'newest':
        return sorted.sort((a, b) => 
          a.badgeKeys.includes('new') ? -1 : b.badgeKeys.includes('new') ? 1 : 0
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          a.badgeKeys.includes('new') ? 1 : b.badgeKeys.includes('new') ? -1 : 0
        );
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'sv'));
      case 'price-asc':
        return sorted.sort((a, b) => a.prices.pack1 - b.prices.pack1);
      case 'price-desc':
        return sorted.sort((a, b) => b.prices.pack1 - a.prices.pack1);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (category: keyof FilterState, value: string) => {
    const updated = {
      ...filters,
      [category]: (filters[category] as string[]).filter((v) => v !== value),
    };
    setFilters(updated);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setFilters({ brands: [], strengths: [], flavors: [], formats: [] });
    setCurrentPage(1);
  };

  const activeFilterCount =
    filters.brands.length +
    filters.strengths.length +
    filters.flavors.length +
    filters.formats.length;

  // Page title based on filters
  const pageTitle = badgeKeyFilter ? translateBadge(badgeKeyFilter) :
                    brandFilter ? brandFilter :
                    t('categories.whiteSnus');

  return (
    <Layout showNicotineWarning={false}>
      <AgeGate />

      <div className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 line-clamp-2">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters - Sticky */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar - aligned baseline */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-1.5 rounded-xl h-9 shrink-0">
                      <Filter className="h-3.5 w-3.5" />
                      <span className="truncate">{t('filter.title')}</span>
                      {activeFilterCount > 0 && (
                        <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <ProductFilters
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onClose={() => setMobileFiltersOpen(false)}
                      isMobile
                    />
                  </SheetContent>
                </Sheet>

                <p className="text-xs text-muted-foreground truncate">
                  {t('products.showing')} {paginatedProducts.length} {t('products.of')} {sortedProducts.length} {t('products.productsLabel')}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:inline">{t('sort.label')}:</span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-36 rounded-xl h-9 text-xs">
                    <SelectValue placeholder={t('sort.label')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sortLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Chips */}
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAll}
            />

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground mb-3">
                  {t('filter.clearAll')}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={handleClearAll}
                >
                  {t('filter.clearAll')}
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-1.5 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-8 text-xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  {t('pagination.previous')}
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                    }
                    if (currentPage > totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    }
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-xl h-8 w-8 text-xs p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-8 text-xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  {t('pagination.next')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
