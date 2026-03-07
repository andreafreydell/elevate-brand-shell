interface StitchLineDividerProps {
  className?: string;
  color?: string;
}

/** Dashed line that reads as a sewn seam. Lighter alternative to torn edge. */
export const StitchLineDivider = ({
  className = "",
  color = "hsl(var(--border))",
}: StitchLineDividerProps) => {
  return (
    <svg
      className={`w-full block ${className}`}
      height="12"
      viewBox="0 0 600 12"
      preserveAspectRatio="none"
    >
      <line
        x1="0" y1="6" x2="600" y2="6"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="8 6"
        opacity="0.5"
      />
    </svg>
  );
};
