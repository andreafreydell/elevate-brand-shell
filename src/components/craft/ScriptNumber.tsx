import { type ReactNode } from "react";

interface ScriptNumberProps {
  children: ReactNode;
  className?: string;
}

/** Script-font numbers for warm, human-feeling metrics. Uses Caveat. */
export const ScriptNumber = ({ children, className = "" }: ScriptNumberProps) => {
  return (
    <span className={`font-script text-[1.5em] leading-none ${className}`}>
      {children}
    </span>
  );
};
