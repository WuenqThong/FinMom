import { Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BundlePack } from "@/data/marketplaceMock";

export function MarketplaceBundleCard({ bundle, className }: { bundle: BundlePack; className?: string }) {
  return (
    <Card className={cn("glass-panel border-[color:var(--mkt-mint)]/15 transition-transform hover:-translate-y-0.5", className)}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--mkt-mint)]/25 bg-[color:var(--mkt-mint)]/10">
            <Layers className="h-4 w-4 text-[color:var(--mkt-mint)]" aria-hidden />
          </div>
          <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {bundle.priceDisplay}
          </span>
        </div>
        <div>
          <h3 className="text-sm font-semibold leading-snug">{bundle.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{bundle.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
          <span>{bundle.itemCount} items</span>
          {bundle.tags.map((t) => (
            <span key={t} className="rounded-md border border-border/40 px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
