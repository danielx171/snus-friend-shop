import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { brands as brandsList } from '@/data/products';

export function MainNav() {
  const { t } = useTranslation();

  const categories = [
    {
      title: t('nav.whiteSnus'),
      href: '/produkter',
      description: t('hero.subtitle'),
    },
    {
      title: t('nav.allBrands'),
      href: '/produkter?show=brands',
      description: t('products.viewAll'),
    },
  ];

  const brands = brandsList.slice(0, 6).map(name => ({
    name,
    href: `/produkter?brand=${encodeURIComponent(name)}`,
  }));

  return (
    <nav className="hidden lg:block border-b border-border bg-card/50">
      <div className="container">
        <NavigationMenu>
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10 rounded-none bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 text-sm">
                {t('nav.whiteSnus')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 p-3 md:w-[450px] md:grid-cols-2">
                  {categories.map((category) => (
                    <li key={category.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={category.href}
                          className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {category.title}
                          </div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {category.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10 rounded-none bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 text-sm">
                {t('nav.brands')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[280px] gap-0.5 p-3">
                  {brands.map((brand) => (
                    <li key={brand.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={brand.href}
                          className="block select-none rounded-lg px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {brand.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/produkter?badge=new"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                {t('nav.news')}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/produkter?badge=newPrice"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent/50'
                )}
              >
                {t('nav.newPrice')}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/produkter"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                {t('nav.pickMix')}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/om"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                {t('nav.about')}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
