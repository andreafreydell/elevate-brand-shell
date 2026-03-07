interface DiamondChainBorderProps {
  className?: string;
}

/** Repeating geometric diamond motif border. For editorial pages and section borders. */
export const DiamondChainBorder = ({ className = "" }: DiamondChainBorderProps) => {
  const patternId = `diamondChain-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg
      className={`w-full block overflow-visible ${className}`}
      height="20"
      viewBox="0 0 400 20"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M20,2 L30,10 L20,18 L10,10 Z"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
            opacity="0.4"
          />
          <circle cx="20" cy="10" r="2" fill="var(--brass)" opacity="0.3" />
          <line x1="0" y1="10" x2="10" y2="10" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="30" y1="10" x2="40" y2="10" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="400" height="20" fill={`url(#${patternId})`} />
    </svg>
  );
};
