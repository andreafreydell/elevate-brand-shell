import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";

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
        headline={"Restored to\nPerfection"}
        subtitle="Every returning piece passes through our six-step restoration process. What arrives at your door is indistinguishable from new."
      />

      <SectionHeading label="The Process" heading="Six Steps to Renewal" />
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="border border-border bg-card p-8">
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
                Step {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-3">
                {s.title}
              </h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Care tips */}
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <div className="border border-border bg-card p-10 md:p-14">
          <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
            While It's Yours
          </p>
          <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-6">
            Simple Care Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            Every Piece, Perfectly Prepared
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans mb-8">
            Repair included. Insurance included. That's the standard.
          </p>
          <Link to="/membership" className="btn-gea">
            Apply for Access
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default CareRepair;
