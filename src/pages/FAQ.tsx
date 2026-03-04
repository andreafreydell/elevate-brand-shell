import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";

const categories: { label: string; items: FAQItem[] }[] = [
  {
    label: "Membership",
    items: [
      { question: "How does GEA membership work?", answer: "Choose a tier (Tier A or Tier B), and each cycle you receive curated high-design jewelry from our vault. Wear them, enjoy them, then return when you're ready to refresh your selection. One piece per cycle is yours to keep — included in your membership." },
      { question: "Can I cancel anytime?", answer: "Yes. Every GEA membership is month-to-month with no long-term commitment. Cancel from your dashboard — no fees, no penalties." },
      { question: "Can I upgrade or downgrade my tier?", answer: "Absolutely. Tier changes take effect at your next billing cycle. Your preferences and founding status are always preserved." },
      { question: "What is the 60-Day Adjustment?", answer: "If your first two selections don't resonate, we'll work with you — adjust your style profile, offer concierge guidance, or process a full adjustment. We want you to love every selection." },
    ],
  },
  {
    label: "Shipping & Returns",
    items: [
      { question: "How fast does shipping take?", answer: "First selections ship within 2 business days. Subsequent selections ship within 1 business day of receiving your return. All shipping is free and fully insured." },
      { question: "How do I return a piece?", answer: "Every shipment includes prepaid return packaging. Simply place the piece inside, seal, and drop it at any carrier location. No cost to you." },
      { question: "Can I skip a month?", answer: "Yes. Pause anytime from your dashboard. Your tier, status, and preferences are preserved until you're ready to resume." },
    ],
  },
  {
    label: "Care & Quality",
    items: [
      { question: "What materials does GEA use?", answer: "Lab-created moissanite, gold vermeil (2.5 micron 18k gold over sterling silver), and recycled metals. Every stone is conflict-free. Every piece is designed in-house." },
      { question: "What happens if a piece is damaged?", answer: "Normal wear is fully covered. Our in-house atelier handles all repairs at no cost — repolishing, stone tightening, clasp repair. Accidental damage is covered under membership insurance." },
      { question: "How is each piece cleaned between members?", answer: "Six-step restoration: ultrasonic cleaning, repolishing, stone inspection, clasp testing, medical-grade sanitization, and quality certification." },
    ],
  },
  {
    label: "Buying & Keeping",
    items: [
      { question: "Can I keep a piece permanently?", answer: "Yes. One piece per cycle is yours to keep at no extra cost — included in your membership. Want to keep additional pieces? Members save 40% on every extra piece. Select 'Keep This Piece' in your dashboard." },
      { question: "Does keeping a piece affect my access?", answer: "No. Keeping a piece is separate from your access cycle. Your next shipment proceeds as scheduled." },
    ],
  },
];

const FAQ = () => {
  return (
    <PageLayout>
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
            Support
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[hsl(36,33%,93%)] tracking-[-0.01em] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[440px] mx-auto">
            Everything you need to know about GEA membership, access, and care.
          </p>
        </div>
      </section>

      {categories.map((cat) => (
        <div key={cat.label}>
          <SectionHeading heading={cat.label} />
          <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
            <AccordionFAQ items={cat.items} />
          </section>
        </div>
      ))}

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            Still Have Questions?
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans mb-8">
            Our concierge team is here to help.
          </p>
          <Link to="/how-it-works" className="btn-gea">
            Contact Us
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default FAQ;
