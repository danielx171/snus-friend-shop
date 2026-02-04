import { Link } from 'react-router-dom';
import { Zap, Flame, Leaf, Star, Percent, Sparkles } from 'lucide-react';

const categories = [
  {
    id: 'all',
    icon: Leaf,
    label: 'All Pouches',
    href: '/nicotine-pouches',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    id: 'strong',
    icon: Flame,
    label: 'Strong',
    href: '/nicotine-pouches?strength=strong',
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    id: 'extra-strong',
    icon: Zap,
    label: 'Extra Strong',
    href: '/nicotine-pouches?strength=extraStrong',
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    id: 'bestsellers',
    icon: Star,
    label: 'Bestsellers',
    href: '/nicotine-pouches?badge=popular',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  {
    id: 'offers',
    icon: Percent,
    label: 'Offers',
    href: '/nicotine-pouches?badge=newPrice',
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    id: 'new',
    icon: Sparkles,
    label: 'New',
    href: '/nicotine-pouches?badge=new',
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
];

export function CategoryShortcuts() {
  return (
    <section className="py-6 border-b border-border bg-card/50">
      <div className="container">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.href}
                className="flex flex-col items-center gap-2 rounded-xl p-3 min-w-[80px] hover:bg-accent transition-colors shrink-0"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.bg}`}>
                  <Icon className={`h-6 w-6 ${category.color}`} />
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
