interface SectionHeadingProps {
  label?: string;
  heading: string;
  className?: string;
}

export const SectionHeading = ({ label, heading, className = "" }: SectionHeadingProps) => {
  return (
    <div className={`max-w-[1440px] mx-auto px-12 lg:px-16 pt-16 md:pt-24 pb-10 text-center ${className}`}>
      {label && (
        <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
          {label}
        </p>
      )}
      <h2 className="section-heading">{heading}</h2>
    </div>
  );
};
