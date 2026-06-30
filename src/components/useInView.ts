"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-triggered "has this scrolled into view yet" flag, used to fire the
// staggered reveal animations (.reveal-in / .reveal-item in globals.css) once a
// section enters the viewport. Falls back to visible when IntersectionObserver
// is unavailable (SSR / older browsers), so content is never stuck hidden.
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Deferred (not a synchronous setState in the effect body) so content
      // still un-hides when the observer API is missing.
      const t = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}
