import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { StampBadge } from "@/components/craft/StampBadge";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { EditorialInfographic } from "@/components/stories/EditorialInfographic";

type InfographicVariant = "style-guide" | "material-compare" | "first-ritual" | "occasion-guide" | "monthly-drop" | "community";

const blobVariants: Array<"coastal" | "statement" | "modern" | "classic"> = ["coastal", "statement", "modern", "classic", "coastal", "statement"];

const editorials: Array<{ title: string; label: string; description: string; infographic: InfographicVariant }> = [
  { title: "The Art of Access", label: "Style Guide", description: "How to build a monthly selection that transitions from desk to dinner to weekend.", infographic: "style-guide" },
  { title: "Moissanite vs Diamond", label: "Material Story", description: "Why lab-created brilliance outperforms mined stones — optically, ethically, and economically.", infographic: "material-compare" },
  { title: "Your First Access Ritual", label: "New Member", description: "A guide to unpacking, styling, and photographing your first GEA shipment.", infographic: "first-ritual" },
  { title: "Event Dressing by Piece", label: "Occasion Guide", description: "Matching your selection to your calendar: galas, meetings, brunches, and everything between.", infographic: "occasion-guide" },
  { title: "The Monthly Drop", label: "New Arrivals", description: "What's entering the vault this month. First look, first access.", infographic: "monthly-drop" },
  { title: "Founding Members Speak", label: "Community", description: "Transformation stories from women who replaced their jewelry drawers with access.", infographic: "community" },
];

const Stories = () => {
  return (
    <PageLayout>
      <section className="bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center relative z-[1]">
          <WaxSeal size={40} className="mx-auto mb-4" />
          <AnimateIn variant="fadeIn" duration={0.6}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
              Journal
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.6}>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-[hsl(36,33%,93%)] tracking-[-0.01em] mb-4">
              The <ScribbleUnderline color="var(--brass)" delay={0.6}>Edit</ScribbleUnderline>
            </h1>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.3} duration={0.6}>
            <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[440px] mx-auto">
              Style guides, access rituals, material stories, and monthly drops —
              curated for women who live lighter.
            </p>
          </AnimateIn>
        </div>
      </section>

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading label="Latest" heading="From the House" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editorials.map((e, idx) => (
            <StaggerItem key={e.title}>
              <div className="border border-border bg-card group relative overflow-hidden">
                <GrainOverlay opacity={0.02} />
                <div className="aspect-[4/3] bg-secondary relative z-[1] overflow-hidden">
                  <EditorialInfographic variant={e.infographic} />
                  {idx === 0 && <TagRedStamp size={20} className="absolute top-3 right-3" />}
                </div>
                <div className="p-6 relative z-[1]">
                  <OrganicBlobTag variant={blobVariants[idx % blobVariants.length]} className="mb-2">
                    {e.label}
                  </OrganicBlobTag>
                  <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-2 group-hover:opacity-70 transition-opacity">
                    {e.title}
                  </h3>
                  <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                    {e.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Editor's pick */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:flex justify-center">
        <WashiTapeNote label="EDITOR'S PICK" tapeColor="var(--blush-peach)" rotation={1}>
          <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
            "The monthly drop feature is our most-read story — members check it first."
          </p>
        </WashiTapeNote>
      </div>

      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />
    </PageLayout>
  );
};

export default Stories;
