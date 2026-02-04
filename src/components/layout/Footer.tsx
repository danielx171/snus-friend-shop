import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      {/* Nicotine Warning */}
      <div className="bg-destructive/10 py-3">
        <div className="container">
          <p className="text-center text-sm text-destructive font-medium">
            ⚠️ Varning: Denna produkt innehåller nikotin som är ett beroendeframkallande ämne.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                SF
              </div>
              <span className="text-xl font-semibold text-foreground">SnusFriend</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Din pålitliga partner för nikotinpåsar. Snabb leverans och brett sortiment.
            </p>
          </div>

          {/* Kundservice */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Kundservice</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/kontakt" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Kontakta oss
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Vanliga frågor
              </Link>
              <Link to="/leverans" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Leveransinformation
              </Link>
              <Link to="/retur" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Retur & Reklamation
              </Link>
            </nav>
          </div>

          {/* Om oss */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Om oss</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/om-oss" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Om SnusFriend
              </Link>
              <Link to="/hallbarhet" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Hållbarhet
              </Link>
              <Link to="/jobb" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Jobba hos oss
              </Link>
            </nav>
          </div>

          {/* Juridiskt */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Juridiskt</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/integritetspolicy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Integritetspolicy
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookiepolicy
              </Link>
              <Link to="/villkor" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Köpvillkor
              </Link>
              <Link to="/tillganglighet" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Tillgänglighet
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 SnusFriend AB. Alla rättigheter förbehållna.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground bg-destructive/10 px-3 py-1 rounded-full">
              🔞 Endast 18+
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
