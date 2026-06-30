import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banner, IMG_BASE } from "@/data/landingShowcase";
import { landingSrcSet } from "@/lib/responsiveImages";

/** Module A — a swipeable band of looks. Mixes bold hero shots with intimate
 *  close-ups, alternating zoom so it never feels monotonous, and builds toward
 *  a finale of statement pieces. Auto-drifts gently but is fully finger-/arrow-
 *  scrollable; the drift pauses while you interact. */

// Hand-picked close-up / simpler shots (png maps to the product handle ending
// in that number); images live in /landing/<png>.webp.
const featureItems = [
  { png: 80, href: "/product/naelia-bracelet80" },
  { png: 180, href: "/product/ziolia-necklace180" },
  { png: 297, href: "/product/giovia-earrings297" },
  { png: 308, href: "/product/raelia-earrings308" },
  { png: 460, href: "/product/vealia-necklace460" },
  { png: 532, href: "/product/laevia-bracelet532" },
  { png: 98, href: "/product/saunia-earrings98" },
];

// Curated narrative order. Early on, each bold hero (wide) is answered by an
// intimate close-up — a rhythm of "the look, then the detail" — with the
// category rotating so no two neighbours repeat; it then opens up into a finale
// of statement pieces. Hrefs are resolved from the data so they never drift.
const STORY_PNGS = [423, 80, 160, 297, 75, 180, 585, 308, 493, 98, 174, 263, 460, 532, 507, 38];

const hrefByPng = new Map<number, string>(
  [...banner, ...featureItems].map((item) => [item.png, item.href]),
);
const ordered = STORY_PNGS.map((png) => ({ png, href: hrefByPng.get(png) })).filter(
  (item): item is { png: number; href: string } => Boolean(item.href),
);

export const StackingBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Duplicate the set so the gentle auto-drift can wrap seamlessly at the midpoint.
  const loop = [...ordered, ...ordered];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let paused = false;
    let visible = true;
    let timer: number | undefined;
    let resumeTimer: number | undefined;

    const step = () => {
      el.scrollLeft += 1;
      const half = el.scrollWidth / 2;
      if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
    };
    // Run the drift only when on-screen, tab-visible, and not being interacted
    // with — otherwise clear the timer entirely (no idle CPU, no battery drain).
    const sync = () => {
      const shouldRun = !paused && visible && !document.hidden;
      if (shouldRun && timer === undefined) timer = window.setInterval(step, 30);
      else if (!shouldRun && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };
    const pause = () => { paused = true; window.clearTimeout(resumeTimer); sync(); };
    const resume = () => { paused = false; sync(); };
    const resumeSoon = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(resume, 2500);
    };

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resumeSoon);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeSoon);
    el.addEventListener("wheel", resumeSoon, { passive: true });
    document.addEventListener("visibilitychange", sync);

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    io.observe(el);

    sync();

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      window.clearTimeout(resumeTimer);
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 660), behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loop.map((b, i) => (
          <Link
            key={`${b.png}-${i}`}
            to={b.href}
            aria-label="Rent this look"
            className="group block shrink-0"
            tabIndex={i < ordered.length ? 0 : -1}
          >
            <img
              src={`${IMG_BASE}${b.png}.webp`}
              srcSet={landingSrcSet(b.png)}
              sizes="(min-width: 1024px) 640px, (min-width: 768px) 520px, (min-width: 640px) 320px, 200px"
              alt=""
              aria-hidden="true"
              className="block h-[200px] w-[200px] sm:h-[320px] sm:w-[320px] md:h-[520px] md:w-[520px] lg:h-[640px] lg:w-[640px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </Link>
        ))}
      </div>

      {/* Arrow controls (clickable on all sizes; the obvious affordance on desktop) */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Previous looks"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[2] flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-[hsl(36_33%_96%_/_0.85)] text-foreground shadow-[0_4px_14px_hsl(30_12%_10%_/_0.18)] backdrop-blur-[2px] transition-transform hover:scale-105"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Next looks"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[2] flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-[hsl(36_33%_96%_/_0.85)] text-foreground shadow-[0_4px_14px_hsl(30_12%_10%_/_0.18)] backdrop-blur-[2px] transition-transform hover:scale-105"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* "you can scroll" hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.22em] text-foreground"
          style={{ background: "hsl(36 33% 96% / 0.85)", boxShadow: "0 4px 14px hsl(30 12% 10% / 0.16)" }}
        >
          <ChevronLeft className="h-3 w-3" />
          Swipe to explore
          <span aria-hidden="true" style={{ color: "var(--poppy-deep)" }}>✿</span>
          <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </section>
  );
};
