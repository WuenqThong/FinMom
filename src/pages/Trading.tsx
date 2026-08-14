import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { AppShellHeader, WorkspaceBotStatusPill } from "@/components/layout/AppShellHeader";
import { SheetClose } from "@/components/ui/sheet";
import {
  TradingMainContainer,
  type OrderTab,
  type RightTab,
} from "@/components/trading/TradingMainContainer";
import { fetchBotHistory, isApiConfigured, type BotHistoryItem } from "@/lib/ragApi";
import { clearAuthSession } from "@/lib/authSession";

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
      <AppShellHeader
        mobileSheetExtras={
          <SheetClose asChild>
            <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/60">
              Home
            </Link>
          </SheetClose>
        }
        trailing={
          <>
            <WorkspaceBotStatusPill />
            <Button asChild variant="outline" size="sm" className="h-7 rounded-full border-border/50 px-3 text-xs">
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-full border-border/50 px-3 text-xs"
              onClick={() => {
                clearAuthSession();
                navigate("/login");
              }}
            >
              Đăng xuất
            </Button>
          </>
        }
      />

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
