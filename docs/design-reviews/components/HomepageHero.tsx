/**
 * HomepageHero.tsx
 *
 * Design Reference Component — SnusFriend Homepage Hero
 * Implements: Theme B "Clean Ritual" (Light Minimal)
 *
 * Created: 2026-03-27
 * Design philosophy: ritual.com-inspired, premium trust, generous whitespace
 * Color tokens: Off-white (#FAFAF8), Teal (#0F6E56), Charcoal (#1A1A2E)
 * Typography: Cabinet Grotesk (headings), Plus Jakarta Sans (body)
 *
 * Features:
 * - Off-white background with generous spacing (Ritual-level breathing room)
 * - Compelling headline + subheading
 * - Search bar with teal accent
 * - Trust bar with icons (brands, shipping, rewards)
 * - 3-card category discovery grid with color accents
 * - "View All Best Sellers" CTA link
 * - Full responsive design (mobile-first)
 *
 * Dependencies:
 * - React 18
 * - TypeScript
 * - Tailwind v4
 * - Icons: lucide-react (Search, Truck, Gift, Sparkles, etc.)
 *
 * Not production code — a design reference showing how Theme B patterns
 * apply to the homepage hero section.
 */

import React, { useState } from 'react';
import { Search, Truck, Gift, Sparkles, ArrowRight, Leaf } from 'lucide-react';

interface HomepageHeroProps {
  onSearchSubmit?: (query: string) => void;
  onCategoryClick?: (category: string) => void;
  onDiscoverClick?: () => void;
}

const HomepageHero: React.FC<HomepageHeroProps> = ({
  onSearchSubmit,
  onCategoryClick,
  onDiscoverClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  const trustItems = [
    {
      icon: Sparkles,
      label: '139 Brands',
      description: 'Carefully curated',
    },
    {
      icon: Truck,
      label: 'Same-Day Shipping',
      description: 'Fast & reliable',
    },
    {
      icon: Gift,
      label: 'Rewards Program',
      description: 'Earn points',
    },
  ];

  const categories = [
    {
      title: 'Fruit Flavors',
      description: 'Tropical, berry & citrus blends',
      color: 'from-orange-300/20 to-orange-400/20',
      accentColor: '#FB923C',
      icon: Leaf,
      bgRing: 'ring-orange-200/40',
    },
    {
      title: 'Strong Pouches',
      description: '15mg+ nicotine strength',
      color: 'from-red-300/20 to-red-400/20',
      accentColor: '#EF4444',
      icon: Sparkles,
      bgRing: 'ring-red-200/40',
    },
    {
      title: 'New Arrivals',
      description: 'Just added to our collection',
      color: 'from-teal-300/20 to-teal-400/20',
      accentColor: '#0F6E56',
      icon: ArrowRight,
      bgRing: 'ring-teal-200/40',
    },
  ];

  return (
    <section className="min-h-screen bg-white" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Main hero container — generous spacing */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 lg:pb-32">
        {/* Headline — Cabinet Grotesk-inspired (using font-bold as fallback) */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6"
            style={{
              color: '#1A1A2E',
              fontFamily: 'Cabinet Grotesk, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            Discover 2200+ Premium Pouches
          </h1>

          {/* Subheading — Plus Jakarta Sans */}
          <p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            style={{
              color: '#4A4A5A',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 400,
              lineHeight: '1.6',
            }}
          >
            Europe's friendliest nicotine pouch marketplace. 139 brands, instant delivery, rewards
            program.
          </p>
        </div>

        {/* Search bar — teal accent on focus */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-12 sm:mb-16 lg:mb-20 max-w-xl mx-auto"
        >
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, flavor, or strength..."
              className="w-full px-5 py-4 pr-14 rounded-lg border-2 text-gray-900 placeholder-gray-400 transition-all duration-200"
              style={{
                borderColor: '#E5E5E0',
                backgroundColor: '#FFFFFF',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0F6E56')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E5E0')}
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              aria-label="Search products"
              style={{ color: '#0F6E56' }}
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Trust bar — 3 columns with icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24 lg:mb-32 py-8 sm:py-12 border-y-2" style={{ borderColor: '#E5E5E0' }}>
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: 'rgba(15, 110, 86, 0.08)' }}
                >
                  <Icon size={24} style={{ color: '#0F6E56' }} />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{
                      color: '#1A1A2E',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: '#8A8A9A',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category discovery cards — 3-card row */}
        <div className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onCategoryClick?.(cat.title)}
                  className={`p-6 sm:p-8 rounded-lg border-2 ring-2 transition-all duration-200 text-left hover:shadow-md group`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: cat.accentColor,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `${cat.accentColor}15`,
                      }}
                    >
                      <Icon size={24} style={{ color: cat.accentColor }} />
                    </div>
                  </div>

                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{
                      color: '#1A1A2E',
                      fontFamily: 'Cabinet Grotesk, sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {cat.title}
                  </h3>

                  <p
                    className="text-sm mb-4"
                    style={{
                      color: '#4A4A5A',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {cat.description}
                  </p>

                  <div className="flex items-center text-sm font-medium" style={{ color: cat.accentColor }}>
                    Explore
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Link — "View All Best Sellers" */}
        <div className="text-center">
          <button
            onClick={onDiscoverClick}
            className="inline-flex items-center text-base font-semibold transition-all duration-200 hover:gap-3"
            style={{
              color: '#0F6E56',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            View All Best Sellers
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
