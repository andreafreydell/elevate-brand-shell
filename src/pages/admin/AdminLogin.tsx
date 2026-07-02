import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Staff sign-in for /admin/rental-ops. Accounts are provisioned in Supabase Auth
// and added to the `staff` table.
export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/admin/rental-ops";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate(from, { replace: true });
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/rental-ops` },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Magic link sent — check your email.");
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/settings`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset link sent — check your email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm border border-border bg-card p-8 md:p-10">
        <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-2">
          GEA · Rental Ops
        </p>
        <h1 className="font-serif text-2xl font-semibold mb-6">Team sign in</h1>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[11px] tracking-[0.15em] uppercase">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[11px] tracking-[0.15em] uppercase">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <button
          type="button"
          onClick={handleMagicLink}
          className="cta-underline mt-5 text-[12px] block mx-auto"
        >
          Email me a magic link instead
        </button>

        <button
          type="button"
          onClick={handleResetPassword}
          className="cta-underline mt-3 text-[12px] block mx-auto"
        >
          Forgot password? Email me a reset link
        </button>
      </div>
    </div>
  );
}
