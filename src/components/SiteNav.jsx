import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Tracks', to: '/#tracks' },
  { label: 'How it Works', to: '/#how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const focusRing =
  'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const toggleRef = useRef(null);

  // Any navigation closes the menu, including same-page hash links.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const isActive = (to) =>
    to.startsWith('/#') ? pathname === '/' && hash === to.slice(1) : pathname === to;

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 border-b border-white/[0.04] backdrop-blur-sm"
    >
      <nav aria-label="Main" className="flex items-center justify-between px-6 md:px-16 py-5">
        <Link to="/" className={`flex items-center gap-2.5 ${focusRing}`}>
          <motion.img
            src="/logo.png"
            alt=""
            className="w-9 h-9 object-contain"
            whileHover={{ scale: 1.08, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}
          />
          <span className="text-lg font-bold tracking-tight">CyberSyntax<span className="text-cyan-400">Hub</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={`transition-colors ${focusRing} ${
                isActive(item.to) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className={`md:hidden -mr-2 p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors ${focusRing}`}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-white/[0.04] bg-background/95"
          >
            <div className="flex flex-col px-6 py-2">
              {[...navLinks, { label: 'Donate', to: '/donate' }].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                  className={`py-3 border-b border-white/[0.04] last:border-0 transition-colors ${focusRing} ${
                    isActive(item.to) ? 'text-cyan-400' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
