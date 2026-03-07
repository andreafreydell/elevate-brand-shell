import { type ReactNode } from "react";

interface DotGridTextureProps {
  children?: ReactNode;
  className?: string;
  dotSize?: number;
  spacing?: number;
}

/** CSS-only dot pattern that reads as graph paper. Apply as a section background. */
export const DotGridTexture = ({
  children,
  className = "",
  dotSize = 0.8,
  spacing = 18,
}: DotGridTextureProps) => {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--border)) ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    >
      {children}
    </div>
  );
};
