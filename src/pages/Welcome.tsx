import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

// Members landing shown right after enrollment / first purchase. NOT the public
// landing page — this is the warm "you're in" moment: confirm the account, let
// signed-in members set a password, and push them straight into browsing.
const Welcome = () => {
  const { isSignedIn, user, loading } = useCustomerAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const email = user?.email ?? null;

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don’t match.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Password saved — you can sign in any time.");
  };

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-[hsl(28,22%,34%)]">
        <GrainOverlay opacity={0.05} />
        <div className="relative z-[1] mx-auto max-w-[720px] px-5 py-20 text-center sm:px-6 md:px-12 md:py-28">
          <WaxSeal size={44} className="mx-auto mb-5" />
          <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.4em] text-[hsl(36,25%,78%)]">
            Welcome to GEA
          </p>
          <h1 className="mb-5 font-serif text-4xl font-medium tracking-[-0.01em] text-[hsl(36,33%,93%)] md:text-5xl">
            You’re active{" "}
            <ScribbleUnderline color="var(--brass)" delay={0.4}>
              ✿
            </ScribbleUnderline>
          </h1>
          <p className="mx-auto max-w-[460px] font-sans text-[14px] leading-relaxed text-[hsl(36,20%,80%)]">
            {email ? (
              <>Your account was created under <span className="text-[hsl(36,33%,93%)]">{email}</span>.</>
            ) : (
              <>Your membership account is ready.</>
            )}
          </p>
        </div>
      </section>

      <TornPaperEdge className="mx-auto max-w-[1440px]" />

      <section className="mx-auto max-w-[560px] px-5 py-14 sm:px-6 md:py-16">
        {/* Signed-in members can set a password so they never need a magic link. */}
        {!loading && isSignedIn && (
          <div className="relative mb-10 overflow-hidden border border-border bg-card p-8">
            <GrainOverlay opacity={0.03} />
            <div className="relative z-[1]">
              <h2 className="mb-1 font-serif text-xl font-semibold">Set a password</h2>
              <p className="mb-6 font-sans text-[13px] text-muted-foreground">
                Choose a password so you can sign in any time — no magic link needed.
              </p>
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="welcome-password" className="text-[11px] uppercase tracking-[0.15em]">
                    New password
                  </Label>
                  <Input
                    id="welcome-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="welcome-confirm" className="text-[11px] uppercase tracking-[0.15em]">
                    Confirm password
                  </Label>
                  <Input
                    id="welcome-confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? "Saving…" : "Save password"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {!loading && !isSignedIn && (
          <p className="mb-10 text-center font-sans text-[13px] leading-relaxed text-muted-foreground">
            Check your email for your sign-in link, or head to your{" "}
            <Link to="/account" className="cta-underline">account</Link> to sign in.
          </p>
        )}

        <div className="text-center">
          <Link to="/browse" className="btn-gea">
            Pick Your Pieces
          </Link>
          <p className="mx-auto mt-6 max-w-[420px] font-sans text-[12px] leading-relaxed text-muted-foreground">
            Your included pieces check out at <span className="font-medium text-foreground">$0</span> — just like a
            regular order.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Welcome;
