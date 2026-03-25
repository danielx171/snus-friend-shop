import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Logo } from './Logo';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Mail, Check } from 'lucide-react';

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
  const showCheck = status === 'success' || status === 'duplicate';

  return (
    <div className="text-center max-w-lg mx-auto">
      <Mail className="mx-auto mb-3 h-7 w-7 text-accent" />
      <h3 className="text-xl font-semibold text-foreground mb-1.5">Stay in the loop</h3>
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
          className="flex-1 min-w-0 bg-card/50 border border-border/30 rounded-l-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-400 focus:shadow-[0_0_8px_rgba(96,165,250,0.3)] transition-all duration-200"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className={cn(
            'rounded-r-xl px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap',
            showCheck
              ? 'bg-emerald-500 text-white'
              : 'bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-60'
          )}
        >
          {status === 'submitting' ? 'Saving…' : showCheck ? (
            <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" />{status === 'success' ? 'Subscribed!' : 'Already subscribed!'}</span>
          ) : 'Subscribe'}
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

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link
        to={to}
        className="group inline-flex items-center gap-0 text-muted-foreground hover:text-[hsl(var(--chart-4))] transition-colors duration-200"
      >
        <span className="inline-block w-0 group-hover:w-2.5 h-1 rounded-full bg-[hsl(var(--chart-4))] transition-all duration-200 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100" />
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <>
      {/* Gradient fade transition */}
      <div
        className="h-[60px] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--card) / 0.3))' }}
      />
      <footer className="border-t border-white/[0.04]" style={{ background: 'linear-gradient(180deg, hsl(230 40% 12%), hsl(225 30% 14%))' }}>
        <div className="container py-16">
          {/* Newsletter */}
          <div id="footer-newsletter">
            <NewsletterSignup />
          </div>
          <Separator className="my-10 bg-border/30" />

          <div className="grid gap-10 md:grid-cols-4">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <Logo size={38} className="text-primary" />
                <span className="text-[22px] font-semibold text-foreground" style={{ letterSpacing: '0.02em' }}>SnusFriend</span>
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
                  { to: '/whats-new', label: "What's New" },
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
                    <FooterLink key={link.label} to={link.to} label={link.label} />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-10 bg-border/30" />

          {/* Payment badges row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {['Visa', 'Mastercard'].map((badge) => (
              <div key={badge} className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs text-muted-foreground font-medium">
                {badge}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} SnusFriend. All rights reserved.
              <span className="ml-2 text-muted-foreground/30 font-mono">v{__APP_VERSION__}</span>
            </p>
            <div className="bg-amber-500/[0.06] border border-amber-500/10 rounded-lg px-4 py-2">
              <p className="text-xs text-amber-400/80">
                ⚠️ This product contains nicotine. Nicotine is an addictive chemical.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
