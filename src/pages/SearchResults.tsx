import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { brandDirectory } from '@/data/brand-overrides';
import { scoreProduct, matchesQuery } from '@/lib/search';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { ProductFilters, FilterState, EMPTY_FILTERS } from '@/components/product/ProductFilters';
import { ActiveFilters } from '@/components/product/ActiveFilters';
import { EmptyState } from '@/components/ui/states/EmptyState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { SEO } from '@/components/seo/SEO';
import { Search, Filter } from 'lucide-react';

type SortOption = 'relevance' | 'popularity' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
const ITEMS_PER_PAGE = 20;
const sortLabels: Record<SortOption, string> = {
  relevance: 'Relevance',
  popularity: 'Most Popular',
  'name-asc': 'A–Z',
  'name-desc': 'Z–A',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: allProducts = [], isLoading } = useCatalogProducts();

  // Reset page when query or filters change
  useEffect(() => { setCurrentPage(1); }, [query, filters, sortBy]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts
      .filter(p => matchesQuery(p, q))
      .map(p => ({ product: p, score: scoreProduct(p, q) }))
      .sort((a, b) => {
        const stockA = typeof a.product.stock === 'number' && a.product.stock === 0 ? -5 : 0;
        const stockB = typeof b.product.stock === 'number' && b.product.stock === 0 ? -5 : 0;
        return (b.score + stockB) - (a.score + stockA);
      })
      .map(({ product }) => product);
  }, [query, allProducts]);

  const matchedBrands = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return brandDirectory.filter(b => b.name.toLowerCase().includes(q));
  }, [query]);

  const filteredResults = useMemo(() => {
    let r = [...results];
    if (filters.brands.length > 0) r = r.filter(p => filters.brands.includes(p.brand));
    if (filters.strengths.length > 0) r = r.filter(p => filters.strengths.includes(p.strengthKey));
    if (filters.flavors.length > 0) r = r.filter(p => filters.flavors.includes(p.flavorKey));
    if (filters.formats.length > 0) r = r.filter(p => filters.formats.includes(p.formatKey));
    switch (sortBy) {
      case 'price-asc': return r.sort((a, b) => a.prices.pack1 - b.prices.pack1);
      case 'price-desc': return r.sort((a, b) => b.prices.pack1 - a.prices.pack1);
      case 'popularity': return r.sort((a, b) => b.ratings - a.ratings);
      case 'name-asc': return r.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return r.sort((a, b) => b.name.localeCompare(a.name));
      default: return r; // relevance — already scored
    }
  }, [results, sortBy, filters]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResults, currentPage]);

  const handleFilterChange = (f: FilterState) => { setFilters(f); setCurrentPage(1); };
  const handleRemoveFilter = (category: keyof FilterState, value: string) => {
    setFilters({ ...filters, [category]: (filters[category] as string[]).filter(v => v !== value) });
    setCurrentPage(1);
  };
  const handleClearAll = () => { setFilters(EMPTY_FILTERS); setCurrentPage(1); };

  const activeFilterCount = filters.brands.length + filters.strengths.length + filters.flavors.length + filters.formats.length;

  return (
    <>
      <SEO
        title={query ? `"${query}" — Search | SnusFriend` : 'Search | SnusFriend'}
        description={`Search results for "${query}" on SnusFriend.`}
        metaRobots="noindex,follow"
      />
      <Layout showNicotineWarning={false}>
        <div className="container py-8 lg:py-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search'}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredResults.length} product{filteredResults.length !== 1 ? 's' : ''} found
              {matchedBrands.length > 0 && ` · ${matchedBrands.length} brand${matchedBrands.length !== 1 ? 's' : ''} matched`}
            </p>
          </div>

          {/* Matched Brands */}
          {matchedBrands.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-3">
              {matchedBrands.map(b => (
                <Link
                  key={b.slug}
                  to={`/brand/${b.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-border/30 bg-card/60 p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {b.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 rounded-2xl border border-border/30 glass-panel-strong p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              {results.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
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
                        <SheetTitle className="sr-only">Filters</SheetTitle>
                        <ProductFilters filters={filters} onFilterChange={handleFilterChange} onClose={() => setMobileFiltersOpen(false)} isMobile />
                      </SheetContent>
                    </Sheet>

                    <p className="text-xs text-muted-foreground">
                      {isLoading ? 'Loading…' : `Showing ${paginatedResults.length} of ${filteredResults.length} products`}
                    </p>
                  </div>

                  <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
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
              )}

              <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAll} />

              {/* Results Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} variant="compact" />)}
                </div>
              ) : paginatedResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {paginatedResults.map(p => <ProductCard key={p.id} product={p} variant="compact" />)}
                </div>
              ) : (
                <EmptyState
                  variant="search"
                  title={query ? `No results for "${query}"` : 'Start searching'}
                  description={query ? 'Try a different term or browse our full range.' : 'Type a product name, brand, or flavour to get started.'}
                  actionLabel="Browse all products"
                  actionHref="/nicotine-pouches"
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-8 flex items-center justify-center gap-1.5 flex-wrap" aria-label="Pagination">
                  <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs border-border/30" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
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
                  <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs border-border/30" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
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
