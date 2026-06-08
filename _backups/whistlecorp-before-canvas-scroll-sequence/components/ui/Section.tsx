import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "default" | "alt" | "ink";

type Props = {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
};

const toneStyles: Record<Tone, string> = {
  default: "bg-white",
  alt: "bg-[var(--color-bg-alt)]",
  ink: "bg-[var(--color-ink)] text-white",
};

export function Section({
  id,
  tone = "default",
  className,
  containerClassName,
  children,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        toneStyles[tone],
        className
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
