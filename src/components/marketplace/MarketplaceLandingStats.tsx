import type { MarketplaceLandingStat } from "@/data/marketplaceMock";

export function MarketplaceLandingStats({
  stats,
  className,
}: {
  stats: MarketplaceLandingStat[];
  className?: string;
}) {
  return (
    <section className={className} aria-label="Marketplace benchmarks">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 sm:gap-x-10 sm:px-8 lg:grid-cols-4 lg:gap-x-8">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-manrope text-3xl font-bold tabular-nums tracking-tight text-white md:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 max-w-[15rem] text-sm font-medium leading-snug text-white">{s.label}</p>
            {s.caption ? (
              <p className="mt-1.5 max-w-[16rem] text-xs leading-relaxed text-[color:var(--mkt-text-muted)]">
                {s.caption}
              </p>
            ) : null}
            {s.footnoteHint ? (
              <p className="mt-1 text-[10px] leading-snug text-[color:var(--mkt-text-muted)]/90">
                Demo-only aggregate; not investment advice.
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-center text-[11px] leading-relaxed text-[color:var(--mkt-text-muted)] sm:px-8">
        Figures shown are illustrative placeholders for demo—not live exchange, AUM, or fund throughput.
      </p>
    </section>
  );
}
