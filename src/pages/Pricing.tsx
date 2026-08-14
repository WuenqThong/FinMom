import { useLayoutEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import { MainHeader } from "@/components/layout/MainHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  planCardIds,
  pricingComparisonRows,
  pricingComplianceDisclaimer,
  pricingFaqs,
  pricingHero,
  pricingPlans,
  yearlyMonthlyEquivalent,
  type PlanId,
  type PricingPlan,
} from "@/data/pricingContent";

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function planById(id: PlanId): PricingPlan | undefined {
  return pricingPlans.find((p) => p.id === id);
}

function CtaLink({
  plan,
  className,
  label,
  variant = "default",
}: {
  plan: PricingPlan;
  className?: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
}) {
  const text = label ?? plan.ctaLabel;
  const isMail = plan.ctaHref.startsWith("mailto:");
  if (isMail) {
    return (
      <Button asChild className={cn("w-full rounded-full", className)} variant={variant}>
        <a href={plan.ctaHref}>{text}</a>
      </Button>
    );
  }
  return (
    <Button asChild className={cn("w-full rounded-full", className)} variant={variant}>
      <Link to={plan.ctaHref}>{text}</Link>
    </Button>
  );
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const compareColumnIds = useMemo(() => [...planCardIds] as PlanId[], []);

  return (
    <div className="marketplace-root min-h-screen bg-background text-foreground">
      <MainHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50 px-5 py-16 sm:px-8 md:py-24" aria-labelledby="pricing-hero-title">
          <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-6xl text-center">
            <h1 id="pricing-hero-title" className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {pricingHero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">{pricingHero.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full px-8">
                <Link to="/register">Start free</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-border/60">
                <Link to="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
            <p className="mt-8 text-xs text-muted-foreground">{pricingComplianceDisclaimer}</p>
          </div>
        </section>

        {/* Billing + cards — wider container so five columns are not squeezed */}
        <section
          className="mx-auto w-full max-w-[min(100%,100rem)] px-5 py-16 sm:px-8 lg:px-10"
          aria-labelledby="pricing-plans-heading"
        >
          <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="pricing-plans-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
                Plans
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                For <span className="text-foreground">traders & investors</span> and{" "}
                <span className="text-foreground">creators</span> who sell on the FinMom Marketplace.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 sm:items-end">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 p-1">
                <button
                  type="button"
                  onClick={() => setYearly(false)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                    !yearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setYearly(true)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                    yearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Yearly
                </button>
              </div>
              {yearly && <Badge variant="secondary" className="text-[10px]">Save 20%</Badge>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-7 2xl:gap-8">
            {planCardIds.map((id) => {
              const plan = planById(id);
              if (!plan) return null;
              const isCreator = plan.audience === "creator";
              const isTeam = plan.audience === "team";
              const showPrice = plan.monthlyPrice !== null;
              const displayAmount = showPrice
                ? yearly
                  ? yearlyMonthlyEquivalent(plan.monthlyPrice!)
                  : plan.monthlyPrice!
                : null;

              const audienceBadge = isTeam ? (
                <Badge variant="secondary" className="text-[10px]">
                  Business / Team
                </Badge>
              ) : isCreator ? (
                <Badge variant="default" className="text-[10px]">
                  Creators
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Traders
                </Badge>
              );

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "glass-panel flex flex-col border-border/80",
                    plan.featured && "border-primary/50 ring-1 ring-primary/25",
                  )}
                >
                  <CardContent className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      {audienceBadge}
                      {plan.featured && (
                        <Badge variant="secondary" className="text-[10px]">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{plan.tagline}</p>
                    </div>
                    <div className="border-t border-border/40 pt-4">
                      {showPrice && displayAmount !== null ? (
                        <>
                          <p className="text-3xl font-bold tabular-nums">
                            {formatUsd(displayAmount)}
                            <span className="text-sm font-medium text-muted-foreground">/mo</span>
                          </p>
                          {yearly && (
                            <p className="mt-1 text-[11px] text-muted-foreground">Billed annually (20% off monthly).</p>
                          )}
                          {plan.id === "creator" && (
                            <p className="mt-2 text-[11px] text-muted-foreground">+ marketplace fee on paid sales.</p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-xl font-semibold">Custom</p>
                          <p className="mt-1 text-sm text-muted-foreground">Custom pricing</p>
                        </>
                      )}
                    </div>
                    <CtaLink plan={plan} />
                    <ul className="mt-2 space-y-2.5 text-xs text-muted-foreground">
                      {plan.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Comparison */}
        <section className="border-t border-border/50 bg-muted/15 px-5 py-16 sm:px-8 lg:px-10" aria-labelledby="compare-heading">
          <div className="mx-auto w-full max-w-[min(100%,100rem)]">
            <h2 id="compare-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
              Compare features
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Core differences across marketplace access, Rule Engine, automation, and creator tools.
            </p>

            {/* Narrow view: one feature per accordion; avoids horizontal scroll */}
            <div className="mt-8 lg:hidden">
              <Accordion type="multiple" className="rounded-xl border border-border/50 bg-card/40 px-2">
                {pricingComparisonRows.map((row, index) => (
                  <AccordionItem key={row.label} value={`pricing-cmp-${index}`} className="border-border/40">
                    <AccordionTrigger className="py-3 text-left text-sm font-semibold hover:no-underline">{row.label}</AccordionTrigger>
                    <AccordionContent className="pb-4 pt-0">
                      <div className="space-y-2.5 border-t border-border/30 pt-3">
                        {compareColumnIds.map((id) => {
                          const p = planById(id);
                          return (
                            <div key={id} className="grid grid-cols-1 gap-0.5 text-sm sm:grid-cols-[minmax(7rem,1fr)_minmax(0,1fr)] sm:gap-3">
                              <span className="font-medium leading-snug text-muted-foreground">{p?.name ?? id}</span>
                              <span className="leading-snug text-foreground sm:text-right">{row.values[id]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Wide view: comparison table */}
            <div className="mt-8 hidden lg:block">
              <div className="overflow-x-auto rounded-xl border border-border/50 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2">
                <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-card/80">
                    <th className="sticky left-0 z-10 max-w-[12rem] bg-card/95 px-4 py-3 font-semibold shadow-[4px_0_12px_-4px_rgba(0,0,0,0.4)] backdrop-blur-sm lg:shadow-none">
                      Feature
                    </th>
                    {compareColumnIds.map((id) => {
                      const p = planById(id);
                      return (
                        <th key={id} className="whitespace-normal px-4 py-3 font-semibold text-foreground">
                          {p?.name ?? id}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {pricingComparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-border/40 last:border-0">
                      <td className="sticky left-0 z-10 max-w-[12rem] bg-background/95 px-4 py-3 text-muted-foreground shadow-[4px_0_12px_-4px_rgba(0,0,0,0.35)] backdrop-blur-sm lg:shadow-none">
                        <span className="break-words">{row.label}</span>
                      </td>
                      {compareColumnIds.map((id) => (
                        <td key={id} className="min-w-[6.5rem] px-4 py-3 text-foreground">
                          <span className="break-words">{row.values[id]}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-[min(100%,100rem)] px-5 py-16 sm:px-8 lg:px-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
            FAQ
          </h2>
          <Card className="glass-panel mt-6">
            <CardContent className="p-4 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {pricingFaqs.map((item, index) => (
                  <AccordionItem key={item.question} value={`pf-${index}`}>
                    <AccordionTrigger className="text-left text-sm">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-[min(100%,100rem)] px-5 pb-20 sm:px-8 lg:px-10">
          <Card className="glass-panel overflow-hidden border-primary/25">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
              <h2 className="text-balance text-xl font-semibold md:text-2xl">Start free. Upgrade when your strategy grows.</h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full px-8">
                  <Link to="/register">Start free</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-border/60">
                  <Link to="/register">Become a Creator</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">{pricingComplianceDisclaimer}</p>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
