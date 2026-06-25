import { Link } from "react-router-dom";
import { banner, IMG_BASE } from "@/data/landingShowcase";

/** Module A — large image band (2x) that drifts slowly. The wavy transition into
 *  the video is rendered separately (WaveTransition) so it can cut both sections. */
export const StackingBanner = () => {
  const items = [...banner, ...banner, ...banner]; // tripled for a seamless loop

  return (
    <section className="relative overflow-hidden">
      <style>{`@keyframes gea-marquee{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}`}</style>
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={{ animation: "gea-marquee 110s linear infinite" }}
      >
        {items.map((b, i) => (
          <Link key={`${b.png}-${i}`} to={b.href} aria-label="Shop this look" className="group block shrink-0">
            <img
              src={`${IMG_BASE}${b.png}.webp`}
              alt=""
              aria-hidden="true"
              className="block h-[360px] w-[360px] sm:h-[440px] sm:w-[440px] md:h-[560px] md:w-[560px] lg:h-[640px] lg:w-[640px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
