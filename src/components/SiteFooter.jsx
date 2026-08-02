import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05] px-6 md:px-16 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          <span className="text-sm font-bold">CyberSyntax<span className="text-cyan-400">Hub</span></span>
        </Link>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CyberSyntax Hub. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/donate" className="hover:text-foreground transition-colors">Donate</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
