import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";

const benefits = [
  "Complimentary Atelier-tier membership",
  "Early access to every drop and capsule",
  "Custom styling consultations",
  "Feature in GEA editorial content",
  "Commission on referred memberships",
  "Exclusive ambassador-only pieces",
];

const Ambassador = () => {
  return (
    <PageLayout>
      <PageHero
        label="Represent"
        headline={"Become a GEA\nAmbassador"}
        subtitle="We partner with women who embody access, intention, and visual authority. Not influencers — ambassadors."
      />

      <SectionHeading label="The Program" heading="What Ambassadors Receive" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-[600px] mx-auto">
          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 border-b border-border pb-4">
                <span className="mt-1 w-1.5 h-1.5 bg-foreground flex-shrink-0" />
                <span className="text-[13px] font-sans text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-card border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            Apply to Represent
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans mb-8 max-w-[400px] mx-auto">
            We review applications quarterly. Share your story, your platform, and why GEA aligns with your identity.
          </p>
          <Link to="/contact" className="btn-gea">
            Submit Application
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default Ambassador;
