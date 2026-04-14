import { useMemo } from "react";
import { Clock } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

import type { BotHistoryItem } from "@/lib/ragApi";

export type PositionSide = "LONG" | "SHORT";

/** Suy ra cặp và LONG/SHORT từ chuỗi bot_action (MARKET BUY 0.003 BTCUSDT, Buy 0.004 btc, …). */
export function parseBotAction(action: string): { symbol: string; side: PositionSide } {
  const upper = action.toUpperCase();
  const hasSell = /\b(SELL|SHORT)\b/.test(upper);
  const hasBuy = /\b(BUY|LONG)\b/.test(upper);
  const side: PositionSide = hasSell && !hasBuy ? "SHORT" : "LONG";

  const pairAttached = upper.match(/\b([A-Z0-9]{2,12})(USDT|USDC|BUSD|USD)\b/);
  if (pairAttached) {
    const base = pairAttached[1];
    const quote = pairAttached[2];
    return { symbol: `${base}/${quote}`, side };
  }

  const qtyAsset = action.match(/\b0?\.?\d+\s*(btc|eth|sol|bnb|xrp|doge)\b/i);
  if (qtyAsset) {
    return { symbol: `${qtyAsset[1].toUpperCase()}/USDT`, side };
  }

  const lone = upper.match(/\b(BTC|ETH|SOL|BNB|XRP|DOGE)\b/);
  if (lone) return { symbol: `${lone[1]}/USDT`, side };

  return { symbol: "—", side };
}

function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: vi });
  } catch {
    return iso;
  }
}

function SideBadge({ side }: { side: PositionSide }) {
  const long = side === "LONG";
  return (
    <span
      className={`inline-flex h-8 w-20 shrink-0 items-center justify-center gap-0.5 rounded-md text-sm font-bold tracking-wide ${
        long ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
      }`}
    >
      {long ? "▲" : "▼"} {side}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  if (s === "SUCCESS")
    return (
      <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
        SUCCESS
      </span>
    );
  if (s === "FAILED")
    return (
      <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400">
        FAILED
      </span>
    );
  if (s === "PENDING")
    return (
      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
        PENDING
      </span>
    );
  return (
    <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {status || "—"}
    </span>
  );
}

const GRID =
  "grid w-full grid-cols-[minmax(5rem,1.1fr)_5.5rem_minmax(6rem,2.2fr)_minmax(5rem,0.95fr)_minmax(4rem,1fr)_minmax(5.5rem,1.05fr)] items-center gap-3 sm:gap-4" as const;

const HEADERS = [
  { key: "pair", label: "CẶP", align: "text-left" as const },
  { key: "side", label: "SIDE", align: "text-left" as const },
  { key: "reason", label: "LÝ DO", align: "text-left" as const },
  { key: "st", label: "TRẠNG THÁI", align: "text-left" as const },
  { key: "bot", label: "BOT", align: "text-left" as const },
  { key: "tg", label: "TG", align: "text-right" as const },
];

export interface BotHistoryTableProps {
  items: BotHistoryItem[];
  emptyMessage?: string;
  className?: string;
}

export function BotHistoryTable({ items, emptyMessage, className = "" }: BotHistoryTableProps) {
  const rows = useMemo(
    () =>
      items.map((b, i) => {
        const { symbol, side } = parseBotAction(b.bot_action);
        const statusNorm = b.status?.trim().toUpperCase() || "—";
        return {
          id: `${i}-${b.created_at}`,
          symbol,
          side,
          reason: b.analysis?.trim() || "—",
          status: statusNorm,
          botName: b.bot_name,
          actionHint: b.bot_action,
          timeLabel: timeAgo(b.created_at),
        };
      }),
    [items],
  );

  if (rows.length === 0) {
    return (
      <div className={`rounded-lg border border-dashed border-border/50 bg-muted/10 px-4 py-10 text-center text-sm text-muted-foreground ${className}`}>
        {emptyMessage ?? "Không có dữ liệu."}
      </div>
    );
  }

  return (
    <div className={`w-full min-w-0 ${className}`}>
      <div role="rowgroup" className={`${GRID} border-b border-gray-800 py-2.5 sm:py-3`}>
        {HEADERS.map((h) => (
          <div
            key={h.key}
            role="columnheader"
            className={`text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm ${h.align}`}
          >
            {h.label}
          </div>
        ))}
      </div>

      <div role="rowgroup" className="divide-y divide-gray-800">
        {rows.map((r) => (
          <div key={r.id} role="row" className={`${GRID} py-3 transition-colors hover:bg-gray-800/50 sm:py-4`}>
            <div className="min-w-0">
              <div className="truncate font-mono text-sm font-semibold text-gray-200 sm:text-base" title={r.symbol}>
                {r.symbol}
              </div>
              <div className="truncate text-[10px] text-muted-foreground sm:text-xs" title={r.actionHint}>
                {r.actionHint}
              </div>
            </div>

            <div className="min-w-0 justify-self-start">
              <SideBadge side={r.side} />
            </div>

            <div className="min-w-0 text-sm leading-snug text-gray-200 sm:text-base" title={r.reason}>
              {r.reason}
            </div>

            <div className="min-w-0">
              <StatusBadge status={r.status} />
            </div>

            <div className="min-w-0 truncate text-sm text-gray-200 sm:text-base" title={r.botName}>
              {r.botName}
            </div>

            <div className="flex min-w-0 items-center justify-end gap-1 justify-self-end text-xs tabular-nums text-gray-400 sm:text-sm">
              <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              <span className="text-right">{r.timeLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
