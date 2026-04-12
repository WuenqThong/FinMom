import { useState, useEffect, useRef, useCallback, DragEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp, Upload, FileText, CheckCircle2, Loader2,
  X, BarChart2, Clock, Activity, TrendingDown,
  Cpu, Circle, History, Zap, ShieldCheck,
  AlertCircle, Bot, BookOpen, Target, Percent, Award, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAnalyze, isApiConfigured, uploadRag } from "@/lib/ragApi";
import { StrategyAnalysisDisplay } from "@/components/trading/StrategyAnalysisDisplay";

// ─── Types ─────────────────────────────────────────────────────────────────
type StrategyState = "idle" | "dragging" | "processing" | "loaded" | "error";
type OrderTab = "pending" | "active" | "closed";
type RightTab = "orders" | "analysis" | "performance" | "recent";
type Side = "LONG" | "SHORT";

interface PendingOrder {
  id: string; symbol: string; side: Side;
  targetPrice: number; condition: string; confidence: number;
}
interface ActiveOrder {
  id: string; symbol: string; side: Side;
  entryPrice: number; currentPrice: number;
  size: number; pnl: number; pnlPct: number; duration: string;
}
interface ClosedOrder {
  id: string; symbol: string; side: Side;
  entryPrice: number; exitPrice: number;
  size: number; finalPnl: number; finalPnlPct: number; closedAt: string;
}
// ─── Mock data ──────────────────────────────────────────────────────────────
const INIT_PENDING: PendingOrder[] = [
  { id:"p1", symbol:"BTC/USDT", side:"LONG",  targetPrice:68500, condition:"RSI(14)<35 + MA Cross",    confidence:87 },
  { id:"p2", symbol:"ETH/USDT", side:"SHORT", targetPrice:3420,  condition:"Resistance zone break",     confidence:72 },
  { id:"p3", symbol:"SOL/USDT", side:"LONG",  targetPrice:148.5, condition:"Bullish engulfing D1",      confidence:65 },
  { id:"p4", symbol:"BNB/USDT", side:"LONG",  targetPrice:595,   condition:"Support bounce + volume",   confidence:79 },
];
const INIT_ACTIVE: ActiveOrder[] = [
  { id:"a1", symbol:"BTC/USDT", side:"LONG",  entryPrice:68200, currentPrice:69450, size:0.03, pnl:37.5,  pnlPct:1.83,  duration:"2h 14m" },
  { id:"a2", symbol:"ETH/USDT", side:"SHORT", entryPrice:3520,  currentPrice:3485,  size:0.5,  pnl:17.5,  pnlPct:0.99,  duration:"45m"    },
  { id:"a3", symbol:"SOL/USDT", side:"LONG",  entryPrice:152,   currentPrice:149.2, size:3,    pnl:-8.4,  pnlPct:-1.84, duration:"1h 02m" },
];
const CLOSED: ClosedOrder[] = [
  { id:"c1", symbol:"BTC/USDT", side:"LONG",  entryPrice:67200, exitPrice:69800, size:0.05, finalPnl:130,  finalPnlPct:3.87,  closedAt:"Today 09:42"   },
  { id:"c2", symbol:"ETH/USDT", side:"SHORT", entryPrice:3600,  exitPrice:3450,  size:0.8,  finalPnl:120,  finalPnlPct:4.17,  closedAt:"Today 07:15"   },
  { id:"c3", symbol:"SOL/USDT", side:"LONG",  entryPrice:155,   exitPrice:148,   size:5,    finalPnl:-35,  finalPnlPct:-4.52, closedAt:"Yesterday"     },
  { id:"c4", symbol:"BNB/USDT", side:"LONG",  entryPrice:580,   exitPrice:612,   size:0.3,  finalPnl:9.6,  finalPnlPct:5.52,  closedAt:"Yesterday"     },
  { id:"c5", symbol:"XRP/USDT", side:"SHORT", entryPrice:0.528, exitPrice:0.552, size:500,  finalPnl:-12,  finalPnlPct:-4.55, closedAt:"Apr 10"        },
  { id:"c6", symbol:"BTC/USDT", side:"LONG",  entryPrice:65400, exitPrice:67100, size:0.04, finalPnl:68,   finalPnlPct:2.60,  closedAt:"Apr 10"        },
];
const EQUITY = [10000,10250,10180,10450,10380,10720,10640,10890,11050,10920,11200,11380,11260,11540,11720,11680,11950,12100,12050,12340];

// ─── Helpers ────────────────────────────────────────────────────────────────
function SideBadge({ side }: { side: Side }) {
  const isLong = side === "LONG";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
      isLong ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25"
              : "bg-red-500/15 text-red-400 ring-1 ring-red-500/25"}`}>
      {isLong ? "▲" : "▼"} {side}
    </span>
  );
}

function PnLValue({ v, p }: { v: number; p: number }) {
  const pos = v >= 0;
  return (
    <div className={`font-mono tabular-nums leading-none transition-colors duration-500 ${pos ? "text-emerald-400" : "text-red-400"}`}>
      <span className="text-sm font-bold">{pos?"+":""}{v.toFixed(2)}$</span>
      <span className="ml-1 text-[10px] opacity-70">({pos?"+":""}{p.toFixed(2)}%)</span>
    </div>
  );
}

function EquityChart({ pts }: { pts: number[] }) {
  const W=500,H=100, mn=Math.min(...pts), mx=Math.max(...pts);
  const xs=pts.map((_,i)=>(i/(pts.length-1))*W);
  const ys=pts.map(v=>H-((v-mn)/(mx-mn))*(H-12)-6);
  const path=xs.map((x,i)=>`${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
  const fill=path+` L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="egrd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(167,100%,48%)" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="hsl(167,100%,48%)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#egrd)"/>
      <path d={path} fill="none" stroke="hsl(167,100%,48%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DonutWinRate({ pct }: { pct: number }) {
  const r=34, c=2*Math.PI*r, dash=(pct/100)*c;
  return (
    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(220,28%,16%)" strokeWidth="9"/>
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(167,100%,48%)" strokeWidth="9"
          strokeDasharray={`${dash} ${c-dash}`} strokeDashoffset={c*0.25} strokeLinecap="round"/>
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-base font-bold text-primary">{pct}%</span>
        <span className="text-[9px] text-muted-foreground mt-0.5">WIN</span>
      </div>
    </div>
  );
}

/** Donut lớn cho tab Hiệu suất — có glow nhẹ */
function DonutWinRateHero({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative flex h-[148px] w-[148px] shrink-0 items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-primary/15 blur-2xl"
        aria-hidden
      />
      <svg width="148" height="148" viewBox="0 0 148 148" className="relative drop-shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
        <circle cx="74" cy="74" r={r} fill="none" stroke="hsl(220,28%,14%)" strokeWidth="11" />
        <circle
          cx="74"
          cy="74"
          r={r}
          fill="none"
          stroke="hsl(167,100%,48%)"
          strokeWidth="11"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={c * 0.25}
          strokeLinecap="round"
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-3xl font-bold tabular-nums text-primary">{pct}%</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Win rate
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TradingPage() {
  const navigate = useNavigate();

  // Strategy
  const [strat, setStrat] = useState<StrategyState>("idle");
  const [stratFile, setStratFile] = useState<string|null>(null);
  const [isDrag, setIsDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Orders
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(INIT_ACTIVE);
  const [orderTab, setOrderTab] = useState<OrderTab>("active");
  const [rightTab, setRightTab] = useState<RightTab>("orders");

  /** AI analysis from GET /get_analyze (read-only display in Command panel) */
  const [analyzeText, setAnalyzeText] = useState<string | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const analyzeEndRef = useRef<HTMLDivElement>(null);

  // Realtime PnL
  useEffect(() => {
    const t = setInterval(() => {
      setActiveOrders(prev => prev.map(o => {
        const delta = (Math.random()-0.48) * o.entryPrice * 0.0007;
        const cur = o.currentPrice + delta;
        const pnl = o.side==="LONG" ? (cur-o.entryPrice)*o.size : (o.entryPrice-cur)*o.size;
        const pct = ((cur-o.entryPrice)/o.entryPrice)*100*(o.side==="LONG"?1:-1);
        return { ...o, currentPrice:cur, pnl, pnlPct:pct };
      }));
    }, 1100);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    analyzeEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [analyzeText]);

  // Strategy: upload PDF → POST /rag-uploadRag → GET /get_analyze
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
      const text = await getAnalyze(id);
      setAnalyzeText(text.trim() || "(Không có nội dung phân tích.)");
      setStrat("loaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setAnalyzeError(msg);
      setStrat("idle");
      setStratFile(null);
    }
  }, []);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDrag(false);
    const f = e.dataTransfer.files[0]; if (f) void processFile(f);
  };

  const resetStrategy = () => {
    setStrat("idle");
    setStratFile(null);
    setAnalyzeText(null);
    setAnalyzeError(null);
  };

  // Analytics stats
  const totalPnl = CLOSED.reduce((s,o)=>s+o.finalPnl,0);
  const wins = CLOSED.filter(o=>o.finalPnl>0).length;
  const lossCount = CLOSED.length - wins;
  const winRate = CLOSED.length ? Math.round((wins / CLOSED.length) * 100) : 0;
  const totalActivePnl = activeOrders.reduce((s,o)=>s+o.pnl,0);

  const winningTrades = CLOSED.filter((o) => o.finalPnl > 0);
  const losingTrades = CLOSED.filter((o) => o.finalPnl < 0);
  const avgWin =
    winningTrades.length > 0
      ? winningTrades.reduce((s, o) => s + o.finalPnl, 0) / winningTrades.length
      : 0;
  const avgLoss =
    losingTrades.length > 0
      ? losingTrades.reduce((s, o) => s + o.finalPnl, 0) / losingTrades.length
      : 0;
  const bestClosed = CLOSED.length ? Math.max(...CLOSED.map((o) => o.finalPnl)) : 0;
  const worstClosed = CLOSED.length ? Math.min(...CLOSED.map((o) => o.finalPnl)) : 0;
  const winBarPct = CLOSED.length ? (wins / CLOSED.length) * 100 : 0;
  const lossBarPct = CLOSED.length ? (lossCount / CLOSED.length) * 100 : 0;

  const pnlBySymbolSorted = (() => {
    const m = new Map<string, number>();
    for (const o of CLOSED) {
      m.set(o.symbol, (m.get(o.symbol) ?? 0) + o.finalPnl);
    }
    return [...m.entries()].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  })();
  const maxSymbolPnlAbs = Math.max(...pnlBySymbolSorted.map(([, v]) => Math.abs(v)), 1);

  return (
    <div className="trading-root min-h-screen w-full max-w-[100vw] overflow-x-auto flex flex-col bg-background text-foreground">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-2.5">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 justify-self-start">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
              <TrendingUp className="h-4 w-4 text-primary"/>
            </div>
            <span className="text-base font-bold tracking-tight finwise-logo-text">FinWise</span>
          </Link>

          {/* Nav — single current page, centered (DesignKit: pill + primary border when active) */}
          <nav className="flex justify-center">
            <Link
              to="/trading"
              className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary"
            >
              <Bot className="h-3.5 w-3.5" />
              Trading
            </Link>
          </nav>

          {/* Status + actions */}
          <div className="flex items-center justify-end gap-2 justify-self-end">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1">
              <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400 animate-pulse"/>
              <span className="text-[11px] font-semibold text-emerald-400">Bot Online</span>
            </div>
            <Button variant="outline" size="sm"
              className="rounded-full text-xs border-border/50 h-7 px-3"
              onClick={() => navigate("/login")}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* ── Body: 2-column grid (hiệu suất + lệnh gần đây gộp vào tab cột 2) ── */}
      <div className="flex-1 grid grid-cols-[500px_1fr] gap-3 p-3 overflow-hidden" style={{ height:"calc(100vh - 49px)" }}>

        {/* ════ COL 1 — STRATEGY UPLOAD ════ */}
        <div className="flex flex-col gap-5 min-h-0 overflow-y-auto trading-scroll">

          {/* Upload card */}
          <Card className="glass-panel shrink-0">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 border border-primary/25">
                  <BookOpen className="h-3.5 w-3.5 text-primary"/>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rule Engine</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tải file <span className="text-primary font-medium">.PDF</span> chứa chiến lược giao dịch của bạn.
                AI sẽ đọc và parse thành lệnh Bot tự động.
              </p>

              {/* Drop zone */}
              {(strat==="idle"||strat==="dragging"||strat==="error") && (
                <div
                  className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-5 cursor-pointer transition-all duration-200 ${
                    isDrag ? "border-primary/70 bg-primary/8 scale-[1.01]"
                    : strat==="error" ? "border-red-500/40 bg-red-500/5"
                    : "border-border/50 hover:border-primary/40 hover:bg-primary/4"}`}
                  onClick={() => { setStrat("idle"); fileRef.current?.click(); }}
                  onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
                  onDragLeave={() => setIsDrag(false)}
                  onDrop={onDrop}>
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) void processFile(f); }}/>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    isDrag ? "border-primary/60 bg-primary/20"
                    : strat==="error" ? "border-red-500/40 bg-red-500/10"
                    : "border-border/60 bg-card"}`}>
                    {strat==="error"
                      ? <AlertCircle className="h-5 w-5 text-red-400"/>
                      : <Upload className={`h-5 w-5 ${isDrag?"text-primary":"text-muted-foreground"}`}/>}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-semibold ${strat==="error"?"text-red-400":""}`}>
                      {strat==="error" ? "Chỉ chấp nhận file .PDF" : isDrag ? "Thả file vào đây" : "Kéo thả hoặc click"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PDF · Tối đa 10MB</p>
                  </div>
                </div>
              )}

              {strat==="processing" && (
                <div className="flex flex-col items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <Loader2 className="h-7 w-7 text-primary animate-spin"/>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-primary">Đang phân tích PDF...</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">AI đang parse chiến lược</p>
                  </div>
                  <div className="w-full bg-border/40 rounded-full h-1">
                    <div className="bg-primary h-1 rounded-full dash-progress-bar"/>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{stratFile}</p>
                </div>
              )}

              {strat==="loaded" && (
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400"/>
                      <span className="text-xs font-bold text-emerald-400">Strategy Active</span>
                    </div>
                    <button type="button" onClick={resetStrategy}
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="h-3.5 w-3.5"/>
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3 shrink-0"/> <span className="truncate">{stratFile}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Chiến lược đã tải. Phân tích AI hiển thị trong khung <span className="text-primary font-medium">Analysis</span> bên dưới.
                  </p>
                  <Button size="sm" variant="ghost"
                    className="w-full h-7 rounded-full text-[11px] text-primary border border-primary/25 bg-primary/8 hover:bg-primary/15"
                    onClick={resetStrategy}>
                    Thay chiến lược mới
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI analysis (read-only — GET /get_analyze) */}
          <Card
            className="glass-panel relative flex flex-col overflow-hidden border-primary/15 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)]"
            style={{ minHeight: 480 }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
              aria-hidden
            />
            <CardContent className="p-3 flex flex-col h-full min-h-0">
              <div className="mb-3 flex shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 to-primary/5 ring-1 ring-primary/20">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Analysis
                  </span>
                  <p className="text-[9px] text-muted-foreground/80">Phân tích chiến lược từ tài liệu</p>
                </div>
                <div className="ml-auto flex gap-1" aria-hidden="true">
                  {["bg-red-500/60", "bg-amber-500/60", "bg-emerald-500/60"].map((c) => (
                    <div key={c} className={`h-2 w-2 rounded-full ${c}`} />
                  ))}
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto pr-1 trading-scroll [scrollbar-gutter:stable]"
                style={{ maxHeight: 512 }}
                tabIndex={0}
                role="region"
                aria-label="Phân tích AI"
              >
                {strat === "processing" && (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                    <p className="text-[11px] font-mono text-center px-2">Đang tải và phân tích chiến lược…</p>
                  </div>
                )}

                {strat !== "processing" && analyzeError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-2.5 py-2 text-[11px] font-mono text-red-400 leading-relaxed">
                    {analyzeError}
                  </div>
                )}

                {strat !== "processing" && !analyzeError && !analyzeText && (
                  <div className="flex gap-1.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">AI</div>
                    <div className="rounded-lg border border-border/50 bg-card px-2.5 py-1.5 text-[11px] leading-relaxed font-mono text-muted-foreground">
                      {isApiConfigured()
                        ? "Tải file .PDF ở Rule Engine phía trên để hiển thị phân tích AI tại đây."
                        : "Cấu hình VITE_API_BASE_URL trỏ tới backend, sau đó tải file .PDF để nhận phân tích."}
                    </div>
                  </div>
                )}

                {strat !== "processing" && analyzeText && (
                  <StrategyAnalysisDisplay text={analyzeText} />
                )}
                <div ref={analyzeEndRef}/>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ════ COL 2 — tabs: Lệnh Bot / Phân tích / Hiệu suất / Lệnh gần đây ════ */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">

          {/* Tab switcher — Lệnh Bot / Phân tích / Hiệu suất / Lệnh gần đây */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {([
              { k: "orders" as const, l: "Lệnh Bot", icon: Bot },
              { k: "analysis" as const, l: "Phân tích", icon: BarChart2 },
              { k: "performance" as const, l: "Hiệu suất", icon: ShieldCheck },
              { k: "recent" as const, l: "Lệnh gần đây", icon: History },
            ]).map(({ k, l, icon: Icon }) => (
              <button
                key={k}
                type="button"
                onClick={() => setRightTab(k)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs ${
                  rightTab === k
                    ? "border border-primary/25 bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {l}
              </button>
            ))}

            {/* Active PnL summary pill */}
            {rightTab==="orders" && orderTab==="active" && (
              <div className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold border ${
                totalActivePnl>=0
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : "bg-red-500/10 border-red-500/25 text-red-400"}`}>
                <TrendingUp className="h-3 w-3"/>
                Tổng PnL: {totalActivePnl>=0?"+":""}{totalActivePnl.toFixed(2)}$
              </div>
            )}
          </div>

          {/* ── ORDERS TAB ── */}
          {rightTab==="orders" && (
            <Card className="glass-panel flex-1 flex flex-col min-h-0">
              <CardContent className="p-4 flex flex-col h-full min-h-0">
                {/* Sub-tabs */}
                <div className="flex gap-1 mb-3 shrink-0">
                  {([
                    { k:"active",  l:"Đang chạy",    icon:Activity, n:activeOrders.length  },
                    { k:"pending", l:"Chờ vào lệnh", icon:Clock,    n:INIT_PENDING.length  },
                    { k:"closed",  l:"Đã đóng",      icon:History,  n:CLOSED.length        },
                  ] as { k:OrderTab; l:string; icon:React.ElementType; n:number }[]).map(({ k,l,icon:Icon,n }) => (
                    <button key={k} onClick={()=>setOrderTab(k)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        orderTab===k ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                      <Icon className="h-3 w-3"/>{l}
                      <span className={`rounded-full px-1.5 text-[9px] font-bold ${orderTab===k?"bg-primary/25 text-primary":"bg-muted text-muted-foreground"}`}>{n}</span>
                    </button>
                  ))}
                </div>

                {/* ─ Active ─ */}
                {orderTab==="active" && (
                  <div className="flex-1 overflow-y-auto trading-scroll space-y-2 min-h-0">
                    {activeOrders.map(o => (
                      <div key={o.id} className={`grid items-center gap-2 rounded-xl px-4 py-3 border transition-colors duration-300 ${
                        o.pnl>=0
                          ? "bg-emerald-500/5 border-emerald-500/15"
                          : "bg-red-500/5 border-red-500/15"}`}
                        style={{ gridTemplateColumns:"1fr auto 1fr 1fr 1fr auto" }}>
                        <div className="font-mono font-bold text-xs">{o.symbol}</div>
                        <SideBadge side={o.side}/>
                        <div className="text-xs text-muted-foreground font-mono">
                          <div className="text-[9px] text-muted-foreground/60">ENTRY</div>
                          ${o.entryPrice.toLocaleString()}
                        </div>
                        <div className="text-xs font-mono">
                          <div className="text-[9px] text-muted-foreground/60">CURRENT</div>
                          ${o.currentPrice.toFixed(1)}
                        </div>
                        <PnLValue v={o.pnl} p={o.pnlPct}/>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5"/>{o.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─ Pending ─ */}
                {orderTab==="pending" && (
                  <div className="flex-1 overflow-y-auto trading-scroll min-h-0">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/40">
                          {["Symbol","Side","Target","Điều kiện","Conf."].map(h=>(
                            <th key={h} className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/25">
                        {INIT_PENDING.map(o=>(
                          <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                            <td className="py-2.5 font-mono font-bold">{o.symbol}</td>
                            <td className="py-2.5"><SideBadge side={o.side}/></td>
                            <td className="py-2.5 font-mono text-muted-foreground">${o.targetPrice.toLocaleString()}</td>
                            <td className="py-2.5 text-muted-foreground max-w-[160px] truncate">{o.condition}</td>
                            <td className="py-2.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-10 bg-border/40 rounded-full h-1">
                                  <div className="bg-primary h-1 rounded-full" style={{ width:`${o.confidence}%`}}/>
                                </div>
                                <span className="text-primary text-[10px] font-bold">{o.confidence}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ─ Closed ─ */}
                {orderTab==="closed" && (
                  <div className="flex-1 overflow-y-auto trading-scroll min-h-0">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/40">
                          {["Symbol","Side","Entry","Exit","PnL","Khi đóng"].map(h=>(
                            <th key={h} className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/25">
                        {CLOSED.map(o=>(
                          <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                            <td className="py-2.5 font-mono font-bold">{o.symbol}</td>
                            <td className="py-2.5"><SideBadge side={o.side}/></td>
                            <td className="py-2.5 font-mono text-muted-foreground">${o.entryPrice.toLocaleString()}</td>
                            <td className="py-2.5 font-mono text-muted-foreground">${o.exitPrice.toLocaleString()}</td>
                            <td className="py-2.5"><PnLValue v={o.finalPnl} p={o.finalPnlPct}/></td>
                            <td className="py-2.5 text-muted-foreground">{o.closedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── ANALYSIS TAB ─ Equity Curve ── */}
          {rightTab === "analysis" && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              {/* Stats row */}
              <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { l:"Total PnL",     v:`+$${totalPnl.toFixed(0)}`, c:"text-emerald-400", icon:TrendingUp   },
                  { l:"Win Rate",      v:`${winRate}%`,              c:"text-primary",     icon:ShieldCheck  },
                  { l:"Max Drawdown",  v:"-4.52%",                   c:"text-red-400",     icon:TrendingDown },
                  { l:"Trades",        v:`${CLOSED.length}`,         c:"text-foreground",  icon:Activity     },
                ].map(({ l,v,c,icon:Icon }) => (
                  <Card key={l} className="glass-panel">
                    <CardContent className="p-3 flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                        <Icon className="h-3.5 w-3.5 text-primary"/>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wide truncate">{l}</p>
                        <p className={`text-sm font-bold font-mono ${c}`}>{v}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Equity chart */}
              <Card className="glass-panel flex-1 min-h-0">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3 shrink-0">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Equity Curve</p>
                      <p className="text-2xl font-bold text-primary font-mono mt-0.5">$12,340</p>
                      <p className="text-xs text-emerald-400 font-medium">+$2,340 (+23.4%) từ đầu</p>
                    </div>
                    <div className="flex gap-1">
                      {["1D","1W","1M","All"].map((t,i)=>(
                        <button key={t} className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                          i===3 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <EquityChart pts={EQUITY}/>
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground/50 mt-1 shrink-0">
                    <span>$10,000</span><span>+20 phiên</span><span>$12,340</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── HIỆU SUẤT TAB — lấp chiều cao: cụm trên + lưới Equity / PnL theo cặp (flex-1) + gợi ý ── */}
          {rightTab === "performance" && (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
              <Card className="glass-panel relative shrink-0 overflow-hidden border-primary/20 shadow-[0_0_48px_-16px_hsl(var(--primary)/0.2)]">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.18),transparent)]"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  aria-hidden
                />
                <CardContent className="relative space-y-5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
                          <Target className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold tracking-tight">Hiệu suất giao dịch</h2>
                          <p className="text-[11px] text-muted-foreground">
                            Tổng hợp lệnh đã đóng — dữ liệu mô phỏng
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[10px] font-medium text-muted-foreground">
                      {CLOSED.length} lệnh đóng
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch">
                    <DonutWinRateHero pct={winRate} />
                    <div className="min-w-0 flex-1 space-y-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Tổng PnL (đã đóng)
                        </p>
                        <p
                          className={`mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight ${
                            totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {totalPnl >= 0 ? "+" : ""}
                          {totalPnl.toFixed(2)}$
                        </p>
                      </div>

                      <div>
                        <div className="mb-1.5 flex justify-between text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Thắng {wins}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Thua {lossCount}
                          </span>
                        </div>
                        <div className="flex h-3 overflow-hidden rounded-full bg-muted/80 ring-1 ring-inset ring-border/40">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                            style={{ width: `${winBarPct}%` }}
                          />
                          <div
                            className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                            style={{ width: `${lossBarPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-4">
                        <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                          <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                            TB thắng
                          </p>
                          <p className="mt-0.5 font-mono text-sm font-semibold text-emerald-400">
                            +{avgWin.toFixed(1)}$
                          </p>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                          <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                            TB thua
                          </p>
                          <p className="mt-0.5 font-mono text-sm font-semibold text-red-400">
                            {avgLoss.toFixed(1)}$
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  {
                    label: "Lệnh thắng",
                    value: String(wins),
                    sub: "trên tổng",
                    icon: Award,
                    accent: "text-emerald-400",
                    bg: "from-emerald-500/15 to-transparent",
                  },
                  {
                    label: "Lệnh thua",
                    value: String(lossCount),
                    sub: "cần cải thiện",
                    icon: TrendingDown,
                    accent: "text-red-400",
                    bg: "from-red-500/12 to-transparent",
                  },
                  {
                    label: "Tốt nhất",
                    value: `+${bestClosed.toFixed(0)}$`,
                    sub: "PnL một lệnh",
                    icon: TrendingUp,
                    accent: "text-primary",
                    bg: "from-primary/15 to-transparent",
                  },
                  {
                    label: "Tệ nhất",
                    value: `${worstClosed.toFixed(0)}$`,
                    sub: "PnL một lệnh",
                    icon: Activity,
                    accent: "text-amber-400/90",
                    bg: "from-amber-500/10 to-transparent",
                  },
                ].map(({ label, value, sub, icon: Icon, accent, bg }) => (
                  <Card
                    key={label}
                    className="glass-panel overflow-hidden border-border/50 ring-1 ring-inset ring-white/[0.03]"
                  >
                    <CardContent className={`bg-gradient-to-br ${bg} p-3`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {label}
                          </p>
                          <p className={`mt-1 font-mono text-lg font-bold tabular-nums ${accent}`}>{value}</p>
                          <p className="mt-0.5 text-[9px] text-muted-foreground/80">{sub}</p>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/50 ring-1 ring-border/40">
                          <Icon className={`h-4 w-4 ${accent}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2 lg:min-h-[260px]">
                <Card className="glass-panel flex min-h-[180px] flex-col lg:min-h-0">
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                    <div className="flex shrink-0 items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Equity (mô phỏng)
                        </p>
                        <p className="mt-0.5 font-mono text-lg font-bold text-primary">$12,340</p>
                        <p className="text-[10px] text-emerald-400/90">+$2,340 so với vốn ban đầu</p>
                      </div>
                      <BarChart2 className="h-5 w-5 shrink-0 text-primary/60" />
                    </div>
                    <div className="min-h-[140px] flex-1 lg:min-h-0">
                      <EquityChart pts={EQUITY} />
                    </div>
                    <div className="flex shrink-0 justify-between text-[9px] text-muted-foreground/60">
                      <span>$10k</span>
                      <span>chuỗi phiên</span>
                      <span className="font-mono text-primary/80">$12,340</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel flex min-h-[180px] flex-col lg:min-h-0">
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                    <div className="flex shrink-0 items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 ring-1 ring-violet-500/25">
                          <Layers className="h-4 w-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            PnL theo cặp
                          </p>
                          <p className="text-[10px] text-muted-foreground/90">Đã đóng — cộng dồn theo symbol</p>
                        </div>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto trading-scroll pr-0.5">
                      {pnlBySymbolSorted.map(([symbol, pnl]) => {
                        const w = (Math.abs(pnl) / maxSymbolPnlAbs) * 100;
                        const pos = pnl >= 0;
                        return (
                          <div key={symbol}>
                            <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                              <span className="truncate font-mono font-semibold">{symbol}</span>
                              <span
                                className={`shrink-0 font-mono font-bold tabular-nums ${
                                  pos ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {pos ? "+" : ""}
                                {pnl.toFixed(1)}$
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted/80 ring-1 ring-inset ring-border/30">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  pos
                                    ? "bg-gradient-to-r from-emerald-600/90 to-emerald-400"
                                    : "bg-gradient-to-r from-red-600/90 to-red-400"
                                }`}
                                style={{ width: `${Math.max(w, 4)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-panel shrink-0 border-dashed border-border/60">
                <CardContent className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/50">
                    <Percent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">Gợi ý</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                      Win rate {winRate}% phản ánh tỷ lệ lệnh có lợi nhuận dương trong lịch sử đóng. So sánh cột PnL theo
                      cặp với equity để thấy symbol nào đang kéo hoặc kìm danh mục; theo dõi TB thua so với TB thắng để
                      đánh giá kỷ luật thoát lệnh.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── LỆNH GẦN ĐÂY TAB ── */}
          {rightTab === "recent" && (
            <Card className="glass-panel flex min-h-0 flex-1 flex-col">
              <CardContent className="flex h-full min-h-0 flex-col space-y-3 p-4">
                <div className="flex shrink-0 items-center gap-2">
                  <History className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Lệnh gần đây
                  </span>
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto trading-scroll">
                  {CLOSED.map((o) => (
                    <div
                      key={o.id}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 transition-colors ${
                        o.finalPnl >= 0
                          ? "border-emerald-500/15 bg-emerald-500/5"
                          : "border-red-500/15 bg-red-500/5"
                      }`}
                    >
                      <div>
                        <p className="font-mono text-[11px] font-bold">{o.symbol}</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <SideBadge side={o.side} />
                          <span className="text-[9px] text-muted-foreground">{o.closedAt}</span>
                        </div>
                      </div>
                      <PnLValue v={o.finalPnl} p={o.finalPnlPct} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}