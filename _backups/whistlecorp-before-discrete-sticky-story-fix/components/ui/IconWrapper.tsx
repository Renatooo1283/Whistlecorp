import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "accent" | "ink" | "soft";
type Size = "sm" | "md" | "lg";

type Props = {
  icon: LucideIcon;
  variant?: Variant;
  size?: Size;
  className?: string;
};

const variants: Record<Variant, string> = {
  accent:
    "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
  ink: "bg-[var(--color-ink)]/5 text-[var(--color-ink)]",
  soft: "bg-[var(--color-bg-alt)] text-[var(--color-ink-soft)]",
};

const sizes: Record<Size, { wrap: string; icon: string }> = {
  sm: { wrap: "h-9 w-9 rounded-lg", icon: "h-4 w-4" },
  md: { wrap: "h-11 w-11 rounded-xl", icon: "h-5 w-5" },
  lg: { wrap: "h-14 w-14 rounded-2xl", icon: "h-6 w-6" },
};

export function IconWrapper({
  icon: Icon,
  variant = "accent",
  size = "md",
  className,
}: Props) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        s.wrap,
        variants[variant],
        className
      )}
    >
      <Icon className={s.icon} aria-hidden />
    </span>
  );
}
