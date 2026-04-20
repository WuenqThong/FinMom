import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { TrendingUp, Bot, BookOpen, Circle, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  TradingMainContainer,
  type OrderTab,
  type RightTab,
} from "@/components/trading/TradingMainContainer";
import { fetchBotHistory, isApiConfigured, type BotHistoryItem } from "@/lib/ragApi";

export default function TradingPage() {
  const navigate = useNavigate();

  const [botHistory, setBotHistory] = useState<BotHistoryItem[]>([]);
  const [botHistoryLoading, setBotHistoryLoading] = useState(false);
  const [botHistoryError, setBotHistoryError] = useState<string | null>(null);
  const [orderTab, setOrderTab] = useState<OrderTab>("pending");
  const [rightTab, setRightTab] = useState<RightTab>("orders");

  useEffect(() => {
    if (!isApiConfigured()) {
      setBotHistory([]);
      setBotHistoryError(null);
      setBotHistoryLoading(false);
      return;
    }
    let cancelled = false;
    setBotHistoryLoading(true);
    setBotHistoryError(null);
    void fetchBotHistory()
      .then((rows) => {
        if (!cancelled) setBotHistory(rows);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Không tải được /botHistory";
          setBotHistoryError(msg);
          setBotHistory([]);
        }
      })
      .finally(() => {
        if (!cancelled) setBotHistoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isClosedBotStatus = (s: string | null | undefined) => {
    const u = (s ?? "").trim().toUpperCase();
    return u === "SUCCESS" || u === "FAILED";
  };

  const botHistoryPending = useMemo(
    () => botHistory.filter((b) => !isClosedBotStatus(b.status)),
    [botHistory],
  );
  const botHistoryClosed = useMemo(
    () => botHistory.filter((b) => isClosedBotStatus(b.status)),
    [botHistory],
  );

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

      <section
        aria-label="Bảng điều khiển bot và vị thế"
        className="flex min-h-0 min-w-0 flex-1 flex-col p-3 lg:h-[calc(100vh-49px)] lg:overflow-hidden"
      >
        <TradingMainContainer
          rightTab={rightTab}
          setRightTab={setRightTab}
          orderTab={orderTab}
          setOrderTab={setOrderTab}
          botHistoryLoading={botHistoryLoading}
          botHistoryError={botHistoryError}
          botHistoryPending={botHistoryPending}
          botHistoryClosed={botHistoryClosed}
        />
      </section>
    </div>
  );
}
