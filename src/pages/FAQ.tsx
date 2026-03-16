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

/* ═══════════════════════════════════════════
   FAQ CONTENT — 8 categories, 32 Q&As
   Ordered by anxiety cluster:
   model → hygiene → shipping → returns →
   damage → billing → founding → sustainability
   ═══════════════════════════════════════════ */

const categories: { label: string; sectionLabel: string; items: FAQItem[] }[] = [
  {
    label: "How Access Works",
    sectionLabel: "The Model",
    items: [
      {
        question: "What is GEA?",
        answer: "GEA is a high-design jewelry access platform. Instead of purchasing jewelry you may only wear a few times, you access a curated collection of statement pieces through membership — wearing, experiencing, and refreshing your selections as your life evolves. This is not rental. This is access.",
      },
      {
        question: "How is this different from buying jewelry?",
        answer: "When you buy, you commit to one piece permanently. When you access through GEA, you experience multiple high-design pieces over time — for events, for seasons, for the woman you are becoming. Your money stretches further. Your visual impact multiplies. No clutter. No regret purchases. No drawers full of jewelry you never wear.",
      },
      {
        question: "How does the access cycle work?",
        answer: "Choose your pieces from our curated collection. Receive them within 1–3 business days, freshly restored and sealed in signature packaging. Wear them for your life — the event, the meeting, the dinner, the everyday. When you are ready for something new, return them and choose your next chapter.",
      },
      {
        question: "Can I keep a piece I love?",
        answer: "Yes. Every piece has a keep price, disclosed before you select it. If a piece becomes part of your identity, it becomes yours — at a member-exclusive price that reflects the value of your relationship with GEA.",
      },
    ],
  },
  {
    label: "The Care Ritual",
    sectionLabel: "Hygiene & Quality",
    items: [
      {
        question: "How are pieces cleaned between members?",
        answer: "Every piece undergoes our 5-step care ritual: alcohol wipe, gentle hand cleaning with soft-bristle brush, UV sanitization, air drying, and hand polishing. We never use ultrasonic cleaners — they damage plating and delicate settings. Every piece is restored to presentation condition before it reaches you.",
      },
      {
        question: "Are pieces sanitized?",
        answer: "Every piece is professionally sanitized and sealed before shipping. Our care ritual exceeds industry standards for shared luxury items. When your package arrives, the seal confirms your pieces have been untouched since their final inspection.",
      },
      {
        question: "What if a piece shows signs of previous wear?",
        answer: "Our 4-point quality inspection checks structural integrity, surface condition, stone security, and mechanism function on every piece, every cycle. If a piece does not meet our standard, it enters repair before returning to the collection. You will never receive a piece that has not passed inspection.",
      },
      {
        question: "How do you handle allergies or sensitivities?",
        answer: "All materials and plating types are listed on each piece's product page. If you have specific sensitivities, contact us before selecting and we will guide you to pieces that work for your skin.",
      },
    ],
  },
  {
    label: "Receiving Your Pieces",
    sectionLabel: "Shipping & Delivery",
    items: [
      {
        question: "How quickly will I receive my pieces?",
        answer: "Most selections ship within 1 business day and arrive within 1–3 business days, depending on your location. You will receive tracking information as soon as your package ships.",
      },
      {
        question: "What does the packaging look like?",
        answer: "Your pieces arrive in GEA signature packaging — a sealed, branded presentation designed to protect your jewelry and deliver the experience you deserve. Every package includes a care card and prepaid return label.",
      },
      {
        question: "Is shipping free?",
        answer: "Yes. Shipping is free on every delivery and every return. No hidden fees. No surprise charges at any point in the cycle.",
      },
      {
        question: "What if my package is lost or damaged in transit?",
        answer: "Contact us immediately. We take full responsibility for packages in transit. Lost or damaged shipments are replaced or resolved at no cost to you.",
      },
    ],
  },
  {
    label: "Refreshing Your Collection",
    sectionLabel: "Returns & Refresh",
    items: [
      {
        question: "How do I return pieces?",
        answer: "Use the prepaid return label included in every package. Place your pieces in the return packaging, seal, and drop off at any carrier location. Returns are tracked from the moment you ship.",
      },
      {
        question: "Is there a time limit on how long I can keep pieces?",
        answer: "Your access cycle length is defined by your membership tier. You will receive a reminder as your cycle approaches its end, with an invitation to browse your next selections. If you need a few extra days, a 2-day grace period is included at no charge.",
      },
      {
        question: "What happens after I return?",
        answer: "Once your return is received, your account is refreshed within 1 business day. You can immediately browse and select your next pieces. The cycle continues as long as your membership is active.",
      },
      {
        question: "Can I refresh early?",
        answer: "Yes. If you are ready for something new before your cycle ends, simply return your current pieces and select new ones. Early refreshes are always welcome.",
      },
    ],
  },
  {
    label: "Care & Responsibility",
    sectionLabel: "Damage & Repairs",
    items: [
      {
        question: "What happens if a piece is damaged while I have it?",
        answer: "Normal wear is on us. Our in-house repair team restores every piece after every cycle — that is part of the GEA promise. You are never charged for ordinary use.",
      },
      {
        question: "What counts as damage beyond normal wear?",
        answer: "Moderate damage includes bent prongs or loose stones — repair fees range from $15–$25. Major damage such as broken clasps or missing stones range from $30–$50. These fees cover restoration, not punishment. Our goal is to keep every piece in the collection alive.",
      },
      {
        question: "What if a piece is lost?",
        answer: "Lost or unreturnable pieces are charged at the replacement cost, which is disclosed on each piece's product page before you select it. We are transparent about this from the beginning so there are no surprises.",
      },
      {
        question: "What about late returns?",
        answer: "After the 2-day grace period, a $5/day late fee applies. We will always notify you before any fee is charged. Life happens — just communicate with us and we will work with you.",
      },
    ],
  },
  {
    label: "Your Membership",
    sectionLabel: "Billing & Plans",
    items: [
      {
        question: "Can I cancel anytime?",
        answer: "Yes. No contracts. No commitments. No cancellation fees. Pause or cancel whenever you choose. We believe you stay because the experience is worth it, not because you are locked in.",
      },
      {
        question: "How does billing work?",
        answer: "Your membership is billed on a monthly cycle. You will always know your billing date, and you will receive a reminder before each charge. No hidden fees. No surprise charges.",
      },
      {
        question: "What if I need to pause my membership?",
        answer: "You can pause your membership at any time. Your account, preferences, and member status are preserved. When you are ready to return, your access is waiting.",
      },
      {
        question: "Is there a minimum commitment?",
        answer: "No. Your first month is your first month. If GEA is not right for you, cancel after your first cycle with zero obligation. We also offer a 60-day adjustment — if you are not in love with your selections, we replace them in your next shipment, free.",
      },
    ],
  },
  {
    label: "The Founding 100",
    sectionLabel: "Founding Access",
    items: [
      {
        question: "What is the Founding 100?",
        answer: "We are opening our doors to 100 founding members who believe luxury is not about owning more — it is about accessing better. The Founding 100 is a hard cap: exactly 100 members with permanent founding privileges. When 100 spots are claimed, founding access closes.",
      },
      {
        question: "What do founding members receive?",
        answer: "Founding members receive permanent perks that will never be available again after the 100 spots are filled. These include priority access to new collections, founding member pricing locked for life, and recognition as part of the group that built GEA from day one.",
      },
      {
        question: "Is the 100 cap real?",
        answer: "Yes. This is not manufactured scarcity. We cap founding membership at 100 because our operations, curation standards, and personal attention require it. When we reach 100, founding access closes and the next chapter begins.",
      },
      {
        question: "Can I gift a founding membership?",
        answer: "Contact us directly. We can arrange founding access as a gift — the recipient receives the full founding experience with all permanent perks.",
      },
    ],
  },
  {
    label: "Our Commitment",
    sectionLabel: "Sustainability",
    items: [
      {
        question: "How is GEA sustainable?",
        answer: "The access model is inherently sustainable. Instead of manufacturing new jewelry for every customer, we curate a collection of high-design pieces that are worn, cared for, repaired, and renewed — continuously. No extraction. No overproduction. No waste. Access is our rebellion against the accumulation model.",
      },
      {
        question: "What happens to pieces that can no longer be worn?",
        answer: "Pieces that reach the end of their wearable life are retired with intention. Materials are assessed for recycling or repurposing. Nothing is discarded carelessly. Every piece has a full lifecycle.",
      },
      {
        question: "Where are pieces sourced?",
        answer: "We curate from designers and artisans whose craftsmanship and material standards meet our editorial threshold. Every piece is selected for design quality, material integrity, and the ability to move between members gracefully.",
      },
      {
        question: "Does GEA use conflict materials?",
        answer: "We work exclusively with designers who maintain ethical sourcing standards. Our commitment to sustainability extends from the moment a piece enters our collection through every cycle of its life.",
      },
    ],
  },
];

/* ── JSON-LD FAQPage schema for SEO rich results ── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categories.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))
  ),
};

/* ── Trust badges ── */
const trustItems = [
  "Cancel Anytime",
  "Free Returns",
  "Sanitized & Sealed",
  "Repair Guarantee",
];

/* ── Mid-page CTA component ── */
const MidPageCTA = ({ heading, cta, href }: { heading: string; cta: string; href: string }) => (
  <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-8">
    <AnimateIn variant="fadeUp" duration={0.5}>
      <div className="bg-card border border-border py-8 px-8 text-center">
        <h3 className="font-serif text-lg mb-4">{heading}</h3>
        <Link to={href} className="btn-gea">{cta}</Link>
      </div>
    </AnimateIn>
  </section>
);

/* ── Craft divider rotation ── */
const CraftDivider = ({ index }: { index: number }) => {
  const variants = [
    <StitchLineDivider key="stitch" className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mb-4" />,
    <DiamondChainBorder key="diamond" className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mb-4" />,
    <WavyDivider key="wavy" className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 mb-4" />,
  ];
  return variants[index % variants.length];
};

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

const FAQ = () => {
  return (
    <PageLayout>
      {/* ── SEO: JSON-LD injected as inline script ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center relative z-[1]">
          <WaxSeal size={40} className="mx-auto mb-4" />
          <AnimateIn variant="fadeIn" duration={0.6}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
              Questions & Trust
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.6}>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-[hsl(36,33%,93%)] tracking-[-0.01em] mb-4">
              Everything You Need to{" "}
              <ScribbleUnderline color="var(--brass)" delay={0.6}>
                Know
              </ScribbleUnderline>
            </h1>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.3} duration={0.6}>
            <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[500px] mx-auto mb-8">
              Clear answers to every question about accessing high-design
              jewelry through GEA. No fine print. No surprises.
            </p>
          </AnimateIn>
          {/* Trust strip */}
          <AnimateIn variant="fadeUp" delay={0.45} duration={0.6}>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-sans text-[hsl(36,25%,78%)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      {/* ═══════════════════════════════════════════
          FAQ SECTIONS (8 categories, 32 Q&As)
          ═══════════════════════════════════════════ */}
      {categories.map((cat, idx) => (
        <div key={cat.label}>
          <SectionHeading label={cat.sectionLabel} heading={cat.label} />
          <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
            <AnimateIn variant="fadeUp" duration={0.5}>
              <AccordionFAQ items={cat.items} />
            </AnimateIn>
          </section>

          {/* Mid-page CTA after The Care Ritual (hygiene anxiety resolved → convert) */}
          {idx === 1 && (
            <MidPageCTA
              heading="Ready to Experience Access?"
              cta="Explore the Collection"
              href="/browse"
            />
          )}

          {/* Mid-page CTA after Care & Responsibility (damage anxiety resolved → convert) */}
          {idx === 4 && (
            <MidPageCTA
              heading="Transparent. Confident. Yours."
              cta="Apply for Access"
              href="/how-it-works"
            />
          )}

          {/* Craft dividers between sections */}
          {idx < categories.length - 1 && <CraftDivider index={idx} />}
        </div>
      ))}

      {/* ── Margin note ── */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:block">
        <div className="max-w-md ml-auto">
          <MarginNote attribution="GEA Concierge">
            Can't find your answer? Our team responds within 24 hours —
            every time.
          </MarginNote>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="border-t border-border relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 text-center relative z-[1]">
          <TagRedStamp size={20} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
                Still Have Questions?
              </h2>
              <p className="text-[12px] text-muted-foreground font-sans mb-4 max-w-[440px] mx-auto">
                We believe in complete transparency. If your question is not
                answered here, reach out directly and we will respond within
                one business day.
              </p>
              {/* Trust micro-strip repeated */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {trustItems.map((item) => (
                  <span
                    key={item}
                    className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground"
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
