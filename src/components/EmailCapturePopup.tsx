import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEmailCaptureTrigger } from "@/hooks/useEmailCaptureTrigger";
import { saveFoundingAccessEmail } from "@/lib/foundingAccess";

export const EmailCapturePopup = () => {
  const { pathname } = useLocation();
  const { isOpen, setIsOpen, dismissPopup } = useEmailCaptureTrigger(pathname);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) return;
    setEmail("");
    setLoading(false);
    setSubmitted(false);
    setError("");
  }, [isOpen]);

  useEffect(() => {
    if (!submitted) return;

    const timer = window.setTimeout(() => {
      setIsOpen(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [submitted, setIsOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await saveFoundingAccessEmail(email, `popup:${pathname}`);

    if (result.success) {
      setSubmitted(true);
      setEmail("");
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setIsOpen(true);
      return;
    }

    if (submitted) {
      setIsOpen(false);
      return;
    }

    dismissPopup();
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background px-8 pb-8 pt-12 shadow-[0_-18px_40px_rgba(0,0,0,0.08)] focus:outline-none",
            "sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-[520px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:border sm:px-12 sm:pb-12 sm:pt-12 sm:shadow-[0_24px_60px_rgba(0,0,0,0.12)]",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            Founding access invitation
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Enter your email for early access to the vault and receive your invitation.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close
            className="absolute right-4 top-4 p-2 text-muted-foreground transition-opacity hover:opacity-70 focus:outline-none"
            aria-label="Close popup"
          >
            <X className="h-[18px] w-[18px] stroke-[1.5]" />
          </DialogPrimitive.Close>

          <div className="text-center">
            <p className="mb-3 text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground">
              Founding Access
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-[0.02em] text-foreground">
              Luxury, Accessed.
            </h2>
            <p className="mx-auto mt-4 max-w-[360px] text-sm leading-relaxed font-sans text-muted-foreground">
              Enter your email for early access to the vault. High-design jewelry
              that evolves with you. More beauty, less burden.
            </p>

            {submitted ? (
              <div className="mt-8 border border-border px-6 py-5">
                <p className="font-serif text-lg text-foreground">
                  Welcome to the vault.
                </p>
                <p className="mt-2 text-sm font-sans text-muted-foreground">
                  We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                />
                {error ? (
                  <p className="mt-3 text-[11px] font-sans text-destructive">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full border border-foreground bg-foreground px-8 py-3 text-[11px] tracking-[0.2em] uppercase font-sans text-background transition-colors hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Apply for Access"}
                </button>
                <p className="mt-3 text-center font-sans text-[11px] text-muted-foreground">
                  We respect your privacy. Read our{" "}
                  <Link
                    to="/privacy"
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <button
                  type="button"
                  onClick={dismissPopup}
                  className="mt-6 text-[11px] tracking-[0.15em] uppercase font-sans text-muted-foreground transition-opacity hover:opacity-70"
                >
                  Not Now
                </button>
              </form>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
