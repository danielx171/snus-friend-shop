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
    {
      title: 'All Nicotine Pouches',
      href: '/nicotine-pouches',
      description: 'Browse our complete range of nicotine pouches',
    },
    {
      title: 'Nicotine-Free',
      href: '/nicotine-pouches?strength=normal',
      description: 'Pouches with lower nicotine content',
    },
    {
      title: 'Caffeine Pouches',
      href: '/nicotine-pouches',
      description: 'Energy-boosting caffeine pouches',
    },
  ];

  const brands = brandsList.slice(0, 8).map(name => ({
    name,
    href: `/nicotine-pouches?brand=${encodeURIComponent(name)}`,
  }));

  return (
    <nav className="hidden lg:block border-b border-border bg-card/50">
      <div className="container">
        <NavigationMenu>
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10 rounded-none bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 text-sm">
                Nicotine Pouches
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 p-3 md:w-[500px] md:grid-cols-2">
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
                Brands
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] grid-cols-2 gap-0.5 p-3">
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
                to="/nicotine-pouches?badge=newPrice"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent/50'
                )}
              >
                99p Picks
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/nicotine-pouches?badge=new"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                New
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/nicotine-pouches?badge=popular"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                Bestsellers
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/nicotine-pouches?badge=newPrice"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                Offers
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/brands"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                Brands
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
