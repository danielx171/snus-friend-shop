import React, { useState, useCallback, useMemo } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { cartToast } from '@/lib/toast';
import type { Product } from '@/data/products';

interface QuizProduct {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  flavorKey: string;
  strengthKey: string;
  ratings: number;
  nicotineContent: number;
}

interface FlavorQuizIslandProps {
  products: QuizProduct[];
}

const FLAVOR_OPTIONS = [
  { key: 'mint', label: 'Mint', emoji: '\u{1F33F}' },
  { key: 'berry', label: 'Berry', emoji: '\u{1FAD0}' },
  { key: 'citrus', label: 'Citrus', emoji: '\u{1F34B}' },
  { key: 'coffee', label: 'Coffee', emoji: '\u2615' },
  { key: 'tobacco', label: 'Tobacco', emoji: '\u{1F343}' },
  { key: 'sweet', label: 'Sweet', emoji: '\u{1F36C}' },
  { key: 'exotic', label: 'Exotic', emoji: '\u{1F334}' },
] as const;

const STRENGTH_OPTIONS = [
  {
    key: 'beginner',
    label: 'New to nicotine',
    description: 'Light and gentle — perfect for trying nicotine pouches for the first time.',
    strengths: ['light'],
  },
  {
    key: 'casual',
    label: 'Casual',
    description: 'A mild, everyday experience with moderate nicotine.',
    strengths: ['normal'],
  },
  {
    key: 'regular',
    label: 'Regular',
    description: 'A satisfying kick for those who use nicotine pouches regularly.',
    strengths: ['strong'],
  },
  {
    key: 'experienced',
    label: 'Experienced',
    description: 'Maximum intensity for seasoned users who want the strongest hit.',
    strengths: ['extra-strong', 'super-strong'],
  },
] as const;

const strengthMap: Record<string, number> = {
  light: 1,
  normal: 2,
  strong: 3,
  'extra-strong': 4,
  'super-strong': 5,
};

function StrengthIndicator({ strengthKey }: { strengthKey: string }) {
  const level = strengthMap[strengthKey] ?? 2;
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Strength ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i < level ? 'bg-primary' : 'bg-muted-foreground/25'
          }`}
        />
      ))}
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i < step
              ? 'w-10 bg-primary'
              : i === step
                ? 'w-10 bg-primary/50'
                : 'w-6 bg-muted-foreground/20'
          }`}
        />
      ))}
    </div>
  );
}

const ResultCard = React.memo<{ p: QuizProduct; selectedFlavors: string[] }>(
  function ResultCard({ p, selectedFlavors }) {
    const isOutOfStock = p.stock === 0;
    const displayPrice = p.prices.pack1;

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        const product: Product = {
          id: p.slug,
          name: p.name,
          brand: p.brand,
          categoryKey: 'nicotinePouches',
          flavorKey: p.flavorKey as Product['flavorKey'],
          strengthKey: p.strengthKey as Product['strengthKey'],
          formatKey: 'slim',
          nicotineContent: p.nicotineContent,
          portionsPerCan: 20,
          descriptionKey: '',
          image: p.imageUrl,
          ratings: p.ratings,
          badgeKeys: [] as Product['badgeKeys'],
          prices: p.prices as Product['prices'],
          manufacturer: p.brand,
          stock: p.stock,
        };

        addToCart(product, 'pack1');
        openCart();
        cartToast(p.name);
      },
      [p, isOutOfStock],
    );

    const isFlavorMatch = selectedFlavors.includes(p.flavorKey);

    return (
      <a
        href={`/products/${p.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-xl bg-card/60 backdrop-blur-sm border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/30"
      >
        {isFlavorMatch && (
          <div className="absolute top-2 left-2 z-10">
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              Flavour Match
            </span>
          </div>
        )}

        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={`${p.name} by ${p.brand}`}
              width={300}
              height={300}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                className="h-16 w-16 text-muted-foreground/40"
                aria-hidden="true"
              >
                <ellipse cx="32" cy="32" rx="28" ry="10" stroke="currentColor" strokeWidth="2" />
                <ellipse cx="32" cy="28" rx="28" ry="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
                <path d="M4 28v4c0 5.523 12.536 10 28 10s28-4.477 28-10v-4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <span className="text-xs text-muted-foreground">{p.brand}</span>
          <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">{p.name}</h3>

          <div className="flex items-center gap-2">
            <StrengthIndicator strengthKey={p.strengthKey} />
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {p.flavorKey}
            </span>
          </div>

          <span className="text-xs text-muted-foreground">{p.nicotineContent} mg/portion</span>

          <div className="mt-auto flex items-end justify-between pt-2">
            <span className="text-lg font-bold text-foreground">
              &euro;{displayPrice?.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={isOutOfStock ? `Sold Out \u2013 ${p.name}` : `Add to Cart \u2013 ${p.name}`}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </a>
    );
  },
);

export default function FlavorQuizIsland({ products }: FlavorQuizIslandProps) {
  const [step, setStep] = useState(0);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedStrength, setSelectedStrength] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const toggleFlavor = useCallback((key: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  }, []);

  const selectStrength = useCallback((key: string) => {
    setSelectedStrength(key);
  }, []);

  const goToResults = useCallback(() => {
    setStep(2);
  }, []);

  const retake = useCallback(() => {
    setSelectedFlavors([]);
    setSelectedStrength(null);
    setEmail('');
    setEmailStatus('idle');
    setStep(0);
  }, []);

  const strengthOption = STRENGTH_OPTIONS.find((o) => o.key === selectedStrength);
  const allowedStrengths = strengthOption?.strengths ?? [];

  const results = useMemo(() => {
    if (step !== 2) return [];

    const filtered = products.filter((p) => {
      const flavorMatch = selectedFlavors.includes(p.flavorKey);
      const strengthMatch = allowedStrengths.includes(p.strengthKey as any);
      return flavorMatch && strengthMatch;
    });

    // Sort: more flavor matches first (for future multi-match), then by ratings
    filtered.sort((a, b) => {
      const aMatch = selectedFlavors.includes(a.flavorKey) ? 1 : 0;
      const bMatch = selectedFlavors.includes(b.flavorKey) ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
      return b.ratings - a.ratings;
    });

    return filtered.slice(0, 8);
  }, [step, products, selectedFlavors, allowedStrengths]);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

      setEmailStatus('sending');
      try {
        const supabaseUrl =
          (import.meta as any).env?.PUBLIC_SUPABASE_URL ||
          (import.meta as any).env?.VITE_SUPABASE_URL;
        const res = await fetch(`${supabaseUrl}/functions/v1/save-waitlist-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed, source: 'quiz' }),
        });
        if (res.ok) {
          setEmailStatus('sent');
        } else {
          setEmailStatus('error');
        }
      } catch {
        setEmailStatus('error');
      }
    },
    [email],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ProgressBar step={step} total={3} />

      {/* Step 1: Flavour Selection */}
      {step === 0 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              What flavours do you enjoy?
            </h2>
            <p className="text-muted-foreground">
              Pick one or more flavour profiles you love. We'll match you with our best products.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {FLAVOR_OPTIONS.map((flavor) => {
              const isSelected = selectedFlavors.includes(flavor.key);
              return (
                <button
                  key={flavor.key}
                  type="button"
                  onClick={() => toggleFlavor(flavor.key)}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                      : 'border-border bg-card/60 hover:border-primary/40 hover:bg-card/80'
                  }`}
                >
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {flavor.emoji}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {flavor.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              disabled={selectedFlavors.length === 0}
              onClick={() => setStep(1)}
              className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Strength Selection */}
      {step === 1 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              What nicotine strength do you prefer?
            </h2>
            <p className="text-muted-foreground">
              Choose the intensity level that matches your experience.
            </p>
          </div>

          <div className="grid gap-3 mb-8">
            {STRENGTH_OPTIONS.map((option) => {
              const isSelected = selectedStrength === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => selectStrength(option.key)}
                  aria-pressed={isSelected}
                  className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                      : 'border-border bg-card/60 hover:border-primary/40 hover:bg-card/80'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-base font-semibold ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {option.label}
                    </span>
                    <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-lg border border-border bg-card/60 px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-card"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!selectedStrength}
              onClick={goToResults}
              className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              See My Results
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 2 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your personalised picks
            </h2>
            <p className="text-muted-foreground">
              Based on your preferences, here are the products we think you'll love.
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
              {results.map((p) => (
                <ResultCard key={p.slug} p={p} selectedFlavors={selectedFlavors} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card/60 p-8 text-center mb-10">
              <p className="text-muted-foreground mb-4">
                No exact matches found for your combination. Try different flavours or a different
                strength level.
              </p>
            </div>
          )}

          {/* Email Capture */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
              Save your results
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Enter your email and we'll send you personalised recommendations and exclusive deals.
            </p>
            {emailStatus === 'sent' ? (
              <p className="text-sm font-semibold text-primary text-center">
                Thanks! We'll be in touch.
              </p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={emailStatus === 'sending'}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {emailStatus === 'sending' ? 'Saving...' : 'Subscribe'}
                </button>
              </form>
            )}
            {emailStatus === 'error' && (
              <p className="text-sm text-destructive text-center mt-2">
                Something went wrong. Please try again.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={retake}
              className="rounded-lg border border-border bg-card/60 px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-card"
            >
              Retake Quiz
            </button>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Browse All Products
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
