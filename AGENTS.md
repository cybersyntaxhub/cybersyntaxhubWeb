# AGENTS.md

Static marketing site for CyberSyntax Hub. React 18, Vite 6, Tailwind 3,
React Router 6, framer-motion. No backend, no auth, no environment config.

Read `README.md` first for layout and scripts.

## Before finishing any change

```bash
npm run lint
npm run build
```

Both must pass. `npm run build` is the real check — ESLint will not catch a
broken import path.

## House rules

- **Claims must be true.** This site previously advertised "500+ students
  enrolled", "50+ expert mentors" and a "95% success rate", none of which came
  from anywhere. Do not add a statistic, testimonial, logo wall, rating or
  headcount that nobody can point to a source for. If a number is wanted and
  no number exists, write prose instead.
- **Do not link to routes that do not exist.** An earlier student/mentor
  dashboard was removed and the copy kept referring to it for months. Check
  `src/App.jsx` before writing any internal link.
- **Keep the visual design.** The dark palette, the cyan accent, the particle
  canvas and the gradient headings are deliberate. Change structure, copy and
  behaviour freely; do not restyle.
- **Every page needs `useSeo`.** Title, description and path. See the "Adding
  a route" checklist in `README.md` — it also covers the sitemap entry.
- **Respect reduced motion.** `MotionConfig reducedMotion="user"` in `App.jsx`
  covers framer-motion components. Anything hand-rolled — canvas work, a
  `setInterval` that moves something — must check
  `usePrefersReducedMotion()` itself.
- **Mobile is not optional.** The header had no mobile menu at all for a
  while. Check every change under 768px.
- **Do not add a dependency for something small.** The manifest carried 62
  unused packages at one point, including Stripe, Supabase, Express and
  Postgres. Pull UI components in one at a time with
  `npx shadcn@latest add <name>`.

## Palette

Defined as HSL custom properties in `src/index.css` under `:root`, consumed
through Tailwind's semantic names (`bg-background`, `text-muted-foreground`).
Use those names rather than hardcoding hex values. The per-track accent colours
are the exception — they live in the `tracks` array in `src/pages/Landing.jsx`
because they are data, not theme.

## Known rough edges

- Per-route metadata is client-side only, so social scrapers preview homepage
  copy for deep links. Needs prerendering to fix properly.
- `public/logo.png` is really a 731x731 JPEG with a `.png` extension. It has no
  transparency and it is 468 kB. It needs re-exporting as a PNG or SVG, along
  with a proper 1200x630 Open Graph image.
- `react-router-dom` is pinned on 6.x, which carries two moderate advisories.
  Neither is reachable here: one needs a user-controlled navigation target
  (every `to` in this app is a literal) and the other needs SSR hydration
  (this app is client-only). Clearing them means a v7 major upgrade.
