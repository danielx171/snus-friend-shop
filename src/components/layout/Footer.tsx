import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Logo } from './Logo';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'duplicate' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setStatus('submitting');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: trimmed });

    if (error) {
      if (error.code === '23505') {
        setStatus('duplicate');
      } else {
        setStatus('error');
      }
    } else {
      setStatus('success');
    }
    setTimeout(() => setStatus('idle'), 3000);
  };

  const isDisabled = status === 'submitting' || status === 'success' || status === 'duplicate';

  return (
    <div className="text-center max-w-lg mx-auto">
      <h3 className="text-lg font-semibold text-foreground mb-1.5">Stay in the loop</h3>
      <p className="text-sm text-muted-foreground mb-4">
        New drops, exclusive offers, and pouch tips — straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 min-w-0 bg-card/50 border border-border/30 rounded-l-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className={cn(
            'rounded-r-xl px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap',
            status === 'success' || status === 'duplicate'
              ? 'bg-emerald-500 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60'
          )}
        >
          {status === 'submitting' ? 'Saving…' : status === 'success' ? '✓ Subscribed!' : status === 'duplicate' ? '✓ Already subscribed!' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-xs text-emerald-400 mt-2">Welcome to the family! Check your inbox.</p>
      )}
      {status === 'duplicate' && (
        <p className="text-xs text-muted-foreground mt-2">You're already subscribed — we've got you!</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-destructive mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-card/30 bg-muted/5">
      <div className="container py-16">
        {/* Newsletter */}
        <NewsletterSignup />
        <Separator className="my-10 bg-border/30" />

        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <Logo size={38} className="text-primary" />
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
                { to: '/membership', label: 'Snus Family' },
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/cookies', label: 'Cookie Policy' },
              ],
            },
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
