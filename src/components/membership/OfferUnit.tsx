import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { MEMBERSHIP_CHECKOUT_URLS } from "@/lib/membershipCheckout";
import { SavingsCalculator } from "@/components/membership/SavingsCalculator";

const DEFAULT_TIER_HREF = "/how-it-works#tiers";

const tierData = [
  {
    name: "Seed Membership",
    label: "3 Pieces",
    price: "$35",
    priceNum: 35,
    pieces: 3,
    piecesLabel: "3 curated rentals per cycle",
    highlighted: false,
    features: [
      "Full vault access",
      "Keep 1 piece each cycle, included",
      "Keep any extra rental for 60% off list price (charged on return)",
      "Add an extra rental item for $6",
      "Protection, sanitation & free shipping both ways",
      "Cancel anytime - no commitment",
    ],
  },
  {
    name: "Blossom Membership",
    label: "6 Pieces",
    price: "$65",
    priceNum: 65,
    pieces: 6,
    piecesLabel: "6 curated rentals per cycle",
    highlighted: false,
    features: [
      "Full vault access",
      "Keep 2 pieces each cycle, included",
      "Keep any extra rental for 60% off list price (charged on return)",
      "Add an extra rental item for $6",
      "Protection, sanitation & free shipping both ways",
      "Cancel anytime - no commitment",
    ],
  },
  {
    name: "Garden Membership",
    label: "10 Pieces",
    price: "$85",
    priceNum: 85,
    pieces: 10,
    piecesLabel: "10 curated rentals per cycle",
    highlighted: true,
    features: [
      "Full vault access",
      "Keep 3 pieces each cycle, included",
      "Keep any extra rental for 60% off list price (charged on return)",
      "Add an extra rental item for $6",
      "Protection, sanitation & free shipping both ways",
      "Cancel anytime - no commitment",
    ],
  },
];

type OfferVariant = "compact" | "standard" | "full";

interface OfferUnitProps {
  variant?: OfferVariant;
  ctaHref?: string;
}

const CompactOffer = ({ ctaHref }: { ctaHref: string }) => (
  <div className="border border-border bg-card p-6">
    <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      Membership Access
    </p>
    <p className="mb-4 font-sans text-[12px] leading-relaxed text-foreground">
      Membership from $35/mo. Rent 3, 6, or 10 pieces a cycle — keep 1 to 3.
    </p>
    <div className="space-y-3">
      {tierData.map((tier) => (
        <div key={tier.name} className="flex items-baseline justify-between gap-3">
          <span className="font-sans text-[12px] font-medium">
            {tier.name} - {tier.pieces} pieces
          </span>
          <span className="font-sans text-[12px] text-muted-foreground">
            {tier.price}/mo
          </span>
        </div>
      ))}
    </div>
    <p className="mt-4 font-sans text-[11px] leading-relaxed text-muted-foreground">
      Tier pricing reflects membership access, not the price of a single piece.
    </p>
    <Link to={ctaHref} className="cta-underline mt-5 inline-block">
      See How It Works
    </Link>
  </div>
);

const StandardOffer = ({ ctaHref }: { ctaHref: string }) => (
  <div className="tier-grid-mobile mx-auto grid max-w-[1120px] grid-cols-1 gap-4 md:grid-cols-3">
    {tierData.map((tier) => (
      <a
        key={tier.name}
        href={MEMBERSHIP_CHECKOUT_URLS[tier.name] ?? ctaHref}
        aria-label={`Join ${tier.name} membership`}
        className={`tier-card-mobile group flex h-full flex-col border border-border transition-transform duration-300 ease-out hover:-translate-y-[3px] ${
          tier.highlighted ? "bg-foreground text-background" : "bg-card"
        }`}
      >
        <div className="tier-header-mobile border-b border-border p-8 md:p-10">
          <p
            className={`tier-label mb-3 font-sans text-[10px] uppercase tracking-[0.3em] ${
              tier.highlighted ? "text-background/60" : "text-muted-foreground"
            }`}
          >
            {tier.label}
          </p>
          <h3 className="tier-name-mobile mb-2 font-serif text-2xl font-semibold tracking-[0.02em] md:text-3xl">
            {tier.name}
          </h3>
          <p className="tier-pieces-mobile font-serif text-lg md:text-lg">
            {tier.piecesLabel}
          </p>
        </div>

        <div className="tier-price-section-mobile border-b border-border px-8 py-6 md:px-10">
          <span className="tier-price-mobile font-serif text-3xl font-medium md:text-4xl">
            {tier.price}
          </span>
          <span
            className={`ml-2 font-sans text-[11px] tracking-[0.15em] ${
              tier.highlighted ? "text-background/60" : "text-muted-foreground"
            }`}
          >
            /month
          </span>
        </div>

        <div className="tier-features-mobile flex-1 p-8 md:p-10">
          <ul className="space-y-3">
            {tier.features.map((feature, index) => (
              <li key={index} className="tier-feature-item-mobile flex items-start gap-3">
                <Check
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 stroke-[1.5] ${
                    tier.highlighted ? "text-background/70" : "text-foreground"
                  }`}
                />
                <span
                  className={`font-sans text-[12px] leading-relaxed ${
                    tier.highlighted ? "text-background/80" : "text-muted-foreground"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-8 pb-8 md:px-10 md:pb-10">
          <span
            className="tier-cta-mobile block border py-3.5 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors group-hover:opacity-90"
            style={
              tier.highlighted
                ? {
                    borderColor: "hsl(var(--background))",
                    color: "hsl(var(--background))",
                  }
                : {
                    borderColor: "hsl(var(--foreground))",
                    backgroundColor: "hsl(var(--foreground))",
                    color: "hsl(var(--background))",
                  }
            }
          >
            Join Now
          </span>
        </div>
      </a>
    ))}
  </div>
);

const FullOffer = ({ ctaHref }: { ctaHref: string }) => (
  <div className="space-y-8">
    <StandardOffer ctaHref={ctaHref} />
    <p className="text-center font-sans text-[11px] tracking-[0.1em] text-muted-foreground">
      One curated shipment per 30-day cycle. Keep 1 to 3 pieces by tier, included —
      keep any extra rental for 60% off list price (charged on return), or add an extra rental for $6.
    </p>

    <div className="cpw-section-mobile grid grid-cols-1 gap-10 border border-border bg-card p-10 md:grid-cols-2 md:p-14">
      <div>
        <p className="cpw-label mb-4 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          The Math
        </p>
        <h3 className="cpw-title mb-4 font-serif text-2xl font-semibold tracking-[0.02em] md:text-3xl">
          Cost-Per-Wear Intelligence
        </h3>
        <p className="cpw-desc mb-6 font-sans text-[12px] leading-relaxed text-muted-foreground">
          The average fine jewelry purchase sits unworn 90% of its life. GEA
          membership flips that - you wear far more, spend less per occasion, and
          keep the pieces that truly earn a place in your collection.
        </p>
        <Link to="/how-it-works" className="cta-underline">
          See How It Works
        </Link>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <div className="cpw-card border border-border p-6">
          <p className="cpw-card-label mb-1 font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Traditional Purchase
          </p>
          <p className="cpw-card-price font-serif text-2xl font-medium">$30+ per wear</p>
          <p className="cpw-card-sub font-sans text-[11px] text-muted-foreground">
            One $150 piece worn 5 times
          </p>
        </div>
        <div className="cpw-card border border-foreground bg-foreground p-6 text-background">
          <p className="cpw-card-label mb-1 font-sans text-[10px] uppercase tracking-[0.25em] text-background/60">
            Garden Membership
          </p>
          <p className="cpw-card-price font-serif text-2xl font-medium">Under $2 per wear</p>
          <p className="cpw-card-sub font-sans text-[11px] text-background/70">
            $85 per 10-piece cycle, worn 5 times each
          </p>
        </div>
      </div>
    </div>

    <SavingsCalculator />
  </div>
);

export const OfferUnit = ({
  variant = "standard",
  ctaHref = DEFAULT_TIER_HREF,
}: OfferUnitProps) => {
  switch (variant) {
    case "compact":
      return <CompactOffer ctaHref={ctaHref} />;
    case "full":
      return <FullOffer ctaHref={ctaHref} />;
    default:
      return <StandardOffer ctaHref={ctaHref} />;
  }
};
