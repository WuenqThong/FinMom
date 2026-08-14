import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function MarketplaceSearchBar({
  className,
  id = "marketplace-search",
  readOnly = true,
  variant = "default",
}: {
  className?: string;
  id?: string;
  readOnly?: boolean;
  /** Hero: taller field, stronger border and placeholder contrast */
  variant?: "default" | "hero";
}) {
  const isHero = variant === "hero";

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2",
          isHero ? "text-[color:var(--mkt-text-soft)]" : "text-muted-foreground",
        )}
        aria-hidden
      />
      <Input
        id={id}
        type="search"
        readOnly={readOnly}
        placeholder="Search rules, templates, equities, crypto…"
        className={cn(
          "rounded-full bg-background/90 pl-11 pr-4 text-sm shadow-sm backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[color:var(--mkt-mint)]/40",
          isHero
            ? "min-h-[52px] h-[52px] border-2 border-white/28 text-white placeholder:text-white/72"
            : "h-12 border border-border/80 placeholder:text-muted-foreground/95 focus-visible:border-primary/50",
        )}
        aria-label="Marketplace search (preview)"
      />
    </div>
  );
}
