import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ValueBlock } from "@/components/shared/ValueBlock";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { CircleEmphasis } from "@/components/craft/CircleEmphasis";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { MarginNote } from "@/components/craft/MarginNote";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { MarkerCircle } from "@/components/craft/MarkerCircle";
import { DotGridTexture } from "@/components/craft/DotGridTexture";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { Gem, Recycle, Wrench } from "lucide-react";

const stats = [
  { value: "3,000+", label: "Tons of rock displaced per carat of mined diamond" },
  { value: "87%", label: "Of fine jewelry sits unworn in drawers" },
  { value: "0", label: "Mines required for lab-created moissanite" },
  { value: "∞", label: "Wears from a single restored piece" },
];

const Sustainability = () => {
  return (
    <PageLayout>
      <PageHero
        label="Responsibility"
        headline={"Beauty Without\nExtraction"}
        subtitle="The jewelry industry mines the earth and fills drawers. GEA operates differently — lab-created stones, circular access, and in-house restoration."
      />

      {/* Torn paper edge */}
      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      {/* Data blocks */}
      <SectionHeading label="The Reality" heading="What the Industry Won't Tell You" />
      <DotGridTexture className="max-w-[1440px] mx-auto" dotSize={0.5} spacing={20}>
        <section className="px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="border border-border bg-card p-8 text-center h-full relative overflow-hidden">
                  <GrainOverlay opacity={0.03} />
                  <p className="font-serif text-3xl md:text-4xl font-medium mb-3 relative z-[1]">
                    <ScriptNumber>{s.value}</ScriptNumber>
                  </p>
                  <p className="text-[10px] tracking-[0.15em] uppercase font-sans text-muted-foreground leading-relaxed relative z-[1]">
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </DotGridTexture>

      {/* Diamond chain border */}
      <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* Circular model */}
      <SectionHeading label="Our Approach" heading="The Circular Model" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StaggerItem>
            <ValueBlock title="Lab-Created Stones" description="Every GEA piece features lab-created moissanite — optically superior to diamond, conflict-free, and requiring zero mining. Brilliance without extraction." className="bg-card" lucideIcon={Gem} label="Material 01" />
          </StaggerItem>
          <StaggerItem>
            <ValueBlock title="Access Over Landfill" description="A single piece in the GEA vault serves dozens of members across hundreds of wears. Access extends the lifecycle of every gram of metal and every set stone." className="bg-card" lucideIcon={Recycle} label="Material 02" />
          </StaggerItem>
          <StaggerItem>
            <ValueBlock title="In-House Restoration" description="Our atelier restores each piece between members: hand cleaning, UV sanitization, 4-point inspection. Nothing is discarded. Everything is renewed." className="bg-card" lucideIcon={Wrench} label="Material 03" />
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Margin note */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:block">
        <div className="max-w-md ml-auto">
          <MarginNote attribution="GEA Sustainability">
            A single piece in our vault replaces dozens of purchases — that's the math of access.
          </MarginNote>
        </div>
      </div>

      {/* Stitch line divider */}
      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* CTA */}
      <section className="bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <WaxSeal size={36} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.6}>
            <HandDrawnFrame strokeColor="hsl(36,25%,78%)">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-[hsl(36,33%,93%)] mb-4">
                Wear with <ScribbleUnderline color="var(--brass)" delay={0.5}>Intention</ScribbleUnderline>
              </h2>
              <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10">
                Access beauty that doesn't cost the earth — literally.
              </p>
              <Link
                to="/#founding-access"
                className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
              >
                Apply for Access
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Sustainability;
