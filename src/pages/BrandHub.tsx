import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { AgeGate } from '@/components/compliance/AgeGate';
import { getBrandBySlug } from '@/data/brands';
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
import { ArrowRight, Package } from 'lucide-react';
import NotFound from './NotFound';

const TOP_PRODUCTS_LIMIT = 4;

export default function BrandHub() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brand = brandSlug ? getBrandBySlug(brandSlug) : undefined;
  const { data: allProducts = [], isLoading: productsLoading } = useCatalogProducts();

  if (!brand) return <NotFound />;

  const brandProducts = allProducts.filter((p) => p.brand === brand.name);
  const topProducts = [...brandProducts]
    .sort((a, b) => b.ratings - a.ratings)
    .slice(0, TOP_PRODUCTS_LIMIT);

  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/brand/${brand.slug}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: brand.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Nicotine Pouches', item: `${baseUrl}/nicotine-pouches` },
      { '@type': 'ListItem', position: 3, name: brand.name, item: canonicalUrl },
    ],
  };

  return (
    <>
      <SEO
        title={`${brand.name} Nicotine Pouches | Buy Online | SnusFriend UK`}
        description={`Buy ${brand.name} nicotine pouches online at SnusFriend. ${brand.tagline} Free UK delivery over £25. Subscribe & save 10%.`}
        canonical={canonicalUrl}
        jsonLd={[faqJsonLd, breadcrumbJsonLd]}
      />
      <Layout showNicotineWarning={false}>
        <AgeGate />

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12 lg:py-16">
          <div className="container">
            <nav className="mb-4 text-xs text-muted-foreground" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1 flex-wrap">
                <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link to="/nicotine-pouches" className="hover:text-foreground transition-colors">Nicotine Pouches</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">{brand.name}</li>
              </ol>
            </nav>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card border border-border shadow-sm">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{brand.name}</h1>
                <p className="text-muted-foreground mt-1 text-sm lg:text-base italic">{brand.tagline}</p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-sm lg:text-base text-muted-foreground leading-relaxed">
              {brand.description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Manufactured by <strong className="text-foreground">{brand.manufacturer}</strong></span>
              <span>·</span>
              <span>{brandProducts.length} product{brandProducts.length !== 1 ? 's' : ''} available</span>
            </div>
          </div>
        </section>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <section className="container py-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                Top {brand.name} Products
              </h2>
              <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
                <Link to={`/nicotine-pouches?brand=${encodeURIComponent(brand.name)}`}>
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {brandProducts.length > TOP_PRODUCTS_LIMIT && (
              <div className="mt-6 text-center">
                <Button variant="outline" asChild className="rounded-xl">
                  <Link to={`/nicotine-pouches?brand=${encodeURIComponent(brand.name)}`}>
                    See all {brandProducts.length} {brand.name} products
                  </Link>
                </Button>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        <section className="bg-muted/30 py-10">
          <div className="container max-w-3xl">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">
              Frequently Asked Questions about {brand.name}
            </h2>

            <Accordion type="multiple" className="space-y-2">
              {brand.faqs.map((faq, i) => (
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

        {/* Internal link back to PLP */}
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
