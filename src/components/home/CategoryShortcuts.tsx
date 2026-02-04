import { Link } from 'react-router-dom';
import { Cigarette, Sparkles, Tag, Package, RefreshCw, Calendar, Zap, Gift } from 'lucide-react';

const categories = [
  {
    name: 'Vitt snus',
    icon: Cigarette,
    href: '/produkter',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    name: 'Nyheter',
    icon: Sparkles,
    href: '/produkter?badge=Nyhet',
    color: 'bg-secondary/20 text-secondary hover:bg-secondary/30',
  },
  {
    name: 'Nytt pris',
    icon: Tag,
    href: '/produkter?badge=Nytt+pris',
    color: 'bg-chart-1/20 text-chart-1 hover:bg-chart-1/30',
  },
  {
    name: 'Pick & Mix',
    icon: Package,
    href: '/produkter',
    color: 'bg-muted text-muted-foreground hover:bg-muted/80',
  },
  {
    name: 'Prenumerera',
    icon: RefreshCw,
    href: '/produkter',
    color: 'bg-chart-2/20 text-chart-2 hover:bg-chart-2/30',
  },
  {
    name: 'Månadens',
    icon: Calendar,
    href: '/produkter?badge=Populär',
    color: 'bg-chart-5/20 text-chart-5 hover:bg-chart-5/30',
  },
  {
    name: 'Extra stark',
    icon: Zap,
    href: '/produkter?strength=Extra+Stark',
    color: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  },
  {
    name: 'Erbjudanden',
    icon: Gift,
    href: '/produkter?badge=Nytt+pris',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
];

export function CategoryShortcuts() {
  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-4 md:overflow-visible md:pb-0">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="flex flex-col items-center gap-2 shrink-0"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${category.color}`}
              >
                <category.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-foreground text-center whitespace-nowrap">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
