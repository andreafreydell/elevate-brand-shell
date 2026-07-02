import { useEffect, useState } from "react";
import { CalendarClock, Gem, Package, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { GrainOverlay } from "@/components/craft/GrainOverlay";

interface CycleRow {
  cycle_number: number;
  cycle_end: string;
  free_items_allowance: number;
  free_used: number;
  checkout_count: number;
  keep_allowance: number;
  keep_count: number;
}

const TIER_LABELS: Record<string, string> = {
  seed: "Seed",
  blossom: "Blossom",
  garden: "Garden",
  three_piece: "Seed",
  six_piece: "Blossom",
  ten_piece: "Garden",
};

const Stat = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gem;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 stroke-[1.4] text-[hsl(36,25%,78%)]" />
    <div>
      <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[hsl(36,20%,70%)]">
        {label}
      </p>
      <p className="font-serif text-lg leading-tight text-[hsl(36,33%,93%)]">{value}</p>
    </div>
  </div>
);

/**
 * "Current Cycle" summary shown at the top of /account for a signed-in member
 * with an active membership. Reads the member's latest rental_cycles row (RLS
 * scopes it to their own account) for allowances/usage and computes days left.
 */
export const CurrentCycleCard = () => {
  const { profile, isSignedIn } = useCustomerAuth();
  const [cycle, setCycle] = useState<CycleRow | null>(null);
  const [loading, setLoading] = useState(true);

  const isActiveMember =
    isSignedIn && profile?.membership_status === "active";

  useEffect(() => {
    let active = true;
    if (!isActiveMember || !profile?.id) {
      setCycle(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("rental_cycles")
        .select(
          "cycle_number, cycle_end, free_items_allowance, free_used, checkout_count, keep_allowance, keep_count",
        )
        .eq("account_id", profile.id)
        .order("cycle_number", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (active) {
        setCycle((data as CycleRow) ?? null);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isActiveMember, profile?.id]);

  if (!isActiveMember || loading || !cycle) return null;

  const tierLabel = profile?.membership_tier
    ? TIER_LABELS[profile.membership_tier] ?? profile.membership_tier
    : "Member";

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(cycle.cycle_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
  );

  const freeUsed = Math.min(
    cycle.free_items_allowance,
    Math.max(cycle.free_used ?? 0, cycle.checkout_count ?? 0),
  );

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-4 sm:px-6 md:px-12 lg:px-16">
      <div className="relative overflow-hidden border border-border bg-[hsl(28,22%,34%)]">
        <GrainOverlay opacity={0.05} />
        <div className="relative z-[1] p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between border-b border-[hsl(36,25%,78%)]/20 pb-4">
            <div>
              <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.3em] text-[hsl(36,25%,78%)]">
                Current Cycle
              </p>
              <h2 className="font-serif text-2xl font-medium text-[hsl(36,33%,93%)]">
                {tierLabel} Membership
              </h2>
            </div>
            <span className="shrink-0 border border-[hsl(36,25%,78%)]/40 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-[hsl(36,25%,78%)]">
              Cycle {cycle.cycle_number}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Stat
              icon={CalendarClock}
              label="Days Remaining"
              value={`${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`}
            />
            <Stat
              icon={Package}
              label="Free Items Used"
              value={`${freeUsed} / ${cycle.free_items_allowance}`}
            />
            <Stat
              icon={Gem}
              label="Keeps Used"
              value={`${cycle.keep_count ?? 0} / ${cycle.keep_allowance}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
