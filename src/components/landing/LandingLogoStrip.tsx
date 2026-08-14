import { SOCIAL_LOGOS } from "@/components/landing/landingContent";

export function LandingLogoStrip() {
  return (
    <section className="border-y border-border/50 bg-muted/15 py-10" aria-labelledby="landing-social-proof">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p id="landing-social-proof" className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Teams shipping with FinMom-style workflows
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-60 grayscale">
          {SOCIAL_LOGOS.map((name) => (
            <span key={name} className="font-manrope text-lg font-semibold tracking-tight text-foreground">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
