export type MarketplaceCategoryId =
  | "rules"
  | "templates"
  | "strategies"
  | "crypto"
  | "stocks"
  | "bonds"
  | "etfs"
  | "research"
  | "bots"
  | "bundles";

export type AssetClass = "crypto" | "stocks" | "bonds" | "etfs" | "commodities" | "multi";

export type RiskLevel = "low" | "medium" | "high";

export type PriceKind = "free" | "paid" | "subscription" | "bundle";

export interface MarketplaceProduct {
  id: string;
  category: MarketplaceCategoryId;
  assetClass: AssetClass;
  typeLabel: string;
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  priceKind: PriceKind;
  priceDisplay: string;
  creator: string;
  creatorVerified: boolean;
  risk: RiskLevel;
  tags: string[];
  /** optional performance copy for cards */
  performanceHint?: string;
}

export interface BundlePack {
  id: string;
  title: string;
  description: string;
  priceDisplay: string;
  itemCount: number;
  tags: string[];
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export const marketplaceCategoryLabels: Record<MarketplaceCategoryId, string> = {
  rules: "Rules",
  templates: "Templates",
  strategies: "Strategies",
  crypto: "Crypto",
  stocks: "Stocks",
  bonds: "Bonds",
  etfs: "ETFs",
  research: "Research",
  bots: "Bots",
  bundles: "Bundles",
};

export const categoryStripIds: MarketplaceCategoryId[] = [
  "rules",
  "templates",
  "crypto",
  "stocks",
  "bonds",
  "etfs",
  "research",
  "bots",
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: "Browse",
    description: "Filter by asset class, risk level, price, and creator reputation—everything is labeled upfront.",
  },
  {
    step: 2,
    title: "Preview safely",
    description: "Open structured previews so you understand how a pack works before paying. Sensitive logic stays protected.",
  },
  {
    step: 3,
    title: "Clone into your workspace",
    description: "Add free starters or unlock paid packs in one flow, then open them beside your charts and notebooks.",
  },
  {
    step: 4,
    title: "Customize",
    description: "Tune parameters and guardrails to match your timeframe and appetite for risk—and iterate from there.",
  },
];

export const trustFeatures = [
  {
    title: "Verified creators",
    body: "Badges and checks for publishers with a clearer track record—not anonymous drop-ins.",
  },
  {
    title: "Transparent notes",
    body: "Where available, listings include methodology summaries and disclaimers instead of vague marketing claims.",
  },
  {
    title: "Reviews & refunds",
    body: "Structured reviews and defined refund paths when something isn't as described.",
  },
  {
    title: "Preview before you unlock",
    body: "Buyers can explore structure before paying for full-depth logic.",
  },
];

export const previewProducts: MarketplaceProduct[] = [
  {
    id: "pv-1",
    category: "rules",
    assetClass: "crypto",
    typeLabel: "Rule",
    title: "BTC swing exit ladder",
    description: "Tiered take-profit and trailing stop template for medium-term crypto swings.",
    rating: 4.8,
    reviewCount: 124,
    downloads: 2100,
    priceKind: "paid",
    priceDisplay: "$24",
    creator: "Nimbus Labs",
    creatorVerified: true,
    risk: "high",
    tags: ["Crypto", "Swing"],
  },
  {
    id: "pv-2",
    category: "templates",
    assetClass: "multi",
    typeLabel: "Template",
    title: "Institutional risk dashboard",
    description: "Glass-style portfolio dashboard with factor and duration hooks.",
    rating: 4.9,
    reviewCount: 89,
    downloads: 980,
    priceKind: "subscription",
    priceDisplay: "$12/mo",
    creator: "Northwood Research",
    creatorVerified: true,
    risk: "medium",
    tags: ["Dashboard", "Risk"],
  },
  {
    id: "pv-3",
    category: "bonds",
    assetClass: "bonds",
    typeLabel: "Research",
    title: "IG bond income watchlist",
    description: "Weekly curve commentary with duration-neutral sleeve ideas.",
    rating: 4.7,
    reviewCount: 56,
    downloads: 430,
    priceKind: "free",
    priceDisplay: "Free",
    creator: "Harbor Fixed Income",
    creatorVerified: false,
    risk: "low",
    tags: ["Bonds", "Income"],
  },
  {
    id: "pv-4",
    category: "stocks",
    assetClass: "stocks",
    typeLabel: "Strategy",
    title: "Quality momentum overlay",
    description: "Large-cap factor overlay with earnings revision gate and drawdown cap.",
    rating: 4.6,
    reviewCount: 203,
    downloads: 1540,
    priceKind: "paid",
    priceDisplay: "$49",
    creator: "Atlas Quant",
    creatorVerified: true,
    risk: "medium",
    tags: ["Equities", "Trend"],
    performanceHint: "Backtest disclosure included",
  },
  {
    id: "pv-5",
    category: "rules",
    assetClass: "etfs",
    typeLabel: "Rule",
    title: "ETF flow shock brake",
    description: "Throttle adds on extreme premium/discount vs fair value with volatility regime filter.",
    rating: 4.5,
    reviewCount: 91,
    downloads: 1320,
    priceKind: "paid",
    priceDisplay: "$32",
    creator: "Flowline PM",
    creatorVerified: true,
    risk: "medium",
    tags: ["ETF", "Flow"],
  },
];

export const featuredProducts: MarketplaceProduct[] = [
  {
    id: "ft-1",
    category: "rules",
    assetClass: "crypto",
    typeLabel: "Rule pack",
    title: "Futures risk guard",
    description: "Liquidation distance, funding spikes, and position cap automations.",
    rating: 4.9,
    reviewCount: 312,
    downloads: 5600,
    priceKind: "paid",
    priceDisplay: "$59",
    creator: "Vertex Systems",
    creatorVerified: true,
    risk: "high",
    tags: ["Futures", "Risk"],
  },
  {
    id: "ft-2",
    category: "templates",
    assetClass: "multi",
    typeLabel: "Template",
    title: "PDF thesis → rules",
    description: "Import analyst PDFs and map to draft rule blocks for review.",
    rating: 4.8,
    reviewCount: 178,
    downloads: 3200,
    priceKind: "subscription",
    priceDisplay: "$19/mo",
    creator: "LedgerMind",
    creatorVerified: true,
    risk: "medium",
    tags: ["PDF", "Workflow"],
  },
  {
    id: "ft-3",
    category: "bots",
    assetClass: "crypto",
    typeLabel: "Bot config",
    title: "Grid spot assistant",
    description: "Parameter presets for range-bound markets with inventory skew alerts.",
    rating: 4.5,
    reviewCount: 441,
    downloads: 8900,
    priceKind: "paid",
    priceDisplay: "$35",
    creator: "Gridline",
    creatorVerified: true,
    risk: "medium",
    tags: ["Grid", "Spot"],
  },
  {
    id: "ft-4",
    category: "research",
    assetClass: "etfs",
    typeLabel: "Research pack",
    title: "ETF sector rotation brief",
    description: "Monthly flows, carry, and macro shock scenarios for sector ETFs.",
    rating: 4.7,
    reviewCount: 92,
    downloads: 670,
    priceKind: "paid",
    priceDisplay: "$29",
    creator: "Cairn Macro",
    creatorVerified: false,
    risk: "medium",
    tags: ["ETF", "Macro"],
  },
  {
    id: "ft-5",
    category: "rules",
    assetClass: "stocks",
    typeLabel: "Rule",
    title: "Mean-reversion sleeve",
    description: "Statistical bands with earnings blackout and liquidity filters.",
    rating: 4.4,
    reviewCount: 156,
    downloads: 2100,
    priceKind: "free",
    priceDisplay: "Free",
    creator: "Quiet Delta",
    creatorVerified: true,
    risk: "low",
    tags: ["Equities", "MR"],
  },
  {
    id: "ft-6",
    category: "strategies",
    assetClass: "commodities",
    typeLabel: "Strategy",
    title: "Trend sleeve — commodities",
    description: "Long-only trend following with volatility targeting hints.",
    rating: 4.6,
    reviewCount: 74,
    downloads: 890,
    priceKind: "paid",
    priceDisplay: "$44",
    creator: "Strait PM",
    creatorVerified: true,
    risk: "high",
    tags: ["Commodities", "Trend"],
    performanceHint: "12m walk-forward sample",
  },
  {
    id: "ft-7",
    category: "templates",
    assetClass: "crypto",
    typeLabel: "Backtest template",
    title: "Cross-exchange backtest shell",
    description: "Unified fee/slippage model and funding-aware PnL blocks.",
    rating: 4.8,
    reviewCount: 201,
    downloads: 4100,
    priceKind: "paid",
    priceDisplay: "$39",
    creator: "TapeSync",
    creatorVerified: true,
    risk: "medium",
    tags: ["Backtest", "Crypto"],
  },
  {
    id: "ft-8",
    category: "bots",
    assetClass: "multi",
    typeLabel: "Automation",
    title: "Rebalance & alert mesh",
    description: "Threshold alerts, rebalance suggestions, and audit log export.",
    rating: 4.7,
    reviewCount: 118,
    downloads: 1500,
    priceKind: "subscription",
    priceDisplay: "$9/mo",
    creator: "OpsPilot",
    creatorVerified: true,
    risk: "low",
    tags: ["Automation", "Ops"],
  },
];

export const bundlePacks: BundlePack[] = [
  {
    id: "bd-1",
    title: "Crypto Starter Pack",
    description: "Spot risk rules, grid presets, and a cross-venue backtest shell.",
    priceDisplay: "$79",
    itemCount: 6,
    tags: ["Crypto", "Starter"],
  },
  {
    id: "bd-2",
    title: "Risk Management Pack",
    description: "VaR-style guardrails, position caps, and futures liquidation sentinels.",
    priceDisplay: "$99",
    itemCount: 8,
    tags: ["Risk", "Pro"],
  },
  {
    id: "bd-3",
    title: "Bond Income Pack",
    description: "Duration ladders, IG watchlists, and carry dashboards.",
    priceDisplay: "$64",
    itemCount: 5,
    tags: ["Bonds", "Income"],
  },
  {
    id: "bd-4",
    title: "AI Trading Rules Pack",
    description: "LLM-to-rule drafting templates with human review checkpoints.",
    priceDisplay: "$119",
    itemCount: 7,
    tags: ["AI", "Rules"],
  },
];

/** Full grid for /marketplace/app — combine featured + preview + a few extras */
export const marketplaceCatalog: MarketplaceProduct[] = [
  ...featuredProducts,
  ...previewProducts.filter((p) => !featuredProducts.some((f) => f.id === p.id)),
  {
    id: "ex-1",
    category: "strategies",
    assetClass: "crypto",
    typeLabel: "Strategy",
    title: "Scalping microstructure filter",
    description: "Spread and imbalance gates for ultra-short crypto scalps.",
    rating: 4.3,
    reviewCount: 267,
    downloads: 7200,
    priceKind: "paid",
    priceDisplay: "$27",
    creator: "Pulse Trader",
    creatorVerified: true,
    risk: "high",
    tags: ["Scalp", "Crypto"],
  },
  {
    id: "ex-2",
    category: "research",
    assetClass: "stocks",
    typeLabel: "Research",
    title: "Weekly equities watchlist",
    description: "Liquidity-screened names with catalyst calendar.",
    rating: 4.5,
    reviewCount: 198,
    downloads: 4100,
    priceKind: "subscription",
    priceDisplay: "$15/mo",
    creator: "Field Notes PM",
    creatorVerified: true,
    risk: "medium",
    tags: ["Watchlist", "Equities"],
  },
];

/** Extra listings used only on the public marketplace landing composition */
export const landingCatalogExtras: MarketplaceProduct[] = [
  {
    id: "rp-1",
    category: "research",
    assetClass: "multi",
    typeLabel: "Research pack",
    title: "Cross-asset liquidity monitor",
    description: "FX, rates, and depth snapshots with circuit-breaker thresholds for risk committees.",
    rating: 4.8,
    reviewCount: 64,
    downloads: 1820,
    priceKind: "subscription",
    priceDisplay: "$22/mo",
    creator: "Northwater Desk",
    creatorVerified: true,
    risk: "medium",
    tags: ["Macro", "Liquidity"],
  },
  {
    id: "rp-2",
    category: "research",
    assetClass: "bonds",
    typeLabel: "Credit brief",
    title: "IG/HY spreads & refinancing radar",
    description: "Issuance calendars, rollover risk heatmap, and spread percentile context.",
    rating: 4.6,
    reviewCount: 41,
    downloads: 690,
    priceKind: "paid",
    priceDisplay: "$39",
    creator: "Harbor Credit",
    creatorVerified: true,
    risk: "low",
    tags: ["Credit", "Bonds"],
  },
  {
    id: "wl-1",
    category: "crypto",
    assetClass: "crypto",
    typeLabel: "Watchlist",
    title: "Perp liquidity majors",
    description: "Top venues open interest change, funding z-score, and spread guard thresholds.",
    rating: 4.7,
    reviewCount: 512,
    downloads: 12400,
    priceKind: "free",
    priceDisplay: "Free",
    creator: "TapeSync",
    creatorVerified: true,
    risk: "high",
    tags: ["Perps", "Liquidity"],
  },
  {
    id: "wl-2",
    category: "etfs",
    assetClass: "etfs",
    typeLabel: "Watchlist",
    title: "Sector rotation heatmap",
    description: "Relative strength vs benchmarks with flow and convexity overlays.",
    rating: 4.5,
    reviewCount: 176,
    downloads: 5400,
    priceKind: "paid",
    priceDisplay: "$18",
    creator: "SectorLab",
    creatorVerified: false,
    risk: "medium",
    tags: ["ETF", "Rotation"],
  },
  {
    id: "wl-3",
    category: "stocks",
    assetClass: "stocks",
    typeLabel: "Watchlist",
    title: "Dividend resilience screen",
    description: "Payout coverage, dispersion, and drawdown sensitivities with alert rails.",
    rating: 4.4,
    reviewCount: 223,
    downloads: 3100,
    priceKind: "subscription",
    priceDisplay: "$12/mo",
    creator: "Quiet Delta",
    creatorVerified: true,
    risk: "low",
    tags: ["Equities", "Income"],
  },
];

export interface MarketplaceLandingStat {
  value: string;
  /** Bold line directly under the number */
  label: string;
  /** Extra clarifying phrase (muted) */
  caption?: string;
  /** Optional disclaimer line rendered under caption */
  footnoteHint?: boolean;
}

export const marketplaceLandingStats: MarketplaceLandingStat[] = [
  { value: "190+", label: "Verified publishers", caption: "Seller accounts cleared in onboarding (sandbox)." },
  { value: "280+", label: "Playbooks indexed", caption: "Rules, templates, research, & watchlists." },
  {
    value: "11k+",
    label: "Workspace clones / month",
    caption: "Simulated installs in demo environments.",
  },
  {
    value: "4.9",
    label: "Weighted avg. rating",
    caption: "From structured listing reviews.",
    footnoteHint: true,
  },
];

function uniqProducts(rows: MarketplaceProduct[]): MarketplaceProduct[] {
  const seen = new Set<string>();
  const out: MarketplaceProduct[] = [];
  for (const p of rows) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

function pickProductsByIds(catalog: MarketplaceProduct[], ids: string[]): MarketplaceProduct[] {
  const map = new Map(catalog.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is MarketplaceProduct => Boolean(p));
}

export const marketplaceLandingCatalog = uniqProducts([
  ...marketplaceCatalog,
  ...landingCatalogExtras,
]);

export const landingFeaturedRules = pickProductsByIds(marketplaceLandingCatalog, [
  "ft-1",
  "ft-5",
  "pv-1",
  "pv-5",
]);

export const landingTrendingStrategies = pickProductsByIds(marketplaceLandingCatalog, [
  "ft-6",
  "pv-4",
  "ex-1",
  "ft-3",
]);

export const landingResearchPacks = pickProductsByIds(marketplaceLandingCatalog, [
  "ft-4",
  "ex-2",
  "rp-1",
  "rp-2",
]);

export const landingWatchlists = pickProductsByIds(marketplaceLandingCatalog, ["pv-3", "wl-1", "wl-2", "wl-3"]);

/** Featured strip on landing = rules & automation + curated watchlists (single section) */
export const landingFeaturedShowcase = pickProductsByIds(marketplaceLandingCatalog, [
  "ft-1",
  "ft-5",
  "pv-1",
  "pv-5",
  "wl-1",
  "pv-3",
]);
