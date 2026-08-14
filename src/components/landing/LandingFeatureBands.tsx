import { Card, CardContent } from "@/components/ui/card";
import { FEATURE_BANDS } from "@/components/landing/landingContent";
import { cn } from "@/lib/utils";

export function LandingFeatureBands() {
  return (
    <div className="space-y-0">
      {FEATURE_BANDS.map((band, i) => (
        <section
          key={band.title}
          className="border-b border-border/40 py-20 last:border-b-0"
          aria-labelledby={`feature-band-${i}`}
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className={cn("space-y-5", band.reverse && "lg:order-2")}>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <band.icon className="h-3.5 w-3.5" aria-hidden />
                  {band.eyebrow}
                </div>
                <h2 id={`feature-band-${i}`} className="text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                  {band.title}
                </h2>
                <p className="max-w-xl text-pretty text-muted-foreground md:text-lg">{band.desc}</p>
              </div>

              <div className={cn("grid gap-4 sm:grid-cols-2", band.reverse && "lg:order-1")}>
                {band.cards.map((card) => (
                  <Card key={card.title} className="glass-panel">
                    <CardContent className="flex flex-col gap-3 p-6">
                      <card.icon className="h-5 w-5 text-primary" aria-hidden />
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
