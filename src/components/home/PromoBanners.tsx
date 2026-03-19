import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface BannerSlot {
  /** Image URL — supports any web image format */
  imageSrc?: string;
  /** MP4/WebM URL — plays as a looping muted video */
  videoSrc?: string;
  /** Alt text for image / aria-label for the banner */
  alt?: string;
  /** Optional link destination */
  href?: string;
  /** Overlay text shown when no media is set */
  placeholderLabel?: string;
}

interface PromoBannersProps {
  /** Wide center banner */
  main?: BannerSlot;
  /** Left side banner */
  left?: BannerSlot;
  /** Right side banner */
  right?: BannerSlot;
  className?: string;
}

function BannerMedia({ slot, className }: { slot: BannerSlot; className?: string }) {
  const inner = slot.videoSrc ? (
    <video
      src={slot.videoSrc}
      autoPlay
      muted
      loop
      playsInline
      aria-label={slot.alt}
      className="absolute inset-0 w-full h-full object-cover"
    />
  ) : slot.imageSrc ? (
    <img
      src={slot.imageSrc}
      alt={slot.alt ?? ''}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
  ) : (
    /* Placeholder state — shown until real media is uploaded */
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
      </svg>
      <span className="text-xs font-medium">{slot.placeholderLabel ?? 'Banner spot'}</span>
    </div>
  );

  const content = (
    <div className={cn('relative overflow-hidden rounded-2xl bg-muted/20 border border-dashed border-border/40 transition-all duration-200 hover:border-primary/30', className)}>
      {inner}
    </div>
  );

  if (slot.href) {
    return <Link to={slot.href} className="block">{content}</Link>;
  }
  return content;
}

/**
 * PromoBanners — "curtain" banner section.
 *
 * Desktop layout: [left side] [wide center] [right side]
 * Mobile layout:  center banner only (sides hidden).
 *
 * All three slots support image, video (MP4/WebM), or show a placeholder.
 * To activate a slot, pass an `imageSrc` or `videoSrc` on the slot object.
 */
export function PromoBanners({ main, left, right, className }: PromoBannersProps) {
  const mainSlot: BannerSlot = main ?? { placeholderLabel: 'Main banner' };
  const leftSlot: BannerSlot = left ?? { placeholderLabel: 'Side banner' };
  const rightSlot: BannerSlot = right ?? { placeholderLabel: 'Side banner' };

  return (
    <section className={cn('container py-6', className)}>
      <div className="flex gap-4 items-stretch">
        {/* Left side banner — desktop only */}
        <div className="hidden lg:block w-52 shrink-0">
          <BannerMedia slot={leftSlot} className="h-full min-h-[200px]" />
        </div>

        {/* Main center banner */}
        <div className="flex-1 min-w-0">
          <BannerMedia slot={mainSlot} className="h-[200px] lg:h-[240px]" />
        </div>

        {/* Right side banner — desktop only */}
        <div className="hidden lg:block w-52 shrink-0">
          <BannerMedia slot={rightSlot} className="h-full min-h-[200px]" />
        </div>
      </div>
    </section>
  );
}
