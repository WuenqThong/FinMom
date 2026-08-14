import { TRUST_ITEMS } from "@/components/landing/landingContent";

export function LandingTrustStrip() {
  return (
    <section className="border-y border-border/50 bg-background py-12" aria-label="Trust and reliability">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:grid-cols-3 sm:px-8">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <h3 className="mt-4 text-base font-semibold">{item.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
