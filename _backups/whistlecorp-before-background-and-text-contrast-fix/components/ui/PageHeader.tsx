import Image from "next/image";
import { Container } from "./Container";
import { Breadcrumbs } from "./Breadcrumbs";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  /** Optional background image (served from /public). Overlay is applied to preserve text contrast. */
  backgroundImage?: { src: string; alt: string };
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
  children,
  backgroundImage,
}: Props) {
  return (
    <header className="relative overflow-hidden bg-[var(--color-ink)] text-white">
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Tinted overlay for readability — navy + accent edges */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, rgba(11,27,43,0.88) 0%, rgba(11,27,43,0.72) 55%, rgba(30,58,95,0.62) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 8%, rgba(22,163,74,0.20), transparent 40%), radial-gradient(circle at 90% 95%, rgba(30,58,95,0.45), transparent 55%)",
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(22,163,74,0.18), transparent 40%), radial-gradient(circle at 80% 100%, rgba(30,58,95,0.6), transparent 50%)",
          }}
        />
      )}
      <Container className="relative py-16 sm:py-20 lg:py-24">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-6" />}
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}
