import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Shield, ChevronDown, Code2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CyberSecurityIcon, BioTechIcon, FinanceIcon, DataScienceIcon } from '@/components/AnimatedIcons';
import PageShell from '@/components/PageShell';
import { useSeo } from '@/hooks/use-seo';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { CONTACT_EMAIL, CURRICULUM_URL, LEADERSHIP_FORM_URL } from '@/lib/site';

const tracks = [
  { name: 'CyberSecurity', desc: 'Master ethical hacking, threat analysis, and defense systems at the cutting edge.', Icon: CyberSecurityIcon, color: '#00f0ff', bg: 'from-cyan-500/10 to-cyan-500/0', border: 'border-cyan-500/20 hover:border-cyan-500/60', link: 'https://docs.google.com/document/d/1k_7dCSVX2pVyJxmZFknUcg_U32ERCjQsZEkUpSLLs5E/edit?tab=t.2fmno0j90s7z' },
  { name: 'AI', desc: 'Explore applied machine learning, intelligent systems, and practical AI product thinking.', Icon: DataScienceIcon, color: '#a855f7', bg: 'from-purple-500/10 to-purple-500/0', border: 'border-purple-500/20 hover:border-purple-500/60', link: 'https://docs.google.com/document/d/1k_7dCSVX2pVyJxmZFknUcg_U32ERCjQsZEkUpSLLs5E/edit?tab=t.sndvrxn4hr8r' },
  { name: 'Finance', desc: 'Quantitative analysis, algorithmic trading, DeFi, and modern fintech systems.', Icon: FinanceIcon, color: '#ffd700', bg: 'from-yellow-500/10 to-yellow-500/0', border: 'border-yellow-500/20 hover:border-yellow-500/60', link: 'https://docs.google.com/document/d/1k_7dCSVX2pVyJxmZFknUcg_U32ERCjQsZEkUpSLLs5E/edit?tab=t.maakuwfwdfa1' },
  { name: 'Data Science', desc: 'Build deep expertise in analytics, experimentation, and data-driven problem solving.', Icon: DataScienceIcon, color: '#8b5cf6', bg: 'from-fuchsia-500/10 to-fuchsia-500/0', border: 'border-fuchsia-500/20 hover:border-fuchsia-500/60', link: 'https://docs.google.com/document/d/1k_7dCSVX2pVyJxmZFknUcg_U32ERCjQsZEkUpSLLs5E/edit?tab=t.hafbia94qyj8' },
  { name: 'BioMed', desc: 'Investigate biomedical innovation, health technology, and research-driven discovery.', Icon: BioTechIcon, color: '#39ff14', bg: 'from-green-500/10 to-green-500/0', border: 'border-green-500/20 hover:border-green-500/60', link: 'https://docs.google.com/document/d/1k_7dCSVX2pVyJxmZFknUcg_U32ERCjQsZEkUpSLLs5E/edit?tab=t.i8eo6ds87x36' },
];

const rotatingHeroWords = tracks.map((track) => track.name);

const steps = [
  {
    num: '01',
    title: 'Pick a track',
    desc: 'Read through the curriculum for whichever of the five fields you want to go deep in. Every track outline is public — no sign-up needed to see what you would be learning.',
    actions: [{ label: 'Open the curriculum', href: CURRICULUM_URL, external: true }],
  },
  {
    num: '02',
    title: 'Get in touch',
    desc: 'Email us or apply for a leadership role. We will tell you what is running right now, what is still being built, and where you would fit.',
    actions: [
      { label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
      { label: 'Leadership application', href: LEADERSHIP_FORM_URL, external: true },
    ],
  },
  {
    num: '03',
    title: 'Build something real',
    desc: 'Work through your track, then take the optional capstone to build a portfolio project with mentor guidance.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Landing() {
  useSeo({ path: '/' });
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  // WCAG 2.2.2: content that moves on a loop needs a way to stop. Honouring
  // the OS setting is that control here, so reduce-motion visitors see the
  // first track name and nothing cycles.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % rotatingHeroWords.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <PageShell>
      {/* HERO */}
      <motion.section style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-20 md:pt-32 pb-24">

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5 backdrop-blur-sm"
        >
          <motion.span className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Student mentorship + growth lab</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] max-w-5xl"
        >
          Build real skills in
          <div className="block min-h-[1.1em]">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingHeroWords[heroWordIndex]}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                className="block bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-500 bg-clip-text text-transparent"
                style={{ backgroundSize: '200% 200%' }}
              >
                {rotatingHeroWords[heroWordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-7 text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          CyberSyntax Hub is a student-led mentorship and skill-building program. Work through a technology track at your own pace, with guided support, hands-on projects and mentor feedback.
          <span className="text-foreground/60"> Every track outline is public — read it before you commit to anything.</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a href={LEADERSHIP_FORM_URL} target="_blank" rel="noreferrer noopener">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" variant="secondary" className="bg-slate-800 border border-slate-700 text-white font-semibold px-10 text-base h-12 hover:bg-slate-700">
                Leadership Application
              </Button>
            </motion.div>
          </a>
          <a href={CURRICULUM_URL} target="_blank" rel="noreferrer noopener">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" variant="outline" className="border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 font-semibold px-10 text-base h-12">
                See the curriculum
              </Button>
            </motion.div>
          </a>
        </motion.div>

        <motion.div className="mt-16 flex flex-col items-center gap-2 text-muted-foreground"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-xs font-mono tracking-widest uppercase opacity-50">Scroll</span>
          <ChevronDown className="w-4 h-4 opacity-40" />
        </motion.div>
      </motion.section>

      {/* TRACKS */}
      <section id="tracks" className="relative z-10 px-6 md:px-16 py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-muted-foreground tracking-wider uppercase mb-4">
            Specializations
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Five Tracks, One Community</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Pick the field you want to go deep in. Each track has its own curriculum and project path.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {tracks.map((track, i) => (
            <motion.a
              key={track.name}
              href={track.link}
              target="_blank"
              rel="noreferrer noopener"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.25, ease: 'easeOut' } }}
              className={`relative group p-8 rounded-2xl border bg-gradient-to-b ${track.bg} ${track.border} transition-all duration-300 cursor-pointer overflow-hidden`}
            >
              {/* Glow bg */}
              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${track.color}10, transparent 70%)` }} />

              {/* Corner tag */}
              <motion.div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
                style={{ background: track.color }}
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />

              <track.Icon className="w-16 h-16 mb-7" />

              <h3 className="text-lg font-bold mb-2.5 tracking-tight" style={{ color: track.color }}>
                {track.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{track.desc}</p>

              {/* group-focus-visible as well as group-hover, or keyboard users
                  never see the affordance. */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-mono opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{ color: track.color }}>
                <span>Explore track<span className="sr-only"> (opens in a new tab)</span></span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* CAPSTONE MENTORSHIP */}
      <section className="relative z-10 px-6 md:px-16 py-24">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-muted-foreground tracking-wider uppercase mb-4">
            Capstone Mentorship
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Complete the program with optional 1:1 mentorship</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            CyberSyntaxHub gives you a capstone path that requires only the one core specialization for your chosen field.
            Finance is ideal for fintech, BioMed for biotech, AI for AI programming, and the same applies to the other tracks.
          </p>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Prerequisite: complete the fundamental mentorship course or demonstrate adequate experience in the field.
            Then choose the single track that matches your capstone focus and build a portfolio-ready project with mentor guidance.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/60 to-slate-900/80 p-10 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-400 font-semibold">Optional continuation</p>
                <h3 className="text-3xl font-black mt-4">Capstone Project & Mentorship</h3>
              </div>
              <div className="h-14 w-14 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                <Code2 className="w-7 h-7" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base mb-8">
              Choose an extra mentorship experience where you learn to program in your chosen field, build a real-world project, and receive expert feedback throughout the journey.
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground mb-3">What you get</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>1:1 mentor coaching with project guidance</li>
                <li>Hands-on field-focused programming practice</li>
                <li>Portfolio-ready capstone deliverable</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold">Real Product Work</div>
                <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Build a field-specific project that demonstrates your programming capability to future employers or academic partners.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold">Mentor Coaching</div>
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Brain className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Receive direct guidance on technical decisions, workflows, and career-ready deliverables.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold">Industry Skills</div>
                <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Gain practical programming experience in the context of security, AI, finance, BioMed or data science.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold">Career Preparation</div>
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Build confidence with mentor feedback and a completed capstone showcase for future steps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-16 py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-muted-foreground tracking-wider uppercase mb-4">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">How It Works</h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex gap-8 items-start mb-12 last:mb-0 group"
            >
              {/* Step number + connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <motion.div
                  className="w-14 h-14 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center group-hover:border-cyan-500/60 group-hover:bg-cyan-500/10 transition-all duration-300"
                  whileHover={{ scale: 1.08 }}
                >
                  <span className="text-cyan-400 font-mono text-sm font-bold">{step.num}</span>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div className="w-px h-12 mt-2 bg-gradient-to-b from-cyan-500/30 to-transparent"
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }} style={{ transformOrigin: 'top' }} />
                )}
              </div>
              <div className="pt-3">
                <h3 className="font-bold text-xl mb-2 tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                {step.actions && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
                    {step.actions.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        {...(action.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <span className="break-all">{action.label}</span>
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative z-10 px-6 md:px-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/8 via-background to-purple-500/8 p-16 text-center"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-cyan-500/20 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-purple-500/20 rounded-br-3xl" />

          <motion.img
            src="/logo.png"
            alt=""
            className="w-16 h-16 object-contain mb-6 mx-auto"
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
          />

          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Ready to start?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Read a track outline, then send us a message. We will tell you what is running right now and where you would fit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 font-semibold px-10 text-base h-12">
                  Contact the team
                </Button>
              </motion.div>
            </Link>
            <a href={LEADERSHIP_FORM_URL} target="_blank" rel="noreferrer noopener">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-white font-semibold px-10 text-base h-12 hover:bg-slate-700">
                  Apply for a role
                </Button>
              </motion.div>
            </a>
          </div>
        </motion.div>
      </section>

    </PageShell>
  );
}
