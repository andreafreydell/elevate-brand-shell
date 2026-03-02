import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { TierCard, type TierData } from "@/components/membership/TierCard";
import { SavingsCalculator } from "@/components/membership/SavingsCalculator";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { Shield, Wrench, Truck, Gem, Ban } from "lucide-react";

const tiers: TierData[] = [
  {
    name: "Tier 1",
    label: "5 Pieces",
    price: "$65",
    promoPrice: "$55",
    period: "month",
    pieces: "5 curated pieces per cycle",
    features: [
      "Full vault access",
      "Keep Your Favorite included",
      "Protection coverage included",
      "Sanitized & Sealed before delivery",
      "Free shipping both ways",
      "Cancel anytime — no commitment",
    ],
  },
  {
    name: "Tier 2",
    label: "10 Pieces",
    price: "$85",
    promoPrice: "$75",
    period: "month",
    pieces: "10 curated pieces per cycle",
    highlighted: true,
    features: [
      "Full vault access",
      "Keep Your Favorite included",
      "Protection coverage included",
      "Sanitized & Sealed before delivery",
      "Free shipping both ways",
      "Cancel anytime — no commitment",
    ],
  },
];

const trustStandards = [
  { icon: Shield, title: "Sanitized & Sealed", text: "Every piece passes through our care ritual — hand cleaned, UV sanitized, 4-point inspected, and sealed before it reaches you." },
  { icon: Wrench, title: "Repair Guarantee", text: "Normal wear is on us. No questions, no fees. Transparent fixed-fee schedule for significant damage, disclosed before checkout." },
  { icon: Truck, title: "Secure Delivery", text: "Tamper-evident sealed packaging, tracking updates at key scan points, and support response within 1 business day." },
  { icon: Gem, title: "Damage Clarity", text: "No surprise fees. Ever. Normal wear = on us. Repairable damage = fixed fee, shown before checkout." },
  { icon: Ban, title: "Cancel Anytime", text: "No contracts. No commitments. No questions. Founding perks permanently attached even if paused." },
];

const faqItems: FAQItem[] = [
  {
    question: "How does the cost-per-wear work?",
    answer:
      "Traditional jewelry purchases average $650+ per piece worn 3-5 times — that's $130+ per wear. With GEA Tier A at $85/month, you access 10 curated pieces. Worn even twice each, your cost-per-wear drops below $5. The more you wear, the more intelligent your access becomes.",
  },
  {
    question: "What is Keep Your Favorite?",
    answer:
      "Keep Your Favorite allows you to permanently add a piece from your monthly selection to your personal collection. Experience jewelry in real life before deciding to own it. Over time, build a curated collection through discovery rather than impulse.",
  },
  {
    question: "What happens in my first month?",
    answer:
      "Your first selection ships within 2 business days of enrollment. Founding members receive priority vault access. Your 60-Day Adjustment means if the first selection doesn't resonate, we'll work with you to find what does.",
  },
  {
    question: "Is there a commitment period?",
    answer:
      "No. Every GEA membership is month-to-month. Cancel anytime from your account dashboard — no fees, no penalties, no questions. Your founding perks remain permanently attached to your account.",
  },
  {
    question: "What if a piece is damaged during wear?",
    answer:
      "Normal wear is fully covered under your membership. Our in-house atelier restores every piece between members — hand cleaning, UV sanitization, 4-point inspection. For significant damage, a transparent fee schedule applies, always disclosed before checkout.",
  },
  {
    question: "What materials are used?",
    answer:
      "Crafted in 316L stainless steel — surgical-grade, tarnish-resistant, and hypoallergenic. Every piece is professionally cleaned, inspected, and restored between members. Water-resistant under normal wear.",
  },
];

const Membership = () => {
  return (
    <PageLayout>
      <PageHero
        label="The Founding 100"
        headline={"Access Is\nThe New Luxury"}
        subtitle="Two tiers of access. One philosophy: more beauty, less burden. Every membership includes protection, care, and free shipping."
        cta="Claim My Founding Spot"
        ctaHref="#tiers"
      />

      {/* Trust Strip */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
        <TrustStrip variant="full" />
      </section>

      {/* Tier cards */}
      <div id="tiers">
        <SectionHeading label="Choose Your Tier" heading="Your Level of Access" />
      </div>
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px] mx-auto">
          {tiers.map((tier) => (
            <StaggerItem key={tier.name}>
              <TierCard tier={tier} />
            </StaggerItem>
          ))}
        </StaggerContainer>
        <p className="text-[11px] text-muted-foreground font-sans tracking-[0.1em] text-center mt-6">
          One curated shipment per 30-day cycle. Refresh at the end of your cycle.
        </p>
      </section>

      {/* Cost-per-wear reframe */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="border border-border bg-card p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
              The Math
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.02em] mb-4">
              Cost-Per-Wear Intelligence
            </h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-6">
              The average fine jewelry purchase sits unworn 90% of its life. GEA membership
              inverts that equation — you wear more, spend less per occasion, and never carry
              the weight of a depreciating asset.
            </p>
            <Link to="/how-it-works" className="cta-underline">
              See How It Works
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="border border-border p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-1">
                Traditional Purchase
              </p>
              <p className="font-serif text-2xl font-medium">$130+ per wear</p>
              <p className="text-[11px] text-muted-foreground font-sans">$650 piece worn 5 times</p>
            </div>
            <div className="border border-foreground bg-foreground text-background p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-background/60 mb-1">
                GEA Tier A
              </p>
              <p className="font-serif text-2xl font-medium">Under $5 per wear</p>
              <p className="text-[11px] text-background/70 font-sans">$85/mo, 10 pieces, unlimited style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding member scarcity */}
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-4 font-sans">
            Limited Invitation
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-[hsl(36,33%,93%)] tracking-[0.04em] mb-4">
            Founding Member Access
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[480px] mx-auto mb-10 leading-relaxed">
            We are opening our doors to 100 founding members who believe luxury is not about
            owning more — it is about accessing better. Locked pricing, early access, priority
            selection, and founding recognition — permanently attached to your account.
          </p>
          <Link
            to="/founding-100"
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            Join the Founding 100
          </Link>
        </div>
      </section>

      {/* Savings calculator */}
      <SectionHeading label="The Math" heading="Your Membership Pays for Itself" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <SavingsCalculator />
      </section>

      {/* 5 Named Trust Standards */}
      <SectionHeading label="Your Guarantee" heading="The 5 Trust Standards" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trustStandards.map((item) => (
            <StaggerItem key={item.title}>
              <div className="border border-border bg-card p-6 h-full">
                <item.icon className="h-6 w-6 mb-4 stroke-[1.3] text-foreground" />
                <p className="text-[11px] tracking-[0.15em] uppercase font-sans font-medium mb-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                  {item.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* FAQ */}
      <SectionHeading label="Questions" heading="Membership FAQ" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <AccordionFAQ items={faqItems} />
      </section>

      {/* Final CTA */}
      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            More Beauty. Less Burden.
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans max-w-[400px] mx-auto mb-6 leading-relaxed">
            Your access is waiting. Begin with either tier — upgrade, downgrade, or cancel anytime.
          </p>
          <Link to="/founding-100" className="btn-gea">
            Apply for Access
          </Link>
          <div className="mt-6">
            <TrustStrip variant="compact" />
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Membership;
