import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/shared/AnimateIn";

interface PageHeroProps {
  label?: string;
  headline: string;
  subtitle?: string;
  cta?: string;
  ctaHref?: string;
  heroMobileCompact?: boolean;
}

export const PageHero = ({ label, headline, subtitle, cta, ctaHref = "/membership", heroMobileCompact = false }: PageHeroProps) => {
  return (
    <section className={`bg-foreground ${heroMobileCompact ? 'page-hero-section-mobile' : 'hero-section-mobile'}`}>
      <div className={`max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center ${heroMobileCompact ? 'page-hero-mobile' : ''}`}>
        {label && (
          <AnimateIn variant="fadeIn" duration={0.6}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-background/60 mb-6 font-sans">
              {label}
            </p>
          </AnimateIn>
        )}
        <AnimateIn variant="fadeUp" delay={0.15} duration={0.6}>
          <h1 className={`font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.08] tracking-[-0.01em] text-background whitespace-pre-line mb-6 max-w-[700px] ${heroMobileCompact ? 'page-hero-headline-mobile' : 'hero-headline-mobile'}`}>
            {headline}
          </h1>
        </AnimateIn>
        {subtitle && (
          <AnimateIn variant="fadeUp" delay={0.3} duration={0.6}>
            <p className={`text-[13px] leading-relaxed text-background/60 max-w-[440px] mb-10 font-sans ${heroMobileCompact ? 'page-hero-subtitle-mobile' : 'hero-subtitle-mobile'}`}>
              {subtitle}
            </p>
          </AnimateIn>
        )}
        {cta && (
          <AnimateIn variant="fadeUp" delay={0.45} duration={0.6}>
            <Link
              to={ctaHref}
              className="inline-block border border-background/60 text-background/60 px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-background/60 hover:text-foreground transition-colors"
            >
              {cta}
            </Link>
          </AnimateIn>
        )}
      </div>
    </section>
  );
};
