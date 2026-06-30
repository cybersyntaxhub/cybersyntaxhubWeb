import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LogOut } from 'lucide-react';
import { useAppAuth } from '@/lib/appAuth.jsx';

export default function MobileSidebar({ items }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAppAuth();

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-card/90 backdrop-blur border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          <span className="text-sm font-bold">CSH</span>
        </Link>
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="md:hidden fixed inset-0 z-40 bg-card pt-16"
          >
            <nav className="p-4 space-y-1">
              {items.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                      active ? 'bg-cyan-500/10 text-cyan-400' : 'text-muted-foreground'
                    }`}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/5 absolute bottom-0 left-0 right-0">
              <p className="text-sm font-medium px-4 mb-1">{currentUser?.full_name}</p>
              <button
                onClick={() => { logout(); window.location.href = '/'; }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}