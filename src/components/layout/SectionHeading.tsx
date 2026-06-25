import { AnimateIn } from "@/components/shared/AnimateIn";

interface SectionHeadingProps {
  label?: string;
  heading: string;
  script?: string;
  className?: string;
  headingMobile?: boolean;
  labelClassName?: string;
}

export const SectionHeading = ({ label, heading, script, className = "", headingMobile = false, labelClassName = "" }: SectionHeadingProps) => {
  return (
    <AnimateIn variant="fadeUp" duration={0.5}>
      <div className={`max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pt-5 md:pt-12 pb-3 md:pb-6 text-center ${className}`}>
        {label && (
          <p className={`section-heading-label text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4 ${labelClassName}`}>
            {label}
          </p>
        )}
        <h2 className={`section-heading ${headingMobile ? 'section-heading-mobile' : ''}`}>{heading}</h2>
        {script && (
          <p className="mt-2 text-[1.2rem]" style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}>
            {script}
          </p>
        )}
      </div>
    </AnimateIn>
  );
};
