import { Link } from "react-router-dom";
import { banner, IMG_BASE } from "@/data/landingShowcase";
import { landingSrcSet } from "@/lib/responsiveImages";

/** Module A — large image band (2x) that drifts slowly. The wavy transition into
 *  the video is rendered separately (WaveTransition) so it can cut both sections. */
// Hand-picked close-up / simpler shots to mix in among the bold hero photos.
// Same {png, href} shape as the existing banner items (png maps to the product
// handle ending in that number); images live in /landing/<png>.webp.
const featureItems = [
  { png: 80, href: "/product/naelia-bracelet80" },
  { png: 180, href: "/product/ziolia-necklace180" },
  { png: 297, href: "/product/giovia-earrings297" },
  { png: 308, href: "/product/raelia-earrings308" },
  { png: 460, href: "/product/vealia-necklace460" },
  { png: 532, href: "/product/laevia-bracelet532" },
  { png: 98, href: "/product/saunia-earrings98" },
];

// Alternate existing hero photo, then a new feature, then existing, and so on.
const interleave = <T,>(a: T[], b: T[]): T[] => {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
};

export const StackingBanner = () => {
  const mixed = interleave(banner, featureItems);
  const items = [...mixed, ...mixed, ...mixed]; // tripled for a seamless loop

  return (
    <section className="relative overflow-hidden">
      <style>{`@keyframes gea-marquee{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}`}</style>
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={{ animation: "gea-marquee 110s linear infinite" }}
      >
        {items.map((b, i) => (
          <Link key={`${b.png}-${i}`} to={b.href} aria-label="Rent this look" className="group block shrink-0">
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
    </section>
  );
};
