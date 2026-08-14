import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

import marketplaceWaveBg from "@/assets/marketplace-wave-bg.png";

export function CreatorSection({
  className,
  ctaExploreHref,
}: {
  className?: string;
  ctaExploreHref: string;
}) {
  return (
    <section
      className={cn(
        "glass-panel relative overflow-hidden rounded-3xl border border-primary/20 pt-2",
        className,
      )}
      aria-labelledby="creator-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-[position:30%_40%] opacity-[calc(100%/1.5)]"
        style={{ backgroundImage: `url(${marketplaceWaveBg})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-background/88 backdrop-blur-[3px]" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.14),transparent_46%)]"
        aria-hidden
      />
      <div className="relative z-[1] grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--mkt-text-soft)] ring-1 ring-[color:var(--mkt-mint)]/25">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--mkt-mint)]" aria-hidden />
            Creator economy
          </div>
          <h2 id="creator-heading" className="mkt-section-heading text-white">
            Become a creator
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--mkt-text-body)]">
            Publish rules, portfolio templates, and research packs. Earn from downloads while buyers clone into the Rule
            Engine and adapt logic to their edge — without handing over execution blindly.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button
              asChild
              className="rounded-full bg-[color:var(--mkt-mint)] px-6 font-semibold text-[color:var(--mkt-mint-ink)] shadow-md shadow-emerald-500/25 hover:bg-[color:var(--mkt-mint-hover)] hover:text-[color:var(--mkt-mint-ink)]"
            >
              <Link to={ctaExploreHref}>Start selling</Link>
            </Button>
            <Link
              to="/register"
              className="text-sm font-medium text-[color:var(--mkt-text-body)] underline decoration-[color:var(--mkt-mint)] underline-offset-[6px] transition-colors hover:text-white"
            >
              Create account
            </Link>
          </div>
        </div>
        <ul className="flex min-h-full flex-col justify-center gap-3 text-sm text-[color:var(--mkt-text-body)] md:justify-start">
          <li className="flex min-h-[4.5rem] flex-col justify-center rounded-2xl border border-primary/30 bg-primary/15 p-4 shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.12)] backdrop-blur-md transition-colors hover:border-[color:var(--mkt-mint)]/35">
            <span className="font-medium text-white">Profile &amp; reputation</span>
            <span className="text-xs text-[color:var(--mkt-text-muted)]">Ratings, verified badge, and download history.</span>
          </li>
          <li className="flex min-h-[4.5rem] flex-col justify-center rounded-2xl border border-primary/30 bg-primary/15 p-4 shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.12)] backdrop-blur-md transition-colors hover:border-[color:var(--mkt-mint)]/35">
            <span className="font-medium text-white">Transparent listings</span>
            <span className="text-xs text-[color:var(--mkt-text-muted)]">Risk level, asset class, and methodology notes.</span>
          </li>
          <li className="flex min-h-[4.5rem] flex-col justify-center rounded-2xl border border-primary/30 bg-primary/15 p-4 shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.12)] backdrop-blur-md transition-colors hover:border-[color:var(--mkt-mint)]/35">
            <span className="font-medium text-white">Sandbox previews</span>
            <span className="text-xs text-[color:var(--mkt-text-muted)]">Buyers inspect structure before they unlock logic.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
