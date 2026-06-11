import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AccordionFAQ, type FAQItem } from "@/components/shared/AccordionFAQ";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { MarginNote } from "@/components/craft/MarginNote";
import { TagRedStamp } from "@/components/craft/TagRedStamp";

const categories: { label: string; sectionLabel: string; items: FAQItem[] }[] = [
  {
    label: "How Access Works",
    sectionLabel: "The Model",
    items: [
      {
        question: "What is GEA?",
        answer:
          "GEA is a jewelry membership starting at $65 per 30-day cycle. Choose 5 or 10 pieces, wear them through the cycle, keep 1 favorite, and return the rest with free shipping.",
      },
      {
        question: "How is this different from buying jewelry?",
        answer:
          "Buying asks you to commit before you know how often you'll wear a piece. GEA lets you live with more styles first, then keep the one that earns a permanent place in your collection.",
      },
      {
        question: "How does the access cycle work?",
        answer:
          "Join a membership and each month you receive your Monthly Code — it lets you check out your next set at $0. Wear your pieces for the 30-day cycle, keep 1 favorite, return the rest, and when your new month opens, your next code arrives by email.",
      },
      {
        question: "Can I keep a piece I love?",
        answer:
          "Yes. One piece per cycle is included to keep at no additional cost. If you want more than one, members save 40% on additional keeps.",
      },
    ],
  },
  {
    label: "The Care Ritual",
    sectionLabel: "Hygiene & Quality",
    items: [
      {
        question: "How are pieces prepared between members?",
        answer:
          "Every piece moves through our 3-step ritual: inspect and restore, sanitize, then restore shine and polish before sealing.",
      },
      {
        question: "Are pieces sanitized?",
        answer:
          "Yes. Every piece is sanitized, polished, and sealed before shipping, so the final seal confirms it has not been touched since inspection.",
      },
      {
        question: "What if a piece shows previous wear?",
        answer:
          "If a piece does not meet our standard, it stays out of circulation until it is restored. We do not ship pieces that have not passed inspection.",
      },
      {
        question: "How do you handle allergies or sensitivities?",
        answer:
          "All materials and plating types are listed on each product page. If you have a sensitivity, contact us before selecting and we'll help you narrow the right pieces.",
      },
    ],
  },
  {
    label: "Receiving Your Pieces",
    sectionLabel: "Shipping & Delivery",
    items: [
      {
        question: "How quickly will I receive my pieces?",
        answer:
          "Most selections ship within 1–2 business days and typically arrive within 2–5 business days, depending on your location.",
      },
      {
        question: "What does the packaging look like?",
        answer:
          "Your pieces arrive in GEA signature packaging with a care card, secure storage, and a prepaid return label.",
      },
      {
        question: "Is shipping free?",
        answer:
          "Yes. Shipping is free on every delivery and every return. No hidden fees and no surprise shipping charges.",
      },
      {
        question: "What if my package is lost or damaged in transit?",
        answer:
          "Contact us right away. We'll work directly with the carrier to resolve it and keep you updated — you won't be left handling it alone.",
      },
    ],
  },
  {
    label: "Refreshing Your Collection",
    sectionLabel: "Returns & Refresh",
    items: [
      {
        question: "How do I return pieces?",
        answer:
          "When it's time, we email you return instructions with your prepaid label. Place your pieces back in the packaging, seal it, and drop it off with the carrier.",
      },
      {
        question: "How long can I keep pieces?",
        answer:
          "Each membership runs on a 30-day cycle. We send reminders before the cycle ends, and a 2-day grace period is included if you need a little extra time.",
      },
      {
        question: "What happens after I return?",
        answer:
          "Your next Monthly Code arrives by email when your new cycle opens — it lets you check out your next set at $0. Returning early doesn't move that date; the code always arrives on your monthly rhythm.",
      },
      {
        question: "Can I refresh before my cycle ends?",
        answer:
          "You can return early anytime — just write concierge@geagems.com and we'll arrange it. Your next Monthly Code still arrives on your regular monthly date, so each cycle stays one curated shipment.",
      },
    ],
  },
  {
    label: "Care & Responsibility",
    sectionLabel: "Damage & Repairs",
    items: [
      {
        question: "What happens if a piece is damaged while I have it?",
        answer:
          "Normal wear and tear is on us — covered for up to one affected piece per package, every cycle. Wear your pieces; that's what they're for. And if something happens, just send us a message: our expert team always has a good solution.",
      },
      {
        question: "What counts as damage beyond normal wear?",
        answer:
          "Things like salt water swims, chemical contact, or pieces left unprotected in a travel bag fall outside normal wear — jewelry needs a little tenderness. Repairable damage beyond normal wear, or more than one affected piece in a package, may carry a fixed fee, always shown to you before any charge. Whatever happened, write us first — there's usually a good solution.",
      },
      {
        question: "What if a piece is lost?",
        answer:
          "Lost or unreturnable pieces are charged at the replacement cost shown on the product page before you select them.",
      },
      {
        question: "What about late returns?",
        answer:
          "After the 2-day grace period, a late-return fee may apply. We notify you before any fee is charged, and we encourage you to contact us if your timeline changes.",
      },
    ],
  },
  {
    label: "Your Membership",
    sectionLabel: "Billing & Plans",
    items: [
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes. There are no contracts, commitments, or cancellation fees.",
      },
      {
        question: "How does billing work?",
        answer:
          "Membership renews every 30 days. Your billing date is visible in your account, and there are no hidden fees.",
      },
      {
        question: "What if I need to pause my membership?",
        answer:
          "You can pause your membership at any time. Your preferences stay attached to your account while you're away.",
      },
      {
        question: "Is there a minimum commitment?",
        answer:
          "No. Your first cycle is your first cycle. If GEA is not right for you, you can cancel after that cycle with zero long-term obligation.",
      },
    ],
  },
  {
    label: "The Next Chapter",
    sectionLabel: "Newsletter & Launch",
    items: [
      {
        question: "What is The Next Chapter?",
        answer:
          "The Next Chapter is your monthly notebook for the journey — a member companion with styling challenges, gentle goals, jewelry rituals, and news from members out in the world. Answer a few questions, receive your Becoming Profile, and a new chapter arrives each month, written for who you're becoming.",
      },
      {
        question: "What do subscribers receive?",
        answer:
          "Subscribers receive trend-led styling notes, early access to select launches, and the style quiz invite tied to current promotions.",
      },
      {
        question: "Does subscribing start a membership?",
        answer:
          "No. The Next Chapter is free and separate from membership. It lets you experience the GEA point of view first — then decide if membership is right for you.",
      },
      {
        question: "Can launch pricing or offers change?",
        answer:
          "Yes. Launch pricing, limited gifts, and newsletter incentives may change as inventory and membership capacity change, so the current offer is always shown at the point of signup.",
      },
    ],
  },
  {
    label: "Our Commitment",
    sectionLabel: "Sustainability",
    items: [
      {
        question: "How is GEA sustainable?",
        answer:
          "GEA is built to create more wears from every piece. The membership model helps you rotate through more styles without buying as many one-time pieces, while our restoration process keeps each piece in circulation longer.",
      },
      {
        question: "What happens to pieces that can no longer be worn?",
        answer:
          "Pieces that reach the end of their wearable life are retired with intention. Materials are assessed for recycling or repurposing instead of being discarded carelessly.",
      },
      {
        question: "Where are pieces sourced?",
        answer:
          "We curate from designers and artisans whose craftsmanship and material standards meet our editorial threshold.",
      },
      {
        question: "Does GEA use conflict materials?",
        answer:
          "We prioritize lab-created moissanite and work with designers whose sourcing standards align with our material and quality expectations.",
      },
    ],
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categories.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  ),
};

const trustItems = ["Cancel Anytime", "Free Returns", "Sanitized & Sealed", "Repairs Included"];

const MidPageCTA = ({
  heading,
  cta,
  href,
}: {
  heading: string;
  cta: string;
  href: string;
}) => (
  <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-6 md:px-12 lg:px-16">
    <AnimateIn variant="fadeUp" duration={0.5}>
      <div className="border border-border bg-card px-8 py-8 text-center">
        <h3 className="mb-4 font-serif text-lg">{heading}</h3>
        <Link to={href} className="btn-gea">
          {cta}
        </Link>
      </div>
    </AnimateIn>
  </section>
);

const CraftDivider = ({ index }: { index: number }) => {
  const variants = [
    <StitchLineDivider
      key="stitch"
      className="mx-auto mb-4 max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16"
    />,
    <DiamondChainBorder
      key="diamond"
      className="mx-auto mb-4 max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16"
    />,
    <WavyDivider
      key="wavy"
      className="mx-auto mb-4 max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16"
    />,
  ];

  return variants[index % variants.length];
};

const FAQ = () => {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative overflow-hidden bg-[hsl(28,22%,34%)]">
        <GrainOverlay opacity={0.05} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-20 text-center sm:px-6 md:px-12 md:py-28 lg:px-16">
          <WaxSeal size={40} className="mx-auto mb-4" />
          <AnimateIn variant="fadeIn" duration={0.6}>
            <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.4em] text-[hsl(36,25%,78%)]">
              Questions & Trust
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.6}>
            <h1 className="mb-4 font-serif text-4xl font-medium tracking-[-0.01em] text-[hsl(36,33%,93%)] md:text-5xl">
              Everything You Need to{" "}
              <ScribbleUnderline color="var(--brass)" delay={0.6}>
                Know
              </ScribbleUnderline>
            </h1>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.3} duration={0.6}>
            <p className="mx-auto mb-8 max-w-[500px] font-sans text-[13px] text-[hsl(36,20%,75%)]">
              Clear answers to every question about accessing high-design jewelry through GEA. No fine print. No surprises.
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.45} duration={0.6}>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="font-sans text-[10px] uppercase tracking-[0.2em] text-[hsl(36,25%,78%)] md:text-[11px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      <TornPaperEdge className="mx-auto max-w-[1440px]" />

      {categories.map((category, idx) => (
        <div key={category.label}>
          <SectionHeading label={category.sectionLabel} heading={category.label} />
          <section className="mx-auto max-w-[1440px] px-5 pb-12 sm:px-6 md:px-12 lg:px-16">
            <AnimateIn variant="fadeUp" duration={0.5}>
              <AccordionFAQ items={category.items} />
            </AnimateIn>
          </section>

          {idx === 1 && (
            <MidPageCTA
              heading="Want to see the pieces in motion?"
              cta="Browse the Vault"
              href="/browse"
            />
          )}

          {idx === 4 && (
            <MidPageCTA
              heading="Ready to see the offer in one place?"
              cta="See Membership"
              href="/how-it-works"
            />
          )}

          {idx < categories.length - 1 && <CraftDivider index={idx} />}
        </div>
      ))}

      <div className="mx-auto hidden max-w-[1440px] px-5 pb-8 sm:px-6 md:block md:px-12 lg:px-16">
        <div className="ml-auto max-w-md">
          <MarginNote attribution="GEA Concierge">
            Can't find your answer? Send us a note and we'll route it to the right person.
          </MarginNote>
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-border">
        <GrainOverlay opacity={0.03} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-16 text-center sm:px-6 md:px-12 md:py-24 lg:px-16">
          <TagRedStamp size={20} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="mb-4 font-serif text-2xl font-medium uppercase tracking-[0.06em] md:text-3xl">
                Still Have Questions?
              </h2>
              <p className="mx-auto mb-4 max-w-[440px] font-sans text-[12px] text-muted-foreground">
                We believe in complete transparency. If your question is not answered here, reach out directly and we'll help with the next step.
              </p>
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                {trustItems.map((item) => (
                  <span
                    key={item}
                    className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:text-[10px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Link to="/contact" className="btn-gea">
                Contact Us
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default FAQ;
