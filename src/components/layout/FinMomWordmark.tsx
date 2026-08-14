import { cn } from "@/lib/utils";

/** Header wordmark: explicit Fin (foreground) + Mom (primary) so it matches across pages and renders in Onest with the rest of the UI. */
export function FinMomWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-lg font-bold leading-none tracking-tight", className)}>
      <span className="text-foreground">Fin</span>
      <span className="text-primary">Mom</span>
    </span>
  );
}
