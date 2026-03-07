import { type ReactNode } from "react";

interface WashiTapeNoteProps {
  children: ReactNode;
  label?: string;
  tapeColor?: string;
  rotation?: number;
  className?: string;
}

/** Pinned note card with decorative washi tape strip. For curator picks and editorial asides. */
export const WashiTapeNote = ({
  children,
  label = "CURATOR'S PICK",
  tapeColor = "var(--seafoam)",
  rotation = -1.5,
  className = "",
}: WashiTapeNoteProps) => {
  return (
    <div
      className={`relative w-full max-w-[320px] ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape strip */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-[100px] h-[24px]"
        style={{
          transform: "rotate(1deg)",
          background: tapeColor,
          opacity: 0.45,
          clipPath: "polygon(2% 0%, 98% 2%, 100% 100%, 0% 97%)",
        }}
      />
      {/* Note body */}
      <div
        className="border border-border relative"
        style={{
          background: "hsl(38, 32%, 94%)",
          padding: "2rem 1.75rem 1.75rem",
          clipPath: "polygon(0% 0%, 100% 0.5%, 99.5% 100%, 0.5% 99.5%)",
          boxShadow: "2px 3px 8px rgba(0,0,0,0.04)",
        }}
      >
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
