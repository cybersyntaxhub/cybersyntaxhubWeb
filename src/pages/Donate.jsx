import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { usePageTitle } from '@/hooks/use-page-title';

const alternatives = [
  { icon: Mail, title: 'Spread the word', desc: 'Tell a student, teacher, or school about CyberSyntax Hub — reach matters more than money right now.', cta: 'Contact Us', to: '/contact' },
];

export default function Donate() {
  usePageTitle('Donate');

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <SiteNav />

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

      <section className="relative z-10 px-6 md:px-16 pb-24 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-5 max-w-md mx-auto">
          {alternatives.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-7 rounded-2xl border border-white/10 bg-card/40 hover:border-cyan-500/40 transition-colors flex flex-col"
            >
              <item.icon className="w-6 h-6 text-cyan-400 mb-4" />
              <h3 className="font-bold text-lg mb-2 tracking-tight">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{item.desc}</p>
              <Link to={item.to}>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 group">
                  {item.cta}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
