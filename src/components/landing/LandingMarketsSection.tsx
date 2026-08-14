import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

export type MarketSymbol = { name: string; price: string; change: string };

type LandingMarketsSectionProps = {
  symbols: MarketSymbol[];
};

export function LandingMarketsSection({ symbols }: LandingMarketsSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8" aria-labelledby="markets-heading">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="markets-heading" className="text-balance text-3xl font-semibold md:text-5xl">
            Markets at a glance
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Track majors and alts in one row—then jump into trading or wire the same context into your rules.
          </p>
        </div>
        <p className="text-sm text-muted-foreground/90">
          Sample snapshot ·{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/trading">
            Open live workspace
          </Link>
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {symbols.map((symbol) => (
          <Card key={symbol.name} className="glass-panel transition-transform duration-300 hover:-translate-y-0.5">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">{symbol.name}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{symbol.price}</p>
              <p className="mt-1 text-sm font-medium text-primary">{symbol.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
