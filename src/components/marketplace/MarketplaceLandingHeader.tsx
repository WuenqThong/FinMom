import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandLogoLink } from "@/components/layout/BrandLogoLink";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { exploreMarketplaceHref } from "@/lib/marketplacePaths";

export function MarketplaceLandingHeader() {
  const explore = exploreMarketplaceHref();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <BrandLogoLink className="min-w-0 gap-2.5">
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Marketplace</span>
        </BrandLogoLink>

        <div className="hidden flex-1 items-center justify-end gap-2 sm:flex">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-xs">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full border-border/60 text-xs">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full text-xs">
            <Link to="/register">Sign up</Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="rounded-full text-xs">
            <Link to={explore}>Explore</Link>
          </Button>
        </div>

        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full border-border/60"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="flex w-[min(100vw-2rem,20rem)] flex-col gap-3 p-4 pt-10">
            <SheetHeader className="text-left">
              <SheetTitle>Marketplace</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 border-t border-border/50 pt-3" aria-label="Marketplace menu">
              <SheetClose asChild>
                <Link to="/" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/55">
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/55">
                  Log in
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/register" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/55">
                  Sign up
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to={explore} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/55">
                  Explore marketplace
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
