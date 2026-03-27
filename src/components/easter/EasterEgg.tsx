import React from 'react';
import { useEaster } from '@/context/EasterContext';
import { useToast } from '@/hooks/use-toast';

/** Hidden Easter egg — a tiny, nearly invisible egg icon */
export function EasterEgg() {
  const { isEasterMode, toggleEaster } = useEaster();
  const { toast } = useToast();

  const handleClick = () => {
    toggleEaster();
    if (!isEasterMode) {
      toast({
        title: 'You found the secret! Easter mode activated \u{1F430}',
        description: 'Look for the rabbit to turn it off.',
      });
    } else {
      toast({
        title: 'Easter mode deactivated',
        description: 'Back to normal. The egg is still here if you change your mind\u2026',
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="opacity-[0.15] hover:opacity-60 transition-opacity duration-500 text-xs leading-none select-none cursor-default focus:outline-none"
      aria-label="Secret Easter egg"
      title=""
    >
      {'\u{1F95A}'}
    </button>
  );
}
