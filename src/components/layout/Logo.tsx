import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * SnusFriend logo — a stylised top-down view of an open nicotine pouch tin.
 * Circle with 3D lid-open shadow on the left, three pouch pill shapes inside.
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
      {/* 3D depth shadow — left edge of the tin */}
      <circle cx="19" cy="21" r="17" fill="#0d1f33" opacity="0.25" />
      {/* Tin body */}
      <circle cx="20" cy="20" r="17" fill="#0f1a2e" />
      {/* Tin rim */}
      <circle cx="20" cy="20" r="17" stroke="#1e3a5f" strokeWidth="2" />
      {/* Inner rim detail */}
      <circle cx="20" cy="20" r="13.5" stroke="#1e3a5f" strokeWidth="0.8" opacity="0.35" />

      {/* Pouch 1 — center-top */}
      <rect x="17" y="9" width="6" height="11" rx="3" fill="#c9a84c" opacity="0.85" transform="rotate(0 20 14.5)" />
      {/* Pouch 2 — bottom-left */}
      <rect x="17" y="9" width="6" height="11" rx="3" fill="#c9a84c" opacity="0.7" transform="rotate(-35 20 20)" />
      {/* Pouch 3 — bottom-right */}
      <rect x="17" y="9" width="6" height="11" rx="3" fill="#c9a84c" opacity="0.7" transform="rotate(35 20 20)" />

      {/* Subtle highlight on tin rim — top-right */}
      <path d="M30 8a17 17 0 0 1 4 7" stroke="white" strokeWidth="1" opacity="0.08" strokeLinecap="round" />
    </svg>
  );
}
