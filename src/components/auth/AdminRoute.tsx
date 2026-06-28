import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Guards /admin/* routes: requires a signed-in Supabase user who is in the staff
// allowlist. Non-staff are sent to the admin login.
export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { session, isStaff, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[12px] tracking-[0.2em] uppercase font-sans text-muted-foreground">
          Loading…
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-2xl">Not authorized</h1>
        <p className="text-[13px] text-muted-foreground font-sans max-w-md">
          This account isn’t on the GEA team allowlist. Ask an administrator to add you to the
          <code className="mx-1">staff</code> table.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
