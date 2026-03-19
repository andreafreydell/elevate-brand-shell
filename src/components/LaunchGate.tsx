import { useState, type ReactNode } from "react";

const PASSCODE = "GEA2026";
const STORAGE_KEY = "gea_access_granted";

interface LaunchGateProps {
  children: ReactNode;
}

const LaunchGate = ({ children }: LaunchGateProps) => {
  // Temporarily bypassed — set to false to re-enable the gate
  const GATE_ENABLED = false;

  const [granted, setGranted] = useState(() => !GATE_ENABLED || localStorage.getItem(STORAGE_KEY) === "true");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (granted) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === PASSCODE) {
      localStorage.setItem(STORAGE_KEY, "true");
      setGranted(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* Brand mark */}
        <h1 className="font-serif italic text-4xl md:text-5xl tracking-tight mb-10">
          Gea
        </h1>

        {/* Headline */}
        <h2 className="font-serif uppercase text-[clamp(0.85rem,1.8vw,1.1rem)] tracking-[0.12em] mb-10 text-foreground">
          This experience is not yet public.
        </h2>

        {/* Passcode form */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col items-center gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
            className="w-full h-11 px-4 bg-transparent border border-border text-foreground text-center text-[13px] tracking-[0.1em] placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            autoFocus
          />
          <button
            type="submit"
            className="btn-gea-outline w-full"
          >
            Enter
          </button>

          {/* Error */}
          <p className={`text-[11px] tracking-[0.1em] text-destructive transition-opacity duration-300 ${error ? "opacity-100" : "opacity-0"}`}>
            Code not recognized.
          </p>
        </form>

        {/* Micro-copy */}
        <p className="text-[11px] tracking-[0.15em] text-muted-foreground mt-8 leading-relaxed">
          Members and press: check your inbox for the access code.
        </p>

        {/* Inquiry line */}
        <p className="text-[11px] tracking-[0.15em] text-muted-foreground mt-6 leading-relaxed">
          For press, investor &amp; partnership inquiries:
        </p>
        <a
          href="mailto:maria.freydell.v@gmail.com"
          className="cta-underline text-muted-foreground mt-1"
        >
          maria.freydell.v@gmail.com
        </a>
      </div>
    </div>
  );
};

export default LaunchGate;
