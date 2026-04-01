import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ValueBlock } from "@/components/shared/ValueBlock";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { MarginNote } from "@/components/craft/MarginNote";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { DotGridTexture } from "@/components/craft/DotGridTexture";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { Gem, Recycle, Wrench } from "lucide-react";

const stats = [
  {
    value: "3,000+",
    label: "Some mining estimates suggest thousands of tons of earth can move for a single carat",
  },
  {
    value: "Too many",
    label: "Jewelry purchases are often worn a few times, then left in drawers",
  },
  {
    value: "0",
    label: "New mines required for lab-created moissanite",
  },
  {
    value: "More",
    label: "Wears a single piece can earn when it circulates through many members",
  },
];

const Sustainability = () => {
  return (
    <PageLayout>
      <PageHero
        label="Responsibility"
        headline={
          <>
            Beauty Without
            <br />
            <ScribbleUnderline>Extraction</ScribbleUnderline>
          </>
        }
        subtitle="The jewelry industry mines the earth and fills drawers. GEA operates differently - lab-created stones, circular access, and in-house restoration that gives members more variety with less waste."
      />

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading label="The Reality" heading="What the Industry Won't Tell You" />
      <DotGridTexture className="max-w-[1440px] mx-auto" dotSize={0.5} spacing={20}>
        <section className="px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="border border-border bg-card p-8 text-center h-full relative overflow-hidden">
                  <GrainOverlay opacity={0.03} />
                  <p className="font-serif text-3xl md:text-4xl font-medium mb-3 relative z-[1]">
                    <ScriptNumber>{stat.value}</ScriptNumber>
                  </p>
                  <p className="text-[10px] tracking-[0.15em] uppercase font-sans text-muted-foreground leading-relaxed relative z-[1]">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </DotGridTexture>

      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <p className="max-w-[780px] mx-auto text-center text-[11px] leading-relaxed text-muted-foreground font-sans">
          These figures are directional and meant to show the scale of extraction and overbuying in traditional
          jewelry, not a universal average for every brand or mine. The member benefit is simpler: less clutter,
          fewer regret purchases, and more real wear from every piece.
        </p>
      </section>

      <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <SectionHeading label="Our Approach" heading="The Circular Model" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StaggerItem>
            <ValueBlock
              title="Lab-Created Stones"
              description="Every GEA piece features lab-created moissanite - high brilliance without the new mining footprint of traditional stone sourcing. Better optics for the look, lighter impact for the member."
              className="bg-card"
              lucideIcon={Gem}
              label="Material 01"
            />
          </StaggerItem>
          <StaggerItem>
            <ValueBlock
              title="Access Over Extra Purchasing"
              description="A single piece in the GEA vault can serve many members across many looks. That means more styling range for you, without another impulse purchase or another drawer of barely-worn jewelry."
              className="bg-card"
              lucideIcon={Recycle}
              label="Material 02"
            />
          </StaggerItem>
          <StaggerItem>
            <ValueBlock
              title="In-House Restoration"
              description="Our atelier restores each piece between members with inspection, sanitization, and final polishing. Pieces stay in circulation longer, and members receive something that still feels elevated on arrival."
              className="bg-card"
              lucideIcon={Wrench}
              label="Material 03"
            />
          </StaggerItem>
        </StaggerContainer>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:block">
        <div className="max-w-md ml-auto">
          <MarginNote attribution="GEA Sustainability">
            A single piece in our vault can replace multiple one-time purchases - that's the member math of access.
          </MarginNote>
        </div>
      </div>

      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 text-center relative z-[1]">
          <WaxSeal size={36} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.6}>
            <HandDrawnFrame strokeColor="hsl(36,25%,78%)">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-[hsl(36,33%,93%)] mb-4">
                Wear with <ScribbleUnderline color="var(--brass)" delay={0.5}>Intention</ScribbleUnderline>
              </h2>
              <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[420px] mx-auto mb-10">
                Wear more looks, buy fewer pieces, and keep your favorite when it earns a permanent place.
              </p>
              <Link
                to="/how-it-works"
                className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
              >
                See Membership
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Sustainability;
