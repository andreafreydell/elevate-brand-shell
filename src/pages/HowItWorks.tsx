import { Link } from "react-router-dom";
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
import { Hand, Package, Sparkles, RefreshCw, Shield, Wrench, Truck, Gem, Ban, Heart } from "lucide-react";

const trustStandards = [
  { icon: Shield, title: "Sanitized & Sealed", text: "Every piece passes through our care ritual — hand cleaned, UV sanitized, 4-point inspected, and sealed before it reaches you." },
  { icon: Wrench, title: "Repair Guarantee", text: "Normal wear is on us. No questions, no fees. Transparent fixed-fee schedule for significant damage, disclosed before checkout." },
  { icon: Truck, title: "Secure Delivery", text: "Tamper-evident sealed packaging, tracking updates at key scan points, and support response within 1 business day." },
  { icon: Gem, title: "Damage Clarity", text: "No surprise fees. Ever. Normal wear = on us. Repairable damage = fixed fee, shown before checkout." },
  { icon: Ban, title: "Cancel Anytime", text: "No contracts. No commitments. No questions. Founding perks permanently attached even if paused." },
];

const faqItems: FAQItem[] = [
  {
    question: "When does my selection ship?",
    answer: "Your first selection ships within 2 business days of enrollment. Subsequent selections ship within 1 business day of receiving your return.",
  },
  {
    question: "How long can I keep a piece?",
    answer: "Your membership cycle renews every 30 days. Enjoy your pieces for the full cycle. When you're ready for something new, simply use the prepaid return packaging.",
  },
  {
    question: "Can I refresh mid-cycle?",
    answer: "Members can request mid-cycle refreshes. Simply initiate from your dashboard and your new selection ships within 1 business day.",
  },
  {
    question: "What if I want to keep a piece?",
    answer: "One piece per cycle is yours to keep — included in your membership at no extra cost. Simply select 'Keep This Piece' in your dashboard. Want to keep additional pieces? Members save 40% on every extra piece.",
  },
  {
    question: "What if something gets damaged?",
    answer: "Normal wear is fully covered. Our in-house atelier handles all repairs — hand cleaning, UV sanitization, 4-point inspection — at no cost to you.",
  },
  {
    question: "What if I don't like my selection?",
    answer: "Our 60-Day Adjustment means we'll work with you. Exchange for something different, adjust your style preferences, or speak with our team.",
  },
  {
    question: "How is each piece prepared?",
    answer: "Every piece undergoes our Sanitized & Sealed Protocol: hand clean, UV sanitization, 4-point inspection (structure, surface, stones, mechanism), and sealed in protective packaging.",
  },
  {
    question: "Can I skip a month?",
    answer: "Yes. Pause your membership at any time from your account dashboard. Your tier, founding status, and preferences are preserved. Resume when you're ready.",
  },
  {
    question: "How does the cost-per-wear work?",
    answer: "Traditional jewelry purchases average $150+ per piece worn 3-5 times — that's $30+ per wear. With GEA Tier 2 at $85/month, you access 10 curated pieces. Worn even twice each, your cost-per-wear drops below $5. The more you wear, the more intelligent your access becomes.",
  },
  {
    question: "What is Keep Your Favorite?",
    answer: "Every cycle, one piece from your selection is yours to keep at no additional cost — it's included in your membership. If you fall in love with more than one, members enjoy 40% off any additional piece. Over time, build a curated collection through real experience, not impulse.",
  },
  {
    question: "What happens in my first month?",
    answer: "Your first selection ships within 2 business days of enrollment. Founding members receive priority vault access. Your 60-Day Adjustment means if the first selection doesn't resonate, we'll work with you to find what does.",
  },
  {
    question: "Is there a commitment period?",
    answer: "No. Every GEA membership is month-to-month. Cancel anytime from your account dashboard — no fees, no penalties, no questions. Your founding perks remain permanently attached to your account.",
  },
  {
    question: "What materials are used?",
    answer: "Crafted in 316L stainless steel — surgical-grade, tarnish-resistant, and hypoallergenic. Every piece is professionally cleaned, inspected, and restored between members. Water-resistant under normal wear.",
  },
];

const HowItWorks = () => {
  return (
    <PageLayout>
      <PageHero
        label="The Process"
        headline={"Effortless by\nDesign"}
        subtitle="Four steps between you and curated high-design jewelry. Just access."
        heroMobileCompact
      />

      {/* 4-step visual process */}
      <SectionHeading label="How Access Works" heading="Choose. Receive. Wear. Refresh." headingMobile className="section-heading-how-it-works" labelClassName="section-heading-how-it-works-label" />
      <section className="how-it-works-section-mobile max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <AutoCarousel interval={2000} cardWidth="min-w-[48vw] md:min-w-[240px]">
          <StepBlock number="01" title="Choose" description="Browse our curated vault and select the pieces that speak to your moment." icon={Hand} />
          <StepBlock number="02" title="Receive" description="Your selections arrive in 1–3 days, freshly restored and sealed in our signature packaging." icon={Package} />
          <StepBlock number="03" title="Wear" description="Style them for your life — the event, the meeting, the dinner, the everyday." icon={Sparkles} />
          <StepBlock number="04" title="Keep Your Favorite" description="One piece per cycle is yours to keep — included in your membership. Want more? Members save 40% on any additional piece." icon={Heart} />
          <StepBlock number="05" title="Refresh" description="When you're ready for something new, return and choose your next chapter." icon={RefreshCw} />
        </AutoCarousel>
      </section>

      {/* Detailed illustration blocks */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <MobileCarousel desktopClassName="grid-cols-2 gap-[2px]" cardWidth="min-w-[80vw]">
          <div className="bg-card border border-border p-8 h-full">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">Keep What You Love</p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">Keep Your Favorite</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              One piece per cycle is yours to keep — included in your membership.
              Want more? Members save 40% on any additional piece. Experience jewelry
              in real life, then build your collection through discovery.
            </p>
          </div>
          <div className="bg-card border border-border p-8 h-full">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">Restored Between Every Wear</p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">Sanitized & Sealed Protocol</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              Our atelier restores every returning piece: hand cleaning, UV sanitization,
              4-point inspection (structure, surface, stones, mechanism), and sealed in
              protective packaging. What arrives at your door is indistinguishable from new.
            </p>
          </div>
        </MobileCarousel>
      </section>

      {/* ══ Access Is The New Luxury ══ */}
      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.01em] mb-4 text-ink">
            Access Is{"\n"}The New Luxury
          </h2>
          <p className="text-[13px] text-muted-foreground font-sans max-w-[520px] mx-auto mb-10 leading-relaxed">
            Two tiers of access. One philosophy: more beauty, less burden. Every membership includes protection, care, and free shipping.
          </p>
          <TrustStrip variant="full" />
        </div>
      </section>

      {/* ══ Founding Member Access ══ */}
      <section id="founding-circle" className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-4 font-sans">
            Limited Invitation
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-[hsl(36,33%,93%)] tracking-[0.04em] mb-4">
            Founding Member Access
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[480px] mx-auto mb-10 leading-relaxed">
            We are opening our doors to founding circle members who believe luxury is not about
            owning more — it is about accessing better. Locked pricing, early access, priority
            selection, and founding recognition — permanently attached to your account.
          </p>
          <Link
            to="/#founding-access"
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            Claim My Founding Spot
          </Link>
        </div>
      </section>

      {/* ══ Membership tiers (full OfferUnit) ══ */}
      <div id="tiers">
        <SectionHeading label="Choose Your Tier" heading="Your Level of Access" />
      </div>
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
        <OfferUnit variant="full" />
      </section>

      {/* ══ The 5 Trust Standards ══ */}
      <SectionHeading label="Your Guarantee" heading="The 5 Trust Standards" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <MobileCarousel desktopClassName="grid-cols-5 gap-4" cardWidth="min-w-[68vw]">
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
        </MobileCarousel>
      </section>

      {/* FAQ */}
      <SectionHeading label="Common Questions" heading="Everything You Need to Know" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <AccordionFAQ items={faqItems} />
      </section>

    </PageLayout>
  );
};

export default HowItWorks;
