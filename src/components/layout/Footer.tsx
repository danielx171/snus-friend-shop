import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-card/30 bg-[hsl(30_15%_50%/0.03)]">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg glow-primary">
                SF
              </div>
              <span className="text-xl font-semibold text-foreground">SnusFriend</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your trusted source for premium nicotine pouches. Fast EU delivery and excellent customer service.
            </p>
          </div>

          {[
            {
              title: 'Customer Service',
              links: [
                { to: '/contact', label: 'Contact Us' },
                { to: '/faq', label: 'FAQ' },
                { to: '/shipping', label: 'Shipping Information' },
                { to: '/returns', label: 'Returns & Refunds' },
              ],
            },
            {
              title: 'Information',
              links: [
                { to: '/about', label: 'About Us' },
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/cookies', label: 'Cookie Policy' },
              ],
            },
            // Social links — add real URLs when accounts are created
            // {
            //   title: 'Follow Us',
            //   links: [
            //     { to: 'https://instagram.com/snusfriend', label: 'Instagram' },
            //     { to: 'https://facebook.com/snusfriend', label: 'Facebook' },
            //   ],
            // },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-border/30" />

        {/* Payment badges row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {['Visa', 'Mastercard'].map((badge) => (
            <div key={badge} className="px-3 py-1.5 rounded-lg bg-muted/20 border border-border/20 text-xs text-muted-foreground font-medium">
              {badge}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SnusFriend. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            ⚠️ This product contains nicotine. Nicotine is an addictive chemical.
          </p>
        </div>
      </div>
    </footer>
  );
}
