export type PlanAudience = "trader" | "creator" | "team";

export type PlanId = "free" | "pro" | "trader-plus" | "creator" | "business";

export type PricingPlan = {
  id: PlanId;
  name: string;
  tagline: string;
  audience: PlanAudience;
  /** USD per month; null = custom / contact */
  monthlyPrice: number | null;
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
};

/** Yearly = 20% off monthly equivalent (plan: monthly × 12 × 0.8, shown as /mo billed annually) */
export function yearlyMonthlyEquivalent(monthly: number): number {
  return Math.round(monthly * 0.8 * 100) / 100;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Start exploring rules, templates, and the marketplace.",
    audience: "trader",
    monthlyPrice: 0,
    ctaLabel: "Start free",
    ctaHref: "/register",
    features: [
      "Explore marketplace",
      "View free templates",
      "Basic Rule Engine",
      "Save limited rules",
      "Basic watchlist",
      "Community marketplace access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For investors who live in the Rule Engine and marketplace.",
    audience: "trader",
    monthlyPrice: 1019,
    featured: true,
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/register",
    features: [
      "Unlimited saved rules & templates",
      "Clone marketplace items to Rule Engine",
      "Advanced strategy preview",
      "Backtest templates",
      "Portfolio templates",
      "Priority marketplace access",
      "Lower marketplace fee vs Free",
    ],
  },
  {
    id: "trader-plus",
    name: "Trader Plus",
    tagline: "Automation, risk controls, and multi-asset context.",
    audience: "trader",
    monthlyPrice: 1049,
    ctaLabel: "Build trading system",
    ctaHref: "/register",
    features: [
      "Advanced trading automation",
      "Bot strategy templates",
      "Risk management rules",
      "Performance history dashboard",
      "Sandbox testing",
      "Multi-asset watchlists: crypto, stocks, bonds, ETFs",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "Publish, bundle, and grow revenue on the marketplace.",
    audience: "creator",
    monthlyPrice: 1029,
    ctaLabel: "Become a Creator",
    ctaHref: "/register",
    features: [
      "Publish paid rules & templates",
      "Creator profile",
      "Sales dashboard",
      "Ratings & reviews",
      "Bundle packs",
      "Revenue analytics",
      "Verified creator application",
      "Platform fee applies to paid sales (see below)",
    ],
  },
  {
    id: "business",
    name: "Business / Team",
    tagline: "Shared libraries, approvals, and private marketplace.",
    audience: "team",
    monthlyPrice: null,
    ctaLabel: "Contact sales",
    ctaHref: "mailto:sales@finmom.example?subject=FinMom%20Business%20pricing",
    features: [
      "Team workspace",
      "Shared strategy library",
      "Approval workflow",
      "Private marketplace",
      "Advanced reports",
      "Dedicated support",
    ],
  },
];

/** All subscription cards in one row on wide screens */
export const planCardIds: PlanId[] = ["free", "pro", "trader-plus", "creator", "business"];

export type ComparisonRow = {
  label: string;
  values: Record<PlanId, string>;
};

export const pricingComparisonRows: ComparisonRow[] = [
  {
    label: "Marketplace access",
    values: {
      free: "Community",
      pro: "Priority",
      "trader-plus": "Priority",
      creator: "Full seller + buyer",
      business: "Private + optional public",
    },
  },
  {
    label: "Free templates",
    values: {
      free: "Yes",
      pro: "Yes",
      "trader-plus": "Yes",
      creator: "Yes",
      business: "Yes",
    },
  },
  {
    label: "Paid item purchase",
    values: {
      free: "Yes",
      pro: "Yes",
      "trader-plus": "Yes",
      creator: "Yes",
      business: "Yes",
    },
  },
  {
    label: "Clone to Rule Engine",
    values: {
      free: "Limited",
      pro: "Unlimited",
      "trader-plus": "Unlimited",
      creator: "Included",
      business: "Included",
    },
  },
  {
    label: "Rule limit",
    values: {
      free: "Low",
      pro: "Unlimited",
      "trader-plus": "Unlimited",
      creator: "As seller",
      business: "Custom",
    },
  },
  {
    label: "Strategy preview",
    values: {
      free: "Basic",
      pro: "Advanced",
      "trader-plus": "Advanced",
      creator: "Advanced",
      business: "Advanced",
    },
  },
  {
    label: "Sandbox testing",
    values: {
      free: "—",
      pro: "—",
      "trader-plus": "Yes",
      creator: "—",
      business: "Yes",
    },
  },
  {
    label: "Backtest templates",
    values: {
      free: "—",
      pro: "Yes",
      "trader-plus": "Yes",
      creator: "—",
      business: "Yes",
    },
  },
  {
    label: "Creator listings (paid)",
    values: {
      free: "—",
      pro: "—",
      "trader-plus": "—",
      creator: "Yes",
      business: "Optional",
    },
  },
  {
    label: "Sales dashboard",
    values: {
      free: "—",
      pro: "—",
      "trader-plus": "—",
      creator: "Yes",
      business: "Yes",
    },
  },
  {
    label: "Platform fee (paid sales)",
    values: {
      free: "Buyer N/A",
      pro: "10%",
      "trader-plus": "10%",
      creator: "Tiered *",
      business: "Custom",
    },
  },
  {
    label: "Verified badge",
    values: {
      free: "—",
      pro: "—",
      "trader-plus": "—",
      creator: "Application",
      business: "Optional",
    },
  },
  {
    label: "Priority support",
    values: {
      free: "—",
      pro: "Email",
      "trader-plus": "Priority",
      creator: "Priority",
      business: "Dedicated",
    },
  },
];


export type PricingFaq = { question: string; answer: string };

export const pricingFaqs: PricingFaq[] = [
  {
    question: "Can I use the Marketplace for free?",
    answer:
      "Yes. You can browse, use free templates, and access community listings on the Free plan. Paid items are purchased separately; subscription unlocks cloning limits, Rule Engine depth, and creator tools.",
  },
  {
    question: "Do paid strategies guarantee profit?",
    answer:
      "No. Past performance and backtests are not reliable indicators of future results. All strategies carry risk. Use sandbox and your own diligence before deploying capital.",
  },
  {
    question: "Can I refund a marketplace purchase?",
    answer:
      "Refund policies depend on the listing type and creator terms shown at checkout. We recommend reviewing each item’s risk label and description before purchase.",
  },
  {
    question: "What is Clone to Rule Engine?",
    answer:
      "It copies a compatible marketplace item into your Rule Engine workspace so you can inspect, edit, and deploy rules with your own guardrails (subject to plan limits).",
  },
  {
    question: "How do creator payouts work?",
    answer:
      "Creators receive payouts on a scheduled settlement after platform fees and any chargebacks. Exact timing and tax documentation are confirmed during seller onboarding (MVP: contact us for details).",
  },
  {
    question: "Can I sell crypto or stocks directly on FinMom?",
    answer:
      "FinMom focuses on rules, templates, and research workflows—not brokerage execution. Trading integrations depend on your connected accounts and applicable regulations.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. Content on the marketplace is for research and educational purposes only and is not personalized investment advice. Consult a licensed professional for your situation.",
  },
];

export const pricingComplianceDisclaimer =
  "Marketplace content is for research and educational purposes only. Strategy performance is not guaranteed. Always review risk before deploying any rule or template.";

export const pricingHero = {
  title: "Choose the plan for how you trade, build, and sell financial strategies",
  subtitle:
    "Start free, upgrade for advanced rules, marketplace tools, creator analytics, and strategy automation.",
};
