import { IconWrapper } from "@/components/ui/IconWrapper";
import type { ProcessStep } from "@/lib/content/home";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_24px_rgba(11,27,43,0.04)]"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[var(--color-ink)] text-xs font-bold text-white">
              {i + 1}
            </span>
            <IconWrapper icon={step.icon} variant="accent" size="sm" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[var(--color-text-strong)]">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
