import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { MarginNote } from "@/components/craft/MarginNote";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { StampBadge } from "@/components/craft/StampBadge";

const steps = [
  { title: "Ultrasonic Cleaning", description: "Professional-grade ultrasonic bath removes oils, residue, and micro-debris from every surface and setting." },
  { title: "Repolishing", description: "Each piece is hand-polished to restore original luster. Scratches and surface marks are buffed away entirely." },
  { title: "Stone Inspection", description: "Every stone is checked under magnification. Loose settings are tightened. Damaged stones are replaced." },
  { title: "Clasp & Mechanism Testing", description: "All clasps, hinges, and closures are tested for secure function. Components are replaced if worn." },
  { title: "Medical-Grade Sanitization", description: "Final sanitization ensures each piece is hygienically pristine. Safe, thorough, and chemical-free." },
  { title: "Quality Certification", description: "Each piece receives a quality pass before re-entering the vault. Nothing ships without certification." },
];

const CareRepair = () => {
  return (
    <PageLayout>
      <PageHero
        label="The Atelier"
        headline={<>Restored to<br /><ScribbleUnderline>Perfection</ScribbleUnderline></>}
        subtitle="Every returning piece passes through our six-step restoration process. What arrives at your door is indistinguishable from new."
      />

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading label="The Process" heading="Six Steps to Renewal" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="border border-border bg-card p-8 h-full relative overflow-hidden">
                <GrainOverlay opacity={0.03} />
                <div className="flex items-center justify-between mb-4 relative z-[1]">
                  <OrganicBlobTag variant={i % 2 === 0 ? "coastal" : "statement"}>
                    Step <ScriptNumber>{String(i + 1).padStart(2, "0")}</ScriptNumber>
                  </OrganicBlobTag>
                  {i === 5 && <TagRedStamp size={16} />}
                </div>
                <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-3 relative z-[1]">
                  {s.title}
                </h3>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
                  {s.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Diamond chain border */}
      <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* Care tips */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <AnimateIn variant="fadeUp" duration={0.6}>
          <div className="border border-border bg-card p-10 md:p-14 relative overflow-hidden">
            <GrainOverlay opacity={0.03} />
            <StampBadge text="ATELIER" subtext="GEA" rotation={-8} className="absolute top-4 right-4 hidden md:inline-flex" />
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4 relative z-[1]">
              While It's Yours
            </p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-6 relative z-[1]">
              Simple Care <ScribbleUnderline color="var(--brass)" delay={0.4}>Guidelines</ScribbleUnderline>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-[1]">
              <div>
                <p className="text-[12px] text-foreground font-sans leading-relaxed mb-3">
                  <strong>Wear freely.</strong> Normal wear is fully covered under your membership. 
                  Don't be precious — that's our job.
                </p>
                <p className="text-[12px] text-foreground font-sans leading-relaxed">
                  <strong>Avoid chemicals.</strong> Remove jewelry before applying perfume, lotions, 
                  or cleaning products. These can dull metals and coatings.
                </p>
              </div>
              <div>
                <p className="text-[12px] text-foreground font-sans leading-relaxed mb-3">
                  <strong>Store in the pouch.</strong> When not wearing, keep pieces in the signature 
                  pouch provided. This prevents scratching.
                </p>
                <p className="text-[12px] text-foreground font-sans leading-relaxed">
                  <strong>Report damage promptly.</strong> Accidental damage is covered. Simply note it 
                  when you return the piece, and our atelier handles the rest at no cost.
                </p>
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* WashiTape + Margin note */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:flex justify-between items-start gap-8">
        <WashiTapeNote label="ATELIER NOTE" tapeColor="var(--brass)" rotation={-1}>
          <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
            "We've restored over 2,000 pieces — each one treated as if it were its very first wear."
          </p>
        </WashiTapeNote>
        <div className="max-w-md">
          <MarginNote attribution="GEA Atelier">
            We treat every returning piece as if it were being prepared for its very first wear.
          </MarginNote>
        </div>
      </div>

      {/* Stitch line divider */}
      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* CTA */}
      <section className="border-t border-border relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
                Every Piece, Perfectly Prepared
              </h2>
              <p className="text-[12px] text-muted-foreground font-sans mb-8">
                Repair included. Insurance included. That's the standard.
              </p>
              <Link to="/#founding-access" className="btn-gea">
                Apply for Access
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default CareRepair;
