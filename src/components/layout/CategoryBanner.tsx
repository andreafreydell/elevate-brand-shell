import { AnimateIn } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { CategoryGraphic } from "@/components/product/CategoryGraphic";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { TagRedStamp } from "@/components/craft/TagRedStamp";

interface CategoryBannerProps {
  title: string;
  subtitle: string;
  category: string;
}

export const CategoryBanner = ({ title, subtitle, category }: CategoryBannerProps) => {
  return (
    <section className="bg-background relative overflow-hidden">
      <GrainOverlay opacity={0.04} />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-10 md:py-16 relative z-[1]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
          {/* Left: Typography */}
          <div className="md:w-[58%] space-y-4">
            <AnimateIn variant="fadeIn" duration={0.5}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-sans">
                The Collection
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.1} duration={0.5}>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-[1.1] tracking-[-0.01em] text-foreground">
                <ScribbleUnderline>{title}</ScribbleUnderline>
              </h1>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.25} duration={0.5}>
              <p className="text-[13px] leading-relaxed text-muted-foreground max-w-[400px] font-sans">
                {subtitle}
              </p>
            </AnimateIn>
          </div>

          {/* Right: Graphic */}
          <AnimateIn variant="fadeIn" delay={0.3} duration={0.6} className="md:w-[38%] flex justify-center md:justify-end">
            <div className="relative w-[140px] md:w-[160px]">
              <HandDrawnFrame strokeColor="hsl(var(--border))">
                <div className="flex items-center justify-center py-2">
                  <CategoryGraphic category={category} className="w-20 md:w-24 opacity-60" />
                </div>
              </HandDrawnFrame>
              <WaxSeal letter="G" size={36} className="absolute -top-3 -right-3" />
              <TagRedStamp size={12} className="absolute bottom-1 left-1" />
            </div>
          </AnimateIn>
        </div>
      </div>
      <StitchLineDivider />
    </section>
  );
};
