import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface ValueBlockProps {
  title: string;
  description: string;
  className?: string;
  icon?: ReactNode;
  lucideIcon?: LucideIcon;
  label?: string;
  children?: ReactNode;
}

export const ValueBlock = ({ title, description, className = "", icon, lucideIcon: Icon, label, children }: ValueBlockProps) => {
  return (
    <div className={`border border-border p-8 md:p-10 h-full flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-foreground hover:border-2 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        {label && (
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">
            {label}
          </span>
        )}
        {Icon && <Icon className="h-5 w-5 stroke-[1.3] text-foreground ml-auto" />}
        {!Icon && icon && <div className="text-foreground ml-auto">{icon}</div>}
      </div>
      <h3 className="font-serif text-lg md:text-xl font-semibold tracking-[0.02em] mb-3">
        {title}
      </h3>
      <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mt-auto">
        {description}
      </p>
      {children}
    </div>
  );
};
