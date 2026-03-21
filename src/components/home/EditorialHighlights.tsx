import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const highlights = [
  {
    title: 'Flavor Guide',
    blurb: 'From icy mint to tropical fruit — discover your perfect pouch flavor with our curated guide.',
    href: '/nicotine-pouches',
    emoji: '🍃',
    gradient: 'linear-gradient(135deg, hsl(220 100% 10%) 0%, rgba(40,80,60,0.3) 100%)',
    gradientHover: 'linear-gradient(135deg, hsl(220 100% 12%) 0%, rgba(40,80,60,0.45) 100%)',
  },
  {
    title: 'Strength Guide',
    blurb: "Whether you're a beginner or a veteran, find the right nicotine strength for your lifestyle.",
    href: '/nicotine-pouches?strength=strong',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, hsl(220 100% 10%) 0%, rgba(80,60,30,0.3) 100%)',
    gradientHover: 'linear-gradient(135deg, hsl(220 100% 12%) 0%, rgba(80,60,30,0.45) 100%)',
  },
  {
    title: 'New Drops',
    blurb: 'Fresh arrivals from ZYN, VELO, and more. Be the first to try the latest releases.',
    href: '/nicotine-pouches?badge=new',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, hsl(220 100% 10%) 0%, rgba(30,50,100,0.3) 100%)',
    gradientHover: 'linear-gradient(135deg, hsl(220 100% 12%) 0%, rgba(30,50,100,0.45) 100%)',
  },
];

export function EditorialHighlights() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mb-10">
          <motion.h2
            className="text-3xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Explore & Discover
          </motion.h2>
          <motion.p
            className="text-gray-400 mt-2 max-w-lg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Curated guides and collections to help you find your perfect nicotine pouch.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            >
              <Link
                to={item.href}
                className="group relative block h-[280px] rounded-2xl border border-white/10 bg-white/[0.08] overflow-hidden transition-all duration-200 ease-out hover:border-white/20 hover:-translate-y-0.5"
              >
                {/* Large emoji watermark */}
                <span
                  className="pointer-events-none absolute -top-2 -right-2 select-none"
                  style={{ fontSize: 120, opacity: 0.08, transform: 'rotate(-15deg)' }}
                  aria-hidden="true"
                >
                  {item.emoji}
                </span>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-6">
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{item.blurb}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
