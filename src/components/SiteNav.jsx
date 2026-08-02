import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Tracks', href: '/#tracks' },
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'About', href: '/about' },
];

export default function SiteNav() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 flex items-center justify-between px-6 md:px-16 py-5 border-b border-white/[0.04] backdrop-blur-sm"
    >
      <Link to="/" className="flex items-center gap-2.5">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="w-9 h-9 object-contain"
          whileHover={{ scale: 1.08, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}
        />
        <span className="text-lg font-bold tracking-tight">CyberSyntax<span className="text-cyan-400">Hub</span></span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        {navLinks.map(item => (
          <Link key={item.label} to={item.href} className="hover:text-foreground transition-colors">
            {item.label}
          </Link>
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
  );
}
