import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export function Footer() {
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
              Sveriges största urval av nikotinpåsar från ledande varumärken. 
              Snabb leverans och utmärkt kundservice.
            </p>
          </div>

          {/* Kundservice */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kundservice</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">
                  Kontakta oss
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  Vanliga frågor
                </Link>
              </li>
              <li>
                <Link to="/leverans" className="text-muted-foreground hover:text-primary transition-colors">
                  Leveransinformation
                </Link>
              </li>
              <li>
                <Link to="/retur" className="text-muted-foreground hover:text-primary transition-colors">
                  Retur & reklamation
                </Link>
              </li>
            </ul>
          </div>

          {/* Om oss */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Om oss</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/om" className="text-muted-foreground hover:text-primary transition-colors">
                  Om SnusFriend
                </Link>
              </li>
              <li>
                <Link to="/karriar" className="text-muted-foreground hover:text-primary transition-colors">
                  Karriär
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-muted-foreground hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/hallbarhet" className="text-muted-foreground hover:text-primary transition-colors">
                  Hållbarhet
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/integritet" className="text-muted-foreground hover:text-primary transition-colors">
                  Integritetspolicy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookiepolicy
                </Link>
              </li>
              <li>
                <Link to="/villkor" className="text-muted-foreground hover:text-primary transition-colors">
                  Köpvillkor
                </Link>
              </li>
              <li>
                <Link to="/tillganglighet" className="text-muted-foreground hover:text-primary transition-colors">
                  Tillgänglighet
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SnusFriend. Alla rättigheter förbehållna.
          </p>
          <p className="text-xs text-muted-foreground">
            ⚠️ Produkterna innehåller nikotin. 18+ endast.
          </p>
        </div>
      </div>
    </footer>
  );
}
