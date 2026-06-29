import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { ProductImageRow } from "@/components/ProductImageRow";
import { LandingScrollVideoHero } from "@/components/landing/LandingScrollVideoHero";
import { CategoryCarousel } from "@/components/landing/CategoryCarousel";
import { StackingBanner } from "@/components/landing/StackingBanner";
import { WaveTransition } from "@/components/landing/WaveTransition";
import { ArtOfStacking } from "@/components/landing/ArtOfStacking";
import { StackingGrid } from "@/components/landing/StackingGrid";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { MarginNote } from "@/components/craft/MarginNote";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { SwayingStems } from "@/components/craft/SwayingStems";
import { Loader2 } from "lucide-react";

const outAndAboutCards = [
  {
    name: "Harper",
    place: "Miami",
    occasion: "gallery night",
    quote: "\"Wore my rented rainbow tennis necklace to an opening in Wynwood and two strangers asked where it was from. Felt like the art was wearing me back.\"",
    note: "most-loved piece, 3 months running",
  },
  {
    name: "June",
    place: "Austin",
    occasion: "rooftop dinner",
    quote: "\"Tried the rings-on-a-chain trick for a birthday dinner on South Congress. Three rings, one chain, endless compliments. My new signature, honestly.\"",
    note: "from the styling challenge",
  },
  {
    name: "Margot",
    place: "Charleston",
    occasion: "garden wedding",
    quote: "\"Rented the daisy enamel huggies for a friend's wedding instead of buying something I'd wear once. Danced all night. Sent them back Monday with zero regret.\"",
    note: "rented, loved, returned",
  },
  {
    name: "Sloane",
    place: "New York",
    occasion: "big presentation",
    quote: "\"One architectural cuff for the boardroom, one soft pearl drop for dinner after. I tried pieces I'd never have bought blind — now I know exactly what suits the woman I'm becoming.\"",
    note: "her becoming brief, worn",
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
      <SwayingStems density="full" />

      {/* Module A — big static category bubbles + large slow-moving banner */}
      <CategoryCarousel />
      <StackingBanner />
      <WaveTransition />

      <LandingScrollVideoHero />

      {/* Module B — surfaces right after the video experience */}
      <ArtOfStacking />

      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <SectionHeading label="Craft ✿" heading="What Your Pieces Are Made of" script="made to be worn, loved, returned, reborn ✿" />
      <section className="material-section-mobile max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-6">
        <StaggerContainer className="material-grid-mobile grid grid-cols-1 md:grid-cols-3 gap-3">
          <StaggerItem>
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="material-image-mobile aspect-[16/10] max-h-[280px] overflow-hidden relative">
                <img src="/images/material-steel.webp" alt="Layered gold chain necklaces showcasing 316L stainless steel craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-3 left-3">
                  <OrganicBlobTag variant="coastal">Hypoallergenic</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile card-frosted border-t border-border p-5 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">316L Stainless Steel &amp; Sterling Silver</p>
                <p className="material-description text-[11px] text-muted-foreground font-sans leading-relaxed">Surgical-grade stainless steel - tarnish-resistant and hypoallergenic. Sterling silver for timeless brilliance.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="material-image-mobile aspect-[16/10] max-h-[280px] overflow-hidden relative">
                <img src="/images/material-moissanite.webp" alt="Layered moissanite tennis necklaces on model" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-3 left-3">
                  <OrganicBlobTag variant="classic">Conflict-Free</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile card-frosted border-t border-border p-5 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lab-Created Moissanite</p>
                <p className="material-description text-[11px] text-muted-foreground font-sans leading-relaxed">Conflict-free brilliance. Higher refractive index than diamond. Ethically engineered.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.02]">
              <div className="material-image-mobile aspect-[16/10] max-h-[280px] overflow-hidden relative">
                <img src="/images/material-lifecycle.webp" alt="Gold earrings and chain jewelry showcasing lifecycle care craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-3 left-3">
                  <OrganicBlobTag variant="statement">Restored</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile card-frosted border-t border-border p-5 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lifecycle Care</p>
                <p className="material-description text-[11px] text-muted-foreground font-sans leading-relaxed">Every piece is professionally cleaned, inspected, and restored between members.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      <div className="max-w-[1180px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-5 hidden md:flex justify-between items-start gap-8">
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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : products.length > 0 ? (
        <>
          <WavyDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mt-4" />
          <SectionHeading label="Community ✿" heading="The Edit" script="what members are wearing right now" headingMobile />
          <ProductImageRow products={products} />
          <SectionHeading label="Out & About ✿" heading="Where Members Are Going" script="postcards from the journey ✿" headingMobile />
          <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
            <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-4">
              {outAndAboutCards.map((item) => (
                <div
                  key={item.name}
                  className="relative border border-dashed bg-card p-3 md:p-8"
                  style={{
                    borderColor: "var(--poppy)",
                    background: "linear-gradient(180deg, var(--rose-soft) 0%, hsl(var(--card)) 38%)",
                  }}
                >
                  <p
                    className="mb-0.5 md:mb-1 text-[0.8rem] md:text-[1.15rem] leading-tight"
                    style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}
                  >
                    {item.name}, {item.place} ✿
                  </p>
                  <p className="mb-1.5 md:mb-3 font-sans text-[8px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-muted-foreground">
                    {item.occasion}
                  </p>
                  <h3 className="mb-1.5 md:mb-3 font-serif text-[11px] md:text-lg font-semibold tracking-[0.02em] italic leading-snug">
                    {item.quote}
                  </h3>
                  <p
                    className="mt-2 md:mt-4 text-[0.78rem] md:text-[1rem] leading-tight"
                    style={{ fontFamily: "var(--font-script)", color: "var(--meadow)" }}
                  >
                    — {item.note}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {/* Module C — the Feed, after Out & About */}
      <StackingGrid />

      <section className="hidden md:block card-frosted-brown relative overflow-hidden">
        <GrainOverlay opacity={0.04} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 text-center relative z-[1]">
          <AnimateIn variant="fadeUp" duration={0.6}>
            <HandDrawnFrame strokeColor="hsl(30,16%,38%)">
              <div className="py-6">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-[-0.01em] text-foreground mb-6 normal-case">
                  Bloom <ScribbleUnderline color="var(--poppy-deep)">Freely</ScribbleUnderline>.
                </h2>
                <p className="text-[13px] text-foreground/75 font-sans max-w-[400px] mx-auto mb-6 leading-relaxed">
                  You were never meant to stay the same. Dress the woman you're becoming — with the freedom to wear more, and keep what you love.
                </p>
                <Link
                  to="/how-it-works"
                  className="inline-block border px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans text-[#faf4e8] transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--poppy)", borderColor: "var(--poppy-deep)", boxShadow: "4px 4px 0 var(--poppy-deep)" }}
                >
                  See Membership ✿
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
