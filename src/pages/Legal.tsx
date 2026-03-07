import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { TagRedStamp } from "@/components/craft/TagRedStamp";

const Legal = () => {
  return (
    <PageLayout>
      <section className="bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center relative z-[1]">
          <WaxSeal size={36} className="mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[hsl(36,33%,93%)] tracking-[-0.01em]">
            Legal
          </h1>
        </div>
      </section>

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading heading="Terms of Service" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <div className="max-w-[720px] mx-auto border border-border bg-card p-10 relative overflow-hidden">
          <GrainOverlay opacity={0.03} />
          <TagRedStamp size={16} className="absolute top-4 right-4" />
          <p className="text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
            Terms of Service content will be provided by legal counsel and published here prior to launch. 
            This section will cover membership agreements, rotation terms, buyout conditions, 
            liability limitations, and dispute resolution.
          </p>
        </div>
      </section>

      <StitchLineDivider className="max-w-[720px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mb-4" />

      <SectionHeading heading="Privacy Policy" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <div className="max-w-[720px] mx-auto border border-border bg-card p-10 relative overflow-hidden">
          <GrainOverlay opacity={0.03} />
          <p className="text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
            Privacy Policy content will be provided by legal counsel and published here prior to launch. 
            This section will detail data collection, usage, third-party sharing, 
            cookie policies, and user rights under applicable regulations.
          </p>
        </div>
      </section>

      <StitchLineDivider className="max-w-[720px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mb-4" />

      <SectionHeading heading="Membership Agreement" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-[720px] mx-auto border border-border bg-card p-10 relative overflow-hidden">
          <GrainOverlay opacity={0.03} />
          <p className="text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
            Membership Agreement content will detail the specific terms governing each tier, 
            including billing cycles, cancellation policies, piece care responsibilities, 
            buyout pricing structures, and insurance coverage details.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Legal;
