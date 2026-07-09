import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useMemberEntitlement } from "@/hooks/useMemberEntitlement";

const STORAGE_KEY = "gea_promo_dismissed";

export const PromoBar = () => {
  const [dismissed, setDismissed] = useState(true);
  const { isEntitled, freeLeft, returnWindowOpen, memberActive } = useMemberEntitlement();

  useEffect(() => {
    setDismissed(Boolean(sessionStorage.getItem(STORAGE_KEY)));
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  // Member states override the marketing promo (and ignore the marketing
  // dismissal — a member's open cycle is a to-do, not an ad).
  const memberCallToAction = isEntitled
    ? {
        to: "/browse",
        bold: "Your cycle is open — pick your pieces now",
        detail: freeLeft > 0 ? `${freeLeft} included piece${freeLeft === 1 ? "" : "s"} waiting` : "your pieces are waiting",
      }
    : memberActive && returnWindowOpen
      ? {
          to: "/returns",
          bold: "It's time to return your pieces",
          detail: "start your return shipment",
        }
      : null;

  if (!memberCallToAction && dismissed) return null;

  const content = memberCallToAction ?? {
    to: "/how-it-works",
    bold: "Founding offer — your price locked in for life",
    detail: "Free shipping both ways - See membership",
  };

  return (
    <div className="bg-card border-b border-border relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-1.5 md:py-2.5 flex items-center justify-center">
        <Link
          to={content.to}
          className="text-[10px] tracking-[0.2em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors text-center"
        >
          <span className="font-medium">{content.bold}</span>
          <span aria-hidden="true" className="mx-2 text-[var(--poppy)]">✿</span>
          <span className="hidden md:inline">{content.detail}</span>
        </Link>
        {!memberCallToAction && (
          <button
            onClick={dismiss}
            className="absolute right-4 md:right-6 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5 stroke-[1.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
