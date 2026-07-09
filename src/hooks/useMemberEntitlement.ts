import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

// The signed-in member's live cycle state, read via their own RLS policies.
// Drives the "Included in your membership ✿" pricing display, the promo-bar
// call-to-action, and the /returns page window logic.

export interface MemberCycle {
  id: string;
  cycle_number: number;
  cycle_start: string;
  cycle_end: string;
  status: string;
  free_items_allowance: number | null;
  keep_allowance: number | null;
  free_used: number | null;
  keep_count: number | null;
  cycle_tag_applied: boolean | null;
  tag_removed_at: string | null;
}

export function useMemberEntitlement() {
  const { isSignedIn, profile } = useCustomerAuth();

  const memberActive = isSignedIn && profile?.membership_status === "active";

  const { data: cycle, isLoading } = useQuery({
    queryKey: ["member-current-cycle", profile?.id],
    enabled: Boolean(memberActive && profile?.id),
    staleTime: 60_000,
    queryFn: async (): Promise<MemberCycle | null> => {
      const { data, error } = await supabase
        .from("rental_cycles")
        .select(
          "id, cycle_number, cycle_start, cycle_end, status, free_items_allowance, keep_allowance, free_used, keep_count, cycle_tag_applied, tag_removed_at",
        )
        .eq("account_id", profile!.id)
        .order("cycle_number", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return (data as MemberCycle | null) ?? null;
    },
  });

  const now = Date.now();
  const cycleOpen = Boolean(cycle && cycle.status === "open");
  // Entitled to free pieces right now: cycle open, discount tag applied and
  // not yet consumed by a checkout this cycle.
  const isEntitled = Boolean(
    memberActive && cycleOpen && cycle?.cycle_tag_applied && !cycle?.tag_removed_at,
  );
  const freeLeft = cycle
    ? Math.max(0, (cycle.free_items_allowance ?? 0) - (cycle.free_used ?? 0))
    : 0;
  // The return window opens when the 30-day cycle ends.
  const returnWindowOpen = Boolean(cycle && new Date(cycle.cycle_end).getTime() <= now);

  return {
    loading: isLoading,
    memberActive,
    tier: profile?.membership_tier ?? null,
    cycle: cycle ?? null,
    cycleOpen,
    isEntitled,
    freeLeft,
    returnWindowOpen,
  };
}
