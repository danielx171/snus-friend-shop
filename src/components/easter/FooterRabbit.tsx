import React from 'react';
import { useEaster } from '@/context/EasterContext';
import { useToast } from '@/hooks/use-toast';

/** Rabbit that appears in footer during Easter mode — click to deactivate */
export function FooterRabbit() {
  const { isEasterMode, toggleEaster } = useEaster();
  const { toast } = useToast();

  if (!isEasterMode) return null;

  const handleClick = () => {
    toggleEaster();
    toast({
      title: 'Easter mode deactivated \u{1F407}',
      description: 'The rabbit has hopped away. Find the egg to bring it back!',
    });
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
      aria-label="Deactivate Easter mode"
    >
      <span className="animate-bounce">{'\u{1F407}'}</span>
      <span className="text-xs opacity-0 hover:opacity-100 transition-opacity">hop away</span>
    </button>
  );
}
