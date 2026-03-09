/**
 * Category-specific decorative SVG graphics for PDPs.
 * Each category has a unique editorial illustration style.
 */

interface CategoryGraphicProps {
  category: string;
  className?: string;
}

export const CategoryGraphic = ({ category, className = "" }: CategoryGraphicProps) => {
  const normalized = category?.toLowerCase() || "";

  // Earrings: elegant ear silhouette with earring
  if (normalized.includes("earring")) {
    return (
      <svg viewBox="0 0 120 160" className={`w-full h-auto ${className}`} fill="none">
        <defs>
          <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(36, 25%, 92%)" />
            <stop offset="100%" stopColor="hsl(36, 20%, 85%)" />
          </linearGradient>
        </defs>
        {/* Stylized ear curve */}
        <path
          d="M75 20 C95 25, 105 50, 100 80 C95 110, 75 130, 60 140"
          stroke="hsl(36, 15%, 70%)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M60 140 C55 135, 50 125, 55 115 C60 105, 75 100, 80 90"
          stroke="hsl(36, 15%, 70%)"
          strokeWidth="1"
          fill="none"
        />
        {/* Earring drop */}
        <circle cx="60" cy="85" r="3" fill="hsl(36, 15%, 55%)" />
        <line x1="60" y1="88" x2="60" y2="105" stroke="hsl(36, 15%, 55%)" strokeWidth="0.8" />
        <ellipse cx="60" cy="115" rx="8" ry="12" fill="url(#earGrad)" stroke="hsl(36, 15%, 65%)" strokeWidth="0.5" />
        {/* Sparkle */}
        <circle cx="62" cy="112" r="1.5" fill="hsl(36, 25%, 80%)" opacity="0.8" />
      </svg>
    );
  }

  // Necklaces: neck silhouette with pendant
  if (normalized.includes("necklace")) {
    return (
      <svg viewBox="0 0 140 120" className={`w-full h-auto ${className}`} fill="none">
        <defs>
          <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(36, 25%, 90%)" />
            <stop offset="100%" stopColor="hsl(36, 20%, 82%)" />
          </linearGradient>
        </defs>
        {/* Collarbone curve */}
        <path
          d="M15 45 Q35 25, 70 20 Q105 25, 125 45"
          stroke="hsl(36, 15%, 70%)"
          strokeWidth="1.2"
          fill="none"
        />
        {/* Necklace chain */}
        <path
          d="M25 50 Q45 65, 70 75 Q95 65, 115 50"
          stroke="hsl(36, 15%, 55%)"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="2 2"
        />
        {/* Pendant */}
        <path
          d="M70 75 L65 95 L70 105 L75 95 Z"
          fill="url(#neckGrad)"
          stroke="hsl(36, 15%, 60%)"
          strokeWidth="0.5"
        />
        <circle cx="70" cy="90" r="2" fill="hsl(36, 25%, 75%)" />
      </svg>
    );
  }

  // Rings: hand silhouette with ring
  if (normalized.includes("ring")) {
    return (
      <svg viewBox="0 0 100 140" className={`w-full h-auto ${className}`} fill="none">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(36, 25%, 85%)" />
            <stop offset="50%" stopColor="hsl(36, 30%, 92%)" />
            <stop offset="100%" stopColor="hsl(36, 25%, 85%)" />
          </linearGradient>
        </defs>
        {/* Finger outline */}
        <path
          d="M40 130 L40 50 Q40 35, 50 35 Q60 35, 60 50 L60 130"
          stroke="hsl(36, 15%, 70%)"
          strokeWidth="1"
          fill="none"
        />
        {/* Ring band */}
        <ellipse cx="50" cy="70" rx="12" ry="5" fill="none" stroke="url(#ringGrad)" strokeWidth="4" />
        {/* Stone */}
        <ellipse cx="50" cy="65" rx="5" ry="4" fill="hsl(36, 20%, 88%)" stroke="hsl(36, 15%, 70%)" strokeWidth="0.5" />
        <circle cx="50" cy="64" r="1.5" fill="hsl(36, 30%, 95%)" />
      </svg>
    );
  }

  // Bracelets: wrist with bracelet
  if (normalized.includes("bracelet")) {
    return (
      <svg viewBox="0 0 140 100" className={`w-full h-auto ${className}`} fill="none">
        <defs>
          <linearGradient id="braceletGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(36, 20%, 82%)" />
            <stop offset="50%" stopColor="hsl(36, 25%, 90%)" />
            <stop offset="100%" stopColor="hsl(36, 20%, 82%)" />
          </linearGradient>
        </defs>
        {/* Wrist outline */}
        <path
          d="M10 50 L130 50"
          stroke="hsl(36, 15%, 75%)"
          strokeWidth="1"
          fill="none"
        />
        <ellipse cx="70" cy="50" rx="45" ry="20" stroke="hsl(36, 15%, 70%)" strokeWidth="1" fill="none" />
        {/* Bracelet band */}
        <ellipse cx="70" cy="50" rx="38" ry="12" fill="none" stroke="url(#braceletGrad)" strokeWidth="6" />
        {/* Beads */}
        {[30, 50, 70, 90, 110].map((x, i) => (
          <circle key={i} cx={x} cy="50" r="4" fill="hsl(36, 20%, 85%)" stroke="hsl(36, 15%, 75%)" strokeWidth="0.5" />
        ))}
      </svg>
    );
  }

  // Sunglasses: face silhouette with glasses
  if (normalized.includes("sunglass") || normalized.includes("eyewear")) {
    return (
      <svg viewBox="0 0 160 100" className={`w-full h-auto ${className}`} fill="none">
        <defs>
          <linearGradient id="lensGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(220, 15%, 25%)" />
            <stop offset="100%" stopColor="hsl(220, 10%, 40%)" />
          </linearGradient>
        </defs>
        {/* Bridge */}
        <path d="M65 45 Q80 40, 95 45" stroke="hsl(36, 15%, 55%)" strokeWidth="1.5" fill="none" />
        {/* Left lens */}
        <ellipse cx="45" cy="50" rx="28" ry="22" fill="url(#lensGrad)" opacity="0.6" />
        <ellipse cx="45" cy="50" rx="28" ry="22" stroke="hsl(36, 15%, 55%)" strokeWidth="1.5" fill="none" />
        {/* Right lens */}
        <ellipse cx="115" cy="50" rx="28" ry="22" fill="url(#lensGrad)" opacity="0.6" />
        <ellipse cx="115" cy="50" rx="28" ry="22" stroke="hsl(36, 15%, 55%)" strokeWidth="1.5" fill="none" />
        {/* Temple arms */}
        <line x1="17" y1="45" x2="5" y2="40" stroke="hsl(36, 15%, 55%)" strokeWidth="1.5" />
        <line x1="143" y1="45" x2="155" y2="40" stroke="hsl(36, 15%, 55%)" strokeWidth="1.5" />
      </svg>
    );
  }

  // Hair: hair silhouette with accessory
  if (normalized.includes("hair") || normalized.includes("clip") || normalized.includes("pin")) {
    return (
      <svg viewBox="0 0 120 140" className={`w-full h-auto ${className}`} fill="none">
        <defs>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(30, 35%, 25%)" />
            <stop offset="100%" stopColor="hsl(30, 30%, 40%)" />
          </linearGradient>
        </defs>
        {/* Hair waves */}
        <path
          d="M30 20 Q20 40, 25 70 Q30 100, 40 120"
          stroke="url(#hairGrad)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M50 15 Q40 45, 45 80 Q50 110, 55 130"
          stroke="url(#hairGrad)"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M70 18 Q80 50, 75 85 Q70 115, 75 135"
          stroke="url(#hairGrad)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M90 25 Q100 55, 95 85 Q90 110, 85 125"
          stroke="url(#hairGrad)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Hair clip */}
        <rect x="42" y="55" width="30" height="8" rx="2" fill="hsl(36, 25%, 88%)" stroke="hsl(36, 15%, 70%)" strokeWidth="0.8" />
        <line x1="48" y1="57" x2="48" y2="61" stroke="hsl(36, 15%, 75%)" strokeWidth="0.5" />
        <line x1="57" y1="57" x2="57" y2="61" stroke="hsl(36, 15%, 75%)" strokeWidth="0.5" />
        <line x1="66" y1="57" x2="66" y2="61" stroke="hsl(36, 15%, 75%)" strokeWidth="0.5" />
      </svg>
    );
  }

  // Default: elegant diamond shape
  return (
    <svg viewBox="0 0 100 120" className={`w-full h-auto ${className}`} fill="none">
      <defs>
        <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(36, 25%, 95%)" />
          <stop offset="50%" stopColor="hsl(36, 20%, 88%)" />
          <stop offset="100%" stopColor="hsl(36, 25%, 82%)" />
        </linearGradient>
      </defs>
      <path
        d="M50 10 L85 40 L50 110 L15 40 Z"
        fill="url(#gemGrad)"
        stroke="hsl(36, 15%, 65%)"
        strokeWidth="1"
      />
      <path d="M50 10 L50 110" stroke="hsl(36, 15%, 75%)" strokeWidth="0.5" />
      <path d="M15 40 L85 40" stroke="hsl(36, 15%, 75%)" strokeWidth="0.5" />
      <path d="M50 10 L15 40 M50 10 L85 40" stroke="hsl(36, 15%, 75%)" strokeWidth="0.5" />
    </svg>
  );
};
