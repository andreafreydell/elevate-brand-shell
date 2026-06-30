import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

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
  wishlist: unknown;
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
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | undefined>(undefined);

// Customer authentication via Supabase Auth (email/password + Google). This is
// entirely separate from the staff/admin context (useAuth) — they happen to share
// the same Supabase session, but this context is what the storefront uses to know
// who the shopper is and read their profile.
export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState<AuthModalState>({ open: false, mode: "login", intent: null });

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, shopify_customer_id, membership_tier, membership_status, is_founding_member, wishlist")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as CustomerProfile) ?? null);
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
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(session?.user?.id);
  }, [loadProfile, session?.user?.id]);

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
