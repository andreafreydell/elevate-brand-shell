import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { useMemberEntitlement } from "@/hooks/useMemberEntitlement";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Member RETURN SHIPMENT flow: shows the pieces she has out, whether the
// return window is open, and lets her declare — per piece — return vs keep.
// Keeps finalize immediately (over-allowance keeps become chargeable); the
// declared returns become the expected contents of her return box.

const OUT_STATUSES = ["assigned", "released_to_wms", "shipped", "return_open"] as const;

interface OutPiece {
  id: string;
  serial_number: string;
  product_title: string | null;
  sku: string | null;
  internal_status: string;
  is_free_item: boolean | null;
  item_price_cache: number | null;
}

type Choice = "return" | "keep" | undefined;

const Returns = () => {
  const { isSignedIn, profile, openAuthModal, session } = useCustomerAuth();
  const { cycle, returnWindowOpen, memberActive, isEntitled, freeLeft, tier } = useMemberEntitlement();
  const queryClient = useQueryClient();
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: pieces, isLoading } = useQuery({
    queryKey: ["member-out-pieces", profile?.id],
    enabled: Boolean(isSignedIn && profile?.id),
    queryFn: async (): Promise<OutPiece[]> => {
      const { data, error } = await supabase
        .from("rental_reservations")
        .select("id, serial_number, product_title, sku, internal_status, is_free_item, item_price_cache")
        .eq("account_id", profile!.id)
        .in("internal_status", [...OUT_STATUSES]);
      if (error) throw error;
      return (data as OutPiece[]) || [];
    },
  });

  const keepAllowanceLeft = useMemo(() => {
    if (!cycle) return 0;
    return Math.max(0, (cycle.keep_allowance ?? 0) - (cycle.keep_count ?? 0));
  }, [cycle]);

  const chosenKeeps = Object.values(choices).filter((c) => c === "keep").length;
  const chosenReturns = Object.values(choices).filter((c) => c === "return").length;
  const extraKeeps = Math.max(0, chosenKeeps - keepAllowanceLeft);

  const setChoice = (serial: string, choice: Choice) =>
    setChoices((prev) => ({ ...prev, [serial]: prev[serial] === choice ? undefined : choice }));

  const submit = async () => {
    if (!session?.access_token) return;
    const return_serials = Object.entries(choices).filter(([, c]) => c === "return").map(([s]) => s);
    const keep_serials = Object.entries(choices).filter(([, c]) => c === "keep").map(([s]) => s);
    if (return_serials.length === 0 && keep_serials.length === 0) {
      toast.error("Choose return or keep for at least one piece");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gea-member-return`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ return_serials, keep_serials }),
        },
      );
      const body = await res.json();
      if (!res.ok || body.errors?.length) {
        toast.error("Something didn't go through — our concierge has been notified.");
        console.error("member return errors:", body);
      } else {
        setSubmitted(true);
        queryClient.invalidateQueries({ queryKey: ["member-out-pieces"] });
        queryClient.invalidateQueries({ queryKey: ["member-current-cycle"] });
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't submit your return — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="bg-foreground relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-6 md:py-10">
          <h1 className="font-serif text-2xl md:text-4xl font-medium text-background">Return Shipment</h1>
          <p className="mt-1 text-[11px] md:text-[13px] font-sans text-background/60">
            Send back what's ready to fly home — keep what you can't part with.
          </p>
        </div>
      </section>

      <section className="max-w-[760px] mx-auto px-5 sm:px-6 py-10 md:py-14">
        {!isSignedIn ? (
          <div className="border border-border bg-card p-8 text-center">
            <p className="font-serif text-xl mb-3">Sign in to manage your pieces</p>
            <p className="font-sans text-[12px] text-muted-foreground mb-6">
              Your return shipment lives in your member account.
            </p>
            <button
              onClick={() => openAuthModal({ mode: "login", intent: "account" })}
              className="border border-foreground bg-foreground px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-sans text-background hover:bg-transparent hover:text-foreground transition-colors"
            >
              Log In
            </button>
          </div>
        ) : !memberActive ? (
          <div className="border border-border bg-card p-8 text-center">
            <p className="font-serif text-xl mb-3">No active membership yet</p>
            <p className="font-sans text-[12px] text-muted-foreground mb-6">
              Returns are part of the membership journey — begin yours and the vault opens.
            </p>
            <Link
              to="/how-it-works"
              className="inline-block border border-foreground bg-foreground px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-sans text-background hover:bg-transparent hover:text-foreground transition-colors"
            >
              See Membership
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : submitted ? (
          <div className="border border-border bg-card p-8 text-center" style={{ borderTop: "2px solid var(--poppy)" }}>
            <p className="text-[1.35rem] mb-2" style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}>
              your return is on its way ✿
            </p>
            <p className="font-sans text-[13px] leading-relaxed text-muted-foreground max-w-[440px] mx-auto">
              We've noted what's coming home and what's staying with you. Pack the returning
              pieces in their box — your shipping instructions arrive by email shortly.
            </p>
            {isEntitled && (
              <Link to="/browse" className="cta-underline mt-6 inline-block">
                Pick your next pieces ✿
              </Link>
            )}
          </div>
        ) : (pieces || []).length === 0 ? (
          <div className="border border-border bg-card p-8 text-center">
            <p className="font-serif text-xl mb-3">Nothing to return right now</p>
            <p className="font-sans text-[12px] text-muted-foreground mb-6">
              {isEntitled
                ? `Your cycle is open — you have ${freeLeft} included piece${freeLeft === 1 ? "" : "s"} to pick.`
                : "When your pieces ship, they'll appear here."}
            </p>
            {isEntitled && (
              <Link
                to="/browse"
                className="inline-block border border-foreground bg-foreground px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-sans text-background hover:bg-transparent hover:text-foreground transition-colors"
              >
                Pick Your Pieces
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Window state */}
            <div
              className="mb-8 border border-dashed bg-card px-6 py-4 text-center"
              style={{ borderColor: "var(--poppy)" }}
            >
              {returnWindowOpen ? (
                <p className="font-sans text-[12px] text-foreground">
                  <span className="font-medium uppercase tracking-[0.18em]">Your return window is open</span>
                  <span aria-hidden="true" className="mx-2" style={{ color: "var(--poppy-deep)" }}>✿</span>
                  send pieces back now and your next set unlocks.
                </p>
              ) : (
                <p className="font-sans text-[12px] text-foreground">
                  <span className="font-medium uppercase tracking-[0.18em]">
                    Return opens {cycle ? new Date(cycle.cycle_end).toLocaleDateString(undefined, { month: "long", day: "numeric" }) : "at cycle end"}
                  </span>
                  <span aria-hidden="true" className="mx-2" style={{ color: "var(--poppy-deep)" }}>✿</span>
                  wear them everywhere until then — or declare early below.
                </p>
              )}
            </div>

            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-xl md:text-2xl">Your pieces out</h2>
              <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                {tier} · keep {keepAllowanceLeft} more included
              </p>
            </div>

            <div className="divide-y divide-border border border-border bg-card">
              {(pieces || []).map((piece) => {
                const choice = choices[piece.serial_number];
                return (
                  <div key={piece.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-serif text-[15px] leading-snug">{piece.product_title || piece.sku || piece.serial_number}</p>
                      <p className="font-sans text-[10px] tracking-[0.16em] uppercase text-muted-foreground mt-1">
                        Ref {piece.serial_number}
                        {piece.item_price_cache ? ` · $${Number(piece.item_price_cache).toFixed(2)} list` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setChoice(piece.serial_number, "return")}
                        className={`border px-4 py-2 font-sans text-[10px] tracking-[0.18em] uppercase transition-colors ${
                          choice === "return"
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-foreground hover:border-foreground"
                        }`}
                      >
                        Returning
                      </button>
                      <button
                        type="button"
                        onClick={() => setChoice(piece.serial_number, "keep")}
                        className="border px-4 py-2 font-sans text-[10px] tracking-[0.18em] uppercase transition-colors"
                        style={
                          choice === "keep"
                            ? { borderColor: "var(--poppy-deep)", background: "var(--poppy-deep)", color: "#fff" }
                            : { borderColor: "var(--poppy)", color: "var(--poppy-deep)", background: "var(--rose-soft)" }
                        }
                      >
                        Keeping ✿
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Keep math */}
            {chosenKeeps > 0 && (
              <p className="mt-4 font-sans text-[12px] leading-relaxed text-muted-foreground">
                Keeping {chosenKeeps} piece{chosenKeeps === 1 ? "" : "s"}
                {extraKeeps > 0 ? (
                  <>
                    {" "}— {chosenKeeps - extraKeeps} included in your membership,{" "}
                    <span className="text-foreground font-medium">
                      {extraKeeps} extra at 60% off list price
                    </span>{" "}
                    (charged after your return is received).
                  </>
                ) : (
                  <> — all included in your membership ✿</>
                )}
              </p>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={submitting || (chosenReturns === 0 && chosenKeeps === 0)}
              className="mt-8 w-full border border-foreground bg-foreground py-3.5 text-[11px] tracking-[0.22em] uppercase font-sans text-background transition-colors hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Confirm Return & Keeps"}
            </button>
            <p className="mt-3 text-center font-sans text-[11px] text-muted-foreground">
              Shipping instructions and your return label follow by email. Free both ways, always ✿
            </p>
          </>
        )}
      </section>
    </PageLayout>
  );
};

export default Returns;
