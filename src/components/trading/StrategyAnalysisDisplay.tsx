import { useMemo, type ReactNode } from "react";
import {
  Sparkles,
  GitBranch,
  ListChecks,
  Coins,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Meta = { pair?: string; metrics?: string };
type SectionBlock = { id: string; title: string; body: string };

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
  return { icon: Sparkles, accent: "from-primary/20 to-transparent" };
}

function SectionShell({
  title,
  icon: Icon,
  accentClass,
  index,
  children,
}: {
  title: string;
  icon: LucideIcon;
  accentClass: string;
  index: number;
  children: React.ReactNode;
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
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export function StrategyAnalysisDisplay({ text }: { text: string }) {
  const parsed = useMemo(() => parseStrategyAnalysis(text), [text]);

  if (parsed.rawFallback) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-xl border border-border/50 bg-muted/20 p-3 ring-1 ring-inset ring-white/[0.03]">
          <ProseBlock>{parsed.rawFallback}</ProseBlock>
        </div>
      </div>
    );
  }

  const { meta, sections } = parsed;

  return (
    <div className="space-y-3" key={text.slice(0, 80)}>
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
                  <p className="truncate font-mono text-sm font-semibold text-foreground">
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

        if (isPros) {
          const items = parseProsLines(sec.body);
          return (
            <SectionShell
              key={sec.id}
              title={sec.title}
              icon={ListChecks}
              accentClass={accent}
              index={i}
            >
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
            </SectionShell>
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
