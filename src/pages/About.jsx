import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { usePageTitle } from '@/hooks/use-page-title';

const team = [
  { name: 'Devansh Malhotra', role: 'Founder & Tech / Web Dev Lead' },
  { name: 'Nischal Konduru', role: 'Finance Lead' },
  { name: 'Sri Surya Aashrith Toletti', role: 'BioMed Lead' },
  { name: 'Shreshtha Kumar', role: 'Marketing & Public Lead' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

export default function About() {
  usePageTitle('About');

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/4 rounded-full blur-[100px] pointer-events-none z-0" />

      <SiteNav />

      {/* HEADER */}
      <section className="relative z-10 px-6 md:px-16 pt-20 pb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-6"
        >
          About Us
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-[1.05]"
        >
          Talent is universal.
          <span className="block bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-500 bg-clip-text text-transparent">
            Access isn't.
          </span>
        </motion.h1>
      </section>

      {/* MISSION */}
      <section className="relative z-10 px-6 md:px-16 py-16 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5">Our Mission</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
            <p>
              CyberSyntax Hub is a student-led nonprofit dedicated to making technology education, opportunities, and mentorship accessible to everyone. We believe talent is universal, but access to resources is not. Many students — especially those in underserved communities or from nontraditional backgrounds — never hear about research programs, internships, hackathons, competitions, scholarships, or emerging fields like artificial intelligence until it's too late.
            </p>
            <p>
              Our mission is to bridge that gap by creating a community where students can discover opportunities, develop technical skills, collaborate on meaningful projects, and build the confidence to pursue careers in STEM.
            </p>
            <p>
              Rather than focusing solely on teaching programming, we aim to create an ecosystem where students grow academically, professionally, and personally — through educational content, workshops, mentor connections, collaborative projects, and curated opportunities that strengthen resumes and open doors. Whether someone is writing their first line of code or preparing for college and internships, CyberSyntax Hub is here to help them reach the next stage of their journey.
            </p>
          </div>
        </motion.div>
      </section>

      {/* STORY */}
      <section className="relative z-10 px-6 md:px-16 py-16 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-card/50 p-8 md:p-10"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-muted-foreground tracking-wider uppercase mb-5">
            Founder's Note
          </span>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              CyberSyntax Hub was created after recognizing a common problem among students interested in technology. Throughout high school, I found that valuable opportunities — research programs, internships, coding competitions, hackathons, scholarships, and networking events — were scattered across countless websites, Discord servers, newsletters, and social media platforms. Many students missed life-changing opportunities simply because they never knew they existed or didn't know where to begin.
            </p>
            <p>
              As I became more involved in software development, artificial intelligence, research, and student organizations, I realized how much of my own growth came from opportunities I'd discovered through persistence and networking rather than through school alone. I wanted to build something that made those same opportunities easier for other students to find, while creating a community where students could learn from one another.
            </p>
            <p>
              CyberSyntax Hub began as an effort to share tech news, programming resources, and educational content, but it quickly evolved into a broader vision: a student-driven community where ambitious learners collaborate, innovate, and support each other's growth. Looking ahead, we plan to organize hackathons, technical workshops, mentorship programs, open-source initiatives, project incubators, speaker events, and community competitions that push students to solve real-world problems through technology.
            </p>
            <p>
              Our long-term vision is an international network of students, educators, researchers, and industry professionals working together to make high-quality STEM education more accessible — a place where students don't just consume information, but build projects, contribute to meaningful initiatives, discover opportunities, form lasting connections, and become the next generation of engineers, scientists, researchers, and entrepreneurs.
            </p>
            <p className="text-foreground/80 font-medium pt-2">— Devansh Malhotra, Founder</p>
          </div>
        </motion.div>
      </section>

      {/* TEAM */}
      <section id="team" className="relative z-10 px-6 md:px-16 py-20 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-muted-foreground tracking-wider uppercase mb-4">
            The Team
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Who's Behind This</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="p-6 rounded-2xl border border-white/10 bg-card/40 hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-4">
                {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <h3 className="font-bold tracking-tight">{member.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-16 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Want to be part of it?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 h-12 shadow-xl shadow-cyan-500/25 group">
              Apply as Student
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/signup?role=mentor">
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 px-8 h-12">
              Join as Mentor
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
