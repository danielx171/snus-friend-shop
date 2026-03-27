import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cartCount, openCart } from '@/stores/cart';

const HeaderCartButton = React.memo(function HeaderCartButton() {
  const count = useStore($cartCount);

  // Prevent hydration mismatch: server renders 0 (no localStorage),
  // so suppress the badge until after first client mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const displayCount = mounted ? count : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative text-foreground hover:text-primary transition"
      aria-label={`Shopping cart${displayCount > 0 ? `, ${displayCount} items` : ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {displayCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {displayCount > 99 ? '99+' : displayCount}
        </span>
      )}
    </button>
  );
});

export default HeaderCartButton;
