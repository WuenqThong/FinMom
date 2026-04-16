/**
 * Binance USDⓈ-M Futures WebSocket API — v2/account.position
 * Base URL (testnet): wss://testnet.binancefuture.com/ws-fapi/v1
 * Method name carries the version: "v2/account.position" (không gắn /v2 vào path).
 *
 * Cảnh báo: ký HMAC trong trình duyệt cần secret — chỉ phù hợp testnet/dev.
 * Production: proxy qua backend, không để secret trong bundle.
 */

export const DEFAULT_BINANCE_FUTURES_WS = "wss://testnet.binancefuture.com/ws-fapi/v1";

export type FuturesPositionRow = {
  symbol: string;
  positionSide: string;
  positionAmt: string;
  entryPrice: string;
  breakEvenPrice: string;
  markPrice: string;
  unRealizedProfit: string;
  liquidationPrice: string;
  isolatedMargin: string;
  notional: string;
  marginAsset: string;
  isolatedWallet: string;
  initialMargin: string;
  maintMargin: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  leverage: string;
  marginType: string;
  adl: number;
  bidNotional: string;
  askNotional: string;
  updateTime: number;
};

const POSITION_KEYS: (keyof FuturesPositionRow)[] = [
  "symbol",
  "positionSide",
  "positionAmt",
  "entryPrice",
  "breakEvenPrice",
  "markPrice",
  "unRealizedProfit",
  "liquidationPrice",
  "isolatedMargin",
  "notional",
  "marginAsset",
  "isolatedWallet",
  "initialMargin",
  "maintMargin",
  "positionInitialMargin",
  "openOrderInitialMargin",
  "leverage",
  "marginType",
  "adl",
  "bidNotional",
  "askNotional",
  "updateTime",
];

export function normalizePositionRow(raw: Record<string, unknown>): FuturesPositionRow {
  const num = (v: unknown, d: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : d;
  const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));
  return {
    symbol: str(raw.symbol),
    positionSide: str(raw.positionSide),
    positionAmt: str(raw.positionAmt),
    entryPrice: str(raw.entryPrice),
    breakEvenPrice: str(raw.breakEvenPrice),
    markPrice: str(raw.markPrice),
    unRealizedProfit: str(raw.unRealizedProfit),
    liquidationPrice: str(raw.liquidationPrice),
    isolatedMargin: str(raw.isolatedMargin),
    notional: str(raw.notional),
    marginAsset: str(raw.marginAsset),
    isolatedWallet: str(raw.isolatedWallet),
    initialMargin: str(raw.initialMargin),
    maintMargin: str(raw.maintMargin),
    positionInitialMargin: str(raw.positionInitialMargin),
    openOrderInitialMargin: str(raw.openOrderInitialMargin),
    leverage: str(raw.leverage),
    marginType: str(raw.marginType),
    adl: num(raw.adl, 0),
    bidNotional: str(raw.bidNotional),
    askNotional: str(raw.askNotional),
    updateTime: num(raw.updateTime, 0),
  };
}

/** Chuỗi query ký HMAC: key sort A–Z, bỏ signature (chuẩn Binance SIGNED). */
export function buildSignedQueryString(params: Record<string, string | number>): string {
  const keys = Object.keys(params)
    .filter((k) => k !== "signature")
    .sort();
  return keys.map((k) => `${k}=${params[k]}`).join("&");
}

export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signPositionRequestParams(args: {
  apiKey: string;
  apiSecret: string;
  symbol: string;
  timestamp: number;
}): Promise<{ apiKey: string; symbol: string; timestamp: number; signature: string }> {
  const base: Record<string, string | number> = {
    apiKey: args.apiKey,
    symbol: args.symbol,
    timestamp: args.timestamp,
  };
  const qs = buildSignedQueryString(base);
  const signature = await hmacSha256Hex(args.apiSecret, qs);
  return { ...base, signature };
}

export async function signAccountStatusParams(args: {
  apiKey: string;
  apiSecret: string;
  timestamp: number;
}): Promise<{ apiKey: string; timestamp: number; signature: string }> {
  const base: Record<string, string | number> = {
    apiKey: args.apiKey,
    timestamp: args.timestamp,
  };
  const qs = buildSignedQueryString(base);
  const signature = await hmacSha256Hex(args.apiSecret, qs);
  return { ...base, signature };
}

/** Snapshot tối thiểu từ WebSocket API `v2/account.status` (dùng margin ratio cross / maint theo symbol). */
export type AccountStatusPositionEntry = {
  symbol: string;
  positionSide: string;
  maintMargin: string;
};

export type AccountStatusSnapshot = {
  totalMaintMargin: string;
  totalMarginBalance: string;
  positions?: AccountStatusPositionEntry[];
};

export function parseAccountStatusResponse(payload: unknown): {
  snapshot: AccountStatusSnapshot | null;
  errorMessage: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { snapshot: null, errorMessage: "Phản hồi account.status không hợp lệ." };
  }
  const o = payload as PositionWsResponse;
  if (o.error?.msg) {
    return { snapshot: null, errorMessage: String(o.error.msg) };
  }
  if (o.status !== undefined && o.status >= 400) {
    return { snapshot: null, errorMessage: o.error?.msg ? String(o.error.msg) : `Lỗi ${o.status}` };
  }
  const r = o.result;
  if (!r || typeof r !== "object" || Array.isArray(r)) {
    return { snapshot: null, errorMessage: null };
  }
  const rec = r as Record<string, unknown>;
  const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

  const totalMaintMargin = str(rec.totalMaintMargin);
  const totalMarginBalance = str(rec.totalMarginBalance);

  let positions: AccountStatusPositionEntry[] | undefined;
  const pr = rec.positions;
  if (Array.isArray(pr)) {
    positions = pr
      .filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x))
      .map((p) => ({
        symbol: str(p.symbol),
        positionSide: str(p.positionSide),
        maintMargin: str(p.maintMargin),
      }));
  }

  return {
    snapshot: {
      totalMaintMargin,
      totalMarginBalance,
      positions,
    },
    errorMessage: null,
  };
}

export type PositionWsResponse = {
  id?: string | number | null;
  status?: number;
  result?: unknown;
  error?: { code?: number; msg?: string };
};

export function parsePositionResponse(payload: unknown): {
  rows: FuturesPositionRow[] | null;
  errorMessage: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { rows: null, errorMessage: "Phản hồi không hợp lệ." };
  }
  const o = payload as PositionWsResponse;
  if (o.error?.msg) {
    return { rows: null, errorMessage: String(o.error.msg) };
  }
  if (o.status !== undefined && o.status >= 400) {
    return { rows: null, errorMessage: o.error?.msg ? String(o.error.msg) : `Lỗi ${o.status}` };
  }
  if (!Array.isArray(o.result)) {
    return { rows: null, errorMessage: null };
  }
  const rows = o.result
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x))
    .map((r) => normalizePositionRow(r));
  return { rows, errorMessage: null };
}

export const positionFieldLabels: Record<keyof FuturesPositionRow, string> = {
  symbol: "Symbol",
  positionSide: "Position side",
  positionAmt: "Position amt",
  entryPrice: "Entry price",
  breakEvenPrice: "Break-even",
  markPrice: "Mark price",
  unRealizedProfit: "Unrealized PnL",
  liquidationPrice: "Liquidation",
  isolatedMargin: "Isolated margin",
  notional: "Notional",
  marginAsset: "Margin asset",
  isolatedWallet: "Isolated wallet",
  initialMargin: "Initial margin",
  maintMargin: "Maint. margin",
  positionInitialMargin: "Pos. init. margin",
  openOrderInitialMargin: "Open order init. margin",
  leverage: "Leverage",
  marginType: "Margin type",
  adl: "ADL",
  bidNotional: "Bid notional",
  askNotional: "Ask notional",
  updateTime: "Update time",
};

export { POSITION_KEYS };
