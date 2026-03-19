import { Moon, Sun, Palette, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

const themes = [
  { value: 'dark', label: 'Dark Premium', icon: Moon },
  { value: 'light', label: 'Light Glacier', icon: Sun },
  { value: 'editorial', label: 'Editorial Luxury', icon: Palette },
  { value: 'velo', label: 'Velo', icon: Zap },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = themes.find((t) => t.value === theme) ?? themes[0];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10 text-muted-foreground hover:text-primary"
          aria-label="Switch theme"
        >
          <Icon className="h-5 w-5 transition-transform duration-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {themes.map((t) => {
          const TIcon = t.icon;
          return (
            <DropdownMenuItem
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={theme === t.value ? 'bg-accent font-semibold' : ''}
            >
              <TIcon className="h-4 w-4 mr-2" />
              {t.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
