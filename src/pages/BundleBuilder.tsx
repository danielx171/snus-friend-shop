import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/data/products';
import { Package, Search, X, ShoppingCart, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Bundle size tiers with discount %
const BUNDLE_TIERS = [
  { count: 3, discountPct: 5, label: '3-Pack', sublabel: '5% off' },
  { count: 5, discountPct: 10, label: '5-Pack', sublabel: '10% off' },
  { count: 10, discountPct: 15, label: '10-Pack', sublabel: '15% off' },
] as const;

type BundleTier = (typeof BUNDLE_TIERS)[number];

function ProductPlaceholderIcon() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-muted rounded-lg">
      <Package className="w-8 h-8 text-muted-foreground" />
    </div>
  );
}

interface MiniProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  disabled: boolean;
  alreadyAdded: boolean;
}

const MiniProductCard = React.memo(function MiniProductCard({
  product,
  onAdd,
  disabled,
  alreadyAdded,
}: MiniProductCardProps) {
  const handleAdd = useCallback(() => onAdd(product), [onAdd, product]);
  const price = product.prices.pack1;

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-2 rounded-xl border bg-card p-3 transition-all duration-150',
        alreadyAdded
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-card/80',
        disabled && !alreadyAdded && 'opacity-50'
      )}
    >
      {/* Product image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProductPlaceholderIcon />
        )}
        {alreadyAdded && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
        <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
          {product.name}
        </p>
        <p className="text-sm font-semibold text-primary mt-0.5">
          €{price.toFixed(2)}
        </p>
      </div>

      {/* Add button */}
      <Button
        size="sm"
        variant={alreadyAdded ? 'secondary' : 'default'}
        disabled={disabled && !alreadyAdded}
        onClick={handleAdd}
        aria-label={`Add ${product.name} to bundle`}
        className="w-full text-xs h-8 mt-auto"
      >
        {alreadyAdded ? (
          <>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Added
          </>
        ) : (
          <>
            <Plus className="w-3 h-3 mr-1" />
            Add to Bundle
          </>
        )}
      </Button>
    </div>
  );
});

interface BundleSlotProps {
  index: number;
  product: Product | null;
  onRemove: (index: number) => void;
}

const BundleSlot = React.memo(function BundleSlot({
  index,
  product,
  onRemove,
}: BundleSlotProps) {
  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 bg-card/30 p-4 aspect-square">
        <Package className="w-8 h-8 text-muted-foreground/40" />
        <span className="text-xs text-muted-foreground/60 font-medium">
          Slot {index + 1}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-2 rounded-xl border border-primary/40 bg-primary/5 p-3">
      {/* Remove button */}
      <button
        onClick={handleRemove}
        aria-label={`Remove ${product.name} from bundle slot ${index + 1}`}
        className="absolute top-2 right-2 z-10 flex items-center justify-center w-5 h-5 rounded-full bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Image */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <ProductPlaceholderIcon />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
        <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
          {product.name}
        </p>
        <p className="text-xs font-semibold text-primary mt-0.5">
          €{product.prices.pack1.toFixed(2)}
        </p>
      </div>
    </div>
  );
});

export default function BundleBuilder() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { data: allProducts = [], isLoading } = useCatalogProducts();

  const [selectedTier, setSelectedTier] = useState<BundleTier>(BUNDLE_TIERS[0]);
  const [bundleSlots, setBundleSlots] = useState<(Product | null)[]>([null, null, null]);
  const [searchQuery, setSearchQuery] = useState('');

  // When tier changes, resize the slots array
  const handleTierSelect = useCallback(
    (tier: BundleTier) => {
      setSelectedTier(tier);
      setBundleSlots((prev) => {
        if (tier.count > prev.length) {
          return [...prev, ...Array(tier.count - prev.length).fill(null)];
        }
        return prev.slice(0, tier.count);
      });
    },
    []
  );

  // Filtered product list
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [allProducts, searchQuery]);

  const filledCount = bundleSlots.filter(Boolean).length;
  const isFull = filledCount === selectedTier.count;

  const addProductToBundle = useCallback((product: Product) => {
    setBundleSlots((prev) => {
      // If already in bundle, remove it (toggle off)
      const existingIdx = prev.findIndex((s) => s?.id === product.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = null;
        return updated;
      }
      // Find first empty slot
      const emptyIdx = prev.findIndex((s) => s === null);
      if (emptyIdx === -1) return prev; // full, ignore
      const updated = [...prev];
      updated[emptyIdx] = product;
      return updated;
    });
  }, []);

  const removeFromSlot = useCallback((index: number) => {
    setBundleSlots((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  }, []);

  // Pricing calculations
  const originalTotal = useMemo(
    () =>
      bundleSlots.reduce((sum, p) => sum + (p ? p.prices.pack1 : 0), 0),
    [bundleSlots]
  );
  const discountMultiplier = (100 - selectedTier.discountPct) / 100;
  const discountAmount = +(originalTotal * (selectedTier.discountPct / 100)).toFixed(2);
  const finalTotal = +(originalTotal * discountMultiplier).toFixed(2);

  const addedProductIds = useMemo(
    () => new Set(bundleSlots.filter(Boolean).map((p) => p!.id)),
    [bundleSlots]
  );

  const handleAddToCart = useCallback(() => {
    const filledSlots = bundleSlots.filter((p): p is Product => p !== null);
    if (filledSlots.length !== selectedTier.count) return;

    filledSlots.forEach((product) => {
      addToCart(product, 'pack1', 1);
    });

    toast({
      title: 'Bundle added to cart!',
      description: `${selectedTier.count} items with ${selectedTier.discountPct}% off — saving €${discountAmount.toFixed(2)}.`,
    });

    navigate('/cart');
  }, [bundleSlots, selectedTier, addToCart, toast, navigate, discountAmount]);

  return (
    <Layout>
      <SEO
        title="Bundle Builder | SnusFriend"
        description="Build your own custom nicotine pouch bundle and save up to 15%. Mix and match from 700+ products."
        metaRobots="index,follow"
      />

      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Bundle Builder
          </h1>
          <p className="text-muted-foreground text-base">
            Mix and match your favourite nicotine pouches and save with volume discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Step 1 + Step 2 */}
          <div className="lg:col-span-2 space-y-8">

            {/* Step 1: Choose bundle size */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                Choose Bundle Size
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {BUNDLE_TIERS.map((tier) => {
                  const isSelected = selectedTier.count === tier.count;
                  return (
                    <button
                      key={tier.count}
                      onClick={() => handleTierSelect(tier)}
                      aria-pressed={isSelected}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all duration-150 cursor-pointer select-none',
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
                      )}
                    >
                      <span className="text-2xl font-bold text-foreground">
                        {tier.count}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {tier.label}
                      </span>
                      <Badge
                        variant={isSelected ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {tier.sublabel}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Browse products */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                Browse Products
                {filledCount > 0 && (
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {filledCount} / {selectedTier.count} selected
                  </span>
                )}
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search by name or brand…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Product grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-card p-3 animate-pulse"
                    >
                      <div className="aspect-square w-full rounded-lg bg-muted mb-2" />
                      <div className="h-3 bg-muted rounded mb-1 w-2/3" />
                      <div className="h-4 bg-muted rounded mb-2 w-full" />
                      <div className="h-8 bg-muted rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery('')}
                    className="mt-1"
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredProducts.map((product) => (
                    <MiniProductCard
                      key={product.id}
                      product={product}
                      onAdd={addProductToBundle}
                      disabled={isFull}
                      alreadyAdded={addedProductIds.has(product.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column: Bundle slots + summary */}
          <div className="space-y-6">
            {/* Step 3: Bundle slots */}
            <section className="rounded-2xl border border-border bg-card p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                Your Bundle
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {filledCount}/{selectedTier.count}
                </span>
              </h2>

              {/* Slot grid */}
              <div
                className={cn(
                  'grid gap-3 mb-6',
                  selectedTier.count <= 3 ? 'grid-cols-3' :
                  selectedTier.count <= 5 ? 'grid-cols-3' :
                  'grid-cols-4'
                )}
              >
                {bundleSlots.map((product, i) => (
                  <BundleSlot
                    key={i}
                    index={i}
                    product={product}
                    onRemove={removeFromSlot}
                  />
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 border-t border-border pt-4 mb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Original total</span>
                  <span>€{originalTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-green-500 font-medium">
                  <span>Bundle discount ({selectedTier.discountPct}%)</span>
                  <span>− €{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-foreground border-t border-border pt-2 mt-2">
                  <span>Final price</span>
                  <span className="text-primary">€{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress hint */}
              {!isFull && (
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Add {selectedTier.count - filledCount} more product{selectedTier.count - filledCount !== 1 ? 's' : ''} to complete your bundle
                </p>
              )}

              {/* Add to cart */}
              <Button
                className="w-full"
                size="lg"
                disabled={!isFull}
                onClick={handleAddToCart}
                aria-label={`Add ${selectedTier.count}-pack bundle to cart`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isFull ? 'Add Bundle to Cart' : `Fill ${selectedTier.count - filledCount} More Slot${selectedTier.count - filledCount !== 1 ? 's' : ''}`}
              </Button>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
