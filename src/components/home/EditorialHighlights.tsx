import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const highlights = [
  {
    title: 'Flavor Guide',
    blurb: 'From icy mint to tropical fruit — discover your perfect pouch flavor with our curated guide.',
    href: '/nicotine-pouches',
    image: '🍃',
    gradient: 'from-primary/15 to-chart-3/10',
  },
  {
    title: 'Strength Guide',
    blurb: 'Whether you\'re a beginner or a veteran, find the right nicotine strength for your lifestyle.',
    href: '/nicotine-pouches?strength=strong',
    image: '⚡',
    gradient: 'from-chart-4/15 to-chart-1/10',
  },
  {
    title: 'New Drops',
    blurb: 'Fresh arrivals from ZYN, VELO, and more. Be the first to try the latest releases.',
    href: '/nicotine-pouches?badge=new',
    image: '✨',
    gradient: 'from-chart-2/15 to-primary/10',
  },
];

export function EditorialHighlights() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Explore & Discover</h2>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Curated guides and collections to help you find your perfect nicotine pouch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group rounded-2xl glass-panel overflow-hidden hover:border-primary/25 transition-all duration-300"
            >
              <div className={`h-40 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{item.image}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.blurb}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
