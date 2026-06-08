import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function Card({ className, hover = false, ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_24px_rgba(11,27,43,0.06)]",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,27,43,0.10)] hover:border-[var(--color-ink)]/20",
        className
      )}
      {...rest}
    />
  );
}
