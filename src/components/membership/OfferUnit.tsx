import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SavingsCalculator } from "@/components/membership/SavingsCalculator";

const tierData = [
  {
    name: "Tier 2",
    label: "10 Pieces",
    price: "$85",
    promoPrice: "$75",
    priceNum: 85,
    pieces: 10,
    piecesLabel: "10 curated pieces per cycle",
    highlighted: true,
    features: [
      "Full vault access",
      "1 piece included to keep per cycle",
      "Protection coverage included",
      "Sanitized & Sealed before delivery",
      "Free shipping both ways",
      "Cancel anytime — no commitment",
    ],
  },
  {
    name: "Tier 1",
    label: "5 Pieces",
    price: "$65",
    promoPrice: "$55",
    priceNum: 65,
    pieces: 5,
    piecesLabel: "5 curated pieces per cycle",
    highlighted: false,
    features: [
      "Full vault access",
      "1 piece included to keep per cycle",
      "Protection coverage included",
      "Sanitized & Sealed before delivery",
      "Free shipping both ways",
      "Cancel anytime — no commitment",
    ],
  },
];

type OfferVariant = "compact" | "standard" | "full";

interface OfferUnitProps {
  variant?: OfferVariant;
}

/* ── Compact: one-line per tier, for PDP sidebar ── */
const CompactOffer = () => (
  <div className="border border-border bg-card p-6">
    <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-4">
      Membership Access
    </p>
    <div className="space-y-3">
      {tierData.map((t) => (
        <div key={t.name} className="flex items-baseline justify-between">
          <span className="text-[12px] font-sans font-medium">{t.name} · {t.pieces} pieces</span>
          <span className="text-[12px] font-sans text-muted-foreground">
            {t.price}/mo
            <span className="ml-2 text-[10px]">({t.promoPrice} first month)</span>
          </span>
        </div>
      ))}
    </div>
    <Link to="/how-it-works" className="cta-underline mt-5 inline-block">
      See Membership Options
    </Link>
  </div>
);

/* ── Standard: side-by-side cards with features ── */
const StandardOffer = () => (
  <div className="tier-grid-mobile grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px] mx-auto">
    {tierData.map((tier) => (
      <div
        key={tier.name}
        className={`tier-card-mobile border border-border flex flex-col ${
          tier.highlighted ? "bg-foreground text-background" : "bg-card"
        }`}
      >
        {/* Header */}
        <div className="tier-header-mobile p-8 md:p-10 border-b border-border">
          <p className={`tier-label text-[10px] tracking-[0.3em] uppercase font-sans mb-3 ${
            tier.highlighted ? "text-background/60" : "text-muted-foreground"
          }`}>
            {tier.label}
          </p>
          <h3 className="tier-name-mobile font-serif text-2xl md:text-3xl font-semibold tracking-[0.02em] mb-2">
            {tier.name}
          </h3>
          <p className="tier-pieces-mobile font-serif text-lg md:text-lg">{tier.piecesLabel}</p>
        </div>

        {/* Price */}
        <div className="tier-price-section-mobile px-8 md:px-10 py-6 border-b border-border">
          <span className="tier-price-mobile font-serif text-3xl md:text-4xl font-medium">{tier.price}</span>
          <span className={`text-[11px] tracking-[0.15em] font-sans ml-2 ${
            tier.highlighted ? "text-background/60" : "text-muted-foreground"
          }`}>
            /month
          </span>
          <p className={`text-[11px] font-sans mt-2 ${
            tier.highlighted ? "text-background/70" : "text-muted-foreground"
          }`}>
            {tier.promoPrice} your first month
          </p>
        </div>

        {/* Features */}
        <div className="tier-features-mobile p-8 md:p-10 flex-1">
          <ul className="space-y-3">
            {tier.features.map((f, i) => (
              <li key={i} className="tier-feature-item-mobile flex items-start gap-3">
                <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 stroke-[1.5] ${
                  tier.highlighted ? "text-background/70" : "text-foreground"
                }`} />
                <span className={`text-[12px] font-sans leading-relaxed ${
                  tier.highlighted ? "text-background/80" : "text-muted-foreground"
                }`}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="px-8 md:px-10 pb-8 md:pb-10">
          <Link
            to="/#founding-access"
            className="tier-cta-mobile block text-center py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans font-medium border transition-colors"
            style={tier.highlighted
              ? { borderColor: 'hsl(var(--background))', color: 'hsl(var(--background))' }
              : { borderColor: 'hsl(var(--foreground))', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }
            }
          >
            Apply for Access
          </Link>
        </div>
      </div>
    ))}
  </div>
);

/* ── Full: cards + savings calculator + value stack ── */
const FullOffer = () => (
  <div className="space-y-8">
    <StandardOffer />
    <p className="text-[11px] text-muted-foreground font-sans tracking-[0.1em] text-center">
      One curated shipment per 30-day cycle. One piece is included to keep, and the rest refresh at cycle end.
    </p>

    {/* Cost-per-wear reframe */}
    <div className="cpw-section-mobile border border-border bg-card p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <p className="cpw-label text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
          The Math
        </p>
        <h3 className="cpw-title font-serif text-2xl md:text-3xl font-semibold tracking-[0.02em] mb-4">
          Cost-Per-Wear Intelligence
        </h3>
        <p className="cpw-desc text-[12px] text-muted-foreground font-sans leading-relaxed mb-6">
          The average fine jewelry purchase sits unworn 90% of its life. GEA membership
          inverts that equation — you wear more, spend less per occasion, and never carry
          the weight of a depreciating asset.
        </p>
        <Link to="/how-it-works" className="cta-underline">
          See How It Works
        </Link>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <div className="cpw-card border border-border p-6">
          <p className="cpw-card-label text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-1">
            Traditional Purchase
          </p>
          <p className="cpw-card-price font-serif text-2xl font-medium">$30+ per wear</p>
          <p className="cpw-card-sub text-[11px] text-muted-foreground font-sans">One $150 piece worn 5 times</p>
        </div>
        <div className="cpw-card border border-foreground bg-foreground text-background p-6">
          <p className="cpw-card-label text-[10px] tracking-[0.25em] uppercase font-sans text-background/60 mb-1">
            GEA Tier 2
          </p>
          <p className="cpw-card-price font-serif text-2xl font-medium">Under $2 per wear</p>
          <p className="cpw-card-sub text-[11px] text-background/70 font-sans">$85/mo, 10 pieces, worn 5 times each</p>
        </div>
      </div>
    </div>

    {/* Savings Calculator */}
    <SavingsCalculator />
  </div>
);

export const OfferUnit = ({ variant = "standard" }: OfferUnitProps) => {
  switch (variant) {
    case "compact":
      return <CompactOffer />;
    case "full":
      return <FullOffer />;
    default:
      return <StandardOffer />;
  }
};
