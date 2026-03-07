import { type ReactNode } from "react";

interface HandDrawnRectProps {
  children: ReactNode;
  className?: string;
  strokeColor?: string;
}

/** SVG rect with feTurbulence displacement for organic edge wobble. For editorial callout boxes. */
export const HandDrawnRect = ({
  children,
  className = "",
  strokeColor = "hsl(var(--foreground))",
}: HandDrawnRectProps) => {
  const filterId = `handDraw-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 340 220"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves={3} seed={2} result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale={4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <rect
          x="8" y="8" width="324" height="204"
          rx="0"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
          opacity="0.4"
          filter={`url(#${filterId})`}
        />
      </svg>
      <div className="relative p-7">
        {children}
      </div>
    </div>
  );
};
