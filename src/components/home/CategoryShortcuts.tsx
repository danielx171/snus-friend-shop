import { Link, useLocation } from 'react-router-dom';
import { Gauge, BicepsFlexed, CircleDot, Trophy, Tag, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', icon: CircleDot, label: 'All Pouches', href: '/nicotine-pouches' },
  { id: 'strong', icon: Gauge, label: 'Strong', href: '/nicotine-pouches?strength=strong' },
  { id: 'extra-strong', icon: BicepsFlexed, label: 'Extra Strong', href: '/nicotine-pouches?strength=extraStrong' },
  { id: 'bestsellers', icon: Trophy, label: 'Bestsellers', href: '/nicotine-pouches?badge=popular' },
  { id: 'offers', icon: Tag, label: 'Offers', href: '/nicotine-pouches?badge=newPrice' },
  { id: 'new', icon: Sparkles, label: 'New', href: '/nicotine-pouches?badge=new' },
];

export function CategoryShortcuts() {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  function isSelected(href: string) {
    if (href === '/nicotine-pouches') {
      return currentPath === '/' || currentPath === '/nicotine-pouches';
    }
    return currentPath === href;
  }

  return (
    <section className="py-8 border-b border-border/20 bg-card/20">
      <div className="container">
        <div
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const selected = isSelected(category.href);

            return (
              <Link
                key={category.id}
                to={category.href}
                className="flex flex-col items-center gap-2.5 rounded-2xl p-4 min-w-[88px] transition-all duration-150 shrink-0 group"
              >
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-150',
                    selected
                      ? 'bg-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))] shadow-[0_0_16px_hsl(var(--chart-4)/0.3)]'
                      : 'bg-muted/40 border-border/30 group-hover:bg-[hsl(var(--chart-4)/0.5)] group-hover:border-[hsl(var(--chart-4)/0.5)]'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6 transition-colors duration-150',
                      selected
                        ? 'text-[hsl(220_16%_6%)]'
                        : 'text-muted-foreground group-hover:text-[hsl(0_0%_100%/0.8)]'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium text-center whitespace-nowrap transition-colors duration-150',
                    selected ? 'text-[hsl(var(--chart-4))]' : 'text-foreground'
                  )}
                >
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
