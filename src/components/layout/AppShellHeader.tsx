import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Bot, Circle, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandLogoLink } from "@/components/layout/BrandLogoLink";
import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const sheetLinkCls = (active: boolean) =>
  cn(
    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/60",
    active && "bg-muted/50 text-foreground",
  );

/** Header for workspace pages: logo, trailing actions, and a menu (Rule Engine / Trading) in a sheet. */
export function AppShellHeader({
  trailing,
  mobileSheetExtras,
}: {
  trailing?: ReactNode;
  mobileSheetExtras?: ReactNode;
}) {
  const { pathname } = useLocation();
  const tradingRouteActive = pathname === "/trading" || pathname === "/tranding";
  const ruleEngineActive =
    pathname === "/rule-engine-and-analysis" || pathname.startsWith("/rule-engine-and-analysis/");

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[100vw] items-center justify-between gap-3 px-3 py-2.5 sm:px-5">
        <BrandLogoLink className="min-w-0 shrink-0" />

        <Sheet>
          <div className="flex items-center justify-end gap-2">
            {trailing}
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full border-border/50"
                aria-label="Mở menu"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="flex w-[min(100vw-2rem,20rem)] flex-col gap-0 p-4 pt-10">
            <SheetHeader className="mb-2 text-left">
              <SheetTitle>Điều hướng</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 border-t border-border/50 pt-3" aria-label="Workspace">
              <SheetClose asChild>
                <NavLink
                  to="/rule-engine-and-analysis"
                  className={({ isActive }) => sheetLinkCls(isActive || ruleEngineActive)}
                >
                  <BookOpen className="h-4 w-4 text-primary" aria-hidden />
                  Rule Engine &amp; Analysis
                </NavLink>
              </SheetClose>
              <SheetClose asChild>
                <NavLink to="/trading" end className={({ isActive }) => sheetLinkCls(isActive || tradingRouteActive)}>
                  <Bot className="h-4 w-4 text-primary" aria-hidden />
                  Trading
                </NavLink>
              </SheetClose>
              {mobileSheetExtras}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function WorkspaceBotStatusPill() {
  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 sm:flex">
      <Circle className="h-1.5 w-1.5 animate-pulse fill-emerald-400 text-emerald-400" aria-hidden />
      <span className="text-[11px] font-semibold text-emerald-400">Bot Online</span>
    </div>
  );
}
