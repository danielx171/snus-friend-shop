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
import { brands as brandsList } from '@/data/products';

export function MainNav() {
  const categories = [
    { title: 'All Nicotine Pouches', href: '/nicotine-pouches', description: 'Browse our complete range of nicotine pouches' },
    { title: 'Nicotine-Free', href: '/nicotine-pouches?strength=normal', description: 'Pouches with lower nicotine content' },
    { title: 'Caffeine Pouches', href: '/nicotine-pouches', description: 'Energy-boosting caffeine pouches' },
  ];

  const brands = brandsList.slice(0, 8).map(name => ({
    name,
    href: `/nicotine-pouches?brand=${encodeURIComponent(name)}`,
  }));

  return (
    <nav className="hidden lg:block relative z-40 border-b border-border/20 bg-card/40 backdrop-blur-sm">
      <div className="container">
        <NavigationMenu>
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 rounded-none bg-transparent hover:bg-primary/8 data-[state=open]:bg-primary/8 text-sm font-medium text-foreground hover:text-primary data-[state=open]:text-primary">
                Nicotine Pouches
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[420px] gap-1.5 p-4 md:w-[520px] md:grid-cols-2 glass-panel-strong rounded-xl">
                  {categories.map((category) => (
                    <li key={category.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={category.href}
                          className="block select-none space-y-1.5 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-primary/8"
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{category.title}</div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{category.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 rounded-none bg-transparent hover:bg-primary/8 data-[state=open]:bg-primary/8 text-sm font-medium text-foreground hover:text-primary data-[state=open]:text-primary">
                Brands
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[340px] grid-cols-2 gap-0.5 p-4 glass-panel-strong rounded-xl">
                  {brands.map((brand) => (
                    <li key={brand.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={brand.href}
                          className="block select-none rounded-xl px-4 py-2.5 text-sm leading-none no-underline outline-none transition-colors hover:bg-primary/8 hover:text-primary"
                        >
                          {brand.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {[
              { href: '/nicotine-pouches?badge=newPrice', label: '99p Picks', highlight: true },
              { href: '/nicotine-pouches?badge=new', label: 'New' },
              { href: '/nicotine-pouches?badge=popular', label: 'Bestsellers' },
              { href: '/nicotine-pouches?badge=newPrice', label: 'Offers' },
              { href: '/brands', label: 'Brands' },
              { href: '/membership', label: 'Members Club', highlight: true },
            ].map((item) => (
              <NavigationMenuItem key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    'inline-flex h-11 items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/8 rounded-none',
                    item.highlight ? 'text-primary' : 'text-foreground hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
