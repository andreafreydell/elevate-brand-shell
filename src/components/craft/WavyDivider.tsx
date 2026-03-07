import { motion } from "framer-motion";

interface WavyDividerProps {
  className?: string;
  color?: string;
  variant?: "single" | "double";
  delay?: number;
}

/** Organic hand-drawn wavy line divider with SVG turbulence filter. */
export const WavyDivider = ({
  className = "",
  color = "hsl(var(--border))",
  variant = "single",
  delay = 0,
}: WavyDividerProps) => {
  const filterId = `wavy-tremor-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 800 24"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-[16px]"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="turbulence"
              baseFrequency="0.035"
              numOctaves="2"
              seed="3"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <motion.path
          d="M0 12 C100 4, 200 20, 300 12 S500 4, 600 12 S700 20, 800 12"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${filterId})`}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        {variant === "double" && (
          <motion.path
            d="M0 16 C100 8, 200 24, 300 16 S500 8, 600 16 S700 24, 800 16"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
            filter={`url(#${filterId})`}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        )}
      </svg>
    </div>
  );
};
