import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * SnusFriend logo — a bold "SF" monogram inside a rounded shield shape.
 * Teal primary color with a clean, modern feel. Works at all sizes (16–64px).
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

      {/* Inner shadow for depth */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#sf-grad)" />

      {/* "S" letter */}
      <path
        d="M12 16.5c0-2.5 2-4 4.5-4 2.2 0 4 1.2 4 3.2 0 3.6-8 3.2-8 7.2 0 2.2 2 3.6 4.5 3.6 2.5 0 4.5-1.5 4.5-3.5"
        stroke="hsl(220 16% 8%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* "F" letter */}
      <path
        d="M24 12.5h6.5M24 12.5v14M24 19.5h5"
        stroke="hsl(220 16% 8%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="sf-grad" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0.15" />
          <stop offset="1" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
