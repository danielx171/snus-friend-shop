import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * SnusFriend logo — a stylized pouch can viewed from above.
 * The outer ring represents the can lid, the inner shapes suggest pouches.
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
      {/* Can lid — outer ring */}
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" opacity="0.9" />
      {/* Inner ring — lid edge detail */}
      <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {/* Pouch shape 1 — left */}
      <ellipse cx="15" cy="19" rx="4.5" ry="6" fill="currentColor" opacity="0.25" transform="rotate(-15 15 19)" />
      {/* Pouch shape 2 — right */}
      <ellipse cx="25" cy="19" rx="4.5" ry="6" fill="currentColor" opacity="0.25" transform="rotate(15 25 19)" />
      {/* Center dot — brand mark */}
      <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.8" />
      {/* Lid snap indicator — small tab */}
      <rect x="18" y="3" width="4" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
