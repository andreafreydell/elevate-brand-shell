import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const STORAGE_KEY = "gea_promo_dismissed";

export const PromoBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-card border-b border-border relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-1.5 md:py-2.5 flex items-center justify-center">
        <Link
          to="/how-it-works"
          className="text-[10px] tracking-[0.2em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors text-center"
        >
          <span className="hidden md:inline"><span className="font-medium">Exclusive Access</span><span className="mx-2">·</span></span>
          Code <span className="font-medium">FOUNDING10</span> · $10 off first month
          <span className="hidden md:inline"><span className="mx-2">·</span>Learn about membership</span>
        </Link>
        <button
          onClick={dismiss}
          className="absolute right-4 md:right-6 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
};
