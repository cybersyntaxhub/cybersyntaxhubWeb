import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { usePageTitle } from '@/hooks/use-page-title';

export default function NotFound() {
  usePageTitle('Page not found');
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <SiteNav />

      <section className="relative z-10 flex-1 px-6 md:px-16 pt-24 pb-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-8xl font-black font-mono text-cyan-400/25 tracking-tight"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mt-6 text-3xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-[1.1]"
        >
          This page doesn&apos;t
          <span className="block bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-500 bg-clip-text text-transparent">
            exist.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-6 text-muted-foreground text-lg max-w-md mx-auto"
        >
          Nothing lives at <code className="font-mono text-foreground/70 break-all">{pathname}</code>. It may have moved, or the link that brought you here may be out of date.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 font-semibold px-8 h-12 group">
              <ArrowLeft className="mr-1 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 px-8 h-12">
              <Mail className="mr-1 w-4 h-4" />
              Report a broken link
            </Button>
          </Link>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
