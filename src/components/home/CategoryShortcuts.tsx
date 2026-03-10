import { Link } from 'react-router-dom';
import { Zap, Flame, Leaf, Star, Percent, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', icon: Leaf, label: 'All Pouches', href: '/nicotine-pouches', iconClass: 'text-primary' },
  { id: 'strong', icon: Flame, label: 'Strong', href: '/nicotine-pouches?strength=strong', iconClass: 'text-destructive' },
  { id: 'extra-strong', icon: Zap, label: 'Extra Strong', href: '/nicotine-pouches?strength=extraStrong', iconClass: 'text-destructive' },
  { id: 'bestsellers', icon: Star, label: 'Bestsellers', href: '/nicotine-pouches?badge=popular', iconClass: 'text-chart-1' },
  { id: 'offers', icon: Percent, label: 'Offers', href: '/nicotine-pouches?badge=newPrice', iconClass: 'text-chart-2' },
  { id: 'new', icon: Sparkles, label: 'New', href: '/nicotine-pouches?badge=new', iconClass: 'text-chart-4' },
];

export function CategoryShortcuts() {
  return (
    <section className="py-8 border-b border-border/20 bg-card/20">
      <div className="container">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.href}
                className="flex flex-col items-center gap-2.5 rounded-2xl p-4 min-w-[88px] hover:bg-primary/8 transition-all shrink-0 group"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 border border-border/30 group-hover:border-primary/30 group-hover:glow-primary transition-all">
                  <Icon className={`h-6 w-6 ${category.iconClass}`} />
                </div>
                <span className="text-xs font-medium text-foreground text-center whitespace-nowrap">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
