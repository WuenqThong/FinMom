import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  DEFAULT_BINANCE_FUTURES_WS,
  type AccountStatusSnapshot,
  type FuturesPositionRow,
  parseAccountStatusResponse,
  parsePositionResponse,
  signAccountStatusParams,
  signPositionRequestParams,
} from "@/lib/binanceFuturesPosition";
import {
  formatPriceLike,
  leverageBadgeText,
  marginDisplay,
  marginModeBadgeText,
  marginRatioDisplay,
  pnlDisplay,
  positionSideTone,
  roiDisplay,
  sizeDisplay,
} from "@/components/trading/positionsTableUtils";
import { cn } from "@/lib/utils";

/** Tỷ lệ cột (fr) — các cột giãn theo 100% width, cân bằng khoảng trống bên phải. */
const POSITIONS_GRID_TEMPLATE = "112fr 92fr 104fr 112fr 104fr 120fr 76fr 148fr 128fr" as const;

type ConnState = "idle" | "connecting" | "open" | "closed" | "error";

type ExchangeTab =
  | "positions"
  | "openOrders"
  | "orderHistory"
  | "tradeHistory"
  | "txHistory"
  | "assets";

const EXCHANGE_TABS: { id: ExchangeTab; label: string; count?: (n: number) => string }[] = [
  { id: "positions", label: "Positions", count: (n) => `(${n})` },
  { id: "openOrders", label: "Open Orders", count: () => "(0)" },
  { id: "orderHistory", label: "Order History" },
  { id: "tradeHistory", label: "Trade History" },
  { id: "txHistory", label: "Transaction History" },
  { id: "assets", label: "Assets" },
];

function pickStr(...candidates: (string | undefined)[]): string {
  for (const c of candidates) {
    const t = (c ?? "").trim();
    if (t) return t;
  }
  return "";
}

function readEnv() {
  const apiKey = pickStr(
    import.meta.env.VITE_BINANCE_FUTURES_TESTNET_API_KEY,
    import.meta.env.VITE_BINANCE_FUTURES_API_KEY,
  );
  const apiSecret = pickStr(
    import.meta.env.VITE_BINANCE_FUTURES_TESTNET_API_SECRET,
    import.meta.env.VITE_BINANCE_FUTURES_API_SECRET,
  );
  const wsUrl = pickStr(import.meta.env.VITE_BINANCE_FUTURES_WS_URL) || DEFAULT_BINANCE_FUTURES_WS;
  const symbol =
    pickStr(import.meta.env.VITE_BINANCE_POSITION_SYMBOL, import.meta.env.VITE_BINANCE_FUTURES_SYMBOL) ||
    "BTCUSDT";
  const pollMs = Math.max(
    800,
    Number.parseInt(
      pickStr(import.meta.env.VITE_BINANCE_POSITION_POLL_MS, import.meta.env.VITE_BINANCE_FUTURES_POLL_MS) ||
        "2000",
      10,
    ) || 2000,
  );
  return { apiKey, apiSecret, wsUrl, symbol, pollMs };
}

export function FuturesPositionRealtimePanel() {
  const env = useMemo(() => readEnv(), []);
  const { apiKey, apiSecret, wsUrl, symbol: envSymbol, pollMs } = env;
  const configured = Boolean(apiKey && apiSecret);

  const [conn, setConn] = useState<ConnState>("idle");
  const [positions, setPositions] = useState<FuturesPositionRow[]>([]);
  const [accountStatus, setAccountStatus] = useState<AccountStatusSnapshot | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const [exchangeTab, setExchangeTab] = useState<ExchangeTab>("positions");

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closedRef = useRef(false);
  const pendingWsKindRef = useRef(new Map<string, "position" | "account">());
  /** Vùng bảng vị thế: lăn chuột dọc → cuộn ngang (cần passive: false). */
  const positionsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = positionsScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const canScrollH = el.scrollWidth > el.clientWidth + 1;
      const canScrollV = el.scrollHeight > el.clientHeight + 1;

      // Shift + lăn: cuộn dọc (khi có nhiều hàng vị thế)
      if (e.shiftKey) {
        if (!canScrollV) return;
        e.preventDefault();
        el.scrollTop += e.deltaY;
        return;
      }

      if (!canScrollH) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY + e.deltaX;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [positions.length, exchangeTab]);

  useEffect(() => {
    if (!configured) {
      setConn("idle");
      return;
    }

    if (import.meta.env.DEV) {
      console.info("[Binance WS] VITE_ credentials:", "loaded");
    }

    closedRef.current = false;
    setConn("connecting");
    setLastError(null);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    pendingWsKindRef.current.clear();

    const sendPosition = async () => {
      if (closedRef.current || ws.readyState !== WebSocket.OPEN) return;
      try {
        const timestamp = Date.now();
        const params = await signPositionRequestParams({
          apiKey,
          apiSecret,
          symbol: envSymbol,
          timestamp,
        });
        const id = crypto.randomUUID();
        pendingWsKindRef.current.set(id, "position");
        ws.send(
          JSON.stringify({
            id,
            method: "v2/account.position",
            params,
          }),
        );
      } catch {
        setLastError("Không ký được request (crypto.subtle / secret).");
        setConn("error");
      }
    };

    const sendAccountStatus = async () => {
      if (closedRef.current || ws.readyState !== WebSocket.OPEN) return;
      try {
        const timestamp = Date.now();
        const params = await signAccountStatusParams({
          apiKey,
          apiSecret,
          timestamp,
        });
        const id = crypto.randomUUID();
        pendingWsKindRef.current.set(id, "account");
        ws.send(
          JSON.stringify({
            id,
            method: "v2/account.status",
            params,
          }),
        );
      } catch {
        setLastError("Không ký được account.status (crypto.subtle / secret).");
        setConn("error");
      }
    };

    const pollBoth = async () => {
      await sendPosition();
      await sendAccountStatus();
    };

    ws.onopen = () => {
      if (closedRef.current) return;
      setConn("open");
      void pollBoth();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => void pollBoth(), pollMs);
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as Record<string, unknown> & {
          id?: string | number;
          result?: unknown;
        };
        const msgId = data.id != null && data.id !== "" ? String(data.id) : null;
        const kind = msgId ? pendingWsKindRef.current.get(msgId) : undefined;
        if (msgId && kind) {
          pendingWsKindRef.current.delete(msgId);
          if (kind === "position") {
            const { rows, errorMessage } = parsePositionResponse(data);
            if (errorMessage) {
              setLastError(errorMessage);
              return;
            }
            if (rows) {
              setPositions(rows);
              setLastError(null);
            }
            return;
          }
          const { snapshot, errorMessage } = parseAccountStatusResponse(data);
          if (errorMessage) {
            setLastError(errorMessage);
            return;
          }
          if (snapshot) {
            setAccountStatus(snapshot);
            setLastError(null);
          }
          return;
        }

        const res = data.result;
        if (res && typeof res === "object" && !Array.isArray(res)) {
          const r = res as Record<string, unknown>;
          if (
            "totalMarginBalance" in r ||
            "totalMaintMargin" in r ||
            "totalWalletBalance" in r
          ) {
            const { snapshot, errorMessage } = parseAccountStatusResponse(data);
            if (errorMessage) {
              setLastError(errorMessage);
              return;
            }
            if (snapshot) {
              setAccountStatus(snapshot);
              setLastError(null);
            }
            return;
          }
        }

        const { rows, errorMessage } = parsePositionResponse(data);
        if (errorMessage) {
          setLastError(errorMessage);
          return;
        }
        if (rows) {
          setPositions(rows);
          setLastError(null);
        }
      } catch {
        setLastError("Không parse được JSON từ WebSocket.");
      }
    };

    ws.onerror = () => {
      if (!closedRef.current) setLastError("Lỗi kết nối WebSocket.");
    };

    ws.onclose = () => {
      if (closedRef.current) return;
      setConn("closed");
    };

    return () => {
      closedRef.current = true;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      ws.close();
      wsRef.current = null;
    };
  }, [configured, apiKey, apiSecret, wsUrl, envSymbol, pollMs]);

  if (!configured) {
    return (
      <Card className="glass-panel border-amber-500/20">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Vị thế Futures (testnet)</p>
          <p className="mt-2 text-[12px] leading-relaxed">
            Thêm vào <span className="font-mono text-foreground">.env</span> một trong hai bộ tên:{" "}
            <span className="font-mono">VITE_BINANCE_FUTURES_TESTNET_API_KEY</span> /{" "}
            <span className="font-mono">VITE_BINANCE_FUTURES_API_KEY</span> và secret tương ứng (chỉ testnet; secret lộ
            trong bundle — production nên dùng backend).
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground/80">
            Tuỳ chọn: <span className="font-mono">VITE_BINANCE_FUTURES_WS_URL</span>,{" "}
            <span className="font-mono">VITE_BINANCE_POSITION_SYMBOL</span> hoặc{" "}
            <span className="font-mono">VITE_BINANCE_FUTURES_SYMBOL</span>,{" "}
            <span className="font-mono">VITE_BINANCE_POSITION_POLL_MS</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      {lastError && (
        <div className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-[12px] text-red-400">
          {lastError}
        </div>
      )}

      <Card className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden border-border/60">
        <div className="shrink-0 border-b border-border/50 bg-card/40">
          <div className="flex flex-wrap items-end gap-1 px-2 pt-2 sm:px-3">
            {EXCHANGE_TABS.map((t) => {
              const active = exchangeTab === t.id;
              const countStr =
                t.id === "positions"
                  ? t.count?.(positions.length) ?? ""
                  : t.count
                    ? t.count(0)
                    : "";
              const label = `${t.label}${countStr}`;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setExchangeTab(t.id)}
                  className={`relative -mb-px border-b-2 px-2 py-2 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs ${
                    active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground/90"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          {exchangeTab !== "positions" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-16 text-center">
              <p className="text-sm font-medium text-muted-foreground">Chưa tích hợp</p>
              <p className="text-xs text-muted-foreground/80">Sắp có.</p>
            </div>
          )}

          {exchangeTab === "positions" && (
            <>
              {conn === "connecting" && positions.length === 0 && !lastError && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-14 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm">Đang kết nối WebSocket…</span>
                </div>
              )}

              {conn === "open" && positions.length === 0 && !lastError && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-14 text-muted-foreground">
                  <Activity className="h-7 w-7 opacity-50" />
                  <span className="text-sm">Không có vị thế / lệnh mở cho cặp này (result rỗng).</span>
                </div>
              )}

              {positions.length > 0 && (
                <div className="min-h-0 flex-1 overflow-hidden">
                  <div
                    ref={positionsScrollRef}
                    className="trading-scroll h-full overflow-x-auto overflow-y-auto"
                    title="Lăn chuột: cuộn ngang · Shift + lăn: cuộn dọc (nhiều vị thế)"
                  >
                    <div className="w-full min-w-[44rem] max-w-none">
                      <PositionsHeaderRow />
                      {positions.map((row, idx) => (
                        <PositionSingleRow
                          key={`${row.symbol}-${row.positionSide}-${idx}`}
                          row={row}
                          accountStatus={accountStatus}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PositionsHeaderRow() {
  const h = "min-w-0 px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:px-3";
  return (
    <div
      className="grid w-full border-b border-border/50 bg-muted/25"
      style={{ gridTemplateColumns: POSITIONS_GRID_TEMPLATE }}
    >
      <div className={h}>Symbol</div>
      <div className={h}>Size</div>
      <div className={h}>Entry Price</div>
      <div className={h}>Break Even Price</div>
      <div className={h}>Mark Price</div>
      <div className={h}>Liq.Price</div>
      <div className={h}>Margin Ratio</div>
      <div className={h}>Margin</div>
      <div className={h}>PNL(ROI)%</div>
    </div>
  );
}

function PositionSingleRow({
  row,
  accountStatus,
}: {
  row: FuturesPositionRow;
  accountStatus: AccountStatusSnapshot | null;
}) {
  const tone = positionSideTone(row.positionSide ?? "");
  const bar =
    tone === "long" || tone === "both"
      ? "bg-emerald-500"
      : tone === "short"
        ? "bg-rose-500"
        : "bg-muted-foreground/40";
  const size = sizeDisplay(row);
  const pnl = pnlDisplay(row);
  const roi = roiDisplay(row);

  const cell = "flex min-w-0 items-center px-2 py-2.5 sm:px-3";

  return (
    <div
      className="grid w-full border-b border-border/40 transition-colors hover:bg-muted/10"
      style={{ gridTemplateColumns: POSITIONS_GRID_TEMPLATE }}
    >
      <div className={cn(cell, "items-center")}>
        <div className="flex min-w-0 items-center gap-2">
          <div className={`h-10 w-0.5 shrink-0 self-center rounded-full ${bar}`} aria-hidden />
          <div>
            <div className="font-mono text-xs font-semibold leading-tight text-foreground">{row.symbol}</div>
            <div className="mt-0.5 flex flex-wrap gap-1">
              <span
                className="rounded bg-muted/80 px-1 py-0 text-[9px] font-medium text-muted-foreground"
                title="Leverage (đòn bẩy): từ API hoặc ước lượng |notional| / initial margin nếu API không trả"
              >
                {leverageBadgeText(row)}
              </span>
              <span
                className="rounded bg-muted/80 px-1 py-0 text-[9px] font-medium text-muted-foreground"
                title="Margin mode: Cross / Isolated (khác với leverage)"
              >
                {marginModeBadgeText(row)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          cell,
          "font-mono text-[11px] tabular-nums",
          size.positive === true
            ? "text-emerald-400"
            : size.positive === false
              ? "text-rose-400"
              : "text-foreground",
        )}
      >
        <span className="truncate">{size.line}</span>
      </div>

      <div className={cn(cell, "font-mono text-[11px] tabular-nums text-foreground/95")}>
        <span className="block min-w-0 truncate">{formatPriceLike(row.entryPrice)}</span>
      </div>
      <div className={cn(cell, "font-mono text-[11px] tabular-nums text-muted-foreground")}>
        <span className="block min-w-0 truncate">{formatPriceLike(row.breakEvenPrice)}</span>
      </div>
      <div className={cn(cell, "font-mono text-[11px] tabular-nums text-muted-foreground")}>
        <span className="block min-w-0 truncate">{formatPriceLike(row.markPrice)}</span>
      </div>
      <div className={cn(cell, "font-mono text-[11px] tabular-nums text-amber-500/95")}>
        <span className="block min-w-0 truncate">{formatPriceLike(row.liquidationPrice)}</span>
      </div>
      <div className={cn(cell, "font-mono text-[11px] tabular-nums text-foreground/90")}>
        <span className="truncate">{marginRatioDisplay(row, accountStatus)}</span>
      </div>
      <div className={cn(cell, "text-[10px] leading-snug text-foreground/90 sm:text-[11px]")}>
        <span className="block min-w-0 break-words">{marginDisplay(row)}</span>
      </div>

      <div className={cn(cell, "flex-col items-start justify-center gap-0.5")}>
        <div
          className={cn(
            "font-mono text-[11px] font-semibold tabular-nums leading-tight",
            pnl.positive === true
              ? "text-emerald-400"
              : pnl.positive === false
                ? "text-rose-400"
                : "text-foreground",
          )}
        >
          {pnl.amountText}
        </div>
        <div
          className={cn(
            "font-mono text-[10px] font-semibold tabular-nums leading-tight",
            pnl.positive === true
              ? "text-emerald-400"
              : pnl.positive === false
                ? "text-rose-400"
                : "text-muted-foreground",
          )}
        >
          {pnl.assetLine}
        </div>
        <div
          className={cn(
            "font-mono text-[10px] tabular-nums",
            pnl.positive === true
              ? "text-emerald-400/90"
              : pnl.positive === false
                ? "text-rose-400/90"
                : "text-muted-foreground",
          )}
        >
          {roi}
        </div>
      </div>
    </div>
  );
}
