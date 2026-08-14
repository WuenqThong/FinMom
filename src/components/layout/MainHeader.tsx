import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Brain,
  Briefcase,
  CalendarDays,
  Copy,
  FileText,
  LayoutGrid,
  Menu,
  Monitor,
  RefreshCw,
  Settings2,
  Shield,
  Store,
  TrendingDown,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandLogoLink } from "@/components/layout/BrandLogoLink";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const triggerCls =
  "h-auto px-3 py-2 text-sm font-medium text-muted-foreground transition-colors !rounded-none !bg-transparent hover:bg-transparent hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground";

const linkCls =
  "px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground inline-flex items-center";

function NavFeatureItem({
  icon: Icon,
  title,
  desc,
  to = "#",
  badge,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  to?: string;
  badge?: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className="flex items-start gap-3 rounded-md p-3 text-sm outline-none transition-colors hover:bg-muted/50 focus:bg-muted/50"
        >
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 font-medium leading-none text-foreground">
              {title}
              {badge && (
                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary">
                  {badge}
                </span>
              )}
            </span>
            <span className="mt-0.5 line-clamp-2 text-muted-foreground">{desc}</span>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function NavSimpleItem({ title, desc, to = "#" }: { title: string; desc: string; to?: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className="block rounded-md p-3 text-sm outline-none transition-colors hover:bg-muted/50 focus:bg-muted/50"
        >
          <div className="font-medium leading-none text-foreground">{title}</div>
          <div className="mt-0.5 text-muted-foreground">{desc}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MobileFeatureRow({
  icon: Icon,
  title,
  desc,
  to = "#",
  badge,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  to?: string;
  badge?: string;
}) {
  return (
    <SheetClose asChild>
      <Link to={to} className="flex gap-3 rounded-lg p-2.5 text-sm transition-colors hover:bg-muted/55">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5 font-medium leading-snug text-foreground">
            {title}
            {badge && (
              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary">
                {badge}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{desc}</span>
        </span>
      </Link>
    </SheetClose>
  );
}

function MobileSimpleRow({ title, desc, to = "#" }: { title: string; desc: string; to?: string }) {
  return (
    <SheetClose asChild>
      <Link to={to} className="block rounded-lg p-2.5 text-sm transition-colors hover:bg-muted/55">
        <span className="font-medium leading-snug text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{desc}</span>
      </Link>
    </SheetClose>
  );
}

function DesktopMainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerCls}>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(72rem,calc(100vw-1.25rem))] grid-cols-3 gap-0 p-4">
              <div>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Easy</p>
                <ul>
                  <NavFeatureItem
                    icon={Shield}
                    title="Rule Engine & Analysis"
                    desc="Connect your AI to live market data"
                    to="/rule-engine-and-analysis"
                    badge="Coming soon"
                  />
                  <NavFeatureItem icon={Users} title="Tranding" desc="Trade like a pro, without being one" to="/tranding" />
                  <NavFeatureItem icon={Copy} title="Copy Bot" desc="Copy an experienced trader one-on-one" />
                  <NavFeatureItem icon={TrendingDown} title="Trailing Orders" desc="Better buys & sells, the easy way" />
                  <NavFeatureItem icon={CalendarDays} title="DCA" desc="Don't worry buying at the right moment" />
                  <NavFeatureItem icon={Briefcase} title="Portfolio Bot" desc="Portfolio Bot" />
                </ul>
              </div>

              <div>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Professional
                </p>
                <ul>
                  <NavFeatureItem icon={FileText} title="Paper Trading" desc="Gain experience without risk of losses" />
                  <NavFeatureItem icon={BarChart2} title="Backtesting" desc="See how you would've performed" />
                  <NavFeatureItem icon={Settings2} title="Strategy Designer" desc="Easily create your Trading Algorithms" />
                  <NavFeatureItem icon={Brain} title="AI Trading" desc="Let your bot learn and decide by itself" />
                  <NavFeatureItem icon={Wrench} title="Pro Tools" desc="Leverage market inefficiencies or liquidity" />
                </ul>
              </div>

              <div>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">More</p>
                <ul>
                  <NavFeatureItem
                    icon={Monitor}
                    title="Trading"
                    desc="Manage your complete portfolio from one place"
                    to="/trading"
                  />
                  <NavFeatureItem
                    icon={Store}
                    title="Marketplace"
                    desc="Rules, templates, and strategies from creators"
                    to="/marketplace"
                  />
                  <NavFeatureItem icon={RefreshCw} title="Exchanges" desc="Connect the world's top exchanges" />
                  <NavFeatureItem icon={Trophy} title="Tournaments" desc="Show your skills and win prizes with trading" />
                  <NavFeatureItem icon={LayoutGrid} title="All Features" desc="An overview of these features and more" />
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerCls}>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-64 p-3">
              <NavSimpleItem title="For Individuals" desc="Personal crypto portfolio management" />
              <NavSimpleItem title="For Institutions" desc="Enterprise-grade trading solutions" />
              <NavSimpleItem title="API Access" desc="Integrate FinMom into your workflow" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/pricing" className={linkCls}>
              Pricing
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/marketplace" className={linkCls}>
              Marketplace
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerCls}>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-64 p-3">
              <NavSimpleItem title="Documentation" desc="Guides, tutorials, and API reference" />
              <NavSimpleItem title="Blog" desc="Market insights and product updates" />
              <NavSimpleItem title="Community" desc="Join traders from around the world" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerCls}>Company</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-64 p-3">
              <NavSimpleItem title="About Us" desc="Our mission and team" to="/about" />
              <NavSimpleItem title="Careers" desc="Join the FinMom team" />
              <NavSimpleItem title="Contact" desc="Get in touch with us" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full border-border/60 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[min(100vw-2rem,22rem)] flex-col gap-0 overflow-y-auto p-4 pt-10">
        <SheetHeader className="mb-2 text-left">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="features" className="border-border/60">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">Features</AccordionTrigger>
            <AccordionContent className="pb-4 pt-0">
              <div className="flex flex-col gap-4 rounded-lg border border-border/40 bg-muted/20 px-2 py-3">
                <div>
                  <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Easy</p>
                  <div className="flex flex-col gap-0.5">
                    <MobileFeatureRow
                      icon={Shield}
                      title="Rule Engine & Analysis"
                      desc="Connect your AI to live market data"
                      to="/rule-engine-and-analysis"
                      badge="Coming soon"
                    />
                    <MobileFeatureRow icon={Users} title="Tranding" desc="Trade like a pro, without being one" to="/tranding" />
                    <MobileFeatureRow icon={Copy} title="Copy Bot" desc="Copy an experienced trader one-on-one" />
                    <MobileFeatureRow icon={TrendingDown} title="Trailing Orders" desc="Better buys & sells, the easy way" />
                    <MobileFeatureRow icon={CalendarDays} title="DCA" desc="Don't worry buying at the right moment" />
                    <MobileFeatureRow icon={Briefcase} title="Portfolio Bot" desc="Portfolio Bot" />
                  </div>
                </div>
                <div>
                  <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Professional
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <MobileFeatureRow icon={FileText} title="Paper Trading" desc="Gain experience without risk of losses" />
                    <MobileFeatureRow icon={BarChart2} title="Backtesting" desc="See how you would've performed" />
                    <MobileFeatureRow icon={Settings2} title="Strategy Designer" desc="Easily create your Trading Algorithms" />
                    <MobileFeatureRow icon={Brain} title="AI Trading" desc="Let your bot learn and decide by itself" />
                    <MobileFeatureRow icon={Wrench} title="Pro Tools" desc="Leverage market inefficiencies or liquidity" />
                  </div>
                </div>
                <div>
                  <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">More</p>
                  <div className="flex flex-col gap-0.5">
                    <MobileFeatureRow
                      icon={Monitor}
                      title="Trading"
                      desc="Manage your complete portfolio from one place"
                      to="/trading"
                    />
                    <MobileFeatureRow
                      icon={Store}
                      title="Marketplace"
                      desc="Rules, templates, and strategies from creators"
                      to="/marketplace"
                    />
                    <MobileFeatureRow icon={RefreshCw} title="Exchanges" desc="Connect the world's top exchanges" />
                    <MobileFeatureRow icon={Trophy} title="Tournaments" desc="Show your skills and win prizes with trading" />
                    <MobileFeatureRow icon={LayoutGrid} title="All Features" desc="An overview of these features and more" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="solutions" className="border-border/60">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">Solutions</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-0.5 pb-4">
              <MobileSimpleRow title="For Individuals" desc="Personal crypto portfolio management" />
              <MobileSimpleRow title="For Institutions" desc="Enterprise-grade trading solutions" />
              <MobileSimpleRow title="API Access" desc="Integrate FinMom into your workflow" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-0.5 border-b border-border/50 py-2">
          <SheetClose asChild>
            <Link to="/pricing" className="rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted/55">
              Pricing
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/marketplace" className="rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted/55">
              Marketplace
            </Link>
          </SheetClose>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="learn" className="border-border/60">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">Learn</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-0.5 pb-4">
              <MobileSimpleRow title="Documentation" desc="Guides, tutorials, and API reference" />
              <MobileSimpleRow title="Blog" desc="Market insights and product updates" />
              <MobileSimpleRow title="Community" desc="Join traders from around the world" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="company" className="border-border/60 border-b-0">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">Company</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-0.5 pb-4">
              <MobileSimpleRow title="About Us" desc="Our mission and team" to="/about" />
              <MobileSimpleRow title="Careers" desc="Join the FinMom team" />
              <MobileSimpleRow title="Contact" desc="Get in touch with us" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}

export type MainHeaderProps = {
  rightSlot?: React.ReactNode;
  loginHref?: string;
};

export function MainHeader({ rightSlot, loginHref = "/login" }: MainHeaderProps) {
  const navigate = useNavigate();

  const defaultActions = (
    <>
      <MobileNavSheet />
      <Button type="button" className="rounded-full px-5 text-sm sm:px-6" onClick={() => navigate(loginHref)}>
        Login
      </Button>
    </>
  );

  const actions = rightSlot ?? defaultActions;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl items-center gap-x-4 gap-y-2 px-4 py-3 sm:gap-x-6 sm:px-8 sm:py-4",
          "grid-cols-[minmax(0,1fr)_auto]",
          "lg:grid-cols-[auto_1fr_auto]",
        )}
      >
        <BrandLogoLink className="min-w-0 shrink-0" />

        <nav aria-label="Main" className="col-span-full hidden min-w-0 justify-center lg:col-span-1 lg:flex">
          <DesktopMainNav />
        </nav>

        <div
          className={cn(
            "col-start-2 row-start-1 flex min-w-0 items-center justify-end gap-2 justify-self-end",
            "lg:col-start-3",
          )}
        >
          {actions}
        </div>
      </div>
    </header>
  );
}
