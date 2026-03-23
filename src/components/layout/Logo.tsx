import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * SnusFriend logo — bold "SF" monogram in a rounded teal shield.
 * Clean, modern, works at all sizes (16–64px).
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
      {/* Shield background */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill="hsl(174 90% 50%)" />

      {/* Subtle gradient for depth */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#sf-grad)" />

      {/* S letter — clean single stroke */}
      <text
        x="10"
        y="29"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="hsl(220 16% 8%)"
        letterSpacing="-1"
      >SF</text>

      <defs>
        <linearGradient id="sf-grad" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="black" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  );
}
