import { cn } from "@/lib/utils";
import type { MarketplaceCategoryId } from "@/data/marketplaceMock";
import { marketplaceCategoryLabels, categoryStripIds } from "@/data/marketplaceMock";

export function MarketplaceCategoryStrip({
  active,
  onSelect,
  className,
}: {
  active: MarketplaceCategoryId | null;
  onSelect: (id: MarketplaceCategoryId) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      role="tablist"
      aria-label="Marketplace categories"
    >
      {categoryStripIds.map((id) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(id)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-xs transition-colors",
              isActive
                ? "border-[color:var(--mkt-mint)]/65 bg-[color:var(--mkt-mint)]/20 font-semibold text-white shadow-md ring-2 ring-[color:var(--mkt-mint)]/30"
                : "border-border/65 bg-background/45 font-medium text-[color:var(--mkt-text-body)] hover:border-[color:var(--mkt-mint)]/40 hover:text-white",
            )}
          >
            {marketplaceCategoryLabels[id]}
          </button>
        );
      })}
    </div>
  );
}
