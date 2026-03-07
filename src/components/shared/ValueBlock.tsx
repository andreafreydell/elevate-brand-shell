import { ReactNode, useRef, useState, useEffect } from "react";

interface ValueBlockProps {
  title: string;
  description: string;
  className?: string;
  infographic?: ReactNode;
}

export const ValueBlock = ({ title, description, className = "", infographic }: ValueBlockProps) => {
  const [expanded, setExpanded] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);
  const [baseHeight, setBaseHeight] = useState(0);

  useEffect(() => {
    if (svgRef.current && !expanded) {
      setBaseHeight(svgRef.current.offsetHeight);
    }
  }, [infographic]);

  return (
    <div className={`border border-border p-8 md:p-10 h-full flex flex-col ${className}`}>
      {infographic && (
        <div
          ref={svgRef}
          className="bg-background border border-border p-4 mb-6 relative cursor-zoom-in"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          style={{
            height: expanded && baseHeight ? baseHeight * 1.75 : undefined,
            transition: 'height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {infographic}
          {/* Zoom hint */}
          <div
            className="absolute top-2 right-2 w-6 h-6 bg-foreground/10 border border-border flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: expanded ? 0 : 1 }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.5" />
              <line x1="10" y1="10" x2="14" y2="14" />
              <line x1="5" y1="7" x2="9" y2="7" />
              <line x1="7" y1="5" x2="7" y2="9" />
            </svg>
          </div>
        </div>
      )}
      <h3 className="font-serif text-lg md:text-xl font-semibold tracking-[0.02em] mb-3">
        {title}
      </h3>
      <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mt-auto">
        {description}
      </p>
    </div>
  );
};
