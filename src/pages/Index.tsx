import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepBlock } from "@/components/shared/StepBlock";
import { ValueBlock } from "@/components/shared/ValueBlock";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { OfferUnit } from "@/components/membership/OfferUnit";
import { ProductImageRow } from "@/components/ProductImageRow";
import { Loader2, Hand, Package, Sparkles, RefreshCw, Shield, Wrench, Truck, Gem, Ban } from "lucide-react";

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
      {/* ═══════════════════════════════════════════
          1. AUTHORITY HERO
          ═══════════════════════════════════════════ */}
      <section>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] min-h-[640px] lg:min-h-[720px]">
          <div className="hidden md:block bg-[hsl(30,18%,38%)] overflow-hidden">
            <img
              src="/images/hero-authority.png"
              alt="Layered gold and moissanite necklaces on model"
              className="w-full h-full object-cover"
              width={480}
              height={720}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="flex flex-col items-center justify-center text-center px-8 md:px-12 lg:px-16 py-24 bg-[hsl(28,22%,34%)]">
            <AnimateIn variant="fadeIn" duration={0.8}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-8 font-sans">The House of GEA</p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.2} duration={0.8}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.8rem] font-medium leading-[1.08] tracking-[-0.01em] text-[hsl(36,33%,93%)] whitespace-pre-line mb-6">
                Luxury,{"\n"}Accessed.
              </h1>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.4} duration={0.8}>
              <p className="text-[13px] leading-relaxed text-[hsl(36,20%,75%)] max-w-[380px] mb-12 font-sans">
                Curated high-design jewelry, cared for through its entire journey.
                Your money stretches further. Your visual impact multiplies.
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.6} duration={0.8}>
              <a
                href="#founding-access"
                className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
              >
                Apply for Access
              </a>
            </AnimateIn>
          </div>
          <div className="hidden md:block bg-[hsl(32,15%,42%)] overflow-hidden">
            <img
              src="/images/hero-editorial.png"
              alt="Gold and emerald rings styled on hand"
              className="w-full h-full object-cover"
              width={480}
              height={720}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. HOW IT WORKS (mini)
          ═══════════════════════════════════════════ */}
      <SectionHeading label="The Process" heading="How It Works" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StaggerItem><StepBlock number="01" title="Choose" description="Browse our curated vault and select the pieces that speak to your moment." icon={Hand} /></StaggerItem>
          <StaggerItem><StepBlock number="02" title="Receive" description="Your selections arrive in 1–3 days, freshly restored and sealed in our signature packaging." icon={Package} /></StaggerItem>
          <StaggerItem><StepBlock number="03" title="Wear" description="Style them for your life — the event, the meeting, the dinner, the everyday." icon={Sparkles} /></StaggerItem>
          <StaggerItem><StepBlock number="04" title="Refresh" description="When you're ready for something new, return and choose your next chapter." icon={RefreshCw} /></StaggerItem>
        </StaggerContainer>
        <div className="text-center mt-10">
          <Link to="/how-it-works" className="cta-underline">Learn More</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. MATERIAL INTELLIGENCE
          ═══════════════════════════════════════════ */}
      <SectionHeading label="Craft" heading="Material Intelligence" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          <div className="flex flex-col">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/material-steel.png"
                alt="Layered gold chain necklaces showcasing 316L stainless steel craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">316L Stainless Steel & Sterling Silver</p>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                Surgical-grade stainless steel — tarnish-resistant and hypoallergenic. Sterling silver for timeless brilliance. Both built to endure through every access cycle.
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/material-moissanite.png"
                alt="Layered moissanite tennis necklaces on model"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lab-Created Moissanite</p>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                Conflict-free brilliance. Higher refractive index than diamond. Ethically engineered.
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/material-lifecycle.png"
                alt="Gold earrings and chain jewelry showcasing lifecycle care craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lifecycle Care</p>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                Every piece is professionally cleaned, inspected, and restored between members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. ACCESS FRAMEWORK
          ═══════════════════════════════════════════ */}
      <SectionHeading label="Philosophy" heading="Access Defines Status" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          <div className="bg-card border border-border p-10 md:p-14">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">The Old Model</p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">Ownership Is a Liability</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              The average woman wears each piece of fine jewelry fewer than five times before it sits
              forgotten. Thousands spent. Inches of drawer space consumed. Value depreciating silently.
              The traditional model rewards accumulation over expression.
            </p>
          </div>
          <div className="bg-foreground text-background p-10 md:p-14">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-background/60 mb-4">The GEA Model</p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">Access Is Intelligence</h3>
            <p className="text-[12px] text-background/70 font-sans leading-relaxed">
              Access the full vault. Wear what speaks to you this month. Return when you're ready
              for something new. No commitment to a single piece — commitment to always being adorned
              exactly as you wish. Presence over possession. Experience over accumulation.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DECLARATIVE: More Beauty. Less Burden.
          ═══════════════════════════════════════════ */}
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-[-0.01em] text-[hsl(36,33%,93%)] mb-6">
            More Beauty.{"\n"}Less Burden.
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10 leading-relaxed">
            Adorn the woman you are becoming. Not the one weighed down by what she already owns.
          </p>
          <a
            href="#founding-access"
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            Apply for Access
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. VALUE EXPANSION
          ═══════════════════════════════════════════ */}
      <SectionHeading label="Freedom" heading="Wear More. Spend Smarter." />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StaggerItem><ValueBlock title="Freedom to Experiment" description="Try bold statement pieces without the commitment of ownership. If it doesn't feel right, refresh your selection next month. No risk. No regret." className="bg-card" /></StaggerItem>
          <StaggerItem><ValueBlock title="Always Something New" description="Your collection evolves as you do. New drops enter the vault monthly. Early access for members means you're always first." className="bg-card" /></StaggerItem>
          <StaggerItem><ValueBlock title="Luxury Without Burden" description="No storage anxiety. No depreciation. No buyer's remorse. Just beautiful jewelry, worn with intention, returned with ease." className="bg-card" /></StaggerItem>
        </StaggerContainer>
      </section>

      {/* ═══════════════════════════════════════════
          6. SOCIAL VALIDATION
          ═══════════════════════════════════════════ */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : products.length > 0 ? (
        <>
          <SectionHeading label="Community" heading="The Edit" />
          <ProductImageRow products={products} />
        </>
      ) : null}

      {/* ═══════════════════════════════════════════
          7. MEMBERSHIP ENGINE (OfferUnit standard)
          ═══════════════════════════════════════════ */}
      <SectionHeading label="Membership" heading="Your Tier of Access" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
        <OfferUnit variant="standard" />
        <div className="text-center mt-6">
          <TrustStrip variant="compact" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7b. TRUST STRIP (5 standards)
          ═══════════════════════════════════════════ */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: Shield, text: "Sanitized & Sealed" },
            { icon: Wrench, text: "Repair Guarantee" },
            { icon: Truck, text: "Secure Delivery" },
            { icon: Gem, text: "Damage Clarity" },
            { icon: Gem, text: "Keep Your Favorite" },
            { icon: Ban, text: "Cancel Anytime" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-sans text-muted-foreground">
              <item.icon className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

    </PageLayout>
  );
};

export default Index;
