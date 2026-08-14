import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrustSection({
  items,
  className,
}: {
  items: { title: string; body: string }[];
  className?: string;
}) {
  return (
    <section className={cn("", className)} aria-labelledby="trust-heading">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
          <Shield className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <h2 id="trust-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
          Trust &amp; safety
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A research-first marketplace — clear risk labels, structured reviews, and sandbox previews.
        </p>
      </div>
      <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.title} className="glass-panel rounded-2xl border border-border/50 p-4">
            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
