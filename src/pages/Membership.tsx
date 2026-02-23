import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { TierCard, type TierData } from "@/components/membership/TierCard";
import { SavingsCalculator } from "@/components/membership/SavingsCalculator";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { Shield, RefreshCw, Truck, Gem, Wrench } from "lucide-react";

const tiers: TierData[] = [
  {
    name: "Essentials",
    label: "Tier I",
    price: "$89",
    period: "month",
    pieces: "1 shipment per month",
    features: [
      "Access the full GEA vault",
      "Keep any piece at member price",
      "Free repairs & insurance included",
      "Professionally sanitized & restored",
      "Free shipping both ways",
      "Cancel anytime — no commitment",
    ],
  },
  {
    name: "Signature",
    label: "Most Popular",
    price: "$159",
    period: "month",
    pieces: "2 shipments per month",
    highlighted: true,
    features: [
      "Everything in Essentials",
      "Priority access to new drops",
      "Flexible mid-cycle swaps",
      "Early access to capsule collections",
      "Complimentary styling session",
      "60-day satisfaction adjustment",
    ],
  },
  {
    name: "Atelier",
    label: "Tier III",
    price: "$279",
    period: "month",
    pieces: "4 shipments per month",
    features: [
      "Everything in Signature",
      "Dedicated concierge stylist",
      "Founding member badge",
      "Full vault access — no waitlists",
      "Quarterly surprise pieces",
      "First access to limited editions",
    ],
  },
];

const riskReversals = [
  { icon: Shield, text: "Cancel anytime — no long-term commitment" },
  { icon: Wrench, text: "Free repair & replacement guarantee" },
  { icon: RefreshCw, text: "Flexible returns & mid-cycle swaps" },
  { icon: Truck, text: "Free insured shipping both ways" },
  { icon: Gem, text: "Keep any piece at member-exclusive pricing" },
];

const faqItems: FAQItem[] = [
  {
    question: "How does the cost-per-wear work?",
    answer:
      "Traditional jewelry purchases average $800+ per piece worn 3-5 times — that's $160+ per wear. With GEA Signature at $159/month, you access 2 shipments of designer jewelry. Worn even twice each, your cost-per-wear drops below $40. The more you rotate, the more intelligent your investment becomes.",
  },
  {
    question: "What does 'keep any piece' mean?",
    answer:
      "Fall in love with something? Every piece in the vault has a member buyout price — typically 40-60% below retail. No pressure, no upsell. Simply choose to keep it, and we'll apply your member discount automatically.",
  },
  {
    question: "What happens in my first month?",
    answer:
      "Your first rotation ships within 2 business days of enrollment. Founding members receive a complimentary styling consultation and priority vault access. Your 60-day satisfaction adjustment means if the first rotation doesn't resonate, we'll work with you to find what does.",
  },
  {
    question: "Is there a commitment period?",
    answer:
      "No. Every GEA membership is month-to-month. Cancel anytime from your account dashboard — no fees, no penalties, no questions. We believe access should feel like freedom, not obligation.",
  },
  {
    question: "What if a piece is damaged during wear?",
    answer:
      "Normal wear is fully covered under your membership. Our in-house atelier restores every piece between rotations — repolishing, stone tightening, clasp repair. Accidental damage? We handle that too, at no additional cost.",
  },
];

const Membership = () => {
  return (
    <PageLayout>
      <PageHero
        label="Membership"
        headline={"Access Is\nThe New Luxury"}
        subtitle="Three tiers of access. One philosophy: more beauty, less burden. Every membership includes repair, insurance, sanitization, and free shipping."
        cta="Start Your First Rotation"
        ctaHref="#tiers"
      />

      {/* Tier cards */}
      <div id="tiers">
        <SectionHeading label="Choose Your Tier" heading="Your Level of Access" />
      </div>
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <StaggerItem key={tier.name}>
              <TierCard tier={tier} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Cost-per-wear reframe */}
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
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
              <p className="font-serif text-2xl font-medium">$160+ per wear</p>
              <p className="text-[11px] text-muted-foreground font-sans">$800 piece worn 5 times</p>
            </div>
            <div className="border border-foreground bg-foreground text-background p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-background/60 mb-1">
                GEA Signature
              </p>
              <p className="font-serif text-2xl font-medium">Under $40 per wear</p>
              <p className="text-[11px] text-background/70 font-sans">$159/mo, 2 shipments, unlimited style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding member scarcity */}
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-12 lg:px-16 py-16 md:py-20 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-4 font-sans">
            Limited Invitation
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-[hsl(36,33%,93%)] tracking-[0.04em] mb-4">
            Founding Member Access
          </h2>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[480px] mx-auto mb-10 leading-relaxed">
            The first 200 members receive founding status: a permanent badge, 
            lifetime priority access, quarterly surprise pieces, and a complimentary 
            lab-grown tennis necklace with their first rotation.
          </p>
          <Link
            to="/membership"
            className="inline-block border border-[hsl(36,25%,78%)] text-[hsl(36,25%,78%)] px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-[hsl(36,25%,78%)] hover:text-[hsl(28,22%,34%)] transition-colors"
          >
            Claim Founding Access
          </Link>
        </div>
      </section>

      {/* Savings calculator */}
      <SectionHeading label="The Math" heading="Your Membership Pays for Itself" />
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <SavingsCalculator />
      </section>

      {/* Risk reversal */}
      <SectionHeading label="Your Guarantee" heading="Zero Risk. Full Freedom." />
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {riskReversals.map((item) => (
            <StaggerItem key={item.text}>
              <div className="border border-border bg-card p-6 text-center h-full">
                <item.icon className="h-6 w-6 mx-auto mb-4 stroke-[1.3] text-foreground" />
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
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <AccordionFAQ items={faqItems} />
      </section>

      {/* Final CTA */}
      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            More Beauty. Less Burden.
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans max-w-[400px] mx-auto mb-8 leading-relaxed">
            Your rotation is waiting. Begin with any tier — upgrade, downgrade, or cancel anytime.
          </p>
          <Link to="/membership" className="btn-gea">
            Apply for Access
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default Membership;
