import { motion } from "framer-motion";

interface StampBadgeProps {
  text: string;
  subtext?: string;
  className?: string;
  rotation?: number;
}

/** Imperfect rubber-stamp badge with SVG turbulence texture. */
export const StampBadge = ({
  text,
  subtext,
  className = "",
  rotation = -6,
}: StampBadgeProps) => {
  const filterId = `stamp-texture-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <motion.div
      className={`inline-flex ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 0.55, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <circle cx="60" cy="60" r="52" stroke="var(--tag-red)" strokeWidth="2" fill="none" />
          <circle cx="60" cy="60" r="46" stroke="var(--tag-red)" strokeWidth="0.5" fill="none" />
          <text
            x="60"
            y="56"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="8"
            fontWeight="500"
            letterSpacing="0.2em"
            fill="var(--tag-red)"
          >
            {text}
          </text>
          {subtext && (
            <text
              x="60"
              y="70"
              textAnchor="middle"
              fontFamily="var(--font-serif)"
              fontSize="14"
              fontWeight="600"
              fontStyle="italic"
              fill="var(--tag-red)"
            >
              {subtext}
            </text>
          )}
          <text
            x="60"
            y="88"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontSize="5"
            letterSpacing="0.15em"
            fill="var(--tag-red)"
          >
            GEA · 2025
          </text>
        </g>
      </svg>
    </motion.div>
  );
};
