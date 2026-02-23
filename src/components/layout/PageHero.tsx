import { Link } from "react-router-dom";

interface PageHeroProps {
  label?: string;
  headline: string;
  subtitle?: string;
  cta?: string;
  ctaHref?: string;
}

export const PageHero = ({ label, headline, subtitle, cta, ctaHref = "/membership" }: PageHeroProps) => {
  return (
    <section className="bg-[hsl(28,22%,34%)]">
      <div className="max-w-[1440px] mx-auto px-12 lg:px-16 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
        {label && (
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
            {label}
          </p>
        )}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.08] tracking-[-0.01em] text-[hsl(36,33%,93%)] whitespace-pre-line mb-6 max-w-[700px]">
          {headline}
        </h1>
        {subtitle && (
          <p className="text-[13px] leading-relaxed text-[hsl(36,20%,75%)] max-w-[440px] mb-10 font-sans">
            {subtitle}
          </p>
        )}
        {cta && (
          <Link
            to={ctaHref}
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            {cta}
          </Link>
        )}
      </div>
    </section>
  );
};
