import { Shield, RefreshCw, Truck, Wrench, Ban } from "lucide-react";

const trustItems = {
  full: [
    { icon: Ban, text: "Cancel Anytime" },
    { icon: Shield, text: "Sanitized & Sealed" },
    { icon: Wrench, text: "Repair Guarantee" },
    { icon: Truck, text: "Free Returns" },
    { icon: RefreshCw, text: "No Surprise Fees" },
  ],
  compact: [
    { icon: Ban, text: "Cancel Anytime" },
    { icon: Shield, text: "Sanitized & Sealed" },
    { icon: Truck, text: "Free Returns" },
  ],
};

interface TrustStripProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustStrip = ({ variant = "full", className = "" }: TrustStripProps) => {
  const items = trustItems[variant];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.text}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-sans text-muted-foreground"
        >
          <item.icon className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
};
