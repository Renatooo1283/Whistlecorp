import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LinkCard } from "@/components/ui/LinkCard";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { ProblemCard } from "@/components/blocks/ProblemCard";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { AutomationCard } from "@/components/blocks/AutomationCard";
import { LottieAnimation } from "@/components/blocks/LottieAnimation";
import {
  hero,
  trustStrip,
  problems,
  solutions,
  philosophy,
  automations,
} from "@/lib/content/home";

export const metadata: Metadata = buildMetadata({
  title: "WhistleCorp | Software, automatización y cloud para empresas",
  description:
    "Desarrollamos software a medida, automatizamos procesos empresariales y fortalecemos infraestructura tecnológica para empresas en Ecuador y Latinoamérica.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 10%, rgba(22,163,74,0.18), transparent 35%), radial-gradient(circle at 85% 90%, rgba(30,58,95,0.7), transparent 55%)",
          }}
        />
        <Container className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {hero.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3.25rem]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href} variant="primary" size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="outline"
                size="lg"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
            <p className="mt-4 text-xs text-white/60">{hero.microcopy}</p>
          </div>

          <div className="relative lg:translate-x-4">
            <LottieAnimation
              src="/animations/programming.json"
              ariaLabel="Ilustración de equipo desarrollando soluciones digitales"
              className="aspect-square w-full"
            />
          </div>
        </Container>
      </section>

      <TrustStrip title={trustStrip.title} items={trustStrip.items} />

      {/* Problemas */}
      <Section tone="alt">
        <SectionHeading
          eyebrow="Problemas que resolvemos"
          title={problems.title}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.items.map((p) => (
            <ProblemCard key={p.title} problem={p} />
          ))}
        </div>
      </Section>

      {/* Soluciones */}
      <Section tone="default">
        <SectionHeading eyebrow={solutions.eyebrow} title={solutions.title} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {solutions.items.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </Section>

      {/* Filosofía */}
      <Section tone="alt">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {philosophy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--color-text-strong)] sm:text-4xl">
              {philosophy.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-text)]">
              {philosophy.body}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-text)]">
              {philosophy.body2}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {philosophy.pillars.map((p) => (
              <li
                key={p.label}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[0_4px_12px_rgba(11,27,43,0.04)]"
              >
                <p className="text-sm font-semibold text-[var(--color-accent-hover)]">
                  {p.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text)]">
                  {p.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Automatizaciones */}
      <Section tone="default">
        <SectionHeading
          eyebrow="Automatizaciones destacadas"
          title={automations.title}
          subtitle={automations.subtitle}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {automations.items.map((a) => (
            <AutomationCard key={a.title} item={a} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <LinkCard href={automations.cta.href}>
            {automations.cta.label}
          </LinkCard>
        </div>
      </Section>

    </>
  );
}
