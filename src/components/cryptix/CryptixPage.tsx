import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronRight, Shield, Wallet, Zap, TrendingUp } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "@/components/NavLink";

import dashboardImage from "@/assets/cryptix/dashboard.png";
import stepAccount from "@/assets/cryptix/step-account.png";
import stepWallet from "@/assets/cryptix/step-wallet.png";
import stepTrade from "@/assets/cryptix/step-trade.png";
import avatarAlex from "@/assets/cryptix/avatar-alex.png";

type SectionId = "hero" | "trading" | "how" | "testimonials" | "pricing" | "faq";

const navItems: Array<{ label: string; path: string; section: SectionId }> = [
  { label: "Trading", path: "/trading", section: "trading" },
];

const benefits = [
  {
    title: "Maximum Security",
    desc: "Your assets are protected with cutting-edge security protocols.",
    icon: Shield,
  },
  {
    title: "Instant Transactions",
    desc: "Execute your transactions in real-time, without delays.",
    icon: Zap,
  },
  {
    title: "Optimized Fees",
    desc: "Benefit from some of the lowest fees on the market.",
    icon: Wallet,
  },
  {
    title: "Premium Interface",
    desc: "An intuitive design that’s easy to use, even for beginners.",
    icon: Check,
  },
];

const plans = [
  {
    name: "Free",
    price: "€0",
    note: "/month",
    desc: "Perfect for beginners exploring crypto trading",
    features: [
      "Trade 50+ cryptocurrencies",
      "Standard trading fees (0.8%)",
      "Basic wallet security",
      "Mobile & desktop access",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "€49",
    note: "/month",
    desc: "Advanced tools for serious traders",
    featured: true,
    features: [
      "Everything in Free, plus:",
      "Reduced fees (0.4% per trade)",
      "Priority transaction processing",
      "Advanced charting & indicators",
      "Portfolio analytics dashboard",
    ],
  },
  {
    name: "Business",
    price: "€129",
    note: "/month",
    desc: "Built for institutions and high-volume traders",
    features: [
      "Everything in Pro, plus:",
      "Ultra-low fees (0.1% per trade)",
      "Dedicated account manager",
      "OTC desk for large orders",
      "24/7 phone support",
    ],
  },
];

const faqs = [
  "What is Cryptix?",
  "Is Cryptix secure?",
  "Which cryptocurrencies are supported?",
  "What are the fees for transactions?",
  "How fast are transactions?",
  "Do I need to verify my identity?",
  "Can I access Cryptix on mobile?",
  "How can I contact support?",
];

const symbols = [
  { name: "Bitcoin", price: "$71715.715", change: "+1.71%" },
  { name: "Solana", price: "$82.555", change: "-0.65%" },
  { name: "Dash", price: "$43.705", change: "+1.71%" },
  { name: "XRP", price: "$1.33375", change: "+1.66%" },
  { name: "Ethereum", price: "$3875.32", change: "+1.21%" },
];

interface CryptixPageProps {
  focus?: SectionId;
}

export default function CryptixPage({ focus = "hero" }: CryptixPageProps) {
  const navigate = useNavigate();
  const visibleSections =
    focus === "hero"
      ? new Set<SectionId>(["hero", "trading", "how", "testimonials", "pricing", "faq"])
      : new Set<SectionId>([focus]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2 justify-self-start text-lg font-semibold story-link">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
              <TrendingUp className="h-5 w-5 text-primary" />
            </span>
            <span className="font-bold tracking-tight">FinWise</span>
          </Link>

          <nav className="flex justify-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                activeClassName="border-primary/25 bg-primary/10 text-foreground"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex justify-end">
            <Button className="rounded-full px-6" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>
        </div>
      </header>

      {visibleSections.has("hero") && (
        <main>
          <section className="relative overflow-hidden px-5 pb-16 pt-20 sm:px-8 md:pb-24 md:pt-28">
            <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
              <h1 className="max-w-3xl text-balance text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
                Take Control of Your Digital Assets
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-2xl">
                Cryptix offers a secure experience for managing your digital assets. Instant transactions, optimized
                fees, and premium design.
              </p>
              <Button className="mt-8 rounded-full px-8 py-6 text-base font-semibold">Get started now</Button>

              <div className="mt-14 space-y-2 text-sm text-muted-foreground">
                <p>They trust us</p>
                <p className="text-foreground">★★★★★ 4,9 G</p>
              </div>

              <div className="mt-12 h-[2px] w-full max-w-5xl hero-line" aria-hidden="true" />

              <img
                src={dashboardImage}
                alt="Cryptix dashboard preview"
                className="glass-panel mt-0 w-full max-w-5xl rounded-3xl object-cover"
                loading="eager"
              />
            </div>
          </section>
        </main>
      )}

      {visibleSections.has("hero") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="benefits-title">
          <h2 id="benefits-title" className="text-3xl font-semibold md:text-5xl">
            Why Choose Cryptix?
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Benefits designed to provide a seamless, secure, and accessible experience for all users.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {benefits.map((item) => (
              <Card key={item.title} className="glass-panel">
                <CardContent className="flex items-start gap-4 p-6">
                  <item.icon className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {visibleSections.has("trading") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="Trading-title">
          <h2 id="Trading-title" className="text-3xl font-semibold md:text-5xl">
            All Trading, One Platform
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Buy, sell, and convert all major cryptocurrencies on a single platform. A seamless experience with no
            compromises.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {symbols.map((symbol) => (
              <Card key={symbol.name} className="glass-panel transition-transform duration-300 hover:-translate-y-1">
                <CardContent className="p-5">
                  <p className="text-base font-semibold">{symbol.name}</p>
                  <p className="mt-3 text-2xl font-medium">{symbol.price}</p>
                  <p className="mt-1 text-sm text-primary">{symbol.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {visibleSections.has("how") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="how-title">
          <h2 id="how-title" className="text-3xl font-semibold md:text-5xl">
            How It Works
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            A simple, fast, and secure platform to manage your cryptocurrencies in just a few steps.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Create your account",
                desc: "Sign up easily and secure your profile in just a few steps.",
                image: stepAccount,
              },
              {
                title: "Fund your wallet",
                desc: "Deposit your Trading or make a transfer to start trading.",
                image: stepWallet,
              },
              {
                title: "Buy, sell, or convert",
                desc: "Enjoy the simplicity of a platform that makes every transaction seamless in real-time.",
                image: stepTrade,
              },
            ].map((step) => (
              <Card key={step.title} className="glass-panel overflow-hidden">
                <img src={step.image} alt={step.title} className="h-56 w-full object-cover" loading="lazy" />
                <CardContent className="space-y-2 p-6">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {visibleSections.has("testimonials") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="testimonials-title">
          <h2 id="testimonials-title" className="text-3xl font-semibold md:text-5xl">
            Trusted by Crypto Enthusiasts Worldwide
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Join a growing community of investors who choose Cryptix for its seamless experience, security, and
            premium design.
          </p>

          <Card className="glass-panel mt-10 max-w-3xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <img src={avatarAlex} alt="Alex M." className="h-14 w-14 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="font-semibold">Alex M.</p>
                  <p className="text-sm text-muted-foreground">Blockchain Analyst at NovaChain</p>
                </div>
              </div>
              <p className="mt-6 text-lg">
                “Cryptix makes crypto trading effortless. Fast transactions, low fees, and a sleek interface—exactly
                what I needed.”
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {visibleSections.has("pricing") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="pricing-title">
          <h2 id="pricing-title" className="text-3xl font-semibold md:text-5xl">
            Choose Your Plan. Start Trading Today.
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Transparent pricing for every investor. Scale as you grow with no hidden fees or surprise charges.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.featured ? "glass-panel border-primary" : "glass-panel border-border/80"}
              >
                <CardContent className="space-y-5 p-6">
                  <div>
                    <h3 className="text-2xl font-semibold">{plan.name}</h3>
                    <p className="mt-3 text-4xl font-bold">
                      {plan.price} <span className="text-sm font-medium text-muted-foreground">{plan.note}</span>
                    </p>
                    <p className="mt-3 text-muted-foreground">{plan.desc}</p>
                  </div>

                  <Button className="w-full rounded-full">Get started</Button>

                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {visibleSections.has("faq") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-3xl font-semibold md:text-5xl">
            Your Questions, Answered
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Find everything you need to know about Cryptix, from security to supported assets.
          </p>

          <Card className="glass-panel mt-10">
            <CardContent className="p-4 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, index) => (
                  <AccordionItem key={item} value={`faq-${index}`}>
                    <AccordionTrigger>{item}</AccordionTrigger>
                    <AccordionContent>
                      Cryptix offers secure infrastructure, optimized fees, and a premium trading experience designed
                      for both beginners and advanced users.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      )}

      {visibleSections.size === 1 && focus !== "hero" && (
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <h2 className="text-3xl font-semibold md:text-5xl">Why Choose Cryptix?</h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Benefits designed to provide a seamless, secure, and accessible experience for all users.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {benefits.map((item) => (
              <Card key={item.title} className="glass-panel">
                <CardContent className="flex items-start gap-4 p-6">
                  <item.icon className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-8 text-center sm:px-8">
        <Card className="glass-panel overflow-hidden">
          <CardContent className="space-y-6 px-6 py-12 sm:px-10">
            <h2 className="text-balance text-3xl font-semibold md:text-5xl">Ready to take control of your crypto?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join thousands of users who trust Cryptix for secure, seamless, and efficient cryptocurrency
              transactions.
            </p>
            <Button className="rounded-full px-8 py-6 text-base">
              Get started now <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}