import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-based parallax.
 * Returns a ref to attach to the element and the current offset value.
 * `speed` controls intensity (0.1 = subtle, 0.5 = strong).
 */
export function useParallax(speed = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const windowH = window.innerHeight;
          // Element center relative to viewport center
          const centerDelta = rect.top + rect.height / 2 - windowH / 2;
          setOffset(centerDelta * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return { ref, offset };
}
