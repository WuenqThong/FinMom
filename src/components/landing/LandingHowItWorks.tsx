import { Card, CardContent } from "@/components/ui/card";
type Step = {
  title: string;
  desc: string;
  image: string | { src: string };
};

type LandingHowItWorksProps = {
  steps: readonly Step[];
};

export function LandingHowItWorks({ steps }: LandingHowItWorksProps) {
  return (
    <section className="border-t border-border/40 bg-muted/10 py-24" aria-labelledby="how-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="how-heading" className="max-w-2xl text-balance text-3xl font-semibold md:text-5xl">
          From signup to first trade in three moves
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-muted-foreground md:text-lg">
          No maze of modals—just a straight path so you can fund, configure, and ship faster.
        </p>

        <ol className="mt-14 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card className="glass-panel h-full overflow-hidden">
                <div className="relative">
                  <span className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <img src={typeof step.image === "string" ? step.image : step.image.src} alt={step.title} className="h-52 w-full object-cover" loading="lazy" />
                </div>
                <CardContent className="space-y-2 p-6">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
