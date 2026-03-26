import { useState, useMemo } from 'react';

import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { useBrands, brandAccentColor, type Brand } from '@/hooks/useBrands';
import { Input } from '@/components/ui/input';


import { SITE_URL } from '@/config/brand';

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Brands', item: `${SITE_URL}/brands` },
  ],
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function BrandsIndex() {
  const { brands, topBrands, brandsByLetter, isLoading } = useBrands();
  const [search, setSearch] = useState('');

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return brands.filter(b => b.name.toLowerCase().includes(q));
  }, [brands, search]);

  return (
    <Layout>
      <SEO
        title="All Brands | SnusFriend"
        description="Explore all 91+ nicotine pouch brands. ZYN, VELO, Loop, White Fox, and more. Find your perfect brand."
        canonical={`${SITE_URL}/brands`}
        jsonLd={breadcrumbJsonLd}
      />

      <div className="container py-8 md:py-12">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <span>/</span>
          <span className="text-foreground font-medium">Brands</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Our Brands
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Discover top nicotine pouch brands from leading manufacturers across Scandinavia and Europe.
          </p>
        </div>

        <div className="mb-8 max-w-md">
          <Input
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl"
          />
        </div>

        {filteredBrands ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredBrands.map((brand) => {
              const accent = brandAccentColor(brand.name);
              return (
                <a
                  key={brand.id}
                  href={`/brand/${brand.slug}`}
                  className="group block"
                >
                  <div className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-200 ease-out hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:border-[hsl(0_0%_100%/0.3)]">
                    <div className="p-5 flex flex-col items-center text-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-bold text-lg"
                        style={{ backgroundColor: accent }}
                      >
                        {brand.name.charAt(0)}
                      </div>
                      <h2 className="text-base font-semibold text-foreground group-hover:text-[hsl(var(--chart-4))] transition-colors">
                        {brand.name}
                      </h2>
                      <span className="text-xs text-muted-foreground">{brand.productCount} products</span>
                    </div>
                  </div>
                </a>
              );
            })}
            {filteredBrands.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">No brands match your search.</p>
            )}
          </div>
        ) : (
          <>
            {/* Featured Brands */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-5">Featured Brands</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {(isLoading ? Array.from({ length: 24 }) : topBrands).map((brand: unknown, index: number) => {
                  if (isLoading) {
                    return (
                      <div key={index} className="aspect-[4/3] rounded-2xl border border-border/40 bg-card animate-pulse" />
                    );
                  }
                  const b = brand as Brand;
                  const accent = brandAccentColor(b.name);

                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.5), ease: 'easeOut' }}
                    >
                      <a
                        href={`/brand/${b.slug}`}
                        className="group block h-full"
                      >
                        <div className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-200 ease-out hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:border-white/20">
                          {/* Top accent line */}
                          <div
                            className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 group-hover:h-1"
                            style={{ backgroundColor: accent }}
                          />

                          <div className="p-4 flex flex-col items-center text-center gap-2.5 pt-5">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white font-bold text-base shadow-sm"
                              style={{ backgroundColor: accent }}
                            >
                              {b.name.charAt(0)}
                            </div>
                            <div className="min-w-0 w-full">
                              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {b.name}
                              </h3>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {b.productCount} products
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* All Brands A-Z */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">All Brands A&#8211;Z</h2>

              {/* Mobile: horizontal A-Z bar */}
              <div className="flex flex-wrap gap-1 mb-6 lg:hidden">
                {ALPHABET.map((letter) => {
                  const hasBrands = !!brandsByLetter[letter]?.length;
                  return hasBrands ? (
                    <a
                      key={letter}
                      href={`#letter-${letter}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium bg-card border border-border/40 text-foreground hover:bg-[hsl(var(--chart-4))] hover:text-white transition-colors"
                    >
                      {letter}
                    </a>
                  ) : (
                    <span
                      key={letter}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-muted-foreground/40"
                    >
                      {letter}
                    </span>
                  );
                })}
              </div>

              <div className="flex gap-6">
                {/* Desktop: sticky vertical A-Z sidebar */}
                <nav className="hidden lg:flex flex-col gap-0.5 sticky top-28 self-start shrink-0" aria-label="Alphabet navigation">
                  {ALPHABET.map((letter) => {
                    const hasBrands = !!brandsByLetter[letter]?.length;
                    return hasBrands ? (
                      <a
                        key={letter}
                        href={`#letter-${letter}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-foreground hover:bg-[hsl(var(--chart-4))] hover:text-white transition-colors"
                      >
                        {letter}
                      </a>
                    ) : (
                      <span
                        key={letter}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-muted-foreground/30"
                      >
                        {letter}
                      </span>
                    );
                  })}
                </nav>

                <div className="flex-1 space-y-6">
                  {ALPHABET.filter((letter) => brandsByLetter[letter]?.length).map((letter) => (
                    <div key={letter} id={`letter-${letter}`}>
                      <h3 className="text-lg font-bold text-foreground border-b border-border/40 pb-1 mb-2">
                        {letter}
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                        {brandsByLetter[letter].map((b) => (
                          <li key={b.id} className="flex items-center justify-between py-1.5">
                            <a
                              href={`/brand/${b.slug}`}
                              className="text-sm text-foreground hover:text-[hsl(var(--chart-4))] transition-colors"
                            >
                              {b.name}
                            </a>
                            <span className="text-xs text-muted-foreground">{b.productCount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
