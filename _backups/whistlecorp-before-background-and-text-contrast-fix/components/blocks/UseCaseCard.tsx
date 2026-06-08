import { Card } from "@/components/ui/Card";
import { IconWrapper } from "@/components/ui/IconWrapper";
import type { UseCase } from "@/lib/content/use-cases";

export function UseCaseCard({ item }: { item: UseCase }) {
  return (
    <Card hover className="flex h-full flex-col">
      <IconWrapper icon={item.icon} variant="accent" size="lg" />
      <h3 className="mt-5 text-lg font-semibold text-[var(--color-text-strong)]">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]">
        {item.description}
      </p>
      <div className="mt-5 rounded-lg bg-[var(--color-bg-alt)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#86EFAC]">
          Incluye
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-strong)]">
          {item.includes}
        </p>
      </div>
    </Card>
  );
}
