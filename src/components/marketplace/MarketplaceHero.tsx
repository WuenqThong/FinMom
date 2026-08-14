import { Link } from "react-router-dom";

import { ArrowRight, LineChart } from "lucide-react";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

import { Button } from "@/components/ui/button";

import { MarketplaceSearchBar } from "./MarketplaceSearchBar";

import { MarketplaceCategoryStrip } from "./MarketplaceCategoryStrip";

import { cn } from "@/lib/utils";

import type { MarketplaceCategoryId } from "@/data/marketplaceMock";

import { useState } from "react";

import dashboardImg from "@/assets/dashboard.png";



export function MarketplaceHero({

  exploreHref,

  className,

}: {

  exploreHref: string;

  className?: string;

}) {

  const [activeCat, setActiveCat] = useState<MarketplaceCategoryId | null>("rules");



  const scrollToCreator = () => {

    document.getElementById("creator")?.scrollIntoView({ behavior: "smooth" });

  };



  return (

    <div className={cn("relative min-h-[100svh]", className)}>

      <BackgroundGradientAnimation

        interactive

        className="relative z-10 flex min-h-[100svh] flex-col"

        containerClassName="min-h-[100svh]"

        gradientBackgroundStart="rgb(8, 18, 32)"

        gradientBackgroundEnd="rgb(4, 12, 28)"

        firstColor="20, 90, 85"

        secondColor="45, 180, 160"

        thirdColor="30, 120, 140"

        fourthColor="15, 60, 70"

        fifthColor="40, 100, 110"

        pointerColor="80, 220, 190"

        blendingValue="hard-light"

        size="70%"

      >

        <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-16 pt-10 sm:px-8">

          <div className="mx-auto w-full max-w-6xl">

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,52%)] lg:items-center lg:gap-14">

              <div className="flex flex-col items-center self-center text-center lg:items-start lg:self-center lg:text-left">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-background/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--mkt-text-soft)] opacity-90 backdrop-blur-md ring-1 ring-[color:var(--mkt-mint)]/25">

                  <LineChart className="h-3.5 w-3.5 text-[color:var(--mkt-mint)]" aria-hidden />

                  Premium fintech marketplace

                </div>



                <h1 className="max-w-xl font-manrope text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight text-[#f8fffd] md:max-w-2xl xl:text-[3.125rem]">

                  <span className="bg-gradient-to-b from-white via-white to-white/72 bg-clip-text text-transparent">

                    Rule engines, playbooks, and research — marketplace-grade and desk-ready.

                  </span>

                </h1>



                <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--mkt-text-body)]">

                  Browse verified listings with explicit risk, ratings, and economics. Preview structure, clone into your

                  workspace, and ship automations that feel like a trading terminal — not hype.

                </p>



                <div className="mt-8 flex w-full max-w-xl flex-col gap-4 lg:max-w-none">

                  <MarketplaceSearchBar readOnly variant="hero" className="w-full lg:max-w-xl" />

                  <MarketplaceCategoryStrip

                    active={activeCat}

                    onSelect={setActiveCat}

                    className="justify-center lg:justify-start"

                  />

                </div>



                <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-3 lg:justify-start">

                  <Button

                    asChild

                    className="h-11 rounded-full bg-[color:var(--mkt-mint)] px-7 text-sm font-semibold text-[color:var(--mkt-mint-ink)] shadow-lg shadow-emerald-500/25 hover:bg-[color:var(--mkt-mint-hover)] hover:text-[color:var(--mkt-mint-ink)]"

                  >

                    <Link to={exploreHref}>

                      Explore strategies

                      <ArrowRight className="ml-2 h-4 w-4" />

                    </Link>

                  </Button>

                  <Button

                    type="button"

                    variant="ghost"

                    className="h-11 rounded-full px-5 text-sm font-medium text-[color:var(--mkt-text-body)] hover:bg-white/10 hover:text-white"

                    onClick={scrollToCreator}

                  >

                    Become a creator

                  </Button>

                </div>

              </div>



              <div className="relative mx-auto w-full max-w-xl self-center lg:mx-0 lg:max-w-none">

                <div

                  className="pointer-events-none absolute -inset-6 rounded-[28px] opacity-70 blur-3xl"

                  style={{

                    background: "radial-gradient(ellipse at 50% 45%, rgba(20, 241, 200, 0.14), transparent 62%)",

                  }}

                  aria-hidden

                />

                <div className="relative rounded-2xl border border-white/[0.08] bg-[#050c14]/80 shadow-[0_28px_90px_-36px_rgba(20,241,200,0.22)] ring-1 ring-black/40 backdrop-blur-[2px]">

                  <img

                    src={dashboardImg}

                    alt="FinMom marketplace dashboard preview"

                    className="relative z-[1] w-full rounded-2xl object-cover"

                    loading="eager"

                  />

                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-background/20 via-transparent to-transparent" />



                  <div className="absolute -right-1 top-[10%] z-[2] hidden w-[46%] max-w-[216px] md:block">

                    <div className="glass-panel rounded-xl border border-[color:var(--mkt-mint)]/22 p-3 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.85)]">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--mkt-text-muted)]">

                        Trending pick

                      </p>

                      <p className="mt-1 text-xs font-semibold text-white">Futures risk guard</p>

                      <p className="mt-1 font-manrope text-lg font-bold tabular-nums text-[color:var(--mkt-mint)]">$59</p>

                      <div className="mt-2 h-8 rounded-md border border-border/40 bg-background/50">

                        <div

                          className="h-full w-[68%] rounded-md bg-gradient-to-r from-[color:var(--mkt-mint)]/25 to-transparent"

                          aria-hidden

                        />

                      </div>

                    </div>

                  </div>



                  <div className="absolute -left-2 bottom-[8%] z-[2] hidden w-[52%] max-w-[230px] lg:block">

                    <div className="glass-panel rounded-xl border border-border/55 p-3 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.85)]">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--mkt-text-muted)]">

                        Strategy sleeve

                      </p>

                      <p className="mt-1 text-xs font-semibold text-white">Trend · commodities</p>

                      <div className="mt-2 flex gap-1">

                        {["RV", "VOL", "CTX"].map((k) => (

                          <span

                            key={k}

                            className="rounded border border-[color:var(--mkt-mint)]/20 bg-[color:var(--mkt-mint)]/8 px-1.5 py-0.5 text-[9px] font-medium text-[color:var(--mkt-text-soft)]"

                          >

                            {k}

                          </span>

                        ))}

                      </div>

                    </div>

                  </div>



                  <div className="absolute bottom-[5%] left-1/2 z-[2] w-[90%] max-w-[280px] -translate-x-1/2 md:w-[78%] lg:bottom-[6%] lg:left-[8%] lg:translate-x-0">

                    <div className="glass-panel rounded-xl border border-primary/30 bg-background/70 p-3 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md">

                      <div className="flex items-start justify-between gap-2">

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--mkt-mint)]">

                            Template

                          </p>

                          <p className="mt-1 text-xs font-semibold leading-snug text-white">Institutional risk dashboard</p>

                          <p className="mt-0.5 text-[10px] text-[color:var(--mkt-text-muted)]">Northwood Research</p>

                        </div>

                        <span className="shrink-0 rounded-full border border-[color:var(--mkt-mint)]/35 bg-[color:var(--mkt-mint)]/12 px-2 py-1 text-[10px] font-bold text-[color:var(--mkt-text-soft)]">

                          $12/mo

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </BackgroundGradientAnimation>

    </div>

  );

}

