import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type LandingHeroProps = {
  dashboardSrc: string;
};

export function LandingHero({ dashboardSrc }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
      <div className="landing-hero-backdrop absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col text-center lg:text-left">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/90">FinMom</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
            The control room for crypto execution and automation
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
            Trade, simulate, and ship rules from one premium workspace. Low-friction flows, transparent pricing, and a UI
            built for volatile markets.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button asChild className="rounded-full px-8 py-6 text-base font-semibold">
              <Link to="/register">Get started</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-border/80 bg-background/40 px-8 py-6 text-base backdrop-blur-sm">
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground lg:justify-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground/80">Community rating</p>
              <p className="mt-1 text-foreground">★★★★★ 4.9</p>
            </div>
            <div className="hidden h-10 w-px bg-border/80 sm:block" aria-hidden />
            <p className="max-w-xs text-left text-xs leading-relaxed sm:max-w-sm">
              Built for traders who want speed without sacrificing clarity—single surface, consistent design language.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-[hsl(260_80%_60%/0.12)] blur-2xl md:-inset-8" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-2 shadow-[var(--shadow-premium)] backdrop-blur-md">
            <div className="hero-line mb-4 h-[2px] w-full opacity-80" aria-hidden />
            <img
              src={dashboardSrc}
              alt="FinMom dashboard preview"
              className="w-full rounded-2xl object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
