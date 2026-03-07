import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";

const Press = () => {
  return (
    <PageLayout>
      <PageHero
        label="Press"
        headline={"The House\nof GEA"}
        subtitle="For press inquiries, brand assets, and partnership opportunities."
      />

      <SectionHeading label="Resources" heading="Press Kit" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StaggerItem>
            <div className="border border-border bg-card p-8 h-full relative overflow-hidden">
              <GrainOverlay opacity={0.03} />
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4 relative z-[1]">Brand Assets</p>
              <h3 className="font-serif text-lg font-semibold mb-3 relative z-[1]">Logos & Guidelines</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-6 relative z-[1]">
                Download the GEA brand kit including logos, color palette, typography specifications, and usage guidelines.
              </p>
              <span className="cta-underline relative z-[1]">Download Kit</span>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="border border-border bg-card p-8 h-full relative overflow-hidden">
              <GrainOverlay opacity={0.03} />
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4 relative z-[1]">Imagery</p>
              <h3 className="font-serif text-lg font-semibold mb-3 relative z-[1]">Product & Editorial</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-6 relative z-[1]">
                High-resolution product photography, editorial lookbook images, and lifestyle shots available for media use.
              </p>
              <span className="cta-underline relative z-[1]">View Gallery</span>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="border border-border bg-card p-8 h-full relative overflow-hidden">
              <GrainOverlay opacity={0.03} />
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4 relative z-[1]">Inquiries</p>
              <h3 className="font-serif text-lg font-semibold mb-3 relative z-[1]">Media Contact</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-6 relative z-[1]">
                For interviews, features, and collaboration inquiries, reach our press team directly.
              </p>
              <Link to="/contact" className="cta-underline relative z-[1]">Get in Touch</Link>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Wavy divider */}
      <WavyDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mb-4" />

      {/* Brand statement */}
      <section className="bg-foreground text-background relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <AnimateIn variant="fadeIn" duration={0.6}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-background/50 mb-6 font-sans">About GEA</p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.8}>
            <p className="font-serif text-lg md:text-xl font-medium leading-[1.5] max-w-[600px] mx-auto italic">
              GEA is a fashion house jewelry access system. We replace ownership with rotation, 
              accumulation with expression, and extraction with intention. Founded on the principle 
              that access defines status.
            </p>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Press;
