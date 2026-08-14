import { cn } from "@/lib/utils";
import type { PriceKind } from "@/data/marketplaceMock";

const kindLabel: Record<PriceKind, string> = {
  free: "Free",
  paid: "Paid",
  subscription: "Subscription",
  bundle: "Bundle",
};

const kindStyles: Record<PriceKind, string> = {
  free: "border-emerald-500/35 bg-emerald-500/10 text-emerald-400",
  paid: "border-primary/35 bg-primary/10 text-primary",
  subscription: "border-sky-500/35 bg-sky-500/10 text-sky-400",
  bundle: "border-[color:var(--mkt-mint)]/30 bg-[color:var(--mkt-mint)]/10 text-[color:var(--mkt-text-soft)]",
};

export function PriceBadge({ kind, className }: { kind: PriceKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        kindStyles[kind],
        className,
      )}
    >
      {kindLabel[kind]}
    </span>
  );
}
