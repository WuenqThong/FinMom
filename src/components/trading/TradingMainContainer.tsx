import type { ElementType } from "react";
import { useMemo } from "react";
import {
  Activity,
  Award,
  BarChart2,
  Bot,
  Clock,
  History,
  Layers,
  Loader2,
  Percent,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { BotHistoryTable } from "@/components/trading/BotHistoryTable";
import { FuturesPositionRealtimePanel } from "@/components/trading/FuturesPositionRealtimePanel";
import { isApiConfigured, type BotHistoryItem } from "@/lib/ragApi";

// ─── Types & mock (hiệu suất / lệnh gần đây) ────────────────────────────────
export type OrderTab = "pending" | "active" | "closed";
export type RightTab = "orders" | "analysis" | "performance" | "recent";
type Side = "LONG" | "SHORT";

interface ClosedOrder {
  id: string;
  symbol: string;
  side: Side;
  entryPrice: number;
  exitPrice: number;
  size: number;
  finalPnl: number;
  finalPnlPct: number;
  closedAt: string;
}

const CLOSED: ClosedOrder[] = [
  { id: "c1", symbol: "BTC/USDT", side: "LONG", entryPrice: 67200, exitPrice: 69800, size: 0.05, finalPnl: 130, finalPnlPct: 3.87, closedAt: "Today 09:42" },
  { id: "c2", symbol: "ETH/USDT", side: "SHORT", entryPrice: 3600, exitPrice: 3450, size: 0.8, finalPnl: 120, finalPnlPct: 4.17, closedAt: "Today 07:15" },
  { id: "c3", symbol: "SOL/USDT", side: "LONG", entryPrice: 155, exitPrice: 148, size: 5, finalPnl: -35, finalPnlPct: -4.52, closedAt: "Yesterday" },
  { id: "c4", symbol: "BNB/USDT", side: "LONG", entryPrice: 580, exitPrice: 612, size: 0.3, finalPnl: 9.6, finalPnlPct: 5.52, closedAt: "Yesterday" },
  { id: "c5", symbol: "XRP/USDT", side: "SHORT", entryPrice: 0.528, exitPrice: 0.552, size: 500, finalPnl: -12, finalPnlPct: -4.55, closedAt: "Apr 10" },
  { id: "c6", symbol: "BTC/USDT", side: "LONG", entryPrice: 65400, exitPrice: 67100, size: 0.04, finalPnl: 68, finalPnlPct: 2.6, closedAt: "Apr 10" },
];

function SideBadge({ side }: { side: Side }) {
  const isLong = side === "LONG";
  return (
    <span
      className={`inline-flex h-6 w-[5.25rem] shrink-0 items-center justify-center gap-0.5 rounded-md px-1 text-[9px] font-bold tracking-wide ${
        isLong
          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25"
          : "bg-red-500/15 text-red-400 ring-1 ring-red-500/25"
      }`}
    >
      {isLong ? "▲" : "▼"} {side}
    </span>
  );
}

function PnLValue({ v, p, compact }: { v: number; p: number; compact?: boolean }) {
  const pos = v >= 0;
  return (
    <div className={`font-mono tabular-nums leading-none transition-colors duration-500 ${pos ? "text-emerald-400" : "text-red-400"}`}>
      <span className={compact ? "text-xs font-bold" : "text-sm font-bold"}>
        {pos ? "+" : ""}
        {v.toFixed(2)}$
      </span>
      <span className={`ml-0.5 opacity-70 ${compact ? "text-[9px]" : "text-[10px]"}`}>
        ({pos ? "+" : ""}
        {p.toFixed(2)}%)
      </span>
    </div>
  );
}

function DonutWinRateHero({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative flex h-[148px] w-[148px] shrink-0 items-center justify-center">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/15 blur-2xl" aria-hidden />
      <svg width="148" height="148" viewBox="0 0 148 148" className="relative drop-shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
        <circle cx="74" cy="74" r={r} fill="none" stroke="hsl(220,28%,14%)" strokeWidth="11" />
        <circle
          cx="74"
          cy="74"
          r={r}
          fill="none"
          stroke="hsl(167,100%,48%)"
          strokeWidth="11"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={c * 0.25}
          strokeLinecap="round"
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-3xl font-bold tabular-nums text-primary">{pct}%</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Win rate</span>
      </div>
    </div>
  );
}

export interface TradingMainContainerProps {
  rightTab: RightTab;
  setRightTab: (t: RightTab) => void;
  orderTab: OrderTab;
  setOrderTab: (t: OrderTab) => void;
  botHistoryLoading: boolean;
  botHistoryError: string | null;
  botHistoryPending: BotHistoryItem[];
  botHistoryClosed: BotHistoryItem[];
}

/** Container 3 — Lệnh Bot / Phân tích (Futures) / Hiệu suất / Lệnh gần đây. */
export function TradingMainContainer({
  rightTab,
  setRightTab,
  orderTab,
  setOrderTab,
  botHistoryLoading,
  botHistoryError,
  botHistoryPending,
  botHistoryClosed,
}: TradingMainContainerProps) {
  const totalPnl = CLOSED.reduce((s, o) => s + o.finalPnl, 0);
  const wins = CLOSED.filter((o) => o.finalPnl > 0).length;
  const lossCount = CLOSED.length - wins;
  const winRate = CLOSED.length ? Math.round((wins / CLOSED.length) * 100) : 0;

  const winningTrades = CLOSED.filter((o) => o.finalPnl > 0);
  const losingTrades = CLOSED.filter((o) => o.finalPnl < 0);
  const avgWin = winningTrades.length > 0 ? winningTrades.reduce((s, o) => s + o.finalPnl, 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((s, o) => s + o.finalPnl, 0) / losingTrades.length : 0;
  const bestClosed = CLOSED.length ? Math.max(...CLOSED.map((o) => o.finalPnl)) : 0;
  const worstClosed = CLOSED.length ? Math.min(...CLOSED.map((o) => o.finalPnl)) : 0;
  const winBarPct = CLOSED.length ? (wins / CLOSED.length) * 100 : 0;
  const lossBarPct = CLOSED.length ? (lossCount / CLOSED.length) * 100 : 0;

  const pnlBySymbolSorted = useMemo(() => {
    const m = new Map<string, number>();
    for (const o of CLOSED) {
      m.set(o.symbol, (m.get(o.symbol) ?? 0) + o.finalPnl);
    }
    return [...m.entries()].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  }, []);
  const maxSymbolPnlAbs = Math.max(...pnlBySymbolSorted.map(([, v]) => Math.abs(v)), 1);

  const rightTabs = [
    { k: "orders" as const, l: "Lệnh Bot", icon: Bot },
    { k: "analysis" as const, l: "Phân tích", icon: BarChart2 },
    { k: "performance" as const, l: "Hiệu suất", icon: ShieldCheck },
    { k: "recent" as const, l: "Lệnh gần đây", icon: History },
  ];

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      {/* Tab switcher — cuộn ngang trên màn hẹp */}
      <div className="trading-scroll -mx-0.5 flex shrink-0 flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 sm:flex-wrap sm:overflow-visible">
        {rightTabs.map(({ k, l, icon: Icon }) => (
          <button
            key={k}
            type="button"
            onClick={() => setRightTab(k)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs ${
              rightTab === k
                ? "border border-primary/25 bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {l}
          </button>
        ))}
      </div>

      {rightTab === "orders" && (
        <Card className="glass-panel flex min-h-0 flex-1 flex-col">
          <CardContent className="flex h-full min-h-0 flex-col p-4">
            <div className="mb-3 flex shrink-0 flex-wrap gap-1">
              {(
                [
                  { k: "active" as const, l: "Đang chạy", icon: Activity, n: 0 },
                  { k: "pending" as const, l: "Chờ vào lệnh", icon: Clock, n: botHistoryPending.length },
                  { k: "closed" as const, l: "Đã đóng", icon: History, n: botHistoryClosed.length },
                ] as { k: OrderTab; l: string; icon: ElementType; n: number }[]
              ).map(({ k, l, icon: Icon, n }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setOrderTab(k)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-medium transition-all ${
                    orderTab === k ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {l}
                  <span
                    className={`rounded-full px-1.5 text-[9px] font-bold ${
                      orderTab === k ? "bg-primary/25 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              ))}
            </div>

            {botHistoryLoading && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <span className="text-sm">Đang tải /botHistory…</span>
              </div>
            )}

            {!botHistoryLoading && botHistoryError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-400">{botHistoryError}</div>
            )}

            {!botHistoryLoading && !botHistoryError && !isApiConfigured() && (
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
                Cấu hình <span className="font-mono text-foreground">VITE_API_BASE_URL</span> trong .env để tải lịch sử bot
                từ <span className="font-mono text-foreground">/botHistory</span>.
              </div>
            )}

            {!botHistoryLoading && !botHistoryError && isApiConfigured() && (
              <div className="trading-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                {orderTab === "active" && (
                  <BotHistoryTable
                    items={[]}
                    emptyMessage="API /botHistory không có trạng thái vị thế đang mở. Chọn «Chờ vào lệnh» (PENDING / chưa xử lý) hoặc «Đã đóng» (SUCCESS / FAILED)."
                  />
                )}
                {orderTab === "pending" && (
                  <BotHistoryTable items={botHistoryPending} emptyMessage="Không có lệnh đang chờ." />
                )}
                {orderTab === "closed" && (
                  <BotHistoryTable items={botHistoryClosed} emptyMessage="Chưa có lệnh đã đóng (SUCCESS / FAILED)." />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {rightTab === "analysis" && (
        <div className="flex min-h-[280px] flex-1 flex-col overflow-hidden sm:min-h-[320px] lg:min-h-0">
          <FuturesPositionRealtimePanel />
        </div>
      )}

      {rightTab === "performance" && (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden overflow-y-auto lg:overflow-hidden">
          <Card className="glass-panel relative shrink-0 overflow-hidden border-primary/20 shadow-[0_0_48px_-16px_hsl(var(--primary)/0.2)]">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.18),transparent)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              aria-hidden
            />
            <CardContent className="relative space-y-5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold tracking-tight">Hiệu suất giao dịch</h2>
                      <p className="text-[11px] text-muted-foreground">Tổng hợp lệnh đã đóng — dữ liệu mô phỏng</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[10px] font-medium text-muted-foreground">
                  {CLOSED.length} lệnh đóng
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch">
                <DonutWinRateHero pct={winRate} />
                <div className="min-w-0 flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tổng PnL (đã đóng)</p>
                    <p
                      className={`mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight ${
                        totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {totalPnl >= 0 ? "+" : ""}
                      {totalPnl.toFixed(2)}$
                    </p>
                  </div>

                  <div>
                    <div className="mb-1.5 flex justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Thắng {wins}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        Thua {lossCount}
                      </span>
                    </div>
                    <div className="flex h-3 overflow-hidden rounded-full bg-muted/80 ring-1 ring-inset ring-border/40">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                        style={{ width: `${winBarPct}%` }}
                      />
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                        style={{ width: `${lossBarPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-4">
                    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">TB thắng</p>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-emerald-400">+{avgWin.toFixed(1)}$</p>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                      <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">TB thua</p>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-red-400">{avgLoss.toFixed(1)}$</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Lệnh thắng", value: String(wins), sub: "trên tổng", icon: Award, accent: "text-emerald-400", bg: "from-emerald-500/15 to-transparent" },
              { label: "Lệnh thua", value: String(lossCount), sub: "cần cải thiện", icon: TrendingDown, accent: "text-red-400", bg: "from-red-500/12 to-transparent" },
              { label: "Tốt nhất", value: `+${bestClosed.toFixed(0)}$`, sub: "PnL một lệnh", icon: TrendingUp, accent: "text-primary", bg: "from-primary/15 to-transparent" },
              { label: "Tệ nhất", value: `${worstClosed.toFixed(0)}$`, sub: "PnL một lệnh", icon: Activity, accent: "text-amber-400/90", bg: "from-amber-500/10 to-transparent" },
            ].map(({ label, value, sub, icon: Icon, accent, bg }) => (
              <Card key={label} className="glass-panel overflow-hidden border-border/50 ring-1 ring-inset ring-white/[0.03]">
                <CardContent className={`bg-gradient-to-br ${bg} p-3`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                      <p className={`mt-1 font-mono text-lg font-bold tabular-nums ${accent}`}>{value}</p>
                      <p className="mt-0.5 text-[9px] text-muted-foreground/80">{sub}</p>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/50 ring-1 ring-border/40">
                      <Icon className={`h-4 w-4 ${accent}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2 lg:min-h-[260px]">
            <Card className="glass-panel flex min-h-[180px] flex-col lg:min-h-0">
              <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                <div className="flex shrink-0 items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Equity (mô phỏng)</p>
                    <p className="mt-0.5 font-mono text-lg font-bold text-primary">$12,340</p>
                    <p className="text-[10px] text-emerald-400/90">+$2,340 so với vốn ban đầu</p>
                  </div>
                  <BarChart2 className="h-5 w-5 shrink-0 text-primary/60" />
                </div>
                <div className="flex shrink-0 justify-between text-[9px] text-muted-foreground/60">
                  <span>$10k</span>
                  <span>chuỗi phiên</span>
                  <span className="font-mono text-primary/80">$12,340</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel flex min-h-[180px] flex-col lg:min-h-0">
              <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                <div className="flex shrink-0 items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 ring-1 ring-violet-500/25">
                      <Layers className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PnL theo cặp</p>
                      <p className="text-[10px] text-muted-foreground/90">Đã đóng — cộng dồn theo symbol</p>
                    </div>
                  </div>
                </div>
                <div className="trading-scroll min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5">
                  {pnlBySymbolSorted.map(([symbol, pnl]) => {
                    const w = (Math.abs(pnl) / maxSymbolPnlAbs) * 100;
                    const pos = pnl >= 0;
                    return (
                      <div key={symbol}>
                        <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                          <span className="truncate font-mono font-semibold">{symbol}</span>
                          <span className={`shrink-0 font-mono font-bold tabular-nums ${pos ? "text-emerald-400" : "text-red-400"}`}>
                            {pos ? "+" : ""}
                            {pnl.toFixed(1)}$
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted/80 ring-1 ring-inset ring-border/30">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pos ? "bg-gradient-to-r from-emerald-600/90 to-emerald-400" : "bg-gradient-to-r from-red-600/90 to-red-400"
                            }`}
                            style={{ width: `${Math.max(w, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel shrink-0 border-dashed border-border/60">
            <CardContent className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/50">
                <Percent className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Gợi ý</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  Win rate {winRate}% phản ánh tỷ lệ lệnh có lợi nhuận dương trong lịch sử đóng. So sánh cột PnL theo cặp với
                  equity để thấy symbol nào đang kéo hoặc kìm danh mục; theo dõi TB thua so với TB thắng để đánh giá kỷ luật
                  thoát lệnh.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {rightTab === "recent" && (
        <Card className="glass-panel flex min-h-0 flex-1 flex-col">
          <CardContent className="flex h-full min-h-0 flex-col space-y-3 p-4">
            <div className="flex shrink-0 items-center gap-2">
              <History className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Lệnh gần đây</span>
            </div>
            <div className="trading-scroll min-h-0 flex-1 space-y-2 overflow-y-auto">
              {CLOSED.map((o) => (
                <div
                  key={o.id}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 transition-colors ${
                    o.finalPnl >= 0 ? "border-emerald-500/15 bg-emerald-500/5" : "border-red-500/15 bg-red-500/5"
                  }`}
                >
                  <div>
                    <p className="font-mono text-[11px] font-bold">{o.symbol}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <SideBadge side={o.side} />
                      <span className="text-[9px] text-muted-foreground">{o.closedAt}</span>
                    </div>
                  </div>
                  <PnLValue v={o.finalPnl} p={o.finalPnlPct} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
