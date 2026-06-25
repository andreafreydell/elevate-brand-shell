import { Link } from "react-router-dom";
import { howto, IMG_BASE } from "@/data/landingShowcase";
import { SectionHeading } from "@/components/layout/SectionHeading";

/** Module B — the art of stacking. Four how-to cards (ear, neckline, wrist, hand),
 *  dashed-poppy editorial style; each opens its collection. */
export const ArtOfStacking = () => (
  <>
    <SectionHeading label="The Art of Stacking ✿" heading="Four Places to Layer" script="wear more — layer everything ✿" />
    <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {howto.map((c) => (
          <Link
            key={c.png}
            to={c.route}
            className="group flex flex-col overflow-hidden border border-dashed transition-transform duration-300 hover:-translate-y-1"
            style={{ borderColor: "var(--poppy)", background: "linear-gradient(180deg, var(--rose-soft) 0%, hsl(var(--background)) 42%)" }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={`${IMG_BASE}${c.png}.webp`}
                alt={`Stacking ${c.label.toLowerCase()}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-5">
              <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-muted-foreground">{c.step}</p>
              <h3 className="mt-1.5 font-serif text-xl font-medium italic tracking-[0.01em]">{c.h}</h3>
              <p className="mt-2 font-sans text-[12px] leading-relaxed text-muted-foreground">{c.p}</p>
              <span
                className="mt-3 inline-block font-sans text-[11px] tracking-[0.14em] uppercase border-b pb-0.5"
                style={{ color: "var(--poppy-deep)", borderColor: "var(--poppy)" }}
              >
                Shop {c.label} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </>
);
