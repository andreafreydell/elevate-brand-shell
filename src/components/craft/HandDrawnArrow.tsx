import { motion } from "framer-motion";

interface HandDrawnArrowProps {
  className?: string;
  direction?: "right" | "down" | "curved-right" | "swoopy";
  color?: string;
  delay?: number;
}

/** Hand-drawn wobbly arrow connector — editorial style with SVG turbulence filter. */
export const HandDrawnArrow = ({
  className = "",
  direction = "right",
  color = "var(--tag-red)",
  delay = 0.3,
}: HandDrawnArrowProps) => {
  const filterId = `arrow-wobble-${Math.random().toString(36).slice(2, 8)}`;

  if (direction === "down") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg width="24" height="48" viewBox="0 0 24 48" fill="none" className="overflow-visible">
          <defs>
            <filter id={filterId}>
              <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>
          <motion.path
            d="M12 4 C14 16, 10 28, 12 38"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
            filter={`url(#${filterId})`}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.path
            d="M7 33 L12 40 L17 33"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
            filter={`url(#${filterId})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.6 }}
          />
        </svg>
      </div>
    );
  }

  if (direction === "swoopy") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg width="60" height="32" viewBox="0 0 60 32" fill="none" className="overflow-visible">
          <defs>
            <filter id={filterId}>
              <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
            </filter>
          </defs>
          <motion.path
            d="M4 20 C16 6, 36 6, 48 14 C50 15, 52 17, 54 16"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            opacity="0.55"
            filter={`url(#${filterId})`}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.55 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.path
            d="M49 11 L55 16 L50 21"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            opacity="0.55"
            filter={`url(#${filterId})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.55 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.8 }}
          />
        </svg>
      </div>
    );
  }

  if (direction === "curved-right") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg width="48" height="28" viewBox="0 0 48 28" fill="none" className="overflow-visible">
          <defs>
            <filter id={filterId}>
              <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>
          <motion.path
            d="M4 18 C12 6, 28 6, 38 14"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            opacity="0.55"
            filter={`url(#${filterId})`}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.55 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.path
            d="M34 9 L40 14 L34 19"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            opacity="0.55"
            filter={`url(#${filterId})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.55 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.7 }}
          />
        </svg>
      </div>
    );
  }

  // Default: right arrow
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="overflow-visible">
        <defs>
          <filter id={filterId}>
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
        <motion.path
          d="M4 10 C12 8, 24 12, 38 10"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          opacity="0.55"
          filter={`url(#${filterId})`}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.path
          d="M34 5 L40 10 L34 15"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          opacity="0.55"
          filter={`url(#${filterId})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: delay + 0.6 }}
        />
      </svg>
    </div>
  );
};
