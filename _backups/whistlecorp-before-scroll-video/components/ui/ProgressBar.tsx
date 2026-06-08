import { cn } from "@/lib/utils";

type Props = {
  current: number;
  total: number;
  className?: string;
};

export function ProgressBar({ current, total, className }: Props) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-[var(--color-text)]">
        <span>
          Paso {current} de {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
