import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepBlock } from "@/components/shared/StepBlock";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { OfferUnit } from "@/components/membership/OfferUnit";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { MobileCarousel } from "@/components/shared/MobileCarousel";
import { AutoCarousel } from "@/components/shared/AutoCarousel";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { CircleEmphasis } from "@/components/craft/CircleEmphasis";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { HandDrawnArrow } from "@/components/craft/HandDrawnArrow";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { MarginNote } from "@/components/craft/MarginNote";
import { StampBadge } from "@/components/craft/StampBadge";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { SketchyBorderCard } from "@/components/craft/SketchyBorderCard";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { HandDrawnRect } from "@/components/craft/HandDrawnRect";
import { MarkerCircle } from "@/components/craft/MarkerCircle";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { DotGridTexture } from "@/components/craft/DotGridTexture";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { Hand, Package, Sparkles, RefreshCw, Shield, Wrench, Truck, Gem, Ban, Heart } from "lucide-react";

const trustStandards = [
  { icon: Shield, title: "Sanitized & Sealed", text: "Every piece passes through our care ritual — hand cleaned, UV sanitized, 4-point inspected, and sealed before it reaches you." },
  { icon: Wrench, title: "Repair Guarantee", text: "Normal wear is on us. No questions, no fees. Transparent fixed-fee schedule for significant damage, disclosed before checkout." },
  { icon: Truck, title: "Secure Delivery", text: "Tamper-evident sealed packaging, tracking updates at key scan points, and support response within 1 business day." },
  { icon: Gem, title: "Damage Clarity", text: "No surprise fees. Ever. Normal wear = on us. Repairable damage = fixed fee, shown before checkout." },
  { icon: Ban, title: "Cancel Anytime", text: "No contracts. No commitments. No questions. Founding perks permanently attached even if paused." },
];

const faqItems: FAQItem[] = [
  { question: "When does my selection ship?", answer: "Your first selection ships within 2 business days of enrollment. Subsequent selections ship within 1 business day of receiving your return." },
  { question: "How long can I keep a piece?", answer: "Your membership cycle renews every 30 days. Enjoy your pieces for the full cycle. When you're ready for something new, simply use the prepaid return packaging." },
  { question: "Can I refresh mid-cycle?", answer: "Members can request mid-cycle refreshes. Simply initiate from your dashboard and your new selection ships within 1 business day." },
  { question: "What if I want to keep a piece?", answer: "One piece per cycle is yours to keep — included in your membership at no extra cost. Simply select 'Keep This Piece' in your dashboard. Want to keep additional pieces? Members save 40% on every extra piece." },
  { question: "What if something gets damaged?", answer: "Normal wear is fully covered. Our in-house atelier handles all repairs — hand cleaning, UV sanitization, 4-point inspection — at no cost to you." },
  { question: "What if I don't like my selection?", answer: "Our 60-Day Adjustment means we'll work with you. Exchange for something different, adjust your style preferences, or speak with our team." },
  { question: "How is each piece prepared?", answer: "Every piece undergoes our Sanitized & Sealed Protocol: hand clean, UV sanitization, 4-point inspection (structure, surface, stones, mechanism), and sealed in protective packaging." },
  { question: "Can I skip a month?", answer: "Yes. Pause your membership at any time from your account dashboard. Your tier, founding status, and preferences are preserved. Resume when you're ready." },
  { question: "How does the cost-per-wear work?", answer: "Traditional jewelry purchases average $150+ per piece worn 3-5 times — that's $30+ per wear. With GEA Tier 2 at $85/month, you access 10 curated pieces. Worn even twice each, your cost-per-wear drops below $5. The more you wear, the more intelligent your access becomes." },
  { question: "What is Keep Your Favorite?", answer: "Every cycle, one piece from your selection is yours to keep at no additional cost — it's included in your membership. If you fall in love with more than one, members enjoy 40% off any additional piece. Over time, build a curated collection through real experience, not impulse." },
  { question: "What happens in my first month?", answer: "Your first selection ships within 2 business days of enrollment. Founding members receive priority vault access. Your 60-Day Adjustment means if the first selection doesn't resonate, we'll work with you to find what does." },
  { question: "Is there a commitment period?", answer: "No. Every GEA membership is month-to-month with no long-term commitment. Cancel anytime from your account dashboard — no fees, no penalties, no questions. Your founding perks remain permanently attached to your account." },
  { question: "What materials are used?", answer: "Crafted in 316L stainless steel — surgical-grade, tarnish-resistant, and hypoallergenic. Every piece is professionally cleaned, inspected, and restored between members. Water-resistant under normal wear." },
];

const HowItWorks = () => {
  const isMobile = useIsMobile();
  return (
    <PageLayout>
      <PageHero
        label="The Process"
        headline={"Effortless by\nDesign"}
        subtitle="Four steps between you and curated high-design jewelry. Just access."
        heroMobileCompact
      />

      {/* Torn paper edge below hero */}
      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      {/* 4-step visual process */}
      <SectionHeading label="How Access Works" heading="Choose. Receive. Wear. Refresh." headingMobile className="section-heading-how-it-works" labelClassName="section-heading-how-it-works-label" />
      <section className="how-it-works-section-mobile max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:items-stretch">
          <StepBlock number="01" title="Choose" description="Browse our curated vault and select the pieces that speak to your moment." icon={Hand} />
          <StepBlock number="02" title="Receive" description="Your selections arrive in 1–3 days, freshly restored and sealed in our signature packaging." icon={Package} />
          <StepBlock number="03" title="Wear" description="Style them for your life — the event, the meeting, the dinner, the everyday." icon={Sparkles} />
          <StepBlock number="04" title="Keep Your Favorite" description="One piece per cycle is yours to keep — included in your membership. Want more? Members save 40% on any additional piece." icon={Heart} />
          <StepBlock number="05" title="Refresh" description="When you're ready for something new, return and choose your next chapter." icon={RefreshCw} />
        </div>
        {/* Hand-drawn arrows between steps (desktop only) */}
        <div className="hidden md:grid grid-cols-5 pointer-events-none" style={{ marginTop: '-140px' }}>
          <div className="flex justify-end"><HandDrawnArrow direction="swoopy" delay={0.3} /></div>
          <div className="flex justify-end"><HandDrawnArrow direction="curved-right" delay={0.5} color="var(--seafoam)" /></div>
          <div className="flex justify-end"><HandDrawnArrow direction="swoopy" delay={0.7} /></div>
          <div className="flex justify-end"><HandDrawnArrow direction="right" delay={0.9} color="var(--seafoam)" /></div>
          <div />
        </div>
      </section>

      {/* Diamond chain divider */}
      <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* Detailed illustration blocks */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16 hidden md:block">
        <MobileCarousel desktopClassName="grid-cols-2 gap-[2px]" cardWidth="min-w-[80vw]">
          <div className="step-detail-card-mobile bg-card border border-border p-8 h-full relative overflow-hidden">
            <GrainOverlay opacity={0.03} />
            <OrganicBlobTag variant="classic" className="mb-4">Keep What You Love</OrganicBlobTag>
            <h3 className="step-detail-title font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4 relative z-[1]">Keep Your <CircleEmphasis color="var(--tag-red)">Favorite</CircleEmphasis></h3>
            <p className="step-detail-description text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
              One piece per cycle is yours to keep — included in your membership.
              Want more? Members save <ScriptNumber>40%</ScriptNumber> on any additional piece. Experience jewelry
              in real life, then build your collection through discovery.
            </p>
          </div>
          <div className="step-detail-card-mobile bg-card border border-border p-8 h-full relative overflow-hidden">
            <GrainOverlay opacity={0.03} />
            <OrganicBlobTag variant="coastal" className="mb-4">Restored Between Every Wear</OrganicBlobTag>
            <h3 className="step-detail-title font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4 relative z-[1]">Sanitized & Sealed Protocol</h3>
            <p className="step-detail-description text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
              Our atelier restores every returning piece: hand cleaning, UV sanitization,
              <ScriptNumber>4</ScriptNumber>-point inspection (structure, surface, stones, mechanism), and sealed in
              protective packaging. What arrives at your door is indistinguishable from new.
            </p>
          </div>
        </MobileCarousel>
      </section>

      {/* Stitch line divider */}
      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* ══ Access Is The New Luxury ══ */}
      <section className="border-t border-border relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <HandDrawnFrame strokeColor="hsl(var(--foreground))">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.01em] mb-4 text-ink">
              Access Is{"\n"}The New <ScribbleUnderline color="var(--brass)" delay={0.5}>Luxury</ScribbleUnderline>
            </h2>
            <p className="text-[13px] text-muted-foreground font-sans max-w-[520px] mx-auto mb-10 leading-relaxed">
              Two tiers of access. One philosophy: more beauty, less burden. Every membership includes protection, care, and free shipping.
            </p>
            <TrustStrip variant="full" />
          </HandDrawnFrame>
        </div>
      </section>

      {/* ══ Member Access ══ */}
      <section className="bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <WaxSeal size={40} className="mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-4 font-sans">
            Limited Invitation
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-[hsl(36,33%,93%)] tracking-[0.04em] mb-4">
            Member Access
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[480px] mx-auto mb-10 leading-relaxed">
            We are opening our doors to members who believe luxury is not about
            owning more — it is about accessing better. Locked pricing, early access, priority
            selection, and exclusive benefits — permanently attached to your account.
          </p>
          <Link
            to="/#founding-access"
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            Claim My Spot
          </Link>
        </div>
      </section>

      {/* ══ Membership tiers (full OfferUnit) ══ */}
      <div id="tiers">
        <SectionHeading label="Choose Your Tier" heading="Your Level of Access" className="section-heading-your-level" />
      </div>
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
        {/* Pricing callout */}
        <div className="hidden md:flex justify-center mb-8">
          <HandDrawnRect className="max-w-md">
            <p className="text-center font-sans text-[12px] text-muted-foreground leading-relaxed">
              Starting from just <MarkerCircle color="var(--tag-red)"><span className="font-semibold text-foreground">$49/mo</span></MarkerCircle> — full vault access included
            </p>
          </HandDrawnRect>
        </div>
        <OfferUnit variant="full" />
      </section>

      {/* Wavy divider */}
      <WavyDivider variant="double" className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* ══ The 5 Trust Standards ══ */}
      <SectionHeading label="Your Guarantee" heading="The 5 Trust Standards" />
      <DotGridTexture className="max-w-[1440px] mx-auto" dotSize={0.5} spacing={22}>
        <section className="px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
          {/* Mobile: compact badges */}
          <div className="flex flex-col gap-2 md:hidden">
            {trustStandards.map((item, idx) => (
              <div key={item.title} className="flex items-center gap-3 border border-border bg-card px-3 py-2">
                <item.icon className="h-4 w-4 stroke-[1.3] text-foreground flex-shrink-0" />
                <span className="text-[10px] tracking-[0.12em] uppercase font-sans font-medium">{item.title}</span>
              </div>
            ))}
          </div>
          {/* Desktop: full cards */}
          <div className="hidden md:grid grid-cols-5 gap-4">
            {trustStandards.map((item, idx) => (
              <div key={item.title} className="border border-border bg-card p-6 h-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-foreground hover:border-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">
                    Trust {String(idx + 1).padStart(2, '0')}
                  </span>
                  <item.icon className="h-5 w-5 stroke-[1.3] text-foreground" />
                </div>
                <p className="text-[11px] tracking-[0.15em] uppercase font-sans font-medium mb-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </DotGridTexture>

      {/* WashiTape + Margin note */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:flex justify-between items-start gap-8">
        <WashiTapeNote label="TRUST PROMISE" tapeColor="var(--seafoam)" rotation={-1}>
          <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
            "No surprise fees. No hidden costs. That's not a policy — it's a principle."
          </p>
        </WashiTapeNote>
        <div className="max-w-md">
          <MarginNote attribution="GEA Care Team">
            Every piece that returns to our atelier is treated as if it were brand new. That's the standard.
          </MarginNote>
        </div>
      </div>

      {/* Stitch divider before FAQ */}
      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      {/* FAQ */}
      <SectionHeading label="Common Questions" heading="Everything You Need to Know" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <AccordionFAQ items={faqItems} />
      </section>

    </PageLayout>
  );
};

export default HowItWorks;
