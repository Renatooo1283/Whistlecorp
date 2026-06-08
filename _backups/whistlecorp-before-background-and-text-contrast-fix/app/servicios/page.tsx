import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/blocks/ServiceCard";
import { CTASection } from "@/components/blocks/CTASection";
import { servicesIndex } from "@/lib/content/services";

export const metadata: Metadata = buildMetadata({
  title: "Servicios tecnológicos para empresas | WhistleCorp",
  rawTitle: true,
  description:
    "Soluciones de desarrollo de software, automatización de procesos, consultoría tecnológica e infraestructura cloud para empresas que buscan operar con más control.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        eyebrow={servicesIndex.eyebrow}
        title={servicesIndex.title}
        subtitle={servicesIndex.subtitle}
        backgroundImage={{
          src: "/imagenes/propiedad-intelectual-software.jpg",
          alt: "",
        }}
      />

      <Section tone="default">
        <div className="grid gap-6 md:grid-cols-2">
          {servicesIndex.items.map((s) => (
            <ServiceCard key={s.slug} service={s} ctaLabel="Conocer más" />
          ))}
        </div>
      </Section>

      <CTASection
        title={servicesIndex.closingTitle}
        subtitle={servicesIndex.closingSubtitle}
        primary={{ label: "Solicitar diagnóstico", href: "/contacto" }}
      />
    </>
  );
}
