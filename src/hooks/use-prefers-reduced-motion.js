import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Tracks the OS "reduce motion" setting and updates if the user changes it
// while the page is open. framer-motion handles its own components through
// MotionConfig; this is for the animations it does not own, like the particle
// canvas and the rotating hero word.
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const onChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
}
