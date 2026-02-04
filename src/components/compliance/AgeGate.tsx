import { ShieldCheck } from 'lucide-react';

export function AgeGate() {
  return (
    <div className="bg-secondary py-2">
      <div className="container">
        <div className="flex items-center justify-center gap-2 text-sm text-secondary-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>🔞 Du måste vara 18 år eller äldre för att handla hos oss</span>
        </div>
      </div>
    </div>
  );
}
