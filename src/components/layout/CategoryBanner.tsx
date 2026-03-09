import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { MarginNote } from "@/components/craft/MarginNote";

/* ─── Per-category editorial content ─── */
interface CategoryContent {
  /** Word in title to underline */
  accentWord: string;
  materials: string[];
  occasions: string[];
  stylingNote: string;
  /** Abstract SVG for the category */
  abstractSvg: "shimmer" | "orbit" | "facets" | "weave" | "lens" | "cascade";
}

const CATEGORY_DATA: Record<string, CategoryContent> = {
  Earrings: {
    accentWord: "Earrings",
    materials: ["Sterling Silver", "Stainless Steel", "Lab Moissanite"],
    occasions: ["Everyday", "Date Night", "Black Tie"],
    stylingNote: "Layer studs with hoops for effortless dimension.",
    abstractSvg: "shimmer",
  },
  Necklace: {
    accentWord: "Necklaces",
    materials: ["Sterling Silver", "Surgical Steel"],
    occasions: ["Layering", "Statement", "Gifting"],
    stylingNote: "Stack two lengths for a curated neckline.",
    abstractSvg: "cascade",
  },
  Ring: {
    accentWord: "Rings",
    materials: ["Sterling Silver", "Stainless Steel"],
    occasions: ["Stacking", "Everyday", "Ceremony"],
    stylingNote: "Mix widths across fingers — odd numbers feel intentional.",
    abstractSvg: "orbit",
  },
  Bracelet: {
    accentWord: "Bracelets",
    materials: ["Sterling Silver", "Surgical Steel"],
    occasions: ["Gifting", "Everyday", "Formal"],
    stylingNote: "Pair a cuff with a delicate chain for contrast.",
    abstractSvg: "weave",
  },
  Sunglasses: {
    accentWord: "Sunglasses",
    materials: ["Acetate", "Stainless Steel"],
    occasions: ["Weekend", "Travel", "Statement"],
    stylingNote: "Choose frames that contrast your face shape.",
    abstractSvg: "lens",
  },
  Hair: {
    accentWord: "Hair",
    materials: ["Sterling Silver", "Stainless Steel"],
    occasions: ["Everyday", "Evening", "Bridal"],
    stylingNote: "A single sculptural clip replaces an entire updo.",
    abstractSvg: "facets",
  },
};

const DEFAULT_CONTENT: CategoryContent = {
  accentWord: "",
  materials: ["Sterling Silver", "Stainless Steel"],
  occasions: ["Everyday", "Evening"],
  stylingNote: "Less is never less — it's intentional.",
  abstractSvg: "shimmer",
};

/* ─── Abstract SVGs — materials, light, geometry ─── */
const AbstractSvg = ({ variant }: { variant: CategoryContent["abstractSvg"] }) => {
  const common = "w-full h-full";

  switch (variant) {
    // Radiating light lines — evoking shimmer on metal
    case "shimmer":
      return (
        <svg viewBox="0 0 120 120" className={common} fill="none">
          <defs>
            <linearGradient id="shim1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.12" />
              <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <line
              key={angle}
              x1="60" y1="60"
              x2={60 + 50 * Math.cos((angle * Math.PI) / 180)}
              y2={60 + 50 * Math.sin((angle * Math.PI) / 180)}
              stroke="hsl(var(--foreground))"
              strokeWidth="0.5"
              opacity="0.15"
            />
          ))}
          <circle cx="60" cy="60" r="18" stroke="url(#shim1)" strokeWidth="1" />
          <circle cx="60" cy="60" r="32" stroke="hsl(var(--foreground))" strokeWidth="0.3" opacity="0.1" strokeDasharray="3 5" />
          <circle cx="60" cy="60" r="3" fill="hsl(var(--foreground))" opacity="0.08" />
        </svg>
      );

    // Orbital rings — evoking stacking, rings, rotation
    case "orbit":
      return (
        <svg viewBox="0 0 120 120" className={common} fill="none">
          <ellipse cx="60" cy="60" rx="40" ry="16" stroke="hsl(var(--foreground))" strokeWidth="0.6" opacity="0.15" transform="rotate(-20 60 60)" />
          <ellipse cx="60" cy="60" rx="40" ry="16" stroke="hsl(var(--foreground))" strokeWidth="0.6" opacity="0.1" transform="rotate(25 60 60)" />
          <ellipse cx="60" cy="60" rx="40" ry="16" stroke="hsl(var(--foreground))" strokeWidth="0.6" opacity="0.08" transform="rotate(70 60 60)" />
          <circle cx="60" cy="60" r="4" fill="hsl(var(--foreground))" opacity="0.1" />
          <circle cx="60" cy="60" r="1.5" fill="hsl(var(--foreground))" opacity="0.15" />
        </svg>
      );

    // Geometric facets — evoking cut stone, precision
    case "facets":
      return (
        <svg viewBox="0 0 120 120" className={common} fill="none">
          <polygon points="60,15 95,45 85,90 35,90 25,45" stroke="hsl(var(--foreground))" strokeWidth="0.5" opacity="0.12" />
          <line x1="60" y1="15" x2="60" y2="90" stroke="hsl(var(--foreground))" strokeWidth="0.3" opacity="0.1" />
          <line x1="25" y1="45" x2="95" y2="45" stroke="hsl(var(--foreground))" strokeWidth="0.3" opacity="0.1" />
          <line x1="60" y1="15" x2="35" y2="90" stroke="hsl(var(--foreground))" strokeWidth="0.3" opacity="0.08" />
          <line x1="60" y1="15" x2="85" y2="90" stroke="hsl(var(--foreground))" strokeWidth="0.3" opacity="0.08" />
          <circle cx="60" cy="52" r="2" fill="hsl(var(--foreground))" opacity="0.08" />
        </svg>
      );

    // Interlocking curves — evoking chain links, weaving
    case "weave":
      return (
        <svg viewBox="0 0 120 120" className={common} fill="none">
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx={40 + i * 20}
              cy="60"
              rx="18"
              ry="28"
              stroke="hsl(var(--foreground))"
              strokeWidth="0.5"
              opacity={0.12 - i * 0.02}
              transform={`rotate(${i * 15 - 15} ${40 + i * 20} 60)`}
            />
          ))}
          <line x1="20" y1="60" x2="100" y2="60" stroke="hsl(var(--foreground))" strokeWidth="0.3" opacity="0.08" strokeDasharray="2 4" />
        </svg>
      );

    // Lens shape — evoking frame, vision, perspective
    case "lens":
      return (
        <svg viewBox="0 0 120 120" className={common} fill="none">
          <ellipse cx="45" cy="60" rx="28" ry="22" stroke="hsl(var(--foreground))" strokeWidth="0.6" opacity="0.12" />
          <ellipse cx="75" cy="60" rx="28" ry="22" stroke="hsl(var(--foreground))" strokeWidth="0.6" opacity="0.12" />
          <line x1="17" y1="58" x2="8" y2="55" stroke="hsl(var(--foreground))" strokeWidth="0.4" opacity="0.1" />
          <line x1="103" y1="58" x2="112" y2="55" stroke="hsl(var(--foreground))" strokeWidth="0.4" opacity="0.1" />
          <path d="M55 42 Q60 38, 65 42" stroke="hsl(var(--foreground))" strokeWidth="0.5" opacity="0.1" />
        </svg>
      );

    // Cascading arcs — evoking drape, flow, layering
    case "cascade":
      return (
        <svg viewBox="0 0 120 120" className={common} fill="none">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${20 + i * 5} ${30 + i * 12} Q60 ${60 + i * 15}, ${100 - i * 5} ${30 + i * 12}`}
              stroke="hsl(var(--foreground))"
              strokeWidth="0.5"
              opacity={0.14 - i * 0.025}
            />
          ))}
          <circle cx="60" cy="95" r="3" fill="hsl(var(--foreground))" opacity="0.08" />
          <circle cx="60" cy="95" r="1" fill="hsl(var(--foreground))" opacity="0.12" />
        </svg>
      );
  }
};

/* ─── Main Component ─── */
interface CategoryBannerProps {
  title: string;
  subtitle: string;
  category: string;
}

export const CategoryBanner = ({ title, subtitle, category }: CategoryBannerProps) => {
  const content = CATEGORY_DATA[category] || DEFAULT_CONTENT;

  return (
    <section className="bg-background relative overflow-hidden">
      <GrainOverlay opacity={0.04} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-10 md:py-14 relative z-[1]">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-20">

          {/* ── Left: Title + meta ── */}
          <div className="md:w-[55%] space-y-5">
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

            <AnimateIn variant="fadeUp" delay={0.2} duration={0.5}>
              <p className="text-[13px] leading-relaxed text-muted-foreground max-w-[420px] font-sans">
                {subtitle}
              </p>
            </AnimateIn>

            {/* Material + Occasion tags */}
            <StaggerContainer className="flex flex-wrap gap-x-5 gap-y-3 pt-2" staggerDelay={0.08}>
              <StaggerItem>
                <div className="space-y-1.5">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/60 font-sans">Materials</p>
                  <div className="flex flex-wrap gap-1.5">
                    {content.materials.map((m) => (
                      <span key={m} className="text-[10px] tracking-[0.15em] uppercase text-foreground/70 font-sans border border-border px-2.5 py-1">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="space-y-1.5">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/60 font-sans">Occasions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {content.occasions.map((o) => (
                      <span key={o} className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans border border-border/50 px-2.5 py-1">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* ── Right: Abstract SVG + Styling note ── */}
          <AnimateIn variant="fadeIn" delay={0.3} duration={0.7} className="md:w-[45%] flex flex-col items-end justify-between gap-6">
            {/* Abstract graphic */}
            <div className="relative w-[100px] md:w-[130px] lg:w-[150px] self-center md:self-end opacity-80">
              <AbstractSvg variant={content.abstractSvg} />
              <TagRedStamp size={10} className="absolute -bottom-1 -right-1" />
            </div>

            {/* Styling note as margin annotation */}
            <MarginNote side="right" className="max-w-[260px] self-end">
              <p className="text-[11px] leading-relaxed text-muted-foreground font-sans italic">
                {content.stylingNote}
              </p>
            </MarginNote>
          </AnimateIn>
        </div>
      </div>

      <WavyDivider variant="single" className="mt-2" />
    </section>
  );
};
