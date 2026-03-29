import { useStore } from '@nanostores/react';
import * as Dialog from '@radix-ui/react-dialog';
import { $mobileMenuOpen, closeMobileMenu } from '@/stores/ui';
import { tenant } from '@/config/tenant';
import ThemePicker from '@/components/react/ThemePicker';

const navSections = [
  {
    title: 'Shop',
    links: [
      { href: '/products', label: 'Products' },
      { href: '/brands', label: 'Brands' },
    ],
  },
  {
    title: 'By Strength',
    links: [
      { href: '/products/strength/light', label: 'Light' },
      { href: '/products/strength/normal', label: 'Normal' },
      { href: '/products/strength/strong', label: 'Strong' },
      { href: '/products/strength/extra-strong', label: 'Extra Strong' },
      { href: '/products/strength/super-strong', label: 'Super Strong' },
    ],
  },
  {
    title: 'By Flavor',
    links: [
      { href: '/products/flavor/mint', label: 'Mint' },
      { href: '/products/flavor/citrus', label: 'Citrus' },
      { href: '/products/flavor/berry', label: 'Berry' },
      { href: '/products/flavor/coffee', label: 'Coffee' },
      { href: '/products/flavor/tobacco', label: 'Tobacco' },
      { href: '/products/flavor/tropical', label: 'Tropical' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/community', label: 'Community' },
      { href: '/rewards', label: 'Rewards' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/login', label: 'Login' },
      { href: '/register', label: 'Register' },
    ],
  },
];

export default function MobileMenu() {
  const open = useStore($mobileMenuOpen);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) closeMobileMenu();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-0 top-0 w-3/4 max-w-[320px] h-full bg-background border-r border-border z-50 overflow-y-auto focus:outline-none">
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>

          <div className="p-4 border-b border-border">
            <a
              href="/"
              onClick={closeMobileMenu}
              className="font-bold text-lg text-primary"
            >
              {tenant.name}
            </a>
          </div>

          <nav className="p-4 space-y-6" aria-label="Mobile navigation">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-2">
                  {section.title}
                </h3>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="text-sm text-foreground hover:text-primary py-2 block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Theme switcher */}
            <div>
              <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-2">
                Theme
              </h3>
              <ThemePicker />
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
