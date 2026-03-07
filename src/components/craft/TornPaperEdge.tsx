interface TornPaperEdgeProps {
  className?: string;
  color?: string;
}

/** Jagged SVG line divider that replaces <hr>. Between sections, below hero, above footer. */
export const TornPaperEdge = ({
  className = "",
  color = "hsl(var(--border))",
}: TornPaperEdgeProps) => {
  return (
    <svg
      className={`w-full block ${className}`}
      height="24"
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
    >
      <path
        d="M0,12 L15,10 L30,14 L42,8 L58,13 L72,9 L88,15 L100,7 L118,13 L132,10 L148,16 L160,8 L178,12 L192,9 L208,15 L220,7 L238,14 L252,10 L268,13 L280,8 L298,15 L312,9 L328,14 L340,7 L358,12 L372,10 L388,16 L400,8 L500,13 L600,7 L700,12 L800,8 L900,14 L1000,7 L1100,12 L1200,9"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.5"
      />
    </svg>
  );
};
