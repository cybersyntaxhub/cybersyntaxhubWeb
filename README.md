# CyberSyntax Hub

Marketing site for [CyberSyntax Hub](https://cybersyntaxhub.org), a student-led
nonprofit working to make technology education, opportunities and mentorship
accessible to every student.

Four routes: the landing page, About, Contact and Donate.

## Stack

- React 18 + Vite 6
- React Router 6 (client-side routing, no SSR)
- Tailwind CSS 3 with CSS custom properties for the palette
- framer-motion for animation
- shadcn/ui conventions for components (`components.json`)

## Setup

Requires Node 22 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints. There is no backend and no environment
configuration — the site is fully static.

## Scripts

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                  |
| `npm run build`     | Production build into `dist/`             |
| `npm run preview`   | Serve the built `dist/` locally           |
| `npm run lint`      | ESLint over the repo                      |
| `npm run lint:fix`  | ESLint with autofix                       |
| `npm run typecheck` | `tsc` over the JS via `jsconfig.json`     |

## Layout

```
index.html              static metadata: title, description, OG tags, canonical
public/                 logo, manifest, robots.txt, sitemap.xml
src/
  App.jsx               routes and the reduced-motion MotionConfig
  index.css             Tailwind layers and the palette custom properties
  components/
    SiteNav.jsx         header, desktop links and mobile menu
    SiteFooter.jsx      footer
    ParticleBackground.jsx  the animated canvas behind every page
    AnimatedIcons.jsx   per-track icons
    ScrollToTop.jsx     scroll restoration and hash-anchor handling
    ui/button.jsx       the one shadcn component in use
  hooks/
    use-seo.js          per-route title, description, canonical, robots
    use-prefers-reduced-motion.js
  pages/                Landing, About, Contact, Donate, NotFound
```

## Adding a UI component

The project follows shadcn/ui conventions and `components.json` is configured,
so pull in only what a page actually needs:

```bash
npx shadcn@latest add dialog
```

Unused components were removed deliberately — Tailwind scans every file under
`src/`, so components nothing imports still inflate the stylesheet.

## Changing the domain

The canonical origin is written in four places. All four need to agree:

- `index.html` — `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`
- `public/robots.txt` — the `Sitemap:` line
- `public/sitemap.xml` — every `<loc>`
- `src/hooks/use-seo.js` — `SITE_ORIGIN`

## Adding a route

1. Add the page under `src/pages/`.
2. Register it in `src/App.jsx`, above the catch-all `*` route.
3. Call `useSeo({ title, description, path })` at the top of the component.
4. Add a `<url>` entry to `public/sitemap.xml`.
5. Add it to `navLinks` in `src/components/SiteNav.jsx` if it belongs in the
   header.

## SEO caveat

Per-route metadata is applied client-side by `use-seo`. Crawlers that execute
JavaScript (Google) see it; social link scrapers read the raw HTML response and
will preview the homepage copy for deep links. Fixing that properly means
prerendering the routes at build time.

## Deployment

Static build, deployed on Vercel. `vercel.json` rewrites every path to
`/index.html` so client-side routing works on hard refresh.

```bash
npm run build   # outputs dist/
```
