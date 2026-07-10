import { useState, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronDown, ChevronRight } from "lucide-react";
import { EnrollMemberDialog } from "@/components/admin/EnrollMemberDialog";
import { MemberDrilldown } from "@/components/admin/MemberDrilldown";

function useTable<T = any>(key: string, build: () => any) {
  return useQuery<T[]>({
    queryKey: [key],
    queryFn: async () => {
      const { data, error } = await build();
      if (error) throw error;
      return (data || []) as T[];
    },
  });
}

function Section({
  title, query, columns, empty, renderRow,
}: {
  title: string;
  query: ReturnType<typeof useTable>;
  columns: string[];
  empty: string;
  renderRow: (row: any) => React.ReactNode;
}) {
  return (
    <div>
      {query.isLoading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : query.isError ? (
        <p className="text-[13px] text-muted-foreground font-sans py-8">
          Couldn’t load {title.toLowerCase()}. {(query.error as Error)?.message}
        </p>
      ) : (query.data || []).length === 0 ? (
        <p className="text-[13px] text-muted-foreground font-sans py-8">{empty}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>{columns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow>
          </TableHeader>
          <TableBody>{(query.data || []).map(renderRow)}</TableBody>
        </Table>
      )}
    </div>
  );
}

const fmtDate = (v: string | null) => (v ? new Date(v).toLocaleDateString() : "—");

const TIER_LABELS: Record<string, string> = {
  seed: "Seed", blossom: "Blossom", garden: "Garden",
  three_piece: "Seed", six_piece: "Blossom", ten_piece: "Garden",
};

type Addr = {
  name?: string; address1?: string; address2?: string;
  city?: string; province?: string; province_code?: string;
  zip?: string; country?: string; phone?: string;
} | null;

const addrCompact = (a: Addr) => {
  if (!a) return "—";
  const bits = [a.city, a.province_code || a.province].filter(Boolean);
  return bits.length ? bits.join(", ") : (a.name || "—");
};

const AddressBlock = ({ a }: { a: Addr }) => {
  if (!a) return <span className="text-muted-foreground">No address</span>;
  return (
    <div className="text-[12px] leading-relaxed">
      {a.name && <div>{a.name}</div>}
      {a.address1 && <div>{a.address1}</div>}
      {a.address2 && <div>{a.address2}</div>}
      <div>{[a.city, a.province_code || a.province, a.zip].filter(Boolean).join(", ")}</div>
      {a.country && <div>{a.country}</div>}
      {a.phone && <div className="text-muted-foreground">{a.phone}</div>}
    </div>
  );
};

export default function RentalOps() {
  const { user, signOut } = useAuth();
  const qc = useQueryClient();
  const [drillId, setDrillId] = useState<string | null>(null);
  const [expandedRes, setExpandedRes] = useState<Set<string>>(new Set());

  const toggleRes = (id: string) =>
    setExpandedRes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const inventory = useTable("inv", () =>
    supabase.from("inventory_units").select("*").order("rental_count", { ascending: false }).limit(500));
  const retireReview = useTable("retire", () =>
    supabase.from("inventory_units").select("*").eq("retire_flagged", true).eq("retired", false));
  const reservations = useTable("res", () =>
    supabase.from("rental_reservations").select("*").order("created_at", { ascending: false }).limit(200));
  const returns = useTable("returns", () =>
    supabase.from("member_returns").select("*").order("created_at", { ascending: false }).limit(200));
  const kept = useTable("kept", () =>
    supabase.from("rental_reservations").select("*").eq("internal_status", "kept").order("kept_at", { ascending: false }));
  const charges = useTable("charges", () =>
    supabase.from("charges").select("*").order("created_at", { ascending: false }));
  const members = useTable("members", () =>
    supabase.from("profiles").select("*").neq("membership_status", "none").order("created_at", { ascending: false }));
  const cycles = useTable("cycles", () =>
    supabase.from("rental_cycles").select("*").gt("extra_keeps", 0).order("cycle_end", { ascending: false }));

  // Member lookup so reservations / kept rows can show who + open the drill-down.
  const membersList = members.data ?? [];
  const byAccount = new Map(membersList.map((m: any) => [m.id, m]));
  const byCustomer = new Map(
    membersList.filter((m: any) => m.shopify_customer_id).map((m: any) => [m.shopify_customer_id, m]),
  );
  const resolveMember = (r: any) =>
    (r.account_id && byAccount.get(r.account_id)) || byCustomer.get(r.shopify_customer_id) || null;

  const MemberCell = ({ row }: { row: any }) => {
    const m = resolveMember(row);
    if (!m) {
      return <span className="text-muted-foreground font-mono text-[11px]">{row.shopify_customer_id || "—"}</span>;
    }
    return (
      <button
        type="button"
        onClick={() => setDrillId(m.id)}
        className="text-left hover:underline"
      >
        <span className="block">{m.full_name || m.email || "Member"}</span>
        {m.email && m.full_name && <span className="block text-[11px] text-muted-foreground">{m.email}</span>}
      </button>
    );
  };

  const retire = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inventory_units")
        .update({ retired: true, retired_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Unit retired.");
      qc.invalidateQueries({ queryKey: ["retire"] });
      qc.invalidateQueries({ queryKey: ["inv"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reconcile = useMutation({
    mutationFn: async (returnId: string) => {
      const { error } = await supabase.functions.invoke("gea-create-return", {
        body: { return_id: returnId, force: true },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Return reconciled.");
      qc.invalidateQueries({ queryKey: ["returns"] });
      qc.invalidateQueries({ queryKey: ["kept"] });
      qc.invalidateQueries({ queryKey: ["inv"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const chargeFees = useMutation({
    mutationFn: async (cycleId: string) => {
      const { error } = await supabase.functions.invoke("gea-charge-keep-fee", {
        body: { cycle_id: cycleId },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Keep fees charged.");
      qc.invalidateQueries({ queryKey: ["charges"] });
      qc.invalidateQueries({ queryKey: ["cycles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background px-6 md:px-10 py-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">GEA</p>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold">Rental Ops</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-muted-foreground font-sans hidden md:inline">{user?.email}</span>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/settings">Set password</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="retire">
            Retire Review{(retireReview.data?.length ?? 0) > 0 && <Badge variant="secondary" className="ml-2">{retireReview.data!.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="kept">Kept</TabsTrigger>
          <TabsTrigger value="charges">
            Charges{(cycles.data?.length ?? 0) > 0 && <Badge variant="secondary" className="ml-2">{cycles.data!.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6">
          <Section
            title="Inventory" query={inventory} empty="No units seeded yet."
            columns={["Serial", "SKU", "Variant", "Status", "Condition", "Rentals", "Flags"]}
            renderRow={(u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-[12px]">{u.serial_number}</TableCell>
                <TableCell>{u.sku}</TableCell>
                <TableCell className="font-mono text-[12px]">{u.shopify_variant_id}</TableCell>
                <TableCell>{u.availability_status}</TableCell>
                <TableCell>{u.condition_status}</TableCell>
                <TableCell>{u.rental_count}</TableCell>
                <TableCell>
                  {u.retired ? <Badge variant="outline">retired</Badge>
                    : u.retire_flagged ? <Badge variant="secondary">retire?</Badge> : "—"}
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="retire" className="mt-6">
          <Section
            title="Retire Review" query={retireReview}
            empty="Nothing flagged for retirement."
            columns={["Serial", "SKU", "Rentals", "Flagged", ""]}
            renderRow={(u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-[12px]">{u.serial_number}</TableCell>
                <TableCell>{u.sku}</TableCell>
                <TableCell>{u.rental_count}</TableCell>
                <TableCell>{fmtDate(u.retire_flagged_at)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" disabled={retire.isPending}
                    onClick={() => retire.mutate(u.id)}>Mark retired</Button>
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="reservations" className="mt-6">
          <Section
            title="Reservations" query={reservations} empty="No reservations yet."
            columns={["", "Member", "Order", "Item", "Serial", "Status", "Free?", "Ships to"]}
            renderRow={(r) => {
              const open = expandedRes.has(r.id);
              return (
                <>
                  <TableRow key={r.id}>
                    <TableCell className="w-8 align-top">
                      <button type="button" onClick={() => toggleRes(r.id)} aria-label="Toggle details"
                        className="text-muted-foreground hover:text-foreground">
                        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </TableCell>
                    <TableCell className="align-top"><MemberCell row={r} /></TableCell>
                    <TableCell className="align-top">{r.order_number || r.shopify_order_name || r.shopify_order_id}</TableCell>
                    <TableCell className="align-top">{r.product_title || r.sku || "—"}</TableCell>
                    <TableCell className="font-mono text-[12px] align-top">{r.serial_number}</TableCell>
                    <TableCell className="align-top">{r.internal_status}</TableCell>
                    <TableCell className="align-top">{r.is_free_item == null ? "—" : r.is_free_item ? "free" : "extra"}</TableCell>
                    <TableCell className="align-top text-[12px]">{addrCompact(r.shipping_address as Addr)}</TableCell>
                  </TableRow>
                  {open && (
                    <TableRow key={r.id + "-x"} className="bg-muted/30">
                      <TableCell />
                      <TableCell colSpan={7}>
                        <div className="grid gap-6 py-2 sm:grid-cols-2">
                          <div>
                            <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Shipping address</p>
                            <AddressBlock a={r.shipping_address as Addr} />
                          </div>
                          <div className="text-[12px] leading-relaxed">
                            <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Details</p>
                            <div><span className="text-muted-foreground">SKU:</span> {r.sku || "—"}</div>
                            <div><span className="text-muted-foreground">Order:</span> {r.order_number || r.shopify_order_name || r.shopify_order_id}</div>
                            <div><span className="text-muted-foreground">Assigned:</span> {fmtDate(r.assigned_at)}</div>
                            <div><span className="text-muted-foreground">Shipped:</span> {fmtDate(r.shipped_at)}</div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            }}
          />
        </TabsContent>

        <TabsContent value="returns" className="mt-6">
          <Section
            title="Returns" query={returns} empty="No returns yet."
            columns={["Order", "Expected", "Returned", "Kept", "Status", ""]}
            renderRow={(r) => (
              <TableRow key={r.id}>
                <TableCell>{r.shopify_order_id}</TableCell>
                <TableCell>{(r.expected_serials || []).length}</TableCell>
                <TableCell>{(r.returned_serials || []).length}</TableCell>
                <TableCell>{(r.kept_serials || []).length}</TableCell>
                <TableCell><Badge variant={r.status === "reconciled" ? "outline" : "secondary"}>{r.status}</Badge></TableCell>
                <TableCell className="text-right">
                  {r.status !== "reconciled" && (
                    <Button size="sm" variant="outline" disabled={reconcile.isPending}
                      onClick={() => reconcile.mutate(r.id)}>Reconcile</Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="kept" className="mt-6">
          <Section
            title="Kept items" query={kept} empty="Nothing kept yet."
            columns={["Item", "SKU", "Member", "Serial", "Order", "Retail", "Kept on"]}
            renderRow={(r) => (
              <TableRow key={r.id}>
                <TableCell>{r.product_title || "—"}</TableCell>
                <TableCell>{r.sku}</TableCell>
                <TableCell><MemberCell row={r} /></TableCell>
                <TableCell className="font-mono text-[12px]">{r.serial_number}</TableCell>
                <TableCell>{r.order_number || r.shopify_order_name || r.shopify_order_id}</TableCell>
                <TableCell>{r.item_price_cache != null ? `$${Number(r.item_price_cache).toFixed(2)}` : "—"}</TableCell>
                <TableCell>{fmtDate(r.kept_at)}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="charges" className="mt-6 space-y-8">
          <div>
            <h2 className="font-serif text-lg mb-3">Cycles with extra keeps</h2>
            <Section
              title="Over-keep cycles" query={cycles}
              empty="No cycles over their keep allowance."
              columns={["Cycle", "Keeps", "Allowed", "Extra", ""]}
              renderRow={(c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-[12px]">#{c.cycle_number} · {fmtDate(c.cycle_end)}</TableCell>
                  <TableCell>{c.keep_count}</TableCell>
                  <TableCell>{c.keep_allowance}</TableCell>
                  <TableCell>{c.extra_keeps}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" disabled={chargeFees.isPending}
                      onClick={() => chargeFees.mutate(c.id)}>Charge 40% keep fee</Button>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
          <div>
            <h2 className="font-serif text-lg mb-3">Charges</h2>
            <Section
              title="Charges" query={charges} empty="No charges yet."
              columns={["Type", "Amount", "Status", "Ref", "Created"]}
              renderRow={(c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.charge_type}</TableCell>
                  <TableCell>${Number(c.amount).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={c.status === "charged" ? "outline" : c.status === "failed" ? "destructive" : "secondary"}>{c.status}</Badge></TableCell>
                  <TableCell className="font-mono text-[11px]">{c.shopify_charge_ref || "—"}</TableCell>
                  <TableCell>{fmtDate(c.created_at)}</TableCell>
                </TableRow>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg">Members</h2>
            <EnrollMemberDialog />
          </div>
          <Section
            title="Members" query={members} empty="No members yet."
            columns={["Member", "Tier", "Free/cycle", "Keep/cycle", "Status", "Started"]}
            renderRow={(m) => (
              <TableRow key={m.id} className="cursor-pointer" onClick={() => setDrillId(m.id)}>
                <TableCell>
                  <span className="block hover:underline">{m.full_name || m.email || "Member"}</span>
                  {m.email && m.full_name && <span className="block text-[11px] text-muted-foreground">{m.email}</span>}
                  {!m.email && <span className="block font-mono text-[11px] text-muted-foreground">{m.shopify_customer_id}</span>}
                </TableCell>
                <TableCell>{m.membership_tier ? (TIER_LABELS[m.membership_tier] ?? m.membership_tier) : "—"}</TableCell>
                <TableCell>{m.free_items_per_cycle}</TableCell>
                <TableCell>{m.keep_allowance_per_cycle}</TableCell>
                <TableCell><Badge variant={m.membership_status === "active" ? "outline" : "secondary"}>{m.membership_status}</Badge></TableCell>
                <TableCell>{fmtDate(m.membership_started_at)}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>
      </Tabs>

      <MemberDrilldown accountId={drillId} onClose={() => setDrillId(null)} />
    </div>
  );
}
