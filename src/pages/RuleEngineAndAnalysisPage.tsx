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
  User,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TradingUploadContainer } from "@/components/trading/TradingUploadContainer";
import { TradingAnalysisContainer } from "@/components/trading/TradingAnalysisContainer";
import { persistRuleEngineAnalyzeDraft, useRagPdfStrategy } from "@/hooks/useRagPdfStrategy";
import { useToast } from "@/hooks/use-toast";
import { confirmRuleEngineAfterEdit, readLastRagSession } from "@/lib/ragApi";
import {
  clearRuleEngineUiSession,
  persistRuleEngineUiSession,
  readRuleEngineUiSession,
  type RuleEngineConfirmState as ConfirmState,
  type RuleEngineStep as Step,
  type RuleEngineUiSession,
} from "@/lib/ruleEngineUiSession";

const STEP_TRANSITION_MS = 2000;

type CompletingStep = null | 1 | 2;

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

  const initialUiRagId = ragId?.trim() || readLastRagSession()?.ragId?.trim() || null;
  const initialUi = readRuleEngineUiSession(initialUiRagId);
  const [step, setStep] = useState<Step>(() => initialUi?.step ?? 1);
  const [confirmState, setConfirmState] = useState<ConfirmState>(() => initialUi?.confirmState ?? "editing");
  const [finalAnalysis, setFinalAnalysis] = useState<string | null>(() => initialUi?.finalAnalysis ?? null);
  const [completingStep, setCompletingStep] = useState<CompletingStep>(null);

  const prevStratRef = useRef(strat);
  useEffect(() => {
    const prev = prevStratRef.current;
    prevStratRef.current = strat;
    if (prev !== "processing" || strat !== "loaded" || step !== 1) return;
    setCompletingStep(1);
  }, [strat, step, analyzeText]);

  useEffect(() => {
    if (completingStep !== 1) return;
    const t = window.setTimeout(() => {
      setStep(2);
      setCompletingStep(null);
    }, STEP_TRANSITION_MS);
    return () => window.clearTimeout(t);
  }, [completingStep]);

  useEffect(() => {
    if (completingStep !== 2) return;
    const t = window.setTimeout(() => {
      setStep(3);
      setConfirmState("success");
      setCompletingStep(null);
    }, STEP_TRANSITION_MS);
    return () => window.clearTimeout(t);
  }, [completingStep]);

  useEffect(() => {
    const rid = ragId?.trim() || readLastRagSession()?.ragId?.trim() || null;
    if (!rid) return;
    const saved = readRuleEngineUiSession(rid);
    if (saved) {
      setStep(saved.step);
      setConfirmState(saved.confirmState);
      setFinalAnalysis(saved.finalAnalysis);
      return;
    }
    setStep(1);
    setConfirmState("editing");
    setFinalAnalysis(null);
  }, [ragId]);

  useEffect(() => {
    const rid = ragId?.trim();
    if (!rid) return;
    const payload: RuleEngineUiSession = { ragId: rid, step, confirmState, finalAnalysis };
    persistRuleEngineUiSession(payload);
  }, [ragId, step, confirmState, finalAnalysis]);

  useEffect(() => {
    const rid = ragId?.trim();
    if (!rid || step !== 2 || strat !== "loaded") return;
    const t = window.setTimeout(() => {
      persistRuleEngineAnalyzeDraft(rid, analyzeText ?? "");
    }, 400);
    return () => window.clearTimeout(t);
  }, [analyzeText, ragId, step, strat]);

  const resetAll = () => {
    resetStrategy();
    clearRuleEngineUiSession();
    setStep(1);
    setConfirmState("editing");
    setFinalAnalysis(null);
    setCompletingStep(null);
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
    setConfirmState("editing");
    setCompletingStep(2);
  };

  const stepLabels = ["Upload PDF", "Chỉnh sửa Rule", "Kết quả"];
  const indicatorStep = completingStep ?? step;
  const showStepCompleteTick = completingStep !== null;
  const isStepTransitioning = completingStep !== null;

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
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? "bg-background/80 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                Profile
              </NavLink>
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2 justify-self-end">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 sm:flex">
              <Circle className="h-1.5 w-1.5 animate-pulse fill-emerald-400 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-400">Bot Online</span>
            </div>
            <Button variant="outline" size="sm" className="h-7 rounded-full border-border/50 px-3 text-xs" onClick={() => navigate("/login")}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 px-3 pt-4 pb-2">
          <div className="mx-auto flex w-full max-w-5xl justify-center">
            <div
              key={`${indicatorStep}-${showStepCompleteTick ? "t" : "n"}`}
              className="flex flex-col items-center gap-1 rule-engine-step-enter"
            >
              <div
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300 ${
                  showStepCompleteTick
                    ? "border-emerald-500/55 bg-emerald-500/15 shadow-[0_0_28px_-6px_hsl(160_84%_39%/0.55)]"
                    : "border-primary/45 bg-primary/12 text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                }`}
              >
                {showStepCompleteTick ? (
                  <CheckCircle2 className="rule-engine-step-tick-pop h-5 w-5 text-emerald-400" />
                ) : (
                  indicatorStep
                )}
              </div>
              <span
                className={`max-w-[16rem] text-center text-[10px] font-semibold uppercase tracking-widest ${
                  showStepCompleteTick ? "text-emerald-400" : "text-primary"
                }`}
              >
                {stepLabels[indicatorStep - 1]}
              </span>
              {isStepTransitioning && (
                <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                  Đang chuyển bước tiếp theo…
                </span>
              )}
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
                  <button
                    type="button"
                    className={`${stepActionPill} text-muted-foreground disabled:pointer-events-none disabled:opacity-45`}
                    onClick={resetAll}
                    disabled={isStepTransitioning}
                  >
                    <X className="mr-1.5 inline h-3.5 w-3.5 align-text-bottom" />
                    Hủy bỏ
                  </button>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      className={`${stepActionPill} disabled:pointer-events-none disabled:opacity-45`}
                      onClick={() => setStep(1)}
                      disabled={isStepTransitioning}
                    >
                      ← Quay lại
                    </button>
                    <Button
                      size="sm"
                      className="h-9 rounded-full px-5 text-xs font-semibold shadow-sm"
                      onClick={() => void confirmRules()}
                      disabled={confirmState === "confirming" || completingStep !== null}
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
                          Bot đang chạy theo chiến lược đã phân tích. Theo dõi lệnh tại{" "}
                          <span className="font-medium text-primary">Trading</span>
                          {". "}
                          Xem phân tích AI đầy đủ trong{" "}
                          <Link to="/profile?tab=rules" className="font-medium text-primary underline-offset-2 hover:underline">
                            Profile → Rules
                          </Link>
                          .
                        </p>
                      </div>
                    </div>

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
