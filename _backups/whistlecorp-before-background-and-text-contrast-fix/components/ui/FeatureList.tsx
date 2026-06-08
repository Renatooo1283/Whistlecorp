import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  items: string[];
  className?: string;
  tone?: "light" | "dark";
};

export function FeatureList({ items, className, tone = "light" }: Props) {
  const isDark = tone === "dark";
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
            )}
          >
            <Check className="h-3 w-3" aria-hidden />
          </span>
          <span
            className={cn(
              "text-sm leading-relaxed sm:text-base",
              isDark ? "text-white/85" : "text-[var(--color-text)]"
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
