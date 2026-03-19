import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { brandDirectory } from '@/data/brands';
import { cn } from '@/lib/utils';

interface SearchResult {
  type: 'product' | 'brand';
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  href: string;
}

interface SearchAutocompleteProps {
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchAutocomplete({ onClose, autoFocus, className }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { data: allProducts = [] } = useCatalogProducts();

  const results = useMemo<SearchResult[]>(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();

    const productResults: SearchResult[] = allProducts
      .filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 5)
      .map(p => ({
        type: 'product',
        id: p.id,
        name: p.name,
        subtitle: `${p.brand} · £${p.prices.pack1.toFixed(2)}`,
        image: p.image,
        href: `/product/${p.id}`,
      }));

    const brandResults: SearchResult[] = brandDirectory
      .filter(b => b.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(b => ({
        type: 'brand',
        id: b.slug,
        name: b.name,
        subtitle: b.tagline,
        href: `/brand/${b.slug}`,
      }));

    return [...productResults, ...brandResults];
  }, [query, allProducts]);

  useEffect(() => {
    setIsOpen(results.length > 0 || query.length >= 2);
    setActiveIndex(-1);
  }, [results, query]);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(result.href);
    setQuery('');
    setIsOpen(false);
    onClose?.();
  }, [navigate, onClose]);

  const handleSubmit = useCallback(() => {
    if (activeIndex >= 0 && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    } else if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsOpen(false);
      onClose?.();
    }
  }, [activeIndex, results, query, navigate, handleSelect, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        handleSubmit();
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        onClose?.();
        break;
    }
  }, [results.length, handleSubmit, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]');
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search products & brands..."
          className="w-full pl-11 pr-10 h-11 rounded-2xl bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          id="search-results"
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-border/30 glass-panel-strong shadow-lg overflow-hidden"
        >
          {results.length === 0 && query.length >= 2 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          ) : (
            <>
              {results.some(r => r.type === 'product') && (
                <div className="px-3 pt-3 pb-1">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-2">Products</p>
                </div>
              )}
              {results.filter(r => r.type === 'product').map((result, i) => {
                const globalIdx = results.indexOf(result);
                return (
                  <button
                    key={result.id}
                    data-search-item
                    id={`search-item-${globalIdx}`}
                    role="option"
                    aria-selected={activeIndex === globalIdx}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors',
                      activeIndex === globalIdx ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40'
                    )}
                  >
                    {result.image && (
                      <img src={result.image} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{result.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </button>
                );
              })}

              {results.some(r => r.type === 'brand') && (
                <div className="px-3 pt-3 pb-1 border-t border-border/20">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-2">Brands</p>
                </div>
              )}
              {results.filter(r => r.type === 'brand').map((result) => {
                const globalIdx = results.indexOf(result);
                return (
                  <button
                    key={result.id}
                    data-search-item
                    id={`search-item-${globalIdx}`}
                    role="option"
                    aria-selected={activeIndex === globalIdx}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors',
                      activeIndex === globalIdx ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40'
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/30 border border-border/20 text-xs font-bold text-muted-foreground shrink-0">
                      {result.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{result.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </button>
                );
              })}

              {query.trim() && (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-primary font-medium border-t border-border/20 hover:bg-primary/5 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  See all results for "{query}"
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
