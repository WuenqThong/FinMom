import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Brain,
  Code2,
  LayoutDashboard,
  Lock,
  Radio,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

import stepAccount from "@/assets/step-account.png";
import stepWallet from "@/assets/step-wallet.png";
import stepTrade from "@/assets/step-trade.png";

export const LANDING_STEPS = [
  {
    title: "Create your account",
    desc: "Sign up in minutes and secure your profile—then jump straight into the workspace.",
    image: stepAccount,
  },
  {
    title: "Fund your wallet",
    desc: "Deposit or transfer so you're ready to trade, automate, or browse the marketplace.",
    image: stepWallet,
  },
  {
    title: "Trade & automate",
    desc: "Execute spot moves, tune bots, or clone creator rules—one interface, real-time feedback.",
    image: stepTrade,
  },
] as const;

export const SOCIAL_LOGOS = ["NovaChain", "Vertex Labs", "Atlas Fund", "CryoDesk", "BlockForge"] as const;

export type TrustItem = { icon: LucideIcon; label: string; desc: string };

export const TRUST_ITEMS: TrustItem[] = [
  { icon: Lock, label: "Security-first", desc: "Encryption & session hygiene by design" },
  { icon: Radio, label: "Real-time data", desc: "Quotes and bot states stay in sync" },
  { icon: Sparkles, label: "Reliable UX", desc: "Built for long sessions and fast iteration" },
];

export const USE_CASE_TAGS = [
  "Spot trading",
  "Futures",
  "DCA & bots",
  "Copy strategies",
  "Marketplace templates",
  "Rule Engine",
  "Portfolio view",
  "Risk controls",
  "Backtesting",
  "Paper trading",
  "AI-assisted rules",
  "Multi-asset",
  "Team workflows",
  "API & integrations",
  "Education",
] as const;

export type FeatureBand = {
  eyebrow: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  cards: { title: string; desc: string; icon: LucideIcon }[];
  reverse?: boolean;
};

export const FEATURE_BANDS: FeatureBand[] = [
  {
    eyebrow: "Core engine",
    title: "One platform for execution, analysis, and automation",
    desc: "Route capital, monitor positions, and iterate on rules without juggling five different tabs. FinMom keeps the stack cohesive so you move faster with fewer mistakes.",
    icon: BarChart3,
    cards: [
      {
        title: "Maximum security",
        desc: "Modern safeguards around sessions, keys, and account actions.",
        icon: Shield,
      },
      {
        title: "Instant transactions",
        desc: "Submit trades and see fills update without stale UI states.",
        icon: Zap,
      },
    ],
  },
  {
    eyebrow: "Developer-grade workflow",
    title: "From rough idea to tested rule—in the same workspace",
    desc: "Prototype strategies, stress-test assumptions against live markets, and graduate into automation when you're ready. No context switch to a different toolset.",
    icon: Code2,
    cards: [
      {
        title: "Optimized fees",
        desc: "Competitive costs so experimentation doesn't get taxed away.",
        icon: Wallet,
      },
      {
        title: "AI-assisted clarity",
        desc: "Signal-rich layouts that stay readable during volatile windows.",
        icon: Brain,
      },
    ],
    reverse: true,
  },
  {
    eyebrow: "Infrastructure you can trust",
    title: "Designed for uptime, focus, and depth",
    desc: "Whether you're running lightweight automations or a full trading stack, the interface stays responsive and the primitives stay predictable.",
    icon: Sparkles,
    cards: [
      {
        title: "Premium interface",
        desc: "A calm, dense UI that scales from first trade to power user.",
        icon: LayoutDashboard,
      },
      {
        title: "Operational clarity",
        desc: "Surface what matters—orders, risk, and bot health at a glance.",
        icon: Activity,
      },
    ],
  },
];
