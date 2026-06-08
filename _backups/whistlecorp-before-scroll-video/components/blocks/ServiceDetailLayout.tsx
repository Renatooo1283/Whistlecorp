import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FeatureList } from "@/components/ui/FeatureList";
import { CTASection } from "./CTASection";
import type { ServiceDetail } from "@/lib/content/services";

export function ServiceDetailLayout({
  service,
  children,
  mediaSlot,
  headerBackground,
}: {
  service: ServiceDetail;
  children?: React.ReactNode;
  /** If provided, replaces the default service image with a custom node (animation, video, etc.). */
  mediaSlot?: React.ReactNode;
  /** Optional background image for the PageHeader banner. */
  headerBackground?: { src: string; alt: string };
}) {
  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        title={service.title}
        subtitle={service.subtitle}
        crumbs={[
          { label: "Servicios", href: "/servicios" },
          { label: service.breadcrumbLabel },
        ]}
        backgroundImage={headerBackground}
      >
        <Button href="/contacto" variant="primary" size="lg">
          Solicitar diagnóstico
        </Button>
      </PageHeader>

      <Section tone="default">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Para qué sirve
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--color-text-strong)] sm:text-3xl">
                {service.whatWeDoTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text)]">
                {service.forWhat}
              </p>

              <FeatureList items={service.whatWeDo} className="mt-8" />

              {service.tools && service.toolsTitle && (
                <div className="mt-10">
                  <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                    {service.toolsTitle}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.tools.map((tool) => (
                      <Badge key={tool} variant="outline">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] shadow-[0_12px_32px_rgba(11,27,43,0.10)]">
              {mediaSlot ? (
                mediaSlot
              ) : (
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="alt">
        <Container className="!px-0">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {service.howTitle}
            </p>
            <p className="mt-4 text-xl leading-relaxed text-[var(--color-text-strong)] sm:text-2xl">
              {service.how}
            </p>
          </div>
        </Container>
      </Section>

      {children}

      <CTASection
        title="¿Listo para conversar sobre tu caso?"
        subtitle="Te respondemos en menos de 24 horas con una primera orientación basada en lo que nos cuentes."
        primary={{ label: "Solicitar diagnóstico", href: "/contacto" }}
        secondary={{ label: "Ver otros servicios", href: "/servicios" }}
      />
    </>
  );
}
