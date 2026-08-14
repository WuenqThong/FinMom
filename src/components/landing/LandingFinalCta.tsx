import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LandingFinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border/50 py-28">
      <div className="landing-cta-backdrop absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="text-balance text-3xl font-semibold md:text-5xl">
          FinMom is the workspace—your rules make it real
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          Spin up an account, explore the marketplace, and connect trading when you are ready. No page hopping, no brittle
          hand-offs.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-full px-10 py-6 text-base font-semibold">
            <Link to="/register">
              Create account <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-border/80 bg-background/50 px-8 py-6 text-base backdrop-blur-sm">
            <Link to="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
