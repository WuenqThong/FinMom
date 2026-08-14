import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasAuthSession } from "@/lib/authSession";

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!hasAuthSession()) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <>{children}</>;
}
