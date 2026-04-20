import { useState, useEffect, useRef, useCallback, type DragEvent } from "react";
import {
  getAnalyze,
  isApiConfigured,
  uploadRag,
  persistLastRagSession,
  clearLastRagSession,
} from "@/lib/ragApi";
import type { StrategyState } from "@/components/trading/TradingUploadContainer";

/**
 * Upload PDF → /rag-upload → GET /get_analyze (không gọi /tradingautomation cho tới khi xác nhận rule).
 */
export function useRagPdfStrategy() {
  const [ragId, setRagId] = useState<string | null>(null);
  const [strat, setStrat] = useState<StrategyState>("idle");
  const [stratFile, setStratFile] = useState<string | null>(null);
  const [isDrag, setIsDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [analyzeText, setAnalyzeText] = useState<string | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const analyzeEndRef = useRef<HTMLDivElement>(null);

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
