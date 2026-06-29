import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LogOut } from 'lucide-react';
import { useAppAuth } from '@/lib/appAuth.jsx';

export default function DashboardSidebar({ items }) {
  const location = useLocation();
  const { currentUser, logout } = useAppAuth();

  return (
    <aside className="w-64 min-h-screen border-r border-white/5 bg-card/50 flex flex-col">
      <div className="p-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-bold">CyberSyntax<span className="text-cyan-400">Hub</span></span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-cyan-500/10 text-cyan-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium truncate">{currentUser?.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
        </div>
        <button
          onClick={() => { logout(); window.location.href = '/'; }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/5 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}