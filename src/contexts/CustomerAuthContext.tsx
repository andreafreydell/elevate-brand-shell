import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

// A single saved "Occasion" inside profiles.wishlist. Each holds an array of
// Shopify product handles the shopper has saved to it.
export interface WishlistOccasion {
  id: string;
  name: string;
  created_at: string;
  items: string[];
}

interface WishlistShape {
  occasions: WishlistOccasion[];
}

// Shopper-facing profile. One row per auth user, auto-created by the signup
// trigger (handle_new_user). We only read the fields the storefront needs.
export interface CustomerProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  shopify_customer_id: string | null;
  membership_tier: string | null;
  membership_status: string | null;
  is_founding_member: boolean | null;
  wishlist: WishlistShape | null;
}

// What triggered the auth modal, so we can show a contextual line.
export type AuthIntent = "favorites" | "checkout" | "account" | null;
type AuthMode = "signup" | "login";

interface AuthModalState {
  open: boolean;
  mode: AuthMode;
  intent: AuthIntent;
}

interface CustomerAuthContextValue {
  session: Session | null;
  user: User | null;
  profile: CustomerProfile | null;
  loading: boolean;
  isSignedIn: boolean;
  authModal: AuthModalState;
  openAuthModal: (opts?: { mode?: AuthMode; intent?: AuthIntent }) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthMode) => void;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Wishlist / Occasions
  wishlist: WishlistOccasion[];
  isInWishlist: (handle: string) => boolean;
  occasionsForHandle: (handle: string) => string[];
  createOccasion: (name: string, handle?: string) => Promise<WishlistOccasion | null>;
  renameOccasion: (id: string, name: string) => Promise<void>;
  deleteOccasion: (id: string) => Promise<void>;
  toggleProductInOccasion: (occasionId: string, handle: string) => Promise<void>;
  removeProductFromOccasion: (occasionId: string, handle: string) => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | undefined>(undefined);

function parseWishlist(raw: unknown): WishlistOccasion[] {
  const occasions = (raw as WishlistShape | null)?.occasions;
  if (!Array.isArray(occasions)) return [];
  return occasions
    .filter((o): o is WishlistOccasion => Boolean(o) && typeof o.id === "string")
    .map((o) => ({
      id: o.id,
      name: o.name ?? "Untitled",
      created_at: o.created_at ?? new Date().toISOString(),
      items: Array.isArray(o.items) ? o.items.filter((i) => typeof i === "string") : [],
    }));
}

// Customer authentication via Supabase Auth (email/password + Google). This is
// entirely separate from the staff/admin context (useAuth) — they happen to share
// the same Supabase session, but this context is what the storefront uses to know
// who the shopper is and read their profile.
export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [wishlist, setWishlist] = useState<WishlistOccasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState<AuthModalState>({ open: false, mode: "login", intent: null });

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setWishlist([]);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, shopify_customer_id, membership_tier, membership_status, is_founding_member, wishlist")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as unknown as CustomerProfile) ?? null);
    setWishlist(parseWishlist((data as { wishlist?: unknown } | null)?.wishlist));
  }, []);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      // Defer the profile read so we don't run async work inside the callback.
      setTimeout(() => loadProfile(nextSession?.user?.id), 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user?.id);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const openAuthModal: CustomerAuthContextValue["openAuthModal"] = useCallback((opts) => {
    setAuthModal({ open: true, mode: opts?.mode ?? "login", intent: opts?.intent ?? null });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal((prev) => ({ ...prev, open: false }));
  }, []);

  const setAuthMode = useCallback((mode: AuthMode) => {
    setAuthModal((prev) => ({ ...prev, mode }));
  }, []);

  const signUpWithEmail: CustomerAuthContextValue["signUpWithEmail"] = useCallback(
    async (email, password, fullName) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });
      if (error) return { error: error.message, needsConfirmation: false };
      // No session means email confirmation is required before sign-in.
      return { error: null, needsConfirmation: !data.session };
    },
    [],
  );

  const signInWithEmail: CustomerAuthContextValue["signInWithEmail"] = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const signInWithGoogle: CustomerAuthContextValue["signInWithGoogle"] = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return { error: result.error.message };
    // result.redirected → browser is navigating to Google; otherwise the session
    // is already set and onAuthStateChange will pick it up.
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setWishlist([]);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(session?.user?.id);
  }, [loadProfile, session?.user?.id]);

  // Persist the given occasions array to profiles.wishlist with optimistic UI:
  // the caller has already set local state; we revert if the write fails.
  const persistWishlist = useCallback(
    async (next: WishlistOccasion[], previous: WishlistOccasion[], successMsg?: string) => {
      const uid = session?.user?.id;
      if (!uid) return;
      const { error } = await supabase
        .from("profiles")
        .update({ wishlist: { occasions: next } })
        .eq("id", uid);
      if (error) {
        setWishlist(previous);
        toast.error("Could not save — please try again.", { position: "top-center" });
        return;
      }
      if (successMsg) toast.success(successMsg, { position: "top-center" });
    },
    [session?.user?.id],
  );

  const isInWishlist = useCallback(
    (handle: string) => wishlist.some((o) => o.items.includes(handle)),
    [wishlist],
  );

  const occasionsForHandle = useCallback(
    (handle: string) => wishlist.filter((o) => o.items.includes(handle)).map((o) => o.id),
    [wishlist],
  );

  const createOccasion = useCallback<CustomerAuthContextValue["createOccasion"]>(
    async (name, handle) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const occasion: WishlistOccasion = {
        id: (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`),
        name: trimmed,
        created_at: new Date().toISOString(),
        items: handle ? [handle] : [],
      };
      const previous = wishlist;
      const next = [...wishlist, occasion];
      setWishlist(next);
      await persistWishlist(next, previous, handle ? `Saved to “${trimmed}”` : `Created “${trimmed}”`);
      return occasion;
    },
    [wishlist, persistWishlist],
  );

  const renameOccasion = useCallback<CustomerAuthContextValue["renameOccasion"]>(
    async (id, name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const previous = wishlist;
      const next = wishlist.map((o) => (o.id === id ? { ...o, name: trimmed } : o));
      setWishlist(next);
      await persistWishlist(next, previous, "Occasion renamed");
    },
    [wishlist, persistWishlist],
  );

  const deleteOccasion = useCallback<CustomerAuthContextValue["deleteOccasion"]>(
    async (id) => {
      const previous = wishlist;
      const next = wishlist.filter((o) => o.id !== id);
      setWishlist(next);
      await persistWishlist(next, previous, "Occasion deleted");
    },
    [wishlist, persistWishlist],
  );

  const toggleProductInOccasion = useCallback<CustomerAuthContextValue["toggleProductInOccasion"]>(
    async (occasionId, handle) => {
      const target = wishlist.find((o) => o.id === occasionId);
      if (!target) return;
      const has = target.items.includes(handle);
      const previous = wishlist;
      const next = wishlist.map((o) =>
        o.id === occasionId
          ? { ...o, items: has ? o.items.filter((i) => i !== handle) : [...o.items, handle] }
          : o,
      );
      setWishlist(next);
      await persistWishlist(next, previous, has ? `Removed from “${target.name}”` : `Saved to “${target.name}”`);
    },
    [wishlist, persistWishlist],
  );

  const removeProductFromOccasion = useCallback<CustomerAuthContextValue["removeProductFromOccasion"]>(
    async (occasionId, handle) => {
      const target = wishlist.find((o) => o.id === occasionId);
      if (!target || !target.items.includes(handle)) return;
      const previous = wishlist;
      const next = wishlist.map((o) =>
        o.id === occasionId ? { ...o, items: o.items.filter((i) => i !== handle) } : o,
      );
      setWishlist(next);
      await persistWishlist(next, previous, "Removed");
    },
    [wishlist, persistWishlist],
  );

  return (
    <CustomerAuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        isSignedIn: Boolean(session?.user),
        authModal,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        refreshProfile,
        wishlist,
        isInWishlist,
        occasionsForHandle,
        createOccasion,
        renameOccasion,
        deleteOccasion,
        toggleProductInOccasion,
        removeProductFromOccasion,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
};
