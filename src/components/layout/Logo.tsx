import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * SnusFriend logo — a stylised top-down view of an open nicotine pouch tin.
 * Refined circle with clean rim detail and three neatly arranged pouches.
 */
export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-label="SnusFriend"
    >
      {/* Outer shadow for depth */}
      <circle cx="20" cy="21" r="17.5" fill="hsl(220 60% 8%)" opacity="0.4" />

      {/* Tin body */}
      <circle cx="20" cy="20" r="17" fill="hsl(220 50% 12%)" />

      {/* Outer rim */}
      <circle cx="20" cy="20" r="17" stroke="hsl(210 45% 28%)" strokeWidth="1.5" />

      {/* Inner rim */}
      <circle cx="20" cy="20" r="13" stroke="hsl(210 40% 25%)" strokeWidth="0.7" opacity="0.5" />

      {/* Inner well */}
      <circle cx="20" cy="20" r="12.5" fill="hsl(220 45% 10%)" opacity="0.6" />

      {/* Pouch 1 — top center */}
      <rect x="17.5" y="10" width="5" height="10" rx="2.5" fill="hsl(43 55% 54%)" opacity="0.9" />

      {/* Pouch 2 — bottom left */}
      <rect x="17.5" y="10" width="5" height="10" rx="2.5" fill="hsl(43 55% 54%)" opacity="0.75" transform="rotate(-30 20 20)" />

      {/* Pouch 3 — bottom right */}
      <rect x="17.5" y="10" width="5" height="10" rx="2.5" fill="hsl(43 55% 54%)" opacity="0.75" transform="rotate(30 20 20)" />

      {/* Subtle top-right rim highlight */}
      <path d="M29 9a17 17 0 0 1 4.5 6" stroke="white" strokeWidth="0.8" opacity="0.1" strokeLinecap="round" />

      {/* Subtle bottom-left rim shadow */}
      <path d="M11 31a17 17 0 0 1-4.5-6" stroke="black" strokeWidth="0.8" opacity="0.15" strokeLinecap="round" />
    </svg>
  );
}
