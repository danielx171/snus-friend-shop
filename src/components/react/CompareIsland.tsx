import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { expandImageUrl } from '@/lib/image-cdn';
import { strengthLabels } from '@/data/brand-colors';
import { flavorLabels } from '@/data/product-labels';
import { siteHost } from '@/config/site';
import { tenant } from '@/config/tenant';

type SlimProduct = {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  imageUrl: string;
  prices?: { pack1?: number };
  nicotineContent?: number;
  strengthKey?: string;
  flavorKey?: string;
  formatKey?: string;
  ratings?: number;
  stock?: number;
  portionsPerCan?: number;
};

const MAX_SELECTED = 4;

function readSelectedFromUrl(): string[] {
  if (typeof window === 'undefined') return [];
  const initial = new URLSearchParams(window.location.search).get('products');
  if (!initial) return [];
  return initial.split(',').map((s) => s.trim()).filter(Boolean).slice(0, MAX_SELECTED);
}

function defaultPair(products: SlimProduct[]): string[] {
  const popular = products
    .filter((p) => p.imageUrl && (p.stock ?? 0) > 0 && (p.prices?.pack1 ?? 0) > 0)
    .sort((a, b) => (b.ratings ?? 0) - (a.ratings ?? 0));
  if (popular.length < 2) return popular.map((p) => p.slug);
  const first = popular[0];
  const second = popular.find((p) => p.brand !== first.brand) ?? popular[1];
  return [first.slug, second.slug];
}

function formatStrength(key?: string) {
  if (!key) return 'Normal';
  return strengthLabels[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

function formatFlavor(key?: string) {
  if (!key) return '-';
  return flavorLabels[key] ?? key;
}

function formatFormat(key?: string) {
  const f = key || 'slim';
  return f.charAt(0).toUpperCase() + f.slice(1);
}

export default function CompareIsland() {
  const [products, setProducts] = useState<SlimProduct[]>([]);
  // Seed selected synchronously from the URL so the persistence effect doesn't
  // strip `?products=...` on mount before the products fetch resolves. If the
  // URL is empty, we fall back to a default popular pair once products load.
  const [selected, setSelected] = useState<string[]>(() => readSelectedFromUrl());
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load slim products.json once; rehydrate imageUrl prefix.
  useEffect(() => {
    let cancelled = false;
    fetch('/data/products.json')
      .then((r) => r.json() as Promise<SlimProduct[]>)
      .then((raw) => {
        if (cancelled) return;
        const hydrated = raw.map((p) => ({ ...p, imageUrl: expandImageUrl(p.imageUrl) }));
        setProducts(hydrated);
        setProductsLoaded(true);
        const known = new Set(hydrated.map((p) => p.slug));
        setSelected((prev) => {
          // Prune stale URL slugs + dedupe so a bad `?products=a,b,c,d` query
          // doesn't disable the input with no chips to clear.
          const cleaned = Array.from(new Set(prev.filter((s) => known.has(s))));
          return cleaned.length > 0 ? cleaned : defaultPair(hydrated);
        });
      })
      .catch(() => {
        setProductsLoaded(true); // unblock URL persistence even if catalog missing
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist selection to URL (replace, not push). Gate on products being loaded
  // so we never race an empty selection into `history.replaceState` before the
  // initial fetch+default-pair hydration settles.
  useEffect(() => {
    if (typeof window === 'undefined' || !productsLoaded) return;
    const url = new URL(window.location.href);
    if (selected.length > 0) url.searchParams.set('products', selected.join(','));
    else url.searchParams.delete('products');
    window.history.replaceState(null, '', url.toString());
  }, [selected, productsLoaded]);

  // Close dropdown on outside click.
  useEffect(() => {
    if (!searchOpen) return;
    function onClick(e: MouseEvent) {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [searchOpen]);

  const bySlug = useMemo(() => {
    const m = new Map<string, SlimProduct>();
    for (const p of products) m.set(p.slug, p);
    return m;
  }, [products]);

  const selectedProducts = useMemo(
    () => selected.map((s) => bySlug.get(s)).filter(Boolean) as SlimProduct[],
    [selected, bySlug],
  );

  const searchMatches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    return products
      .filter((p) => !selected.includes(p.slug))
      .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, products, selected]);

  const suggestions = useMemo(() => {
    if (selectedProducts.length === 0 || selected.length >= MAX_SELECTED) return [];
    const flavors = new Set(selectedProducts.map((p) => p.flavorKey));
    const strengths = new Set(selectedProducts.map((p) => p.strengthKey));
    const avgPrice =
      selectedProducts.reduce((s, p) => s + (p.prices?.pack1 ?? 0), 0) / selectedProducts.length;
    return products
      .filter((p) => !selected.includes(p.slug) && p.imageUrl && (p.stock ?? 0) > 0)
      .filter((p) => {
        const price = p.prices?.pack1 ?? 0;
        const flavorMatch = flavors.has(p.flavorKey);
        const strengthMatch = strengths.has(p.strengthKey);
        const priceMatch = avgPrice > 0 && price > 0 && Math.abs(price - avgPrice) / avgPrice < 0.3;
        return flavorMatch || strengthMatch || priceMatch;
      })
      .sort((a, b) => (b.ratings ?? 0) - (a.ratings ?? 0))
      .slice(0, 6);
  }, [products, selected, selectedProducts]);

  const add = useCallback((slug: string) => {
    setSelected((prev) => {
      if (prev.length >= MAX_SELECTED || prev.includes(slug)) return prev;
      return [...prev, slug];
    });
    setQuery('');
    setSearchOpen(false);
  }, []);

  const remove = useCallback((slug: string) => {
    setSelected((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const inputDisabled = selected.length >= MAX_SELECTED;

  return (
    <>
      <div className="mb-6 max-w-md" ref={searchRef}>
        <label htmlFor="compare-search" className="mb-1.5 block text-sm font-medium text-foreground">
          Add a product
        </label>
        <input
          id="compare-search"
          type="text"
          autoComplete="off"
          value={query}
          disabled={inputDisabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(e.target.value.trim().length >= 2);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setSearchOpen(true);
          }}
          placeholder={inputDisabled ? 'Maximum 4 products selected' : 'Type a product name or brand...'}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {searchOpen && searchMatches.length > 0 && (
          <div className="mt-1 max-h-52 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
            {searchMatches.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => add(p.slug)}
                className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-left text-sm transition last:border-0 hover:bg-muted/50"
              >
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-muted/30" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.brand} · {p.nicotineContent ?? '-'}mg
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedProducts.map((p) => (
            <span
              key={p.slug}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {p.imageUrl && (
                <img src={p.imageUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
              )}
              {p.name}
              <button
                type="button"
                onClick={() => remove(p.slug)}
                aria-label={`Remove ${p.name}`}
                className="ml-0.5 text-muted-foreground transition hover:text-foreground"
              >
                &times;
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clear}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      {selectedProducts.length >= 2 ? (
        <div className="mb-8">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  <th className="w-28 px-4 py-3 text-left font-medium text-muted-foreground" />
                  {selectedProducts.map((p) => (
                    <th
                      key={p.slug}
                      className="min-w-[140px] px-4 py-3 text-center font-semibold text-foreground"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Image" products={selectedProducts}>
                  {(p) =>
                    p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="mx-auto h-16 w-16 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground/40">
                        -
                      </div>
                    )
                  }
                </CompareRow>
                <CompareRow label="Brand" products={selectedProducts}>
                  {(p) => (
                    <a href={`/brands/${p.brandSlug}`} className="text-primary hover:underline">
                      {p.brand}
                    </a>
                  )}
                </CompareRow>
                <CompareRow label="Nicotine" products={selectedProducts}>
                  {(p) => (
                    <>
                      <span className="font-semibold">{p.nicotineContent ?? '-'} mg</span>/pouch
                    </>
                  )}
                </CompareRow>
                <CompareRow label="Strength" products={selectedProducts}>
                  {(p) => <>{formatStrength(p.strengthKey)}</>}
                </CompareRow>
                <CompareRow label="Flavour" products={selectedProducts}>
                  {(p) => <>{formatFlavor(p.flavorKey)}</>}
                </CompareRow>
                <CompareRow label="Format" products={selectedProducts}>
                  {(p) => <>{formatFormat(p.formatKey)}</>}
                </CompareRow>
                <CompareRow label="Portions" products={selectedProducts}>
                  {(p) => <>{p.portionsPerCan ?? 20}/can</>}
                </CompareRow>
                <CompareRow label="Price (1 can)" products={selectedProducts}>
                  {(p) => (
                    <span className="font-bold text-foreground">
                      {tenant.currencyCode}{' '}
                      {p.prices?.pack1 ? p.prices.pack1.toFixed(2) : '-'}
                    </span>
                  )}
                </CompareRow>
                <CompareRow label="Rating" products={selectedProducts}>
                  {(p) => (
                    <>
                      {p.ratings && p.ratings > 0 ? `${p.ratings.toFixed(1)}/5` : 'No reviews'}
                    </>
                  )}
                </CompareRow>
                <CompareRow label="Stock" products={selectedProducts}>
                  {(p) =>
                    (p.stock ?? 0) > 0 ? (
                      <span className="font-medium text-primary">In Stock</span>
                    ) : (
                      <span className="text-destructive">Out of Stock</span>
                    )
                  }
                </CompareRow>
                <CompareRow label="" products={selectedProducts} last>
                  {(p) => (
                    <a
                      href={`/products/${p.slug}`}
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      View Product
                    </a>
                  )}
                </CompareRow>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Share this comparison:{' '}
            <a
              href={`/compare?products=${encodeURIComponent(selected.join(','))}`}
              className="text-primary hover:underline"
            >
              {siteHost}/compare?products={selected.join(',')}
            </a>
          </p>

          {suggestions.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                You might also want to compare
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {suggestions.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => add(p.slug)}
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-border bg-card/60 p-3 text-center transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-lg object-contain" />
                    )}
                    <div>
                      <p className="line-clamp-2 text-xs font-medium text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.brand} · {p.nicotineContent ?? '-'}mg
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-primary">+ Add to compare</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card/80 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Compare Products</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {selectedProducts.length === 1
              ? 'Add at least one more product to start comparing.'
              : 'Search and select 2-4 nicotine pouches above to see a detailed side-by-side comparison.'}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span>Compare by: strength</span>
            <span className="text-border">|</span>
            <span>flavour</span>
            <span className="text-border">|</span>
            <span>price</span>
            <span className="text-border">|</span>
            <span>format</span>
            <span className="text-border">|</span>
            <span>nicotine content</span>
            <span className="text-border">|</span>
            <span>rating</span>
          </div>
        </div>
      )}
    </>
  );
}

type CompareRowProps = {
  label: string;
  products: SlimProduct[];
  last?: boolean;
  children: (p: SlimProduct) => React.ReactNode;
};

function CompareRow({ label, products, last, children }: CompareRowProps) {
  return (
    <tr className={last ? '' : 'border-b border-border'}>
      <td className="px-4 py-3 text-xs font-medium text-muted-foreground">{label}</td>
      {products.map((p) => (
        <td key={p.slug} className="px-4 py-3 text-center text-foreground">
          {children(p)}
        </td>
      ))}
    </tr>
  );
}
