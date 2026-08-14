import { useLayoutEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MarketplaceLandingHeader } from "@/components/marketplace/MarketplaceLandingHeader";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { FeaturedMarketplaceGrid } from "@/components/marketplace/FeaturedMarketplaceGrid";
import { MarketplaceBundleCard } from "@/components/marketplace/MarketplaceBundleCard";
import { HowItWorksSection } from "@/components/marketplace/HowItWorksSection";
import { CreatorSection } from "@/components/marketplace/CreatorSection";
import {
  bundlePacks,
  featuredProducts,
  howItWorksSteps,
} from "@/data/marketplaceMock";
import { exploreMarketplaceHref } from "@/lib/marketplacePaths";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function MarketplaceLandingPage() {
  const explore = useMemo(() => exploreMarketplaceHref(), []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="marketplace-root min-h-screen bg-background text-foreground">
      <MarketplaceLandingHeader />
      <main>
        <MarketplaceHero exploreHref={explore} />

        <section
          id="featured"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8"
          aria-labelledby="featured-heading"
        >
          <div className="mb-10 text-center">
            <h2 id="featured-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
              Featured marketplace picks
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Curated rules, templates, and research packs with clear pricing and risk labels.
            </p>
          </div>
          <FeaturedMarketplaceGrid products={featuredProducts} exploreHref={explore} />
        </section>

        <section className="border-y border-border/50 bg-muted/20 py-16" aria-labelledby="bundles-heading">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 id="bundles-heading" className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
              Bundle packs
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
              Save with curated bundles for crypto, risk, income, and AI-assisted rule drafting.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {bundlePacks.map((b) => (
                <MarketplaceBundleCard key={b.id} bundle={b} />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <HowItWorksSection steps={howItWorksSteps} />

          <div id="creator">
            <CreatorSection className="mt-20" ctaExploreHref={explore} />
          </div>

          <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-3xl border border-primary/20 bg-primary/5 px-6 py-12 text-center">
            <h2 className="text-xl font-semibold md:text-2xl">Start with free marketplace templates</h2>
            <p className="max-w-lg text-sm text-muted-foreground">
              Create an account, open the marketplace app, and clone starter packs into the Rule Engine when you are
              ready.
            </p>
            <Button asChild className="rounded-full px-8">
              <Link to={explore}>Get started</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full text-xs text-muted-foreground">
              <Link to="/marketplace">Back to top</Link>
            </Button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
