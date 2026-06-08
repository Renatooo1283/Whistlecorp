import { Card } from "@/components/ui/Card";
import { IconWrapper } from "@/components/ui/IconWrapper";
import { FeatureList } from "@/components/ui/FeatureList";
import { LinkCard } from "@/components/ui/LinkCard";
import type { SolutionSummary } from "@/lib/content/home";

type Props = {
  service: SolutionSummary;
  ctaLabel?: string;
};

export function ServiceCard({ service, ctaLabel = "Conocer más" }: Props) {
  return (
    <Card hover className="flex h-full flex-col">
      <IconWrapper icon={service.icon} variant="accent" size="lg" />
      <h3 className="mt-5 text-xl font-semibold text-[var(--color-text-strong)]">
        {service.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]">
        {service.description}
      </p>
      <FeatureList items={service.bullets} className="mt-5" />
      <div className="mt-auto pt-6">
        <LinkCard href={service.href}>{ctaLabel}</LinkCard>
      </div>
    </Card>
  );
}
