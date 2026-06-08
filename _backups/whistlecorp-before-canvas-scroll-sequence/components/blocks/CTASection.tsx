import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

type Props = {
  title: string;
  subtitle?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "ink" | "alt";
};

export function CTASection({
  title,
  subtitle,
  primary,
  secondary,
  tone = "ink",
}: Props) {
  const isInk = tone === "ink";
  return (
    <Section tone={isInk ? "ink" : "alt"}>
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className={`text-3xl font-bold leading-tight sm:text-4xl ${
            isInk ? "text-white" : "text-[var(--color-text-strong)]"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-4 text-base leading-relaxed sm:text-lg ${
              isInk ? "text-white/80" : "text-[var(--color-text)]"
            }`}
          >
            {subtitle}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={primary.href} variant="primary" size="lg">
            {primary.label}
          </Button>
          {secondary && (
            <Button
              href={secondary.href}
              variant={isInk ? "outline" : "secondary"}
              size="lg"
            >
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
