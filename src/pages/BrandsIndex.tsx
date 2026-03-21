import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { useBrands, brandAccentColor } from '@/hooks/useBrands';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://snus-friend-shop.lovable.app/' },
    { '@type': 'ListItem', position: 2, name: 'Brands', item: 'https://snus-friend-shop.lovable.app/brands' },
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
        title="Brands | SnusFriend"
        description="Explore all nicotine pouch brands available at SnusFriend. From ZYN to VELO, find your perfect match."
        canonical="https://snus-friend-shop.lovable.app/brands"
        jsonLd={breadcrumbJsonLd}
      />

      <div className="container py-8 md:py-12">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredBrands.map((brand) => {
              const accent = brandAccentColor(brand.name);
              return (
                <Link
                  key={brand.id}
                  to={`/brand/${brand.slug}`}
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
                </Link>
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
              <h2 className="text-xl font-bold text-foreground mb-4">Featured Brands</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {(isLoading ? Array.from({ length: 12 }) : topBrands).map((brand, index) => {
                  if (isLoading) {
                    return (
                      <div key={index} className="h-48 rounded-2xl border border-border/40 bg-card animate-pulse" />
                    );
                  }
                  const b = brand!;
                  const accent = brandAccentColor(b.name);

                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
                    >
                      <Link
                        to={`/brand/${b.slug}`}
                        className="group block h-full"
                      >
                        <div className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-200 ease-out hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:border-[hsl(0_0%_100%/0.3)]">
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-all duration-200 group-hover:w-2"
                            style={{ backgroundColor: accent }}
                          />

                          <div className="p-5 md:p-6 pl-6 md:pl-7 flex flex-col h-full">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm"
                                  style={{ backgroundColor: accent }}
                                >
                                  {b.name.charAt(0)}
                                </div>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(var(--chart-4))] transition-colors">
                                  {b.name}
                                </h3>
                              </div>
                              <Badge className="shrink-0 text-xs bg-[hsl(var(--chart-4)/0.15)] text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4)/0.3)] hover:bg-[hsl(var(--chart-4)/0.2)]">
                                {b.productCount} products
                              </Badge>
                            </div>

                            {b.manufacturer && (
                              <p className="text-xs text-muted-foreground mb-4">
                                by {b.manufacturer}
                              </p>
                            )}

                            <div className="mt-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 rounded-xl border-[hsl(var(--chart-4)/0.3)] text-[hsl(var(--chart-4))] hover:bg-[hsl(var(--chart-4))] hover:text-white hover:border-[hsl(var(--chart-4))] transition-all duration-200"
                              >
                                View {b.name}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* All Brands A-Z */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">All Brands A&#8211;Z</h2>

              <div className="flex flex-wrap gap-1 mb-6">
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

              <div className="space-y-6">
                {ALPHABET.filter((letter) => brandsByLetter[letter]?.length).map((letter) => (
                  <div key={letter} id={`letter-${letter}`}>
                    <h3 className="text-lg font-bold text-foreground border-b border-border/40 pb-1 mb-2">
                      {letter}
                    </h3>
                    <ul className="space-y-1">
                      {brandsByLetter[letter].map((b) => (
                        <li key={b.id} className="flex items-center justify-between py-1">
                          <Link
                            to={`/brand/${b.slug}`}
                            className="text-sm text-foreground hover:text-[hsl(var(--chart-4))] transition-colors"
                          >
                            {b.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">{b.productCount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
