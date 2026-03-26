import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Tag, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export interface TaggedProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

interface ProductTagPickerProps {
  selected: TaggedProduct[];
  onAdd: (product: TaggedProduct) => void;
  onRemove: (productId: string) => void;
  /** Product ID to exclude from search (the page's own product) */
  excludeProductId?: string;
  maxTags?: number;
}

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export const ProductTagPicker = memo(function ProductTagPicker({
  selected,
  onAdd,
  onRemove,
  excludeProductId,
  maxTags = 3,
}: ProductTagPickerProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const atLimit = selected.length >= maxTags;
  const selectedIds = new Set(selected.map((p) => p.id));

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search products — store raw results, filter in render to avoid stale closures
  useEffect(() => {
    setLoading(false);
    if (debouncedQuery.length < 2 || atLimit) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const escaped = debouncedQuery.replace(/[%_\\]/g, '\\$&');
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, image_url')
        .eq('is_active', true)
        .ilike('name', `%${escaped}%`)
        .limit(8);

      if (cancelled) return;

      const raw = (data ?? []).filter((p) => p.id !== excludeProductId);
      setResults(raw);
      setIsOpen(raw.length > 0);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, atLimit, excludeProductId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback(
    (product: SearchResult) => {
      onAdd(product);
      setQuery('');
      setResults([]);
      setIsOpen(false);
    },
    [onAdd],
  );

  const handleRemove = useCallback(
    (productId: string) => {
      onRemove(productId);
    },
    [onRemove],
  );

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((p) => (
            <Badge
              key={p.id}
              variant="secondary"
              className="gap-1 pr-1 text-xs"
            >
              <Tag className="h-3 w-3" />
              <span className="max-w-[120px] truncate">{p.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-0.5 hover:bg-destructive/20"
                onClick={() => handleRemove(p.id)}
                aria-label={`Remove tag ${p.name}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search input */}
      {!atLimit && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Tag a product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 pl-7 text-xs"
          />

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 top-full mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto">
              {loading ? (
                <p className="text-xs text-muted-foreground p-2">Searching...</p>
              ) : (
                results.filter((p) => !selectedIds.has(p.id)).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors"
                    onClick={() => handleSelect(product)}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt=""
                        className="h-6 w-6 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded bg-muted flex-shrink-0" />
                    )}
                    <span className="text-xs truncate">{product.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
