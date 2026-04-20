/**
 * RAG backend — FinMom OpenAPI: POST /rag-upload, GET /get_analyze?id=, POST /tradingautomation?inp= (sau get_analyze, ngầm)
 * - Dev / build: VITE_API_BASE_URL trong .env (Vite embed).
 * - Docker: có thể ghi đè lúc chạy qua /runtime-config.js (docker run -e VITE_API_BASE_URL=...).
 */

declare global {
  interface Window {
    __RUNTIME_ENV__?: {
      VITE_API_BASE_URL?: string;
      VITE_RAG_UPLOAD_FIELD?: string;
    };
  }
}

function runtimeOrBuild(key: "VITE_API_BASE_URL" | "VITE_RAG_UPLOAD_FIELD"): string | undefined {
  if (typeof window !== "undefined") {
    const v = window.__RUNTIME_ENV__?.[key];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  if (key === "VITE_API_BASE_URL") return (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  return (import.meta.env.VITE_RAG_UPLOAD_FIELD as string | undefined)?.trim();
}

/**
 * Phải đọc lười (mỗi lần gọi): Vite build đặt `type=module` trước `/runtime-config.js`
 * trong HTML, nên lúc module load lần đầu `window.__RUNTIME_ENV__` từ Docker chưa chạy.
 */
function apiBase(): string {
  return (runtimeOrBuild("VITE_API_BASE_URL") || "").replace(/\/$/, "");
}

/** Chỉ cần khi gọi trực tiếp domain ngrok từ browser (không qua proxy Vite). */
function apiHeaders(): HeadersInit {
  const base = apiBase();
  if (base.startsWith("http://") || base.startsWith("https://")) {
    return { "ngrok-skip-browser-warning": "1" };
  }
  return {};
}

function uploadFieldName() {
  return runtimeOrBuild("VITE_RAG_UPLOAD_FIELD") || "file";
}

function extractErrorPayload(data: unknown, status: number): string {
  if (data && typeof data === "object" && "detail" in data) {
    const d = (data as { detail: unknown }).detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d) && d.length && typeof d[0] === "object" && d[0] !== null && "msg" in d[0]) {
      return String((d[0] as { msg: string }).msg);
    }
  }
  return `Request failed (${status})`;
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function pickId(data: Record<string, unknown>): string | null {
  const candidates = [
    data.id,
    data.rag_id,
    data.document_id,
    data.ragId,
    data.rag_upload_id,
    (data.data as Record<string, unknown> | undefined)?.id,
    (data.result as Record<string, unknown> | undefined)?.id,
  ];
  for (const c of candidates) {
    if (c !== undefined && c !== null && String(c).length > 0) return String(c);
  }
  return null;
}

/** Lưu phiên RAG cuối (F5 vẫn gọi lại GET /get_analyze?id=…). */
const LAST_RAG_SESSION_KEY = "finmom_last_rag_session";

export type LastRagSession = { ragId: string; fileName?: string | null };

export function persistLastRagSession(ragId: string, fileName?: string | null): void {
  try {
    const id = ragId.trim();
    if (!id) return;
    const payload: LastRagSession = { ragId: id, fileName: fileName ?? undefined };
    localStorage.setItem(LAST_RAG_SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

export function readLastRagSession(): LastRagSession | null {
  try {
    const raw = localStorage.getItem(LAST_RAG_SESSION_KEY);
    if (!raw?.trim()) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const ragId = typeof (o as LastRagSession).ragId === "string" ? (o as LastRagSession).ragId.trim() : "";
    if (!ragId) return null;
    const fileName = (o as LastRagSession).fileName;
    return {
      ragId,
      fileName: typeof fileName === "string" ? fileName : undefined,
    };
  } catch {
    return null;
  }
}

export function clearLastRagSession(): void {
  try {
    localStorage.removeItem(LAST_RAG_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function pickAnalyzeText(data: Record<string, unknown>): string {
  const candidates = [
    data.analyzeText,
    data.analyze_text,
    data.text,
    data.analysis,
    data.message,
    (data.result as Record<string, unknown> | undefined)?.analyzeText,
  ];
  for (const c of candidates) {
    if (typeof c === "string") return c;
  }
  return "";
}

/** Thu mọi chuỗi lá từ mảng/object lồng nhau (ví dụ [[ "{...json...}" ]]). */
function collectStringLeaves(data: unknown): string[] {
  if (typeof data === "string") return [data];
  if (Array.isArray(data)) {
    return data.flatMap(collectStringLeaves);
  }
  if (data && typeof data === "object") {
    return Object.values(data).flatMap(collectStringLeaves);
  }
  return [];
}

/** Định dạng object phân tích chiến lược (schema coin / metric_or_model / logic_analysis / pros / cons / summary). */
function formatStrategyPayload(o: Record<string, unknown>): string {
  const lines: string[] = [];
  if (typeof o.coin === "string") lines.push(`Cặp: ${o.coin}`);
  if (typeof o.metric_or_model === "string") lines.push(`Chỉ báo / mô hình: ${o.metric_or_model}`);
  if (typeof o.summary === "string") {
    lines.push("", "— Tóm tắt —", o.summary);
  }
  if (typeof o.logic_analysis === "string") {
    lines.push("", "— Phân tích logic —", o.logic_analysis);
  }
  if (Array.isArray(o.pros) && o.pros.length > 0) {
    lines.push("", "— Ưu điểm —");
    for (const p of o.pros) {
      if (typeof p === "string") lines.push(`• ${p}`);
    }
  }
  if (Array.isArray(o.cons) && o.cons.length > 0) {
    lines.push("", "— Nhược điểm —");
    for (const c of o.cons) {
      if (typeof c === "string") lines.push(`• ${c}`);
    }
  }
  return lines.join("\n").trim();
}

/**
 * Bóc khối ```json ... ``` (hoặc JSON thuần) rồi parse object — dùng cho lá chuỗi từ GET /get_analyze dạng [[ "...json..." ]].
 */
function tryParseStrategyObjectFromString(s: string): Record<string, unknown> | null {
  let t = s.trim();
  if (!t) return null;

  const fenced = /^```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```\s*$/im.exec(t);
  if (fenced) t = fenced[1].trim();
  else if (t.startsWith("```")) {
    t = t.replace(/^```[a-zA-Z]*\s*/m, "").replace(/\s*```\s*$/m, "").trim();
  }

  const tryJson = (raw: string): Record<string, unknown> | null => {
    try {
      const v = JSON.parse(raw) as unknown;
      if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
    } catch {
      /* ignore */
    }
    return null;
  };

  let obj = tryJson(t);
  if (obj) return obj;

  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) obj = tryJson(t.slice(start, end + 1));
  return obj;
}

function isStrategySchemaObject(o: Record<string, unknown>): boolean {
  return (
    typeof o.coin === "string" ||
    typeof o.metric_or_model === "string" ||
    typeof o.logic_analysis === "string" ||
    typeof o.summary === "string" ||
    (Array.isArray(o.pros) && o.pros.length > 0) ||
    (Array.isArray(o.cons) && o.cons.length > 0)
  );
}

/**
 * GET /get_analyze có thể trả:
 * - object có analyzeText / text / …
 * - hoặc mảng lồng nhau chứa một chuỗi JSON (schema chiến lược).
 */
function extractAnalyzeDisplayText(data: unknown): string {
  if (data === null || data === undefined) return "";

  if (typeof data === "object" && !Array.isArray(data)) {
    const flat = pickAnalyzeText(data as Record<string, unknown>);
    if (flat) return flat;
  }

  const leaves = collectStringLeaves(data);
  for (const s of leaves) {
    const t = s.trim();
    if (!t) continue;
    const obj = tryParseStrategyObjectFromString(t);
    if (obj && isStrategySchemaObject(obj)) {
      return formatStrategyPayload(obj);
    }
  }

  if (leaves.length > 0) {
    return leaves.join("\n\n").trim();
  }

  if (typeof data === "string") return data;
  return JSON.stringify(data, null, 2);
}

/**
 * Sau khi /get_analyze thành công: gọi ngầm POST /tradingautomation?inp=<ragId> (body rỗng, giống OpenAPI/curl).
 * Không dùng AbortSignal — trình duyệt chờ tới khi server đóng kết nối (không cắt theo timeout phía client).
 */
function fireTradingAutomation(ragId: string): void {
  const rid = ragId.trim();
  const base = apiBase();
  if (!base || !rid) return;
  const url = `${base}/tradingautomation?inp=${encodeURIComponent(rid)}`;
  const headers: HeadersInit = { ...apiHeaders(), Accept: "application/json" };
  void fetch(url, {
    method: "POST",
    headers,
    body: "",
    signal: null,
  })
    .then((res) => {
      if (res.ok) {
        void res.text().catch(() => {});
        return;
      }
      void res.text().then(
        (t) => console.warn("[tradingautomation]", res.status, t.slice(0, 200)),
        () => console.warn("[tradingautomation]", res.status),
      );
    })
    .catch((err: unknown) => {
      console.warn("[tradingautomation]", err);
    });
}

/** POST /rag-upload — multipart field `file` (see Body_rag_upload_rag_upload_post in OpenAPI) */
export async function uploadRag(file: File): Promise<string> {
  const base = apiBase();
  if (!base) {
    throw new Error("Chưa cấu hình VITE_API_BASE_URL trong .env");
  }
  const url = `${base}/rag-upload`;
  const body = new FormData();
  body.append(uploadFieldName(), file);

  const res = await fetch(url, {
    method: "POST",
    body,
    headers: apiHeaders(),
  });

  const data = (await parseJson(res)) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(extractErrorPayload(data, res.status));
  }
  const id = pickId(data);
  if (!id) {
    throw new Error("Phản hồi upload không có id");
  }
  return id;
}

export type GetAnalyzeOptions = {
  signal?: AbortSignal;
  /**
   * Mặc định true: sau khi có phân tích, gọi POST /tradingautomation?inp=…
   * Đặt false khi khôi phục sau F5 để tránh kích hoạt bot lặp lại.
   */
  fireTradingAutomation?: boolean;
};

/**
 * GET /get_analyze
 * - Có `id`: ?id=…
 * - Không có `id` (undefined / null / ""): gọi không query — backend có thể trả bản phân tích mới nhất (cần API hỗ trợ).
 */
export async function getAnalyze(id?: string | null, options?: GetAnalyzeOptions): Promise<string> {
  const base = apiBase();
  if (!base) {
    throw new Error("Chưa cấu hình VITE_API_BASE_URL trong .env");
  }
  const trimmed = id !== undefined && id !== null ? String(id).trim() : "";
  const url = trimmed
    ? `${base}/get_analyze?id=${encodeURIComponent(trimmed)}`
    : `${base}/get_analyze`;
  const res = await fetch(url, {
    method: "GET",
    headers: apiHeaders(),
    signal: options?.signal,
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(extractErrorPayload(data as Record<string, unknown>, res.status));
  }
  const text = extractAnalyzeDisplayText(data);
  const record = data as Record<string, unknown>;
  const resolvedId = pickId(record) ?? (trimmed || null);
  const shouldFire = options?.fireTradingAutomation !== false;
  if (resolvedId && shouldFire) {
    fireTradingAutomation(resolvedId);
  }
  if (!trimmed && resolvedId) {
    persistLastRagSession(resolvedId, "Phân tích mới nhất (server)");
  }
  return text;
}

export function isApiConfigured(): boolean {
  return apiBase().length > 0;
}

// ─── Bot history (GET /botHistory) ───────────────────────────────────────────

export type BotHistoryItem = {
  bot_name: string;
  bot_action: string;
  analysis: string | null;
  status: string | null;
  created_at: string;
};

function normalizeBotHistoryItem(raw: unknown, _index: number): BotHistoryItem | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const bot_name = typeof o.bot_name === "string" ? o.bot_name.trim() : "";
  const bot_action = typeof o.bot_action === "string" ? o.bot_action.trim() : "";
  const analysis =
    o.analysis === null || o.analysis === undefined ? null : String(o.analysis).trim() || null;
  const status =
    o.status === null || o.status === undefined ? null : String(o.status).trim().toUpperCase() || null;
  const created_at = typeof o.created_at === "string" ? o.created_at.trim() : "";
  if (!bot_action && !bot_name) return null;
  return {
    bot_name: bot_name || "—",
    bot_action: bot_action || "—",
    analysis,
    status,
    created_at: created_at || new Date(0).toISOString(),
  };
}

/** GET /botHistory — mảng lịch sử lệnh bot */
export async function fetchBotHistory(): Promise<BotHistoryItem[]> {
  const base = apiBase();
  if (!base) {
    throw new Error("Chưa cấu hình VITE_API_BASE_URL trong .env");
  }
  const url = `${base}/botHistory`;
  const res = await fetch(url, {
    method: "GET",
    headers: apiHeaders(),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(extractErrorPayload(data as Record<string, unknown>, res.status));
  }
  if (!Array.isArray(data)) return [];
  return data
    .map((row, i) => normalizeBotHistoryItem(row, i))
    .filter((x): x is BotHistoryItem => x !== null);
}
