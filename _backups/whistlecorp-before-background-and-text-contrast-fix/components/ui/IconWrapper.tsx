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
    "bg-[var(--color-accent)]/15 text-[#86EFAC] ring-1 ring-inset ring-[var(--color-accent)]/25",
  ink: "bg-white/[0.06] text-white ring-1 ring-inset ring-white/15",
  soft: "bg-white/[0.04] text-white/85 ring-1 ring-inset ring-white/10",
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
