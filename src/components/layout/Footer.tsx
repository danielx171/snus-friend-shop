import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                SF
              </div>
              <span className="text-xl font-bold text-foreground">SnusFriend</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.customerService')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/leverans" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link to="/retur" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.information')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/om" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/villkor" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/integritet" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.followUs')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <p className="text-xs text-muted-foreground">
            ⚠️ {t('compliance.nicotineWarning')}
          </p>
        </div>
      </div>
    </footer>
  );
}
