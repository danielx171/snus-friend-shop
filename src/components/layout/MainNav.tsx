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
import { useBrands } from '@/hooks/useBrands';

export function MainNav() {
  const { topBrands } = useBrands();

  const categories = [
    { title: 'All Nicotine Pouches', href: '/nicotine-pouches', description: 'Browse our complete range of 700+ nicotine pouches' },
    { title: 'Mild (≤6mg)', href: '/nicotine-pouches?strength=normal', description: 'Lower strength — great for new users' },
    { title: 'Strong (7–10mg)', href: '/nicotine-pouches?strength=strong', description: 'A step up for experienced users' },
    { title: 'Extra Strong (11–16mg)', href: '/nicotine-pouches?strength=extraStrong', description: 'High strength pouches from top brands' },
    { title: 'Ultra Strong (17mg+)', href: '/nicotine-pouches?strength=ultraStrong', description: 'Maximum strength for seasoned users' },
  ];

  const brands = topBrands.slice(0, 8).map(brand => ({
    name: brand.name,
    productCount: brand.productCount,
    href: `/nicotine-pouches?brand=${encodeURIComponent(brand.name)}`,
  }));

  return (
    <nav className="hidden lg:block relative z-40 border-b border-border/20 bg-card/40 backdrop-blur-sm">
      <div className="container">
        <NavigationMenu>
          <NavigationMenuList className="gap-0 w-full justify-between">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 rounded-none bg-transparent hover:bg-primary/8 data-[state=open]:bg-primary/8 text-sm font-medium text-foreground hover:text-primary data-[state=open]:text-primary">
                Nicotine Pouches
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[460px] gap-1.5 p-4 glass-panel-strong rounded-xl">
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
                          <span className="text-xs text-muted-foreground ml-1">({brand.productCount})</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {[
              { href: '/nicotine-pouches?badge=new', label: 'New Arrivals' },
              { href: '/nicotine-pouches?badge=popular', label: 'Bestsellers' },
              { href: '/nicotine-pouches?badge=newPrice', label: 'Offers', highlight: true },
              { href: '/brands', label: 'All Brands' },
              { href: '/membership', label: 'Snus Family', highlight: true },
            ].map((item) => (
              <NavigationMenuItem key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    'relative inline-flex h-11 items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-none',
                    'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-primary after:rounded-full after:transition-all after:duration-200 hover:after:w-3/4',
                    item.highlight ? 'text-accent hover:text-white' : 'text-foreground hover:text-white'
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
