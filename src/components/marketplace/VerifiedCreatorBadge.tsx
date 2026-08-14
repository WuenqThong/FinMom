import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedCreatorBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary",
        className,
      )}
      title="Verified creator"
    >
      <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Verified
    </span>
  );
}
