import { type ReactNode } from "react";

interface SketchyBorderCardProps {
  children: ReactNode;
  label?: string;
  className?: string;
  /** Unique wobble seed — vary control points ±2-4px per instance */
  pathVariant?: number;
}

const PATHS = [
  "M4,4 C100,2 200,6 396,4 C398,60 396,150 396,246 C300,248 100,244 4,246 C2,180 6,80 4,4Z",
  "M6,3 C120,5 220,2 394,6 C396,65 398,155 394,244 C280,246 110,248 6,248 C4,175 3,75 6,3Z",
  "M5,6 C90,3 210,4 395,5 C397,55 394,148 396,245 C310,247 95,246 5,244 C3,185 5,85 5,6Z",
];

/** Wobbly SVG border card for curator notes and editorial asides. NOT for product cards. */
export const SketchyBorderCard = ({
  children,
  label = "EDITOR'S NOTE",
  className = "",
  pathVariant = 0,
}: SketchyBorderCardProps) => {
  const path = PATHS[pathVariant % PATHS.length];

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <path
          d={path}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
      <div className="p-8 relative">
        {label && (
          <p className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-muted-foreground mb-3">
            {label}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};
