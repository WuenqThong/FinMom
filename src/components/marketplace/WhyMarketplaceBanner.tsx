import { BadgeCheck, Library, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: ShieldCheck,
    title: "Risk-aware listings",
    body: "Every pick shows labels, asset class, and methodology notes so you buy with context.",
  },
  {
    icon: Library,
    title: "Clone to Rule Engine",
    body: "Bring templates into your workspace, edit guardrails, and deploy on your terms.",
  },
  {
    icon: BadgeCheck,
    title: "Verified creators",
    body: "Profiles, ratings, and review history help you choose strategies that match your edge.",
  },
] as const;

export function WhyMarketplaceBanner({ className }: { className?: string }) {
  return (
    <section
      className={cn("border-b border-border/40 bg-muted/10 pt-20 pb-20", className)}
      aria-labelledby="why-marketplace-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--mkt-mint)]/80">
            Why this marketplace
          </p>
          <h2 id="why-marketplace-heading" className="mkt-section-heading mt-2 text-center text-white">
            Built for serious rules, not hype
          </h2>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="glass-panel flex h-full min-h-0 gap-4 rounded-2xl border border-border/50 p-5 text-left transition-colors hover:border-[color:var(--mkt-mint)]/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden strokeWidth={1.75} />
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <h3 className="text-sm font-semibold leading-snug text-white">{title}</h3>
                <p className="mkt-muted mt-2 text-xs leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
