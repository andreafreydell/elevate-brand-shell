import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { ProductImageRow } from "@/components/ProductImageRow";
import { LandingScrollVideoHero } from "@/components/landing/LandingScrollVideoHero";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { MarginNote } from "@/components/craft/MarginNote";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { Loader2 } from "lucide-react";

const proofPlaceholderCards = [
  {
    label: "Mock Quote 01",
    title: "\"I got compliments all day, but it still felt easy enough for everyday.\"",
    body: "Use this as the first testimonial placeholder. It captures the everyday-wear plus compliments theme that shows up again and again in competitor review language.",
  },
  {
    label: "Mock Quote 02",
    title: "\"The stack looked polished in seconds and felt lighter than I expected.\"",
    body: "Use this as the UGC-style placeholder. It reflects the comfort, lightweight feel, and instant styling payoff people respond to.",
  },
  {
    label: "Mock Quote 03",
    title: "\"I tried pieces I would never have bought blind, and now I know exactly what suits me.\"",
    body: "Use this as the discovery placeholder. It sells experimentation, confidence, and the value of trying trends before committing.",
  },
  {
    label: "Mock Quote 04",
    title: "\"The tennis necklace surprised me most - sparkly, comfortable, and easy to layer with everything.\"",
    body: "Use this as the most-kept placeholder. It leans into sparkle, versatility, and the kind of piece members end up reaching for constantly.",
  },
];

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 20 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <PageLayout>
      <LandingScrollVideoHero />

      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <SectionHeading label="Craft" heading="What Your Pieces Are Made of" />
      <section className="material-section-mobile max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-10">
        <StaggerContainer className="material-grid-mobile grid grid-cols-1 md:grid-cols-3 gap-3">
          <StaggerItem>
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="material-image-mobile aspect-[16/10] max-h-[280px] overflow-hidden relative">
                <img src="/images/material-steel.png" alt="Layered gold chain necklaces showcasing 316L stainless steel craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-3 left-3">
                  <OrganicBlobTag variant="coastal">Hypoallergenic</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile bg-card border-t border-border p-5 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">316L Stainless Steel &amp; Sterling Silver</p>
                <p className="material-description text-[11px] text-muted-foreground font-sans leading-relaxed">Surgical-grade stainless steel - tarnish-resistant and hypoallergenic. Sterling silver for timeless brilliance.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="material-image-mobile aspect-[16/10] max-h-[280px] overflow-hidden relative">
                <img src="/images/material-moissanite.png" alt="Layered moissanite tennis necklaces on model" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-3 left-3">
                  <OrganicBlobTag variant="classic">Conflict-Free</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile bg-card border-t border-border p-5 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lab-Created Moissanite</p>
                <p className="material-description text-[11px] text-muted-foreground font-sans leading-relaxed">Conflict-free brilliance. Higher refractive index than diamond. Ethically engineered.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="material-image-mobile aspect-[16/10] max-h-[280px] overflow-hidden relative">
                <img src="/images/material-lifecycle.png" alt="Gold earrings and chain jewelry showcasing lifecycle care craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-3 left-3">
                  <OrganicBlobTag variant="statement">Restored</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile bg-card border-t border-border p-5 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lifecycle Care</p>
                <p className="material-description text-[11px] text-muted-foreground font-sans leading-relaxed">Every piece is professionally cleaned, inspected, and restored between members.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      <div className="max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:flex justify-between items-start gap-8">
        <WashiTapeNote label="CURATOR'S PICK" tapeColor="var(--seafoam)" rotation={-1}>
          <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
            &quot;The moissanite tennis necklace is our most requested piece three months running.&quot;
          </p>
        </WashiTapeNote>
        <div className="max-w-md">
          <MarginNote attribution="GEA Material Lab">
            Sterling silver and surgical-grade stainless steel - every piece arrives polished and leaves looking just as fresh. No tarnish, no patina, just clean shine from first wear to last.
          </MarginNote>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : products.length > 0 ? (
        <>
          <WavyDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mt-4" />
          <SectionHeading label="Community" heading="The Edit" headingMobile />
          <ProductImageRow products={products} />
          <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {proofPlaceholderCards.map((item, index) => (
                <div key={item.label} className="border border-border bg-card p-6 md:p-8">
                  <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {item.label}
                  </p>
                  <h3 className="mb-3 font-serif text-lg font-semibold tracking-[0.02em]">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[12px] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Slot {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <section className="hidden md:block bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.04} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center relative z-[1]">
          <AnimateIn variant="fadeUp" duration={0.6}>
            <HandDrawnFrame strokeColor="hsl(36,25%,78%)">
              <div className="py-6">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-[-0.01em] text-[hsl(36,33%,93%)] mb-6 normal-case">
                  More <ScribbleUnderline color="var(--brass)">Beauty</ScribbleUnderline>.<br />Less Burden.
                </h2>
                <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10 leading-relaxed">
                  Adorn the woman you are becoming. Not the one weighed down by what she already owns.
                </p>
                <Link
                  to="/how-it-works"
                  className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
                >
                  See Membership
                </Link>
              </div>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
