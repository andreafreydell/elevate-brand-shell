import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepBlock } from "@/components/shared/StepBlock";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { OfferUnit } from "@/components/membership/OfferUnit";
import { ProductImageRow } from "@/components/ProductImageRow";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { CircleEmphasis } from "@/components/craft/CircleEmphasis";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { MarginNote } from "@/components/craft/MarginNote";
import { StampBadge } from "@/components/craft/StampBadge";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { SketchyBorderCard } from "@/components/craft/SketchyBorderCard";
import { DotGridTexture } from "@/components/craft/DotGridTexture";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { HandDrawnRect } from "@/components/craft/HandDrawnRect";
import { MarkerCircle } from "@/components/craft/MarkerCircle";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import {
  Loader2,
  Hand,
  Package,
  Sparkles,
  RefreshCw,
  Heart,
  Shuffle,
  CalendarPlus,
  Feather,
  Scale,
  Zap,
} from "lucide-react";

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
      <section className="hero-section-mobile">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] min-h-0 md:min-h-[640px] lg:min-h-[720px]">
          <div className="h-[180px] md:h-auto bg-[hsl(30,18%,38%)] overflow-hidden">
            <img
              src="/images/hero-authority.png"
              alt="Layered gold and moissanite necklaces on model"
              className="w-full h-full object-cover object-top md:object-center"
              width={480}
              height={720}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-content-mobile relative flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 py-10 md:py-24 bg-[hsl(28,22%,34%)] overflow-hidden">
            <GrainOverlay opacity={0.05} />
            <WaxSeal size={40} className="absolute top-6 right-6 md:top-10 md:right-10" />
            <StampBadge text="FOUNDING" subtext="2026" rotation={-8} className="absolute bottom-4 left-4 md:bottom-8 md:left-8" />
            <AnimateIn variant="fadeIn" duration={0.8}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-4 md:mb-8 font-sans">
                High-Design Jewelry Access
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.2} duration={0.8}>
              <h1 className="hero-headline-mobile hero-display text-[hsl(36,33%,93%)] whitespace-pre-line mb-4 md:mb-6">
                Luxury,{"\n"}
                <ScribbleUnderline color="var(--brass)" delay={0.8}>
                  Accessed.
                </ScribbleUnderline>
              </h1>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.4} duration={0.8}>
              <p className="hero-subtitle-mobile text-[11px] md:text-[13px] leading-relaxed text-[hsl(36,20%,75%)] max-w-[420px] mb-3 font-sans">
                High-design jewelry you access, not own.
                <br />
                For women who want beauty without burden.
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.5} duration={0.8}>
              <p className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[hsl(36,25%,78%)] max-w-[420px] mb-6 md:mb-8 font-sans">
                Wear more. Store less. Spend more intelligently.
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.6} duration={0.8}>
              <Link
                to="/browse"
                className="relative z-[1] inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-8 md:px-10 py-3 md:py-3.5 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
              >
                Browse the Collection
              </Link>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.7} duration={0.8}>
              <p className="mt-5 max-w-[420px] text-[11px] md:text-[12px] font-sans leading-relaxed text-[hsl(36,25%,78%)]">
                Membership from $65/mo. Choose 5 or 10 pieces each cycle. Keep 1 favorite.
              </p>
              <TrustStrip
                variant="compact"
                className="mt-4 md:mt-5 text-[hsl(36,25%,78%)] [&_*]:text-[hsl(36,25%,78%)]"
              />
            </AnimateIn>
          </div>
          <div className="h-[180px] md:h-auto bg-[hsl(32,15%,42%)] overflow-hidden">
            <img
              src="/images/hero-editorial.png"
              alt="Gold and emerald rings styled on hand"
              className="w-full h-full object-cover md:object-center"
              style={{ objectPosition: "50% 75%" }}
              width={480}
              height={720}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <section className="bg-background-alt">
        <SectionHeading label="The Process" heading="How It Works" />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
          <StaggerContainer className="flex flex-col md:flex-row gap-4 md:items-stretch [&>*]:md:flex-1 [&>*]:md:basis-0 [&>*]:md:min-w-0">
            <StaggerItem>
              <StepBlock number="01" title="Choose" description="Browse our curated vault and select the pieces that speak to your moment." icon={Hand} />
            </StaggerItem>
            <StaggerItem>
              <StepBlock number="02" title="Receive" description="Your selections arrive in 1-3 days, freshly restored and sealed in our signature packaging." icon={Package} />
            </StaggerItem>
            <StaggerItem>
              <StepBlock number="03" title="Wear" description="Style them for your life - the event, the meeting, the dinner, the everyday." icon={Sparkles} />
            </StaggerItem>
            <StaggerItem>
              <StepBlock number="04" title="Keep Your Favorite" description="One piece per cycle is yours to keep - included in your membership. Want more? Members save 40% on any additional piece." icon={Heart} />
            </StaggerItem>
            <StaggerItem>
              <StepBlock number="05" title="Refresh" description="At the end of your cycle, return the pieces you are not keeping and choose your next chapter." icon={RefreshCw} />
            </StaggerItem>
          </StaggerContainer>
          <div className="text-center mt-10">
            <Link to="/how-it-works" className="cta-underline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-background-alt">
        <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />
      </div>

      <section className="bg-background-alt">
        <SectionHeading label="Membership" heading="Your Tier of Access" />
        <div className="tier-section-mobile max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
          <div className="hidden md:flex justify-center mb-10">
            <HandDrawnRect className="max-w-md">
              <p className="text-center font-sans text-[12px] text-muted-foreground leading-relaxed">
                Our most popular plan is the{" "}
                <span className="font-semibold text-foreground">Stacking Membership</span>{" "}
                at{" "}
                <MarkerCircle color="var(--tag-red)">
                  <span className="font-semibold text-foreground">$85/mo</span>
                </MarkerCircle>
                , with <ScriptNumber>10</ScriptNumber> items to mix, match &amp; layer
              </p>
            </HandDrawnRect>
          </div>
          <OfferUnit variant="standard" />
          <div className="text-center mt-6">
            <TrustStrip variant="full" />
          </div>
        </div>
      </section>

      <WavyDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mt-8" />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : products.length > 0 ? (
        <>
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

      <WavyDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mt-8" />

      <SectionHeading label="Freedom" heading="Wear More. Spend Smarter." />
      <DotGridTexture className="max-w-[1440px] mx-auto" dotSize={0.6} spacing={24}>
        <section className="value-section-mobile px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
          <StaggerContainer className="value-grid-mobile grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 justify-items-center">
            <StaggerItem>
              <WashiTapeNote label="Explore" tapeColor="var(--seafoam)" rotation={-1.2} className="max-w-none w-full">
                <Shuffle className="h-5 w-5 stroke-[1.3] text-foreground mb-4" />
                <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-3">Freedom to Experiment</h3>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                  Try bold statement pieces without the commitment of ownership. If it doesn&apos;t feel right, refresh your selection at the end of your cycle. No risk. No regret.
                </p>
              </WashiTapeNote>
            </StaggerItem>
            <StaggerItem>
              <WashiTapeNote label="Discover" tapeColor="var(--tag-red)" rotation={0.8} className="max-w-none w-full">
                <CalendarPlus className="h-5 w-5 stroke-[1.3] text-foreground mb-4" />
                <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-3">Always Something New</h3>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                  Your collection evolves as you do. New drops enter the vault monthly. Early access for members means you&apos;re always first.
                </p>
              </WashiTapeNote>
            </StaggerItem>
            <StaggerItem>
              <WashiTapeNote label="Liberate" tapeColor="var(--seafoam)" rotation={-0.6} className="max-w-none w-full">
                <Feather className="h-5 w-5 stroke-[1.3] text-foreground mb-4" />
                <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-3">Luxury Without Burden</h3>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                  No storage anxiety. No depreciation. No buyer&apos;s remorse. Just beautiful jewelry, worn with intention, returned with ease.
                </p>
              </WashiTapeNote>
            </StaggerItem>
          </StaggerContainer>

          <div className="hidden md:flex justify-center mt-10">
            <SketchyBorderCard label="EDITOR'S NOTE" pathVariant={1} className="max-w-lg">
              <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
                &quot;Members who refresh each cycle tell us they feel more confident experimenting with bolder pieces they&apos;d never commit to buying.&quot;
              </p>
            </SketchyBorderCard>
          </div>
        </section>
      </DotGridTexture>

      <SectionHeading label="Craft" heading="What Your Pieces Are Made of" />
      <section className="material-section-mobile max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <StaggerContainer className="material-grid-mobile grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          <StaggerItem>
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.03]">
              <div className="material-image-mobile aspect-[4/5] overflow-hidden relative">
                <img src="/images/material-steel.png" alt="Layered gold chain necklaces showcasing 316L stainless steel craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-4 left-4">
                  <OrganicBlobTag variant="coastal">Hypoallergenic</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">316L Stainless Steel &amp; Sterling Silver</p>
                <p className="material-description text-[12px] text-muted-foreground font-sans leading-relaxed">Surgical-grade stainless steel - tarnish-resistant and hypoallergenic. Sterling silver for timeless brilliance. Both built to endure through every access cycle.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.03]">
              <div className="material-image-mobile aspect-[4/5] overflow-hidden relative">
                <img src="/images/material-moissanite.png" alt="Layered moissanite tennis necklaces on model" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-4 left-4">
                  <OrganicBlobTag variant="classic">Conflict-Free</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lab-Created Moissanite</p>
                <p className="material-description text-[12px] text-muted-foreground font-sans leading-relaxed">Conflict-free brilliance. Higher refractive index than diamond. Ethically engineered.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.03]">
              <div className="material-image-mobile aspect-[4/5] overflow-hidden relative">
                <img src="/images/material-lifecycle.png" alt="Gold earrings and chain jewelry showcasing lifecycle care craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute top-4 left-4">
                  <OrganicBlobTag variant="statement">Restored</OrganicBlobTag>
                </div>
              </div>
              <div className="material-text-mobile bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
                <p className="material-label text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lifecycle Care</p>
                <p className="material-description text-[12px] text-muted-foreground font-sans leading-relaxed">Every piece is professionally cleaned, inspected, and restored between members.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:flex justify-between items-start gap-8">
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

      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="bg-background-alt">
        <SectionHeading label="Philosophy" heading="Access Defines Status" />
        <div className="philosophy-section-mobile max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
          <StaggerContainer className="philosophy-grid-mobile grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            <StaggerItem>
              <div className="philosophy-card-mobile bg-card border border-border p-10 md:p-14 h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-foreground hover:border-2">
                <div className="philosophy-chart-mobile bg-background border border-border p-10 mb-8 overflow-hidden min-h-[315px]">
                  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="ownBg" x1="0" y1="0" x2="400" y2="300">
                        <stop offset="0%" stopColor="hsl(38,28%,92%)" />
                        <stop offset="100%" stopColor="hsl(34,18%,88%)" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="300" fill="url(#ownBg)" />
                    <text x="200" y="30" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.25em" textAnchor="middle" fontWeight="500">OWN VS. ACCESS</text>
                    <line x1="60" y1="240" x2="340" y2="240" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.4" />
                    <rect x="90" y="80" width="70" height="160" fill="#E7B9A8" opacity="0.3" />
                    <line x1="90" y1="80" x2="160" y2="80" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.2" />
                    <text x="125" y="72" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">OWN</text>
                    <text x="125" y="140" fontSize="9" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">$200</text>
                    <text x="125" y="155" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.15em" textAnchor="middle">1 PIECE</text>
                    <rect x="200" y="160" width="35" height="80" fill="#BFD6CF" opacity="0.4" />
                    <rect x="245" y="150" width="35" height="90" fill="#BFD3E6" opacity="0.4" />
                    <rect x="290" y="165" width="35" height="75" fill="#BFD6CF" opacity="0.4" />
                    <text x="262" y="140" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">ACCESS</text>
                    <text x="262" y="200" fontSize="9" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">$85/mo</text>
                    <text x="262" y="215" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.15em" textAnchor="middle">10 PIECES</text>
                    <line x1="60" y1="80" x2="80" y2="80" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.15" />
                    <line x1="60" y1="160" x2="190" y2="160" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3" />
                    <rect x="352" y="260" width="16" height="16" rx="3" fill="#C54A3D" opacity="0.7" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="philosophy-label text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">The Old Model</p>
                  <Scale className="h-5 w-5 stroke-[1.3] text-foreground" />
                </div>
                <h3 className="philosophy-title font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">
                  Ownership Is a <CircleEmphasis color="var(--tag-red)">Liability</CircleEmphasis>
                </h3>
                <p className="philosophy-body text-[12px] text-muted-foreground font-sans leading-relaxed max-w-content">
                  The average woman wears each piece of fine jewelry fewer than <ScriptNumber>5</ScriptNumber> times before it sits forgotten. Thousands spent. Inches of drawer space consumed. Value depreciating silently. The traditional model rewards accumulation over expression.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="philosophy-card-mobile bg-foreground text-background p-10 md:p-14 h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-2 hover:border-background/40 relative">
                <TagRedStamp size={24} className="absolute top-6 right-6" />
                <div className="philosophy-chart-mobile bg-background border border-border p-10 mb-8 overflow-hidden min-h-[315px]">
                  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="accessBg" x1="0" y1="0" x2="400" y2="300">
                        <stop offset="0%" stopColor="hsl(38,28%,92%)" />
                        <stop offset="50%" stopColor="hsl(34,18%,88%)" />
                        <stop offset="100%" stopColor="hsl(38,28%,92%)" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="300" fill="url(#accessBg)" />
                    <text x="200" y="40" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.25em" textAnchor="middle" fontWeight="500">ACCESS CYCLE</text>
                    <circle cx="80" cy="130" r="30" fill="#BFD6CF" opacity="0.35" />
                    <text x="80" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">CHOOSE</text>
                    <circle cx="170" cy="130" r="30" fill="#BFD3E6" opacity="0.35" />
                    <text x="170" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">RECEIVE</text>
                    <circle cx="260" cy="130" r="30" fill="#E7B9A8" opacity="0.35" />
                    <text x="260" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">WEAR</text>
                    <circle cx="350" cy="130" r="30" fill="#B79B63" opacity="0.35" />
                    <text x="350" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">REFRESH</text>
                    <line x1="110" y1="130" x2="140" y2="130" stroke="hsl(32,12%,62%)" strokeWidth="1" opacity="0.2" />
                    <line x1="200" y1="130" x2="230" y2="130" stroke="hsl(32,12%,62%)" strokeWidth="1" opacity="0.2" />
                    <line x1="290" y1="130" x2="320" y2="130" stroke="hsl(32,12%,62%)" strokeWidth="1" opacity="0.2" />
                    <path d="M350 165 C350 220, 80 220, 80 165" stroke="#6E8F8B" strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="4 4" />
                    <polygon points="80,165 75,175 85,175" fill="#6E8F8B" opacity="0.3" />
                    <text x="215" y="240" fontSize="7" fill="#6E8F8B" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">RETURN &amp; REPEAT</text>
                    <rect x="352" y="260" width="16" height="16" rx="3" fill="#C54A3D" opacity="0.7" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="philosophy-label text-[10px] tracking-[0.3em] uppercase font-sans text-background/60">The GEA Model</p>
                  <Zap className="h-5 w-5 stroke-[1.3] text-background/70" />
                </div>
                <h3 className="philosophy-title font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4 text-background">
                  Access Is <ScribbleUnderline color="var(--seafoam)" delay={0.5}>Intelligence</ScribbleUnderline>
                </h3>
                <p className="philosophy-body text-[12px] text-background/70 font-sans leading-relaxed max-w-content">
                  Access the full vault. Wear what speaks to you this cycle. At the end of your cycle, keep the piece you love most, return the rest, and choose what is next. No commitment to a single piece - just the freedom to stay adorned exactly as you wish.{" "}
                  <ScriptNumber className="text-background/90">10+</ScriptNumber> pieces per year. Presence over possession.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

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
