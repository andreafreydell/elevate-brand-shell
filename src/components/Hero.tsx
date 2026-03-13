import { useState } from "react";
import { useParallax } from "@/hooks/useParallax";
  {
    subtitle: "The Collection",
    headline: "Unlimited\nDesigner Jewelry",
    description:
      "One membership. Infinite possibility. Access the full GEA collection — crafted moissanite, designed without compromise.",
    cta: "Discover More",
    ctaHref: "#collection",
  },
  {
    subtitle: "New Arrivals",
    headline: "The Brilliance\nNecklace",
    description:
      "Created moissanite set in gold-plated artisan settings. Light, form, and craft — reimagined.",
    cta: "Shop Now",
    ctaHref: "#collection",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  return (
    <section>
      {/* 3-column hero banner */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] min-h-[600px] lg:min-h-[680px]">
        {/* Left image block */}
        <div className="hidden md:block bg-[hsl(30,18%,38%)] overflow-hidden">
          <img
            src="/images/hero-authority.png"
            alt="Layered gold and moissanite necklaces on model"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center copy block — solid color, no gradient */}
        <div className="flex flex-col items-center justify-center text-center px-8 md:px-12 lg:px-16 py-20 bg-[hsl(28,22%,34%)]">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
            {slide.subtitle}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.08] tracking-[-0.01em] text-[hsl(36,33%,93%)] whitespace-pre-line mb-6">
            {slide.headline}
          </h1>
          <p className="text-[13px] leading-relaxed text-[hsl(36,20%,75%)] max-w-[340px] mb-10 font-sans">
            {slide.description}
          </p>
          <a
            href={slide.ctaHref}
            className="inline-block border-b border-[hsl(36,25%,78%)] pb-1 text-[11px] tracking-[0.3em] uppercase font-sans text-[hsl(36,25%,78%)] hover:text-[hsl(36,33%,93%)] hover:border-[hsl(36,33%,93%)] transition-colors"
          >
            {slide.cta}
          </a>
        </div>

        {/* Right image block */}
        <div className="hidden md:block bg-[hsl(32,15%,42%)] overflow-hidden">
          <img
            src="/images/hero-editorial.png"
            alt="Gold and emerald rings styled on hand"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Carousel dots */}
      <div className="flex items-center justify-center gap-2.5 py-5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-foreground" : "bg-border"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
