import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BadgeKey, StrengthKey } from '@/data/products';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { ProductFilters, FilterState } from '@/components/product/ProductFilters';
import { ActiveFilters } from '@/components/product/ActiveFilters';
import { PLPEmptyState } from '@/components/product/PLPEmptyState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';

type SortOption = 'popularity' | 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
const ITEMS_PER_PAGE = 20;
const SITE_URL = import.meta.env.VITE_SITE_URL as string | undefined;
const listingUrl = SITE_URL ? SITE_URL + '/nicotine-pouches' : undefined;

/** Brands boosted to the top of the "Most Popular" sort, in display order. */
const FEATURED_BRANDS = ['VELO', 'Sting', 'ZYN', 'LOOP'];

const urlBadgeToKey: Record<string, BadgeKey> = { 'new': 'new', 'newPrice': 'newPrice', 'popular': 'popular', 'limited': 'limited' };
const urlStrengthToKey: Record<string, StrengthKey> = { 'normal': 'normal', 'strong': 'strong', 'extraStrong': 'extraStrong', 'ultraStrong': 'ultraStrong' };
const badgeLabels: Record<BadgeKey, string> = { new: 'New Arrivals', newPrice: 'Special Offers', popular: 'Bestsellers', limited: 'Limited Edition' };
const sortLabels: Record<SortOption, string> = { popularity: 'Most Popular', newest: 'Newest First', oldest: 'Oldest First', 'name-asc': 'A-Z', 'name-desc': 'Z-A', 'price-asc': 'Price: Low to High', 'price-desc': 'Price: High to Low' };

export default function ProductListing() {
  const { data: products = [], isLoading, isError } = useCatalogProducts();
  const [searchParams] = useSearchParams();
  const badgeFilter = searchParams.get('badge');
  const brandFilter = searchParams.get('brand');
  const strengthFilter = searchParams.get('strength');

  const badgeKeyFilter = badgeFilter ? urlBadgeToKey[badgeFilter] : undefined;
  const strengthKeyFilter = strengthFilter ? urlStrengthToKey[strengthFilter] : undefined;

  const [filters, setFilters] = useState<FilterState>({
    brands: brandFilter ? [brandFilter] : [],
    strengths: strengthKeyFilter ? [strengthKeyFilter] : [],
    flavors: [], formats: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);

  // Fade grid out/in when filters or sort change
  const filterKey = JSON.stringify(filters) + sortBy + currentPage;
  useEffect(() => {
    setGridVisible(false);
    const t = setTimeout(() => setGridVisible(true), 100);
    return () => clearTimeout(t);
  }, [filterKey]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (badgeKeyFilter && !product.badgeKeys.includes(badgeKeyFilter)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
      if (filters.strengths.length > 0 && !filters.strengths.includes(product.strengthKey)) return false;
      if (filters.flavors.length > 0 && !filters.flavors.includes(product.flavorKey)) return false;
      if (filters.formats.length > 0 && !filters.formats.includes(product.formatKey)) return false;
      return true;
    });
  }, [products, filters, badgeKeyFilter]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    // Primary sort by user selection
    switch (sortBy) {
      case 'popularity': sorted.sort((a, b) => {
        const aIdx = FEATURED_BRANDS.indexOf(a.brand);
        const bIdx = FEATURED_BRANDS.indexOf(b.brand);
        const aFeat = aIdx !== -1;
        const bFeat = bIdx !== -1;
        if (aFeat && !bFeat) return -1;
        if (!aFeat && bFeat) return 1;
        if (aFeat && bFeat) return aIdx - bIdx;
        return b.ratings - a.ratings;
      }); break;
      case 'newest': sorted.sort((a, b) => a.badgeKeys.includes('new') ? -1 : b.badgeKeys.includes('new') ? 1 : 0); break;
      case 'oldest': sorted.sort((a, b) => a.badgeKeys.includes('new') ? 1 : b.badgeKeys.includes('new') ? -1 : 0); break;
      case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': sorted.sort((a, b) => a.prices.pack1 - b.prices.pack1); break;
      case 'price-desc': sorted.sort((a, b) => b.prices.pack1 - a.prices.pack1); break;
    }

    // Push out-of-stock products to the end (stable — preserves sort within each group)
    const inStock = sorted.filter(p => typeof p.stock !== 'number' || p.stock > 0);
    const outOfStock = sorted.filter(p => typeof p.stock === 'number' && p.stock === 0);
    return [...inStock, ...outOfStock];
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleFilterChange = (newFilters: FilterState) => { setFilters(newFilters); setCurrentPage(1); };
  const handleRemoveFilter = (category: keyof FilterState, value: string) => {
    setFilters({ ...filters, [category]: (filters[category] as string[]).filter((v) => v !== value) });
    setCurrentPage(1);
  };
  const handleClearAll = () => { setFilters({ brands: [], strengths: [], flavors: [], formats: [] }); setCurrentPage(1); };

  const activeFilterCount = filters.brands.length + filters.strengths.length + filters.flavors.length + filters.formats.length;
  const pageTitle = badgeKeyFilter ? badgeLabels[badgeKeyFilter] : brandFilter ? brandFilter : 'Nicotine Pouches';
  const pageDescription = badgeKeyFilter
    ? `Shop our ${badgeLabels[badgeKeyFilter].toLowerCase()} nicotine pouches. Free delivery on orders over €29.`
    : `Browse our complete range of nicotine pouches. Free delivery on orders over €29.`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', ...(SITE_URL && { item: SITE_URL }) },
      { '@type': 'ListItem', position: 2, name: pageTitle, ...(listingUrl && { item: listingUrl }) },
    ],
  };

  return (
    <>
      <SEO
        title={`${pageTitle} | SnusFriend`}
        description={pageDescription}
        canonical={listingUrl}
        jsonLd={breadcrumbJsonLd}
        metaRobots={activeFilterCount > 1 ? 'noindex,follow' : undefined}
      />
      <Layout showNicotineWarning={false}>
        <div className="container py-8 lg:py-10">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground max-w-lg">{pageDescription}</p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 rounded-2xl border border-border/30 glass-panel-strong p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile filter trigger */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden gap-1.5 rounded-xl h-9 shrink-0 border-border/30 hover:border-primary/30">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                          <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto glass-panel-strong border-border/30">
                      <ProductFilters filters={filters} onFilterChange={handleFilterChange} onClose={() => setMobileFiltersOpen(false)} isMobile />
                    </SheetContent>
                  </Sheet>

                  <p className="text-xs text-muted-foreground">
                    {isLoading ? 'Loading…' : isError ? 'Could not load products' : `Showing ${paginatedProducts.length} of ${sortedProducts.length} products`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-44 rounded-xl h-9 text-xs border-border/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel-strong">
                      {Object.entries(sortLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="text-xs hover:bg-primary/8">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAll} />

              {/* Product grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} variant="compact" />)}
                </div>
              ) : isError ? (
                <div className="py-20 text-center">
                  <p className="text-foreground font-medium mb-2">Failed to load products</p>
                  <p className="text-sm text-muted-foreground">There was a problem fetching the catalog. Please refresh the page.</p>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <div
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 transition-opacity duration-100"
                  style={{ opacity: gridVisible ? 1 : 0 }}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} variant="compact" />
                  ))}
                </div>
              ) : (
                <PLPEmptyState onClearFilters={handleClearAll} />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-8 flex items-center justify-center gap-1.5 flex-wrap" aria-label="Pagination">
                  <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs border-border/30" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3) pageNum = currentPage - 2 + i;
                      if (currentPage > totalPages - 2) pageNum = totalPages - 4 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className={`rounded-xl h-9 w-9 text-xs p-0 ${currentPage === pageNum ? 'glow-primary' : 'border-border/30'}`}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs border-border/30" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                  </Button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
