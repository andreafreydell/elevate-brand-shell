import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Lets a signed-in staff member set/update their own account password so they
// no longer depend on magic links to sign in.
export default function AdminSettings() {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Password set — you can now sign in with email + password.");
  };

  return (
    <div className="min-h-screen bg-background px-6 md:px-10 py-8 max-w-[560px] mx-auto">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">GEA · Rental Ops</p>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">Account settings</h1>
      </div>

      <div className="border border-border bg-card p-8">
        <h2 className="font-serif text-lg mb-1">Set a password</h2>
        <p className="text-[13px] text-muted-foreground font-sans mb-6">
          {user?.email
            ? `Set a password for ${user.email} so you can sign in without a magic link.`
            : "Set a password so you can sign in without a magic link."}
        </p>

        <form onSubmit={handleSetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-[11px] tracking-[0.15em] uppercase">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-[11px] tracking-[0.15em] uppercase">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving…" : "Save password"}
          </Button>
        </form>
      </div>

      <Link to="/admin/rental-ops" className="cta-underline mt-6 text-[12px] inline-block">
        ← Back to Rental Ops
      </Link>
    </div>
  );
}
