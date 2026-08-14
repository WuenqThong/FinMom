import { MarketplaceProductCard } from "./MarketplaceProductCard";
import type { MarketplaceProduct } from "@/data/marketplaceMock";
import { cn } from "@/lib/utils";

export function FeaturedMarketplaceGrid({
  products,
  className,
  dense,
  exploreHref,
  ctaMode = "full",
  layout = "section",
  showPreviewArt = true,
}: {
  products: MarketplaceProduct[];
  className?: string;
  dense?: boolean;
  exploreHref: string;
  ctaMode?: "hero" | "full";
  layout?: "hero" | "section";
  showPreviewArt?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid items-stretch gap-4",
        layout === "hero" ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((p) => (
        <MarketplaceProductCard
          key={p.id}
          product={p}
          dense={dense}
          exploreHref={exploreHref}
          ctaMode={ctaMode}
          showPreviewArt={showPreviewArt}
        />
      ))}
    </div>
  );
}
