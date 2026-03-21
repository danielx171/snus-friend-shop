import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  brand_name: string;
  price: number;
}

interface SearchAutocompleteProps {
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

/** Highlight matching portion of text */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-foreground">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchAutocomplete({ onClose, autoFocus, className }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useTranslation();

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch from Supabase
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, image_url, brand_id')
        .eq('is_active', true)
        .ilike('name', `%${debouncedQuery}%`)
        .limit(6);

      if (cancelled) return;

      if (!data || data.length === 0) {
        setResults([]);
        setIsOpen(true);
        setLoading(false);
        return;
      }

      // Fetch brand names + default variant prices
      const brandIds = [...new Set(data.map((p) => p.brand_id))];
      const productIds = data.map((p) => p.id);

      const [brandsRes, variantsRes] = await Promise.all([
        supabase.from('brands').select('id, name').in('id', brandIds),
        supabase
          .from('product_variants')
          .select('product_id, price, is_default')
          .in('product_id', productIds)
          .eq('is_default', true),
      ]);

      if (cancelled) return;

      const brandMap = new Map((brandsRes.data ?? []).map((b) => [b.id, b.name]));
      const priceMap = new Map((variantsRes.data ?? []).map((v) => [v.product_id, v.price]));

      const mapped: SearchResult[] = data.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image_url: p.image_url,
        brand_name: brandMap.get(p.brand_id) ?? '',
        price: priceMap.get(p.id) ?? 0,
      }));

      setResults(mapped);
      setIsOpen(true);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Reset active index on results change
  useEffect(() => { setActiveIndex(-1); }, [results]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(`/product/${result.id}`);
    setQuery('');
    setIsOpen(false);
    setIsFocused(false);
    onClose?.();
  }, [navigate, onClose]);

  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      navigate(`/nicotine-pouches?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsOpen(false);
      setIsFocused(false);
      onClose?.();
    }
  }, [query, navigate, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // total selectable = results.length + 1 (view all link)
    const totalItems = results.length + (query.trim() ? 1 : 0);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex]);
        } else {
          handleViewAll();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setIsFocused(false);
        setQuery('');
        onClose?.();
        break;
    }
  }, [results, activeIndex, query, handleSelect, handleViewAll, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]');
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const showDropdown = isOpen && (debouncedQuery.length >= 2);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0 || debouncedQuery.length >= 2) setIsOpen(true);
          }}
          placeholder="Search products & brands..."
          className={cn(
            'pl-11 pr-10 h-11 rounded-2xl bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200',
            isFocused ? 'w-full md:w-[120%] md:-ml-[10%]' : 'w-full'
          )}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            id="search-results"
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-border/30 bg-card shadow-2xl overflow-hidden',
              isFocused && 'md:w-[120%] md:-ml-[10%]'
            )}
          >
            {results.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No products found for "{debouncedQuery}"</p>
                <Link
                  to="/nicotine-pouches"
                  onClick={() => { setIsOpen(false); setIsFocused(false); onClose?.(); }}
                  className="text-xs text-primary hover:underline mt-1 inline-block"
                >
                  Browse all products →
                </Link>
              </div>
            ) : (
              <>
                {results.map((result, i) => (
                  <motion.button
                    key={result.id}
                    data-search-item
                    id={`search-item-${i}`}
                    role="option"
                    aria-selected={activeIndex === i}
                    onClick={() => handleSelect(result)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut', delay: i * 0.03 }}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors',
                      activeIndex === i ? 'bg-primary/10' : 'hover:bg-muted/40'
                    )}
                  >
                    {result.image_url ? (
                      <img src={result.image_url} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        <HighlightMatch text={result.name} query={debouncedQuery} />
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {result.brand_name} · {formatPrice(result.price)}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </motion.button>
                ))}

                <motion.button
                  data-search-item
                  id={`search-item-${results.length}`}
                  role="option"
                  aria-selected={activeIndex === results.length}
                  onClick={handleViewAll}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: results.length * 0.03 }}
                  className={cn(
                    'flex items-center gap-2 w-full px-4 py-3 text-sm font-medium border-t border-border/20 transition-colors',
                    activeIndex === results.length ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/5'
                  )}
                >
                  <Search className="h-4 w-4" />
                  View all results for "{debouncedQuery}"
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
