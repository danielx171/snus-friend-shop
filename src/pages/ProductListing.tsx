import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, Product } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AgeGate } from '@/components/compliance/AgeGate';

type SortOption = 'popularity' | 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const ITEMS_PER_PAGE = 12;

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const badgeFilter = searchParams.get('badge');
  const brandFilter = searchParams.get('brand');
  const strengthFilter = searchParams.get('strength');

  const [filters, setFilters] = useState<FilterState>({
    brands: brandFilter ? [brandFilter] : [],
    strengths: strengthFilter ? [strengthFilter] : [],
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
      if (badgeFilter && !product.badges.includes(badgeFilter as any)) {
        return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      if (filters.strengths.length > 0 && !filters.strengths.includes(product.strength)) {
        return false;
      }
      if (filters.flavors.length > 0 && !filters.flavors.includes(product.flavor)) {
        return false;
      }
      if (filters.formats.length > 0 && !filters.formats.includes(product.format)) {
        return false;
      }
      return true;
    });
  }, [filters, badgeFilter]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'popularity':
        return sorted.sort((a, b) => b.ratings - a.ratings);
      case 'newest':
        return sorted.sort((a, b) => 
          a.badges.includes('Nyhet') ? -1 : b.badges.includes('Nyhet') ? 1 : 0
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          a.badges.includes('Nyhet') ? 1 : b.badges.includes('Nyhet') ? -1 : 0
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

  const activeFilterCount =
    filters.brands.length +
    filters.strengths.length +
    filters.flavors.length +
    filters.formats.length;

  // Page title based on filters
  const pageTitle = badgeFilter === 'Nytt pris' ? 'Nya priser' :
                    badgeFilter === 'Nyhet' ? 'Nyheter' :
                    badgeFilter === 'Populär' ? 'Populära produkter' :
                    brandFilter ? brandFilter :
                    'Nikotinpåsar';

  return (
    <Layout showNicotineWarning={false}>
      <AgeGate />

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">
            Utforska vårt breda sortiment av nikotinpåsar från ledande varumärken
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-40 rounded-2xl border border-border bg-card p-6">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2 rounded-xl">
                      <Filter className="h-4 w-4" />
                      Filter
                      {activeFilterCount > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
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

                <p className="text-sm text-muted-foreground">
                  Visar {paginatedProducts.length} av {sortedProducts.length} artiklar
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-44 rounded-xl">
                    <SelectValue placeholder="Sortera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularitet</SelectItem>
                    <SelectItem value="newest">Nyast först</SelectItem>
                    <SelectItem value="oldest">Äldst först</SelectItem>
                    <SelectItem value="name-asc">Namn A-Ö</SelectItem>
                    <SelectItem value="name-desc">Namn Ö-A</SelectItem>
                    <SelectItem value="price-asc">Lägst pris</SelectItem>
                    <SelectItem value="price-desc">Högst pris</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  Inga produkter matchar dina filter
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    setFilters({ brands: [], strengths: [], flavors: [], formats: [] })
                  }
                >
                  Rensa filter
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Föregående
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
                      className="rounded-xl"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Nästa
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
