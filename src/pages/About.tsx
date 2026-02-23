import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ValueBlock } from "@/components/shared/ValueBlock";

const values = [
  { title: "Artistry Without Extraction", description: "Every piece uses lab-created moissanite and recycled metals. No mining. No compromise on brilliance." },
  { title: "Rotation Over Accumulation", description: "We believe the most sustainable piece of jewelry is the one that's always being worn — not the one gathering dust." },
  { title: "Craft as Legacy", description: "Inspired by generations of women who adorned themselves with intention, GEA carries forward a lineage of beauty as ritual." },
  { title: "Access as Equity", description: "Luxury shouldn't require wealth accumulation. It should require taste, intention, and the freedom to express." },
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
          <div className="bg-[hsl(30,14%,32%)] aspect-[4/5] md:aspect-auto flex items-center justify-center min-h-[400px]">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[hsl(36,20%,75%)]">
              Founder Portrait
            </span>
          </div>
          <div className="bg-card border border-border p-10 md:p-14 flex flex-col justify-center">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-6">
              A Letter from the Founder
            </p>
            <p className="text-[13px] text-foreground font-sans leading-[1.8] mb-6">
              My mother kept a velvet box. Inside: three pieces of gold her mother gave her. 
              She wore them on occasions that mattered — weddings, milestones, moments of quiet power. 
              Those pieces weren't expensive. They were intentional.
            </p>
            <p className="text-[13px] text-foreground font-sans leading-[1.8] mb-6">
              That intention — adornment as ritual, as identity, as the visible expression of an 
              inner transformation — is what GEA carries forward. But we reject the model that says 
              you must own to access beauty. The industry's traditional structure rewards accumulation, 
              not expression. It extracts from the earth and from your wallet.
            </p>
            <p className="text-[13px] text-foreground font-sans leading-[1.8]">
              GEA is a rebellion against that. Rotation is intelligence. Access is luxury. 
              Presence is the only possession that matters.
            </p>
          </div>
        </div>
      </section>

      {/* Values grid */}
      <SectionHeading label="Doctrine" heading="What We Stand For" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.map((v) => (
            <ValueBlock key={v.title} title={v.title} description={v.description} className="bg-card" />
          ))}
        </div>
      </section>

      {/* Manifesto block */}
      <section className="bg-foreground text-background">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-background/50 mb-6 font-sans">
            Manifesto
          </p>
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.2] tracking-[-0.01em] max-w-[700px] mx-auto mb-6 italic">
            "We do not sell jewelry. We grant access to a life more beautifully adorned — 
            without the weight of ownership, without the guilt of extraction, 
            without the anxiety of accumulation."
          </blockquote>
          <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-background/50">
            — The House of GEA
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            Join the House
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans mb-8">
            Access is luxury. Your rotation awaits.
          </p>
          <Link to="/membership" className="btn-gea">
            Apply for Access
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
