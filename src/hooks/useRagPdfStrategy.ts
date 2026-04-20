import { useState, useEffect, useRef, useCallback, type DragEvent } from "react";
import {
  getAnalyze,
  isApiConfigured,
  uploadRag,
  persistLastRagSession,
  clearLastRagSession,
  readLastRagSession,
} from "@/lib/ragApi";
import type { StrategyState } from "@/components/trading/TradingUploadContainer";

const ANALYZE_DRAFT_KEY = "finmom_rule_engine_analyze_draft_v1";

function readAnalyzeDraft(ragId: string): string | null {
  try {
    const raw = sessionStorage.getItem(ANALYZE_DRAFT_KEY);
    if (!raw?.trim()) return null;
    const o = JSON.parse(raw) as { ragId?: string; text?: string };
    if (o.ragId !== ragId || typeof o.text !== "string") return null;
    return o.text;
  } catch {
    return null;
  }
}

export function persistRuleEngineAnalyzeDraft(ragId: string, text: string): void {
  try {
    const id = ragId.trim();
    if (!id) return;
    sessionStorage.setItem(ANALYZE_DRAFT_KEY, JSON.stringify({ ragId: id, text }));
  } catch {
    /* ignore */
  }
}

export function clearRuleEngineAnalyzeDraft(): void {
  try {
    sessionStorage.removeItem(ANALYZE_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

function initialSessionState(): {
  ragId: string | null;
  stratFile: string | null;
  strat: StrategyState;
} {
  if (typeof window === "undefined") {
    return { ragId: null, stratFile: null, strat: "idle" };
  }
  try {
    if (!isApiConfigured()) return { ragId: null, stratFile: null, strat: "idle" };
    const s = readLastRagSession();
    if (!s?.ragId) return { ragId: null, stratFile: null, strat: "idle" };
    return {
      ragId: s.ragId,
      stratFile: s.fileName ?? null,
      strat: "processing",
    };
  } catch {
    return { ragId: null, stratFile: null, strat: "idle" };
  }
}

/**
 * Upload PDF → /rag-upload → GET /get_analyze (không gọi /tradingautomation cho tới khi xác nhận rule).
 */
export function useRagPdfStrategy() {
  const init = initialSessionState();
  const [ragId, setRagId] = useState<string | null>(() => init.ragId);
  const [strat, setStrat] = useState<StrategyState>(() => init.strat);
  const [stratFile, setStratFile] = useState<string | null>(() => init.stratFile);
  const [isDrag, setIsDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [analyzeText, setAnalyzeText] = useState<string | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const analyzeEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!analyzeText) return;
    analyzeEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [analyzeText]);

  useEffect(() => {
    const s = readLastRagSession();
    if (!s?.ragId?.trim() || !isApiConfigured()) return;

    let cancelled = false;
    const rid = s.ragId.trim();

    setStrat("processing");
    setAnalyzeError(null);
    getAnalyze(rid, { fireTradingAutomation: false })
      .then((text) => {
        if (cancelled) return;
        const draft = readAnalyzeDraft(rid);
        const fromServer = text.trim() || "(No analysis text.)";
        const resolved = draft !== null ? draft : fromServer;
        setAnalyzeText(resolved);
        setAnalyzeError(null);
        setRagId(rid);
        setStratFile(s.fileName ?? null);
        setStrat("loaded");
      })
      .catch(() => {
        if (cancelled) return;
        clearLastRagSession();
        clearRuleEngineAnalyzeDraft();
        setRagId(null);
        setStrat("idle");
        setStratFile(null);
        setAnalyzeText(null);
        setAnalyzeError(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      setRagId(id);
      const text = await getAnalyze(id, { fireTradingAutomation: false });
      persistLastRagSession(id, file.name);
      setAnalyzeText(text.trim() || "(Không có nội dung phân tích.)");
      setStrat("loaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setAnalyzeError(msg);
      setStrat("idle");
      setStratFile(null);
      setRagId(null);
    }
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) void processFile(f);
  }, [processFile]);

  const resetStrategy = useCallback(() => {
    clearLastRagSession();
    clearRuleEngineAnalyzeDraft();
    setRagId(null);
    setStrat("idle");
    setStratFile(null);
    setAnalyzeText(null);
    setAnalyzeError(null);
  }, []);

  return {
    ragId,
    strat,
    setStrat,
    stratFile,
    isDrag,
    setIsDrag,
    fileRef,
    analyzeText,
    setAnalyzeText,
    analyzeError,
    analyzeEndRef,
    processFile,
    onDrop,
    resetStrategy,
  };
}
