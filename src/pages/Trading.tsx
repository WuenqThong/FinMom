import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo, type DragEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Bot, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TradingAnalysisContainer } from "@/components/trading/TradingAnalysisContainer";
import {
  TradingMainContainer,
  type OrderTab,
  type RightTab,
} from "@/components/trading/TradingMainContainer";
import { TradingUploadContainer, type StrategyState } from "@/components/trading/TradingUploadContainer";
import { getAnalyze, isApiConfigured, uploadRag, fetchBotHistory, type BotHistoryItem } from "@/lib/ragApi";

export default function TradingPage() {
  const navigate = useNavigate();

  const [strat, setStrat] = useState<StrategyState>("idle");
  const [stratFile, setStratFile] = useState<string | null>(null);
  const [isDrag, setIsDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [botHistory, setBotHistory] = useState<BotHistoryItem[]>([]);
  const [botHistoryLoading, setBotHistoryLoading] = useState(false);
  const [botHistoryError, setBotHistoryError] = useState<string | null>(null);
  const [orderTab, setOrderTab] = useState<OrderTab>("pending");
  const [rightTab, setRightTab] = useState<RightTab>("orders");

  const [analyzeText, setAnalyzeText] = useState<string | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const analyzeEndRef = useRef<HTMLDivElement>(null);

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

  /** Chỉ cuộn tới cuối vùng phân tích khi đã có nội dung — không gọi khi analyzeText còn null (tránh kéo cả trang xuống đáy lúc mở trang). */
  useEffect(() => {
    if (!analyzeText) return;
    analyzeEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [analyzeText]);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setStrat("error");
      return;
    }
    if (!isApiConfigured()) {
      setAnalyzeError("Thiếu biến môi trường VITE_API_BASE_URL (URL backend).");
      return;
    }
    setStratFile(file.name);
    setStrat("processing");
    setAnalyzeText(null);
    setAnalyzeError(null);
    try {
      const id = await uploadRag(file);
      const text = await getAnalyze(id);
      setAnalyzeText(text.trim() || "(Không có nội dung phân tích.)");
      setStrat("loaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setAnalyzeError(msg);
      setStrat("idle");
      setStratFile(null);
    }
  }, []);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) void processFile(f);
  };

  const resetStrategy = () => {
    setStrat("idle");
    setStratFile(null);
    setAnalyzeText(null);
    setAnalyzeError(null);
  };

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
            <Link
              to="/trading"
              className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary"
            >
              <Bot className="h-3.5 w-3.5" />
              Trading
            </Link>
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

      {/* 3 vùng: Upload | Analysis (cột trái) · Main (cột phải) — mobile: xếp dọc; lg+: 2 cột */}
      <div
        className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:h-[calc(100vh-49px)] lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[500px_minmax(0,1fr)]"
      >
        {/* Cột trái: container Upload + Analysis */}
        <section
          aria-label="Tải chiến lược và phân tích"
          className="flex min-h-0 flex-col gap-4 lg:min-h-0 lg:overflow-hidden lg:gap-5"
        >
          <TradingUploadContainer
            strat={strat}
            setStrat={setStrat}
            isDrag={isDrag}
            setIsDrag={setIsDrag}
            fileRef={fileRef}
            stratFile={stratFile}
            processFile={processFile}
            onDrop={onDrop}
            resetStrategy={resetStrategy}
          />
          <TradingAnalysisContainer
            strat={strat}
            analyzeText={analyzeText}
            analyzeError={analyzeError}
            analyzeEndRef={analyzeEndRef}
          />
        </section>

        {/* Cột phải: Main (tabs + nội dung) */}
        <section aria-label="Bảng điều khiển bot và vị thế" className="flex min-h-0 min-w-0 flex-col lg:overflow-hidden">
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
    </div>
  );
}
