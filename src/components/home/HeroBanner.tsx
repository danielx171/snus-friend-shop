import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary/20 via-background to-primary/5">
      <div className="container py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Nytt hos SnusFriend
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Premium nikotinpåsar
              <span className="block text-primary">till bästa pris</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              Utforska Sveriges största urval av nikotinpåsar från ledande varumärken. 
              Fri frakt vid köp över 149 kr och snabb leverans direkt till din dörr.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2 rounded-xl">
                <Link to="/produkter">
                  Handla nu
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link to="/produkter?badge=Nytt+pris">Se nya priser</Link>
              </Button>
            </div>
          </div>

          {/* Visual element - Abstract shapes */}
          <div className="relative hidden lg:block">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />
            <div className="relative rounded-3xl bg-card p-8 shadow-xl border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-4xl">🧊</span>
                  </div>
                  <div className="h-24 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center">
                    <span className="text-3xl">🍃</span>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-24 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-3xl">🍋</span>
                  </div>
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                    <span className="text-4xl">🫐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
