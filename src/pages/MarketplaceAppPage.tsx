import { useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShellHeader, WorkspaceBotStatusPill } from "@/components/layout/AppShellHeader";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { clearAuthSession } from "@/lib/authSession";
import { MarketplaceSearchBar } from "@/components/marketplace/MarketplaceSearchBar";
import { FeaturedMarketplaceGrid } from "@/components/marketplace/FeaturedMarketplaceGrid";
import { CloneToRuleEngineButton } from "@/components/marketplace/CloneToRuleEngineButton";
import { marketplaceCatalog, marketplaceCategoryLabels, categoryStripIds } from "@/data/marketplaceMock";
import { exploreMarketplaceHref } from "@/lib/marketplacePaths";
import type { MarketplaceCategoryId } from "@/data/marketplaceMock";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
function MarketplaceAppContent() {
  const navigate = useNavigate();
  const explore = useMemo(() => exploreMarketplaceHref(), []);
  const [category, setCategory] = useState<MarketplaceCategoryId | "all">("all");

  const filtered = useMemo(() => {
    if (category === "all") return marketplaceCatalog;
    return marketplaceCatalog.filter((p) => p.category === category);
  }, [category]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const logout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <div className="trading-root flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-background text-foreground">
      <AppShellHeader
        mobileSheetExtras={
          <SheetClose asChild>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/60"
            >
              Marketplace landing
            </Link>
          </SheetClose>
        }
        trailing={
          <>
            <Button variant="ghost" size="sm" className="hidden h-7 rounded-full px-2 text-[10px] sm:inline-flex" asChild>
              <Link to="/marketplace">Landing</Link>
            </Button>
            <WorkspaceBotStatusPill />
            <Button variant="outline" size="sm" className="h-7 rounded-full border-border/50 px-3 text-xs" onClick={logout}>
              Đăng xuất
            </Button>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-0">
        <aside
          className="glass-panel flex w-full shrink-0 flex-col gap-4 rounded-2xl border-border/60 p-4 lg:w-64 lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:border-border/50"
          aria-label="Filters preview"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
            Filters (preview)
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            V1 mock: category chips below; full facet filters ship in the next iteration.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-medium",
                category === "all"
                  ? "border-primary/45 bg-primary/15 text-primary"
                  : "border-border/50 text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </button>
            {categoryStripIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-medium",
                  category === id
                    ? "border-primary/45 bg-primary/15 text-primary"
                    : "border-border/50 text-muted-foreground hover:text-foreground",
                )}
              >
                {marketplaceCategoryLabels[id]}
              </button>
            ))}
          </div>
          <div className="mt-auto space-y-2 border-t border-border/50 pt-4">
            <p className="text-[10px] text-muted-foreground">Sort: Trending · New · Top rated</p>
            <CloneToRuleEngineButton className="w-full text-xs" />
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:overflow-y-auto lg:p-4">
          <div className="glass-panel flex flex-col gap-4 rounded-2xl border-border/60 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Marketplace</h1>
                <p className="text-xs text-muted-foreground">
                  Dense product grid — {filtered.length} items (mock catalog).
                </p>
              </div>
              <MarketplaceSearchBar readOnly className="sm:max-w-md" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="glass-panel rounded-2xl border-dashed border-border/60 p-10 text-center">
              <p className="text-sm font-medium">No templates found</p>
              <p className="mt-1 text-xs text-muted-foreground">Reset filters or pick another category.</p>
              <Button type="button" variant="outline" className="mt-4 rounded-full" onClick={() => setCategory("all")}>
                Reset filters
              </Button>
            </div>
          ) : (
            <FeaturedMarketplaceGrid products={filtered} dense exploreHref={explore} className="pb-8" />
          )}
        </main>
      </div>
    </div>
  );
}

export default function MarketplaceAppPage() {
  return (
    <RequireAuth>
      <MarketplaceAppContent />
    </RequireAuth>
  );
}
