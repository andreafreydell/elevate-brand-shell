import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface ScribbleUnderlineProps {
  children: ReactNode;
  color?: string;
  className?: string;
  delay?: number;
}

/** Hand-drawn wavy SVG underline. Use sparingly — one per section headline. */
export const ScribbleUnderline = ({
  children,
  color = "var(--brass)",
  className = "",
  delay = 0.3,
}: ScribbleUnderlineProps) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute -bottom-[6px] -left-1 overflow-visible pointer-events-none"
        style={{ width: "calc(100% + 8px)", height: 12 }}
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M2 8 C30 2, 50 12, 80 6 S130 2, 160 8 S190 4, 198 7"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
    </span>
  );
};
