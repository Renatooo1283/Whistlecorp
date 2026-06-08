import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "outline";

type Props = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

const variants: Record<Variant, string> = {
  default: "bg-[var(--color-bg-alt)] text-[var(--color-text-strong)]",
  accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
  outline:
    "bg-transparent border border-[var(--color-border)] text-[var(--color-text)]",
};

export function Badge({ variant = "default", className, children }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
