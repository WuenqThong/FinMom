import { type FormEvent, type ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Instagram, Facebook, Mail, Twitter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { exploreMarketplaceHref } from "@/lib/marketplacePaths";

import finmomLogo from "@/assets/finmom-logo.png";

const footerHeading = "text-[11px] font-semibold uppercase tracking-[0.1em] text-white";

function FooterNavLink({ to, children, external }: { to: string; children: ReactNode; external?: boolean }) {
  const cls =
    "text-sm text-[color:var(--mkt-footer-link)] transition-colors hover:text-[color:var(--mkt-mint)] focus-visible:outline-none focus-visible:underline";
  if (external) {
    return (
      <a href={to} className={cls} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  const slug = title.replace(/\s+/g, "-").toLowerCase();
  return (
    <nav className="min-w-0" aria-labelledby={`footer-col-${slug}`}>
      <p id={`footer-col-${slug}`} className={footerHeading}>
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-3">{children}</ul>
    </nav>
  );
}

export function LandingFooter({ className }: { className?: string }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const exploreHref = exploreMarketplaceHref();

  const onNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Add your email",
        description: "Enter a work email and we’ll keep you posted.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "You’re subscribed",
      description: "Thanks — FinMom product updates land in preview first.",
    });
    setEmail("");
  };

  const socialBase =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[color:var(--mkt-footer-link)] transition-colors hover:border-[color:var(--mkt-mint)]/50 hover:text-[color:var(--mkt-mint)]";

  return (
    <footer
      className={cn(
        "border-t border-white/[0.08] bg-[#050a14] text-[#e8fdf9] [--mkt-footer-link:#b9e9e1] [--mkt-footer-muted:#8fb8b2] [--mkt-mint:#14f1c8]",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="inline-flex max-w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--mkt-mint)]/55"
              aria-label="FinMom home"
            >
              <img
                src={finmomLogo}
                alt="FinMom"
                width={200}
                height={40}
                className="h-8 w-auto max-w-[min(100%,200px)] object-contain object-left sm:h-9 md:h-10"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="mt-5 max-w-[18rem] text-sm leading-relaxed italic text-[color:var(--mkt-footer-muted)]">
              Subscribe for release notes and desk tooling roundups — no clutter.
            </p>
            <form onSubmit={onNewsletterSubmit} className="mt-6 max-w-[22rem]" noValidate>
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="relative flex min-h-[52px] rounded-full border-2 border-white/18 bg-black/35 py-1 pr-1.5 backdrop-blur-sm focus-within:border-[color:var(--mkt-mint)]/45 focus-within:ring-2 focus-within:ring-[color:var(--mkt-mint)]/20">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65" aria-hidden />
                <Input
                  id="footer-newsletter-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 min-h-[48px] flex-1 rounded-full border-0 bg-transparent pl-11 pr-3 text-sm text-white shadow-none placeholder:text-white/65 focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="my-0.5 shrink-0 rounded-full bg-[color:var(--mkt-mint)] px-5 text-[13px] font-semibold text-[#061722] hover:bg-[#12dfc0]"
                >
                  Join
                </Button>
              </div>
            </form>
          </div>

          <div className="grid gap-10 sm:col-span-1 sm:grid-cols-3 md:col-span-1 lg:col-span-8 lg:grid-cols-3">
            <FooterColumn title="Product">
              <li>
                <FooterNavLink to="/marketplace">Marketplace</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/marketplace#featured">Featured</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/marketplace#trending">Trending</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/pricing">Pricing</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to={exploreHref}>Workspace</FooterNavLink>
              </li>
            </FooterColumn>

            <FooterColumn title="Company">
              <li>
                <FooterNavLink to="/about">About us</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/how-it-works">How it works</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/faq">FAQ &amp; support</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/trading">Trading terminal</FooterNavLink>
              </li>
            </FooterColumn>

            <FooterColumn title="Account">
              <li>
                <FooterNavLink to="/rule-engine-and-analysis">Rule engine</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/register">Register</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/login">Log in</FooterNavLink>
              </li>
              <li>
                <FooterNavLink to="/">Home</FooterNavLink>
              </li>
            </FooterColumn>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08] bg-black/25">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-8 sm:flex-row sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com" className={socialBase} aria-label="Instagram" target="_blank" rel="noreferrer noopener">
              <Instagram className="h-[18px] w-[18px]" />
            </a>
            <a href="https://www.linkedin.com" className={socialBase} aria-label="LinkedIn" target="_blank" rel="noreferrer noopener">
              <Linkedin className="h-[18px] w-[18px]" />
            </a>
            <a href="https://www.facebook.com" className={socialBase} aria-label="Facebook" target="_blank" rel="noreferrer noopener">
              <Facebook className="h-[18px] w-[18px]" />
            </a>
            <a href="https://twitter.com" className={socialBase} aria-label="X (Twitter)" target="_blank" rel="noreferrer noopener">
              <Twitter className="h-[18px] w-[18px]" />
            </a>
          </div>
          <p className="max-w-xl text-center text-[12px] leading-relaxed text-[color:var(--mkt-footer-muted)] sm:text-right">
            FinMom · Demo &amp; sandbox data · Not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
