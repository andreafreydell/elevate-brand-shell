import { motion } from "framer-motion";

interface WaxSealProps {
  letter?: string;
  size?: number;
  className?: string;
}

/** Wax seal SVG badge — for hero panels and membership sections. */
export const WaxSeal = ({ letter = "G", size = 48, className = "" }: WaxSealProps) => {
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="var(--tag-red)" opacity="0.65" />
        <circle cx="32" cy="32" r="22" stroke="hsl(36,28%,90%)" strokeWidth="0.5" fill="none" opacity="0.4" />
        <circle cx="32" cy="32" r="18" stroke="hsl(36,28%,90%)" strokeWidth="0.3" fill="none" opacity="0.25" />
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontFamily="'Heiy', var(--font-serif)"
          fontSize="26"
          fontWeight="400"
          fill="hsl(36,28%,90%)"
          opacity="0.9"
        >
          {letter}
        </text>
      </svg>
    </motion.div>
  );
};
