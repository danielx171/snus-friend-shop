import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { useBrands, brandAccentColor } from '@/hooks/useBrands';
import { brandDirectory } from '@/data/brand-overrides';
import { SITE_URL } from '@/config/brand';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';
import NotFound from './NotFound';

export default function BrandHub() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { brands, isLoading: brandsLoading } = useBrands();
  const { data: allProducts = [], isLoading: productsLoading } = useCatalogProducts();

  const brand = brandSlug ? brands.find(b => b.slug === brandSlug) : undefined;
  const override = brandSlug ? brandDirectory.find(b => b.slug === brandSlug) : undefined;

  if (!brandsLoading && !brand) return <NotFound />;
  if (brandsLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
      </Layout>
    );
  }

  const brandName = brand!.name;
  const brandProducts = allProducts.filter((p) => p.brand === brandName);
  const sortedProducts = [...brandProducts].sort((a, b) => b.ratings - a.ratings);
  const accent = brandAccentColor(brandName);
  const manufacturer = brand!.manufacturer ?? override?.manufacturer;
  const tagline = override?.tagline;
  const description = override?.description ?? `Explore ${brand!.productCount} ${brandName} nicotine pouches at SnusFriend.`;
  const faqs = override?.faqs;

  const baseUrl = SITE_URL;
  const canonicalUrl = `${baseUrl}/brand/${brand!.slug}`;

  const jsonLdItems: object[] = [];

  if (faqs?.length) {
    jsonLdItems.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  jsonLdItems.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Nicotine Pouches', item: `${baseUrl}/nicotine-pouches` },
      { '@type': 'ListItem', position: 3, name: brandName, item: canonicalUrl },
    ],
  });

  return (
    <>
      <SEO
        title={`${brandName} Nicotine Pouches | Buy Online | SnusFriend`}
        description={`Buy ${brandName} nicotine pouches online at SnusFriend. ${tagline ?? `${brand!.productCount} products available.`} Free delivery on orders over €29.`}
        canonical={canonicalUrl}
        jsonLd={jsonLdItems}
      />
      <Layout showNicotineWarning={false}>
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12 lg:py-16">
          <div className="container">
            <nav className="mb-4 text-xs text-muted-foreground" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1 flex-wrap">
                <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link to="/nicotine-pouches" className="hover:text-foreground transition-colors">Nicotine Pouches</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">{brandName}</li>
              </ol>
            </nav>

            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-xl"
                style={{ backgroundColor: accent }}
              >
                {brandName.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{brandName}</h1>
                {tagline && (
                  <p className="text-muted-foreground mt-1 text-sm lg:text-base italic">{tagline}</p>
                )}
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-sm lg:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              {manufacturer && (
                <>
                  <span>Manufactured by <strong className="text-foreground">{manufacturer}</strong></span>
                  <span>·</span>
                </>
              )}
              <span>{brandProducts.length} product{brandProducts.length !== 1 ? 's' : ''} available</span>
            </div>
          </div>
        </section>

        {sortedProducts.length > 0 && (
          <section className="container py-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                {brandName} Products
              </h2>
              <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
                <Link to={`/nicotine-pouches?brand=${encodeURIComponent(brandName)}`}>
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {productsLoading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>
          </section>
        )}

        {faqs && faqs.length > 0 && (
          <section className="bg-muted/30 py-10">
            <div className="container max-w-3xl">
              <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">
                Frequently Asked Questions about {brandName}
              </h2>

              <Accordion type="multiple" className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-xl border border-border bg-card px-5"
                  >
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        <section className="container py-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for more brands?
          </p>
          <Button variant="outline" asChild className="rounded-xl">
            <Link to="/nicotine-pouches">Browse all nicotine pouches</Link>
          </Button>
        </section>
      </Layout>
    </>
  );
}
