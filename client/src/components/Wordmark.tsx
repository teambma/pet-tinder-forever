import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading font-bold tracking-tight text-cream select-none",
        className,
      )}
    >
      Pawspot
      <span className="text-marigold" aria-hidden="true">
        .
      </span>
    </span>
  );
}
