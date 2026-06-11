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
import { SwayingStems } from "@/components/craft/SwayingStems";
import { BloomDivider } from "@/components/craft/BloomDivider";
import { GardenSticker } from "@/components/craft/GardenSticker";
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
      <SwayingStems density="light" />
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
          <SectionHeading label="Out & About ✿" heading="Where Members Are Going" headingMobile />
          <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {outAndAboutCards.map((item) => (
                <div
                  key={item.name}
                  className="relative border border-dashed bg-card p-6 md:p-8"
                  style={{
                    borderColor: "var(--poppy)",
                    background: "linear-gradient(180deg, var(--rose-soft) 0%, hsl(var(--card)) 38%)",
                  }}
                >
                  <p
                    className="mb-1 text-[1.15rem]"
                    style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}
                  >
                    {item.name}, {item.place} ✿
                  </p>
                  <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {item.occasion}
                  </p>
                  <h3 className="mb-3 font-serif text-lg font-semibold tracking-[0.02em] italic">
                    {item.quote}
                  </h3>
                  <p
                    className="mt-4 text-[1rem]"
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

      <BloomDivider />

      <section className="relative max-w-[760px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-20 text-center">
        <AnimateIn variant="fadeUp" duration={0.6}>
          <div className="mb-5">
            <GardenSticker variant="rose" rotation={-2}>new for members ✿</GardenSticker>
          </div>
          <h2 className="mb-4 font-serif text-3xl md:text-4xl font-medium italic tracking-[-0.01em] leading-[1.05] text-foreground">
            The Next Chapter
          </h2>
          <p
            className="mb-2 text-xl"
            style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}
          >
            a notebook for the journey ✿
          </p>
          <p className="mx-auto mb-8 max-w-[440px] font-sans text-[12px] leading-relaxed text-muted-foreground md:text-[13px]">
            A monthly companion written for who you're becoming — styling challenges, gentle goals, jewelry rituals, and word from members out in the world.
          </p>
          <a
            href="/next-chapter/index.html"
            className="inline-block border px-8 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-[#faf4e8] transition-colors"
            style={{ background: "var(--poppy)", borderColor: "var(--poppy-deep)" }}
          >
            Start My Notebook ✿
          </a>
        </AnimateIn>
      </section>

      <section className="hidden md:block bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.04} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center relative z-[1]">
          <AnimateIn variant="fadeUp" duration={0.6}>
            <HandDrawnFrame strokeColor="hsl(36,25%,78%)">
              <div className="py-6">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-[-0.01em] text-[hsl(36,33%,93%)] mb-6 normal-case">
                  Bloom <ScribbleUnderline color="var(--brass)">Freely</ScribbleUnderline>.
                </h2>
                <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10 leading-relaxed">
                  You were never meant to stay the same. Dress the woman you're becoming — not the one weighed down by what she already owns.
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
