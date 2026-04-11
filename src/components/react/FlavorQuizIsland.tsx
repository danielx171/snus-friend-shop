import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { trackQuizCompleted } from '@/lib/analytics';
import { useAuthUser } from '@/hooks/useAuthUser';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/react/ProductCard';

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

const FLAVOR_FAMILIES: Record<string, string[]> = {
  mint: ['mint', 'peppermint', 'spearmint', 'menthol', 'wintergreen', 'ice', 'cool', 'frost'],
  berry: ['berry', 'blueberry', 'strawberry', 'raspberry', 'blackberry', 'mixed berry', 'wildberry', 'cranberry'],
  citrus: ['citrus', 'lemon', 'lime', 'orange', 'grapefruit', 'yuzu', 'bergamot'],
  coffee: ['coffee', 'espresso', 'mocha', 'cappuccino'],
  tropical: ['tropical', 'mango', 'pineapple', 'passionfruit', 'coconut', 'exotic', 'melon', 'watermelon'],
  sweet: ['vanilla', 'caramel', 'cola', 'candy', 'licorice'],
  tobacco: ['tobacco', 'original', 'classic'],
};

function flavorScore(product: { flavorKey: string; name: string }, selectedFlavors: string[]): number {
  let score = 0;
  const nameLower = product.name.toLowerCase();

  for (const sel of selectedFlavors) {
    // Direct flavorKey match = 3 points
    if (sel === product.flavorKey) { score += 3; continue; }

    // Flavor family match: user selected a specific flavor that belongs to a family matching the product's flavorKey
    for (const [familyKey, keywords] of Object.entries(FLAVOR_FAMILIES)) {
      if (keywords.includes(sel) && familyKey === product.flavorKey) {
        score += 2;
        break;
      }
    }

    // Product name contains the selected flavor keyword = 1 point
    if (nameLower.includes(sel.toLowerCase())) score += 1;
  }

  return score;
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

export default function FlavorQuizIsland({ products }: FlavorQuizIslandProps) {
  const [step, setStep] = useState(0);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedStrength, setSelectedStrength] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Auth for saving quiz results
  const { userId } = useAuthUser();
  const savedRef = useRef(false);

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
    // PostHog: track quiz completion
    trackQuizCompleted({
      flavors: selectedFlavors,
      strength: selectedStrength ?? 'none',
      resultCount: 0, // updated below once results compute
    });
  }, [selectedFlavors, selectedStrength]);

  const retake = useCallback(() => {
    setSelectedFlavors([]);
    setSelectedStrength(null);
    setEmail('');
    setEmailStatus('idle');
    savedRef.current = false;
    setStep(0);
  }, []);

  const strengthOption = STRENGTH_OPTIONS.find((o) => o.key === selectedStrength);
  const allowedStrengths = strengthOption?.strengths ?? [];

  const results = useMemo(() => {
    if (step !== 2) return [];

    const scored = products
      .filter(p => allowedStrengths.includes(p.strengthKey as any) && p.stock > 0)
      .map(p => ({ ...p, _score: flavorScore(p, selectedFlavors) }))
      .filter(p => p._score > 0)
      .sort((a, b) => b._score - a._score || b.ratings - a.ratings)
      .slice(0, 12);

    return scored;
  }, [step, products, selectedFlavors, allowedStrengths]);

  // Save quiz results to user_attributes when authenticated
  useEffect(() => {
    if (step !== 2 || !userId || savedRef.current) return;
    savedRef.current = true;

    const savePreferences = async () => {
      try {
        // Save flavor preferences
        if (selectedFlavors.length > 0) {
          await supabase.rpc('replace_user_attributes', {
            p_user_id: userId,
            p_attribute_key: 'flavor_preference',
            p_values: selectedFlavors,
          });
        }
        // Save strength preference
        if (selectedStrength) {
          await supabase.rpc('replace_user_attributes', {
            p_user_id: userId,
            p_attribute_key: 'strength_preference',
            p_values: [selectedStrength],
          });
        }
      } catch (err) {
        console.error('[FlavorQuiz] Failed to save quiz preferences:', err);
      }
    };

    savePreferences();
  }, [step, userId, selectedFlavors, selectedStrength]);

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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
              {results.slice(0, 5).map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  name={p.name}
                  brand={p.brand}
                  brandSlug={p.brandSlug}
                  imageUrl={p.imageUrl}
                  prices={p.prices}
                  stock={p.stock}
                  nicotineContent={p.nicotineContent}
                  strengthKey={p.strengthKey}
                  flavorKey={p.flavorKey}
                  ratings={p.ratings}
                  badgeKeys={[]}
                />
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
                  aria-label="Email address"
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
