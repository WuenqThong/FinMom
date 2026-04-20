import { useLayoutEffect, useMemo } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { TrendingUp, Bot, BookOpen, User, Circle, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategyAnalysisDisplay } from "@/components/trading/StrategyAnalysisDisplay";
import { readLastRagSession } from "@/lib/ragApi";
import { readRuleEngineUiSession } from "@/lib/ruleEngineUiSession";

const VALID_TABS = ["overview", "rules"] as const;
type ProfileTab = (typeof VALID_TABS)[number];

function isProfileTab(s: string | null): s is ProfileTab {
  return s === "overview" || s === "rules";
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: ProfileTab = useMemo(() => {
    const t = searchParams.get("tab");
    return isProfileTab(t) ? t : "overview";
  }, [searchParams]);

  const setTab = (v: ProfileTab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", v);
        return next;
      },
      { replace: true },
    );
  };

  const ragId = readLastRagSession()?.ragId?.trim() ?? null;
  const session = readRuleEngineUiSession(ragId);
  const finalAnalysis = session?.finalAnalysis?.trim() ? session.finalAnalysis : null;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="trading-root flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-2.5">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 justify-self-start">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="finwise-logo-text text-base font-bold tracking-tight">FinWise</span>
          </Link>

          <nav className="flex justify-center">
            <div className="flex items-center gap-0 rounded-full border border-primary/25 bg-primary/15 p-0.5">
              <NavLink
                to="/rule-engine-and-analysis"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? "bg-background/80 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                Rule Engine &amp; Analysis
              </NavLink>
              <NavLink
                to="/trading"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? "bg-background/80 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <Bot className="h-3.5 w-3.5 shrink-0" />
                Trading
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? "bg-background/80 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                Profile
              </NavLink>
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2 justify-self-end">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 sm:flex">
              <Circle className="h-1.5 w-1.5 animate-pulse fill-emerald-400 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-400">Bot Online</span>
            </div>
            <Button variant="outline" size="sm" className="h-7 rounded-full border-border/50 px-3 text-xs" onClick={() => navigate("/login")}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 pb-8">
        <h1 className="mb-4 text-lg font-bold tracking-tight text-foreground">Profile</h1>

        <Tabs value={activeTab} onValueChange={(v) => setTab(v as ProfileTab)} className="w-full gap-4">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl border border-border/50 bg-card/50 p-1 sm:inline-flex sm:w-auto">
            <TabsTrigger value="overview" className="rounded-lg px-4 text-xs sm:text-sm">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="rules" className="rounded-lg px-4 text-xs sm:text-sm">
              Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 outline-none">
            <Card className="glass-panel border-border/50">
              <CardContent className="space-y-2 p-5">
                <p className="text-sm font-semibold text-foreground">Tài khoản (mock)</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Khu vực này dành cho thông tin người dùng, bảo mật và cài đặt — đang được hoàn thiện. Tab{" "}
                  <span className="font-medium text-primary">Rules</span> hiển thị phân tích AI từ Rule Engine khi bạn đã xác nhận
                  chiến lược.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="mt-0 outline-none">
            {finalAnalysis ? (
              <Card className="glass-panel relative overflow-hidden border-primary/15 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.2)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/25 bg-primary/15">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Phân tích AI cuối</p>
                  </div>
                  <div className="max-h-[min(70vh,560px)] min-h-[200px] overflow-y-auto rounded-lg border border-border/50 bg-card p-3 trading-scroll">
                    <StrategyAnalysisDisplay text={finalAnalysis} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 bg-card/40">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Chưa có phân tích AI cho phiên hiện tại. Hoàn thành Rule Engine (bước 3) và xác nhận rule để lưu phân tích vào đây.
                  </p>
                  <Button asChild className="mt-4 h-9 rounded-full text-xs" size="sm">
                    <Link to="/rule-engine-and-analysis">Đến Rule Engine</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
