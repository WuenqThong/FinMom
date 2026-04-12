/**
 * RAG backend — FinMom OpenAPI: POST /rag-upload, GET /get_analyze?id=
 * Set VITE_API_BASE_URL in .env (e.g. https://xxxx.ngrok-free.app) — no trailing slash.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

/** Chỉ cần khi gọi trực tiếp domain ngrok từ browser (không qua proxy Vite). */
function apiHeaders(): HeadersInit {
  if (API_BASE.startsWith("http://") || API_BASE.startsWith("https://")) {
    return { "ngrok-skip-browser-warning": "1" };
  }
  return {};
}

function uploadFieldName() {
  return (import.meta.env.VITE_RAG_UPLOAD_FIELD as string | undefined) || "file";
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
    (data.data as Record<string, unknown> | undefined)?.id,
  ];
  for (const c of candidates) {
    if (c !== undefined && c !== null && String(c).length > 0) return String(c);
  }
  return null;
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

/** Định dạng object phân tích chiến lược (như trong chuỗi JSON từ API). */
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
  return lines.join("\n").trim();
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
    if (t.startsWith("{")) {
      try {
        const parsed = JSON.parse(t) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return formatStrategyPayload(parsed as Record<string, unknown>);
        }
      } catch {
        /* bỏ qua, thử chuỗi khác */
      }
    }
  }

  if (leaves.length > 0) {
    return leaves.join("\n\n").trim();
  }

  if (typeof data === "string") return data;
  return JSON.stringify(data, null, 2);
}

/** POST /rag-upload — multipart field `file` (see Body_rag_upload_rag_upload_post in OpenAPI) */
export async function uploadRag(file: File): Promise<string> {
  if (!API_BASE) {
    throw new Error("Chưa cấu hình VITE_API_BASE_URL trong .env");
  }
  const url = `${API_BASE}/rag-upload`;
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

/** GET /get_analyze?id=… — returns AI analysis text */
export async function getAnalyze(id: string): Promise<string> {
  if (!API_BASE) {
    throw new Error("Chưa cấu hình VITE_API_BASE_URL trong .env");
  }
  const url = `${API_BASE}/get_analyze?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: apiHeaders(),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(extractErrorPayload(data as Record<string, unknown>, res.status));
  }
  return extractAnalyzeDisplayText(data);
}

export function isApiConfigured(): boolean {
  return API_BASE.length > 0;
}
