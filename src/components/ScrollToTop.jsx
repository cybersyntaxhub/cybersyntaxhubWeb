import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (navigationType === "POP") return;

    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: prefersReducedMotion ? "instant" : "smooth",
        });
      }, 50);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, navigationType, prefersReducedMotion]);

  return null;
}
