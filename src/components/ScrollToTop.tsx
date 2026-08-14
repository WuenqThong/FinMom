import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets window scroll when the route changes (React Router does not do this by default). */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
