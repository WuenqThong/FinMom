import type { HowItWorksStep } from "@/data/marketplaceMock";
import { cn } from "@/lib/utils";

export function HowItWorksSection({ steps, className }: { steps: HowItWorksStep[]; className?: string }) {
  return (
    <section className={cn("pt-20", className)} aria-labelledby="how-it-works-heading">
      <h2 id="how-it-works-heading" className="mkt-section-heading text-center text-white">
        How it works
      </h2>
      <p className="mkt-muted mx-auto mt-3 max-w-2xl text-center">
        From first browse to a pack you truly understand—fewer jargon walls, clearer next steps.
      </p>
      <ol className="mx-auto mt-10 grid max-w-5xl list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li
            key={s.step}
            className="glass-panel flex items-start gap-3 rounded-2xl border border-border/50 p-4 [&:focus-within]:ring-1 [&:focus-within]:ring-primary/20"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--mkt-mint)]/35 bg-[color:var(--mkt-secondary-bg)] text-xs font-bold text-[color:var(--mkt-mint)] shadow-sm">
              {s.step}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-sm font-semibold leading-snug text-white">{s.title}</h3>
              <p className="mkt-muted mt-2 text-xs leading-relaxed sm:text-[13px]">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
