const ITEMS = [
  '🏆 Earn 10 SnusPoints per €1 spent',
  '🎁 500 points = free mystery box month',
  '⚡ New drops every week — 91 brands',
  '👑 VIP members get priority access',
];

const SEPARATOR = '•';

function MarqueeTrack() {
  return (
    <div className="flex items-center shrink-0 gap-0">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span>{item}</span>
          <span className="mx-4 text-[#D8ED62] text-lg select-none">{SEPARATOR}</span>
        </span>
      ))}
    </div>
  );
}

export function PromoMarquee() {
  return (
    <div
      className="overflow-hidden"
      style={{ backgroundColor: 'hsl(var(--primary))' }}
    >
      <div className="flex animate-marquee-scroll py-2.5">
        <MarqueeTrack />
        <MarqueeTrack />
        <MarqueeTrack />
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-scroll {
          animation: marquee-scroll 35s linear infinite;
          will-change: transform;
        }
        .animate-marquee-scroll span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: white;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
