import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import stepTradeImg from "@/assets/step-trade.png";

export function MarketplaceResearchSpotlight({
  exploreHref,
  className,
}: {
  exploreHref: string;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel relative overflow-hidden rounded-3xl border border-border/55", className)}>
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(280px,48%)]">
        <div className="relative z-[1] flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--mkt-mint)]">
            <FileText className="h-4 w-4" aria-hidden />
            Market research
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
              Research packs aligned to how desks actually consume data
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--mkt-text-muted)]">
              Curated narratives, annotated charts, and policy-ready thresholds—structured for preview before you subscribe,
              then delivered on a predictable cadence.
            </p>
          </div>
          <ul className="grid gap-2 text-xs text-[color:var(--mkt-text-soft)] sm:grid-cols-2">
            {[
              "Methodology appendix on every drop",
              "Risk labels tied to playbook scope",
              "Export-friendly tables for committees",
              "Version history for substantive edits",
            ].map((line) => (
              <li key={line} className="rounded-lg border border-border/40 bg-background/40 px-3 py-2 backdrop-blur-sm">
                {line}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[color:var(--mkt-mint)] font-semibold text-[color:var(--mkt-mint-ink)] hover:bg-[color:var(--mkt-mint-hover)]"
            >
              <Link to={exploreHref}>
                Browse research packs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full border-border/60 bg-background/30">
              <Link to={exploreHref}>View disclosures</Link>
            </Button>
          </div>
        </div>
        <div className="relative min-h-[220px] border-t border-border/40 bg-[#050f18] lg:min-h-0 lg:border-l lg:border-t-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.14),transparent_55%)]" />
          <img
            src={stepTradeImg}
            alt=""
            className="relative z-[1] h-full w-full object-cover object-[50%_40%] opacity-95 lg:absolute lg:inset-0"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-background to-transparent lg:h-40"
            aria-hidden
          />
          <div className="relative z-[3] mx-4 mb-4 flex flex-wrap gap-2 lg:absolute lg.bottom-6 lg:left-6 lg:right-6 lg:mx-0">
            {["Liquidity · FX", "Credit · HY", "ETF flows", "Equities catalysts"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[color:var(--mkt-mint)]/25 bg-background/65 px-2.5 py-1 text-[10px] font-medium text-[color:var(--mkt-text-soft)] backdrop-blur-md"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
