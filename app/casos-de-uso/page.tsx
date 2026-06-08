import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { UseCaseCard } from "@/components/blocks/UseCaseCard";
import { UseCaseGroupAnimated } from "@/components/blocks/UseCaseGroupAnimated";
import { CTASection } from "@/components/blocks/CTASection";
import { useCasesPage } from "@/lib/content/use-cases";

export const metadata: Metadata = buildMetadata({
  title: "Casos de uso de software y automatización | WhistleCorp",
  rawTitle: true,
  description:
    "Explora ejemplos de formularios inteligentes, dashboards, portales de clientes, automatización de reportes e integración entre sistemas.",
  path: "/casos-de-uso",
});

export default function CasosDeUsoPage() {
  return (
    <>
      <PageHeader
        eyebrow={useCasesPage.eyebrow}
        title={useCasesPage.title}
        subtitle={useCasesPage.subtitle}
        backgroundImage={{
          src: "/imagenes/casos-de-uso.jpg",
          alt: "",
        }}
      />

      <Section tone="default">
        <div className="space-y-20 sm:space-y-24">
          {useCasesPage.groups.map((group) => (
            <UseCaseGroupAnimated
              key={group.title}
              eyebrow={group.eyebrow}
              title={group.title}
              description={group.description}
            >
              {group.items.map((item) => (
                <UseCaseCard key={item.title} item={item} />
              ))}
            </UseCaseGroupAnimated>
          ))}
        </div>
      </Section>

      <CTASection
        title={useCasesPage.ctaTitle}
        subtitle={useCasesPage.ctaSubtitle}
        primary={{ label: "Solicitar diagnóstico", href: "/contacto" }}
      />
    </>
  );
}
