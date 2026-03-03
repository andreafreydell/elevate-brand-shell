import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepBlock } from "@/components/shared/StepBlock";
import { TrustStrip } from "@/components/shared/TrustStrip";
import { OfferUnit } from "@/components/membership/OfferUnit";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";
import { Hand, Package, Sparkles, RefreshCw } from "lucide-react";

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
    answer: "Every piece in the vault has a member price through Keep Your Favorite. Simply select 'Keep This Piece' in your dashboard. The amount is charged to your card, and the piece is yours.",
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
];

const HowItWorks = () => {
  return (
    <PageLayout>
      <PageHero
        label="The Process"
        headline={"Effortless by\nDesign"}
        subtitle="Four steps between you and curated high-design jewelry. Just access."
      />

      {/* 4-step visual process */}
      <SectionHeading label="How Access Works" heading="Choose. Receive. Wear. Refresh." />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StepBlock
            number="01"
            title="Choose"
            description="Browse our curated vault and select the pieces that speak to your moment."
            icon={Hand}
          />
          <StepBlock
            number="02"
            title="Receive"
            description="Your selections arrive in 1–3 days, freshly restored and sealed in our signature packaging."
            icon={Package}
          />
          <StepBlock
            number="03"
            title="Wear"
            description="Style them for your life — the event, the meeting, the dinner, the everyday."
            icon={Sparkles}
          />
          <StepBlock
            number="04"
            title="Refresh"
            description="When you're ready for something new, return and choose your next chapter."
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
              Keep Your Favorite
            </h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              Experience jewelry in real life before deciding to own it. Every piece has a member
              price. Simply choose "Keep This Piece" and it's yours forever.
              Your access continues uninterrupted.
            </p>
          </div>
          <div className="bg-card border border-border p-10 md:p-14">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
              Restored Between Every Wear
            </p>
            <h3 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.02em] mb-4">
              Sanitized & Sealed Protocol
            </h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              Our atelier restores every returning piece: hand cleaning, UV sanitization,
              4-point inspection (structure, surface, stones, mechanism), and sealed in
              protective packaging. What arrives at your door is indistinguishable from new.
            </p>
          </div>
        </div>
      </section>

      {/* Membership tiers (standard OfferUnit) */}
      <SectionHeading label="Membership" heading="Your Tier of Access" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
        <OfferUnit variant="standard" />
      </section>

      {/* Trust Strip */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8">
        <TrustStrip variant="full" />
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
            Your Access Awaits
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[400px] mx-auto mb-10 leading-relaxed">
            Two tiers. Zero risk. Cancel anytime. Begin with what feels right.
          </p>
          <Link
            to="/founding-100"
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
