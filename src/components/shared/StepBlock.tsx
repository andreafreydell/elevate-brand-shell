import { type LucideIcon } from "lucide-react";

interface StepBlockProps {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export const StepBlock = ({ number, title, description, icon: Icon }: StepBlockProps) => {
  return (
    <div className="bg-card border border-border p-4 md:p-8 md:p-10 flex flex-col h-full min-h-0 md:min-h-[220px] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-foreground hover:border-2">
      <div className="flex items-center justify-between mb-2 md:mb-6">
        <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">
          Step {number}
        </span>
        {Icon && <Icon className="h-4 w-4 md:h-5 md:w-5 stroke-[1.3] text-foreground" />}
      </div>
      <h3 className="font-serif text-sm md:text-xl font-semibold tracking-[0.02em] mb-1 md:mb-3">
        {title}
      </h3>
      <p className="text-[10px] md:text-[12px] text-muted-foreground font-sans leading-snug md:leading-relaxed mt-auto">
        {description}
      </p>
    </div>
  );
};
