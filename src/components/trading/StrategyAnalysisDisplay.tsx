import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Sparkles,
  GitBranch,
  ListChecks,
  Coins,
  Wrench,
  FileText,
  AlertCircle,
  Pencil,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Meta = { pair?: string; metrics?: string };
type SectionBlock = { id: string; title: string; body: string };

/** Payload JSON từ API (ví dụ { symbol, indicators[], summary }) */
export type StrategyJsonPayload = {
  symbol: string;
  indicators: string[];
  summary: string;
};

/** Bóc ```json ... ``` hoặc chuỗi JSON thuần → object chiến lược, hoặc null nếu không khớp. */
export function tryParseStrategyJson(text: string): StrategyJsonPayload | null {
  let s = text.trim();
  const fenced = /^```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```\s*$/i.exec(s);
  if (fenced) s = fenced[1].trim();
  else if (s.startsWith("```")) {
    s = s.replace(/^```[a-zA-Z]*\s*/m, "").replace(/\s*```$/m, "").trim();
  }

  const tryPayload = (raw: string): StrategyJsonPayload | null => {
    try {
      const o = JSON.parse(raw) as unknown;
      if (!o || typeof o !== "object" || Array.isArray(o)) return null;
      const obj = o as Record<string, unknown>;

      const symbol = typeof obj.symbol === "string" ? obj.symbol.trim() : "";
      const summary = typeof obj.summary === "string" ? obj.summary.trim() : "";

      let indicators: string[] = [];
      if (Array.isArray(obj.indicators)) {
        indicators = obj.indicators
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
          .map((x) => x.trim());
      } else if (typeof obj.indicators === "string" && obj.indicators.trim()) {
        indicators = [obj.indicators.trim()];
      }

      const hasContent = symbol.length > 0 || summary.length > 0 || indicators.length > 0;
      if (!hasContent) return null;

      return {
        symbol: symbol || "—",
        indicators,
        summary: summary || "—",
      };
    } catch {
      return null;
    }
  };

  const direct = tryPayload(s);
  if (direct) return direct;

  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return tryPayload(s.slice(start, end + 1));
  }

  return null;
}

function StrategyJsonAnalysisView({
  data,
  onTextChange,
}: {
  data: StrategyJsonPayload;
  onTextChange?: (next: string) => void;
}) {
  const editable = Boolean(onTextChange);
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(data.summary);
  useEffect(() => {
    if (!editingSummary) setSummaryDraft(data.summary);
  }, [data.summary, editingSummary]);

  const saveSummary = () => {
    const next: StrategyJsonPayload = { ...data, summary: summaryDraft.trim() || "—" };
    onTextChange?.(JSON.stringify(next, null, 2));
    setEditingSummary(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 space-y-3 duration-500">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.06] px-3 py-2.5 shadow-[0_0_20px_-8px_hsl(var(--primary)/0.35)]">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
            <Coins className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Cặp giao dịch</p>
            <p className="mt-0.5 truncate font-mono text-sm font-semibold text-foreground">{data.symbol}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border/80">
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Chỉ báo</p>
            {data.indicators.length === 0 ? (
              <p className="mt-1 text-[12px] text-muted-foreground">—</p>
            ) : (
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {data.indicators.map((name) => (
                  <li
                    key={name}
                    className="rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] font-medium text-foreground/95"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/40 p-3 ring-1 ring-inset ring-white/[0.04]">
        <div className="mb-2 flex items-center gap-2 border-b border-border/40 pb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 to-transparent text-primary shadow-inner ring-1 ring-primary/15">
            <FileText className="h-3.5 w-3.5" strokeWidth={2.2} />
          </div>
          <h3 className="min-w-0 flex-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Tóm tắt chiến lược
          </h3>
          {editable && !editingSummary && (
            <button
              type="button"
              className={editBtnClass}
              aria-label="Chỉnh sửa tóm tắt"
              onClick={() => setEditingSummary(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {editingSummary ? (
          <div className="space-y-2">
            <textarea
              className={editTextareaClass}
              value={summaryDraft}
              onChange={(e) => setSummaryDraft(e.target.value)}
              autoFocus
              aria-label="Nội dung tóm tắt chiến lược"
              placeholder="Nhập tóm tắt…"
              onKeyDown={(e) => e.key === "Escape" && setEditingSummary(false)}
            />
            <div className="flex justify-end gap-1">
              <button type="button" className={editBtnClass} aria-label="Lưu" onClick={saveSummary}>
                <Check className="h-4 w-4 text-emerald-500" />
              </button>
              <button
                type="button"
                className={editBtnClass}
                aria-label="Hủy"
                onClick={() => {
                  setSummaryDraft(data.summary);
                  setEditingSummary(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[12px] leading-relaxed text-foreground/95">
            <p className="whitespace-pre-wrap">{highlightTerms(data.summary)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Parse output từ ragApi (formatStrategyPayload) */
export function parseStrategyAnalysis(text: string): {
  meta: Meta;
  sections: SectionBlock[];
  rawFallback: string | null;
} {
  const trimmed = text.trim();
  if (!trimmed) return { meta: {}, sections: [], rawFallback: null };

  if (!/—\s*.+\s*—/.test(trimmed)) {
    return { meta: {}, sections: [], rawFallback: trimmed };
  }

  const chunks = trimmed.split(/\n(?=—\s*.+\s*—)/).map((c) => c.trim()).filter(Boolean);
  if (chunks.length === 0) return { meta: {}, sections: [], rawFallback: trimmed };

  const meta: Meta = {};
  for (const line of chunks[0].split("\n")) {
    const t = line.trim();
    if (t.startsWith("Cặp:")) meta.pair = t.replace(/^Cặp:\s*/i, "").trim();
    if (/^Chỉ báo/i.test(t)) {
      const idx = t.indexOf(":");
      meta.metrics = idx >= 0 ? t.slice(idx + 1).trim() : t;
    }
  }

  const sections: SectionBlock[] = [];
  for (let i = 1; i < chunks.length; i++) {
    const lines = chunks[i].split("\n");
    const first = lines[0]?.trim() ?? "";
    const m = first.match(/^—\s*(.+?)\s*—$/);
    if (!m) continue;
    const title = m[1].trim();
    const body = lines.slice(1).join("\n").trim();
    sections.push({ id: slug(title) || `sec-${i}`, title, body });
  }

  if (sections.length === 0 && !meta.pair && !meta.metrics) {
    return { meta: {}, sections: [], rawFallback: trimmed };
  }

  return { meta, sections, rawFallback: null };
}

/** Ghép lại chuỗi phân tích sau khi sửa section / meta (khớp parseStrategyAnalysis). */
export function serializeStrategyAnalysis(meta: Meta, sections: SectionBlock[]): string {
  const head: string[] = [];
  if (meta.pair?.trim()) head.push(`Cặp: ${meta.pair.trim()}`);
  if (meta.metrics?.trim()) head.push(`Chỉ báo / mô hình: ${meta.metrics.trim()}`);
  const parts: string[] = [];
  if (head.length) parts.push(head.join("\n"));
  for (const s of sections) {
    parts.push(`— ${s.title} —\n${s.body}`);
  }
  return parts.join("\n\n");
}

const editBtnClass =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const editTextareaClass =
  "min-h-[140px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-[12px] leading-relaxed text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function parseProsLines(body: string): string[] {
  return body
    .split("\n")
    .map((l) => l.replace(/^\s*[•\-\*]\s*/, "").trim())
    .filter(Boolean);
}

/** Highlight một số thuật ngữ giao dịch trong đoạn plain text */
function highlightTerms(node: string): ReactNode {
  const pattern =
    /(Stop Loss|Take Profit|Risk\/Reward|MUA|BAN|BUY|SELL|RSI|MACD|EMA|SL|TP)/gi;
  const parts = node.split(pattern);
  return parts.map((part, i) => {
    const u = part.toUpperCase();
    if (/^(STOP LOSS|SL)$/i.test(part)) {
      return (
        <span key={i} className="rounded px-0.5 font-medium text-red-400/95">
          {part}
        </span>
      );
    }
    if (/^(TAKE PROFIT|TP)$/i.test(part)) {
      return (
        <span key={i} className="rounded px-0.5 font-medium text-emerald-400/95">
          {part}
        </span>
      );
    }
    if (/^(RSI|MACD|EMA)$/i.test(part)) {
      return (
        <span key={i} className="rounded px-0.5 font-medium text-sky-400/90">
          {part}
        </span>
      );
    }
    if (/^(MUA|BUY)$/i.test(part)) {
      return (
        <span key={i} className="rounded px-0.5 font-medium text-emerald-400/85">
          {part}
        </span>
      );
    }
    if (/^(BAN|SELL)$/i.test(part)) {
      return (
        <span key={i} className="rounded px-0.5 font-medium text-rose-400/85">
          {part}
        </span>
      );
    }
    if (/^RISK\/REWARD$/i.test(u)) {
      return (
        <span key={i} className="rounded px-0.5 font-medium text-amber-400/90">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ProseBlock({ children }: { children: string }) {
  const paras = children.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="space-y-3 text-[12px] leading-relaxed text-foreground/95">
      {paras.map((p, idx) => (
        <p key={idx} className="whitespace-pre-wrap">
          {highlightTerms(p)}
        </p>
      ))}
    </div>
  );
}

function visualForSectionTitle(title: string): { icon: LucideIcon; accent: string } {
  const t = title.toLowerCase();
  if (t.includes("tóm") || t.includes("tắt") || /\btom\b/.test(t)) {
    return { icon: Sparkles, accent: "from-primary/25 to-transparent" };
  }
  if (t.includes("logic") || t.includes("phân tích")) {
    return { icon: GitBranch, accent: "from-cyan-500/20 to-transparent" };
  }
  if (t.includes("ưu điểm") || t.includes("uu điểm")) {
    return { icon: ListChecks, accent: "from-violet-500/20 to-transparent" };
  }
  if (t.includes("nhược") || /\bcons\b/.test(t)) {
    return { icon: AlertCircle, accent: "from-rose-500/15 to-transparent" };
  }
  return { icon: Sparkles, accent: "from-primary/20 to-transparent" };
}

function SectionShell({
  title,
  icon: Icon,
  accentClass,
  index,
  headerRight,
  children,
}: {
  title: string;
  icon: LucideIcon;
  accentClass: string;
  index: number;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-1 fill-mode-both rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/40 p-3 shadow-sm duration-500",
        "ring-1 ring-inset ring-white/[0.04]",
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        className={cn(
          "mb-2.5 flex items-center gap-2 border-b border-border/40 pb-2",
        )}
      >
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-primary shadow-inner",
            accentClass,
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
        </div>
        <h3 className="min-w-0 flex-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </h3>
        {headerRight}
      </div>
      {children}
    </div>
  );
}

function EditableSectionShell({
  title,
  icon,
  accentClass,
  index,
  sectionId,
  body,
  editable,
  onBodyCommit,
  children,
}: {
  title: string;
  icon: LucideIcon;
  accentClass: string;
  index: number;
  sectionId: string;
  body: string;
  editable: boolean;
  onBodyCommit: (id: string, next: string) => void;
  children: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  useEffect(() => {
    if (!editing) setDraft(body);
  }, [body, editing]);

  const headerRight =
    editable && !editing ? (
      <button
        type="button"
        className={editBtnClass}
        aria-label={`Chỉnh sửa: ${title}`}
        onClick={() => setEditing(true)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    ) : null;

  return (
    <SectionShell title={title} icon={icon} accentClass={accentClass} index={index} headerRight={headerRight}>
      {editing ? (
        <div className="space-y-2">
          <textarea
            className={editTextareaClass}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            aria-label={`Chỉnh sửa nội dung: ${title}`}
            placeholder="Nhập nội dung…"
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
          />
          <div className="flex justify-end gap-1">
            <button
              type="button"
              className={editBtnClass}
              aria-label="Lưu"
              onClick={() => {
                onBodyCommit(sectionId, draft);
                setEditing(false);
              }}
            >
              <Check className="h-4 w-4 text-emerald-500" />
            </button>
            <button
              type="button"
              className={editBtnClass}
              aria-label="Hủy"
              onClick={() => {
                setDraft(body);
                setEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </SectionShell>
  );
}

function RawFallbackEditable({
  raw,
  editable,
  onCommit,
}: {
  raw: string;
  editable: boolean;
  onCommit: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(raw);
  useEffect(() => {
    if (!editing) setDraft(raw);
  }, [raw, editing]);

  if (!editable) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-xl border border-border/50 bg-muted/20 p-3 ring-1 ring-inset ring-white/[0.03]">
          <ProseBlock>{raw}</ProseBlock>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="relative rounded-xl border border-border/50 bg-muted/20 p-3 ring-1 ring-inset ring-white/[0.03]">
        {!editing && (
          <button
            type="button"
            className={cn(editBtnClass, "absolute right-2 top-2 z-10")}
            aria-label="Chỉnh sửa nội dung"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {editing ? (
          <div className="space-y-2">
            <textarea
              className={editTextareaClass}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              aria-label="Chỉnh sửa toàn bộ phân tích"
              placeholder="Nhập nội dung…"
              onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            />
            <div className="flex justify-end gap-1">
              <button
                type="button"
                className={editBtnClass}
                aria-label="Lưu"
                onClick={() => {
                  onCommit(draft);
                  setEditing(false);
                }}
              >
                <Check className="h-4 w-4 text-emerald-500" />
              </button>
              <button
                type="button"
                className={editBtnClass}
                aria-label="Hủy"
                onClick={() => {
                  setDraft(raw);
                  setEditing(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="pr-8">
            <ProseBlock>{raw}</ProseBlock>
          </div>
        )}
      </div>
    </div>
  );
}

export type StrategyAnalysisDisplayProps = {
  text: string;
  /** Khi có: hiện icon bút trên từng khối để sửa tay; gọi lại với toàn bộ chuỗi phân tích đã cập nhật. */
  onTextChange?: (next: string) => void;
};

export function StrategyAnalysisDisplay({ text, onTextChange }: StrategyAnalysisDisplayProps) {
  const [draft, setDraft] = useState(text);
  useEffect(() => setDraft(text), [text]);

  const commitDraft = (next: string) => {
    setDraft(next);
    onTextChange?.(next);
  };

  const jsonPayload = useMemo(() => tryParseStrategyJson(draft), [draft]);
  if (jsonPayload) {
    return <StrategyJsonAnalysisView data={jsonPayload} onTextChange={onTextChange ? commitDraft : undefined} />;
  }

  const parsed = useMemo(() => parseStrategyAnalysis(draft), [draft]);

  if (parsed.rawFallback) {
    return (
      <RawFallbackEditable raw={parsed.rawFallback} editable={Boolean(onTextChange)} onCommit={commitDraft} />
    );
  }

  const { meta, sections } = parsed;

  const handleSectionCommit = (sectionId: string, newBody: string) => {
    const p = parseStrategyAnalysis(draft);
    if (p.rawFallback || p.sections.length === 0) return;
    const nextSections = p.sections.map((s) => (s.id === sectionId ? { ...s, body: newBody } : s));
    commitDraft(serializeStrategyAnalysis(p.meta, nextSections));
  };

  return (
    <div className="space-y-3">
      {(meta.pair || meta.metrics) && (
        <div
          className="animate-in fade-in slide-in-from-top-1 duration-500"
          style={{ animationDelay: "0ms" }}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {meta.pair && (
              <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.06] px-3 py-2.5 shadow-[0_0_20px_-8px_hsl(var(--primary)/0.35)]">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
                  <Coins className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Cặp giao dịch
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {meta.pair}
                  </p>
                </div>
              </div>
            )}
            {meta.metrics && (
              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/25 px-3 py-2.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border/80">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Chỉ báo / mô hình
                  </p>
                  <p className="text-[12px] leading-snug text-foreground/95">{meta.metrics}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {sections.map((sec, i) => {
        const { icon: Icon, accent } = visualForSectionTitle(sec.title);
        const isPros = /ưu điểm/i.test(sec.title) || /\buu\s*điểm/i.test(sec.title);
        const isCons = /nhược/i.test(sec.title) || /\bcons\b/i.test(sec.title);

        if (isPros) {
          const items = parseProsLines(sec.body);
          const list = (
            <ul className="space-y-2">
              {items.map((item, j) => (
                <li
                  key={j}
                  className="animate-in fade-in slide-in-from-left-1 fill-mode-both flex gap-2.5 rounded-lg border border-border/40 bg-background/40 px-2.5 py-2 text-[11.5px] leading-relaxed duration-400"
                  style={{ animationDelay: `${i * 70 + j * 45}ms` }}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                  <span className="text-foreground/90">{highlightTerms(item)}</span>
                </li>
              ))}
            </ul>
          );
          if (onTextChange) {
            return (
              <EditableSectionShell
                key={sec.id}
                title={sec.title}
                icon={ListChecks}
                accentClass={accent}
                index={i}
                sectionId={sec.id}
                body={sec.body}
                editable
                onBodyCommit={handleSectionCommit}
              >
                {list}
              </EditableSectionShell>
            );
          }
          return (
            <SectionShell key={sec.id} title={sec.title} icon={ListChecks} accentClass={accent} index={i}>
              {list}
            </SectionShell>
          );
        }

        if (isCons) {
          const items = parseProsLines(sec.body);
          const list = (
            <ul className="space-y-2">
              {items.map((item, j) => (
                <li
                  key={j}
                  className="animate-in fade-in slide-in-from-left-1 fill-mode-both flex gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 px-2.5 py-2 text-[11.5px] leading-relaxed duration-400"
                  style={{ animationDelay: `${i * 70 + j * 45}ms` }}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/90 shadow-[0_0_8px_hsl(350_90%_60%/0.45)]" />
                  <span className="text-foreground/90">{highlightTerms(item)}</span>
                </li>
              ))}
            </ul>
          );
          if (onTextChange) {
            return (
              <EditableSectionShell
                key={sec.id}
                title={sec.title}
                icon={AlertCircle}
                accentClass={accent}
                index={i}
                sectionId={sec.id}
                body={sec.body}
                editable
                onBodyCommit={handleSectionCommit}
              >
                {list}
              </EditableSectionShell>
            );
          }
          return (
            <SectionShell key={sec.id} title={sec.title} icon={AlertCircle} accentClass={accent} index={i}>
              {list}
            </SectionShell>
          );
        }

        if (onTextChange) {
          return (
            <EditableSectionShell
              key={sec.id}
              title={sec.title}
              icon={Icon}
              accentClass={accent}
              index={i}
              sectionId={sec.id}
              body={sec.body}
              editable
              onBodyCommit={handleSectionCommit}
            >
              <ProseBlock>{sec.body}</ProseBlock>
            </EditableSectionShell>
          );
        }

        return (
          <SectionShell key={sec.id} title={sec.title} icon={Icon} accentClass={accent} index={i}>
            <ProseBlock>{sec.body}</ProseBlock>
          </SectionShell>
        );
      })}
    </div>
  );
}
