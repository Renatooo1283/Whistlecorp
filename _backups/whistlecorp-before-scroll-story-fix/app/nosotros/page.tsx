import Image from "next/image";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { IconWrapper } from "@/components/ui/IconWrapper";
import { CTASection } from "@/components/blocks/CTASection";
import { aboutPage } from "@/lib/content/about";

export const metadata: Metadata = buildMetadata({
  title: "Sobre WhistleCorp | Equipo técnico y consultoría tecnológica",
  rawTitle: true,
  description:
    "Somos un equipo técnico que entiende de negocio y acompaña a empresas en desarrollo de software, automatización, infraestructura y consultoría tecnológica.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <>
      <PageHeader
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        subtitle={aboutPage.subtitle}
        backgroundImage={{
          src: "/imagenes/equipo.avif",
          alt: "",
        }}
      />

      {/* Diferenciadores */}
      <Section tone="default">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          {aboutPage.differentiatorsTitle}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {aboutPage.differentiators.map((d) => (
            <Card key={d.title} hover>
              <div className="flex items-start gap-4">
                <IconWrapper icon={d.icon} variant="accent" size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">
                    {d.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Cómo trabajamos — con imagen */}
      <Section tone="alt">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[0_12px_32px_rgba(11,27,43,0.10)]">
              <Image
                src={aboutPage.image.src}
                alt={aboutPage.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 540px, 100vw"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {aboutPage.howTitle}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[var(--color-text-strong)] sm:text-4xl">
              Una forma de trabajar pensada en avanzar con orden.
            </h2>
            <ol className="mt-8 space-y-5">
              {aboutPage.howSteps.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-base font-medium text-[var(--color-text-strong)]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <CTASection
        title={aboutPage.ctaTitle}
        primary={{ label: "Solicitar diagnóstico", href: "/contacto" }}
        secondary={{ label: "Ver servicios", href: "/servicios" }}
      />
    </>
  );
}
