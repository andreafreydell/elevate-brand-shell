import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ValueBlock } from "@/components/shared/ValueBlock";

const stats = [
  { value: "3,000+", label: "Tons of rock displaced per carat of mined diamond" },
  { value: "87%", label: "Of fine jewelry sits unworn in drawers" },
  { value: "0", label: "Mines required for lab-created moissanite" },
  { value: "∞", label: "Wears from a single restored piece" },
];

const Sustainability = () => {
  return (
    <PageLayout>
      <PageHero
        label="Responsibility"
        headline={"Beauty Without\nExtraction"}
        subtitle="The jewelry industry mines the earth and fills drawers. GEA operates differently — lab-created stones, circular access, and in-house restoration."
      />

      {/* Data blocks */}
      <SectionHeading label="The Reality" heading="What the Industry Won't Tell You" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="border border-border bg-card p-8 text-center">
              <p className="font-serif text-3xl md:text-4xl font-medium mb-3">{s.value}</p>
              <p className="text-[10px] tracking-[0.15em] uppercase font-sans text-muted-foreground leading-relaxed">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Circular model */}
      <SectionHeading label="Our Approach" heading="The Circular Model" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ValueBlock title="Lab-Created Stones" description="Every GEA piece features lab-created moissanite — optically superior to diamond, conflict-free, and requiring zero mining. Brilliance without extraction." className="bg-card" />
          <ValueBlock title="Access Over Landfill" description="A single piece in the GEA vault serves dozens of members across hundreds of wears. Access extends the lifecycle of every gram of metal and every set stone." className="bg-card" />
          <ValueBlock title="In-House Restoration" description="Our atelier restores each piece between members: hand cleaning, UV sanitization, 4-point inspection. Nothing is discarded. Everything is renewed." className="bg-card" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-[hsl(36,33%,93%)] mb-4">
            Wear with Intention
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10">
            Access beauty that doesn't cost the earth — literally.
          </p>
          <Link
            to="/founding-circle"
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            Apply for Access
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default Sustainability;
