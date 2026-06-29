import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Shield, Zap, ChevronDown, Star, Code2, Brain, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CyberSecurityIcon, BioTechIcon, FinanceIcon, DataScienceIcon } from '@/components/AnimatedIcons';
import ParticleBackground from '@/components/ParticleBackground';

const tracks = [
  { name: 'CyberSecurity', desc: 'Master ethical hacking, threat analysis, and defense systems at the cutting edge.', Icon: CyberSecurityIcon, color: '#00f0ff', bg: 'from-cyan-500/10 to-cyan-500/0', border: 'border-cyan-500/20 hover:border-cyan-500/60' },
  { name: 'BioTech', desc: 'Explore bioinformatics, genomics, and the future of computational biology.', Icon: BioTechIcon, color: '#39ff14', bg: 'from-green-500/10 to-green-500/0', border: 'border-green-500/20 hover:border-green-500/60' },
  { name: 'Finance', desc: 'Quantitative analysis, algorithmic trading, DeFi, and modern fintech systems.', Icon: FinanceIcon, color: '#ffd700', bg: 'from-yellow-500/10 to-yellow-500/0', border: 'border-yellow-500/20 hover:border-yellow-500/60' },
  { name: 'Data Science', desc: 'Build deep expertise in ML, AI, neural networks, and large-scale analytics.', Icon: DataScienceIcon, color: '#a855f7', bg: 'from-purple-500/10 to-purple-500/0', border: 'border-purple-500/20 hover:border-purple-500/60' },
];

const stats = [
  { val: '500+', label: 'Students Enrolled', icon: Users },
  { val: '50+', label: 'Expert Mentors', icon: Brain },
  { val: '4', label: 'Specialized Tracks', icon: Code2 },
  { val: '95%', label: 'Success Rate', icon: TrendingUp },
];

const steps = [
  { num: '01', icon: Users, title: 'Apply & Get Matched', desc: 'Complete your profile, upload your resume, and select your interest tracks. Our mentors review every application personally.' },
  { num: '02', icon: Shield, title: 'Get Accepted', desc: 'Once accepted, you unlock your full dashboard — announcements, direct messaging, assignments, and course content.' },
  { num: '03', icon: BookOpen, title: 'Learn & Grow', desc: 'Work through mentor-built courses, complete assignments with real feedback, and communicate directly 1-on-1.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }),
};

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const step = Math.ceil(num / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(interval); } else { setCount(start); }
    }, 30);
    return () => clearInterval(interval);
  }, [target]);
  return <>{typeof count === 'number' ? count : count}{suffix}</>;
}

export default function Landing() {
  const [activeTrack, setActiveTrack] = useState(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ParticleBackground />

      {/* Radial glow top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/4 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* NAV */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex items-center justify-between px-6 md:px-16 py-5 border-b border-white/[0.04] backdrop-blur-sm"
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/20"
            whileHover={{ scale: 1.08, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}
          >
            <Zap className="w-5 h-5 text-black" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight">CyberSyntax<span className="text-cyan-400">Hub</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {['Tracks', 'How it Works', 'Mentors'].map(item => (
            <motion.a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="hover:text-foreground transition-colors cursor-pointer"
              whileHover={{ y: -1 }}>
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/signin">
            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">Sign In</Button>
          </Link>
          <Link to="/signup">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="text-sm bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 shadow-lg shadow-cyan-500/20">
                Get Started
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.nav>

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
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Next-Gen Mentorship Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] max-w-5xl"
        >
          Learn from the
          <motion.span
            className="block bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-500 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ backgroundSize: '200% 200%' }}
          >
            best in tech
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-7 text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Connect with elite industry mentors across CyberSecurity, BioTech, Finance & Data Science.
          <span className="text-foreground/60"> Real guidance. Measurable growth.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link to="/signup">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 text-base h-12 shadow-xl shadow-cyan-500/25 group">
                Apply as Student
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
          <Link to="/signup?role=mentor">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 hover:border-white/20 text-foreground font-semibold px-10 text-base h-12">
                Join as Mentor
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Trusted by line */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-14 flex items-center gap-3 text-sm text-muted-foreground"
        >
          <div className="flex -space-x-2">
            {['#00f0ff', '#39ff14', '#ffd700', '#a855f7', '#f472b6'].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold"
                style={{ background: `${c}22`, borderColor: `${c}44`, color: c }}>
                {['A','B','C','D','E'][i]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <span>500+ students mentored</span>
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
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Four Tracks. Infinite Potential.</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Choose your path and get matched with mentors who've built careers in your field.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {tracks.map((track, i) => (
            <motion.div
              key={track.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.25, ease: 'easeOut' } }}
              onHoverStart={() => setActiveTrack(track.name)}
              onHoverEnd={() => setActiveTrack(null)}
              className={`relative group p-8 rounded-2xl border bg-gradient-to-b ${track.bg} ${track.border} transition-all duration-300 cursor-default overflow-hidden`}
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

              <motion.div className="mt-6 flex items-center gap-1.5 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: track.color }}>
                <span>Explore track</span>
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 px-6 md:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex flex-col items-center justify-center py-12 px-6 bg-card text-center group hover:bg-white/[0.03] transition-colors"
              >
                <s.icon className="w-5 h-5 text-cyan-400 mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl md:text-5xl font-black text-cyan-400 font-mono">
                  <CountUp target={s.val.replace(/\D/g, '')} />{s.val.replace(/\d/g, '')}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
              </motion.div>
            ))}
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

          <motion.div className="inline-block w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-700 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/20 mx-auto"
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Zap className="w-8 h-8 text-black" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Ready to level up?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Join hundreds of students already learning from world-class mentors on CyberSyntax Hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 h-12 text-base shadow-xl shadow-cyan-500/25 group">
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/signup?role=mentor">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 px-10 h-12 text-base">
                  Become a Mentor
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 md:px-16 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold">CyberSyntax<span className="text-cyan-400">Hub</span></span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 CyberSyntax Hub. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}