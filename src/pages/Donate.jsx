import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/PageShell';
import { useSeo } from '@/hooks/use-seo';
import { LEADERSHIP_FORM_URL } from '@/lib/site';

export default function Donate() {
  useSeo({
    title: 'Donate',
    description:
      'CyberSyntax Hub is not accepting donations yet. We are putting proper financial infrastructure in place first. Here is how you can help in the meantime.',
    path: '/donate',
  });

  return (
    <PageShell>
      <section className="relative z-10 px-6 md:px-16 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          className="w-14 h-14 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 flex items-center justify-center mx-auto mb-8"
        >
          <Heart className="w-6 h-6 text-cyan-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight max-w-2xl mx-auto leading-[1.05] mb-6"
        >
          We're not accepting
          <span className="block bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-500 bg-clip-text text-transparent">
            donations yet.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto"
        >
          CyberSyntax Hub is a young, student-led nonprofit and we're still setting up proper financial infrastructure before we ask anyone for money. We'd rather take the time to do that right. Check back soon — or help in one of these ways in the meantime.
        </motion.p>
      </section>

      <section className="relative z-10 px-6 md:px-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto p-7 md:p-9 rounded-2xl border border-white/10 bg-card/40 hover:border-cyan-500/40 transition-colors"
        >
          <Megaphone className="w-6 h-6 text-cyan-400 mb-4" />
          <h2 className="font-bold text-lg mb-2 tracking-tight">Spread the word</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Tell a student, a teacher or a school about CyberSyntax Hub — reach matters more than money right now. If you
            want to get properly involved, we're also looking for people to help run the tracks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/contact" className="flex-1">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 group">
                Contact us
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href={LEADERSHIP_FORM_URL} target="_blank" rel="noreferrer noopener" className="flex-1">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 group">
                Apply for a role
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
