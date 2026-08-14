import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/data/marketplaceMock";

const styles: Record<RiskLevel, string> = {
  low: "border-emerald-500/35 bg-emerald-500/10 text-emerald-400",
  medium: "border-amber-500/35 bg-amber-500/10 text-amber-400",
  high: "border-red-500/40 bg-red-500/10 text-red-400",
};

const labels: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        styles[risk],
        className,
      )}
    >
      {labels[risk]} risk
    </span>
  );
}
