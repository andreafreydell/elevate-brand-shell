import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepBlock } from "@/components/shared/StepBlock";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";
import { Hand, Package, Sparkles, RefreshCw } from "lucide-react";

const faqItems: FAQItem[] = [
  {
    question: "When does my selection ship?",
    answer: "Your first rotation ships within 2 business days of enrollment. Subsequent rotations ship within 1 business day of receiving your return. Signature and Atelier members enjoy priority processing.",
  },
  {
    question: "How long can I keep a piece?",
    answer: "There's no hard deadline. Your membership cycle renews monthly, and you can hold a piece for the full cycle. When you're ready to rotate, simply drop it in the prepaid return packaging.",
  },
  {
    question: "Can I swap mid-cycle?",
    answer: "Signature and Atelier members enjoy flexible mid-cycle swaps. Essentials members can upgrade at any time to unlock this feature. Swaps ship within 1 business day.",
  },
  {
    question: "What if I want to keep a piece?",
    answer: "Every piece in the vault has a member buyout price — typically 40-60% below retail. Simply select 'Keep This Piece' in your dashboard. The discounted amount is charged to your card, and the piece is yours forever.",
  },
  {
    question: "What if something gets damaged?",
    answer: "Normal wear is fully covered. Our in-house atelier handles all repairs — repolishing, stone tightening, clasp adjustments — at no cost to you. Accidental damage is covered under your membership insurance.",
  },
  {
    question: "What if I don't like my selection?",
    answer: "Our 60-day satisfaction adjustment means we'll work with you. Exchange for something different, adjust your style preferences, or speak with our concierge team. If GEA isn't for you, cancel anytime — no fees.",
  },
  {
    question: "How is each piece prepared?",
    answer: "Every piece undergoes a multi-step restoration: ultrasonic cleaning, professional repolishing, stone inspection, clasp testing, and sanitization. Each arrives in signature packaging, ready to wear.",
  },
  {
    question: "Can I skip a month?",
    answer: "Yes. Pause your membership at any time from your account dashboard. Your tier, founding status, and preferences are preserved. Resume when you're ready.",
  },
];

const HowItWorks = () => {
  return (
    <PageLayout>
      <PageHero
        label="The Process"
        headline={"Effortless by\nDesign"}
        subtitle="Four steps between you and unlimited designer jewelry. No friction. No commitment. Just access."
      />

      {/* 4-step visual process */}
      <SectionHeading label="Your Rotation" heading="Choose. Receive. Wear. Rotate." />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StepBlock
            number="01"
            title="Choose"
            description="Browse the full GEA vault — hundreds of designer pieces spanning necklaces, bracelets, earrings, and rings. Select what speaks to your month."
            icon={Hand}
          />
          <StepBlock
            number="02"
            title="Receive"
            description="Your selection arrives in 2 business days. Signature packaging. Fully insured. Free shipping. Every piece professionally restored and sanitized."
            icon={Package}
          />
          <StepBlock
            number="03"
            title="Wear"
            description="Style with freedom. Pair with intention. Take the risks you wouldn't take with owned pieces. Every dinner, every event, every Tuesday deserves presence."
            icon={Sparkles}
          />
          <StepBlock
            number="04"
            title="Rotate"
            description="When you're ready for something new, drop your return in the prepaid packaging. Your next rotation ships within 1 business day. The cycle continues."
            icon={RefreshCw}
          />
        </div>
      </section>

      {/* Detailed illustration blocks */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          <div className="bg-card border border-border p-10 md:p-14">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
              Keep What You Love
            </p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">
              The Buyout Option
            </h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              Fall in love? Every piece has a member-exclusive buyout price — 40-60% below retail. 
              No pressure. No upsell. Simply choose "Keep This Piece" and it's yours forever. 
              Your rotation continues uninterrupted.
            </p>
          </div>
          <div className="bg-card border border-border p-10 md:p-14">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
              Restored Between Every Wear
            </p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">
              In-House Atelier Care
            </h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              Our atelier restores every returning piece: ultrasonic cleaning, professional repolishing, 
              stone tightening, clasp inspection, and medical-grade sanitization. What arrives at your 
              door is indistinguishable from new.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <SectionHeading label="Common Questions" heading="Everything You Need to Know" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <AccordionFAQ items={faqItems} />
      </section>

      {/* Closing CTA */}
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-[hsl(36,33%,93%)] tracking-[0.04em] mb-4">
            Your Rotation Awaits
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10 leading-relaxed">
            Three tiers. Zero risk. Cancel anytime. Begin with what feels right.
          </p>
          <Link
            to="/membership"
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            Apply for Access
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default HowItWorks;
