import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { brandDirectory } from '@/data/brands';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/states/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { SEO } from '@/components/seo/SEO';
import { Search, X } from 'lucide-react';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'popularity';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const { data: allProducts = [], isLoading } = useCatalogProducts();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.flavorKey.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  const matchedBrands = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return brandDirectory.filter(b => b.name.toLowerCase().includes(q));
  }, [query]);

  const filteredResults = useMemo(() => {
    let r = [...results];
    if (brandFilter.length > 0) r = r.filter(p => brandFilter.includes(p.brand));
    switch (sortBy) {
      case 'price-asc': return r.sort((a, b) => a.prices.pack1 - b.prices.pack1);
      case 'price-desc': return r.sort((a, b) => b.prices.pack1 - a.prices.pack1);
      case 'popularity': return r.sort((a, b) => b.ratings - a.ratings);
      default: return r;
    }
  }, [results, sortBy, brandFilter]);

  const availableBrands = [...new Set(results.map(p => p.brand))];

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
                {query ? <>Results for "{query}"</> : 'Search'}
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

          {/* Toolbar */}
          {results.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {availableBrands.map(brand => (
                  <Badge
                    key={brand}
                    variant={brandFilter.includes(brand) ? 'default' : 'outline'}
                    className="cursor-pointer rounded-full px-3 py-1 border-border/30"
                    onClick={() => setBrandFilter(prev =>
                      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                    )}
                  >
                    {brand}
                    {brandFilter.includes(brand) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
                {brandFilter.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setBrandFilter([])} className="text-xs text-primary">
                    Clear
                  </Button>
                )}
              </div>
              <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-44 rounded-xl h-9 text-xs border-border/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel-strong">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Results Grid */}
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResults.map(p => <ProductCard key={p.id} product={p} />)}
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
        </div>
      </Layout>
    </>
  );
}
