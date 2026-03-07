import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface MarginNoteProps {
  children: ReactNode;
  attribution?: string;
  className?: string;
}

/** Editorial margin note — like handwritten annotations in a magazine spread. */
export const MarginNote = ({
  children,
  attribution = "GEA Curator",
  className = "",
}: MarginNoteProps) => {
  return (
    <motion.div
      className={`relative pl-6 ${className}`}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Hand-drawn bracket line */}
      <svg
        className="absolute left-0 top-0 h-full w-4 overflow-visible"
        viewBox="0 0 16 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M12 2 C6 2, 4 8, 4 20 L4 80 C4 92, 6 98, 12 98"
          stroke="var(--brass)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="font-script text-[15px] leading-relaxed text-foreground/80 italic">
        "{children}"
      </p>
      <p className="text-[9px] tracking-[0.2em] uppercase font-sans text-muted-foreground mt-2">
        — {attribution}
      </p>
    </motion.div>
  );
};
