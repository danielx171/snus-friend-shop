import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { EmptyTinSvg } from "@/components/ui/EmptyTinSvg";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

{/* notfound-gradient class defined in index.css with theme-aware colors */}
    </Layout>
  );
};

export default NotFound;
