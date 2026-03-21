import { Link, useLocation } from 'react-router-dom';
import { Gauge, BicepsFlexed, CircleDot, Trophy, Tag, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    if (currentPath === '/') return false;
    if (href === '/nicotine-pouches') return currentPath === '/nicotine-pouches';
    return currentPath === href;
  }

  return (
    <section className="py-8 border-b border-border/20">
      <div className="container">
        <div
          className="flex justify-center gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const selected = isSelected(category.href);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.3, delay: index * 0.08, ease: 'easeOut' }}
              >
                <Link
                  to={category.href}
                  className="relative flex flex-col items-center gap-2.5 rounded-2xl p-4 min-w-[88px] transition-all duration-150 shrink-0 group"
                >
                  <div className="relative">
                    {selected && (
                      <motion.div
                        layoutId="category-active-bg"
                        className="absolute inset-0 rounded-2xl bg-[#c8f135]"
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      />
                    )}
                    <div
                      className={cn(
                        'relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-200',
                        selected
                          ? 'border-transparent shadow-[0_0_16px_rgba(200,241,53,0.35)]'
                          : 'bg-muted/40 border-border/30 group-hover:border-white/25'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6 transition-colors duration-150',
                          selected
                            ? 'text-zinc-900'
                            : 'text-muted-foreground group-hover:text-[hsl(0_0%_100%/0.8)]'
                        )}
                      />
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium text-center whitespace-nowrap transition-colors duration-200',
                      selected ? 'text-[#c8f135]' : 'text-foreground'
                    )}
                  >
                    {category.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}