import type { DragEvent, RefObject } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type StrategyState = "idle" | "dragging" | "processing" | "loaded" | "error";

export interface TradingUploadContainerProps {
  strat: StrategyState;
  setStrat: (s: StrategyState) => void;
  isDrag: boolean;
  setIsDrag: (v: boolean) => void;
  fileRef: RefObject<HTMLInputElement | null>;
  stratFile: string | null;
  processFile: (file: File) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  resetStrategy: () => void;
}

/** Container 1 — Rule Engine (upload PDF). */
export function TradingUploadContainer({
  strat,
  setStrat,
  isDrag,
  setIsDrag,
  fileRef,
  stratFile,
  processFile,
  onDrop,
  resetStrategy,
}: TradingUploadContainerProps) {
  return (
    <Card className="glass-panel shrink-0">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-primary/25 bg-primary/15">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rule Engine</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Tải file <span className="font-medium text-primary">.PDF</span> chứa chiến lược giao dịch của bạn. AI sẽ đọc và
          parse thành lệnh Bot tự động.
        </p>

        {(strat === "idle" || strat === "dragging" || strat === "error") && (
          <div
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-5 transition-all duration-200 ${
              isDrag
                ? "scale-[1.01] border-primary/70 bg-primary/8"
                : strat === "error"
                  ? "border-red-500/40 bg-red-500/5"
                  : "border-border/50 hover:border-primary/40 hover:bg-primary/4"
            }`}
            onClick={() => {
              setStrat("idle");
              fileRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDrag(true);
            }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void processFile(f);
              }}
            />
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isDrag
                  ? "border-primary/60 bg-primary/20"
                  : strat === "error"
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-border/60 bg-card"
              }`}
            >
              {strat === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-400" />
              ) : (
                <Upload className={`h-5 w-5 ${isDrag ? "text-primary" : "text-muted-foreground"}`} />
              )}
            </div>
            <div className="text-center">
              <p className={`text-xs font-semibold ${strat === "error" ? "text-red-400" : ""}`}>
                {strat === "error" ? "Chỉ chấp nhận file .PDF" : isDrag ? "Thả file vào đây" : "Kéo thả hoặc click"}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">PDF · Tối đa 10MB</p>
            </div>
          </div>
        )}

        {strat === "processing" && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-xs font-semibold text-primary">Đang phân tích PDF...</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">AI đang parse chiến lược</p>
            </div>
            <div className="h-1 w-full rounded-full bg-border/40">
              <div className="dash-progress-bar h-1 rounded-full bg-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground">{stratFile}</p>
          </div>
        )}

        {strat === "loaded" && (
          <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">Strategy Active</span>
              </div>
              <button
                type="button"
                onClick={resetStrategy}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <FileText className="h-3 w-3 shrink-0" /> <span className="truncate">{stratFile}</span>
            </p>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Chiến lược đã tải. Phân tích AI hiển thị trong khung <span className="font-medium text-primary">Analysis</span>{" "}
              bên dưới.
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-full rounded-full border border-primary/25 bg-primary/8 text-[11px] text-primary hover:bg-primary/15"
              onClick={resetStrategy}
            >
              Thay chiến lược mới
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
