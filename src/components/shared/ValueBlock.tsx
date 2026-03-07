import { ReactNode } from "react";

interface ValueBlockProps {
  title: string;
  description: string;
  className?: string;
  icon?: ReactNode;
}

export const ValueBlock = ({ title, description, className = "", icon }: ValueBlockProps) => {
  return (
    <div className={`border border-border p-8 md:p-10 h-full flex flex-col ${className}`}>
      {icon && (
        <div className="mb-5 text-foreground">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg md:text-xl font-semibold tracking-[0.02em] mb-3">
        {title}
      </h3>
      <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mt-auto">
        {description}
      </p>
    </div>
  );
};
