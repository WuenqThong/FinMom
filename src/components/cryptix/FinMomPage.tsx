import { Link } from "react-router-dom";
import { Check, ChevronRight, Shield, Wallet, Zap } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { MainHeader } from "@/components/layout/MainHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingFeatureBands } from "@/components/landing/LandingFeatureBands";
import { LandingFinalCta } from "@/components/landing/LandingFinalCta";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingLogoStrip } from "@/components/landing/LandingLogoStrip";
import { LandingMarketsSection } from "@/components/landing/LandingMarketsSection";
import { LandingPricingTeaser } from "@/components/landing/LandingPricingTeaser";
import { LandingTestimonial } from "@/components/landing/LandingTestimonial";
import { LandingTrustStrip } from "@/components/landing/LandingTrustStrip";
import { LandingUseCaseTags } from "@/components/landing/LandingUseCaseTags";
import { LANDING_STEPS } from "@/components/landing/landingContent";

import dashboardImage from "@/assets/dashboard.png";
import stepAccount from "@/assets/step-account.png";
import stepWallet from "@/assets/step-wallet.png";
import stepTrade from "@/assets/step-trade.png";
import avatarAlex from "@/assets/avatar-alex.png";

type SectionId = "hero" | "trading" | "how" | "testimonials" | "pricing" | "faq" | "rule-engine-and-analysis";

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
    desc: "An intuitive design that's easy to use, even for beginners.",
    icon: Check,
  },
];

const faqs = [
  "What is FinMom?",
  "Is FinMom secure?",
  "Which cryptocurrencies are supported?",
  "What are the fees for transactions?",
  "How fast are transactions?",
  "Do I need to verify my identity?",
  "Can I access FinMom on mobile?",
  "How can I contact support?",
];

const FAQ_DEFAULT_ANSWER =
  "FinMom offers secure infrastructure, optimized fees, and a premium trading experience designed for both beginners and advanced users.";

const symbols = [
  { name: "Bitcoin", price: "$71715.715", change: "+1.71%" },
  { name: "Solana", price: "$82.555", change: "-0.65%" },
  { name: "Dash", price: "$43.705", change: "+1.71%" },
  { name: "XRP", price: "$1.33375", change: "+1.66%" },
  { name: "Ethereum", price: "$3875.32", change: "+1.21%" },
];

const legacySteps = [
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
];

interface FinMomPageProps {
  focus?: SectionId;
}

export default function FinMomPage({ focus = "hero" }: FinMomPageProps) {
  const visibleSections =
    focus === "hero"
      ? new Set<SectionId>(["hero", "trading", "how", "testimonials", "pricing", "faq"])
      : new Set<SectionId>([focus]);

  if (focus === "hero") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <main>
          <LandingHero dashboardSrc={dashboardImage} />
          <LandingLogoStrip />
          <LandingFeatureBands />
          <LandingMarketsSection symbols={symbols} />
          <LandingHowItWorks steps={LANDING_STEPS} />
          <LandingTrustStrip />
          <LandingUseCaseTags />
          <LandingTestimonial
            avatarSrc={avatarAlex}
            name="Alex M."
            role="Blockchain Analyst at NovaChain"
            quote="FinMom makes crypto trading effortless. Fast transactions, low fees, and a sleek interface—exactly what I needed."
          />
          <LandingPricingTeaser />
          <LandingFaqSection faqs={faqs} answer={FAQ_DEFAULT_ANSWER} />
        </main>
        <LandingFinalCta />
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />

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
            {legacySteps.map((step) => (
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
            Join a growing community of investors who choose FinMom for its seamless experience, security, and premium design.
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
                FinMom makes crypto trading effortless. Fast transactions, low fees, and a sleek interface—exactly what I
                needed.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {visibleSections.has("pricing") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="pricing-title">
          <Card className="glass-panel border-primary/20">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="min-w-0">
                <h2 id="pricing-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Pricing for traders, automation, and creators
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                  Compare Free, Pro, Trader Plus, and Creator — plus marketplace fees and Business / Team — on the full
                  pricing page.
                </p>
              </div>
              <Button asChild className="shrink-0 rounded-full px-8">
                <Link to="/pricing">View full pricing</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      {visibleSections.has("faq") && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-3xl font-semibold md:text-5xl">
            Your Questions, Answered
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Find everything you need to know about FinMom, from security to supported assets.
          </p>

          <Card className="glass-panel mt-10">
            <CardContent className="p-4 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, index) => (
                  <AccordionItem key={item} value={`faq-${index}`}>
                    <AccordionTrigger>{item}</AccordionTrigger>
                    <AccordionContent>{FAQ_DEFAULT_ANSWER}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      )}

      {visibleSections.size === 1 && (
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <h2 className="text-3xl font-semibold md:text-5xl">Why Choose FinMom?</h2>
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
              Join thousands of users who trust FinMom for secure, seamless, and efficient cryptocurrency transactions.
            </p>
            <Button className="rounded-full px-8 py-6 text-base">
              Get started now <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <LandingFooter />
    </div>
  );
}
