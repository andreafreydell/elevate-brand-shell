import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { grid, IMG_BASE } from "@/data/landingShowcase";
import { SectionHeading } from "@/components/layout/SectionHeading";

/** Module C — tight Instagram feed, two rows, categories mixed together.
 *  Desktop: 2×12 half-size tiles, hover expands a tile over its neighbours.
 *  Mobile: 2 rows that flick horizontally (peek + nudge hint). */
export const StackingGrid = () => {
  // mix categories: column-major interleave -> necklace, earring, bracelet, charm, ...
  const mixed: typeof grid[number] = [];
  for (let j = 0; j < grid[0].length; j++) for (let r = 0; r < grid.length; r++) mixed.push(grid[r][j]);
  const cols = mixed.length / 2;
  const mobileOrder: typeof mixed = [];
  for (let j = 0; j < cols; j++) { mobileOrder.push(mixed[j], mixed[cols + j]); }

  const flickRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = flickRef.current;
    if (!el) return;
    let interacted = false;
    const stop = () => { interacted = true; el.removeEventListener("pointerdown", stop); el.removeEventListener("wheel", stop); };
    el.addEventListener("pointerdown", stop);
    el.addEventListener("wheel", stop, { passive: true });
    const nudge = () => {
      if (interacted || el.scrollLeft > 8) return;
      el.scrollBy({ left: 30, behavior: "smooth" });
      window.setTimeout(() => { if (!interacted) el.scrollBy({ left: -30, behavior: "smooth" }); }, 450);
    };
    const first = window.setTimeout(nudge, 1600);
    const iv = window.setInterval(nudge, 5600);
    return () => { clearTimeout(first); clearInterval(iv); stop(); };
  }, []);

  return (
    <>
      <SectionHeading label="The Feed ✿" heading="Styled &amp; Stacked" script="tap any look to shop it ✿" headingMobile />
      <section className="pb-8 md:pb-10">
        <style>{`@media (hover:hover) and (pointer:fine){.feed-cell:hover .feed-img{transform:scale(1.32);z-index:20;box-shadow:0 16px 44px rgba(33,25,18,0.38)}}`}</style>
        <div className="hidden md:grid grid-cols-12 gap-[3px]">
          {mixed.map((it, i) => (
            <Link key={`${it.png}-${i}`} to={it.href} className="feed-cell group relative aspect-square">
              <img
                src={`${IMG_BASE}${it.png}.webp`}
                alt=""
                aria-hidden="true"
                className="feed-img relative h-full w-full object-cover transition-transform duration-500 ease-out"
                loading="lazy"
                decoding="async"
              />
            </Link>
          ))}
        </div>

        <div
          ref={flickRef}
          className="md:hidden px-5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[42vw] gap-1 w-max">
            {mobileOrder.map((it, i) => (
              <Link key={`${it.png}-${i}`} to={it.href} className="relative aspect-square snap-start overflow-hidden">
                <img
                  src={`${IMG_BASE}${it.png}.webp`}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
