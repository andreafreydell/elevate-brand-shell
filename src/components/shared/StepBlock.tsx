import { type LucideIcon } from "lucide-react";

interface StepBlockProps {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export const StepBlock = ({ number, title, description, icon: Icon }: StepBlockProps) => {
  return (
    <div className="bg-card border border-border p-6 md:p-8 flex flex-col h-full min-h-[200px] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-foreground hover:border-2">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">
          Step {number}
        </span>
        {Icon && <Icon className="h-5 w-5 stroke-[1.3] text-foreground" />}
      </div>
      <h3 className="font-serif text-lg md:text-xl font-semibold tracking-[0.02em] mb-3">
        {title}
      </h3>
      <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mt-auto">
        {description}
      </p>
    </div>
  );
};
