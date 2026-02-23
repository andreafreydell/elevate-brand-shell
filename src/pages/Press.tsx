import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";

const Press = () => {
  return (
    <PageLayout>
      <PageHero
        label="Press"
        headline={"The House\nof GEA"}
        subtitle="For press inquiries, brand assets, and partnership opportunities."
      />

      <SectionHeading label="Resources" heading="Press Kit" />
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border bg-card p-8">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">Brand Assets</p>
            <h3 className="font-serif text-lg font-semibold mb-3">Logos & Guidelines</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-6">
              Download the GEA brand kit including logos, color palette, typography specifications, and usage guidelines.
            </p>
            <span className="cta-underline">Download Kit</span>
          </div>
          <div className="border border-border bg-card p-8">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">Imagery</p>
            <h3 className="font-serif text-lg font-semibold mb-3">Product & Editorial</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-6">
              High-resolution product photography, editorial lookbook images, and lifestyle shots available for media use.
            </p>
            <span className="cta-underline">View Gallery</span>
          </div>
          <div className="border border-border bg-card p-8">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">Inquiries</p>
            <h3 className="font-serif text-lg font-semibold mb-3">Media Contact</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-6">
              For interviews, features, and collaboration inquiries, reach our press team directly.
            </p>
            <Link to="/contact" className="cta-underline">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="bg-foreground text-background">
        <div className="max-w-[1440px] mx-auto px-12 lg:px-16 py-16 md:py-20 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-background/50 mb-6 font-sans">About GEA</p>
          <p className="font-serif text-lg md:text-xl font-medium leading-[1.5] max-w-[600px] mx-auto italic">
            GEA is a fashion house jewelry access system. We replace ownership with rotation, 
            accumulation with expression, and extraction with intention. Founded on the principle 
            that access defines status.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Press;
