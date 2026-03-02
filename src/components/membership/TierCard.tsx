import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export interface TierData {
  name: string;
  label: string;
  price: string;
  promoPrice?: string;
  period: string;
  pieces: string;
  features: string[];
  highlighted?: boolean;
}

export const TierCard = ({ tier }: { tier: TierData }) => {
  return (
    <div
      className={`border border-border flex flex-col ${
        tier.highlighted ? "bg-foreground text-background" : "bg-card"
      }`}
    >
      {/* Header */}
      <div className="p-8 md:p-10 border-b border-border">
        <p
          className={`text-[10px] tracking-[0.3em] uppercase font-sans mb-3 ${
            tier.highlighted ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          {tier.label}
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.02em] mb-2">
          {tier.name}
        </h3>
        <p className="font-serif text-lg">{tier.pieces}</p>
      </div>

      {/* Price */}
      <div className="px-8 md:px-10 py-6 border-b border-border">
        <span className="font-serif text-3xl md:text-4xl font-medium">{tier.price}</span>
        <span
          className={`text-[11px] tracking-[0.15em] font-sans ml-2 ${
            tier.highlighted ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          /{tier.period}
        </span>
        {tier.promoPrice && (
          <p
            className={`text-[11px] font-sans mt-2 ${
              tier.highlighted ? "text-background/70" : "text-muted-foreground"
            }`}
          >
            {tier.promoPrice} your first month
          </p>
        )}
      </div>

      {/* Features */}
      <div className="p-8 md:p-10 flex-1">
        <ul className="space-y-3">
          {tier.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check
                className={`h-4 w-4 mt-0.5 flex-shrink-0 stroke-[1.5] ${
                  tier.highlighted ? "text-background/70" : "text-foreground"
                }`}
              />
              <span
                className={`text-[12px] font-sans leading-relaxed ${
                  tier.highlighted ? "text-background/80" : "text-muted-foreground"
                }`}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-8 md:px-10 pb-8 md:pb-10">
        <Link
          to="/founding-100"
          className={`block text-center py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans font-medium border transition-colors ${
            tier.highlighted
              ? "border-background text-background hover:bg-background hover:text-foreground"
              : "border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground"
          }`}
        >
          Apply for Access
        </Link>
      </div>
    </div>
  );
};
