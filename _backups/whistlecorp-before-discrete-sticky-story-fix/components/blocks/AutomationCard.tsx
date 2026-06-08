import { Card } from "@/components/ui/Card";
import { IconWrapper } from "@/components/ui/IconWrapper";
import type { Automation } from "@/lib/content/home";

export function AutomationCard({ item }: { item: Automation }) {
  return (
    <Card hover className="h-full">
      <IconWrapper icon={item.icon} variant="accent" size="md" />
      <h3 className="mt-4 text-base font-semibold text-[var(--color-text-strong)]">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">
        {item.description}
      </p>
    </Card>
  );
}
