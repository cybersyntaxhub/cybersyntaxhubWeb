import { useEffect } from 'react';

const SITE_NAME = 'CyberSyntax Hub';

// Keep in sync with the canonical origin in index.html, public/robots.txt and
// public/sitemap.xml. See "Changing the domain" in README.md.
const SITE_ORIGIN = 'https://cybersyntaxhub.vercel.app';

// Sets the per-route title, description, canonical URL and robots directive.
//
// index.html carries the static defaults. Because this is a client-rendered
// SPA, these updates are only seen by crawlers that execute JavaScript -
// social link scrapers read the raw HTML response, so sharing a deep link
// previews the homepage copy until the site is prerendered.
export function useSeo({ title, description, path, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const previousTitle = document.title;
    const restores = [];

    document.title = fullTitle;

    const override = (selector, attr, value) => {
      const el = document.head.querySelector(selector);
      if (!el) return;
      const previous = el.getAttribute(attr);
      el.setAttribute(attr, value);
      restores.push(() => el.setAttribute(attr, previous));
    };

    override('meta[property="og:title"]', 'content', fullTitle);
    override('meta[name="twitter:title"]', 'content', fullTitle);

    if (description) {
      override('meta[name="description"]', 'content', description);
      override('meta[property="og:description"]', 'content', description);
      override('meta[name="twitter:description"]', 'content', description);
    }

    if (path) {
      const url = `${SITE_ORIGIN}${path}`;
      override('link[rel="canonical"]', 'href', url);
      override('meta[property="og:url"]', 'content', url);
    }

    // The SPA rewrite serves unknown paths with a 200, so a 404 route has to
    // ask to be left out of the index explicitly.
    if (noindex) {
      const robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      robots.setAttribute('content', 'noindex');
      document.head.appendChild(robots);
      restores.push(() => robots.remove());
    }

    return () => {
      document.title = previousTitle;
      for (const restore of restores) restore();
    };
  }, [title, description, path, noindex]);
}
