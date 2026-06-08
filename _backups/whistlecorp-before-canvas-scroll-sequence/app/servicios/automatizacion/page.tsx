import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetailLayout } from "@/components/blocks/ServiceDetailLayout";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { serviceDetails } from "@/lib/content/services";

const service = serviceDetails["automatizacion"];

export const metadata: Metadata = buildMetadata({
  title: "Automatización de procesos empresariales | WhistleCorp",
  rawTitle: true,
  description:
    "Automatizamos formularios, notificaciones, reportes y flujos de trabajo conectando herramientas como WhatsApp, Google Sheets, Supabase, Make y n8n.",
  path: "/servicios/automatizacion",
});

const flujoActual = [
  "Un cliente escribe por WhatsApp.",
  "Alguien copia sus datos en un Excel.",
  "Otro envía un correo al área correspondiente.",
  "Después, nadie sabe en qué estado quedó.",
];

const flujoAutomatizado = [
  "El cliente llena un formulario con validación.",
  "Sus datos entran directo a una base centralizada.",
  "El responsable recibe una notificación automática.",
  "Cada solicitud queda con estado, fecha y responsable.",
];

export default function Page() {
  return (
    <ServiceDetailLayout service={service}>
      {/* Flow narrativo — antes/después como historia, no como tabla */}
      <Section tone="default">
        <Container className="!px-0">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-hover)]">
              Un ejemplo concreto
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--color-text-strong)] sm:text-[2.25rem]">
              Así se ve un flujo manual antes de automatizarse.
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Antes */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
                Hoy
              </p>
              <ol className="mt-4 space-y-3">
                {flujoActual.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-baseline gap-4 border-l-2 border-[var(--color-border)] pl-5"
                  >
                    <span className="font-mono text-xs font-medium text-[var(--color-text)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="py-1 text-sm leading-relaxed text-[var(--color-text-strong)] sm:text-base">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Después */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-hover)]">
                Automatizado
              </p>
              <ol className="mt-4 space-y-3">
                {flujoAutomatizado.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-baseline gap-4 border-l-2 border-[var(--color-accent)] pl-5"
                  >
                    <span className="font-mono text-xs font-medium text-[var(--color-accent-hover)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="py-1 text-sm leading-relaxed text-[var(--color-text-strong)] sm:text-base">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Closer */}
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.04] p-6 sm:p-8">
            <p className="flex items-start gap-3 text-base leading-relaxed text-[var(--color-text-strong)] sm:text-lg">
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]"
                strokeWidth={2}
              />
              <span>
                El mismo flujo, conectado, libera al equipo y deja registro de
                cada paso. <span className="text-[var(--color-accent-hover)] font-semibold">No hay magia: solo orden.</span>
              </span>
            </p>
            <a
              href="/contacto"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-hover)] hover:text-[var(--color-accent)]"
            >
              Conversemos sobre tu flujo
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Container>
      </Section>
    </ServiceDetailLayout>
  );
}
