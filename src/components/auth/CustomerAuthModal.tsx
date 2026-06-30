import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomerAuth, type AuthIntent } from "@/contexts/CustomerAuthContext";

const INTENT_COPY: Record<Exclude<AuthIntent, null>, { signup: string; login: string }> = {
  favorites: {
    signup: "Create your account to save this to your first Occasion.",
    login: "Log in to save this to an Occasion.",
  },
  checkout: {
    signup: "Create your account to check out.",
    login: "Log in to check out.",
  },
  account: {
    signup: "Create your account to get started.",
    login: "Welcome back — log in to continue.",
  },
};

export const CustomerAuthModal = () => {
  const {
    authModal,
    closeAuthModal,
    setAuthMode,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
  } = useCustomerAuth();
  const { open, mode, intent } = authModal;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isSignup = mode === "signup";

  // Reset fields whenever the modal opens fresh.
  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setFullName("");
      setLoading(false);
      setGoogleLoading(false);
    }
  }, [open]);

  const contextLine = intent ? INTENT_COPY[intent][mode] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignup) {
      const { error, needsConfirmation } = await signUpWithEmail(email, password, fullName);
      setLoading(false);
      if (error) {
        toast.error(error);
        return;
      }
      if (needsConfirmation) {
        toast.success("Check your email to confirm your account.", { position: "top-center" });
        closeAuthModal();
        return;
      }
      toast.success("Welcome to Gea.", { position: "top-center" });
      closeAuthModal();
    } else {
      const { error } = await signInWithEmail(email, password);
      setLoading(false);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Signed in.", { position: "top-center" });
      closeAuthModal();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setGoogleLoading(false);
      toast.error(error);
    }
    // On success the browser redirects to Google, so no further action here.
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? closeAuthModal() : null)}>
      <DialogContent className="max-w-md rounded-none border-border bg-card p-8 sm:p-10">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">Gea</p>
          <h2 className="font-serif text-2xl font-semibold">
            {isSignup ? "Create account" : "Log in"}
          </h2>
          {contextLine && (
            <p className="text-[13px] font-sans text-muted-foreground pt-1">{contextLine}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="mt-6 flex w-full items-center justify-center gap-3 border border-foreground bg-background py-3 text-xs tracking-[0.18em] uppercase font-sans text-foreground transition-colors hover:bg-foreground hover:text-hero-text disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 4.75 12 4.75Z" />
            </svg>
          )}
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-1.5">
              <Label htmlFor="ca-name" className="text-[11px] tracking-[0.15em] uppercase">Name</Label>
              <Input
                id="ca-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                className="rounded-none"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="ca-email" className="text-[11px] tracking-[0.15em] uppercase">Email</Label>
            <Input
              id="ca-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ca-password" className="text-[11px] tracking-[0.15em] uppercase">Password</Label>
            <Input
              id="ca-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="rounded-none"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-none h-11 text-xs tracking-[0.2em] uppercase font-sans"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignup ? "Create account" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[12px] font-sans text-muted-foreground">
          {isSignup ? "Already have an account?" : "New to Gea?"}{" "}
          <button
            type="button"
            onClick={() => setAuthMode(isSignup ? "login" : "signup")}
            className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {isSignup ? "Log in" : "Create account"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};
