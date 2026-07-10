import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

type Tier = "seed" | "blossom" | "garden";

// Staff-only "no card" pilot enrollment. Posts to the gea-enroll-member edge
// function with the signed-in staff member's JWT (invoke attaches it), which
// creates/links the account + Shopify customer and activates the tier.
export function EnrollMemberDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tier, setTier] = useState<Tier>("seed");

  const enroll = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("gea-enroll-member", {
        body: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          tier,
        },
      });
      if (error) {
        // Surface the function's JSON error body when present.
        let detail = error.message;
        try {
          const ctx = (error as { context?: Response }).context;
          if (ctx) detail = JSON.stringify(await ctx.json());
        } catch { /* keep message */ }
        throw new Error(detail);
      }
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Enrolled ${email} on the ${tier} tier.`);
      qc.invalidateQueries({ queryKey: ["members"] });
      setOpen(false);
      setEmail(""); setFirstName(""); setLastName(""); setTier("seed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" /> Enroll pilot member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Enroll a pilot member</DialogTitle>
          <DialogDescription>
            Creates the account and activates the membership — no checkout or card required.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => { e.preventDefault(); if (email.trim()) enroll.mutate(); }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="enroll-email" className="text-[11px] uppercase tracking-[0.15em]">Email</Label>
            <Input id="enroll-email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="enroll-first" className="text-[11px] uppercase tracking-[0.15em]">First name</Label>
              <Input id="enroll-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="enroll-last" className="text-[11px] uppercase tracking-[0.15em]">Last name</Label>
              <Input id="enroll-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-[0.15em]">Tier</Label>
            <Select value={tier} onValueChange={(v) => setTier(v as Tier)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="seed">Seed — 3 free / 1 keep</SelectItem>
                <SelectItem value="blossom">Blossom — 6 free / 2 keep</SelectItem>
                <SelectItem value="garden">Garden — 10 free / 3 keep</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={enroll.isPending || !email.trim()}>
              {enroll.isPending ? "Enrolling…" : "Enroll member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
