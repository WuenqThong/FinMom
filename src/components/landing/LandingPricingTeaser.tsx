import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pricingPlans } from "@/data/pricingContent";

function teaserPrice(monthly: number | null): string {
  if (monthly === null) return "Custom";
  if (monthly === 0) return "$0";
  return `$${monthly}/mo`;
}

const teaserPlans = pricingPlans.slice(0, 4);

export function LandingPricingTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8" aria-labelledby="pricing-teaser-heading">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="pricing-teaser-heading" className="text-balance text-3xl font-semibold md:text-5xl">
            Plans that scale with how you trade
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground md:text-lg">
            Start free, upgrade when you need deeper automation, creator tools, or team governance. Compare every line item
            on the full page.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit shrink-0 rounded-full border-border/80">
          <Link to="/pricing">Compare all plans</Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teaserPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`glass-panel flex flex-col ${plan.featured ? "border-primary/40 ring-1 ring-primary/25" : ""}`}
          >
            <CardContent className="flex flex-1 flex-col gap-4 p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{plan.name}</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">{teaserPrice(plan.monthlyPrice)}</p>
                <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
              </div>
              <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
                {plan.features.slice(0, 3).map((f) => (
                  <li key={f} className="leading-snug">
                    · {f}
                  </li>
                ))}
              </ul>
              {plan.ctaHref.startsWith("http") || plan.ctaHref.startsWith("mailto") ? (
                <Button asChild className="mt-2 w-full rounded-full" variant={plan.featured ? "default" : "secondary"}>
                  <a href={plan.ctaHref}>{plan.ctaLabel}</a>
                </Button>
              ) : (
                <Button asChild className="mt-2 w-full rounded-full" variant={plan.featured ? "default" : "secondary"}>
                  <Link to={plan.ctaHref}>{plan.ctaLabel}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
