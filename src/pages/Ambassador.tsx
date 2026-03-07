import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { StampBadge } from "@/components/craft/StampBadge";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";

const benefits = [
  "Complimentary Atelier-tier membership",
  "Early access to every drop and capsule",
  "Custom styling consultations",
  "Feature in GEA editorial content",
  "Commission on referred memberships",
  "Exclusive ambassador-only pieces",
];

const Ambassador = () => {
  return (
    <PageLayout>
      <PageHero
        label="Represent"
        headline={<>Become a GEA<br /><ScribbleUnderline>Ambassador</ScribbleUnderline></>}
        subtitle="We partner with women who embody access, intention, and visual authority. Not influencers — ambassadors."
      />

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading label="The Program" heading="What Ambassadors Receive" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-[600px] mx-auto relative">
          <StampBadge text="AMBASSADOR" subtext="GEA" rotation={-8} className="absolute -top-6 -right-10 hidden lg:inline-flex" />
          <StaggerContainer className="space-y-0">
            {benefits.map((b, i) => (
              <StaggerItem key={b}>
                <div className="flex items-start gap-3 border-b border-border pb-4 pt-4">
                  <span className="mt-1 w-1.5 h-1.5 bg-foreground flex-shrink-0" />
                  <span className="text-[13px] font-sans text-foreground">{b}</span>
                  {i === benefits.length - 1 && <TagRedStamp size={14} className="flex-shrink-0 mt-0.5" />}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Diamond chain border */}
      <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="bg-card border-t border-border relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <WaxSeal size={36} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
                Apply to <ScribbleUnderline color="var(--brass)" delay={0.4}>Represent</ScribbleUnderline>
              </h2>
              <p className="text-[12px] text-muted-foreground font-sans mb-8 max-w-[400px] mx-auto">
                We review applications quarterly. Share your story, your platform, and why GEA aligns with your identity.
              </p>
              <Link to="/contact" className="btn-gea">
                Submit Application
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Ambassador;
