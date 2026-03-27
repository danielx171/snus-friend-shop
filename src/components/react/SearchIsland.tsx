import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { scoreProduct, type SearchableProduct } from '@/lib/search';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchIslandProps {
  productsJson?: string;
  productsJsonUrl?: string;
  initialQuery?: string;
}

// ---------------------------------------------------------------------------
// Category quick links
// ---------------------------------------------------------------------------

const QUICK_LINKS = [
  { label: 'Mint', href: '/products?flavor=mint' },
  { label: 'Strong', href: '/products?strength=strong' },
  { label: 'VELO', href: '/products?brand=velo' },
  { label: 'ZYN', href: '/products?brand=zyn' },
  { label: 'Berry', href: '/products?flavor=berry' },
  { label: 'Citrus', href: '/products?flavor=citrus' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function SearchIsland({ productsJson, productsJsonUrl, initialQuery }: SearchIslandProps) {
  const [fetchedProducts, setFetchedProducts] = useState<SearchableProduct[] | null>(null);

  // Fetch products from URL if provided (keeps HTML small)
  useEffect(() => {
    if (!productsJsonUrl || productsJson) return;
    fetch(productsJsonUrl)
      .then(r => r.json())
      .then(data => setFetchedProducts(data))
      .catch(() => setFetchedProducts([]));
  }, [productsJsonUrl, productsJson]);

  const allProducts = useMemo<SearchableProduct[]>(() => {
    if (productsJson) {
      try { return JSON.parse(productsJson); } catch { return []; }
    }
    return fetchedProducts ?? [];
  }, [productsJson, fetchedProducts]);

  const [query, setQuery] = useState(initialQuery ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Sync URL with debounced query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const trimmed = debouncedQuery.trim();
    const url = trimmed
      ? `${window.location.pathname}?q=${encodeURIComponent(trimmed)}`
      : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [debouncedQuery]);

  // Score and filter results
  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) return [];

    const scored = allProducts
      .map((p) => ({ product: p, score: scoreProduct(p, trimmed) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map((r) => r.product);
  }, [allProducts, debouncedQuery]);

  const trimmedQuery = debouncedQuery.trim();

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search pouches, brands, flavours..."
          autoComplete="off"
          className="w-full rounded-xl border border-border bg-card/60 py-4 pl-12 pr-5 text-lg text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* No query: idle state */}
      {!trimmedQuery && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-10 w-10 text-muted-foreground/50"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Search our catalogue of {allProducts.length}+ nicotine pouches
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-sm text-muted-foreground">
            Type a product name, brand, or flavour above to find what you're looking for.
          </p>

          {/* Category quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Query with results */}
      {trimmedQuery && results.length > 0 && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{trimmedQuery}&rdquo;
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard
                key={product.slug}
                slug={product.slug}
                name={product.name}
                brand={product.brand}
                brandSlug={product.brandSlug}
                imageUrl={product.imageUrl}
                prices={product.prices}
                stock={product.stock}
                nicotineContent={product.nicotineContent}
                strengthKey={product.strengthKey}
                flavorKey={product.flavorKey}
                ratings={product.ratings}
                badgeKeys={product.badgeKeys}
              />
            ))}
          </div>
        </div>
      )}

      {/* Query with no results */}
      {trimmedQuery && results.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-10 w-10 text-muted-foreground/50"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            No results for &ldquo;{trimmedQuery}&rdquo;
          </h2>
          <ul className="mx-auto mb-6 max-w-sm text-left text-sm text-muted-foreground">
            <li className="mb-1">- Try a different spelling</li>
            <li className="mb-1">- Use fewer or more general keywords</li>
            <li>- Browse by category instead</li>
          </ul>
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse All Products
          </a>
        </div>
      )}
    </div>
  );
}

export default React.memo(SearchIsland);
