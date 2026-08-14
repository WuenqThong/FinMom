import { useLayoutEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/layout/MainHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

import { CreatorSection } from "@/components/marketplace/CreatorSection";
import { FeaturedMarketplaceGrid } from "@/components/marketplace/FeaturedMarketplaceGrid";
import { HowItWorksSection } from "@/components/marketplace/HowItWorksSection";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { MarketplaceLandingStats } from "@/components/marketplace/MarketplaceLandingStats";
import { WhyMarketplaceBanner } from "@/components/marketplace/WhyMarketplaceBanner";
import {
  howItWorksSteps,
  landingFeaturedShowcase,
  landingTrendingStrategies,
  marketplaceLandingStats,
} from "@/data/marketplaceMock";
import { exploreMarketplaceHref } from "@/lib/marketplacePaths";

function MarketplaceSectionHeader({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 text-center">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--mkt-mint)]/80">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="mkt-section-heading mt-2 text-white">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--mkt-text-body)]">{description}</p>
    </div>
  );
}

export default function MarketplacePage() {
  const explore = useMemo(() => exploreMarketplaceHref(), []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="marketplace-root min-h-screen bg-background text-foreground">
      <MainHeader />

      <main>
        <MarketplaceHero exploreHref={explore} />

        <section className="border-b border-border/50 bg-muted/[0.12] pt-20 pb-20" aria-label="Marketplace scale">
          <MarketplaceLandingStats stats={marketplaceLandingStats} />
        </section>

        <section id="featured" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-20 pb-20 sm:px-8" aria-labelledby="featured-heading">
          <MarketplaceSectionHeader
            id="featured-heading"
            eyebrow="Featured"
            title="Rules, dashboards, and watchlists shortlisted for desks"
            description="Higher-signal picks across automation and liquid markets coverage. Research packs and desk bundles live in the marketplace app."
          />
          <FeaturedMarketplaceGrid products={landingFeaturedShowcase} exploreHref={explore} />
        </section>

        <section
          id="trending"
          className="border-y border-border/50 bg-muted/10 pt-20 pb-20"
          aria-labelledby="trending-heading"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <MarketplaceSectionHeader
              id="trending-heading"
              eyebrow="Trending"
              title="Execution configs and sleeves gaining traction"
              description="Strategies, bots, and templates with clearer economics—built to read like infrastructure."
            />
            <FeaturedMarketplaceGrid products={landingTrendingStrategies} exploreHref={explore} />
          </div>
        </section>

        <WhyMarketplaceBanner />

        <div className="mx-auto max-w-6xl px-5 pt-20 pb-20 sm:px-8">
          <HowItWorksSection steps={howItWorksSteps} />

          <div id="creator">
            <CreatorSection className="mt-24" ctaExploreHref={explore} />
          </div>

          <div className="mt-10 border-t border-border/40 pt-10">
            <div className="rounded-3xl border border-border/60 bg-muted/25 px-6 py-14 text-center shadow-[inset_0_1px_0_0_hsl(var(--border)/0.35)]">
              <h2 className="mkt-section-heading text-white">Open the marketplace workspace</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[color:var(--mkt-text-body)]">
                Sign in to browse the full catalog, side-by-side economics, research drops, and bundles—then clone next to
                your live book.
              </p>
              <Button
                asChild
                className="mt-8 rounded-full bg-[color:var(--mkt-mint)] px-8 font-semibold text-[color:var(--mkt-mint-ink)] shadow-md shadow-emerald-500/20 hover:bg-[color:var(--mkt-mint-hover)]"
              >
                <Link to={explore}>Open marketplace app</Link>
              </Button>
              <p className="mt-6">
                <Link
                  to="/marketplace"
                  className="text-xs text-[color:var(--mkt-text-muted)] underline-offset-4 transition-colors hover:text-[color:var(--mkt-text-soft)] hover:underline"
                >
                  Back to top
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
