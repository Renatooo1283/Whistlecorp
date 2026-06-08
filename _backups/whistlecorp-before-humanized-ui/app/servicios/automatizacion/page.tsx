import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetailLayout } from "@/components/blocks/ServiceDetailLayout";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceDetails } from "@/lib/content/services";

const service = serviceDetails["automatizacion"];

export const metadata: Metadata = buildMetadata({
  title: "Automatización de procesos empresariales | WhistleCorp",
  rawTitle: true,
  description:
    "Automatizamos formularios, notificaciones, reportes y flujos de trabajo conectando herramientas como WhatsApp, Google Sheets, Supabase, Make y n8n.",
  path: "/servicios/automatizacion",
});

const antes = [
  "Mensajes perdidos en WhatsApp.",
  "Datos copiados manualmente entre herramientas.",
  "Reportes hechos a mano.",
  "Solicitudes sin seguimiento claro.",
];

const despues = [
  "Formularios inteligentes.",
  "Base de datos centralizada.",
  "Notificaciones automáticas.",
  "Trazabilidad por estado y responsable.",
];

export default function Page() {
  return (
    <ServiceDetailLayout service={service}>
      <Section tone="default">
        <SectionHeading
          eyebrow="Antes vs Después"
          title="Cómo cambia la operación cuando los procesos están automatizados."
          subtitle="Pequeños cambios que se traducen en menos tareas manuales, menos errores y mayor control operativo."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600"
              >
                <X className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
                Antes
              </h3>
            </div>
            <ul className="mt-6 space-y-3">
              {antes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text)]"
                >
                  <X
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-white p-6 shadow-[0_12px_32px_rgba(11,27,43,0.06)] sm:p-8">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
              >
                <Check className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
                Después
              </h3>
            </div>
            <ul className="mt-6 space-y-3">
              {despues.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text)]"
                >
                  <Check
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </ServiceDetailLayout>
  );
}
