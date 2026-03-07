import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface CircleEmphasisProps {
  children: ReactNode;
  color?: string;
  className?: string;
  delay?: number;
}

/** Loose hand-drawn ellipse around a word — like an editor's circle mark. */
export const CircleEmphasis = ({
  children,
  color = "var(--tag-red)",
  className = "",
  delay = 0.4,
}: CircleEmphasisProps) => {
  return (
    <span className={`relative inline-block px-1 ${className}`}>
      <svg
        className="absolute -top-2 -left-3 overflow-visible pointer-events-none"
        style={{ width: "calc(100% + 24px)", height: "calc(100% + 16px)" }}
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.ellipse
          cx="100"
          cy="30"
          rx="96"
          ry="26"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          opacity="0.55"
          transform="rotate(-2 100 30)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <span className="relative z-[1]">{children}</span>
    </span>
  );
};
