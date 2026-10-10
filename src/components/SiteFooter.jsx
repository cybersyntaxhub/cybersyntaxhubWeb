import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05] px-6 md:px-16 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
            <span className="text-sm font-bold">CyberSyntax<span className="text-cyan-400">Hub</span></span>
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors break-all"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav aria-label="Footer" className="flex gap-6 text-xs text-muted-foreground">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/donate" className="hover:text-foreground transition-colors">Donate</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>

        <p className="text-xs text-muted-foreground text-center md:text-right">
          © {new Date().getFullYear()} CyberSyntax Hub.
          <span className="block">Student-led nonprofit.</span>
        </p>
      </div>
    </footer>
  );
}
