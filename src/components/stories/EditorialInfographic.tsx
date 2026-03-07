/**
 * Inline SVG infographics for The Edit / Stories cards.
 * Each variant matches the editorial card it belongs to.
 * Style: Editorial Minimalist — soft gradients, pastel fills, thin strokes, uppercase 7px labels.
 */

interface EditorialInfographicProps {
  variant: "style-guide" | "material-compare" | "first-ritual" | "occasion-guide" | "monthly-drop" | "community";
}

export const EditorialInfographic = ({ variant }: EditorialInfographicProps) => {
  switch (variant) {
    case "style-guide":
      return <StyleGuideGraphic />;
    case "material-compare":
      return <MaterialCompareGraphic />;
    case "first-ritual":
      return <FirstRitualGraphic />;
    case "occasion-guide":
      return <OccasionGuideGraphic />;
    case "monthly-drop":
      return <MonthlyDropGraphic />;
    case "community":
      return <CommunityGraphic />;
  }
};

/* ─── 1. Style Guide: Desk → Dinner → Weekend transition ─── */
const StyleGuideGraphic = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Style guide: desk to dinner to weekend">
    <defs>
      <linearGradient id="sg-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(38,28%,92%)" />
        <stop offset="100%" stopColor="hsl(34,18%,85%)" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sg-bg)" />

    {/* Three phase circles */}
    <circle cx="100" cy="130" r="44" fill="hsl(33,14%,80%)" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />
    <circle cx="200" cy="130" r="44" fill="#BFD6CF" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />
    <circle cx="300" cy="130" r="44" fill="#E7B9A8" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />

    {/* Icons inside circles — simplified jewelry silhouettes */}
    {/* Desk: stud earring */}
    <circle cx="100" cy="124" r="8" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />
    <line x1="100" y1="132" x2="100" y2="142" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />

    {/* Dinner: pendant necklace */}
    <path d="M185 118 Q200 140 215 118" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />
    <circle cx="200" cy="140" r="5" fill="hsl(30,12%,22%)" />

    {/* Weekend: bracelet */}
    <ellipse cx="300" cy="128" rx="16" ry="12" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />
    <circle cx="300" cy="116" r="3" fill="hsl(30,12%,22%)" />

    {/* Connecting arrows */}
    <line x1="148" y1="130" x2="152" y2="130" stroke="hsl(30,16%,36%)" strokeWidth="0.8" strokeDasharray="2 2" />
    <line x1="248" y1="130" x2="252" y2="130" stroke="hsl(30,16%,36%)" strokeWidth="0.8" strokeDasharray="2 2" />
    <polygon points="154,127 160,130 154,133" fill="hsl(30,16%,36%)" />
    <polygon points="254,127 260,130 254,133" fill="hsl(30,16%,36%)" />

    {/* Labels */}
    <text x="100" y="195" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.12em" fill="hsl(30,12%,22%)" textTransform="uppercase">DESK</text>
    <text x="200" y="195" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.12em" fill="hsl(30,12%,22%)">DINNER</text>
    <text x="300" y="195" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.12em" fill="hsl(30,12%,22%)">WEEKEND</text>

    {/* Subtitle */}
    <text x="200" y="235" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.2em" fill="hsl(30,8%,46%)">ONE SELECTION · THREE MOMENTS</text>

    {/* Tag Red stamp */}
    <rect x="370" y="12" width="18" height="18" fill="#C54A3D" />
  </svg>
);

/* ─── 2. Material Compare: Moissanite vs Diamond ─── */
const MaterialCompareGraphic = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Moissanite versus diamond comparison">
    <defs>
      <linearGradient id="mc-bg" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="hsl(34,18%,85%)" />
        <stop offset="100%" stopColor="hsl(38,28%,92%)" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#mc-bg)" />

    {/* VS divider */}
    <line x1="200" y1="50" x2="200" y2="250" stroke="hsl(32,12%,62%)" strokeWidth="0.5" strokeDasharray="4 3" />
    <text x="200" y="46" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.15em" fill="hsl(30,8%,46%)">VS</text>

    {/* Left: Moissanite */}
    <text x="100" y="75" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.15em" fill="hsl(30,12%,22%)">MOISSANITE</text>

    {/* Gem shape — hexagonal */}
    <polygon points="100,100 125,115 125,145 100,160 75,145 75,115" fill="#BFD6CF" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />
    <line x1="100" y1="100" x2="100" y2="160" stroke="hsl(30,16%,36%)" strokeWidth="0.5" opacity="0.5" />
    <line x1="75" y1="115" x2="125" y2="145" stroke="hsl(30,16%,36%)" strokeWidth="0.5" opacity="0.5" />
    <line x1="125" y1="115" x2="75" y2="145" stroke="hsl(30,16%,36%)" strokeWidth="0.5" opacity="0.5" />

    {/* Stats bars */}
    <text x="55" y="185" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">BRILLIANCE</text>
    <rect x="55" y="190" width="90" height="6" fill="#BFD6CF" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="55" y="210" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">ETHICS</text>
    <rect x="55" y="215" width="90" height="6" fill="#BFD6CF" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="55" y="235" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">VALUE</text>
    <rect x="55" y="240" width="90" height="6" fill="#BFD6CF" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />

    {/* Right: Diamond */}
    <text x="300" y="75" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.15em" fill="hsl(30,12%,22%)">DIAMOND</text>

    {/* Diamond shape */}
    <polygon points="300,100 325,130 300,160 275,130" fill="hsl(33,14%,80%)" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />
    <line x1="275" y1="130" x2="325" y2="130" stroke="hsl(30,16%,36%)" strokeWidth="0.5" opacity="0.5" />
    <line x1="300" y1="100" x2="285" y2="130" stroke="hsl(30,16%,36%)" strokeWidth="0.5" opacity="0.5" />
    <line x1="300" y1="100" x2="315" y2="130" stroke="hsl(30,16%,36%)" strokeWidth="0.5" opacity="0.5" />

    {/* Stats bars — shorter */}
    <text x="255" y="185" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">BRILLIANCE</text>
    <rect x="255" y="190" width="72" height="6" fill="hsl(33,14%,80%)" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="255" y="210" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">ETHICS</text>
    <rect x="255" y="215" width="35" height="6" fill="hsl(33,14%,80%)" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="255" y="235" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">VALUE</text>
    <rect x="255" y="240" width="50" height="6" fill="hsl(33,14%,80%)" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />

    {/* Tag Red stamp */}
    <rect x="370" y="12" width="18" height="18" fill="#C54A3D" />
  </svg>
);

/* ─── 3. First Ritual: Unbox → Style → Photograph ─── */
const FirstRitualGraphic = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Your first access ritual steps">
    <defs>
      <linearGradient id="fr-bg" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(38,28%,92%)" />
        <stop offset="100%" stopColor="hsl(34,18%,87%)" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#fr-bg)" />

    {/* Step numbers — large script style */}
    {/* Step 1: Unbox */}
    <text x="80" y="72" fontSize="32" fontFamily="Caveat, cursive" fontWeight="600" fill="hsl(30,16%,36%)" opacity="0.25">01</text>
    <rect x="55" y="82" width="50" height="50" rx="0" fill="none" stroke="hsl(30,16%,36%)" strokeWidth="1" />
    <rect x="62" y="89" width="36" height="36" rx="0" fill="#BFD3E6" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    {/* Open box flaps */}
    <line x1="62" y1="89" x2="55" y2="82" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />
    <line x1="98" y1="89" x2="105" y2="82" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />
    <text x="80" y="155" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.12em" fill="hsl(30,12%,22%)">UNBOX</text>

    {/* Arrow */}
    <line x1="125" y1="107" x2="155" y2="107" stroke="hsl(30,16%,36%)" strokeWidth="0.8" strokeDasharray="3 2" />
    <polygon points="155,104 162,107 155,110" fill="hsl(30,16%,36%)" />

    {/* Step 2: Style */}
    <text x="200" y="72" fontSize="32" fontFamily="Caveat, cursive" fontWeight="600" fill="hsl(30,16%,36%)" opacity="0.25">02</text>
    {/* Mirror / vanity icon */}
    <ellipse cx="200" cy="102" rx="22" ry="28" fill="none" stroke="hsl(30,16%,36%)" strokeWidth="1" />
    <ellipse cx="200" cy="102" rx="18" ry="24" fill="#E7B9A8" opacity="0.5" />
    <line x1="200" y1="130" x2="200" y2="140" stroke="hsl(30,16%,36%)" strokeWidth="1.2" />
    <line x1="188" y1="140" x2="212" y2="140" stroke="hsl(30,16%,36%)" strokeWidth="1" />
    <text x="200" y="155" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.12em" fill="hsl(30,12%,22%)">STYLE</text>

    {/* Arrow */}
    <line x1="245" y1="107" x2="275" y2="107" stroke="hsl(30,16%,36%)" strokeWidth="0.8" strokeDasharray="3 2" />
    <polygon points="275,104 282,107 275,110" fill="hsl(30,16%,36%)" />

    {/* Step 3: Share */}
    <text x="320" y="72" fontSize="32" fontFamily="Caveat, cursive" fontWeight="600" fill="hsl(30,16%,36%)" opacity="0.25">03</text>
    {/* Camera icon */}
    <rect x="295" y="90" width="50" height="35" fill="none" stroke="hsl(30,16%,36%)" strokeWidth="1" />
    <rect x="295" y="90" width="50" height="35" fill="#BFD6CF" opacity="0.4" />
    <circle cx="320" cy="107" r="10" fill="none" stroke="hsl(30,16%,36%)" strokeWidth="1" />
    <circle cx="320" cy="107" r="4" fill="hsl(30,16%,36%)" />
    <rect x="308" y="86" width="24" height="6" fill="none" stroke="hsl(30,16%,36%)" strokeWidth="0.8" />
    <text x="320" y="155" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.12em" fill="hsl(30,12%,22%)">SHARE</text>

    {/* Bottom label */}
    <text x="200" y="195" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.2em" fill="hsl(30,8%,46%)">YOUR FIRST GEA EXPERIENCE</text>

    {/* Dotted timeline */}
    <line x1="60" y1="215" x2="340" y2="215" stroke="hsl(32,12%,62%)" strokeWidth="0.5" strokeDasharray="2 3" />
    <circle cx="80" cy="215" r="3" fill="#BFD3E6" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <circle cx="200" cy="215" r="3" fill="#E7B9A8" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <circle cx="320" cy="215" r="3" fill="#BFD6CF" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />

    {/* Tag Red stamp */}
    <rect x="370" y="12" width="18" height="18" fill="#C54A3D" />
  </svg>
);

/* ─── 4. Occasion Guide: Calendar matching ─── */
const OccasionGuideGraphic = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Occasion dressing guide">
    <defs>
      <linearGradient id="og-bg" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="hsl(34,18%,87%)" />
        <stop offset="100%" stopColor="hsl(38,28%,92%)" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#og-bg)" />

    {/* 4 occasion columns */}
    {/* Gala */}
    <rect x="30" y="60" width="70" height="160" fill="hsl(33,14%,80%)" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="65" y="82" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em" fill="hsl(30,12%,22%)">GALA</text>
    {/* Chandelier earring icon */}
    <line x1="65" y1="100" x2="65" y2="108" stroke="hsl(30,12%,22%)" strokeWidth="1" />
    <line x1="55" y1="108" x2="75" y2="108" stroke="hsl(30,12%,22%)" strokeWidth="0.8" />
    <circle cx="55" cy="116" r="4" fill="#E7B9A8" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <circle cx="65" cy="120" r="5" fill="#E7B9A8" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <circle cx="75" cy="116" r="4" fill="#E7B9A8" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="65" y="155" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Statement</text>
    <text x="65" y="165" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Earrings</text>

    {/* Meeting */}
    <rect x="115" y="60" width="70" height="160" fill="#BFD6CF" opacity="0.4" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="150" y="82" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em" fill="hsl(30,12%,22%)">MEETING</text>
    {/* Thin cuff icon */}
    <ellipse cx="150" cy="115" rx="18" ry="8" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />
    <ellipse cx="150" cy="118" rx="16" ry="6" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="0.5" />
    <text x="150" y="155" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Minimal</text>
    <text x="150" y="165" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Cuff</text>

    {/* Brunch */}
    <rect x="200" y="60" width="70" height="160" fill="#BFD3E6" opacity="0.35" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="235" y="82" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em" fill="hsl(30,12%,22%)">BRUNCH</text>
    {/* Chain necklace icon */}
    <path d="M222 105 Q235 125 248 105" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />
    <circle cx="235" cy="124" r="3" fill="hsl(30,12%,22%)" />
    <text x="235" y="155" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Layered</text>
    <text x="235" y="165" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Chains</text>

    {/* Everyday */}
    <rect x="285" y="60" width="70" height="160" fill="#E7B9A8" opacity="0.3" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="320" y="82" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em" fill="hsl(30,12%,22%)">EVERYDAY</text>
    {/* Stacking rings */}
    <circle cx="320" cy="110" r="10" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1" />
    <circle cx="320" cy="116" r="10" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="0.8" />
    <circle cx="320" cy="122" r="10" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="0.6" />
    <text x="320" y="155" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Stacking</text>
    <text x="320" y="165" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fill="hsl(30,8%,46%)" letterSpacing="0.08em">Rings</text>

    {/* Bottom label */}
    <text x="200" y="248" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.2em" fill="hsl(30,8%,46%)">MATCH YOUR SELECTION TO YOUR CALENDAR</text>

    {/* Tag Red stamp */}
    <rect x="370" y="12" width="18" height="18" fill="#C54A3D" />
  </svg>
);

/* ─── 5. Monthly Drop: Vault entries ─── */
const MonthlyDropGraphic = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Monthly drop — new vault entries">
    <defs>
      <linearGradient id="md-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(38,28%,92%)" />
        <stop offset="100%" stopColor="hsl(34,18%,85%)" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#md-bg)" />

    <text x="200" y="50" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.15em" fill="hsl(30,12%,22%)">THIS MONTH'S VAULT</text>

    {/* Grid of 6 piece silhouettes */}
    {/* Row 1 */}
    <rect x="55" y="70" width="80" height="80" fill="hsl(33,14%,80%)" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="95" y="90" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">NEW</text>
    {/* Ring */}
    <circle cx="95" cy="118" r="14" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />
    <circle cx="95" cy="108" r="4" fill="#BFD6CF" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />

    <rect x="155" y="70" width="80" height="80" fill="#BFD6CF" opacity="0.35" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="195" y="90" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">NEW</text>
    {/* Earring */}
    <line x1="195" y1="100" x2="195" y2="110" stroke="hsl(30,12%,22%)" strokeWidth="1" />
    <circle cx="195" cy="120" r="8" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1" />
    <circle cx="195" cy="120" r="3" fill="#E7B9A8" />

    <rect x="255" y="70" width="80" height="80" fill="#E7B9A8" opacity="0.25" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="295" y="90" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">NEW</text>
    {/* Necklace */}
    <path d="M280 100 Q295 125 310 100" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.2" />
    <circle cx="295" cy="124" r="5" fill="#BFD3E6" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />

    {/* Row 2 */}
    <rect x="55" y="165" width="80" height="80" fill="#BFD3E6" opacity="0.3" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="95" y="185" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">NEW</text>
    {/* Bracelet */}
    <ellipse cx="95" cy="215" rx="18" ry="10" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1" />

    <rect x="155" y="165" width="80" height="80" fill="hsl(33,14%,80%)" opacity="0.6" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="195" y="185" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">NEW</text>
    {/* Cuff */}
    <path d="M182 205 Q195 225 208 205" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1.5" />
    <path d="M184 208 Q195 226 206 208" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="0.8" />

    <rect x="255" y="165" width="80" height="80" fill="#BFD6CF" opacity="0.25" stroke="hsl(30,16%,36%)" strokeWidth="0.5" />
    <text x="295" y="185" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500" letterSpacing="0.1em" fill="hsl(30,8%,46%)">NEW</text>
    {/* Pendant */}
    <line x1="295" y1="198" x2="295" y2="218" stroke="hsl(30,12%,22%)" strokeWidth="0.8" />
    <polygon points="295,218 288,230 302,230" fill="none" stroke="hsl(30,12%,22%)" strokeWidth="1" />

    {/* Bottom */}
    <text x="200" y="272" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.2em" fill="hsl(30,8%,46%)">6 NEW PIECES · FIRST ACCESS</text>

    {/* Tag Red stamp */}
    <rect x="370" y="12" width="18" height="18" fill="#C54A3D" />
  </svg>
);

/* ─── 6. Community: Transformation metric ─── */
const CommunityGraphic = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Community member transformation stories">
    <defs>
      <linearGradient id="co-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(34,18%,87%)" />
        <stop offset="100%" stopColor="hsl(38,28%,92%)" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#co-bg)" />

    <text x="200" y="50" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.15em" fill="hsl(30,12%,22%)">MEMBER TRANSFORMATIONS</text>

    {/* Large stat */}
    <text x="200" y="115" textAnchor="middle" fontSize="52" fontFamily="Caveat, cursive" fontWeight="600" fill="hsl(30,16%,36%)">92%</text>
    <text x="200" y="140" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.15em" fill="hsl(30,8%,46%)">REPLACED THEIR JEWELRY DRAWER</text>

    {/* Divider */}
    <line x1="120" y1="158" x2="280" y2="158" stroke="hsl(32,12%,62%)" strokeWidth="0.5" />

    {/* Three mini metrics */}
    <text x="105" y="185" textAnchor="middle" fontSize="24" fontFamily="Caveat, cursive" fontWeight="600" fill="#B79B63">4.8</text>
    <text x="105" y="200" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.1em" fill="hsl(30,8%,46%)">AVG RATING</text>

    <text x="200" y="185" textAnchor="middle" fontSize="24" fontFamily="Caveat, cursive" fontWeight="600" fill="#B79B63">3×</text>
    <text x="200" y="200" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.1em" fill="hsl(30,8%,46%)">MORE WORN</text>

    <text x="295" y="185" textAnchor="middle" fontSize="24" fontFamily="Caveat, cursive" fontWeight="600" fill="#B79B63">$0</text>
    <text x="295" y="200" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="400" letterSpacing="0.1em" fill="hsl(30,8%,46%)">WASTED</text>

    {/* Quote marks */}
    <text x="120" y="240" fontSize="18" fontFamily="Playfair Display, serif" fontStyle="italic" fill="hsl(30,16%,36%)" opacity="0.3">"</text>
    <text x="200" y="247" textAnchor="middle" fontSize="8" fontFamily="Playfair Display, serif" fontStyle="italic" fill="hsl(30,16%,36%)">Access changed everything.</text>
    <text x="275" y="240" fontSize="18" fontFamily="Playfair Display, serif" fontStyle="italic" fill="hsl(30,16%,36%)" opacity="0.3">"</text>

    {/* Tag Red stamp */}
    <rect x="370" y="12" width="18" height="18" fill="#C54A3D" />
  </svg>
);
