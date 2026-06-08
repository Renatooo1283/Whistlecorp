import { Container } from "@/components/ui/Container";

type Props = {
  title: string;
  items: string[];
};

export function TrustStrip({ title, items }: Props) {
  return (
    <div className="border-y border-[var(--color-border)] bg-white py-10">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">
          {title}
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-[var(--color-ink-soft)]">
          {items.map((item) => (
            <li key={item} className="opacity-80">
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
