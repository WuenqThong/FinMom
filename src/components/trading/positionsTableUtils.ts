import type { AccountStatusSnapshot, FuturesPositionRow } from "@/lib/binanceFuturesPosition";

const nfPrice = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

export function parseDecimal(s: string | undefined | null): number | null {
  if (s === undefined || s === null || s === "") return null;
  const n = Number.parseFloat(String(s).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** BTCUSDT → BTC (bỏ hậu tố quote phổ biến). */
export function baseAssetFromSymbol(symbol: string): string {
  const u = symbol.toUpperCase().trim();
  for (const q of ["USDT", "USDC", "BUSD", "USD"]) {
    if (u.endsWith(q) && u.length > q.length) return u.slice(0, -q.length);
  }
  return u || "—";
}

export function formatPriceLike(s: string | undefined | null): string {
  const n = parseDecimal(s);
  if (n === null) return s?.trim() || "—";
  return nfPrice.format(n);
}

/** Giá trị cho ô input read-only (không dùng ký tự "—"). */
export function priceInputValue(s: string | undefined | null): string {
  const f = formatPriceLike(s);
  return f === "—" ? "" : f;
}

export function positionSideTone(side: string): "long" | "short" | "both" | "neutral" {
  const u = side.toUpperCase();
  if (u === "LONG") return "long";
  if (u === "SHORT") return "short";
  if (u === "BOTH") return "both";
  return "neutral";
}

export function marginModeLabel(row: FuturesPositionRow): "Cross" | "Isolated" {
  const iso = parseDecimal(row.isolatedMargin) ?? parseDecimal(row.isolatedWallet) ?? 0;
  return iso > 0 ? "Isolated" : "Cross";
}

/** Badge chế độ margin: ưu tiên `marginType` từ API (CROSS/ISOLATED), không thì suy từ isolated margin. */
export function marginModeBadgeText(row: FuturesPositionRow): string {
  const mt = (row.marginType || "").trim();
  if (mt) {
    const u = mt.toLowerCase();
    if (u === "cross") return "Cross";
    if (u === "isolated") return "Isolated";
    return mt;
  }
  return marginModeLabel(row);
}

/** Hiển thị margin + mode: "18.72 USDT (Cross)" */
export function marginDisplay(row: FuturesPositionRow): string {
  const asset = row.marginAsset?.trim() || "USDT";
  const im = parseDecimal(row.initialMargin);
  const imStr = im !== null ? nfPrice.format(im) : row.initialMargin || "—";
  const mode = marginModeLabel(row);
  return `${imStr} ${asset} (${mode})`;
}

function safeDivide(a: number, b: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(b) < 1e-12) return null;
  return a / b;
}

/** maintMargin / |notional| * 100 — fallback khi thiếu account.status hoặc margin type không rõ. */
function marginRatioFallback(row: FuturesPositionRow): string {
  const maint = parseDecimal(row.maintMargin);
  const notional = parseDecimal(row.notional);
  if (maint === null || notional === null || Math.abs(notional) < 1e-12) return "—";
  const pct = (maint / Math.abs(notional)) * 100;
  if (!Number.isFinite(pct)) return "—";
  return `${pct.toFixed(2)}%`;
}

function isIsolatedPosition(row: FuturesPositionRow): boolean {
  const mt = (row.marginType || "").trim().toLowerCase();
  if (mt === "isolated") return true;
  if (mt === "cross") return false;
  const isoM = parseDecimal(row.isolatedMargin) ?? 0;
  const isoW = parseDecimal(row.isolatedWallet) ?? 0;
  return isoM > 0 || isoW > 0;
}

function maintMarginForRatio(row: FuturesPositionRow, account: AccountStatusSnapshot | null): number | null {
  const fromRow = parseDecimal(row.maintMargin);
  const side = (row.positionSide || "").toUpperCase();
  const sym = row.symbol;
  if (account?.positions?.length) {
    const match = account.positions.find((p) => {
      if (p.symbol !== sym) return false;
      const ps = (p.positionSide || "").toUpperCase();
      if (!ps || ps === "BOTH") return true;
      return ps === side;
    });
    const fromAcc = match?.maintMargin ? parseDecimal(match.maintMargin) : null;
    if (fromAcc !== null && Number.isFinite(fromAcc) && fromAcc >= 0) return fromAcc;
  }
  return fromRow;
}

/**
 * Isolated: maintMargin / (isolatedWallet + unRealizedProfit).
 * Cross (account): totalMaintMargin / totalMarginBalance.
 * Thiếu dữ liệu: fallback maint / |notional|.
 */
export function marginRatioDisplay(row: FuturesPositionRow, account: AccountStatusSnapshot | null): string {
  const upnl = parseDecimal(row.unRealizedProfit) ?? 0;
  const isolatedWallet = parseDecimal(row.isolatedWallet) ?? 0;
  const isolated = isIsolatedPosition(row);

  if (isolated) {
    const maint = maintMarginForRatio(row, account);
    const denom = isolatedWallet + upnl;
    const ratio = maint !== null ? safeDivide(maint, denom) : null;
    if (ratio !== null && Number.isFinite(ratio)) {
      return `${(ratio * 100).toFixed(2)}%`;
    }
    return marginRatioFallback(row);
  }

  if (account) {
    const totalMaint = parseDecimal(account.totalMaintMargin);
    const totalBal = parseDecimal(account.totalMarginBalance);
    const ratio = safeDivide(totalMaint ?? NaN, totalBal ?? NaN);
    if (ratio !== null) {
      return `${(ratio * 100).toFixed(4)}%`;
    }
  }

  return marginRatioFallback(row);
}

/**
 * Badge đòn bẩy: ưu tiên trường `leverage` từ Position Info V2.
 * Nếu API không trả (testnet/bản cũ hay bằng 0), ước lượng: |notional| / initialMargin (hoặc positionInitialMargin).
 */
export function leverageBadgeText(row: FuturesPositionRow): string {
  const s = row.leverage?.trim();
  if (s) {
    const n = Number.parseFloat(s.replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) return `${n}x`;
  }
  const notional = parseDecimal(row.notional);
  const im =
    parseDecimal(row.initialMargin) ??
    parseDecimal(row.positionInitialMargin);
  if (notional === null || im === null || im <= 0) return "—";
  const lev = Math.abs(notional) / im;
  if (!Number.isFinite(lev) || lev <= 0) return "—";
  if (Math.abs(lev - Math.round(lev)) < 0.001) return `${Math.round(lev)}x`;
  return `${lev.toFixed(2)}x`;
}

/**
 * Margin làm mẫu số ROI: trùng logic với cột Margin khi có thể
 * (initialMargin → positionInitialMargin → isolatedMargin → isolatedWallet).
 * Theo Position Information V2: unRealizedProfit, initialMargin, isolatedMargin, …
 * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2
 */
export function marginForRoi(row: FuturesPositionRow): number | null {
  const candidates = [
    parseDecimal(row.initialMargin),
    parseDecimal(row.positionInitialMargin),
    parseDecimal(row.isolatedMargin),
    parseDecimal(row.isolatedWallet),
  ];
  for (const n of candidates) {
    if (n !== null && n > 0) return n;
  }
  return null;
}

/** Dòng 1: số; dòng 2: margin asset (USDT…). */
export function pnlDisplay(row: FuturesPositionRow): {
  amountText: string;
  assetLine: string;
  positive: boolean | null;
} {
  const p = parseDecimal(row.unRealizedProfit);
  const asset = row.marginAsset?.trim() || "USDT";
  if (p === null) return { amountText: "—", assetLine: "—", positive: null };
  const sign = p >= 0 ? "+" : "";
  return { amountText: `${sign}${nfPrice.format(p)}`, assetLine: asset, positive: p >= 0 };
}

/** roi = (unRealizedProfit / margin) * 100 */
export function roiDisplay(row: FuturesPositionRow): string {
  const upnl = parseDecimal(row.unRealizedProfit);
  const margin = marginForRoi(row);
  if (upnl === null || margin === null || margin <= 0) return "—";
  const pct = (upnl / margin) * 100;
  if (!Number.isFinite(pct)) return "—";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function sizeDisplay(row: FuturesPositionRow): { line: string; positive: boolean | null } {
  const amt = parseDecimal(row.positionAmt);
  const base = baseAssetFromSymbol(row.symbol);
  if (amt === null) return { line: `${row.positionAmt ?? "—"} ${base}`, positive: null };
  const sign = amt >= 0 ? "+" : "";
  return { line: `${sign}${nfPrice.format(Math.abs(amt))} ${base}`, positive: amt >= 0 };
}
