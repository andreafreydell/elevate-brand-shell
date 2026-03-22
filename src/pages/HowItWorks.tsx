import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepBlock } from "@/components/shared/StepBlock";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { OfferUnit } from "@/components/membership/OfferUnit";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";
import { MobileCarousel } from "@/components/shared/MobileCarousel";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { CircleEmphasis } from "@/components/craft/CircleEmphasis";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { MarginNote } from "@/components/craft/MarginNote";
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
import {
  Hand,
  Package,
  Sparkles,
  RefreshCw,
  Shield,
  Wrench,
  Truck,
  Gem,
  Ban,
  Heart,
} from "lucide-react";

const trustStandards = [
  {
    icon: Shield,
    title: "Sanitized & Sealed",
    text: "Every piece passes through our care ritual - hand cleaned, UV sanitized, 4-point inspected, and sealed before it reaches you.",
  },
  {
    icon: Wrench,
    title: "Repair Guarantee",
    text: "Normal wear is on us. No questions, no fees. Transparent fixed-fee schedule for significant damage, disclosed before checkout.",
  },
  {
    icon: Truck,
    title: "Secure Delivery",
    text: "Tamper-evident sealed packaging, tracking updates at key scan points, and support response within 1 business day.",
  },
  {
    icon: Gem,
    title: "Damage Clarity",
    text: "No surprise fees. Ever. Normal wear = on us. Repairable damage = fixed fee, shown before checkout.",
  },
  {
    icon: Ban,
    title: "Cancel Anytime",
    text: "No contracts. No commitments. No questions. Your member benefits stay attached even if you pause.",
  },
];

const faqItems: FAQItem[] = [
  {
    question: "When does my selection ship?",
    answer:
      "Your first selection ships within 2 business days of enrollment. Subsequent selections ship within 1 business day of receiving your return.",
  },
  {
    question: "How long can I keep a piece?",
    answer:
      "Your membership cycle renews every 30 days. Enjoy your pieces for the full cycle. At cycle end, use the prepaid return packaging for any pieces you are not keeping.",
  },
  {
    question: "Can I refresh before my cycle ends?",
    answer:
      "Not at this time. GEA runs one curated shipment per cycle. When your cycle ends and your return is received, you can choose your next pieces.",
  },
  {
    question: "What if I want to keep a piece?",
    answer:
      "One piece per cycle is yours to keep - included in your membership at no additional cost. Simply select 'Keep This Piece' in your dashboard. Want to keep additional pieces? Members save 40% on every extra piece.",
  },
  {
    question: "What if something gets damaged?",
    answer:
      "Normal wear is fully covered. Our in-house atelier handles all repairs - hand cleaning, UV sanitization, and 4-point inspection - at no cost to you.",
  },
  {
    question: "What if I don't like my selection?",
    answer:
      "Our 60-Day Adjustment means we'll work with you. Exchange for something different, adjust your style preferences, or speak with our team.",
  },
  {
    question: "How is each piece prepared?",
    answer:
      "Every piece undergoes our Sanitized & Sealed Protocol: hand clean, UV sanitization, 4-point inspection (structure, surface, stones, mechanism), and sealed in protective packaging.",
  },
  {
    question: "Can I skip a month?",
    answer:
      "Yes. Pause your membership at any time from your account dashboard. Your tier, member status, and preferences are preserved. Resume when you're ready.",
  },
  {
    question: "How does the cost-per-wear work?",
    answer:
      "Traditional jewelry purchases average $150+ per piece worn 3-5 times - that's $30+ per wear. With GEA Tier 2 at $85/month, you access 10 curated pieces. Worn even twice each, your cost-per-wear drops below $5. The more you wear, the more intelligent your access becomes.",
  },
  {
    question: "What is Keep Your Favorite?",
    answer:
      "Every cycle, one piece from your selection is yours to keep at no additional cost - it's included in your membership. If you fall in love with more than one, members enjoy 40% off any additional piece. Over time, build a curated collection through real experience, not impulse.",
  },
  {
    question: "What happens in my first month?",
    answer:
      "Your first selection ships within 2 business days of enrollment. Members receive priority access to the vault. Your 60-Day Adjustment means if the first selection doesn't resonate, we'll work with you to find what does.",
  },
  {
    question: "Is there a commitment period?",
    answer:
      "No. Every GEA membership is month-to-month with no long-term commitment. Cancel anytime from your account dashboard - no fees, no penalties, no questions. Your member benefits remain attached to your account.",
  },
  {
    question: "What materials are used?",
    answer:
      "Crafted in 316L stainless steel - surgical-grade, tarnish-resistant, and hypoallergenic. Every piece is professionally cleaned, inspected, and restored between members. Water-resistant under normal wear.",
  },
];

const HowItWorks = () => {
  useIsMobile();

  return (
    <PageLayout>
      <PageHero
        label="The Process"
        headline={
          <>
            <ScribbleUnderline>Effortless</ScribbleUnderline> by
            <br />
            Design
          </>
        }
        subtitle="Four steps between you and curated high-design jewelry. Just access."
        heroMobileCompact
      />

      <TornPaperEdge className="mx-auto max-w-[1440px]" />

      <SectionHeading
        label="How Access Works"
        heading="Choose. Receive. Wear. Refresh."
        headingMobile
        className="section-heading-how-it-works"
        labelClassName="section-heading-how-it-works-label"
      />
      <section className="how-it-works-section-mobile mx-auto max-w-[1440px] px-5 pb-16 sm:px-6 md:px-12 lg:px-16">
        <div className="flex w-full flex-col gap-2 md:items-stretch [&>*]:md:h-auto [&>*]:md:min-w-0 [&>*]:md:basis-0 [&>*]:md:flex-1 md:flex-row">
          <StepBlock
            number="01"
            title="Choose"
            description="Browse our curated vault and select the pieces that speak to your moment."
            icon={Hand}
          />
          <StepBlock
            number="02"
            title="Receive"
            description="Your selections arrive in 1-3 days, freshly restored and sealed in our signature packaging."
            icon={Package}
          />
          <StepBlock
            number="03"
            title="Wear"
            description="Style them for your life - the event, the meeting, the dinner, the everyday."
            icon={Sparkles}
          />
          <StepBlock
            number="04"
            title="Keep Your Favorite"
            description="One piece per cycle is yours to keep at no additional cost. Want more? Members save 40% on any additional piece."
            icon={Heart}
          />
          <StepBlock
            number="05"
            title="Refresh"
            description="At the end of your cycle, return the pieces you are not keeping and choose your next chapter."
            icon={RefreshCw}
          />
        </div>
      </section>

      <DiamondChainBorder className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="mx-auto hidden max-w-[1440px] px-5 pb-16 sm:px-6 md:block md:px-12 lg:px-16">
        <MobileCarousel desktopClassName="grid-cols-2 gap-[2px]" cardWidth="min-w-[80vw]">
          <div className="step-detail-card-mobile relative h-full overflow-hidden border border-border bg-card p-8">
            <GrainOverlay opacity={0.03} />
            <OrganicBlobTag variant="classic" className="mb-4">
              Keep What You Love
            </OrganicBlobTag>
            <h3 className="step-detail-title relative z-[1] mb-4 font-serif text-xl font-semibold tracking-[0.02em] md:text-2xl">
              Keep Your{" "}
              <CircleEmphasis color="var(--tag-red)">Favorite</CircleEmphasis>
            </h3>
            <p className="step-detail-description relative z-[1] font-sans text-[12px] leading-relaxed text-muted-foreground">
              One piece per cycle is yours to keep at no additional cost. Want
              more? Members save <ScriptNumber>40%</ScriptNumber> on any
              additional piece. Experience jewelry in real life, then build your
              collection through discovery.
            </p>
          </div>
          <div className="step-detail-card-mobile relative h-full overflow-hidden border border-border bg-card p-8">
            <GrainOverlay opacity={0.03} />
            <OrganicBlobTag variant="coastal" className="mb-4">
              Restored Between Every Wear
            </OrganicBlobTag>
            <h3 className="step-detail-title relative z-[1] mb-4 font-serif text-xl font-semibold tracking-[0.02em] md:text-2xl">
              Sanitized & Sealed Protocol
            </h3>
            <p className="step-detail-description relative z-[1] font-sans text-[12px] leading-relaxed text-muted-foreground">
              Our atelier restores every returning piece: hand cleaning, UV
              sanitization, <ScriptNumber>4</ScriptNumber>-point inspection
              (structure, surface, stones, mechanism), and sealed in protective
              packaging. What arrives at your door is indistinguishable from
              new.
            </p>
          </div>
        </MobileCarousel>
      </section>

      <StitchLineDivider className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="relative overflow-hidden border-t border-border">
        <GrainOverlay opacity={0.03} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-16 text-center sm:px-6 md:px-12 md:py-24 lg:px-16">
          <HandDrawnFrame strokeColor="hsl(var(--foreground))">
            <h2 className="mb-4 font-serif text-3xl font-medium tracking-[-0.01em] text-ink md:text-4xl lg:text-5xl">
              Access Is{"\n"}The New{" "}
              <ScribbleUnderline color="var(--brass)" delay={0.5}>
                Luxury
              </ScribbleUnderline>
            </h2>
            <p className="mx-auto mb-10 max-w-content font-sans text-[13px] leading-relaxed text-muted-foreground">
              Two tiers of access. One philosophy: more beauty, less burden.
              Every membership includes protection, care, and free shipping.
            </p>
            <TrustStrip variant="full" />
          </HandDrawnFrame>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[hsl(28,22%,34%)]">
        <GrainOverlay opacity={0.05} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-16 text-center sm:px-6 md:px-12 md:py-24 lg:px-16">
          <WaxSeal size={40} className="mx-auto mb-4" />
          <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.4em] text-[hsl(36,25%,78%)]">
            Limited Invitation
          </p>
          <h2 className="mb-4 font-serif text-2xl font-medium tracking-[0.04em] text-[hsl(36,33%,93%)] md:text-3xl lg:text-4xl">
            Member Access
          </h2>
          <p className="mx-auto mb-10 max-w-content font-sans text-[13px] leading-relaxed text-[hsl(36,20%,75%)]">
            We are opening our doors to members who believe luxury is not about
            owning more - it is about accessing better. Launch pricing, early
            access, priority selection, and member benefits - attached to your
            account from day one.
          </p>
          <Link
            to="/#founding-access"
            className="inline-block border border-[hsl(36,25%,78%)] px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.2em] text-[hsl(36,25%,78%)] transition-colors hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)]"
          >
            Apply for Access
          </Link>
        </div>
      </section>

      <div id="tiers">
        <SectionHeading
          label="Choose Your Tier"
          heading="Your Level of Access"
          className="section-heading-your-level"
        />
      </div>
      <section className="mx-auto max-w-[1440px] px-5 pb-8 sm:px-6 md:px-12 lg:px-16">
        <div className="mb-8 hidden justify-center md:flex">
          <HandDrawnRect className="max-w-md">
            <p className="text-center font-sans text-[12px] leading-relaxed text-muted-foreground">
              Starting from just{" "}
              <MarkerCircle color="var(--tag-red)">
                <span className="font-semibold text-foreground">$65/mo</span>
              </MarkerCircle>{" "}
              - full vault access included
            </p>
          </HandDrawnRect>
        </div>
        <OfferUnit variant="full" />
      </section>

      <WavyDivider
        variant="double"
        className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16"
      />

      <SectionHeading label="Your Guarantee" heading="The 5 Trust Standards" />
      <DotGridTexture className="mx-auto max-w-[1440px]" dotSize={0.5} spacing={22}>
        <section className="px-5 pb-16 sm:px-6 md:px-12 lg:px-16">
          <div className="flex flex-col gap-2 md:hidden">
            {trustStandards.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 border border-border bg-card px-3 py-2"
              >
                <item.icon className="h-4 w-4 flex-shrink-0 stroke-[1.3] text-foreground" />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.12em]">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          <div className="hidden grid-cols-5 gap-4 md:grid">
            {trustStandards.map((item, idx) => (
              <div
                key={item.title}
                className="h-full border border-border bg-card p-6 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-[3px] hover:border-2 hover:border-foreground"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Trust {String(idx + 1).padStart(2, "0")}
                  </span>
                  <item.icon className="h-5 w-5 stroke-[1.3] text-foreground" />
                </div>
                <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-[0.15em]">
                  {item.title}
                </p>
                <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </DotGridTexture>

      <div className="mx-auto hidden max-w-[1440px] px-5 pb-8 sm:px-6 md:flex md:px-12 lg:px-16">
        <WashiTapeNote label="TRUST PROMISE" tapeColor="var(--seafoam)" rotation={-1}>
          <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
            "No surprise fees. No hidden costs. That&apos;s not a policy - it&apos;s
            a principle."
          </p>
        </WashiTapeNote>
        <div className="max-w-md">
          <MarginNote attribution="GEA Care Team">
            Every piece that returns to our atelier is treated as if it were
            brand new. That&apos;s the standard.
          </MarginNote>
        </div>
      </div>

      <StitchLineDivider className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16" />

      <SectionHeading label="Common Questions" heading="Everything You Need to Know" />
      <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-6 md:px-12 lg:px-16">
        <AccordionFAQ items={faqItems} />
      </section>

      <div className="mx-auto hidden max-w-[1440px] px-5 pb-12 sm:px-6 md:block md:px-12 lg:px-16">
        <div className="mt-10 flex justify-center">
          <SketchyBorderCard label="EDITOR'S NOTE" pathVariant={1} className="max-w-lg">
            <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
              "Access should feel elevated, transparent, and easy to trust from
              the very first cycle."
            </p>
          </SketchyBorderCard>
        </div>
      </div>
    </PageLayout>
  );
};

export default HowItWorks;
