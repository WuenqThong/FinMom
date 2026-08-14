import { hasAuthSession } from "@/lib/authSession";

export const MARKETPLACE_APP_PATH = "/marketplace/app";

/** Use for CTAs from public pages: go straight to app if session exists, else login with redirect. */
export function exploreMarketplaceHref(): string {
  if (hasAuthSession()) return MARKETPLACE_APP_PATH;
  return `/login?redirect=${encodeURIComponent(MARKETPLACE_APP_PATH)}`;
}
