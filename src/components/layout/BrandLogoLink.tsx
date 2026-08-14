import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { FinMomWordmark } from "@/components/layout/FinMomWordmark";

/** Same logo block as the main landing header: icon + FinMom wordmark. */
export function BrandLogoLink({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link to="/" className={cn("story-link flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
        <TrendingUp className="h-5 w-5 text-primary" />
      </span>
      <FinMomWordmark />
      {children}
    </Link>
  );
}
