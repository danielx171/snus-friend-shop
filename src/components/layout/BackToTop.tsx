import { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={cn(
            'fixed bottom-6 right-6 z-40',
            'h-10 w-10 md:h-10 md:w-10 max-sm:h-9 max-sm:w-9',
            'flex items-center justify-center rounded-full',
            'bg-card/90 backdrop-blur-sm border border-border/30 shadow-lg',
            'text-muted-foreground',
            'hover:bg-primary hover:text-primary-foreground hover:scale-105',
            'transition-colors duration-200'
          )}
          aria-label="Back to top"
        >
          <ChevronUp className="h-[18px] w-[18px]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
