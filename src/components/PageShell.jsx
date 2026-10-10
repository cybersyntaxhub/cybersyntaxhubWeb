import ParticleBackground from '@/components/ParticleBackground';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

// The frame every route shares: background canvas, radial glows, header,
// footer, and the <main> landmark the skip link targets.
export default function PageShell({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:border focus:border-cyan-500/40 focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cyan-300"
      >
        Skip to content
      </a>

      <ParticleBackground />

      {/* Radial glows. Fixed so they stay put as the page scrolls. */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/4 rounded-full blur-[100px] pointer-events-none z-0" />

      <SiteNav />

      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
