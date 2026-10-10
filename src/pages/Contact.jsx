import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useSeo } from '@/hooks/use-seo';
import { CONTACT_EMAIL, LEADERSHIP_FORM_URL } from '@/lib/site';

export default function Contact() {
  useSeo({
    title: 'Contact',
    description:
      'Get in touch with CyberSyntax Hub. Students, prospective mentors, educators and anyone curious about what we are building can reach the team directly by email.',
    path: '/contact',
  });

  return (
    <PageShell>
      <section className="relative z-10 px-6 md:px-16 pt-24 pb-28 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-6"
        >
          Get in Touch
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight max-w-2xl mx-auto leading-[1.05] mb-6"
        >
          Questions? Ideas?
          <span className="block bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-500 bg-clip-text text-transparent">
            Let's talk.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-lg mx-auto mb-12"
        >
          Whether you're a student, a potential mentor, an educator, or just curious about what we're building — reach out directly.
        </motion.p>

        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
          className="inline-flex max-w-full items-center gap-3 px-6 sm:px-8 py-4 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-colors text-base sm:text-lg font-semibold"
        >
          <Mail className="w-5 h-5 flex-shrink-0 text-cyan-400" />
          <span className="break-all">{CONTACT_EMAIL}</span>
        </motion.a>

        <p className="text-sm text-muted-foreground mt-6">We're a small, student-run team — expect a reply within a few days.</p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mt-10"
        >
          Want to help run it?{' '}
          <a
            href={LEADERSHIP_FORM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
          >
            Apply for a leadership role
          </a>
          .
        </motion.p>
      </section>
    </PageShell>
  );
}
