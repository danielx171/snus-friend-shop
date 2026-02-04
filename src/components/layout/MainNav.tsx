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

const categories = [
  {
    title: 'Vitt snus',
    href: '/produkter',
    description: 'Nikotinpåsar utan tobak',
  },
  {
    title: 'Alla varumärken',
    href: '/produkter?show=brands',
    description: 'Utforska vårt sortiment',
  },
];

const brands = [
  { name: 'ZYN', href: '/produkter?brand=ZYN' },
  { name: 'VELO', href: '/produkter?brand=VELO' },
  { name: 'ON!', href: '/produkter?brand=ON!' },
  { name: 'LOOP', href: '/produkter?brand=LOOP' },
  { name: 'Lyft', href: '/produkter?brand=Lyft' },
  { name: 'Nordic Spirit', href: '/produkter?brand=Nordic+Spirit' },
];

export function MainNav() {
  return (
    <nav className="hidden lg:block border-b border-border bg-card/50">
      <div className="container">
        <NavigationMenu>
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10 rounded-none bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 text-sm">
                Vitt snus
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
                Våra varumärken
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
                to="/produkter?badge=Nyhet"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                Nyheter
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/produkter?badge=Nytt+pris"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent/50'
                )}
              >
                Nytt pris
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/produkter"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                Pick & Mix – fr. 14,90 kr/st
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/om"
                className={cn(
                  'inline-flex h-10 items-center justify-center px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                Om oss
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
