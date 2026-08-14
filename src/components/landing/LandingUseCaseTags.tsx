import { USE_CASE_TAGS } from "@/components/landing/landingContent";

export function LandingUseCaseTags() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8" aria-labelledby="use-cases-heading">
      <h2 id="use-cases-heading" className="text-center text-2xl font-semibold md:text-4xl">
        What teams build on FinMom
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
        Mix and match workflows—automations, research, and marketplace velocity on shared primitives.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {USE_CASE_TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
