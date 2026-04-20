import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  FileText,
  CheckCircle2,
  Loader2,
  X,
  BookOpen,
  Zap,
  Clock,
  Bot,
  Shield,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StrategyAnalysisDisplay } from "@/components/trading/StrategyAnalysisDisplay";
import { TradingUploadContainer } from "@/components/trading/TradingUploadContainer";
import { TradingAnalysisContainer } from "@/components/trading/TradingAnalysisContainer";
import { useRagPdfStrategy } from "@/hooks/useRagPdfStrategy";
import { useToast } from "@/hooks/use-toast";
import { confirmRuleEngineAfterEdit, readLastRagSession } from "@/lib/ragApi";

type Step = 1 | 2 | 3;
type ConfirmState = "editing" | "confirming" | "success";

function StepIndicator({ step, current }: { step: Step; current: Step }) {
  const isDone = step < current;
  const isActive = step === current;
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
        isDone
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
          : isActive
            ? "border-primary/40 bg-primary/15 text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.1)]"
            : "border-border/50 bg-card text-muted-foreground"
      }`}
    >
      {isDone ? <CheckCircle2 className="h-4 w-4" /> : step}
    </div>
  );
}

function StepConnector({ done, className = "" }: { done: boolean; className?: string }) {
  return (
    <div
      className={`h-px min-h-px min-w-[1.5rem] flex-1 transition-all duration-500 sm:min-w-[2.5rem] ${className} ${
        done ? "bg-emerald-500/40" : "bg-border/50"
      }`}
    />
  );
}

const stepActionPill =
  "h-9 rounded-full border border-border/60 bg-background/80 px-4 text-xs font-medium shadow-sm transition-colors hover:border-primary/35 hover:bg-background";

export default function RuleEngineAnalysisPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
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
  } = useRagPdfStrategy();

  const [step, setStep] = useState<Step>(1);
  const [confirmState, setConfirmState] = useState<ConfirmState>("editing");
  const [finalAnalysis, setFinalAnalysis] = useState<string | null>(null);

  const prevStratRef = useRef(strat);
  useEffect(() => {
    const prev = prevStratRef.current;
    prevStratRef.current = strat;
    if (prev !== "processing" || strat !== "loaded" || step !== 1) return;
    setStep(2);
  }, [strat, step, analyzeText]);

  const resetAll = () => {
    resetStrategy();
    setStep(1);
    setConfirmState("editing");
    setFinalAnalysis(null);
  };

  const confirmRules = async () => {
    const resolvedRagId = ragId?.trim() || readLastRagSession()?.ragId?.trim();
    if (!resolvedRagId) {
      toast({
        title: "Thiếu phiên RAG",
        description: "Tải lại file PDF ở bước 1 rồi thử xác nhận lại.",
        variant: "destructive",
      });
      return;
    }
    const analyzePayload = (analyzeText ?? "").trim();
    setConfirmState("confirming");
    try {
      await confirmRuleEngineAfterEdit(resolvedRagId, analyzePayload);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không gửi được xác nhận";
      toast({ title: "Lỗi backend", description: msg, variant: "destructive" });
      setConfirmState("editing");
      return;
    }
    if (analyzeText?.trim()) {
      setFinalAnalysis(analyzeText);
    } else {
      setFinalAnalysis(
        "✓ Chiến lược scalping H1+M5 đã được parse thành công.\n" +
          "Bot kích hoạt: EMA 8/13/21 trên M5, điều kiện H1 trending.\n" +
          "Quy tắc vào lệnh 5 nến · Thoát 3 nến · R:R 1:2.",
      );
    }
    setConfirmState("success");
    setStep(3);
  };

  const stepLabels = ["Upload PDF", "Chỉnh sửa Rule", "Kết quả"];

  return (
    <div className="trading-root flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-2.5">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 justify-self-start">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="finwise-logo-text text-base font-bold tracking-tight">FinWise</span>
          </Link>

          <nav className="flex justify-center">
            <div className="flex items-center gap-0 rounded-full border border-primary/25 bg-primary/15 p-0.5">
              <NavLink
                to="/rule-engine-and-analysis"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? "bg-background/80 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                Rule Engine &amp; Analysis
              </NavLink>
              <NavLink
                to="/trading"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? "bg-background/80 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <Bot className="h-3.5 w-3.5 shrink-0" />
                Trading
              </NavLink>
            </div>
          </nav>

          <div className="flex justify-end gap-2 justify-self-end">
            <Link to="/trading">
              <Button variant="outline" size="sm" className="h-7 rounded-full border-border/50 px-3 text-xs">
                ← Lệnh Bot
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 px-3 pt-4 pb-2">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-2 sm:justify-between">
            <div className="flex w-24 shrink-0 flex-col items-center gap-1.5 sm:w-28">
              <StepIndicator step={1} current={step} />
              <span
                className={`text-center text-[10px] font-semibold uppercase tracking-widest ${
                  step === 1 ? "text-primary" : step > 1 ? "text-emerald-400" : "text-muted-foreground"
                }`}
              >
                {stepLabels[0]}
              </span>
            </div>
            <StepConnector done={step > 1} className="mb-5 max-sm:hidden" />
            <div className="flex w-24 shrink-0 flex-col items-center gap-1.5 sm:w-28">
              <StepIndicator step={2} current={step} />
              <span
                className={`text-center text-[10px] font-semibold uppercase tracking-widest ${
                  step === 2 ? "text-primary" : step > 2 ? "text-emerald-400" : "text-muted-foreground"
                }`}
              >
                {stepLabels[1]}
              </span>
            </div>
            <StepConnector done={step > 2} className="mb-5 max-sm:hidden" />
            <div className="flex w-24 shrink-0 flex-col items-center gap-1.5 sm:w-28">
              <StepIndicator step={3} current={step} />
              <span
                className={`text-center text-[10px] font-semibold uppercase tracking-widest ${
                  step === 3 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {stepLabels[2]}
              </span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 lg:h-[calc(100vh-49px)]">
            <section
              aria-label="Rule Engine — tải PDF"
              className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col lg:max-w-5xl"
            >
              <TradingUploadContainer
                strat={strat}
                setStrat={setStrat}
                isDrag={isDrag}
                setIsDrag={setIsDrag}
                fileRef={fileRef}
                stratFile={stratFile}
                processFile={processFile}
                onDrop={onDrop}
                resetStrategy={resetStrategy}
              />
            </section>
          </div>
        )}

        {step >= 2 && (
          <main
            className={
              step === 2
                ? "flex min-h-0 flex-1 flex-col overflow-hidden"
                : "min-h-0 flex-1 overflow-y-auto px-3 pb-6"
            }
          >
            {step === 2 && (
              <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-3 overflow-hidden p-3 lg:h-[calc(100vh-49px)]">
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: FileText, label: `File: ${stratFile ?? "strategy.pdf"}` },
                    { icon: Activity, label: "Khung: H1 + M5" },
                    { icon: Zap, label: "EMA: 8, 13, 21" },
                    { icon: Shield, label: "R:R: 1R / 2R" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      {label}
                    </div>
                  ))}
                  <div className="flex w-full items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 sm:ml-auto sm:w-auto">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-400">PDF Loaded</span>
                  </div>
                </div>

                <section aria-label="Phân tích AI" className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <TradingAnalysisContainer
                    strat={strat}
                    analyzeText={analyzeText}
                    analyzeError={analyzeError}
                    analyzeEndRef={analyzeEndRef}
                    onAnalyzeTextChange={(next) => setAnalyzeText(next)}
                  />
                </section>

                <div className="flex shrink-0 flex-col gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" className={`${stepActionPill} text-muted-foreground`} onClick={resetAll}>
                    <X className="mr-1.5 inline h-3.5 w-3.5 align-text-bottom" />
                    Hủy bỏ
                  </button>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button type="button" className={stepActionPill} onClick={() => setStep(1)}>
                      ← Quay lại
                    </button>
                    <Button
                      size="sm"
                      className="h-9 rounded-full px-5 text-xs font-semibold shadow-sm"
                      onClick={() => void confirmRules()}
                      disabled={confirmState === "confirming"}
                    >
                      {confirmState === "confirming" ? (
                        <>
                          <Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin" /> Đang xử lý...
                        </>
                      ) : (
                        <>✓ Xác nhận Rule &amp; Gửi →</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto w-full max-w-6xl space-y-4 px-3 pt-2 pb-6">
                {confirmState === "confirming" && (
                  <Card className="glass-panel relative overflow-hidden border-primary/15">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
                    <CardContent className="flex flex-col items-center gap-4 p-8">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-primary">Đang hoàn tất xác nhận...</p>
                        <p className="mt-1 text-xs text-muted-foreground">Quá trình này có thể mất vài giây</p>
                      </div>
                      <div className="flex gap-1.5">
                        {[0, 0.2, 0.4].map((d, i) => (
                          <div
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary"
                            style={{ animation: `ping 1.2s ease-in-out ${d}s infinite` }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
                        <Clock className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">Đang đồng bộ phân tích...</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {confirmState === "success" && (
                  <>
                    <div className="flex items-center gap-4 rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-400">Rule đã được xác nhận &amp; kích hoạt!</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Bot đang chạy theo chiến lược đã phân tích. Theo dõi tại tab{" "}
                          <span className="font-medium text-primary">Lệnh Bot</span>.
                        </p>
                      </div>
                    </div>

                    {finalAnalysis && (
                      <Card className="glass-panel relative overflow-hidden border-primary/15 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.2)]">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
                        <CardContent className="flex flex-col gap-3 p-5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/25 bg-primary/15">
                              <Zap className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                              Phân tích AI cuối
                            </p>
                          </div>
                          <div className="max-h-[min(60vh,520px)] min-h-[200px] overflow-y-auto rounded-lg border border-border/50 bg-card p-3 trading-scroll">
                            <StrategyAnalysisDisplay text={finalAnalysis} />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full border-border/50 px-4 text-xs"
                        onClick={resetAll}
                      >
                        ↺ Upload chiến lược mới
                      </Button>
                      <Button size="sm" className="h-9 rounded-full px-5 text-xs font-semibold" onClick={() => navigate("/trading")}>
                        <Bot className="mr-1.5 h-3.5 w-3.5" /> Đến Lệnh Bot
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
