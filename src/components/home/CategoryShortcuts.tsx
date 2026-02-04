import { Link } from 'react-router-dom';
import { Cigarette, Sparkles, Tag, Package, RefreshCw, Calendar, Zap, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo } from 'react';

export function CategoryShortcuts() {
  const { t } = useTranslation();

  const categories = useMemo(() => [
    {
      id: 'white-snus',
      name: t('categories.whiteSnus'),
      icon: Cigarette,
      href: '/produkter',
    },
    {
      id: 'news',
      name: t('categories.news'),
      icon: Sparkles,
      href: '/produkter?badge=new',
    },
    {
      id: 'new-price',
      name: t('categories.newPrice'),
      icon: Tag,
      href: '/produkter?badge=newPrice',
    },
    {
      id: 'pick-mix',
      name: t('categories.pickMix'),
      icon: Package,
      href: '/produkter',
    },
    {
      id: 'sub-snus',
      name: t('categories.subSnus'),
      icon: RefreshCw,
      href: '/produkter',
    },
    {
      id: 'monthly',
      name: t('categories.monthlyDoses'),
      icon: Calendar,
      href: '/produkter?badge=popular',
    },
    {
      id: 'extra-strong',
      name: t('strength.extraStrong'),
      icon: Zap,
      href: '/produkter?strength=extraStrong',
    },
    {
      id: 'deals',
      name: t('badge.newPrice'),
      icon: Gift,
      href: '/produkter?badge=newPrice',
    },
  ], [t]);

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-3 md:overflow-visible md:pb-0">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group flex flex-col items-center gap-2 shrink-0"
            >
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200',
                  'bg-muted/60 text-muted-foreground',
                  'group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105',
                  'group-active:scale-95'
                )}
              >
                <category.icon className="h-5 w-5 stroke-[1.5]" />
              </div>
              <span className="text-[11px] font-medium text-foreground text-center whitespace-nowrap group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
