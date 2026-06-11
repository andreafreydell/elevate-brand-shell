/**
 * GardenSticker — Digital Garden companion system
 * A rounded, hand-script sticker label (the playful sibling of WashiTapeNote).
 * Variants map to the garden palette: rose | peri | meadow.
 */
const variants = {
  rose: { bg: "var(--rose-soft)", shadow: "var(--rose)" },
  peri: { bg: "var(--peri-soft)", shadow: "var(--peri)" },
  meadow: { bg: "var(--meadow-soft)", shadow: "var(--meadow)" },
} as const;

export const GardenSticker = ({
  children,
  variant = "rose",
  rotation = -3,
  className = "",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  rotation?: number;
  className?: string;
}) => {
  const v = variants[variant];
  return (
    <span
      className={`inline-block border border-dashed px-4 py-1 font-script text-[1.05rem] leading-snug text-foreground ${className}`}
      style={{
        background: v.bg,
        borderColor: v.shadow,
        boxShadow: `2px 2px 0 ${v.shadow}`,
        transform: `rotate(${rotation}deg)`,
        fontFamily: "var(--font-script)",
      }}
    >
      {children}
    </span>
  );
};
