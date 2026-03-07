import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ValueBlock } from "@/components/shared/ValueBlock";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { Gem, RotateCcw, Crown, Unlock } from "lucide-react";

const values = [
  { title: "Artistry Without Extraction", description: "Every piece uses lab-created moissanite and recycled metals. No mining. No compromise on brilliance.", icon: Gem, label: "Principle 01" },
  { title: "Access Over Accumulation", description: "We believe the most sustainable piece of jewelry is the one that's always being worn — not the one gathering dust.", icon: RotateCcw, label: "Principle 02" },
  { title: "Craft as Legacy", description: "Inspired by generations of women who adorned themselves with intention, GEA carries forward a lineage of beauty as ritual.", icon: Crown, label: "Principle 03" },
  { title: "Access as Equity", description: "Luxury shouldn't require wealth accumulation. It should require taste, intention, and the freedom to express.", icon: Unlock, label: "Principle 04" },
];

const About = () => {
  return (
    <PageLayout>
      <PageHero
        label="The House"
        headline={"Adorn the Woman\nYou Are Becoming"}
        subtitle="GEA was born from a simple conviction: luxury should liberate, not burden. Access should define status — not ownership."
      />

      {/* Founder story */}
      <SectionHeading label="Origin" heading="The Founder's Story" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          <AnimateIn variant="fadeIn" duration={0.6}>
            <div className="h-full">
              <img src="/images/founder-portrait.png" alt="GEA founder portrait" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.6}>
            <div className="bg-card border border-border p-10 md:p-14 flex flex-col justify-center h-full">
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-6">
                A Letter from the Founder
              </p>
              <p className="text-[13px] text-foreground font-sans leading-[1.8] mb-6">
                I grew up watching my mother transform everything she touched — and build a company
                that empowered millions of women to create the lives and homes they imagined. I wanted
                to follow in her footsteps, but the world has changed. Women are more mobile, selective,
                and conscious.
              </p>
              <p className="text-[13px] text-foreground font-sans leading-[1.8] mb-6">
                We want beauty without waste, luxury without guilt, and self-expression without clutter —
                yet jewelry is still stuck in old habits of ownership and accumulation.
              </p>
              <p className="text-[13px] text-foreground font-sans leading-[1.8]">
                So I created a brand that reimagines luxury as access, not ownership — curated high-design
                jewelry that moves with your life, evolves with your taste, and carries no burden.
                Access is luxury. Presence is the only possession that matters.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Values grid */}
      <SectionHeading label="Doctrine" heading="What We Stand For" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <ValueBlock title={v.title} description={v.description} className="bg-card" lucideIcon={v.icon} label={v.label} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Manifesto block */}
      <section className="bg-foreground text-background">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 text-center">
          <AnimateIn variant="fadeIn" duration={0.6}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-background/50 mb-6 font-sans">
              Manifesto
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.8}>
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.2] tracking-[-0.01em] max-w-[700px] mx-auto mb-6 italic">
              "We do not sell jewelry. We grant access to a life more beautifully adorned —
              without the weight of ownership, without the guilt of extraction,
              without the anxiety of accumulation."
            </blockquote>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.3} duration={0.6}>
            <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-background/50">
              — The House of GEA
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <AnimateIn variant="fadeUp" duration={0.5}>
            <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
              Join the House
            </h2>
            <p className="text-[12px] text-muted-foreground font-sans mb-8">
              Access is luxury. Your next chapter awaits.
            </p>
            <Link to="/#founding-access" className="btn-gea">
              Apply for Access
            </Link>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
