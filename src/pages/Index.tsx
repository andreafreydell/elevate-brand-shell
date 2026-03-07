import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepBlock } from "@/components/shared/StepBlock";
import { ValueBlock } from "@/components/shared/ValueBlock";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { AutoCarousel } from "@/components/shared/AutoCarousel";
import { MobileCarousel } from "@/components/shared/MobileCarousel";
import { OfferUnit } from "@/components/membership/OfferUnit";
import { ProductImageRow } from "@/components/ProductImageRow";
import { Loader2, Hand, Package, Sparkles, RefreshCw, Shield, Wrench, Truck, Gem, Ban, Heart, Shuffle, CalendarPlus, Feather, Scale, Zap } from "lucide-react";

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
        <AutoCarousel interval={4000} cardWidth="min-w-[68vw] md:min-w-[240px]">
          <StepBlock number="01" title="Choose" description="Browse our curated vault and select the pieces that speak to your moment." icon={Hand} />
          <StepBlock number="02" title="Receive" description="Your selections arrive in 1–3 days, freshly restored and sealed in our signature packaging." icon={Package} />
          <StepBlock number="03" title="Wear" description="Style them for your life — the event, the meeting, the dinner, the everyday." icon={Sparkles} />
          <StepBlock number="04" title="Keep Your Favorite" description="One piece per cycle is yours to keep — included in your membership. Want more? Members save 40% on any additional piece." icon={Heart} />
          <StepBlock number="05" title="Refresh" description="When you're ready for something new, return and choose your next chapter." icon={RefreshCw} />
        </AutoCarousel>
        <div className="text-center mt-10">
          <Link to="/how-it-works" className="cta-underline">Learn More</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. MATERIAL INTELLIGENCE
          ═══════════════════════════════════════════ */}
      <SectionHeading label="Craft" heading="Material Intelligence" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          <StaggerItem>
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.03]">
              <div className="aspect-[4/5] overflow-hidden">
                <img src="/images/material-steel.png" alt="Layered gold chain necklaces showcasing 316L stainless steel craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">316L Stainless Steel & Sterling Silver</p>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">Surgical-grade stainless steel — tarnish-resistant and hypoallergenic. Sterling silver for timeless brilliance. Both built to endure through every access cycle.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.03]">
              <div className="aspect-[4/5] overflow-hidden">
                <img src="/images/material-moissanite.png" alt="Layered moissanite tennis necklaces on model" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lab-Created Moissanite</p>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">Conflict-free brilliance. Higher refractive index than diamond. Ethically engineered.</p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-col h-full transition-transform duration-300 ease-out hover:scale-[1.03]">
              <div className="aspect-[4/5] overflow-hidden">
                <img src="/images/material-lifecycle.png" alt="Gold earrings and chain jewelry showcasing lifecycle care craftsmanship" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="bg-card border-t border-border p-8 flex-1 flex flex-col justify-start">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mb-2 font-medium">Lifecycle Care</p>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">Every piece is professionally cleaned, inspected, and restored between members.</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* ═══════════════════════════════════════════
          4. ACCESS FRAMEWORK
          ═══════════════════════════════════════════ */}
      <SectionHeading label="Philosophy" heading="Access Defines Status" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          <StaggerItem>
            <div className="bg-card border border-border p-10 md:p-14 h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-foreground hover:border-2">
              {/* Own vs Access Infographic — spec #3 */}
              <div className="bg-background border border-border p-6 mb-8">
                <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                  <defs>
                    <linearGradient id="ownBg" x1="0" y1="0" x2="400" y2="300">
                      <stop offset="0%" stopColor="hsl(38,28%,92%)" />
                      <stop offset="100%" stopColor="hsl(34,18%,88%)" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#ownBg)" />

                  {/* Title */}
                  <text x="200" y="30" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.25em" textAnchor="middle" fontWeight="500">OWN VS. ACCESS</text>

                  {/* Baseline */}
                  <line x1="60" y1="240" x2="340" y2="240" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.4" />

                  {/* OWN bar — tall, blush 0.3 */}
                  <rect x="90" y="80" width="70" height="160" fill="#E7B9A8" opacity="0.3" />
                  <line x1="90" y1="80" x2="160" y2="80" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.2" />
                  <text x="125" y="72" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">OWN</text>
                  <text x="125" y="140" fontSize="9" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">$200</text>
                  <text x="125" y="155" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.15em" textAnchor="middle">1 PIECE</text>

                  {/* ACCESS bars — 3 shorter, seafoam/sky 0.4 */}
                  <rect x="200" y="160" width="35" height="80" fill="#BFD6CF" opacity="0.4" />
                  <rect x="245" y="150" width="35" height="90" fill="#BFD3E6" opacity="0.4" />
                  <rect x="290" y="165" width="35" height="75" fill="#BFD6CF" opacity="0.4" />
                  <text x="262" y="140" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">ACCESS</text>
                  <text x="262" y="200" fontSize="9" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">$85/mo</text>
                  <text x="262" y="215" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.15em" textAnchor="middle">10 PIECES</text>

                  {/* Thin guide lines */}
                  <line x1="60" y1="80" x2="80" y2="80" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.15" />
                  <line x1="60" y1="160" x2="190" y2="160" stroke="hsl(32,12%,62%)" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3" />

                  {/* Tag Red stamp */}
                  <rect x="352" y="260" width="16" height="16" rx="3" fill="#C54A3D" opacity="0.7" />
                </svg>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">The Old Model</p>
                <Scale className="h-5 w-5 stroke-[1.3] text-foreground" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">Ownership Is a Liability</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                The average woman wears each piece of fine jewelry fewer than five times before it sits
                forgotten. Thousands spent. Inches of drawer space consumed. Value depreciating silently.
                The traditional model rewards accumulation over expression.
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-foreground text-background p-10 md:p-14 h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-2 hover:border-background/40">
              {/* Access Cycle Infographic — spec #1 */}
              <div className="bg-background border border-border p-6 mb-8">
                <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                  <defs>
                    <linearGradient id="accessBg" x1="0" y1="0" x2="400" y2="300">
                      <stop offset="0%" stopColor="hsl(38,28%,92%)" />
                      <stop offset="50%" stopColor="hsl(34,18%,88%)" />
                      <stop offset="100%" stopColor="hsl(38,28%,92%)" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#accessBg)" />

                  {/* Title */}
                  <text x="200" y="40" fontSize="7" fill="hsl(30,8%,46%)" fontFamily="Inter,sans-serif" letterSpacing="0.25em" textAnchor="middle" fontWeight="500">ACCESS CYCLE</text>

                  {/* 4 step circles in a row */}
                  {/* CHOOSE — seafoam */}
                  <circle cx="80" cy="130" r="30" fill="#BFD6CF" opacity="0.35" />
                  <text x="80" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">CHOOSE</text>

                  {/* RECEIVE — sky */}
                  <circle cx="170" cy="130" r="30" fill="#BFD3E6" opacity="0.35" />
                  <text x="170" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">RECEIVE</text>

                  {/* WEAR — blush */}
                  <circle cx="260" cy="130" r="30" fill="#E7B9A8" opacity="0.35" />
                  <text x="260" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">WEAR</text>

                  {/* REFRESH — brass */}
                  <circle cx="350" cy="130" r="30" fill="#B79B63" opacity="0.35" />
                  <text x="350" y="133" fontSize="7" fill="hsl(30,12%,22%)" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">REFRESH</text>

                  {/* Connecting lines */}
                  <line x1="110" y1="130" x2="140" y2="130" stroke="hsl(32,12%,62%)" strokeWidth="1" opacity="0.2" />
                  <line x1="200" y1="130" x2="230" y2="130" stroke="hsl(32,12%,62%)" strokeWidth="1" opacity="0.2" />
                  <line x1="290" y1="130" x2="320" y2="130" stroke="hsl(32,12%,62%)" strokeWidth="1" opacity="0.2" />

                  {/* Dashed return arc below */}
                  <path d="M350 165 C350 220, 80 220, 80 165" stroke="#6E8F8B" strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="4 4" />
                  {/* Return arc arrow */}
                  <polygon points="80,165 75,175 85,175" fill="#6E8F8B" opacity="0.3" />

                  {/* Subtitle */}
                  <text x="215" y="240" fontSize="7" fill="#6E8F8B" fontFamily="Inter,sans-serif" letterSpacing="0.2em" textAnchor="middle" fontWeight="500">RETURN &amp; REPEAT</text>

                  {/* Tag Red stamp */}
                  <rect x="352" y="260" width="16" height="16" rx="3" fill="#C54A3D" opacity="0.7" />
                </svg>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-background/60">The GEA Model</p>
                <Zap className="h-5 w-5 stroke-[1.3] text-background/70" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4 text-background">Access Is Intelligence</h3>
              <p className="text-[12px] text-background/70 font-sans leading-relaxed">
                Access the full vault. Wear what speaks to you this month. Return when you're ready
                for something new. No commitment to a single piece — commitment to always being adorned
                exactly as you wish. Presence over possession. Experience over accumulation.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* ═══════════════════════════════════════════
          DECLARATIVE: More Beauty. Less Burden.
          ═══════════════════════════════════════════ */}
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
          <AnimateIn variant="fadeUp" duration={0.6}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-[-0.01em] text-[hsl(36,33%,93%)] mb-6 normal-case">
              More Beauty.<br />Less Burden.
            </h2>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.6}>
            <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10 leading-relaxed">
              Adorn the woman you are becoming. Not the one weighed down by what she already owns.
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.3} duration={0.6}>
            <a
              href="#founding-access"
              className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
            >
              Apply for Access
            </a>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. VALUE EXPANSION
          ═══════════════════════════════════════════ */}
      <SectionHeading label="Freedom" heading="Wear More. Spend Smarter." />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <MobileCarousel desktopClassName="grid-cols-3 gap-4" cardWidth="min-w-[72vw]">
          <ValueBlock title="Freedom to Experiment" description="Try bold statement pieces without the commitment of ownership. If it doesn't feel right, refresh your selection next month. No risk. No regret." className="bg-card" lucideIcon={Shuffle} label="Explore" />
          <ValueBlock title="Always Something New" description="Your collection evolves as you do. New drops enter the vault monthly. Early access for members means you're always first." className="bg-card" lucideIcon={CalendarPlus} label="Discover" />
          <ValueBlock title="Luxury Without Burden" description="No storage anxiety. No depreciation. No buyer's remorse. Just beautiful jewelry, worn with intention, returned with ease." className="bg-card" lucideIcon={Feather} label="Liberate" />
        </MobileCarousel>
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
