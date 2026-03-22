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
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";

const Press = () => {
  return (
    <PageLayout>
      <PageHero
        label="Press"
        headline={
          <>
            The <ScribbleUnderline>House</ScribbleUnderline>
            <br />
            of GEA
          </>
        }
        subtitle="For press inquiries, brand assets, and partnership opportunities."
      />

      <TornPaperEdge className="mx-auto max-w-[1440px]" />

      <SectionHeading label="Resources" heading="Press Kit" />
      <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-6 md:px-12 lg:px-16">
        <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StaggerItem>
            <div className="relative overflow-hidden border border-border bg-card p-8">
              <GrainOverlay opacity={0.03} />
              <OrganicBlobTag variant="coastal" className="mb-4">
                Brand Assets
              </OrganicBlobTag>
              <h3 className="relative z-[1] mb-3 font-serif text-lg font-semibold">
                Logos & Guidelines
              </h3>
              <p className="relative z-[1] mb-6 font-sans text-[12px] leading-relaxed text-muted-foreground">
                Download the GEA brand kit including logos, color palette,
                typography specifications, and usage guidelines.
              </p>
              <span className="cta-underline relative z-[1]">Download Kit</span>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="relative overflow-hidden border border-border bg-card p-8">
              <GrainOverlay opacity={0.03} />
              <OrganicBlobTag variant="classic" className="mb-4">
                Imagery
              </OrganicBlobTag>
              <h3 className="relative z-[1] mb-3 font-serif text-lg font-semibold">
                Product & Editorial
              </h3>
              <p className="relative z-[1] mb-6 font-sans text-[12px] leading-relaxed text-muted-foreground">
                High-resolution product photography, editorial lookbook images,
                and lifestyle shots available for media use.
              </p>
              <span className="cta-underline relative z-[1]">View Gallery</span>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="relative overflow-hidden border border-border bg-card p-8">
              <GrainOverlay opacity={0.03} />
              <OrganicBlobTag variant="statement" className="mb-4">
                Inquiries
              </OrganicBlobTag>
              <h3 className="relative z-[1] mb-3 font-serif text-lg font-semibold">
                Media Contact
              </h3>
              <p className="relative z-[1] mb-6 font-sans text-[12px] leading-relaxed text-muted-foreground">
                For interviews, features, and collaboration inquiries, reach
                our press team directly.
              </p>
              <Link to="/contact" className="cta-underline relative z-[1]">
                Get in Touch
              </Link>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      <DiamondChainBorder className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="relative overflow-hidden bg-foreground text-background">
        <GrainOverlay opacity={0.05} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-16 text-center sm:px-6 md:px-12 md:py-24 lg:px-16">
          <TagRedStamp size={20} className="mx-auto mb-4" />
          <AnimateIn variant="fadeIn" duration={0.6}>
            <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.4em] text-background/50">
              About GEA
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.8}>
            <HandDrawnFrame strokeColor="hsl(36,25%,78%)">
              <p className="mx-auto max-w-[600px] font-serif text-lg font-medium italic leading-[1.5] md:text-xl">
                GEA is a fashion house jewelry access system. We replace
                ownership with access, accumulation with expression, and
                extraction with intention. Founded on the principle that access
                defines status.
              </p>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Press;
