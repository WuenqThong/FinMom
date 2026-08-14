import { Download, Eye, ExternalLink, Workflow } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AssetClass, MarketplaceProduct } from "@/data/marketplaceMock";
import { useToast } from "@/hooks/use-toast";
import { PriceBadge } from "./PriceBadge";
import { RatingStars } from "./RatingStars";
import { RiskBadge } from "./RiskBadge";
import { VerifiedCreatorBadge } from "./VerifiedCreatorBadge";

const ASSET_CLASS_LABEL: Record<AssetClass, string> = {
  crypto: "Crypto",
  stocks: "Equities",
  bonds: "Bonds",
  etfs: "ETFs",
  commodities: "Commodities",
  multi: "Multi-asset",
};

function CardPreviewArt() {
  return (
    <div className="relative min-h-[64px] w-full overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/[0.07] via-card/90 to-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 10px, hsl(var(--border) / 0.32) 10px, hsl(var(--border) / 0.32) 11px)",
        }}
      />
      <svg
        viewBox="0 0 128 36"
        className="absolute bottom-2 left-4 right-4 h-9 w-[calc(100%-2rem)] text-[color:var(--mkt-mint)]/55"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 28 L16 22 L32 26 L48 10 L64 18 L80 8 L96 14 L112 6 L128 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export function MarketplaceProductCard({
  product,
  className,
  dense,
  exploreHref,
  ctaMode = "full",
  showPreviewArt = true,
}: {
  product: MarketplaceProduct;
  className?: string;
  dense?: boolean;
  exploreHref: string;
  ctaMode?: "hero" | "full";
  showPreviewArt?: boolean;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "glass-panel flex h-full min-h-0 flex-col overflow-hidden border-border/60 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      {showPreviewArt ? <CardPreviewArt /> : null}
      <CardContent className={cn("flex min-h-0 flex-1 flex-col gap-3", dense ? "p-3.5" : "p-4")}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[color:var(--mkt-mint)]/35 bg-[color:var(--mkt-mint)]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--mkt-text-soft)]">
              {product.typeLabel}
            </span>
            <span className="rounded-full border border-border/55 bg-muted/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--mkt-text-body)]">
              {ASSET_CLASS_LABEL[product.assetClass]}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <PriceBadge kind={product.priceKind} />
            <RiskBadge risk={product.risk} />
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <h3 className={cn("font-semibold leading-snug tracking-tight text-foreground", dense ? "text-sm" : "text-base")}>
            {product.title}
          </h3>
          <p className="mt-1.5 min-h-[2.75rem] text-xs leading-snug text-[color:var(--mkt-text-body)] line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[color:var(--mkt-text-body)]">
          <span className="inline-flex items-center gap-1">
            <RatingStars rating={product.rating} />
            <span className="tabular-nums text-foreground">{product.rating.toFixed(1)}</span>
          </span>
          <span className="text-[color:var(--mkt-text-muted)]">·</span>
          <span>{product.reviewCount} reviews</span>
          <span className="text-[color:var(--mkt-text-muted)]">·</span>
          <span className="inline-flex items-center gap-1">
            <Download className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
            {product.downloads.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/50 pt-3 text-xs text-[color:var(--mkt-text-body)]">
          <span className="font-semibold text-[color:var(--mkt-mint)]">{product.priceDisplay}</span>
          <span className="text-[color:var(--mkt-text-muted)]">·</span>
          <span>{product.creator}</span>
          {product.creatorVerified ? <VerifiedCreatorBadge /> : null}
        </div>

        {product.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border/40 bg-background/50 px-2 py-0.5 text-[10px] text-[color:var(--mkt-text-body)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {product.performanceHint ? (
          <p className="text-[10px] text-emerald-400/90">{product.performanceHint}</p>
        ) : null}

        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
          {ctaMode === "hero" ? (
            <Button
              type="button"
              size="sm"
              className="h-9 w-full rounded-full bg-[color:var(--mkt-mint)] text-xs font-semibold text-[color:var(--mkt-mint-ink)] hover:bg-[color:var(--mkt-mint-hover)] sm:flex-1"
              onClick={() =>
                toast({
                  title: "Preview",
                  description: "Structured listing preview will open when the marketplace backend is connected.",
                })
              }
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 shrink-0 rounded-full px-3 text-xs font-medium text-[color:var(--mkt-text-body)] hover:bg-white/10 hover:text-white"
                onClick={() =>
                  toast({
                    title: "Preview",
                    description: "Structured listing preview will open when the marketplace backend is connected.",
                  })
                }
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-9 flex-1 rounded-full bg-[color:var(--mkt-mint)] px-4 text-xs font-semibold text-[color:var(--mkt-mint-ink)] hover:bg-[color:var(--mkt-mint-hover)]"
                onClick={() => {
                  toast({
                    title: "Clone to workspace",
                    description: "Opening Rule Engine with a demo clone path. Full unlock flow ships next.",
                  });
                  navigate("/rule-engine-and-analysis");
                }}
              >
                <Workflow className="mr-1.5 h-3.5 w-3.5" />
                Clone
              </Button>
              <Button variant="ghost" size="sm" className="h-9 shrink-0 rounded-full px-3 text-xs font-medium text-[color:var(--mkt-text-body)] hover:bg-white/10 hover:text-white" asChild>
                <Link to={exploreHref}>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Details
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
