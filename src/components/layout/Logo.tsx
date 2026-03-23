import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * SnusFriend logo — premium shield/crest with SF monogram.
 * Teal-to-emerald gradient shield with gold accent border and elegant serif letters.
 * Works at all sizes (16–64px).
 */
export function Logo({ className, size = 40 }: LogoProps) {
  const id = 'sf-logo'; // unique prefix for gradient IDs
  return (
    <svg
      viewBox="0 0 40 48"
      width={size}
      height={size * 1.2}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-label="SnusFriend"
    >
      <defs>
        {/* Shield gradient — teal to deep emerald */}
        <linearGradient id={`${id}-bg`} x1="20" y1="0" x2="20" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="0.5" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#0d7369" />
        </linearGradient>
        {/* Gold accent for border highlight */}
        <linearGradient id={`${id}-gold`} x1="20" y1="0" x2="20" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fcd34d" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="1" stopColor="#d97706" stopOpacity="0.5" />
        </linearGradient>
        {/* Inner glow */}
        <radialGradient id={`${id}-glow`} cx="50%" cy="30%" r="60%">
          <stop offset="0" stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        {/* Shimmer sweep — diagonal light sweep across shield */}
        <linearGradient id={`${id}-shimmer`} x1="0" y1="0" x2="40" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0">
            <animate attributeName="offset" values="-0.3;1.3" dur="4s" begin="0.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="0.1" stopColor="white" stopOpacity="0.35">
            <animate attributeName="offset" values="-0.2;1.4" dur="4s" begin="0.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="0.2" stopColor="white" stopOpacity="0">
            <animate attributeName="offset" values="-0.1;1.5" dur="4s" begin="0.5s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>

      {/* Shield shape — pointed bottom crest */}
      <path
        d="M4 6C4 3.79 5.79 2 8 2h24c2.21 0 4 1.79 4 4v22c0 3-2 6-5.5 9.5L20 46l-10.5-8.5C6 34 4 31 4 28V6z"
        fill={`url(#${id}-bg)`}
      />

      {/* Gold border accent */}
      <path
        d="M4 6C4 3.79 5.79 2 8 2h24c2.21 0 4 1.79 4 4v22c0 3-2 6-5.5 9.5L20 46l-10.5-8.5C6 34 4 31 4 28V6z"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="1.5"
      />

      {/* Inner glow for depth */}
      <path
        d="M4 6C4 3.79 5.79 2 8 2h24c2.21 0 4 1.79 4 4v22c0 3-2 6-5.5 9.5L20 46l-10.5-8.5C6 34 4 31 4 28V6z"
        fill={`url(#${id}-glow)`}
      />

      {/* Shimmer sweep — premium metallic light catch effect */}
      <path
        d="M4 6C4 3.79 5.79 2 8 2h24c2.21 0 4 1.79 4 4v22c0 3-2 6-5.5 9.5L20 46l-10.5-8.5C6 34 4 31 4 28V6z"
        fill={`url(#${id}-shimmer)`}
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Horizontal divider line — subtle gold accent */}
      <line x1="10" y1="22" x2="30" y2="22" stroke="#fcd34d" strokeOpacity="0.3" strokeWidth="0.75" />

      {/* SF monogram — elegant weight */}
      <text
        x="20"
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontWeight="700"
        fontSize="16"
        fill="hsl(220 20% 10%)"
        letterSpacing="1"
      >SF</text>

      {/* Small crown/star accent above letters */}
      <path
        d="M17 8l1.5-2 1.5 1.5L21.5 6 23 8"
        stroke="#fcd34d"
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
