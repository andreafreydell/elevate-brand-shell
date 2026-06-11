/**
 * SwayingStems — Digital Garden companion system
 * Fixed, gently swaying flower stems along the viewport edges.
 * Decorative only (aria-hidden, pointer-events: none).
 * Density: "full" (8 stems, desktop) | "light" (2 stems, subtle).
 */
export const SwayingStems = ({ density = "full" }: { density?: "full" | "light" }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <style>{`
        @keyframes gea-sway {
          0%, 100% { transform: rotate(-2.4deg); }
          50% { transform: rotate(2.8deg); }
        }
        .gea-stem {
          position: absolute;
          bottom: -20px;
          transform-origin: bottom center;
          animation: gea-sway 7s ease-in-out infinite;
          opacity: 0.5;
        }
        @media (max-width: 900px) {
          .gea-stem { opacity: 0.28; }
          .gea-stem[data-mobile-hide="true"] { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gea-stem { animation: none; }
        }
      `}</style>

      {/* Poppy — left */}
      <div className="gea-stem" style={{ left: "1.5%", height: "44vh", animationDuration: "8s" }}>
        <svg viewBox="0 0 60 400" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
          <path d="M30 400 C 28 300, 34 220, 30 120" stroke="var(--meadow)" strokeWidth="2.5" fill="none" />
          <path d="M30 260 C 18 250, 10 252, 4 262 C 14 268, 24 266, 30 260" fill="var(--meadow-soft)" />
          <path d="M30 190 C 42 182, 50 184, 56 194 C 46 200, 36 197, 30 190" fill="var(--meadow-soft)" />
          <g transform="translate(30 110)">
            <circle r="7" fill="var(--honey)" />
            <ellipse cx="0" cy="-16" rx="9" ry="13" fill="var(--poppy)" />
            <ellipse cx="15" cy="-5" rx="9" ry="13" fill="var(--poppy)" transform="rotate(72)" opacity="0.85" />
            <ellipse cx="9" cy="13" rx="9" ry="13" fill="var(--poppy)" transform="rotate(144)" />
            <ellipse cx="-9" cy="13" rx="9" ry="13" fill="var(--rose)" transform="rotate(216)" />
            <ellipse cx="-15" cy="-5" rx="9" ry="13" fill="var(--poppy)" transform="rotate(288)" opacity="0.85" />
          </g>
        </svg>
      </div>

      {/* Rose poppy — right */}
      <div className="gea-stem" style={{ right: "2%", height: "50vh", animationDuration: "9s", animationDelay: "-1s" }}>
        <svg viewBox="0 0 60 420" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
          <path d="M30 420 C 33 320, 26 230, 30 120" stroke="var(--meadow)" strokeWidth="2.5" fill="none" />
          <path d="M30 290 C 40 282, 49 284, 56 293 C 46 300, 36 297, 30 290" fill="var(--meadow-soft)" />
          <path d="M30 210 C 20 202, 11 204, 4 213 C 14 220, 24 217, 30 210" fill="var(--meadow-soft)" />
          <g transform="translate(30 110)">
            <circle r="7" fill="var(--honey)" />
            <ellipse cx="0" cy="-15" rx="8" ry="12" fill="var(--rose)" />
            <ellipse cx="14" cy="-5" rx="8" ry="12" fill="var(--rose-soft)" transform="rotate(72)" />
            <ellipse cx="9" cy="12" rx="8" ry="12" fill="var(--rose)" transform="rotate(144)" />
            <ellipse cx="-9" cy="12" rx="8" ry="12" fill="var(--poppy)" transform="rotate(216)" opacity="0.8" />
            <ellipse cx="-14" cy="-5" rx="8" ry="12" fill="var(--rose-soft)" transform="rotate(288)" />
          </g>
        </svg>
      </div>

      {density === "full" && (
        <>
          {/* Periwinkle — left inner */}
          <div className="gea-stem" data-mobile-hide="true" style={{ left: "5%", height: "29vh", animationDuration: "6.5s", animationDelay: "-2s" }}>
            <svg viewBox="0 0 50 300" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
              <path d="M25 300 C 23 220, 28 160, 25 80" stroke="var(--meadow)" strokeWidth="2" fill="none" />
              <path d="M25 190 C 33 184, 40 186, 45 193 C 37 198, 30 195, 25 190" fill="var(--meadow-soft)" />
              <g transform="translate(25 72)">
                <circle r="5" fill="var(--honey)" />
                <ellipse cx="0" cy="-11" rx="6" ry="9" fill="var(--peri)" />
                <ellipse cx="10" cy="-3" rx="6" ry="9" fill="var(--peri-soft)" transform="rotate(72)" />
                <ellipse cx="6" cy="9" rx="6" ry="9" fill="var(--peri)" transform="rotate(144)" />
                <ellipse cx="-6" cy="9" rx="6" ry="9" fill="var(--peri-soft)" transform="rotate(216)" />
                <ellipse cx="-10" cy="-3" rx="6" ry="9" fill="var(--peri)" transform="rotate(288)" />
              </g>
            </svg>
          </div>

          {/* Daisy — right inner */}
          <div className="gea-stem" data-mobile-hide="true" style={{ right: "6.5%", height: "33vh", animationDuration: "7s", animationDelay: "-3.5s" }}>
            <svg viewBox="0 0 50 300" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
              <path d="M25 300 C 27 230, 22 170, 25 90" stroke="var(--meadow)" strokeWidth="2" fill="none" />
              <g transform="translate(25 82)">
                <circle r="5" fill="var(--honey)" />
                <circle cx="0" cy="-10" r="5.5" fill="#faf4e8" />
                <circle cx="9.5" cy="-3" r="5.5" fill="#faf4e8" />
                <circle cx="6" cy="8.5" r="5.5" fill="#faf4e8" />
                <circle cx="-6" cy="8.5" r="5.5" fill="#faf4e8" />
                <circle cx="-9.5" cy="-3" r="5.5" fill="#faf4e8" />
              </g>
            </svg>
          </div>

          {/* Small daisy — left far */}
          <div className="gea-stem" data-mobile-hide="true" style={{ left: "11%", height: "21vh", animationDuration: "5.8s", animationDelay: "-1.4s", opacity: 0.38 }}>
            <svg viewBox="0 0 40 220" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
              <path d="M20 220 C 18 160, 23 110, 20 60" stroke="var(--meadow-soft)" strokeWidth="1.8" fill="none" />
              <g transform="translate(20 54)">
                <circle r="4" fill="var(--honey)" />
                <circle cx="0" cy="-8" r="4.5" fill="#faf4e8" />
                <circle cx="7.5" cy="-2.5" r="4.5" fill="#faf4e8" />
                <circle cx="4.7" cy="6.5" r="4.5" fill="#faf4e8" />
                <circle cx="-4.7" cy="6.5" r="4.5" fill="#faf4e8" />
                <circle cx="-7.5" cy="-2.5" r="4.5" fill="#faf4e8" />
              </g>
            </svg>
          </div>

          {/* Small periwinkle — right far */}
          <div className="gea-stem" data-mobile-hide="true" style={{ right: "11%", height: "23vh", animationDuration: "6.2s", animationDelay: "-4s", opacity: 0.38 }}>
            <svg viewBox="0 0 40 240" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
              <path d="M20 240 C 22 180, 17 120, 20 60" stroke="var(--meadow-soft)" strokeWidth="1.8" fill="none" />
              <g transform="translate(20 52)">
                <circle r="4.5" fill="var(--honey)" />
                <ellipse cx="0" cy="-9" rx="5" ry="7.5" fill="var(--peri)" />
                <ellipse cx="8.5" cy="-2.8" rx="5" ry="7.5" fill="var(--peri-soft)" transform="rotate(72)" />
                <ellipse cx="5.3" cy="7.3" rx="5" ry="7.5" fill="var(--peri)" transform="rotate(144)" />
                <ellipse cx="-5.3" cy="7.3" rx="5" ry="7.5" fill="var(--peri-soft)" transform="rotate(216)" />
                <ellipse cx="-8.5" cy="-2.8" rx="5" ry="7.5" fill="var(--peri)" transform="rotate(288)" />
              </g>
            </svg>
          </div>
          {/* Lavender spike — left mid (notebook variety) */}
          <div className="gea-stem" data-mobile-hide="true" style={{ left: "8%", height: "26vh", animationDuration: "7.4s", animationDelay: "-2.8s", opacity: 0.42 }}>
            <svg viewBox="0 0 40 260" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
              <path d="M20 260 C 18 190, 23 130, 20 50" stroke="var(--meadow)" strokeWidth="2" fill="none" />
              <path d="M20 200 C 12 194, 6 196, 2 203 C 10 208, 16 205, 20 200" fill="var(--meadow-soft)" />
              <ellipse cx="20" cy="44" rx="5" ry="7" fill="var(--peri)" />
              <ellipse cx="14" cy="58" rx="4.5" ry="6.5" fill="var(--peri-soft)" />
              <ellipse cx="26" cy="60" rx="4.5" ry="6.5" fill="var(--peri)" />
              <ellipse cx="16" cy="76" rx="4" ry="6" fill="var(--peri)" />
              <ellipse cx="25" cy="80" rx="4" ry="6" fill="var(--peri-soft)" />
              <ellipse cx="19" cy="94" rx="3.5" ry="5.5" fill="var(--peri)" />
            </svg>
          </div>

          {/* Seedhead — right mid (notebook variety) */}
          <div className="gea-stem" data-mobile-hide="true" style={{ right: "9%", height: "27vh", animationDuration: "8.4s", animationDelay: "-5s", opacity: 0.4 }}>
            <svg viewBox="0 0 50 270" xmlns="http://www.w3.org/2000/svg" style={{ height: "100%", width: "auto", display: "block" }}>
              <path d="M25 270 C 27 200, 22 140, 25 70" stroke="var(--meadow)" strokeWidth="2" fill="none" />
              <g transform="translate(25 60)">
                <circle r="6" fill="var(--honey)" />
                <g stroke="var(--rose)" strokeWidth="1.4" opacity="0.9">
                  <line x1="0" y1="0" x2="0" y2="-17" /><line x1="0" y1="0" x2="12" y2="-12" />
                  <line x1="0" y1="0" x2="17" y2="0" /><line x1="0" y1="0" x2="12" y2="12" />
                  <line x1="0" y1="0" x2="0" y2="17" /><line x1="0" y1="0" x2="-12" y2="12" />
                  <line x1="0" y1="0" x2="-17" y2="0" /><line x1="0" y1="0" x2="-12" y2="-12" />
                </g>
                <circle cx="0" cy="-17" r="2.4" fill="var(--rose-soft)" /><circle cx="12" cy="-12" r="2.4" fill="var(--rose)" />
                <circle cx="17" cy="0" r="2.4" fill="var(--rose-soft)" /><circle cx="12" cy="12" r="2.4" fill="var(--rose)" />
                <circle cx="0" cy="17" r="2.4" fill="var(--rose-soft)" /><circle cx="-12" cy="12" r="2.4" fill="var(--rose)" />
                <circle cx="-17" cy="0" r="2.4" fill="var(--rose-soft)" /><circle cx="-12" cy="-12" r="2.4" fill="var(--rose)" />
              </g>
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
