const AUTH_KEY = "finmom_auth";

/** Minimal stub session for gated routes; replace with real JWT/session later. */
export function setAuthSession() {
  sessionStorage.setItem(AUTH_KEY, "v1");
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_KEY);
}

export function hasAuthSession(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "v1";
}

/** Safe internal navigation targets only; prevents open redirects. */
export function sanitizeRedirectPath(raw: string | null): string | null {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return null;
  if (t.includes("://")) return null;
  return t;
}
