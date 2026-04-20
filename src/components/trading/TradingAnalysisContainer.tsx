import type { RefObject } from "react";
import { Loader2, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StrategyAnalysisDisplay } from "@/components/trading/StrategyAnalysisDisplay";
import { isApiConfigured } from "@/lib/ragApi";
import type { StrategyState } from "@/components/trading/TradingUploadContainer";

export interface TradingAnalysisContainerProps {
  strat: StrategyState;
  analyzeText: string | null;
  analyzeError: string | null;
  analyzeEndRef: RefObject<HTMLDivElement | null>;
  /** Cập nhật nội dung phân tích khi người dùng sửa tay trong các khối (StrategyAnalysisDisplay). */
  onAnalyzeTextChange?: (next: string) => void;
}

/** Container 2 — Analysis (đọc chiến lược từ PDF). */
export function TradingAnalysisContainer({
  strat,
  analyzeText,
  analyzeError,
  analyzeEndRef,
  onAnalyzeTextChange,
}: TradingAnalysisContainerProps) {
  return (
    <Card className="glass-panel relative flex min-h-[220px] flex-1 flex-col overflow-hidden border-primary/15 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)] sm:min-h-[260px] lg:min-h-0">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
        aria-hidden
      />
      <CardContent className="flex h-full min-h-0 flex-1 flex-col p-3">
        <div className="mb-3 flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 to-primary/5 ring-1 ring-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Analysis</span>
            <p className="text-[9px] text-muted-foreground/80">Phân tích chiến lược từ tài liệu</p>
          </div>
          <div className="ml-auto flex gap-1" aria-hidden="true">
            {["bg-red-500/60", "bg-amber-500/60", "bg-emerald-500/60"].map((c) => (
              <div key={c} className={`h-2 w-2 rounded-full ${c}`} />
            ))}
          </div>
        </div>

        <div
          className="trading-scroll min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-gutter:stable]"
          tabIndex={0}
          role="region"
          aria-label="Phân tích AI"
        >
          {strat === "processing" && (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="px-2 text-center font-mono text-[11px]">Đang tải và phân tích chiến lược…</p>
            </div>
          )}

          {strat !== "processing" && analyzeError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-red-400">
              {analyzeError}
            </div>
          )}

          {strat !== "processing" && !analyzeError && !analyzeText && (
            <div className="flex gap-1.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
                AI
              </div>
              <div className="rounded-lg border border-border/50 bg-card px-2.5 py-1.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {isApiConfigured()
                  ? "Tải file .PDF ở Rule Engine phía trên để hiển thị phân tích AI tại đây."
                  : "Cấu hình VITE_API_BASE_URL trỏ tới backend, sau đó tải file .PDF để nhận phân tích."}
              </div>
            </div>
          )}

          {strat !== "processing" && analyzeText && (
            <StrategyAnalysisDisplay text={analyzeText} onTextChange={onAnalyzeTextChange} />
          )}
          <div ref={analyzeEndRef} />
        </div>
      </CardContent>
    </Card>
  );
}
