import { type ReactNode } from "react";

interface MarkerCircleProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

/** Double-ellipse marker circle with displacement filter. Mimics a felt-tip pen circle. */
export const MarkerCircle = ({
  children,
  color = "var(--tag-red)",
  className = "",
}: MarkerCircleProps) => {
  const filterId = `markerWobble-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <span className={`relative inline-block px-1 ${className}`}>
      <svg
        viewBox="0 0 180 70"
        className="absolute -top-2.5 -left-4 pointer-events-none overflow-visible"
        style={{ width: "calc(100% + 30px)", height: "calc(100% + 20px)" }}
      >
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves={3} seed={8} result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <ellipse
          cx="90" cy="35" rx="82" ry="28"
          transform="rotate(-2, 90, 35)"
          fill="none" stroke={color} strokeWidth="2.2" opacity="0.35"
          filter={`url(#${filterId})`}
        />
        <ellipse
          cx="90" cy="35" rx="80" ry="26"
          transform="rotate(1.5, 90, 35)"
          fill="none" stroke={color} strokeWidth="1.2" opacity="0.25"
          filter={`url(#${filterId})`}
        />
      </svg>
      <span className="relative z-[1]">{children}</span>
    </span>
  );
};
