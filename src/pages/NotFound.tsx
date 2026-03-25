import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function EmptyTinSvg() {
  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer tin ring */}
      <circle cx="75" cy="75" r="68" stroke="#1e3a5f" strokeWidth="4" fill="hsl(220 16% 10%)" />
      <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
      {/* Inner tin floor */}
      <circle cx="75" cy="75" r="52" fill="hsl(220 14% 8%)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Subtle embossed ring inside */}
      <circle cx="75" cy="75" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" fill="none" />
      {/* Lid shadow arc — 3D depth hint */}
      <path
        d="M 20 75 A 55 55 0 0 1 40 30"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small center dot — emboss */}
      <circle cx="75" cy="75" r="3" fill="rgba(255,255,255,0.06)" />
      {/* "Empty" dashed circle to suggest missing pouches */}
      <circle
        cx="75"
        cy="75"
        r="30"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        strokeDasharray="6 8"
        fill="none"
      />
    </svg>
  );
}

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout showNicotineWarning={false}>
      <SEO
        title="Page Not Found | SnusFriend"
        description="The page you're looking for doesn't exist."
        metaRobots="noindex,nofollow"
      />
      <div className="flex min-h-[60vh] items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          {/* 404 heading with animated gradient */}
          <motion.h1
            className="text-8xl sm:text-9xl font-bold tracking-tighter mb-4 notfound-gradient"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            404
          </motion.h1>

          <motion.p
            className="text-xl font-semibold text-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
          >
            This pouch is empty
          </motion.p>

          {/* Empty tin illustration */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.25 }}
          >
            <EmptyTinSvg />
          </motion.div>

          <motion.p
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
          >
            Let's get you back to the good stuff
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
          >
            <Button asChild size="lg" className="gap-2 rounded-2xl h-12 px-7 font-semibold glow-primary">
              <Link to="/nicotine-pouches">
                Browse All Pouches
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <style>{`
        .notfound-gradient {
          background: linear-gradient(135deg, hsl(220 80% 60%), hsl(270 70% 60%), hsl(220 80% 60%));
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: notfound-shift 4s ease-in-out infinite;
        }
        @keyframes notfound-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </Layout>
  );
};

export default NotFound;
