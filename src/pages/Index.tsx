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
import { Loader2, Hand, Package, Sparkles, RefreshCw, Shield, Wrench, Truck, Gem, Ban, Heart } from "lucide-react";

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
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StaggerItem><StepBlock number="01" title="Choose" description="Browse our curated vault and select the pieces that speak to your moment." icon={Hand} /></StaggerItem>
          <StaggerItem><StepBlock number="02" title="Receive" description="Your selections arrive in 1–3 days, freshly restored and sealed in our signature packaging." icon={Package} /></StaggerItem>
          <StaggerItem><StepBlock number="03" title="Wear" description="Style them for your life — the event, the meeting, the dinner, the everyday." icon={Sparkles} /></StaggerItem>
          <StaggerItem><StepBlock number="04" title="Keep Your Favorite" description="One piece per cycle is yours to keep — included in your membership. Want more? Members save 40% on any additional piece." icon={Heart} /></StaggerItem>
          <StaggerItem><StepBlock number="05" title="Refresh" description="When you're ready for something new, return and choose your next chapter." icon={RefreshCw} /></StaggerItem>
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
            <div className="bg-card border border-border p-10 md:p-14 h-full">
              {/* Infographic */}
              <div className="bg-background border border-border p-6 mb-8">
                <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                  {/* Declining value curve */}
                  <text x="20" y="20" fontSize="9" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif" letterSpacing="0.25em" textAnchor="start">VALUE OVER TIME</text>
                  <line x1="40" y1="40" x2="40" y2="170" stroke="hsl(30,12%,40%)" strokeWidth="1"/>
                  <line x1="40" y1="170" x2="380" y2="170" stroke="hsl(30,12%,40%)" strokeWidth="1"/>
                  {/* Steep decline path */}
                  <path d="M50 50 C100 52, 140 100, 180 140 S280 165, 370 168" stroke="hsl(0,60%,48%)" strokeWidth="2" strokeDasharray="6 3" fill="none"/>
                  {/* Worn count markers */}
                  <circle cx="80" cy="58" r="3" fill="hsl(28,12%,14%)"/>
                  <circle cx="130" cy="95" r="3" fill="hsl(28,12%,14%)"/>
                  <circle cx="180" cy="140" r="3" fill="hsl(28,12%,14%)"/>
                  <circle cx="260" cy="162" r="3" fill="hsl(28,12%,14%)"/>
                  <circle cx="370" cy="168" r="3" fill="hsl(28,12%,14%)"/>
                  {/* Labels */}
                  <text x="75" y="50" fontSize="8" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif">Wear 1</text>
                  <text x="125" y="87" fontSize="8" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif">Wear 2</text>
                  <text x="175" y="133" fontSize="8" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif">Wear 3</text>
                  <text x="255" y="155" fontSize="8" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif">Wear 4–5</text>
                  <text x="330" y="160" fontSize="8" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif">Forgotten</text>
                  {/* Cost label */}
                  <rect x="240" y="70" width="120" height="36" rx="0" fill="hsl(37,30%,93%)" stroke="hsl(30,12%,40%)" strokeWidth="1"/>
                  <text x="300" y="85" fontSize="9" fill="hsl(28,12%,14%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">$3,200 spent</text>
                  <text x="300" y="98" fontSize="8" fill="hsl(0,60%,48%)" fontFamily="Inter,sans-serif" textAnchor="middle">5 wears = $640/wear</text>
                </svg>
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">The Old Model</p>
              <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">Ownership Is a Liability</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                The average woman wears each piece of fine jewelry fewer than five times before it sits
                forgotten. Thousands spent. Inches of drawer space consumed. Value depreciating silently.
                The traditional model rewards accumulation over expression.
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-foreground text-background p-10 md:p-14 h-full">
              {/* Infographic */}
              <div className="bg-[hsl(37,30%,93%)] border border-[hsl(30,12%,60%)] p-6 mb-8">
                <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                  <text x="20" y="20" fontSize="9" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif" letterSpacing="0.25em" textAnchor="start">ACCESS CYCLE</text>
                  {/* Circular flow */}
                  <circle cx="200" cy="115" r="65" stroke="hsl(30,12%,40%)" strokeWidth="1" fill="none" strokeDasharray="4 4"/>
                  {/* Center */}
                  <circle cx="200" cy="115" r="22" fill="hsl(28,12%,14%)"/>
                  <text x="200" y="112" fontSize="8" fill="hsl(37,30%,93%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">THE</text>
                  <text x="200" y="122" fontSize="8" fill="hsl(37,30%,93%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">VAULT</text>
                  {/* Orbit nodes */}
                  <circle cx="200" cy="50" r="14" fill="hsl(28,12%,14%)" />
                  <text x="200" y="54" fontSize="7" fill="hsl(37,30%,93%)" fontFamily="Inter,sans-serif" textAnchor="middle">SELECT</text>
                  <circle cx="265" cy="115" r="14" fill="hsl(28,12%,14%)" />
                  <text x="265" y="119" fontSize="7" fill="hsl(37,30%,93%)" fontFamily="Inter,sans-serif" textAnchor="middle">WEAR</text>
                  <circle cx="200" cy="180" r="14" fill="hsl(28,12%,14%)" />
                  <text x="200" y="184" fontSize="7" fill="hsl(37,30%,93%)" fontFamily="Inter,sans-serif" textAnchor="middle">RETURN</text>
                  <circle cx="135" cy="115" r="14" fill="hsl(28,12%,14%)" />
                  <text x="135" y="119" fontSize="7" fill="hsl(37,30%,93%)" fontFamily="Inter,sans-serif" textAnchor="middle">REFRESH</text>
                  {/* Flow arrows */}
                  <path d="M214 52 L250 100" stroke="hsl(28,12%,14%)" strokeWidth="1.5" markerEnd="url(#arrowDark)"/>
                  <path d="M263 130 L215 175" stroke="hsl(28,12%,14%)" strokeWidth="1.5" markerEnd="url(#arrowDark)"/>
                  <path d="M186 178 L150 130" stroke="hsl(28,12%,14%)" strokeWidth="1.5" markerEnd="url(#arrowDark)"/>
                  <path d="M137 100 L185 55" stroke="hsl(28,12%,14%)" strokeWidth="1.5" markerEnd="url(#arrowDark)"/>
                  <defs>
                    <marker id="arrowDark" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <path d="M0 0 L8 3 L0 6" fill="hsl(28,12%,14%)"/>
                    </marker>
                  </defs>
                  {/* Bottom label */}
                  <rect x="290" y="160" width="100" height="30" fill="hsl(37,30%,93%)" stroke="hsl(30,12%,40%)" strokeWidth="1"/>
                  <text x="340" y="175" fontSize="8" fill="hsl(28,12%,14%)" fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">∞ Unlimited Access</text>
                  <text x="340" y="186" fontSize="7" fill="hsl(28,8%,48%)" fontFamily="Inter,sans-serif" textAnchor="middle">$0/wear wasted</text>
                </svg>
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-background/60 mb-4">The GEA Model</p>
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
