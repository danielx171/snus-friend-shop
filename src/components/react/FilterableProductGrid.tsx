import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ProductCard from './ProductCard';
import {
  filterProducts,
  type SearchableProduct,
  type FilterState,
  type SortOption,
} from '@/lib/search';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterableProductGridProps {
  productsJson?: string;
  productsJsonUrl?: string;
  initialFilters?: string;
}

interface FilterGroup {
  key: keyof Omit<FilterState, 'sort'>;
  label: string;
  options: { value: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Display maps
// ---------------------------------------------------------------------------

const STRENGTH_LABELS: Record<string, string> = {
  light: 'Light',
  normal: 'Normal',
  strong: 'Strong',
  'extra-strong': 'Extra Strong',
  'super-strong': 'Super Strong',
};

const FLAVOR_LABELS: Record<string, string> = {
  mint: 'Mint',
  fruit: 'Fruit',
  berry: 'Berry',
  citrus: 'Citrus',
  licorice: 'Licorice',
  coffee: 'Coffee',
  cola: 'Cola',
  vanilla: 'Vanilla',
  tropical: 'Tropical',
  tobacco: 'Tobacco',
};

const FORMAT_LABELS: Record<string, string> = {
  slim: 'Slim',
  mini: 'Mini',
  original: 'Regular',
  large: 'Large',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'strength', label: 'Strength' },
  { value: 'name-asc', label: 'Name: A\u2013Z' },
  { value: 'newest', label: 'Newest' },
];

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

function filtersFromURL(): Partial<FilterState> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const partial: Partial<FilterState> = {};

  const brands = params.get('brand');
  if (brands) partial.brands = brands.split(',').filter(Boolean);

  const strengths = params.get('strength');
  if (strengths) partial.strengths = strengths.split(',').filter(Boolean);

  const flavors = params.get('flavor');
  if (flavors) partial.flavors = flavors.split(',').filter(Boolean);

  const formats = params.get('format');
  if (formats) partial.formats = formats.split(',').filter(Boolean);

  const sort = params.get('sort');
  if (sort && SORT_OPTIONS.some((o) => o.value === sort)) {
    partial.sort = sort as SortOption;
  }

  return partial;
}

function filtersToURL(filters: FilterState): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();

  if (filters.brands.length > 0) params.set('brand', filters.brands.join(','));
  if (filters.strengths.length > 0) params.set('strength', filters.strengths.join(','));
  if (filters.flavors.length > 0) params.set('flavor', filters.flavors.join(','));
  if (filters.formats.length > 0) params.set('format', filters.formats.join(','));
  if (filters.sort !== 'featured') params.set('sort', filters.sort);

  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

// ---------------------------------------------------------------------------
// Default filter state factory
// ---------------------------------------------------------------------------

function defaultFilters(initial?: Partial<FilterState>): FilterState {
  const fromUrl = filtersFromURL();
  return {
    brands: fromUrl.brands ?? initial?.brands ?? [],
    strengths: fromUrl.strengths ?? initial?.strengths ?? [],
    flavors: fromUrl.flavors ?? initial?.flavors ?? [],
    formats: fromUrl.formats ?? initial?.formats ?? [],
    sort: fromUrl.sort ?? initial?.sort ?? 'featured',
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const CollapsibleFilterGroup = React.memo<{
  label: string;
  children: React.ReactNode;
}>(function CollapsibleFilterGroup({ label, children }) {
  const [open, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  return (
    <div className="border-b border-border pb-3">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground"
        aria-expanded={open}
      >
        {label}
        <svg
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-1.5 pt-1">{children}</div>}
    </div>
  );
});

const FilterCheckbox = React.memo<{
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}>(function FilterCheckbox({ value, label, checked, onChange }) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(value, e.target.checked);
    },
    [value, onChange],
  );

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/80 hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 rounded border-border accent-primary"
      />
      {label}
    </label>
  );
});

// ---------------------------------------------------------------------------
// Sidebar content (shared between desktop and mobile)
// ---------------------------------------------------------------------------

function FilterSidebarContent({
  filterGroups,
  filters,
  onToggle,
}: {
  filterGroups: FilterGroup[];
  filters: FilterState;
  onToggle: (group: keyof Omit<FilterState, 'sort'>, value: string, checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {filterGroups.map((group) => (
        <CollapsibleFilterGroup key={group.key} label={group.label}>
          {group.options.map((opt) => {
            const selected = filters[group.key] as string[];
            return (
              <FilterCheckbox
                key={opt.value}
                value={opt.value}
                label={opt.label}
                checked={selected.includes(opt.value)}
                onChange={(val, checked) => onToggle(group.key, val, checked)}
              />
            );
          })}
        </CollapsibleFilterGroup>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active filter chips
// ---------------------------------------------------------------------------

function ActiveFilterChips({
  filters,
  filterGroups,
  onRemove,
  onClearAll,
}: {
  filters: FilterState;
  filterGroups: FilterGroup[];
  onRemove: (group: keyof Omit<FilterState, 'sort'>, value: string) => void;
  onClearAll: () => void;
}) {
  const chips: { group: keyof Omit<FilterState, 'sort'>; value: string; label: string }[] = [];

  for (const fg of filterGroups) {
    const selected = filters[fg.key] as string[];
    for (const val of selected) {
      const opt = fg.options.find((o) => o.value === val);
      chips.push({ group: fg.key, value: val, label: opt?.label ?? val });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.group}-${chip.value}`}
          type="button"
          onClick={() => onRemove(chip.group, chip.value)}
          className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground transition-colors hover:bg-secondary/80"
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-muted-foreground underline hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile filter sheet (simple overlay)
// ---------------------------------------------------------------------------

function MobileFilterSheet({
  open,
  onClose,
  activeCount,
  filterGroups,
  filters,
  onToggle,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  activeCount: number;
  filterGroups: FilterGroup[];
  filters: FilterState;
  onToggle: (group: keyof Omit<FilterState, 'sort'>, value: string, checked: boolean) => void;
  onClearAll: () => void;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Panel sliding up from bottom */}
      <div className="relative mt-auto flex max-h-[85vh] flex-col rounded-t-2xl bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </h2>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-muted-foreground underline hover:text-foreground"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter content */}
        <div className="overflow-y-auto px-4 py-3">
          <FilterSidebarContent filterGroups={filterGroups} filters={filters} onToggle={onToggle} />
        </div>

        {/* Done button */}
        <div className="border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FilterableProductGrid({
  productsJson,
  productsJsonUrl,
  initialFilters,
}: FilterableProductGridProps) {
  // Products state — loaded from inline JSON or fetched from URL
  const [fetchedProducts, setFetchedProducts] = useState<SearchableProduct[]>([]);
  const [loading, setLoading] = useState(!!productsJsonUrl);

  // Parse inline products if provided
  const inlineProducts = useMemo<SearchableProduct[]>(() => {
    if (!productsJson) return [];
    try {
      return JSON.parse(productsJson);
    } catch {
      return [];
    }
  }, [productsJson]);

  // Fetch from URL if no inline data
  useEffect(() => {
    if (!productsJsonUrl || productsJson) return;
    fetch(productsJsonUrl)
      .then((r) => r.json())
      .then((data) => {
        setFetchedProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productsJsonUrl, productsJson]);

  const allProducts = productsJson ? inlineProducts : fetchedProducts;

  // Parse optional initial filters prop
  const parsedInitial = useMemo<Partial<FilterState> | undefined>(() => {
    if (!initialFilters) return undefined;
    try {
      return JSON.parse(initialFilters);
    } catch {
      return undefined;
    }
  }, [initialFilters]);

  // Filter state — URL params take precedence over initialFilters prop
  const [filters, setFilters] = useState<FilterState>(() => defaultFilters(parsedInitial));

  // Mobile sheet
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Build filter groups from product data
  const filterGroups = useMemo<FilterGroup[]>(() => {
    // Extract unique brands sorted alphabetically
    const brandSet = new Map<string, string>();
    for (const p of allProducts) {
      if (!brandSet.has(p.brandSlug)) {
        brandSet.set(p.brandSlug, p.brand);
      }
    }
    const brandOptions = Array.from(brandSet.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }));

    // Fixed strength options in order
    const strengthOptions = [
      { value: 'light', label: STRENGTH_LABELS.light },
      { value: 'normal', label: STRENGTH_LABELS.normal },
      { value: 'strong', label: STRENGTH_LABELS.strong },
      { value: 'extra-strong', label: STRENGTH_LABELS['extra-strong'] },
      { value: 'super-strong', label: STRENGTH_LABELS['super-strong'] },
    ];

    // Fixed flavor options
    const flavorOptions = Object.entries(FLAVOR_LABELS).map(([value, label]) => ({
      value,
      label,
    }));

    // Fixed format options
    const formatOptions = Object.entries(FORMAT_LABELS).map(([value, label]) => ({
      value,
      label,
    }));

    return [
      { key: 'brands' as const, label: 'Brand', options: brandOptions },
      { key: 'strengths' as const, label: 'Strength', options: strengthOptions },
      { key: 'flavors' as const, label: 'Flavor', options: flavorOptions },
      { key: 'formats' as const, label: 'Format', options: formatOptions },
    ];
  }, [allProducts]);

  // Sync filters to URL whenever they change
  useEffect(() => {
    filtersToURL(filters);
  }, [filters]);

  // Scroll position memory — restore saved position after products load
  useEffect(() => {
    if (loading || allProducts.length === 0) return;
    const key = 'scroll_products';
    const saved = sessionStorage.getItem(key);
    if (saved) {
      sessionStorage.removeItem(key);
      // Delay to ensure grid has rendered
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(saved, 10));
      });
    }
  }, [loading, allProducts.length]);

  // Save scroll position when clicking any product link
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href*="/products/"]');
      if (link && link.getAttribute('href')?.startsWith('/products/')) {
        sessionStorage.setItem('scroll_products', String(window.scrollY));
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  // Toggle a single filter value
  const handleToggle = useCallback(
    (group: keyof Omit<FilterState, 'sort'>, value: string, checked: boolean) => {
      setFilters((prev) => {
        const current = prev[group] as string[];
        const next = checked
          ? [...current, value]
          : current.filter((v) => v !== value);
        return { ...prev, [group]: next };
      });
    },
    [],
  );

  // Remove a single filter chip
  const handleRemoveChip = useCallback(
    (group: keyof Omit<FilterState, 'sort'>, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [group]: (prev[group] as string[]).filter((v) => v !== value),
      }));
    },
    [],
  );

  // Clear all filters
  const handleClearAll = useCallback(() => {
    setFilters({
      brands: [],
      strengths: [],
      flavors: [],
      formats: [],
      sort: filters.sort, // keep sort when clearing filters
    });
  }, [filters.sort]);

  // Sort change
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value as SortOption }));
  }, []);

  // Filtered products
  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters),
    [allProducts, filters],
  );

  // Pagination — show 24 products initially, load more on click
  const ITEMS_PER_PAGE = 24;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filters]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );

  const hasMore = visibleCount < filteredProducts.length;

  const showMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  // Active filter count (excluding sort)
  const activeCount = filters.brands.length + filters.strengths.length + filters.flavors.length + filters.formats.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: mobile filter button + sort + count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Mobile filter button */}
        <button
          type="button"
          onClick={openMobile}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground lg:hidden"
          aria-label="Open filters"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>

        {/* Product count */}
        <span className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {allProducts.length} cans
        </span>

        {/* Sort dropdown */}
        <select
          value={filters.sort}
          onChange={handleSortChange}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active filter chips */}
      <ActiveFilterChips
        filters={filters}
        filterGroups={filterGroups}
        onRemove={handleRemoveChip}
        onClearAll={handleClearAll}
      />

      {/* Desktop: sidebar + grid */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-[240px] shrink-0 lg:block" aria-label="Product filters">
          <div className="sticky top-24 rounded-xl border border-border bg-card/40 p-4">
            <FilterSidebarContent
              filterGroups={filterGroups}
              filters={filters}
              onToggle={handleToggle}
            />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3" role="status" aria-label="Loading products">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/50 p-4">
                  <div className="mb-3 aspect-square rounded-lg bg-muted/30 animate-pulse" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-muted/30 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted/30 animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <svg className="h-12 w-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-base text-muted-foreground">No products match your filters</p>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {visibleProducts.map((product) => (
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
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={showMore}
                    className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-card/80 hover:border-primary/30"
                  >
                    Show More ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <MobileFilterSheet
        open={mobileOpen}
        onClose={closeMobile}
        activeCount={activeCount}
        filterGroups={filterGroups}
        filters={filters}
        onToggle={handleToggle}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
