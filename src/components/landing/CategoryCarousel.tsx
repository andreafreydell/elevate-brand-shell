import { Link } from "react-router-dom";
import { carousel, IMG_BASE } from "@/data/landingShowcase";

/** Module A — large static category bubbles. All categories shown at once,
 *  no movement; wraps to keep every bubble visible on smaller screens. */
export const CategoryCarousel = () => (
  <section className="bg-background pt-7 md:pt-10 pb-6 md:pb-9">
    <p className="text-center font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
      Shop by Category <span aria-hidden="true" style={{ color: "var(--poppy)" }}>✿</span>
    </p>
    <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16 flex flex-wrap justify-center gap-x-4 gap-y-5 lg:gap-x-5">
      {carousel.map((s) => (
        <Link
          key={s.png}
          to={s.route}
          aria-label={s.label}
          className="group flex flex-col items-center w-[80px] sm:w-[104px] md:w-[120px] lg:w-[140px]"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[#eaddc7] transition-transform duration-300 ease-out group-hover:z-10 group-hover:scale-[1.6] group-hover:shadow-[0_16px_44px_rgba(33,25,18,0.32)]">
            <img
              src={`${IMG_BASE}${s.png}.webp`}
              alt={s.label}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
          <p className="mt-2.5 text-center font-sans text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-foreground/80 group-hover:text-foreground">
            {s.label}
          </p>
        </Link>
      ))}
    </div>
  </section>
);
