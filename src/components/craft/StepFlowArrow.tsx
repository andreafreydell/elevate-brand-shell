/**
 * StepFlowArrow – hand-drawn style arrow connector between step blocks.
 * Renders horizontal on md+ and vertical on mobile.
 * Uses feTurbulence wobble filter consistent with the craft element library.
 */
const StepFlowArrow = ({ className = "" }: { className?: string }) => {
  const filterId = `wobble-arrow-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={`flex items-center justify-center shrink-0
        /* mobile: vertical */  py-1 md:py-0
        /* desktop: horizontal */ md:px-0 md:w-6
        ${className}`}
    >
      {/* ── Vertical arrow (mobile) ── */}
      <svg
        className="block md:hidden"
        width="16"
        height="28"
        viewBox="0 0 16 28"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <filter id={`${filterId}-v`}>
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
        </defs>
        <path
          d="M8 2 L8 20"
          stroke="hsl(var(--foreground) / 0.25)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="3 3"
          filter={`url(#${filterId}-v)`}
        />
        <path
          d="M4 18 L8 24 L12 18"
          stroke="hsl(var(--foreground) / 0.35)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={`url(#${filterId}-v)`}
        />
      </svg>

      {/* ── Horizontal arrow (desktop) ── */}
      <svg
        className="hidden md:block"
        width="24"
        height="16"
        viewBox="0 0 24 16"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <filter id={`${filterId}-h`}>
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
        </defs>
        <path
          d="M2 8 L16 8"
          stroke="hsl(var(--foreground) / 0.25)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="3 3"
          filter={`url(#${filterId}-h)`}
        />
        <path
          d="M14 4 L20 8 L14 12"
          stroke="hsl(var(--foreground) / 0.35)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={`url(#${filterId}-h)`}
        />
      </svg>
    </div>
  );
};

export { StepFlowArrow };
