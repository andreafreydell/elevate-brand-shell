/**
 * StackingTip — Digital Garden companion system
 * A "pro tip" stacking note at the top of each category page, in the
 * Next Chapter dialect: dashed poppy frame, hand-drawn SVG, script accents.
 * Drives stacking (multi-piece) styling, savoring, and creative confidence.
 */

const tips: Record<
  string,
  { sticker: string; title: string; body: string; caption: string; svg: JSX.Element }
> = {
  Earrings: {
    sticker: "pro tip ✿",
    title: "Let gravity be your stylist.",
    body: "The pro rule: weight sinks, sparkle rises. Your drop or heaviest piece anchors the first lobe, a dainty stud sits just above it, and a whisper-thin huggie or cuff hugs the upper ear. Three pieces descending in weight — and the second ear can whisper while the first one sings.",
    caption: "drop low, stud mid, hug high ✿",
    svg: (
      <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="220" height="160" fill="var(--sand-svg, #ece0ca)" />
        <path d="M128 28 C 152 34, 158 64, 144 86 C 136 99, 124 106, 118 118" stroke="#4a3b2c" strokeWidth="2" fill="none" opacity="0.45" />
        <circle cx="142" cy="52" r="5" fill="none" stroke="var(--honey)" strokeWidth="2.5" />
        <circle cx="132" cy="92" r="3.5" fill="var(--peri)" />
        <circle cx="116" cy="120" r="3" fill="var(--honey)" />
        <path d="M116 124 C 116 132, 114 138, 112 144" stroke="var(--honey)" strokeWidth="1.5" fill="none" />
        <ellipse cx="111" cy="149" rx="5" ry="7" fill="var(--poppy)" />
        <path d="M40 36 l 3 6 l 7 1 l -5 5 l 1 7 l -6 -3 l -6 3 l 1 -7 l -5 -5 l 7 -1 z" fill="var(--rose-soft)" />
      </svg>
    ),
  },
  Necklace: {
    sticker: "pro tip ✿",
    title: "Three lengths, two inches apart.",
    body: "The pro formula: a snug chain at the collar, a beaded strand at mid-chest, a pendant just below — each about two inches from the last so nothing tangles and every layer gets seen. Mix one color into the gold and the whole stack comes alive.",
    caption: "choker, mid, long ✿",
    svg: (
      <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="220" height="160" fill="var(--sand-svg, #ece0ca)" />
        <path d="M62 30 C 80 56, 140 56, 158 30" stroke="var(--honey)" strokeWidth="2" fill="none" />
        <path d="M54 34 C 78 78, 142 78, 166 34" stroke="var(--poppy)" strokeWidth="2" fill="none" strokeDasharray="1 5" strokeLinecap="round" />
        <circle cx="78" cy="62" r="3.5" fill="var(--poppy)" />
        <circle cx="98" cy="70" r="3.5" fill="var(--peri)" />
        <circle cx="122" cy="70" r="3.5" fill="var(--meadow-soft)" />
        <circle cx="142" cy="62" r="3.5" fill="var(--rose)" />
        <path d="M48 38 C 76 102, 144 102, 172 38" stroke="var(--honey)" strokeWidth="1.5" fill="none" />
        <ellipse cx="110" cy="100" rx="7" ry="9" fill="var(--rose-soft)" stroke="var(--poppy)" strokeWidth="1.5" />
      </svg>
    ),
  },
  Ring: {
    sticker: "pro tip ✿",
    title: "Odd numbers, never symmetry.",
    body: "Three rings or five across both hands — never even, never mirrored. Anchor one statement at a middle finger, scatter dainty bands around it, and leave one finger bare on purpose. Bonus move: thread a spare ring onto your necklace chain and let it live there.",
    caption: "3 or 5, one bare finger ✿",
    svg: (
      <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="220" height="160" fill="var(--sand-svg, #ece0ca)" />
        <line x1="30" y1="110" x2="190" y2="110" stroke="#4a3b2c" strokeWidth="1.5" opacity="0.35" />
        <circle cx="56" cy="92" r="8" fill="none" stroke="var(--honey)" strokeWidth="3" />
        <circle cx="88" cy="86" r="12" fill="none" stroke="var(--poppy)" strokeWidth="4" />
        <circle cx="88" cy="72" r="3" fill="var(--peri)" />
        <circle cx="124" cy="92" r="7" fill="none" stroke="var(--meadow)" strokeWidth="2.5" />
        <circle cx="156" cy="90" r="8.5" fill="none" stroke="var(--rose)" strokeWidth="3" />
        <path d="M180 44 q 4 -8 8 0 q -4 8 -8 0" fill="var(--rose-soft)" />
      </svg>
    ),
  },
  Bracelet: {
    sticker: "pro tip ✿",
    title: "Plant a wrist garden.",
    body: "One slim chain, one colorful bead strand, one structured cuff — texture is the trick, not quantity. Let one color repeat somewhere (a coral bead, a coral charm) so the mix reads intentional. And yes, your watch counts as a bracelet; style around it, not against it.",
    caption: "chain + beads + cuff ✿",
    svg: (
      <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="220" height="160" fill="var(--sand-svg, #ece0ca)" />
        <path d="M50 52 C 90 42, 130 42, 170 52" stroke="var(--honey)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        <path d="M48 78 C 90 66, 130 66, 172 78" stroke="var(--poppy)" strokeWidth="2" fill="none" />
        <circle cx="78" cy="70" r="4" fill="var(--poppy)" />
        <circle cx="102" cy="67" r="4" fill="var(--peri)" />
        <circle cx="126" cy="67" r="4" fill="var(--honey)" />
        <circle cx="148" cy="71" r="4" fill="var(--rose)" />
        <path d="M50 104 C 90 92, 130 92, 170 104 L 168 116 C 130 104, 90 104, 52 116 Z" fill="var(--meadow-soft)" opacity="0.85" />
        <path d="M30 30 q 5 -9 10 0" stroke="var(--rose)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  Sunglasses: {
    sticker: "pro tip ✿",
    title: "Sunglasses are jewelry for your face.",
    body: "Echo the frame in your stack: round lenses love a small hoop, sharp cat-eyes love a clean drop. Then the golden-hour move — push them up into your hair and your earrings step into the spotlight. One gesture, two looks, zero effort.",
    caption: "echo the curve ✿",
    svg: (
      <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="220" height="160" fill="var(--sand-svg, #ece0ca)" />
        <circle cx="82" cy="74" r="22" fill="none" stroke="var(--poppy)" strokeWidth="3" />
        <circle cx="138" cy="74" r="22" fill="none" stroke="var(--poppy)" strokeWidth="3" />
        <path d="M104 72 C 108 66, 112 66, 116 72" stroke="var(--poppy)" strokeWidth="2.5" fill="none" />
        <path d="M60 70 L 44 62" stroke="var(--poppy)" strokeWidth="2.5" />
        <path d="M160 70 L 176 62" stroke="var(--poppy)" strokeWidth="2.5" />
        <circle cx="46" cy="112" r="5" fill="none" stroke="var(--honey)" strokeWidth="2.5" />
        <circle cx="174" cy="112" r="5" fill="none" stroke="var(--honey)" strokeWidth="2.5" />
        <path d="M186 30 l 3 6 l 7 1 l -5 5 l 1 7 l -6 -3 l -6 3 l 1 -7 l -5 -5 l 7 -1 z" fill="var(--peri-soft)" />
      </svg>
    ),
  },
  Hair: {
    sticker: "pro tip ✿",
    title: "Pins travel in threes.",
    body: "Cluster three small pins on one side like a charm story — staggered, never in a row — and let a claw clip do the structural work behind them. Match one pin's metal to your necklace and the whole look ties itself together with a bow.",
    caption: "three pins, one side ✿",
    svg: (
      <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="220" height="160" fill="var(--sand-svg, #ece0ca)" />
        <path d="M70 24 C 50 60, 52 110, 72 138" stroke="#4a3b2c" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M86 22 C 68 60, 70 112, 90 140" stroke="#4a3b2c" strokeWidth="2" fill="none" opacity="0.25" />
        <line x1="96" y1="58" x2="128" y2="50" stroke="var(--honey)" strokeWidth="3" strokeLinecap="round" />
        <line x1="100" y1="76" x2="134" y2="72" stroke="var(--poppy)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="138" cy="71" r="4" fill="var(--rose)" />
        <line x1="98" y1="94" x2="128" y2="92" stroke="var(--peri)" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 104 q 8 -14 16 0 q -8 6 -16 0" fill="var(--meadow-soft)" />
        <path d="M40 40 q 4 -8 8 0" stroke="var(--rose)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
};

export const StackingTip = ({ productType }: { productType: string }) => {
  const tip = tips[productType];
  if (!tip) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pt-8">
      <div
        className="relative grid grid-cols-1 gap-0 border border-dashed md:grid-cols-[260px_1fr]"
        style={{
          borderColor: "var(--poppy)",
          background: "linear-gradient(135deg, var(--rose-soft) 0%, hsl(var(--card)) 55%)",
        }}
      >
        <span
          className="absolute -top-4 left-6 inline-block border border-dashed px-3 py-0.5 text-[1.05rem]"
          style={{
            fontFamily: "var(--font-script)",
            color: "var(--poppy-deep)",
            background: "var(--rose-soft)",
            borderColor: "var(--poppy)",
            transform: "rotate(-2deg)",
          }}
        >
          {tip.sticker}
        </span>
        <div className="hidden md:block" style={{ background: "#ece0ca" }}>
          {tip.svg}
        </div>
        <div className="p-6 md:p-8">
          <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            The Stacking Note <span aria-hidden="true" style={{ color: "var(--poppy)" }}>✿</span>
          </p>
          <h2 className="mb-3 font-serif text-xl font-semibold italic tracking-[0.01em] md:text-2xl">
            {tip.title}
          </h2>
          <p className="max-w-[560px] font-sans text-[12px] leading-relaxed text-muted-foreground md:text-[13px]">
            {tip.body}
          </p>
          <p
            className="mt-4 text-[1.15rem]"
            style={{ fontFamily: "var(--font-script)", color: "var(--meadow)" }}
          >
            — {tip.caption}
          </p>
        </div>
      </div>
    </section>
  );
};
