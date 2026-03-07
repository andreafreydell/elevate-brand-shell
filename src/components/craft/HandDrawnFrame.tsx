import { type ReactNode } from "react";

interface HandDrawnFrameProps {
  children: ReactNode;
  className?: string;
  strokeColor?: string;
}

/** Responsive SVG rect + displacement that stretches with any container. For callout boxes and philosophy statements. */
export const HandDrawnFrame = ({
  children,
  className = "",
  strokeColor = "hsl(var(--foreground))",
}: HandDrawnFrameProps) => {
  const filterId = `handDrawFrame-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves={3} seed={4} result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale={4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <rect
          x="6" y="6" width="588" height="188"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          opacity="0.35"
          filter={`url(#${filterId})`}
        />
      </svg>
      <div className="relative p-8">
        {children}
      </div>
    </div>
  );
};
