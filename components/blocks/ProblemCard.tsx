import { Card } from "@/components/ui/Card";
import { IconWrapper } from "@/components/ui/IconWrapper";
import type { Problem } from "@/lib/content/home";

export function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Card className="h-full">
      <IconWrapper icon={problem.icon} variant="soft" size="md" />
      <p className="mt-4 text-base font-medium leading-relaxed text-[var(--color-text-strong)]">
        {problem.title}
      </p>
    </Card>
  );
}
