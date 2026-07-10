import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const fmtDate = (v: string | null) => (v ? new Date(v).toLocaleDateString() : "—");
const money = (v: number | null) => (v != null ? `$${Number(v).toFixed(2)}` : "—");

const TIER_LABELS: Record<string, string> = {
  seed: "Seed", blossom: "Blossom", garden: "Garden",
  three_piece: "Seed", six_piece: "Blossom", ten_piece: "Garden",
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

// Full member 360°: profile + tier/status, every cycle with counters, all
// reservations, kept pieces, and charges. Opened by clicking a member anywhere
// in Rental Ops. Reservations are matched by account link OR Shopify customer id
// so pre-link rows still show up.
export function MemberDrilldown({
  accountId,
  onClose,
}: {
  accountId: string | null;
  onClose: () => void;
}) {
  const open = accountId != null;

  const q = useQuery({
    queryKey: ["member-drill", accountId],
    enabled: open,
    queryFn: async () => {
      const { data: profile, error: pErr } = await supabase
        .from("profiles").select("*").eq("id", accountId!).maybeSingle();
      if (pErr) throw pErr;

      const cid = profile?.shopify_customer_id ?? null;
      const orFilter = cid
        ? `account_id.eq.${accountId},shopify_customer_id.eq.${cid}`
        : `account_id.eq.${accountId}`;

      const [cyclesR, resR, chargesR] = await Promise.all([
        supabase.from("rental_cycles").select("*").eq("account_id", accountId!)
          .order("cycle_number", { ascending: false }),
        supabase.from("rental_reservations").select("*").or(orFilter)
          .order("created_at", { ascending: false }),
        supabase.from("charges").select("*").eq("account_id", accountId!)
          .order("created_at", { ascending: false }),
      ]);

      return {
        profile,
        cycles: cyclesR.data ?? [],
        reservations: resR.data ?? [],
        charges: chargesR.data ?? [],
      };
    },
  });

  const p = q.data?.profile;
  const kept = (q.data?.reservations ?? []).filter((r: any) => r.internal_status === "kept");

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {p?.full_name || p?.email || "Member"}
          </DialogTitle>
        </DialogHeader>

        {q.isLoading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : q.isError ? (
          <p className="py-6 text-[13px] text-muted-foreground">Couldn’t load member. {(q.error as Error)?.message}</p>
        ) : (
          <div className="space-y-6">
            {/* Profile / membership */}
            <Group title="Profile">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
                <div><span className="text-muted-foreground">Email:</span> {p?.email || "—"}</div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge variant={p?.membership_status === "active" ? "outline" : "secondary"}>
                    {p?.membership_status || "none"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Tier:</span>{" "}
                  {p?.membership_tier ? (TIER_LABELS[p.membership_tier] ?? p.membership_tier) : "—"}
                </div>
                <div><span className="text-muted-foreground">Free/keep:</span> {p?.free_items_per_cycle ?? "—"} / {p?.keep_allowance_per_cycle ?? "—"}</div>
                <div><span className="text-muted-foreground">Started:</span> {fmtDate(p?.membership_started_at)}</div>
                <div className="font-mono text-[11px]"><span className="text-muted-foreground font-sans">Shopify:</span> {p?.shopify_customer_id || "—"}</div>
              </div>
            </Group>

            {/* Cycles */}
            <Group title={`Cycles (${q.data!.cycles.length})`}>
              {q.data!.cycles.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">No cycles yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {q.data!.cycles.map((c: any) => (
                    <div key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-border px-3 py-2 text-[12px]">
                      <span className="font-medium">#{c.cycle_number}</span>
                      <Badge variant={c.status === "open" ? "outline" : "secondary"}>{c.status}</Badge>
                      <span className="text-muted-foreground">Free {c.free_used}/{c.free_items_allowance}</span>
                      <span className="text-muted-foreground">Keeps {c.keep_count}/{c.keep_allowance}</span>
                      {c.extra_keeps > 0 && <span className="text-destructive">+{c.extra_keeps} extra keep</span>}
                      <span className="ml-auto text-muted-foreground">{fmtDate(c.cycle_start)} – {fmtDate(c.cycle_end)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Group>

            {/* Reservations */}
            <Group title={`Reservations (${q.data!.reservations.length})`}>
              {q.data!.reservations.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">No reservations yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {q.data!.reservations.map((r: any) => (
                    <div key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-border px-3 py-2 text-[12px]">
                      <span className="font-medium">{r.product_title || r.sku || "—"}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{r.serial_number || "—"}</span>
                      <Badge variant="secondary">{r.internal_status}</Badge>
                      <span className="ml-auto text-muted-foreground">{r.order_number || r.shopify_order_name || r.shopify_order_id}</span>
                    </div>
                  ))}
                </div>
              )}
            </Group>

            {/* Kept */}
            <Group title={`Kept pieces (${kept.length})`}>
              {kept.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">Nothing kept.</p>
              ) : (
                <div className="space-y-1.5">
                  {kept.map((r: any) => (
                    <div key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-border px-3 py-2 text-[12px]">
                      <span className="font-medium">{r.product_title || r.sku || "—"}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{r.sku}</span>
                      <span className="ml-auto text-muted-foreground">{money(r.item_price_cache)} · {fmtDate(r.kept_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Group>

            {/* Charges */}
            <Group title={`Charges (${q.data!.charges.length})`}>
              {q.data!.charges.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">No charges.</p>
              ) : (
                <div className="space-y-1.5">
                  {q.data!.charges.map((c: any) => (
                    <div key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-border px-3 py-2 text-[12px]">
                      <span className="font-medium">{c.charge_type}</span>
                      <span>{money(c.amount)}</span>
                      <Badge variant={c.status === "charged" ? "outline" : c.status === "failed" ? "destructive" : "secondary"}>{c.status}</Badge>
                      <span className="ml-auto text-muted-foreground">{fmtDate(c.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Group>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
