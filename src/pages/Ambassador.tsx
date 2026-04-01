import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { StampBadge } from "@/components/craft/StampBadge";
import { TagRedStamp } from "@/components/craft/TagRedStamp";

const benefits = [
  "Complimentary Atelier-tier membership",
  "Early access to every drop and capsule",
  "Custom styling consultations",
  "Feature in GEA editorial content",
  "Commission on referred memberships",
  "Exclusive ambassador-only pieces",
];

const qualifications = [
  "A clear personal point of view around style, beauty, or dressing.",
  "Consistent content or community presence, even if your audience is niche.",
  "Strong alignment with GEA values: access, intention, and elevated presentation.",
  "Comfort creating polished content and sharing product feedback after each cycle.",
];

const deliverables = [
  "Two polished content moments per active cycle, tailored to the channels you already use best.",
  "Tag GEA clearly and share honest styling context, not generic promo copy.",
  "Provide quick post-cycle feedback on fit, styling, audience response, and favorites.",
  "Allow approved GEA reposting so strong ambassador content can support editorial and growth.",
];

const Ambassador = () => {
  return (
    <PageLayout>
      <PageHero
        label="Represent"
        headline={
          <>
            Become a GEA
            <br />
            <ScribbleUnderline>Ambassador</ScribbleUnderline>
          </>
        }
        subtitle="We partner with women who embody access, intention, and visual authority. Not influencers - ambassadors with a real point of view."
      />

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading label="The Program" heading="What Ambassadors Receive" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-[600px] mx-auto relative">
          <StampBadge
            text="AMBASSADOR"
            subtext="GEA"
            rotation={-8}
            className="absolute -top-6 -right-10 hidden lg:inline-flex"
          />
          <StaggerContainer className="space-y-0">
            {benefits.map((benefit, index) => (
              <StaggerItem key={benefit}>
                <div className="flex items-start gap-3 border-b border-border pb-4 pt-4">
                  <span className="mt-1 w-1.5 h-1.5 bg-foreground flex-shrink-0" />
                  <span className="text-[13px] font-sans text-foreground">{benefit}</span>
                  {index === benefits.length - 1 && (
                    <TagRedStamp size={14} className="flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <SectionHeading label="Who It's For" heading="Qualification Criteria" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qualifications.map((item) => (
            <StaggerItem key={item}>
              <div className="h-full border border-border bg-card p-8 relative overflow-hidden">
                <GrainOverlay opacity={0.03} />
                <p className="text-[13px] leading-relaxed font-sans text-foreground relative z-[1]">{item}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <SectionHeading label="What We Ask" heading="Expected Deliverables" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-[760px] mx-auto border border-border bg-card p-8 md:p-10">
          <StaggerContainer className="space-y-0">
            {deliverables.map((item) => (
              <StaggerItem key={item}>
                <div className="flex items-start gap-3 border-b border-border pb-4 pt-4 last:border-b-0 last:pb-0">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 bg-foreground" />
                  <span className="font-sans text-[13px] leading-relaxed text-foreground">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-card border-t border-border relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 text-center relative z-[1]">
          <WaxSeal size={36} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
                Apply to{" "}
                <ScribbleUnderline color="var(--brass)" delay={0.4}>
                  Represent
                </ScribbleUnderline>
              </h2>
              <p className="text-[12px] text-muted-foreground font-sans mb-8 max-w-[420px] mx-auto">
                We review ambassador applications in monthly rounds and contact shortlisted candidates first. Share your platform, audience, and why GEA is a fit for your voice.
              </p>
              <Link to="/contact?topic=ambassador" className="btn-gea">
                Start Ambassador Application
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Ambassador;
